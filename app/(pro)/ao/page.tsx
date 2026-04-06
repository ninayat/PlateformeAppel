import { OffreForm } from "@/components/forms/offre-form";
import { createServerSupabaseClient } from "@/lib/supabase";

export default async function ProAoPage() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase.from("pro_profiles").select("departements").eq("id", user?.id ?? "").single();

  const departements = profile?.departements ?? [];

  const { data: aos } = await supabase
    .from("appels_offres")
    .select("id,titre,departement,budget_min,budget_max")
    .in("departement", departements.length > 0 ? departements : ["--none--"])
    .eq("statut", "ouvert")
    .order("created_at", { ascending: false });

  return (
    <section className="space-y-4">
      <h1 className="font-heading text-3xl">AO disponibles (filtrés par département)</h1>
      <div className="space-y-3">
        {(aos ?? []).map((ao) => (
          <div key={ao.id} className="rounded border border-verticall-pale bg-white p-4">
            <p className="font-semibold">{ao.titre}</p>
            <p className="text-sm">Département: {ao.departement}</p>
            <p className="text-sm">Budget: {ao.budget_min}€ - {ao.budget_max}€</p>
            <div className="mt-2">
              <OffreForm aoId={ao.id} />
            </div>
          </div>
        ))}
        {aos?.length === 0 && <p>Aucun AO correspondant à votre zone.</p>}
      </div>
    </section>
  );
}
