export function computeOfferScore({
  noteMoyenne,
  delaiJours,
  prixHt,
  budgetMin,
  budgetMax
}: {
  noteMoyenne: number;
  delaiJours: number;
  prixHt: number;
  budgetMin: number;
  budgetMax: number;
}): number {
  // Commentaire: normalisation simple pour produire un score sur 100.
  const notePart = Math.max(0, Math.min(100, (noteMoyenne / 5) * 100));
  const delaiPart = Math.max(0, Math.min(100, 100 - delaiJours * 2));

  const budgetMid = (budgetMin + budgetMax) / 2;
  const ecart = Math.abs(prixHt - budgetMid);
  const tolerance = Math.max(1, budgetMax - budgetMin);
  const prixPart = Math.max(0, Math.min(100, 100 - (ecart / tolerance) * 100));

  const score = notePart * 0.4 + delaiPart * 0.3 + prixPart * 0.3;
  return Math.round(score);
}

export function computeLeadHeatScore(payload: {
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: string;
}) {
  let score = 0;

  if (["long", "decu"].includes(payload.q1)) score += 2;
  if (["2-3", "3plus"].includes(payload.q2)) score += 2;
  if (["trouver", "relances"].includes(payload.q3)) score += 2;
  if (payload.q4 === "oui-essai") score += 3;
  if (payload.q4 === "oui-mais") score += 1;
  if (payload.q5 === "appel-oui") score += 2;

  const label = score >= 7 ? "chaud" : score >= 4 ? "tiède" : "froid";
  return { score, label };
}
