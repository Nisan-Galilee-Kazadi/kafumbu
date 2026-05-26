import { useMemo } from 'react';
import { useFundraising } from '../../context/FundraisingContext';

export default function AdminPayments() {
  const { campaigns } = useFundraising();
  const rows = useMemo(
    () =>
      campaigns.flatMap((campaign) =>
        (campaign.donations || []).map((donation) => ({
          ref: `PAY-${donation.id}`,
          user: donation.contributor || 'Visiteur public',
          amount: `$${Number(donation.amount || 0).toLocaleString('fr-FR')}`,
          method: donation.source || 'contribution',
          statut: 'Valide',
          date: donation.date ? new Date(donation.date).toLocaleDateString('fr-FR') : '-',
          campaign: campaign.title,
        })),
      ),
    [campaigns],
  );

  return (
    <section className="overflow-hidden rounded-xl border border-white/10 bg-[#0B1D35]">
      <div className="border-b border-white/10 p-4 sm:p-5">
        <p className="text-sm text-slate-400">
          Paiements synchronises avec les contributions visiteur et publiques. Aucun montant fictif n'est ajoute.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-white/10 bg-[#08172B] text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Profil</th>
              <th className="px-4 py-3">Campagne</th>
              <th className="px-4 py-3">Montant</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-xs font-bold uppercase tracking-widest text-slate-500">
                  Aucune contribution enregistree pour le moment
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.ref} className="text-slate-300 hover:bg-white/[0.03]">
                  <td className="px-4 py-3 font-mono text-xs text-emerald-400">{row.ref}</td>
                  <td className="px-4 py-3">{row.user}</td>
                  <td className="px-4 py-3 text-slate-400">{row.campaign}</td>
                  <td className="px-4 py-3 font-bold text-white">{row.amount}</td>
                  <td className="px-4 py-3">{row.method}</td>
                  <td className="px-4 py-3">{row.statut}</td>
                  <td className="px-4 py-3 text-slate-500">{row.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
