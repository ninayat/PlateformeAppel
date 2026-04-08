'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { calculerScoreChaleur } from '@/lib/score'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
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
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-syne font-bold text-3xl text-green-dark">
            Verti<span className="text-green-mid">Call</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">Évaluez votre projet</p>
        </div>

        {/* Résultat */}
        {etape === QUESTIONS.length + 1 && resultat ? (
          <div className="bg-white rounded-2xl border border-green-pale shadow-sm p-8 text-center">
            {(() => {
              const cfg = LABEL_CONFIG[resultat.label]
              return (
                <>
                  <div className="text-5xl mb-4">{cfg.icon}</div>
                  <div className={cn('text-sm font-bold uppercase tracking-wide mb-2', cfg.color)}>
                    Score : {resultat.score}/100
                  </div>
                  <h2 className="font-syne font-bold text-2xl text-green-dark mb-3">
                    {cfg.titre}
                  </h2>
                  <div className={cn('rounded-xl p-4 mb-6 text-sm', cfg.bg, cfg.color)}>
                    {cfg.message}
                  </div>

                  {/* Barre de score */}
                  <div className="bg-gray-100 rounded-full h-3 mb-6 overflow-hidden">
                    <div
                      className={cn(
                        'h-3 rounded-full transition-all',
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
          <div className="bg-white rounded-2xl border border-green-pale shadow-sm p-8">
            <h2 className="font-syne font-bold text-xl text-green-dark mb-2">
              Presque terminé !
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Laissez vos coordonnées pour recevoir votre analyse personnalisée.
            </p>
            <form onSubmit={soumettre} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  id="prenom"
                  label="Prénom"
                  placeholder="Marie"
                  value={contact.prenom}
                  onChange={(e) => setContact((c) => ({ ...c, prenom: e.target.value }))}
                />
                <Input
                  id="commune"
                  label="Commune"
                  placeholder="Lyon"
                  value={contact.commune}
                  onChange={(e) => setContact((c) => ({ ...c, commune: e.target.value }))}
                />
              </div>
              <Input
                id="email"
                label="Email (optionnel)"
                type="email"
                placeholder="contact@mairie.fr"
                value={contact.email}
                onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
              />
              <Input
                id="telephone"
                label="Téléphone (optionnel)"
                type="tel"
                placeholder="0600000000"
                value={contact.telephone}
                onChange={(e) => setContact((c) => ({ ...c, telephone: e.target.value }))}
              />
              <Button type="submit" size="lg" className="mt-2">
                Voir mon analyse →
              </Button>
              <button
                type="button"
                onClick={soumettre}
                className="text-sm text-gray-400 hover:text-gray-600 text-center"
              >
                Passer cette étape
              </button>
            </form>
          </div>
        ) : (
          /* Questions */
          <div className="bg-white rounded-2xl border border-green-pale shadow-sm p-8">
            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>Question {etape + 1} / {QUESTIONS.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="bg-gray-100 rounded-full h-1.5">
                <div
                  className="bg-green-mid h-1.5 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <h2 className="font-syne font-bold text-xl text-green-dark mb-6">
              {question.question}
            </h2>

            <div className="flex flex-col gap-3 mb-6">
              {question.options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => selectReponse(opt.value)}
                  className={cn(
                    'text-left px-4 py-3 rounded-xl border-2 text-sm transition-all',
                    reponses[question.id] === opt.value
                      ? 'border-green-mid bg-green-pale text-green-dark font-medium'
                      : 'border-gray-200 hover:border-green-light/50 text-gray-700'
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
              {etape === QUESTIONS.length - 1 ? 'Voir mes coordonnées →' : 'Question suivante →'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
