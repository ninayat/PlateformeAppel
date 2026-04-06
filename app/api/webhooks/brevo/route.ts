import { z } from "zod";
import { NextResponse } from "next/server";

const schema = z.object({
  event: z.string(),
  email: z.string().email(),
  messageId: z.string().optional()
});

export async function POST(request: Request) {
  const payload = schema.parse(await request.json());
  // Commentaire: endpoint prêt pour tracer les événements Brevo (bounce, delivered, etc).
  return NextResponse.json({ ok: true, payload });
}
