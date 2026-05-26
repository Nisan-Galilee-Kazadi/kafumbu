import { FiActivity, FiDollarSign, FiTarget, FiUsers } from "react-icons/fi";
import { useFundraising } from "../../context/FundraisingContext";

const formatMoney = (value) =>
  Number(value || 0) >= 1000000
    ? `$${(Number(value || 0) / 1000000).toFixed(2)}M`
    : `$${Number(value || 0).toLocaleString()}`;

export default function AdminStats() {
  const { campaigns, statistics, fundingGoal } = useFundraising();
  const progress = fundingGoal > 0 ? (statistics.totalRaised / fundingGoal) * 100 : 0;

  const metrics = [
    { label: "Collecte globale", value: formatMoney(statistics.totalRaised), icon: FiDollarSign },
    { label: "Objectif global", value: formatMoney(fundingGoal), icon: FiTarget },
    { label: "Contributeurs", value: statistics.totalContributors.toLocaleString(), icon: FiUsers },
    { label: "Progression", value: `${progress.toFixed(4)}%`, icon: FiActivity },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-xl border border-white/10 bg-[#0B1D35] p-6">
        <h3 className="mb-4 font-bold text-white">Indicateurs synchronises</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {metrics.map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-lg border border-white/10 bg-[#08172B] p-4">
              <Icon className="text-emerald-400" size={18} />
              <p className="mt-3 text-xs uppercase tracking-wider text-slate-400">{label}</p>
              <p className="mt-1 font-mono text-xl font-black text-white">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-[#0B1D35] p-6">
        <h3 className="mb-4 font-bold text-white">Campagnes</h3>
        <div className="space-y-4">
          {campaigns.map((campaign) => {
            const campaignProgress = campaign.target > 0 ? (campaign.raised / campaign.target) * 100 : 0;
            return (
              <div key={campaign.id}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-slate-400">{campaign.title}</span>
                  <span className="font-bold text-white">{campaignProgress.toFixed(4)}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#08172B]">
                  <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${Math.min(campaignProgress, 100)}%` }} />
                </div>
                <div className="mt-1 flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <span>{formatMoney(campaign.raised)} collectes</span>
                  <span>{campaign.contributors.toLocaleString()} contributeurs</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
