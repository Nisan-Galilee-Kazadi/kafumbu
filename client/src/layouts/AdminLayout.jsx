import { useState } from "react";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  Link,
} from "react-router-dom";
import {
  FiBarChart2,
  FiBell,
  FiChevronRight,
  FiCreditCard,
  FiExternalLink,
  FiGrid,
  FiLogOut,
  FiMenu,
  FiSearch,
  FiSettings,
  FiMoon,
  FiSun,
  FiUsers,
  FiX,
  FiFileText,
  FiTarget,
  FiTrendingUp,
  FiDollarSign,
  FiMessageSquare,
} from "react-icons/fi";
import { getAdminName, logoutAdmin } from "../utils/adminAuth";
import { useLang } from "../context/LangContext";

const NAV = [
  { to: "/admin/dashboard", label: "Vue d'ensemble", icon: FiGrid },
  { to: "/admin/utilisateurs", label: "Utilisateurs", icon: FiUsers },
  { to: "/admin/paiements", label: "Paiements", icon: FiCreditCard },
  { to: "/admin/investisseurs", label: "Investisseurs", icon: FiTrendingUp },
  { to: "/admin/campagnes", label: "Campagnes", icon: FiTarget },
  {
    to: "/admin/levées-de-fonds",
    label: "Levées de fonds",
    icon: FiDollarSign,
  },
  { to: "/admin/publications", label: "Publications", icon: FiFileText },
  { to: "/admin/media", label: "Medias", icon: FiGrid },
  { to: "/admin/notifications", label: "Notifications", icon: FiBell },
  { to: "/admin/messagerie", label: "Messagerie", icon: FiMessageSquare },
  { to: "/admin/recherche", label: "Recherche", icon: FiSearch },
  { to: "/admin/statistiques", label: "Statistiques", icon: FiBarChart2 },
  { to: "/admin/parametres", label: "Paramètres", icon: FiSettings },
];

const PAGE_TITLES = {
  "/admin/dashboard": "Tableau de bord",
  "/admin/utilisateurs": "Gestion des utilisateurs",
  "/admin/paiements": "Paiements & transactions",
  "/admin/investisseurs": "Investisseurs",
  "/admin/campagnes": "Campagnes de levée",
  "/admin/levées-de-fonds": "Levées de fonds",
  "/admin/publications": "Publications & actualités",
  "/admin/media": "Medias",
  "/admin/notifications": "Notifications",
  "/admin/messagerie": "Messagerie Outlook",
  "/admin/recherche": "Recherche",
  "/admin/statistiques": "Statistiques détaillées",
  "/admin/parametres": "Paramètres",
};

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const adminName = getAdminName();
  const pageTitle = PAGE_TITLES[location.pathname] || "Admin";
  const { theme, toggleTheme } = useLang();
  const isDark = theme === "dark";

  const onLogout = () => {
    logoutAdmin();
    navigate("/admin/login", { replace: true });
  };

  const navCls = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
      isActive
        ? isDark
          ? "bg-emerald-600/25 text-emerald-300 shadow-[inset_0_0_0_1px_rgba(52,211,153,0.25)]"
          : "bg-[#63b32e]/15 text-[#0f70b7] shadow-[inset_0_0_0_1px_rgba(99,179,46,0.25)]"
        : isDark
          ? "text-slate-400 hover:bg-white/5 hover:text-white"
          : "text-slate-600 hover:bg-[#0f70b7]/5 hover:text-[#0f70b7]"
    }`;

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${isDark ? "bg-[#071426] text-white" : "bg-slate-50 text-slate-900"}`}
    >
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Fermer le menu"
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-[260px] flex-col border-r transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${isDark ? "border-white/10 bg-[#08172B]" : "border-slate-200 bg-white"}`}
      >
        <div
          className={`flex h-16 items-center justify-between border-b px-4 ${isDark ? "border-white/10" : "border-slate-200"}`}
        >
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-2 font-black tracking-tight"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#63b32e] text-sm text-white">
              KSC
            </span>
            <span className="text-sm leading-tight">
              Admin
              <span
                className={`block text-[10px] font-bold uppercase tracking-widest ${isDark ? "text-slate-500" : "text-slate-400"}`}
              >
                Console
              </span>
            </span>
          </Link>
          <button
            type="button"
            className={`rounded-lg p-2 lg:hidden ${isDark ? "text-slate-400 hover:bg-white/10" : "text-slate-500 hover:bg-slate-100"}`}
            onClick={() => setSidebarOpen(false)}
          >
            <FiX size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          <p
            className={`mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.2em] ${isDark ? "text-slate-500" : "text-slate-400"}`}
          >
            Navigation
          </p>
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={navCls}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={18} className="shrink-0 opacity-90" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div
          className={`border-t p-3 ${isDark ? "border-white/10" : "border-slate-200"}`}
        >
          <Link
            to="/"
            className={`mb-2 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${isDark ? "text-slate-400 hover:bg-white/5 hover:text-white" : "text-slate-600 hover:bg-[#0f70b7]/5 hover:text-[#0f70b7]"}`}
            onClick={() => setSidebarOpen(false)}
          >
            <FiExternalLink size={18} />
            Site public
          </Link>
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-red-500 hover:text-white"
          >
            <FiLogOut size={18} />
            Déconnexion
          </button>
        </div>
      </aside>

      <div className="lg:pl-[260px]">
        <header
          className={`sticky top-0 z-30 flex h-16 items-center gap-3 border-b px-4 backdrop-blur-md sm:px-6 ${isDark ? "border-white/10 bg-[#0B1D35]/95" : "border-slate-200 bg-white/90"}`}
        >
          <button
            type="button"
            className={`rounded-lg p-2 lg:hidden ${isDark ? "text-slate-300 hover:bg-white/10" : "text-slate-600 hover:bg-slate-100"}`}
            onClick={() => setSidebarOpen(true)}
            aria-label="Ouvrir le menu"
          >
            <FiMenu size={22} />
          </button>

          <div
            className={`hidden min-w-0 flex-1 items-center gap-2 text-sm sm:flex ${isDark ? "text-slate-500" : "text-slate-500"}`}
          >
            <span>Admin</span>
            <FiChevronRight size={14} className="shrink-0 opacity-60" />
            <span
              className={`truncate font-semibold ${isDark ? "text-slate-200" : "text-slate-800"}`}
            >
              {pageTitle}
            </span>
          </div>

          <form
            className="relative hidden max-w-xs flex-1 md:block lg:max-w-md"
            onSubmit={(event) => {
              event.preventDefault();
              const value = new FormData(event.currentTarget).get("q");
              if (String(value || "").trim()) {
                navigate(`/admin/recherche?q=${encodeURIComponent(value)}`);
              }
            }}
          >
            <FiSearch
              className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-slate-500" : "text-slate-400"}`}
              size={16}
            />
            <input
              name="q"
              type="search"
              placeholder="Rechercher…"
              className={`w-full rounded-xl border py-2 pl-10 pr-3 text-sm outline-none placeholder:text-slate-500 focus:border-[#63b32e]/60 ${isDark ? "border-white/10 bg-[#08172B] text-white" : "border-slate-200 bg-slate-50 text-slate-900"}`}
            />
          </form>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              className={`rounded-xl p-2 transition ${isDark ? "text-amber-200 hover:bg-white/10" : "text-slate-500 hover:bg-slate-100"}`}
              onClick={toggleTheme}
              aria-label={
                isDark ? "Activer le mode clair" : "Activer le mode sombre"
              }
            >
              {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/notifications")}
              className={`relative rounded-xl p-2 transition ${isDark ? "text-slate-400 hover:bg-white/10 hover:text-white" : "text-slate-500 hover:bg-slate-100 hover:text-[#0f70b7]"}`}
              aria-label="Notifications"
            >
              <FiBell size={20} />
              <span
                className={`absolute right-1 top-1 h-2 w-2 rounded-full bg-[#63b32e] ring-2 ${isDark ? "ring-[#0B1D35]" : "ring-white"}`}
              />
            </button>
            <div
              className={`hidden h-8 w-px sm:block ${isDark ? "bg-white/15" : "bg-slate-200"}`}
            />
            <div
              className={`flex items-center gap-2 rounded-xl border py-1.5 pl-2 pr-3 ${isDark ? "border-white/10 bg-[#08172B]" : "border-slate-200 bg-white"}`}
            >
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#63b32e] text-xs font-black text-white">
                {adminName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden min-w-0 sm:block">
                <p
                  className={`truncate text-xs font-bold leading-tight ${isDark ? "text-white" : "text-slate-900"}`}
                >
                  {adminName}
                </p>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-[#63b32e]">
                  Super admin
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6">
          <div className="mb-6 md:hidden">
            <h1
              className={`text-lg font-black ${isDark ? "text-white" : "text-slate-900"}`}
            >
              {pageTitle}
            </h1>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
