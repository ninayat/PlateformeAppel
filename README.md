# VertiCall MVP

MVP Next.js 14 + Supabase pour plateforme d'appels d'offres espaces verts.

## Démarrage

```bash
npm install
npm run dev
```

## Fonctionnalités MVP

- Authentification email/mot de passe via Supabase.
- Parcours client et pro (publication AO, soumission offre, messagerie).
- API routes validées avec Zod.
- Questionnaire public avec scoring et webhook n8n.
- Intégration Brevo pour emails transactionnels.

## Migration

SQL initial dans `supabase/migrations/001_init.sql`.
