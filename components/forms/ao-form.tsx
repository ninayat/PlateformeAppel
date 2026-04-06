"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function AoForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<Record<string, string>>({});

  async function submit() {
    const res = await fetch("/api/ao", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    if (!res.ok) {
      const data = await res.json();
      return alert(data.error ?? "Erreur création AO");
    }
    alert("AO publié");
  }

  return (
    <div className="space-y-3 rounded bg-white p-4">
      <p>Étape {step}/3</p>
      {step === 1 && (
        <select className="w-full rounded border p-2" onChange={(e) => setForm((p) => ({ ...p, type_prestation: e.target.value }))}>
          <option value="elagage">Élagage/abattage</option>
          <option value="entretien">Entretien</option>
          <option value="debroussaillage">Débroussaillage</option>
          <option value="creation">Création paysagère</option>
        </select>
      )}
      {step === 2 && (
        <>
          <input placeholder="Titre" className="w-full rounded border p-2" onChange={(e) => setForm((p) => ({ ...p, titre: e.target.value }))} />
          <textarea placeholder="Description" className="w-full rounded border p-2" onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
          <input placeholder="Localisation" className="w-full rounded border p-2" onChange={(e) => setForm((p) => ({ ...p, localisation: e.target.value }))} />
          <input placeholder="Département" className="w-full rounded border p-2" onChange={(e) => setForm((p) => ({ ...p, departement: e.target.value }))} />
        </>
      )}
      {step === 3 && (
        <>
          <input placeholder="Budget min" className="w-full rounded border p-2" onChange={(e) => setForm((p) => ({ ...p, budget_min: e.target.value }))} />
          <input placeholder="Budget max" className="w-full rounded border p-2" onChange={(e) => setForm((p) => ({ ...p, budget_max: e.target.value }))} />
          <input placeholder="Date souhaitée" type="date" className="w-full rounded border p-2" onChange={(e) => setForm((p) => ({ ...p, date_souhaitee: e.target.value }))} />
          <input placeholder="Nombre d'offres souhaitées" className="w-full rounded border p-2" onChange={(e) => setForm((p) => ({ ...p, nb_offres_souhaitees: e.target.value }))} />
        </>
      )}
      <div className="flex gap-2">
        {step > 1 && <Button onClick={() => setStep((v) => v - 1)}>Retour</Button>}
        {step < 3 ? <Button onClick={() => setStep((v) => v + 1)}>Suivant</Button> : <Button onClick={submit}>Publier</Button>}
      </div>
    </div>
  );
}
