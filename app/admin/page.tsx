import { createServerSupabaseClient } from "@/lib/supabase";
import { Card } from "@/components/ui/card";

export default async function AdminPage() {
  const supabase = createServerSupabaseClient();

  const { count: aoCount } = await supabase.from("appels_offres").select("id", { count: "exact", head: true });
  const { count: verifiedPros } = await supabase.from("pro_profiles").select("id", { count: "exact", head: true }).eq("verified", true);
  const { count: signedCount } = await supabase.from("appels_offres").select("id", { count: "exact", head: true }).eq("statut", "signe");
  const { data: monthlyCommissions } = await supabase.from("commissions").select("montant");
  const { data: pendingPros } = await supabase.from("pro_profiles").select("id,siret,profiles!inner(organisation_name)").eq("verified", false).limit(10);

  const total = (monthlyCommissions ?? []).reduce((acc, curr) => acc + Number(curr.montant ?? 0), 0);

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-3xl">Dashboard admin</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Card title="AO publiés">{aoCount ?? 0}</Card>
        <Card title="Pros vérifiés">{verifiedPros ?? 0}</Card>
        <Card title="Contrats signés">{signedCount ?? 0}</Card>
        <Card title="Commissions perçues">{total.toFixed(2)} €</Card>
      </div>
      <Card title="Pros en attente de validation">
        <div className="space-y-2">
          {(pendingPros ?? []).map((pro) => (
            <div key={pro.id} className="flex items-center justify-between border-b pb-2">
              <span>{(pro.profiles as { organisation_name?: string } | null)?.organisation_name ?? "Pro"} — SIRET {pro.siret ?? "-"}</span>
              <div className="space-x-2">
                <button className="rounded bg-verticall-mid px-2 py-1 text-white">Valider</button>
                <button className="rounded border border-red-400 px-2 py-1 text-red-600">Refuser</button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
