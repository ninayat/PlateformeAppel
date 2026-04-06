export function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-verticall-pale bg-white p-4 shadow-sm">
      <h3 className="mb-3 font-heading text-xl">{title}</h3>
      {children}
    </div>
  );
}
