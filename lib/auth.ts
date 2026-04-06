import { NextResponse } from "next/server";
import { createRouteSupabaseClient } from "@/lib/supabase";

export type AppRole = "client" | "pro" | "admin";

export async function getAuthenticatedProfile(requiredRole?: AppRole) {
  const supabase = createRouteSupabaseClient();
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: NextResponse.json({ error: "Utilisateur non authentifié" }, { status: 401 }) };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id,role,organisation_name")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return { error: NextResponse.json({ error: "Profil introuvable" }, { status: 403 }) };
  }

  if (requiredRole && profile.role !== requiredRole) {
    return { error: NextResponse.json({ error: "Accès interdit" }, { status: 403 }) };
  }

  return { supabase, user, profile: profile as { id: string; role: AppRole; organisation_name: string | null } };
}
