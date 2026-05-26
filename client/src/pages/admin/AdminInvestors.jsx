const ROWS = [
  { tier: 'Gold', name: 'Fonds Horizon', committed: '$120 000', date: '01/05/2026' },
  { tier: 'Silver', name: 'M. Alain Dupont', committed: '$30 000', date: '28/04/2026' },
  { tier: 'Bronze', name: 'Coopérative Kivu', committed: '$7 500', date: '22/04/2026' },
];

export default function AdminInvestors() {
  return (
    <section className="overflow-hidden rounded-xl border border-white/10 bg-[#0B1D35]">
      <div className="border-b border-white/10 p-4 sm:p-5">
        <p className="text-sm text-slate-400">Investisseurs enregistrés (données de démo).</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="border-b border-white/10 bg-[#08172B] text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Niveau</th>
              <th className="px-4 py-3">Contributeur</th>
              <th className="px-4 py-3">Engagement</th>
              <th className="px-4 py-3">Depuis</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {ROWS.map((row) => (
              <tr key={row.name} className="text-slate-300 hover:bg-white/[0.03]">
                <td className="px-4 py-3 font-semibold text-amber-400">{row.tier}</td>
                <td className="px-4 py-3 font-medium text-white">{row.name}</td>
                <td className="px-4 py-3">{row.committed}</td>
                <td className="px-4 py-3 text-slate-500">{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
