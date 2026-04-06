import { z } from "zod";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { computeLeadHeatScore } from "@/lib/score";
import { sendBrevoEmail } from "@/lib/brevo";

const schema = z.object({
  q1: z.enum(["facile", "long", "decu", "ao-obligatoire"]),
  q2: z.enum(["1-rapide", "2-3", "3plus", "sans-devis"]),
  q3: z.enum(["trouver", "comparer", "relances", "justifier"]),
  q4: z.enum(["oui-essai", "oui-mais", "non-confiance", "non-procedure"]),
  q5: z.enum(["appel-oui", "notification", "anonyme"]),
  prenom: z.string().optional(),
  commune: z.string().optional(),
  email: z.string().email().optional(),
  telephone: z.string().optional()
});

export async function POST(request: Request) {
  const payload = schema.parse(await request.json());
  const { score, label } = computeLeadHeatScore(payload);

  if (supabaseAdmin) {
    await supabaseAdmin.from("questionnaire_reponses").insert({ ...payload, score_chaleur: score, label_chaleur: label });
  }

  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  let webhookError: string | null = null;

  if (webhookUrl) {
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, score, label })
      });
      if (!response.ok) {
        webhookError = `Webhook n8n en erreur (${response.status})`;
      }
    } catch {
      webhookError = "Webhook n8n inaccessible";
    }
  }

  if (label === "chaud") {
    await sendBrevoEmail({
      to: "admin@verticall.fr",
      subject: "Lead chaud questionnaire",
      htmlContent: `<p>Nouveau lead chaud: ${payload.prenom ?? "sans prénom"} (${score}/11)</p>`
    });
  }

  return NextResponse.json({ score, label, webhookError });
}
