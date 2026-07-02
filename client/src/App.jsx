import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  Outlet,
  Link,
} from "react-router-dom";
import { useEffect } from "react";
import { LangProvider, useLang } from "./context/LangContext";
import { FundraisingProvider } from "./context/FundraisingContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchHighlightProvider from "./components/SearchHighlightProvider";
import Home from "./pages/Home";
import SmartCity from "./pages/SmartCity";
import Barrage from "./pages/Barrage";
import Invest from "./pages/Invest";
import Funding from "./pages/Funding";
import Blog from "./pages/Blog";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Project from "./pages/Project";
import Transparence from "./pages/Transparence";
import Partenaires from "./pages/Partenaires";
import AdminLogin from "./pages/AdminLogin";
import VisitorDashboard from "./pages/VisitorDashboard";
import SearchResults from "./pages/SearchResults";
import AdminLayout from "./layouts/AdminLayout";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminInvestors from "./pages/admin/AdminInvestors";
import AdminCampaigns from "./pages/admin/AdminCampaigns";
import AdminPublications from "./pages/admin/AdminPublications";
import AdminStats from "./pages/admin/AdminStats";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminFundraising from "./pages/admin/AdminFundraising";
import AdminMedia from "./pages/admin/AdminMedia";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminSearch from "./pages/admin/AdminSearch";
import AdminMessages from "./pages/admin/AdminMessages";
import Fundraising from "./pages/Fundraising";
import FundraisingModal from "./components/FundraisingModal";
import { isAdminAuthenticated } from "./utils/adminAuth";
import { FaWhatsapp, FaChartLine, FaFilePdf } from "react-icons/fa";

function AdminProtectedRoute() {
  const location = useLocation();
  if (!isAdminAuthenticated()) {
    return (
      <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
    );
  }
  return <Outlet />;
}

function AppLayout() {
  const location = useLocation();
  const { theme } = useLang();
  const isDark = theme === "dark";
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isDashboardRoute = location.pathname === "/dashboard";
  const isPrivateWorkspace = isAdminRoute || isDashboardRoute;

  // Remonter en haut de la page lors d'un changement de route (sauf si recherche)
  useEffect(() => {
    if (!location.search.includes("q=")) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.search]);

  return (
    <div
      className={`flex flex-col min-h-screen transition-colors duration-500 ${isDark ? "bg-[#071426]" : "bg-white"}`}
    >
      {!isPrivateWorkspace && <Navbar />}
      <div key={location.pathname} className="page-flow flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/smart-city" element={<SmartCity />} />
          <Route path="/barrage" element={<Barrage />} />
          <Route path="/investir" element={<Invest />} />
          <Route path="/financement" element={<Funding />} />
          <Route path="/levée-de-fonds" element={<Fundraising />} />
          <Route path="/levée-de-fonds/:id" element={<Fundraising />} />
          <Route
            path="/medias"
            element={<Navigate to="/medias/blog" replace />}
          />
          <Route path="/medias/blog" element={<Blog />} />
          <Route path="/medias/galerie" element={<Gallery />} />
          <Route path="/transparence" element={<Transparence />} />
          <Route path="/partenaires" element={<Partenaires />} />
          <Route path="/a-propos" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/search-results" element={<SearchResults />} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/dashboard" element={<VisitorDashboard />} />
          <Route element={<AdminProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminOverview />} />
              <Route path="utilisateurs" element={<AdminUsers />} />
              <Route path="paiements" element={<AdminPayments />} />
              <Route path="investisseurs" element={<AdminInvestors />} />
              <Route path="campagnes" element={<AdminCampaigns />} />
              <Route path="publications" element={<AdminPublications />} />
              <Route path="media" element={<AdminMedia />} />
              <Route path="notifications" element={<AdminNotifications />} />
              <Route path="messagerie" element={<AdminMessages />} />
              <Route path="recherche" element={<AdminSearch />} />
              <Route path="statistiques" element={<AdminStats />} />
              <Route path="parametres" element={<AdminSettings />} />
              <Route path="levées-de-fonds" element={<AdminFundraising />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      {!isPrivateWorkspace && <FundraisingModal />}
      {!isPrivateWorkspace && <Footer />}

      {/* Animated Minimalist Floating Icons */}
      {!isPrivateWorkspace && (
        <div className="fixed bottom-10 right-10 z-50 flex flex-col gap-8 items-center group">
          {/* Quick Invest - Gold */}
          <Link
            to="/investir"
            className="group/item relative transition-all duration-500 hover:scale-125 animate-cascade"
            style={{ animationDelay: "0s" }}
            title="Opportunité d'Investissement"
          >
            <FaChartLine
              size={28}
              className="text-[#D4AF37] drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]"
            />
            <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-2 py-1 bg-[#D4AF37]/10 text-[#D4AF37] text-[8px] font-black uppercase tracking-[0.2em] opacity-0 group-hover/item:opacity-100 transition-all whitespace-nowrap border border-[#D4AF37]/20 rounded">
              Investir
            </span>
          </Link>

          {/* WhatsApp - Emerald */}
          <a
            href="https://wa.me/243000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="group/item relative transition-all duration-500 hover:scale-125 animate-cascade"
            style={{ animationDelay: "0.2s" }}
          >
            <FaWhatsapp
              size={30}
              className="text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]"
            />
            <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase tracking-[0.2em] opacity-0 group-hover/item:opacity-100 transition-all whitespace-nowrap border border-emerald-500/20 rounded">
              Support
            </span>
          </a>

          {/* Brochure - Blue */}
          <a
            href="/brochure-kmc.pdf"
            download
            className="group/item relative transition-all duration-500 hover:scale-125 animate-cascade"
            style={{ animationDelay: "0.4s" }}
          >
            <FaFilePdf
              size={28}
              className="text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]"
            />
            <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-2 py-1 bg-blue-500/10 text-blue-500 text-[8px] font-black uppercase tracking-[0.2em] opacity-0 group-hover/item:opacity-100 transition-all whitespace-nowrap border border-blue-500/20 rounded">
              Brochure
            </span>
          </a>

          <style
            dangerouslySetInnerHTML={{
              __html: `
            @keyframes cascade {
              0% { transform: translateX(120px); opacity: 0; }
              10% { transform: translateX(0); opacity: 1; }
              90% { transform: translateX(0); opacity: 1; }
              100% { transform: translateX(120px); opacity: 0; }
            }
            .animate-cascade {
              animation: cascade 8s cubic-bezier(0.16, 1, 0.3, 1) infinite;
            }
            .group:hover .animate-cascade {
              animation-play-state: paused;
              transform: translateX(0);
              opacity: 1;
            }
          `,
            }}
          />
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LangProvider>
        <FundraisingProvider>
          <SearchHighlightProvider>
            <AppLayout />
          </SearchHighlightProvider>
        </FundraisingProvider>
      </LangProvider>
    </BrowserRouter>
  );
}
