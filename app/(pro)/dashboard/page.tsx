import { createServerSupabaseClient } from "@/lib/supabase";
import { Card } from "@/components/ui/card";

export default async function ProDashboard() {
  const supabase = createServerSupabaseClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { count: disponibles } = await supabase.from("appels_offres").select("id", { count: "exact", head: true }).eq("statut", "ouvert");
  const { count: soumises } = await supabase.from("offres").select("id", { count: "exact", head: true }).eq("pro_id", user?.id ?? "");
  const { count: signees } = await supabase.from("offres").select("id", { count: "exact", head: true }).eq("pro_id", user?.id ?? "").eq("statut", "retenue");
  const { data: commissions } = await supabase.from("commissions").select("montant,offres!inner(pro_id)").eq("offres.pro_id", user?.id ?? "");

  const totalCommission = (commissions ?? []).reduce((acc, c) => acc + Number(c.montant ?? 0), 0);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card title="AO disponibles">{disponibles ?? 0}</Card>
      <Card title="Offres soumises">{soumises ?? 0}</Card>
      <Card title="Contrats signés">{signees ?? 0}</Card>
      <Card title="Commission due">{totalCommission.toFixed(2)} €</Card>
    </div>
  );
}
