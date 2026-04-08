import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-green-dark text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4">
        <span className="font-syne font-bold text-2xl">
          Verti<span className="text-green-light">Call</span>
        </span>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm text-white/70 hover:text-white">
            Connexion
          </Link>
          <Link href="/register">
            <Button variant="secondary" size="sm">Créer un compte</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 py-24 max-w-3xl mx-auto">
        <span className="bg-green-light/20 text-green-light text-xs font-medium px-4 py-1.5 rounded-full mb-6">
          Plateforme B2B Espaces Verts
        </span>
        <h1 className="font-syne font-extrabold text-5xl leading-tight mb-6">
          L&apos;appel d&apos;offres<br />
          <span className="text-green-light">espaces verts</span><br />
          simplifié
        </h1>
        <p className="text-white/70 text-lg mb-10 max-w-xl">
          Connectez mairies, syndics et collectivités avec des professionnels
          qualifiés — élagueurs, paysagistes, entreprises d&apos;entretien.
        </p>
        <div className="flex gap-4">
          <Link href="/register">
            <Button size="lg" variant="secondary">Déposer un appel d&apos;offres</Button>
          </Link>
          <Link href="/questionnaire">
            <Button size="lg" variant="outline"
              className="border-white/30 text-white hover:bg-white/10">
              Évaluer mon projet
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white text-green-dark py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-syne font-bold text-3xl text-center mb-12">
            Comment ça marche ?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Publiez votre AO',
                desc: 'Décrivez votre besoin, budget et délai. Votre appel d\'offres est visible instantanément.',
                icon: '📋',
              },
              {
                step: '2',
                title: 'Recevez des offres',
                desc: 'Les professionnels de votre département soumettent leurs offres. Chaque offre est scorée automatiquement.',
                icon: '📥',
              },
              {
                step: '3',
                title: 'Sélectionnez & contractez',
                desc: 'Comparez, échangez par messagerie et validez le prestataire. Commission 2,5% au contrat.',
                icon: '✅',
              },
            ].map((f) => (
              <div key={f.step} className="text-center">
                <div className="text-4xl mb-4">{f.icon}</div>
                <div className="w-8 h-8 bg-green-mid text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-3">
                  {f.step}
                </div>
                <h3 className="font-syne font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA bas */}
      <section className="bg-green-mid text-white py-16 px-6 text-center">
        <h2 className="font-syne font-bold text-2xl mb-4">
          Prêt à démarrer ?
        </h2>
        <p className="text-white/80 mb-8">
          Rejoignez la plateforme référence des espaces verts professionnels.
        </p>
        <Link href="/register">
          <Button size="lg" variant="secondary">Commencer gratuitement</Button>
        </Link>
      </section>
    </main>
  )
}
