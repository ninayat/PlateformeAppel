-- VertiCall — Schéma base de données complet
-- À exécuter dans Supabase SQL Editor

-- Extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum rôles
CREATE TYPE user_role AS ENUM ('client', 'pro', 'admin');

-- Enum statuts AO
CREATE TYPE ao_statut AS ENUM ('brouillon', 'publie', 'en_cours', 'termine', 'annule');

-- Enum statuts offre
CREATE TYPE offre_statut AS ENUM ('soumise', 'vue', 'selectionnee', 'refusee');

-- Enum catégories AO
CREATE TYPE ao_categorie AS ENUM ('elagage', 'paysagisme', 'entretien', 'creation', 'autre');

-- Enum métiers pro
CREATE TYPE pro_metier AS ENUM ('elagueur', 'paysagiste', 'entretien', 'autre');

-- Enum chaleur lead
CREATE TYPE lead_chaleur AS ENUM ('froid', 'tiede', 'chaud');

-- =====================
-- Table : profiles
-- =====================
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  email TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'client',
  prenom TEXT NOT NULL,
  nom TEXT NOT NULL,
  commune TEXT,
  telephone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Chacun voit son profil" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Chacun modifie son profil" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admin voit tout" ON profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- =====================
-- Table : pro_profiles
-- =====================
CREATE TABLE pro_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  raison_sociale TEXT NOT NULL,
  siret TEXT NOT NULL,
  metier pro_metier NOT NULL,
  departements TEXT[] NOT NULL DEFAULT '{}',
  description TEXT,
  note_moyenne NUMERIC(3,2) DEFAULT 0,
  nb_contrats INTEGER DEFAULT 0,
  verifie BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE pro_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Pros visibles par tous" ON pro_profiles FOR SELECT USING (true);
CREATE POLICY "Pro modifie son profil" ON pro_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admin valide" ON pro_profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- =====================
-- Table : appels_offres
-- =====================
CREATE TABLE appels_offres (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  client_nom TEXT NOT NULL,
  client_commune TEXT,
  titre TEXT NOT NULL,
  description TEXT NOT NULL,
  categorie ao_categorie NOT NULL,
  departement CHAR(2) NOT NULL,
  budget_min NUMERIC(10,2),
  budget_max NUMERIC(10,2),
  date_souhaitee DATE NOT NULL,
  statut ao_statut NOT NULL DEFAULT 'publie',
  nb_offres INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE appels_offres ENABLE ROW LEVEL SECURITY;
CREATE POLICY "AO publiés visibles par tous" ON appels_offres FOR SELECT
  USING (statut = 'publie' OR auth.uid() = client_id);
CREATE POLICY "Client crée ses AO" ON appels_offres FOR INSERT
  WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Client modifie ses AO" ON appels_offres FOR UPDATE
  USING (auth.uid() = client_id);

-- =====================
-- Table : offres
-- =====================
CREATE TABLE offres (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ao_id UUID REFERENCES appels_offres(id) ON DELETE CASCADE NOT NULL,
  pro_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pro_nom TEXT NOT NULL,
  pro_metier TEXT,
  pro_note NUMERIC(3,2) DEFAULT 0,
  montant NUMERIC(10,2) NOT NULL,
  delai DATE NOT NULL,
  description TEXT NOT NULL,
  statut offre_statut NOT NULL DEFAULT 'soumise',
  score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(ao_id, pro_id)
);

ALTER TABLE offres ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Client voit les offres de ses AO" ON offres FOR SELECT
  USING (
    auth.uid() = pro_id OR
    EXISTS (SELECT 1 FROM appels_offres WHERE id = ao_id AND client_id = auth.uid())
  );
CREATE POLICY "Pro soumet ses offres" ON offres FOR INSERT
  WITH CHECK (auth.uid() = pro_id);

-- =====================
-- Table : conversations
-- =====================
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ao_id UUID REFERENCES appels_offres(id) ON DELETE CASCADE NOT NULL,
  ao_titre TEXT NOT NULL,
  client_id UUID REFERENCES auth.users(id) NOT NULL,
  client_nom TEXT NOT NULL,
  pro_id UUID REFERENCES auth.users(id) NOT NULL,
  pro_nom TEXT NOT NULL,
  dernier_message TEXT,
  dernier_message_at TIMESTAMPTZ,
  nb_non_lus INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(ao_id, pro_id)
);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participants voient leurs conversations" ON conversations FOR SELECT
  USING (auth.uid() = client_id OR auth.uid() = pro_id);

-- =====================
-- Table : messages
-- =====================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  expediteur_id UUID REFERENCES auth.users(id) NOT NULL,
  expediteur_nom TEXT NOT NULL,
  expediteur_role user_role NOT NULL,
  contenu TEXT NOT NULL,
  lu BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participants voient leurs messages" ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE id = conversation_id
      AND (client_id = auth.uid() OR pro_id = auth.uid())
    )
  );
CREATE POLICY "Participants envoient des messages" ON messages FOR INSERT
  WITH CHECK (auth.uid() = expediteur_id);

-- =====================
-- Table : questionnaire_reponses
-- =====================
CREATE TABLE questionnaire_reponses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  q1 TEXT,
  q2 TEXT,
  q3 TEXT,
  q4 TEXT,
  q5 TEXT,
  score_chaleur INTEGER NOT NULL,
  label_chaleur lead_chaleur NOT NULL,
  prenom TEXT,
  commune TEXT,
  email TEXT,
  telephone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE questionnaire_reponses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin voit les leads" ON questionnaire_reponses FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "Insertion publique" ON questionnaire_reponses FOR INSERT WITH CHECK (true);
