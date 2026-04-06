const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";

export async function sendBrevoEmail({
  to,
  subject,
  htmlContent
}: {
  to: string;
  subject: string;
  htmlContent: string;
}) {
  // Commentaire: fonction centralisée pour simplifier les envois email transactionnels.
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    throw new Error("BREVO_API_KEY manquante");
  }

  const response = await fetch(BREVO_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey
    },
    body: JSON.stringify({
      sender: { email: "no-reply@verticall.fr", name: "VertiCall" },
      to: [{ email: to }],
      subject,
      htmlContent
    })
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Erreur Brevo: ${response.status} ${message}`);
  }

  return response.json();
}
