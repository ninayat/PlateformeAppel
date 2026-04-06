"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"client" | "pro">("client");
  const [organisationName, setOrganisationName] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return alert(error.message);

    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        role,
        organisation_name: organisationName || null
      });
      if (profileError) return alert(profileError.message);
    }

    alert("Inscription créée. Vérifiez votre email de confirmation.");
    router.push("/login");
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-md space-y-3 rounded-xl bg-white p-6">
      <h1 className="font-heading text-3xl">Inscription</h1>
      <input className="w-full rounded border p-2" value={organisationName} onChange={(e) => setOrganisationName(e.target.value)} placeholder="Nom de l'organisation" />
      <input className="w-full rounded border p-2" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input className="w-full rounded border p-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe" />
      <select className="w-full rounded border p-2" value={role} onChange={(e) => setRole(e.target.value as "client" | "pro")}>
        <option value="client">Client public</option>
        <option value="pro">Professionnel</option>
      </select>
      <Button type="submit">Créer mon compte</Button>
    </form>
  );
}
