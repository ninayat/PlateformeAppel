import { z } from "zod";
import { NextResponse } from "next/server";
import { getAuthenticatedProfile } from "@/lib/auth";
import { sendBrevoEmail } from "@/lib/brevo";
import { supabaseAdmin } from "@/lib/supabase";

const schema = z.object({
  ao_id: z.string().uuid(),
  receiver_id: z.string().uuid(),
  contenu: z.string().min(1)
});

export async function POST(request: Request) {
  const auth = await getAuthenticatedProfile();
  if (auth.error) return auth.error;

  const payload = schema.parse(await request.json());

  const { data, error } = await auth.supabase
    .from("messages")
    .insert({ ...payload, sender_id: auth.profile.id })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  if (supabaseAdmin) {
    const { data: account } = await supabaseAdmin.auth.admin.getUserById(payload.receiver_id);
    const email = account.user?.email;
    if (email) {
      await sendBrevoEmail({
        to: email,
        subject: "Nouveau message VertiCall",
        htmlContent: `<p>Vous avez reçu un nouveau message pour l'appel d'offre ${payload.ao_id}.</p>`
      });
    }
  }

  return NextResponse.json(data);
}
