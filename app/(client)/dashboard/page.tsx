import Link from "next/link";
import { Card } from "@/components/ui/card";
import { createServerSupabaseClient } from "@/lib/supabase";

export default async function ClientDashboard() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: aoList } = await supabase
    .from("appels_offres")
    .select("id,titre,statut,created_at")
    .eq("client_id", user?.id ?? "")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-3xl">Dashboard client</h1>
      <Card title="Mes appels d'offres">
        <div className="mb-3 flex justify-end">
          <Link href="/client/ao/new" className="text-verticall-mid underline">Publier un AO</Link>
        </div>
        <div className="space-y-2">
          {(aoList ?? []).map((ao) => (
            <div key={ao.id} className="rounded border border-verticall-pale p-3">
              <p className="font-semibold">{ao.titre}</p>
              <p className="text-sm">Statut: {ao.statut}</p>
              <Link href={`/client/ao/${ao.id}/offres`} className="text-sm text-verticall-mid underline">Comparer les offres</Link>
            </div>
          ))}
          {aoList?.length === 0 && <p className="text-sm">Aucun appel d'offre pour le moment.</p>}
        </div>
      </Card>
    </div>
  );
}
