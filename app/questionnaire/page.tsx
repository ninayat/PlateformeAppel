'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { calculerScoreChaleur } from '@/lib/score'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const QUESTIONS = [
  {
    id: 'q1',
    question: 'Avez-vous déjà fait appel à un professionnel des espaces verts ?',
    options: [
      { value: 'oui_recemment', label: 'Oui, récemment (moins d\'un an)' },
      { value: 'oui_anciennement', label: 'Oui, mais il y a plus d\'un an' },
      { value: 'non_mais_interesse', label: 'Non, mais je cherche à le faire' },
      { value: 'non', label: 'Non, première fois' },
    ],
  },
  {
    id: 'q2',
    question: 'Quel est votre budget estimé pour cette prestation ?',
    options: [
      { value: 'plus_10000', label: 'Plus de 10 000 €' },
      { value: '5000_10000', label: 'Entre 5 000 et 10 000 €' },
      { value: '1000_5000', label: 'Entre 1 000 et 5 000 €' },
      { value: 'moins_1000', label: 'Moins de 1 000 €' },
    ],
  },
  {
    id: 'q3',
    question: 'Dans quel délai souhaitez-vous réaliser cette prestation ?',
    options: [
      { value: 'urgent', label: 'Urgent (moins de 2 semaines)' },
      { value: 'mois_prochain', label: 'Le mois prochain' },
      { value: 'trimestre', label: 'Dans les 3 prochains mois' },
      { value: 'pas_urgent', label: 'Pas de date précise' },
    ],
  },
  {
    id: 'q4',
    question: 'Quelle est l\'envergure de votre projet ?',
    options: [
      { value: 'grand', label: 'Grand (>500m² ou +10 arbres)' },
      { value: 'moyen', label: 'Moyen (100-500m² ou 3-10 arbres)' },
      { value: 'petit', label: 'Petit (<100m² ou 1-2 arbres)' },
    ],
  },
  {
    id: 'q5',
    question: 'Disposez-vous d\'un cahier des charges ou d\'un descriptif précis ?',
    options: [
      { value: 'oui_complet', label: 'Oui, complet et détaillé' },
      { value: 'partiel', label: 'Partiellement défini' },
      { value: 'non', label: 'Non, j\'ai besoin d\'accompagnement' },
    ],
  },
]

export default function QuestionnairePage() {
  const router = useRouter()
  const [etape, setEtape] = useState(0) // 0-4 : questions, 5 : contact, 6 : résultat
  const [reponses, setReponses] = useState<Record<string, string>>({})
  const [contact, setContact] = useState({ prenom: '', commune: '', email: '', telephone: '' })
  const [resultat, setResultat] = useState<{ score: number; label: 'froid' | 'tiede' | 'chaud' } | null>(null)

  const question = QUESTIONS[etape]
  const progress = ((etape + 1) / (QUESTIONS.length + 1)) * 100

  function selectReponse(value: string) {
    setReponses((r) => ({ ...r, [question.id]: value }))
  }

  function suivant() {
    if (etape < QUESTIONS.length - 1) {
      setEtape((e) => e + 1)
    } else if (etape === QUESTIONS.length - 1) {
      setEtape(QUESTIONS.length) // Étape contact
    }
  }

  function soumettre(e: React.FormEvent) {
    e.preventDefault()
    const score = calculerScoreChaleur({
      q1: reponses.q1,
      q2: reponses.q2,
      q3: reponses.q3,
      q4: reponses.q4,
      q5: reponses.q5,
    })
    setResultat(score)
    setEtape(QUESTIONS.length + 1) // Résultat
  }

  const LABEL_CONFIG = {
    froid: {
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      icon: '🌱',
      titre: 'Projet en réflexion',
      message: 'Votre projet est encore en phase d\'exploration. Revenez quand vous serez prêt à lancer un appel d\'offres !',
    },
    tiede: {
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      icon: '🌿',
      titre: 'Projet bien avancé',
      message: 'Votre projet est bien cadré. Publiez un appel d\'offres pour recevoir des propositions de pros qualifiés.',
    },
    chaud: {
      color: 'text-green-mid',
      bg: 'bg-green-pale',
      icon: '🌳',
      titre: 'Projet prêt à lancer !',
      message: 'Excellent — votre projet est parfaitement défini. Créez votre compte et publiez votre appel d\'offres maintenant.',
    },
  }

  return (
    <div className="min-h-screen bg-[#111a14] bg-dots flex items-center justify-center p-4">
      <div className="w-full max-w-lg fade-up">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/8 border border-white/10 text-white/60 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-green-light animate-pulse" />
            Analyse gratuite
          </div>
          <h1 className="font-syne font-extrabold text-3xl text-white">
            Évaluez votre projet
          </h1>
          <p className="text-white/40 text-sm mt-2">
            5 questions pour estimer la maturité de votre besoin
          </p>
        </div>

        {/* Résultat */}
        {etape === QUESTIONS.length + 1 && resultat ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-xl">
            {(() => {
              const cfg = LABEL_CONFIG[resultat.label]
              return (
                <>
                  <div className="text-5xl mb-4">{cfg.icon}</div>
                  <div className={cn('text-xs font-bold uppercase tracking-widest mb-2', cfg.color)}>
                    Score chaleur : {resultat.score}/100
                  </div>
                  <h2 className="font-syne font-extrabold text-2xl text-green-dark mb-3">
                    {cfg.titre}
                  </h2>
                  <div className={cn('rounded-xl p-4 mb-6 text-sm', cfg.bg, cfg.color)}>
                    {cfg.message}
                  </div>

                  {/* Barre de score */}
                  <div className="bg-gray-100 rounded-full h-2 mb-6 overflow-hidden">
                    <div
                      className={cn(
                        'h-2 rounded-full transition-all duration-700',
                        resultat.label === 'chaud' ? 'bg-green-mid' :
                        resultat.label === 'tiede' ? 'bg-accent' : 'bg-blue-400'
                      )}
                      style={{ width: `${resultat.score}%` }}
                    />
                  </div>

                  <div className="flex gap-3 justify-center">
                    <Button onClick={() => router.push('/register')} size="lg">
                      Créer un compte
                    </Button>
                    <Button variant="outline" onClick={() => router.push('/')}>
                      Accueil
                    </Button>
                  </div>
                </>
              )
            })()}
          </div>
        ) : etape === QUESTIONS.length ? (
          /* Étape contact */
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <h2 className="font-syne font-extrabold text-xl text-green-dark mb-1">
              Presque terminé !
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              Laissez vos coordonnées pour recevoir votre analyse personnalisée.
            </p>
            <form onSubmit={soumettre} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="section-label" htmlFor="prenom">Prénom</label>
                  <input
                    id="prenom"
                    className="input-base"
                    placeholder="Marie"
                    value={contact.prenom}
                    onChange={(e) => setContact((c) => ({ ...c, prenom: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="section-label" htmlFor="commune">Commune</label>
                  <input
                    id="commune"
                    className="input-base"
                    placeholder="Lyon"
                    value={contact.commune}
                    onChange={(e) => setContact((c) => ({ ...c, commune: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="section-label" htmlFor="email">Email (optionnel)</label>
                <input
                  id="email"
                  type="email"
                  className="input-base"
                  placeholder="contact@mairie.fr"
                  value={contact.email}
                  onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
                />
              </div>
              <div>
                <label className="section-label" htmlFor="telephone">Téléphone (optionnel)</label>
                <input
                  id="telephone"
                  type="tel"
                  className="input-base"
                  placeholder="0600000000"
                  value={contact.telephone}
                  onChange={(e) => setContact((c) => ({ ...c, telephone: e.target.value }))}
                />
              </div>
              <Button type="submit" size="lg" className="mt-2 w-full">
                Voir mon analyse →
              </Button>
              <button
                type="button"
                onClick={soumettre}
                className="text-sm text-gray-400 hover:text-gray-600 text-center transition-colors"
              >
                Passer cette étape
              </button>
            </form>
          </div>
        ) : (
          /* Questions */
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            {/* Progress */}
            <div className="mb-7">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span className="font-medium">Question {etape + 1} / {QUESTIONS.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="bg-gray-100 rounded-full h-1">
                <div
                  className="bg-green-mid h-1 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <h2 className="font-syne font-extrabold text-xl text-green-dark mb-6">
              {question.question}
            </h2>

            <div className="flex flex-col gap-2.5 mb-7">
              {question.options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => selectReponse(opt.value)}
                  className={cn(
                    'text-left px-4 py-3.5 rounded-xl border-2 text-sm transition-all',
                    reponses[question.id] === opt.value
                      ? 'border-green-mid bg-green-pale text-green-dark font-semibold'
                      : 'border-gray-100 hover:border-green-light/50 hover:bg-gray-50 text-gray-600'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <Button
              onClick={suivant}
              disabled={!reponses[question.id]}
              className="w-full"
              size="lg"
            >
              {etape === QUESTIONS.length - 1 ? 'Dernière étape →' : 'Question suivante →'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
