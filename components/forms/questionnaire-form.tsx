"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function QuestionnaireForm() {
  const router = useRouter();
  const [form, setForm] = useState<Record<string, string>>({});

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const response = await fetch("/api/questionnaire", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await response.json();
    router.push(`/questionnaire/merci?score=${data.score}&label=${data.label}`);
  }

  return (
    <form className="space-y-4 rounded bg-white p-4" onSubmit={submit}>
      {[
        ["q1", ["facile", "long", "decu", "ao-obligatoire"]],
        ["q2", ["1-rapide", "2-3", "3plus", "sans-devis"]],
        ["q3", ["trouver", "comparer", "relances", "justifier"]],
        ["q4", ["oui-essai", "oui-mais", "non-confiance", "non-procedure"]],
        ["q5", ["appel-oui", "notification", "anonyme"]]
      ].map(([field, values]) => (
        <select key={field} className="w-full rounded border p-2" onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))} required>
          <option value="">{field.toUpperCase()}</option>
          {(values as string[]).map((value) => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>
      ))}
      <input className="w-full rounded border p-2" placeholder="Prénom" onChange={(e) => setForm((p) => ({ ...p, prenom: e.target.value }))} />
      <input className="w-full rounded border p-2" placeholder="Commune" onChange={(e) => setForm((p) => ({ ...p, commune: e.target.value }))} />
      <input className="w-full rounded border p-2" placeholder="Email" onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
      <input className="w-full rounded border p-2" placeholder="Téléphone" onChange={(e) => setForm((p) => ({ ...p, telephone: e.target.value }))} />
      <Button type="submit">Envoyer</Button>
    </form>
  );
}
