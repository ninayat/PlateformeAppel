import { z } from "zod";
import { NextResponse } from "next/server";
import { getAuthenticatedProfile } from "@/lib/auth";
import { sendBrevoEmail } from "@/lib/brevo";
import { supabaseAdmin } from "@/lib/supabase";

const schema = z.object({
  titre: z.string().min(3),
  description: z.string().min(10).optional(),
  type_prestation: z.enum(["elagage", "entretien", "debroussaillage", "creation"]),
  localisation: z.string().min(2),
  departement: z.string().min(2),
  budget_min: z.coerce.number().nonnegative(),
  budget_max: z.coerce.number().nonnegative(),
  date_souhaitee: z.string(),
  nb_offres_souhaitees: z.coerce.number().int().min(1).max(10).optional()
});

export async function POST(request: Request) {
  const auth = await getAuthenticatedProfile("client");
  if (auth.error) return auth.error;

  const payload = schema.parse(await request.json());

  const { data, error } = await auth.supabase
    .from("appels_offres")
    .insert({ ...payload, client_id: auth.profile.id })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // Commentaire: ciblage des pros par département via pro_profiles.
  const { data: pros } = await auth.supabase
    .from("pro_profiles")
    .select("id,profiles!inner(organisation_name)")
    .contains("departements", [payload.departement]);

  if (supabaseAdmin) {
    await Promise.all(
      (pros ?? []).map(async (pro) => {
        const { data: account } = await supabaseAdmin.auth.admin.getUserById(pro.id);
        const email = account.user?.email;
        if (!email) return;
        await sendBrevoEmail({
          to: email,
          subject: "Nouvel appel d'offre dans votre département",
          htmlContent: `<p>Nouveau AO: ${payload.titre} (${payload.departement}).</p>`
        });
      })
    );
  }

  return NextResponse.json(data);
}
