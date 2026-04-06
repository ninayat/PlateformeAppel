import { createServerSupabaseClient } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { SelectOffreButton } from "@/components/forms/select-offre-button";

export default async function OffresComparisonPage({ params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient();
  const { data: offres } = await supabase
    .from("offres")
    .select("id,prix_ht,delai_intervention,score,pro_id,profiles:pro_id(organisation_name)")
    .eq("ao_id", params.id)
    .order("created_at", { ascending: true });

  return (
    <Card title="Comparaison des offres">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="text-left">Professionnel</th>
            <th className="text-left">Prix</th>
            <th className="text-left">Délai</th>
            <th className="text-left">Score /100</th>
            <th className="text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {(offres ?? []).map((o) => (
            <tr key={o.id} className="border-t">
              <td>{(o.profiles as { organisation_name?: string } | null)?.organisation_name ?? "Prestataire"}</td>
              <td>{o.prix_ht} €</td>
              <td>{o.delai_intervention}</td>
              <td>{o.score ?? "-"}</td>
              <td><SelectOffreButton aoId={params.id} offreId={o.id} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
