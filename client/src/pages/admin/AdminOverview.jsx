import { useMemo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiBarChart2,
  FiDollarSign,
  FiDroplet,
  FiHome,
  FiTrendingUp,
  FiUserCheck,
} from "react-icons/fi";
import { useLang } from "../../context/LangContext";
import { getAdminName } from "../../utils/adminAuth";
import { statsService } from "../../services/adminService";
import { useFundraising } from "../../context/FundraisingContext";

export default function AdminOverview() {
  const adminName = getAdminName();
  const { theme } = useLang();
  const isDark = theme === "dark";
  const { statistics, campaigns } = useFundraising();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await statsService.getStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = useMemo(
    () => [
      {
        icon: FiDollarSign,
        label: "Total collecte",
        value: `${statistics.totalRaised.toLocaleString()} USD`,
        trend: "Real-time",
        href: "/admin/paiements",
      },
      {
        icon: FiTrendingUp,
        label: "Utilisateurs",
        value: stats?.users || 0,
        trend: "+0",
        href: "/admin/utilisateurs",
      },
      {
        icon: FiUserCheck,
        label: "Campagnes actives",
        value: campaigns.filter((campaign) => campaign.status === "active").length,
        trend: "Live",
        href: "/admin/campagnes",
      },
      {
        icon: FiHome,
        label: "Publications",
        value: stats?.publishedNews || 0,
        trend: "Live",
        href: "/admin/publications",
      },
      {
        icon: FiDroplet,
        label: "Medias",
        value: stats?.totalMedia || 0,
        trend: "Live",
        href: "/admin/media",
      },
      {
        icon: FiBarChart2,
        label: "Statut",
        value: "Operationnel",
        trend: "Online",
        href: "#",
      },
    ],
    [stats, statistics.totalRaised, campaigns],
  );

  return (
    <div className="space-y-8">
      <div
        className={`rounded-2xl border p-6 shadow-xl sm:p-8 ${isDark ? "border-white/10 bg-gradient-to-br from-[#0B1D35] to-[#08172B]" : "border-slate-200 bg-gradient-to-br from-white to-[#e8f7ef]"}`}
      >
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#63b32e]">
          Vue d'ensemble
        </p>
        <h2
          className={`mt-2 text-2xl font-black sm:text-3xl ${isDark ? "text-white" : "text-[#0f70b7]"}`}
        >
          Bonjour, {adminName}
        </h2>
        <p
          className={`mt-2 max-w-2xl text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}
        >
          Supervision du projet Kafumbu Smart City : gestion des utilisateurs,
          campagnes, publications, media et parametres depuis ce tableau de bord
          en temps reel.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/admin/campagnes"
            className="inline-flex items-center gap-2 rounded-xl bg-[#63b32e] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#529426]"
          >
            Gerer les campagnes <FiArrowRight size={16} />
          </Link>
          <Link
            to="/admin/publications"
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${isDark ? "border-white/15 text-slate-200 hover:bg-white/5" : "border-[#0f70b7]/20 text-[#0f70b7] hover:bg-[#0f70b7]/5"}`}
          >
            Nouvelle publication
          </Link>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(({ icon: Icon, label, value, trend, href }) => (
          <Link
            key={label}
            to={href}
            className={`group rounded-xl border p-5 transition hover:border-[#63b32e]/40 hover:shadow-[0_0_0_1px_rgba(99,179,46,0.15)] ${isDark ? "border-white/10 bg-[#0B1D35]" : "border-slate-200 bg-white shadow-sm"}`}
          >
            <div className="flex items-start justify-between gap-3">
              <Icon className="text-[#63b32e]" size={22} />
              <span className="rounded-full bg-[#63b32e]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#63b32e]">
                {trend}
              </span>
            </div>
            <p className="mt-4 text-xs uppercase tracking-wider text-slate-500">
              {label}
            </p>
            <p
              className={`mt-1 text-2xl font-black ${isDark ? "text-white" : "text-slate-900"}`}
            >
              {typeof value === "number" ? value.toLocaleString() : value}
            </p>
            <p className="mt-2 text-xs font-semibold text-slate-500 group-hover:text-[#63b32e]">
              Voir -&gt;
            </p>
          </Link>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section
          className={`rounded-xl border p-6 ${isDark ? "border-white/10 bg-[#0B1D35]" : "border-slate-200 bg-white shadow-sm"}`}
        >
          <div className="mb-4 flex items-center justify-between">
            <h3
              className={`font-bold ${isDark ? "text-white" : "text-slate-900"}`}
            >
              Vue d'ensemble des donnees
            </h3>
            <span className="text-xs font-bold text-[#63b32e]">Live</span>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className={isDark ? "text-slate-400" : "text-slate-600"}>
                Utilisateurs inscrits
              </span>
              <span
                className={`font-mono font-semibold ${isDark ? "text-slate-200" : "text-slate-800"}`}
              >
                {stats?.users || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className={isDark ? "text-slate-400" : "text-slate-600"}>
                Total des dons
              </span>
              <span
                className={`font-mono font-semibold ${isDark ? "text-slate-200" : "text-slate-800"}`}
              >
                ${statistics.totalRaised.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className={isDark ? "text-slate-400" : "text-slate-600"}>
                Campagnes actives
              </span>
              <span
                className={`font-mono font-semibold ${isDark ? "text-slate-200" : "text-slate-800"}`}
              >
                {campaigns.filter((campaign) => campaign.status === "active").length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className={isDark ? "text-slate-400" : "text-slate-600"}>
                Publications publiees
              </span>
              <span
                className={`font-mono font-semibold ${isDark ? "text-slate-200" : "text-slate-800"}`}
              >
                {stats?.publishedNews || 0}
              </span>
            </div>
          </div>
        </section>

        <section
          className={`rounded-xl border p-6 ${isDark ? "border-white/10 bg-[#0B1D35]" : "border-slate-200 bg-white shadow-sm"}`}
        >
          <h3
            className={`mb-4 font-bold ${isDark ? "text-white" : "text-slate-900"}`}
          >
            Actions rapides
          </h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              { label: "Utilisateurs", to: "/admin/utilisateurs" },
              { label: "Campagnes", to: "/admin/campagnes" },
              { label: "Publications", to: "/admin/publications" },
              { label: "Medias", to: "/admin/media" },
            ].map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                className={`rounded-lg border px-4 py-3 text-sm font-semibold transition hover:border-[#63b32e]/40 ${isDark ? "border-white/10 bg-[#08172B] text-slate-200 hover:text-white" : "border-slate-200 bg-slate-50 text-slate-700 hover:text-[#0f70b7]"}`}
              >
                {label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
