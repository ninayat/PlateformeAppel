-- Extension du profil utilisateur
create table if not exists profiles (
  id uuid references auth.users primary key,
  role text check (role in ('client','pro','admin')) not null,
  organisation_name text,
  created_at timestamp default now()
);

create table if not exists pro_profiles (
  id uuid references profiles primary key,
  siret text,
  specialites text[],
  departements text[],
  assurance_url text,
  certifications text[],
  note_moyenne numeric default 0,
  nb_avis int default 0,
  verified boolean default false
);

create table if not exists appels_offres (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references profiles,
  titre text not null,
  description text,
  type_prestation text check (type_prestation in ('elagage','entretien','debroussaillage','creation')),
  localisation text,
  departement text,
  budget_min numeric,
  budget_max numeric,
  date_souhaitee date,
  statut text default 'ouvert' check (statut in ('ouvert','en_evaluation','clos','signe')),
  created_at timestamp default now()
);

create table if not exists offres (
  id uuid primary key default gen_random_uuid(),
  ao_id uuid references appels_offres,
  pro_id uuid references profiles,
  prix_ht numeric not null,
  delai_intervention date,
  description text,
  score numeric,
  statut text default 'soumise' check (statut in ('soumise','retenue','refusee')),
  created_at timestamp default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  ao_id uuid references appels_offres,
  sender_id uuid references profiles,
  receiver_id uuid references profiles,
  contenu text not null,
  lu boolean default false,
  created_at timestamp default now()
);

create table if not exists commissions (
  id uuid primary key default gen_random_uuid(),
  offre_id uuid references offres,
  montant numeric,
  taux numeric default 0.025,
  statut text default 'due' check (statut in ('due','payee')),
  created_at timestamp default now()
);

create table if not exists questionnaire_reponses (
  id uuid primary key default gen_random_uuid(),
  q1 text, q2 text, q3 text, q4 text, q5 text,
  score_chaleur int,
  label_chaleur text,
  prenom text,
  commune text,
  email text,
  telephone text,
  created_at timestamp default now()
);
