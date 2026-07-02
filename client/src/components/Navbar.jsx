import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLang } from "../context/LangContext";
import { HiMenu, HiX } from "react-icons/hi";
import {
  FiGlobe,
  FiSearch,
  FiUser,
  FiArrowRight,
  FiMoon,
  FiSun,
} from "react-icons/fi";
import { getCurrentUser } from "../utils/userAuth";

const NAV_LINKS = [
  { key: "home", path: "/" },
  { key: "about", path: "/a-propos" },
  { key: "smartCity", path: "/smart-city" },
  {
    key: "project",
    path: "/projet/habitation",
    subLinks: [
      { key: "habitation", path: "/projet/habitation" },
      { key: "hopitaux", path: "/projet/hopitaux" },
      { key: "ecoles", path: "/projet/ecoles" },
      { key: "grandMarche", path: "/projet/grand-marche" },
      { key: "tourisme", path: "/projet/tourisme" },
      { key: "culture", path: "/projet/culture-perenne" },
      { key: "elevage", path: "/projet/elevage-laitier" },
    ],
  },
  { key: "barrage", path: "/barrage" },
  { key: "funding", path: "/financement" },
  {
    key: "media",
    path: "/medias/blog",
    subLinks: [
      { key: "blog", path: "/medias/blog" },
      { key: "gallery", path: "/medias/galerie" },
    ],
  },
  { key: "partners", path: "/partenaires" },
  { key: "contact", path: "/contact" },
];

const KscLogo = ({ isDark = false }) => (
  <div className="ksc-nav-logo relative w-24 h-24 flex items-center justify-center group cursor-pointer transition-transform duration-500">
    {/* Diamond (Losange) Background */}
    <svg
      className={`ksc-nav-logo-mark absolute inset-0 w-full h-full transition-all duration-500 ease-in-out group-hover:scale-105 ${isDark ? "text-white" : "text-[#0B1526]"}`}
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
    >
      {/* Main outer stroke with SOLID FILL */}
      <path
        d="M50 5 L95 50 L50 95 L5 50 Z"
        strokeWidth="2.5"
        strokeLinejoin="miter"
        fill="transparent"
      />
      {/* Decorative inner lines */}
      <path
        d="M50 18 L82 50 L50 82 L18 50 Z"
        strokeWidth="1"
        strokeDasharray="4 2"
        opacity="0.4"
        fill="none"
      />
      {/* Vertical architectural line */}
      <path d="M50 5 L50 95" strokeWidth="0.5" opacity="0.15" fill="none" />
    </svg>

    {/* Refined Brand Text */}
    <div className="relative z-10 flex flex-col items-center pt-2">
      <span className="ksc-nav-logo-text text-emerald-600 font-black text-[22px] leading-tight tracking-tighter drop-shadow-md">
        KMC
      </span>
      <div className="w-8 h-[2px] bg-emerald-600/30 -mt-0.5" />
      <span
        className={`${isDark ? "text-white" : "text-[#0B1526]"} font-bold text-[8px] tracking-[0.15em] uppercase opacity-80 mt-1.5`}
      >
        Kafumbu
      </span>
    </div>
  </div>
);

export default function Navbar() {
  const { t, lang, setLanguage, theme, toggleTheme } = useLang();
  const isDark = theme === "dark";
  const currentUser = getCurrentUser();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Search animation state
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(null);

  // Scroll behavior
  const [showNavbarLinks, setShowNavbarLinks] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchQuery(params.get("q") || "");
  }, [location.search]);

  useEffect(() => {
    if (searchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchExpanded]);

  // Fermer la recherche lors du changement de page (sauf vers les résultats)
  useEffect(() => {
    if (location.pathname !== "/search-results") {
      setSearchExpanded(false);
      setSearchQuery("");
    }
  }, [location.pathname]);

  // Recherche en temps réel - mise à jour automatique
  useEffect(() => {
    const query = searchQuery.trim();

    if (!query || !searchExpanded) return;

    const timer = setTimeout(() => {
      const target = `/search-results?q=${encodeURIComponent(query)}`;
      const current = `${window.location.pathname}${window.location.search}`;

      if (
        current !== target &&
        window.location.pathname === "/search-results"
      ) {
        navigate(target, { replace: true });
      } else if (current !== target) {
        navigate(target);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [searchExpanded, searchQuery, navigate]);

  const submitSearch = () => {
    const query = searchQuery.trim();

    if (query) {
      navigate(`/search-results?q=${encodeURIComponent(query)}`);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 10);

      if (currentScrollY > lastScrollY && currentScrollY > 150) {
        setShowNavbarLinks(false); // Hide links on scroll down
      } else {
        setShowNavbarLinks(true); // Show links on scroll up
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ease-in-out ${
          isDark ? "bg-[#071426] text-white" : "bg-white text-slate-900"
        } ${scrolled ? "shadow-[0_4px_20px_rgba(0,0,0,0.12)]" : ""}`}
      >
        {/* ── TOP ROW ── */}
        <div
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between lg:grid lg:grid-cols-3 gap-6 relative z-50 transition-colors duration-500 border-b-[3px] ${
            isDark ? "bg-[#071426] border-white" : "bg-white border-[#0B1526]"
          }`}
        >
          {/* Left Column: Unified Search & Theme (Mobile Order 1) */}
          <div
            className={`flex items-center justify-start order-1 transition-all duration-500 ${searchExpanded ? "flex-10 absolute inset-0 z-60 px-4 lg:relative lg:inset-auto lg:flex-none lg:px-0" : "flex-1 lg:flex-none gap-2"}`}
          >
            {/* Search Container */}
            <div
              className={`relative flex items-center transition-all duration-500 ${searchExpanded ? "w-full h-full lg:w-auto" : "w-auto"}`}
            >
              {/* Backdrop Blur when searching on Mobile */}
              {searchExpanded && (
                <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-xl lg:hidden -mx-4" />
              )}

              <div
                className={`group relative flex items-center transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                  searchExpanded
                    ? `${isDark ? "bg-white" : "bg-slate-900 shadow-2xl"} ${searchExpanded ? "w-full lg:w-[320px]" : "w-11"} rounded-xl h-11`
                    : `w-11 h-11 rounded-full ${isDark ? "bg-white/10 hover:bg-white/20" : "bg-slate-100 hover:bg-slate-200"}`
                }`}
              >
                {/* Search Icon / Toggle */}
                <button
                  type="button"
                  onClick={() => !searchExpanded && setSearchExpanded(true)}
                  className={`flex w-11 h-11 items-center justify-center shrink-0 z-20 transition-colors duration-500 ${
                    searchExpanded
                      ? isDark
                        ? "text-slate-900"
                        : "text-white"
                      : isDark
                        ? "text-white"
                        : "text-slate-600"
                  }`}
                >
                  <FiSearch size={20} strokeWidth={2.5} />
                </button>

                {/* Expanding Input */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    submitSearch();
                  }}
                  className="flex-1 flex items-center"
                >
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t("ui.navbar.search")}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        setSearchQuery("");
                        setSearchExpanded(false);
                      }
                    }}
                    className={`w-full bg-transparent border-none outline-none text-sm font-bold transition-all duration-500 ${
                      searchExpanded
                        ? `opacity-100 pr-4 ${isDark ? "text-slate-900" : "text-white"}`
                        : "opacity-0 w-0 pointer-events-none"
                    }`}
                  />
                </form>

                {/* Close Button (Visible only when expanded) */}
                {searchExpanded && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSearchExpanded(false);
                    }}
                    className={`p-3 z-20 ${isDark ? "text-slate-400 hover:text-slate-900" : "text-white/60 hover:text-white"}`}
                  >
                    <HiX size={18} />
                  </button>
                )}
              </div>

              {/* Desktop Desktop Contact Info (Only when NOT searching) */}
              {!searchExpanded && (
                <div className="hidden lg:flex flex-col ml-4 transition-opacity duration-300">
                  <span
                    className={`text-[10px] font-bold tracking-tight ${isDark ? "text-slate-400" : "text-slate-500"}`}
                  >
                    +243 XXX XXX XXX
                  </span>
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">
                    contact@Kafumbu.cd
                  </span>
                </div>
              )}
            </div>

            {/* Theme Toggle (Mobile: Left of Logo, Desktop: Normal) */}
            {!searchExpanded && (
              <button
                onClick={toggleTheme}
                className={`flex items-center justify-center transition-all p-2 rounded-lg ${
                  isDark
                    ? "text-amber-200 hover:bg-white/10"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
              </button>
            )}
          </div>

          {/* Center Column: Logo (Mobile Order 2) */}
          <div
            className={`flex items-center justify-center order-2 flex-1 lg:flex-none relative h-10 z-110 transition-opacity duration-300 ${searchExpanded ? "opacity-0 lg:opacity-100 pointer-events-none lg:pointer-events-auto" : "opacity-100"}`}
          >
            <Link
              to="/"
              className="no-underline transition-transform duration-300 hover:scale-105 absolute left-1/2 top-[-10px] lg:top-[-20px] z-110 -translate-x-1/2"
            >
              <KscLogo isDark={isDark} />
            </Link>

            <div className="absolute bottom-[-32px] left-1/2 -translate-x-1/2 w-36 h-10 pointer-events-none z-10 hidden lg:block">
              <svg
                viewBox="0 0 100 40"
                preserveAspectRatio="none"
                className="w-full h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.08)]"
              >
                <path
                  d="M0 0 L50 40 L100 0 Z"
                  fill={isDark ? "#071426" : "white"}
                />
                <path
                  d="M0 0 L50 40 L100 0"
                  fill="none"
                  stroke={isDark ? "rgba(255,255,255,0.15)" : "#F1F5F9"}
                  strokeWidth="1.5"
                />
              </svg>
            </div>
          </div>

          {/* Right Column: Actions (Mobile Order 3) */}
          <div
            className={`flex items-center justify-end gap-2 order-3 flex-1 lg:flex-none transition-opacity duration-300 ${searchExpanded ? "opacity-0 lg:opacity-100 pointer-events-none lg:pointer-events-auto" : "opacity-100"}`}
          >
            {/* Custom Language Select */}
            <div className="relative group">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className={`flex items-center justify-center w-[38px] h-[38px] transition-all rounded-full font-black text-[11px] uppercase tracking-widest ${
                  isDark
                    ? "bg-white/10 text-white hover:bg-white/20"
                    : "bg-slate-100 text-emerald-600 hover:bg-slate-200"
                }`}
              >
                <span>{lang}</span>
              </button>

              {/* Dropdown Menu */}
              {langMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setLangMenuOpen(false)}
                  />
                  <div
                    className={`absolute right-0 mt-2 min-w-[80px] rounded-xl shadow-2xl border z-20 overflow-hidden transition-all animate-in fade-in zoom-in-95 duration-200 ${
                      isDark
                        ? "bg-[#071426] border-white/10 shadow-black/40"
                        : "bg-white border-slate-100 shadow-slate-200/50"
                    }`}
                  >
                    {[
                      { code: "fr", label: "Français", flag: "🇫🇷" },
                      { code: "en", label: "English", flag: "🇬🇧" },
                      { code: "es", label: "Español", flag: "🇪🇸" },
                      { code: "sw", label: "Kiswahili", flag: "🇨🇩" },
                      { code: "zh", label: "中文", flag: "🇨🇳" },
                    ].map((item) => (
                      <button
                        key={item.code}
                        onClick={() => {
                          setLanguage(item.code);
                          setLangMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-[11px] font-bold uppercase tracking-widest transition-colors ${
                          lang === item.code
                            ? "text-emerald-500 bg-emerald-500/5"
                            : isDark
                              ? "text-slate-300 hover:bg-white/5"
                              : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <span className="text-sm">{item.flag}</span>
                        <span className="flex-1 text-left">{item.label}</span>
                        {lang === item.code && (
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Desktop Only Connexion */}
            {currentUser ? (
              <Link
                to={
                  currentUser.role === "admin"
                    ? "/admin/dashboard"
                    : "/dashboard"
                }
                className={`hidden lg:flex items-center gap-2 px-5 py-2.5 text-xs font-black transition-all rounded-lg border ${
                  isDark
                    ? "text-emerald-400 border-emerald-500/25 bg-emerald-500/5 hover:bg-emerald-500/10"
                    : "text-emerald-700 border-emerald-600/20 bg-emerald-50 hover:bg-emerald-100"
                }`}
              >
                <FiUser size={18} />{" "}
                {currentUser.name.split(" ")[0].toUpperCase()}
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className={`hidden lg:flex items-center gap-2 px-5 py-2.5 text-xs font-bold transition-all rounded-lg border ${
                  isDark
                    ? "text-slate-300 border-white/10 hover:text-white hover:bg-white/5"
                    : "text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <FiUser size={18} /> CONNEXION
              </Link>
            )}

            {/* Desktop Only Investir */}
            <Link
              to="/investir"
              className="hidden lg:flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-lg shadow-lg hover:bg-black hover:-translate-y-0.5 transition-all uppercase tracking-widest border border-white/10"
            >
              {t("nav.invest")} <FiArrowRight size={14} />
            </Link>

            {/* Mobile Menu Toggle (Correctly hidden on LG) */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                isDark
                  ? "bg-white/10 text-white hover:bg-white/15"
                  : "bg-slate-50 text-[#0B1526] hover:bg-slate-100"
              }`}
            >
              {menuOpen ? <HiX size={22} /> : <HiMenu size={22} />}
            </button>
          </div>
        </div>

        {/* ── BOTTOM ROW (Desktop Nav Links) ── */}
        <div
          className={`hidden lg:block border-t transition-all duration-500 ${
            showNavbarLinks
              ? "max-h-20 opacity-100 overflow-visible"
              : "max-h-0 opacity-0 overflow-hidden"
          } ${isDark ? "bg-[#071426] border-white/5 shadow-[0_20px_40px_rgba(0,0,0,0.4)]" : "bg-white border-slate-100 shadow-[0_20px_40px_rgba(0,0,0,0.03)]"}`}
        >
          <div className="max-w-7xl mx-auto px-8 py-4">
            <nav className="flex items-center justify-center gap-12">
              {NAV_LINKS.map((link) => {
                const isActive =
                  location.pathname === link.path ||
                  (link.subLinks &&
                    link.subLinks.some((s) => location.pathname === s.path));

                return (
                  <div key={link.key} className="relative group/nav">
                    {link.subLinks ? (
                      <div
                        className={`text-[11px] font-black uppercase tracking-[0.2em] cursor-default transition-all hover:text-emerald-500 relative flex items-center gap-2 py-2 ${
                          isActive
                            ? isDark
                              ? "text-white"
                              : "text-slate-900"
                            : isDark
                              ? "text-slate-400"
                              : "text-slate-500"
                        }`}
                      >
                        {isActive && (
                          <span className="absolute -left-4 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                        )}
                        {t(`nav.${link.key}`)}
                        <svg
                          className="w-3 h-3 opacity-50 group-hover/nav:rotate-180 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                        <span
                          className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover/nav:w-full ${isActive ? "w-full" : ""}`}
                        />
                      </div>
                    ) : (
                      <Link
                        to={link.path}
                        className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:text-emerald-500 relative flex items-center gap-2 py-2 ${
                          isActive
                            ? isDark
                              ? "text-white"
                              : "text-slate-900"
                            : isDark
                              ? "text-slate-400"
                              : "text-slate-500"
                        }`}
                      >
                        {isActive && (
                          <span className="absolute -left-4 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                        )}
                        {t(`nav.${link.key}`)}
                        <span
                          className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover/nav:w-full ${isActive ? "w-full" : ""}`}
                        />
                      </Link>
                    )}

                    {/* Desktop Dropdown */}
                    {link.subLinks && (
                      <div
                        className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 translate-y-2 pointer-events-none group-hover/nav:opacity-100 group-hover/nav:translate-y-0 group-hover/nav:pointer-events-auto transition-all duration-300 z-50`}
                      >
                        <div
                          className={`w-48 rounded-xl shadow-2xl border p-2 ${isDark ? "bg-[#071426] border-white/10 shadow-black/40" : "bg-white border-slate-100 shadow-slate-200/50"}`}
                        >
                          {link.subLinks.map((sub) => (
                            <Link
                              key={sub.key}
                              to={sub.path}
                              className={`block w-full px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] rounded-lg transition-colors ${
                                location.pathname === sub.path
                                  ? "text-emerald-500 bg-emerald-500/5"
                                  : isDark
                                    ? "text-slate-300 hover:bg-white/5"
                                    : "text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              {t(`nav.${sub.key}`)}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main spacer to prevent content jumping under fixed header */}
      <div className="h-[68px] lg:h-[120px]" />

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          className={`fixed inset-0 top-[68px] z-99 lg:hidden overflow-y-auto ${isDark ? "bg-[#071426] text-white" : "bg-white"}`}
        >
          <div className="p-4 flex flex-col h-full">
            <div className="flex flex-col p-4 overflow-y-auto">
              {NAV_LINKS.map((link) => (
                <div key={link.key}>
                  {link.subLinks ? (
                    <div className="mb-1">
                      <button
                        onClick={() =>
                          setMobileSubmenuOpen(
                            mobileSubmenuOpen === link.key ? null : link.key,
                          )
                        }
                        className={`w-full py-4 px-4 text-sm font-bold tracking-widest uppercase rounded-xl flex items-center justify-between transition-all ${
                          link.subLinks.some(
                            (s) => location.pathname === s.path,
                          )
                            ? isDark
                              ? "text-white bg-white/10"
                              : "text-white bg-slate-900"
                            : isDark
                              ? "text-slate-300 hover:bg-white/5"
                              : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {t(`nav.${link.key}`)}
                        <svg
                          className={`w-4 h-4 transition-transform duration-300 ${mobileSubmenuOpen === link.key ? "rotate-180" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-300 ${mobileSubmenuOpen === link.key ? "max-h-60 mt-2" : "max-h-0"}`}
                      >
                        {link.subLinks.map((sub) => (
                          <Link
                            key={sub.key}
                            to={sub.path}
                            onClick={() => setMenuOpen(false)}
                            className={`py-4 px-8 text-sm font-bold tracking-widest uppercase rounded-xl mb-1 flex items-center gap-3 transition-all ${
                              location.pathname === sub.path
                                ? isDark
                                  ? "text-white bg-white/10"
                                  : "text-white bg-slate-800"
                                : isDark
                                  ? "text-slate-400 hover:bg-white/5"
                                  : "text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            <div
                              className={`w-1.5 h-1.5 rounded-full ${location.pathname === sub.path ? "bg-emerald-500" : "bg-slate-500/30"}`}
                            />
                            {t(`nav.${sub.key}`)}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={link.path}
                      onClick={() => setMenuOpen(false)}
                      className={`py-4 px-4 text-sm font-bold tracking-widest uppercase rounded-xl mb-1 flex items-center transition-all ${
                        location.pathname === link.path
                          ? isDark
                            ? "text-white bg-white/10"
                            : "text-white bg-slate-900"
                          : isDark
                            ? "text-slate-300 hover:bg-white/5"
                            : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {t(`nav.${link.key}`)}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 px-6 pb-8 mt-auto">
              {currentUser ? (
                <Link
                  to={
                    currentUser.role === "admin"
                      ? "/admin/dashboard"
                      : "/dashboard"
                  }
                  onClick={() => setMenuOpen(false)}
                  className={`py-4 flex items-center justify-center gap-2 border font-bold text-sm uppercase tracking-widest rounded-xl shadow-sm ${
                    isDark
                      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700"
                  }`}
                >
                  <FiUser size={18} /> {currentUser.name.toUpperCase()}
                </Link>
              ) : (
                <Link
                  to="/admin/login"
                  onClick={() => setMenuOpen(false)}
                  className={`py-4 flex items-center justify-center gap-2 border font-bold text-sm uppercase tracking-widest rounded-xl shadow-sm ${
                    isDark
                      ? "border-white/10 bg-white/5 text-white"
                      : "border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  <FiUser size={18} /> CONNEXION
                </Link>
              )}

              <Link
                to="/investir"
                className="w-full py-4 flex items-center justify-center gap-2 bg-slate-900 text-white font-bold text-sm uppercase tracking-widest rounded-xl shadow-lg border border-white/10"
              >
                {t("nav.invest")} <FiArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
