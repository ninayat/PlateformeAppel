"use client";

import { useState } from "react";

export function SelectOffreButton({ aoId, offreId }: { aoId: string; offreId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleSelect() {
    setLoading(true);
    const response = await fetch("/api/offres", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ao_id: aoId, offre_id: offreId })
    });
    setLoading(false);

    if (!response.ok) {
      const data = await response.json();
      return alert(data.error ?? "Erreur de sélection");
    }

    alert("Prestataire sélectionné, notifications envoyées.");
  }

  return (
    <button
      type="button"
      onClick={handleSelect}
      disabled={loading}
      className="rounded bg-verticall-accent px-3 py-1 text-white disabled:opacity-60"
    >
      {loading ? "..." : "Sélectionner"}
    </button>
  );
}
