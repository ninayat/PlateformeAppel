"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Commentaire: connexion standard Supabase puis redirection selon le rôle profil.
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return alert(error.message);

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single();

    if (profile?.role === "client") router.push("/client/dashboard");
    else if (profile?.role === "pro") router.push("/pro/dashboard");
    else if (profile?.role === "admin") router.push("/admin");
    else router.push("/");

    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-md space-y-3 rounded-xl bg-white p-6">
      <h1 className="font-heading text-3xl">Connexion</h1>
      <input className="w-full rounded border p-2" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input className="w-full rounded border p-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe" />
      <Button type="submit">Se connecter</Button>
    </form>
  );
}
