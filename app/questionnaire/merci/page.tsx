export default function MerciPage({ searchParams }: { searchParams: { score?: string; label?: string } }) {
  return (
    <section className="rounded bg-white p-4">
      <h1 className="font-heading text-3xl">Merci pour votre réponse</h1>
      <p>Score: {searchParams.score ?? "-"}</p>
      <p>Niveau: {searchParams.label ?? "-"}</p>
    </section>
  );
}
