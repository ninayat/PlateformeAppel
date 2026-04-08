# VertiCall — Instructions pour Claude Code

## Contexte du projet

Plateforme B2B d'appels d'offres espaces verts. Met en relation des clients publics
(mairies, syndics, collectivités) avec des professionnels (élagueurs, paysagistes,
entreprises d'entretien). Commission de 2,5% sur chaque contrat signé, prélevée côté pro.

## Stack technique

- **Frontend** : Next.js 14 App Router + Tailwind CSS
- **Backend** : Supabase (PostgreSQL + Auth + Storage)
- **Emails** : Brevo API
- **Automatisation** : n8n (self-hosted Render.com)
- **Hébergement** : Vercel (gratuit)
- **Validation** : Zod sur toutes les API routes

## Palette de couleurs (utiliser en CSS variables dans globals.css)

```css
--green-dark: #1a3a2a;
--green-mid: #2d6a4f;
--green-light: #52b788;
--green-pale: #d8f3dc;
--accent: #f4a261;
--accent-dark: #e76f51;
--cream: #faf8f2;
```

## Polices

- Titres : Syne (Google Fonts) — weights 600, 700, 800
- Corps : DM Sans (Google Fonts) — weights 300, 400, 500

## Rôles utilisateurs

- `client` — mairie, syndic, collectivité, hôtel, EHPAD
- `pro` — élagueur, paysagiste, entreprise d'entretien
- `admin` — équipe VertiCall

## Règles de développement

- Commenter le code en français
- Valider toutes les entrées API avec Zod
- Utiliser Tailwind uniquement (pas de CSS custom sauf globals.css)
- Responsive mobile obligatoire sur toutes les pages
- Pas de Stripe dans le MVP — commission déclarée manuellement
- Supabase Row Level Security (RLS) activé sur toutes les tables

## Ordre de développement (respecter cette priorité)

1. Auth Supabase + middleware de rôles
2. Migrations base de données
3. Parcours client (AO → offres → sélection)
4. Parcours pro (profil → AO → soumission)
5. Messagerie
6. Emails Brevo
7. Dashboard admin
8. Questionnaire + webhook n8n
9. Score automatique des offres

## Variables d'environnement requises

Voir `.env.example` à la racine du projet.

## Structure des fichiers

Voir `STRUCTURE.md` pour l'arborescence complète attendue.

## Schéma base de données

Voir `supabase/migrations/001_init.sql` pour les migrations complètes.

## Formule de score des offres

```
score = (note_pro / 5 * 40) + (points_delai * 30) + (points_prix * 30)
```

- Points délai : 100 si délai <= date souhaitée, 70 si délai <= +7j, 40 sinon
- Points prix : 100 si prix <= budget_min, 80 si prix <= budget_max, 50 sinon
- Score final sur 100

Voir `lib/score.ts` pour l'implémentation.
