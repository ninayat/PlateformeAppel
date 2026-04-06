"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

export function OffreForm({ aoId }: { aoId: string }) {
  const [prix, setPrix] = useState(0);
  const [delai, setDelai] = useState("");
  const [description, setDescription] = useState("");

  const commission = useMemo(() => prix * 0.025, [prix]);

  async function submit() {
    const res = await fetch("/api/offres", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ao_id: aoId, prix_ht: prix, delai_intervention: delai, description })
    });
    if (!res.ok) return alert("Erreur envoi offre");
    alert("Offre envoyée");
  }

  return (
    <div className="space-y-3 rounded bg-white p-4">
      <input type="number" placeholder="Prix HT" className="w-full rounded border p-2" onChange={(e) => setPrix(Number(e.target.value))} />
      <input type="date" className="w-full rounded border p-2" onChange={(e) => setDelai(e.target.value)} />
      <textarea className="w-full rounded border p-2" placeholder="Approche" onChange={(e) => setDescription(e.target.value)} />
      <p>Commission estimée (2,5%) : {commission.toFixed(2)} €</p>
      <Button onClick={submit}>Soumettre</Button>
    </div>
  );
}
