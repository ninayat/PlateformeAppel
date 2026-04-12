import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#111a14] text-white overflow-x-hidden">

      {/* ── Navbar ── */}
      <header className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-8 py-4
        border-b border-white/5 backdrop-blur-md bg-[#111a14]/80">
        <span className="font-syne font-extrabold text-xl tracking-tight">
          Verti<span className="text-green-light">Call</span>
        </span>
        <nav className="hidden md:flex items-center gap-8 text-sm text-white/60">
          <a href="#comment" className="hover:text-white transition-colors">Comment ça marche</a>
          <a href="#stats" className="hover:text-white transition-colors">Chiffres</a>
          <a href="#metiers" className="hover:text-white transition-colors">Métiers</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login"
            className="text-sm text-white/70 hover:text-white transition-colors px-4 py-2">
            Connexion
          </Link>
          <Link href="/register"
            className="text-sm font-medium bg-green-light text-green-dark px-4 py-2 rounded-xl
              hover:bg-green-light/90 transition-colors">
            Démarrer
          </Link>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center
        px-6 pt-24 pb-16 text-center overflow-hidden">

        {/* Fond : dégradé + grille de points */}
        <div className="absolute inset-0 bg-dots opacity-30 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-radial from-green-mid/10 via-transparent to-transparent
          pointer-events-none" />

        {/* Orbe décoratif */}
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full
          bg-green-mid/8 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full
          bg-accent/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto fade-up">
          {/* Pill tag */}
          <div className="inline-flex items-center gap-2 bg-green-mid/15 border border-green-mid/25
            text-green-light text-xs font-semibold px-4 py-1.5 rounded-full mb-8 tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-green-light animate-pulse" />
            Plateforme B2B Espaces Verts
          </div>

          <h1 className="font-syne font-extrabold text-5xl md:text-7xl leading-[1.05] mb-6">
            L&apos;appel d&apos;offres<br />
            <span className="text-gradient">espaces verts</span><br />
            réinventé
          </h1>

          <p className="text-white/55 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed font-light">
            Connectez mairies, syndics et collectivités avec des professionnels
            qualifiés — élagueurs, paysagistes, entreprises d&apos;entretien.
            Commission unique de 2,5&nbsp;%.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register"
              className="inline-flex items-center gap-2 bg-green-light text-green-dark
                font-semibold px-8 py-3.5 rounded-2xl hover:bg-green-light/90
                transition-all hover:shadow-lg hover:shadow-green-light/20 hover:-translate-y-0.5">
              Déposer un appel d&apos;offres
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </Link>
            <Link href="/questionnaire"
              className="inline-flex items-center gap-2 bg-white/8 border border-white/12
                text-white font-medium px-8 py-3.5 rounded-2xl hover:bg-white/12
                transition-all">
              Évaluer mon projet
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center
          gap-2 text-white/30 text-xs animate-bounce">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
      </section>

      {/* ── Stats ── */}
      <section id="stats" className="bg-white/4 border-y border-white/6 py-14 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '2 500+', label: 'Professionnels certifiés' },
            { value: '94 dép.', label: 'Départements couverts' },
            { value: '2,5 %', label: 'Commission unique' },
            { value: '48 h', label: 'Délai moyen de réponse' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-syne font-extrabold text-3xl text-green-light mb-1">
                {s.value}
              </div>
              <div className="text-white/45 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Comment ça marche ── */}
      <section id="comment" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="section-label text-green-light/60">Processus</span>
            <h2 className="font-syne font-bold text-4xl mt-3">
              Simple comme un, deux, trois
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                num: '01',
                icon: '📋',
                title: 'Publiez votre AO',
                desc: 'Décrivez votre besoin, budget et délai. Votre appel d\'offres est visible instantanément par les pros de votre département.',
                color: 'from-green-mid/20 to-green-mid/5',
              },
              {
                num: '02',
                icon: '📥',
                title: 'Recevez des offres',
                desc: 'Les professionnels soumettent leurs propositions. Chaque offre est scorée automatiquement sur la note, le délai et le prix.',
                color: 'from-accent/20 to-accent/5',
              },
              {
                num: '03',
                icon: '✅',
                title: 'Sélectionnez & échangez',
                desc: 'Comparez les offres, discutez par messagerie intégrée, puis validez le prestataire en un clic.',
                color: 'from-blue-500/20 to-blue-500/5',
              },
            ].map((step) => (
              <div key={step.num}
                className="relative bg-white/4 border border-white/8 rounded-3xl p-7
                  hover:bg-white/6 hover:border-white/14 transition-all duration-300 group">
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="relative">
                  <span className="font-syne font-extrabold text-5xl text-white/10 absolute -top-2 -right-2">
                    {step.num}
                  </span>
                  <div className="text-3xl mb-4">{step.icon}</div>
                  <h3 className="font-syne font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Métiers ── */}
      <section id="metiers" className="py-20 px-6 bg-white/3 border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="section-label text-green-light/60">Métiers</span>
            <h2 className="font-syne font-bold text-4xl mt-3">
              Tous les métiers du végétal
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '🌳', title: 'Élagage', sub: 'Arboristes certifiés' },
              { icon: '🌿', title: 'Paysagisme', sub: 'Création & aménagement' },
              { icon: '✂️', title: 'Entretien', sub: 'Tonte, taille, désherbage' },
              { icon: '🌱', title: 'Création', sub: 'Jardins & espaces partagés' },
            ].map((m) => (
              <div key={m.title}
                className="bg-white/5 border border-white/8 rounded-2xl p-5 text-center
                  hover:bg-white/8 hover:border-green-mid/30 transition-all duration-200">
                <div className="text-3xl mb-3">{m.icon}</div>
                <div className="font-syne font-bold text-sm">{m.title}</div>
                <div className="text-white/40 text-xs mt-1">{m.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-mid/15 to-transparent pointer-events-none" />
        <div className="relative max-w-2xl mx-auto text-center">
          <h2 className="font-syne font-extrabold text-4xl md:text-5xl mb-6 leading-tight">
            Prêt à simplifier<br />
            <span className="text-gradient">vos marchés verts&nbsp;?</span>
          </h2>
          <p className="text-white/50 mb-10">
            Rejoignez la plateforme de référence pour les appels d&apos;offres espaces verts.
          </p>
          <Link href="/register"
            className="inline-flex items-center gap-2 bg-green-light text-green-dark
              font-semibold text-lg px-10 py-4 rounded-2xl hover:bg-green-light/90
              transition-all hover:shadow-xl hover:shadow-green-light/25 hover:-translate-y-0.5">
            Commencer gratuitement
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/8 px-8 py-8 flex items-center justify-between text-white/30 text-sm">
        <span className="font-syne font-bold text-white/50">
          Verti<span className="text-green-light/70">Call</span>
        </span>
        <span>© {new Date().getFullYear()} — Plateforme espaces verts B2B</span>
      </footer>
    </main>
  )
}
