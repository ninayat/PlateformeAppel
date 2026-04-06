import { cookies } from "next/headers";
import { createClientComponentClient, createRouteHandlerClient, createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !anon) {
  throw new Error("Variables Supabase publiques manquantes");
}

// Commentaire: client navigateur utilisé par les composants client.
export const createBrowserSupabaseClient = () => createClientComponentClient();

// Commentaire: client server component utilisé dans les pages serveur.
export const createServerSupabaseClient = () =>
  createServerComponentClient({
    cookies
  });

// Commentaire: client route handler utilisé dans les endpoints API.
export const createRouteSupabaseClient = () =>
  createRouteHandlerClient({
    cookies
  });

export const supabaseAdmin = service ? createClient(url, service, { auth: { autoRefreshToken: false, persistSession: false } }) : null;
