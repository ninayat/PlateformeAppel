export default function ProProfilePage() {
  return (
    <form className="space-y-3 rounded bg-white p-4">
      <h1 className="font-heading text-3xl">Profil professionnel</h1>
      <input className="w-full rounded border p-2" placeholder="Nom société" />
      <input className="w-full rounded border p-2" placeholder="SIRET" />
      <input className="w-full rounded border p-2" placeholder="Spécialités (csv)" />
      <input className="w-full rounded border p-2" placeholder="Départements (csv)" />
      <input className="w-full rounded border p-2" type="file" accept="application/pdf" />
      <input className="w-full rounded border p-2" placeholder="Certifications (csv)" />
      <button className="rounded bg-verticall-mid px-4 py-2 text-white">Enregistrer</button>
    </form>
  );
}
