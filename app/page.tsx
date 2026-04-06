import Link from "next/link";

export default function Home() {
  return (
    <section className="space-y-4">
      <h1 className="font-heading text-4xl text-verticall-dark">VertiCall</h1>
      <p className="text-lg">Place de marché B2B pour appels d'offres en espaces verts.</p>
      <div className="flex gap-3">
        <Link href="/questionnaire" className="rounded bg-verticall-mid px-4 py-2 text-white">Questionnaire marché</Link>
        <Link href="/login" className="rounded border border-verticall-mid px-4 py-2">Connexion</Link>
      </div>
    </section>
  );
}
