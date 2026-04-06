import { z } from "zod";
import { NextResponse } from "next/server";
import { getAuthenticatedProfile } from "@/lib/auth";
import { computeOfferScore } from "@/lib/score";
import { sendBrevoEmail } from "@/lib/brevo";
import { supabaseAdmin } from "@/lib/supabase";

const createSchema = z.object({
  ao_id: z.string().uuid(),
  prix_ht: z.coerce.number().positive(),
  delai_intervention: z.string(),
  description: z.string().min(10)
});

const selectSchema = z.object({
  ao_id: z.string().uuid(),
  offre_id: z.string().uuid()
});

export async function POST(request: Request) {
  const auth = await getAuthenticatedProfile("pro");
  if (auth.error) return auth.error;

  const payload = createSchema.parse(await request.json());

  const { data: ao } = await auth.supabase
    .from("appels_offres")
    .select("id,budget_min,budget_max,client_id,departement,statut")
    .eq("id", payload.ao_id)
    .single();

  if (!ao || ao.statut !== "ouvert") {
    return NextResponse.json({ error: "AO indisponible" }, { status: 400 });
  }

  const { data: proProfile } = await auth.supabase
    .from("pro_profiles")
    .select("note_moyenne")
    .eq("id", auth.profile.id)
    .single();

  const score = computeOfferScore({
    noteMoyenne: Number(proProfile?.note_moyenne ?? 0),
    delaiJours: Math.ceil((new Date(payload.delai_intervention).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
    prixHt: payload.prix_ht,
    budgetMin: Number(ao.budget_min ?? 0),
    budgetMax: Number(ao.budget_max ?? payload.prix_ht)
  });

  const { data, error } = await auth.supabase
    .from("offres")
    .insert({ ...payload, pro_id: auth.profile.id, score })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await auth.supabase.from("commissions").insert({ offre_id: data.id, montant: payload.prix_ht * 0.025 });

  if (supabaseAdmin && ao.client_id) {
    const { data: clientAccount } = await supabaseAdmin.auth.admin.getUserById(ao.client_id);
    const email = clientAccount.user?.email;
    if (email) {
      await sendBrevoEmail({
        to: email,
        subject: "Nouvelle offre reçue",
        htmlContent: `<p>Une nouvelle offre est arrivée pour votre AO.</p>`
      });
    }
  }

  return NextResponse.json(data);
}

export async function PATCH(request: Request) {
  const auth = await getAuthenticatedProfile("client");
  if (auth.error) return auth.error;

  const payload = selectSchema.parse(await request.json());

  const { data: ao } = await auth.supabase
    .from("appels_offres")
    .select("id,client_id")
    .eq("id", payload.ao_id)
    .single();

  if (!ao || ao.client_id !== auth.profile.id) {
    return NextResponse.json({ error: "AO introuvable" }, { status: 404 });
  }

  const { data: allOffres } = await auth.supabase.from("offres").select("id,pro_id").eq("ao_id", payload.ao_id);

  await auth.supabase.from("offres").update({ statut: "refusee" }).eq("ao_id", payload.ao_id);
  await auth.supabase.from("offres").update({ statut: "retenue" }).eq("id", payload.offre_id);
  await auth.supabase.from("appels_offres").update({ statut: "signe" }).eq("id", payload.ao_id);

  if (supabaseAdmin) {
    await Promise.all(
      (allOffres ?? []).map(async (offre) => {
        if (!offre.pro_id) return;
        const { data: account } = await supabaseAdmin.auth.admin.getUserById(offre.pro_id);
        const email = account.user?.email;
        if (!email) return;
        const selected = offre.id === payload.offre_id;
        await sendBrevoEmail({
          to: email,
          subject: selected ? "Vous avez été sélectionné" : "Résultat de consultation",
          htmlContent: selected ? "<p>Bravo, votre offre a été retenue.</p>" : "<p>Votre offre n'a pas été retenue cette fois.</p>"
        });
      })
    );
  }

  return NextResponse.json({ ok: true });
}
