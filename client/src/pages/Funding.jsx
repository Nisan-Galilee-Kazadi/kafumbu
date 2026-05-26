import { useState } from "react";
import { useLang } from "../context/LangContext";
import {
  FiHeart,
  FiShield,
  FiLock,
  FiCheck,
  FiArrowRight,
  FiBarChart2,
  FiUsers,
  FiCalendar,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { useFundraising } from "../context/FundraisingContext";

const PRESETS = [10, 50, 100, 500, 1000];
const ALLOCATIONS = [
  { label: "Infrastructures Urbaines", pct: 45, color: "emerald" },
  { label: "Projets Énergétiques", pct: 35, color: "blue" },
  { label: "Social & Éducation", pct: 15, color: "indigo" },
  { label: "Fonds de Réserve", pct: 5, color: "slate" },
];

export default function Funding() {
  const { t, theme } = useLang();
  const isDark = theme === "dark";
  const { statistics, fundingGoal, campaigns, addDonation } = useFundraising();
  const [selectedAmount, setSelectedAmount] = useState(100);
  const [customAmount, setCustomAmount] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const goal = fundingGoal;
  const raised = statistics.totalRaised || 0;
  const pct = (raised / goal) * 100;
  const formatMoney = (value) => value >= 1000000 ? `${(value / 1000000).toFixed(value ? 1 : 0)}M USD` : `${value.toLocaleString()} USD`;
  const donationAmount = Number(customAmount || selectedAmount || 0);

  const handleDonation = () => {
    if (donationAmount <= 0) return;
    const activeCampaign = campaigns.find((campaign) => campaign.status === "active") || campaigns[0];
    addDonation(activeCampaign?.id, {
      amount: donationAmount,
      contributor: email || "Visiteur public",
      source: "funding-page",
      message: "Contribution depuis la page financement",
    });
    setSent(true);
    setCustomAmount("");
  };

  return (
    <div
      className={`min-h-screen pt-32 pb-20 transition-colors duration-500 ${isDark ? "bg-[#071426]" : "bg-slate-50"}`}
    >
      {/* Header Section */}
      <section className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <h1
          className={`text-4xl md:text-6xl font-black mb-6 tracking-tighter ${isDark ? "text-white" : "text-slate-900"}`}
        >
          {t("pages.funding.title")}{" "}
          <span className="text-emerald-500">
            {t("pages.funding.titleHighlight")}
          </span>
        </h1>
        <p
          className={`text-lg max-w-2xl mx-auto leading-relaxed ${isDark ? "text-slate-400" : "text-slate-500"}`}
        >
          {t("pages.funding.desc")}
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Progress & Transparency (Left) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Global Progress Card */}
            <div
              className={`p-8 md:p-10 rounded-xl md:rounded-2xl border transition-all duration-500 ${
                isDark
                  ? "bg-white/5 border-white/10 shadow-2xl shadow-black/50"
                  : "bg-white border-slate-200 shadow-xl shadow-slate-200/50"
              }`}
            >
              <h2
                className={`text-xl font-black uppercase tracking-widest mb-10 ${isDark ? "text-white" : "text-slate-900"}`}
              >
                {t("pages.funding.progressTitle")}
              </h2>

              <div className="grid grid-cols-2 gap-6 mb-12">
                {[
                  {
                    label: t("pages.funding.raisedLabel"),
                    val: formatMoney(raised),
                    icon: FiBarChart2,
                  },
                  {
                    label: t("pages.funding.goalLabel"),
                    val: formatMoney(goal),
                    icon: FiShield,
                  },
                  {
                    label: t("pages.funding.backersLabel"),
                    val: statistics.totalContributors.toLocaleString(),
                    icon: FiUsers,
                  },
                  {
                    label: t("pages.funding.daysLeftLabel"),
                    val: t("pages.funding.daysLeftValue"),
                    icon: FiCalendar,
                  },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col">
                    <div className="flex items-center gap-2 mb-2 text-emerald-500 font-black text-xs uppercase tracking-widest">
                      <item.icon size={14} /> {item.label}
                    </div>
                    <div
                      className={`text-2xl font-black ${isDark ? "text-white" : "text-slate-900"}`}
                    >
                      {item.val}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest ${isDark ? "text-slate-500" : "text-slate-400"}`}
                  >
                    Impact Actuel
                  </span>
                  <span className="text-emerald-500 font-black text-xl leading-none">
                    {pct.toFixed(1)}%
                  </span>
                </div>
                <div
                  className={`h-4 w-full rounded-full overflow-hidden p-1 ${isDark ? "bg-white/5" : "bg-slate-100"}`}
                >
                  <div
                    className="h-full rounded-full bg-linear-to-r from-emerald-600 to-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>

            <div
              className={`p-8 md:p-10 rounded-xl md:rounded-2xl border ${isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200"}`}
            >
              <h3
                className={`text-sm font-black uppercase tracking-widest mb-8 ${isDark ? "text-white" : "text-slate-900"}`}
              >
                {t("pages.funding.allocationTitle")}
              </h3>
              <div className="space-y-6">
                {ALLOCATIONS.map((alloc, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider">
                      <span
                        className={isDark ? "text-slate-400" : "text-slate-500"}
                      >
                        {alloc.label}
                      </span>
                      <span className="text-emerald-500">{alloc.pct}%</span>
                    </div>
                    <div
                      className={`h-1.5 w-full rounded-full ${isDark ? "bg-white/5" : "bg-slate-100"}`}
                    >
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{ width: `${alloc.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Donation Form (Right) */}
          <div className="lg:col-span-5">
            <div
              className={`sticky top-32 p-8 md:p-10 rounded-xl md:rounded-2xl border transition-all duration-500 ${
                isDark
                  ? "bg-emerald-950/20 border-emerald-500/20 shadow-2xl"
                  : "bg-white border-slate-200 shadow-xl shadow-slate-200/50"
              }`}
            >
              {sent ? (
                <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-8">
                    <FiCheck size={40} />
                  </div>
                  <h2
                    className={`text-2xl font-black mb-4 ${isDark ? "text-white" : "text-slate-900"}`}
                  >
                    Merci pour votre don !
                  </h2>
                  <p className="text-slate-500 mb-8 text-sm leading-relaxed">
                    Votre contribution a été enregistrée. Un certificat de don
                    officiel vous sera envoyé par email.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="text-emerald-500 font-black text-xs uppercase tracking-widest hover:opacity-70 transition-opacity"
                  >
                    Faire une autre donation
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                      <FiHeart size={20} />
                    </div>
                    <div>
                      <h3
                        className={`font-black text-sm uppercase tracking-widest ${isDark ? "text-white" : "text-slate-900"}`}
                      >
                        Don Citoyen
                      </h3>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        Soutien Direct au Projet
                      </p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {/* Presets */}
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-4">
                        Montant du Don (USD)
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {PRESETS.map((amt) => (
                          <button
                            key={amt}
                            onClick={() => {
                              setSelectedAmount(amt);
                              setCustomAmount("");
                            }}
                            className={`py-3 rounded-xl border-2 font-black text-sm transition-all ${
                              selectedAmount === amt
                                ? "border-emerald-500 bg-emerald-500/10 text-emerald-500 shadow-lg shadow-emerald-500/10"
                                : isDark
                                  ? "border-white/10 text-slate-500 hover:border-white/30"
                                  : "border-slate-100 text-slate-400 hover:border-slate-300"
                            }`}
                          >
                            ${amt}
                          </button>
                        ))}
                        <div
                          className={`flex items-center px-4 rounded-xl border-2 ${isDark ? "border-white/10" : "border-slate-100 focus-within:border-emerald-500"}`}
                        >
                          <span className="text-xs font-bold text-slate-500">
                            $
                          </span>
                          <input
                            type="number"
                            placeholder="..."
                            value={customAmount}
                            onChange={(event) => setCustomAmount(event.target.value)}
                            className="w-full bg-transparent border-none outline-none text-sm font-black p-3"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Quick Info */}
                    <div className="space-y-4">
                      <input
                        type="email"
                        placeholder="votre@email.com"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className={`w-full px-6 py-4 rounded-xl border outline-none transition-all ${
                          isDark
                            ? "bg-white/5 border-white/10 text-white focus:border-emerald-500"
                            : "bg-slate-50 border-slate-200 focus:border-emerald-500 shadow-inner"
                        }`}
                      />
                      <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                        <FiLock className="text-emerald-500 mt-0.5" size={14} />
                        <p className="text-[10px] text-slate-500 leading-relaxed font-bold uppercase tracking-widest">
                          Paiement sécurisé par cryptage SSL 256 bits. Vos
                          données sont protégées.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleDonation}
                      className="w-full py-5 bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] rounded-xl shadow-2xl hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      Confirmer le Don de ${donationAmount.toLocaleString()}
                    </button>

                    <Link
                      to="/investir"
                      className="block text-center text-[10px] font-black text-slate-500 hover:text-emerald-500 uppercase tracking-widest transition-colors"
                    >
                      Plutôt devenir investisseur ?{" "}
                      <FiArrowRight className="inline" />
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
