import { Link } from "react-router-dom";
import { useLang } from "../context/LangContext";
import { FiMail, FiFacebook, FiTwitter, FiLinkedin } from "react-icons/fi";
import { SiVisa, SiMastercard, SiPaypal } from "react-icons/si";

const KscLogo = () => (
  <div className="relative w-16 h-16 flex items-center justify-center group cursor-pointer">
    {/* Diamond (Losange) Background */}
    <svg
      className="absolute inset-0 w-full h-full text-white transition-all duration-500 ease-in-out group-hover:scale-110"
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
    >
      <path
        d="M50 10 L90 50 L50 90 L10 50 Z"
        strokeWidth="3"
        strokeLinejoin="miter"
        fill="#0B1526"
      />
      <path
        d="M50 22 L78 50 L50 78 L22 50 Z"
        strokeWidth="1"
        strokeDasharray="4 2"
        opacity="0.4"
        fill="none"
      />
      <path d="M50 10 L50 90" strokeWidth="0.5" opacity="0.2" fill="none" />
    </svg>

    {/* Refined Brand Text */}
    <div className="relative z-10 flex flex-col items-center pt-1">
      <span className="text-emerald-500 font-black text-[16px] leading-tight tracking-tighter drop-shadow-sm">
        KSC
      </span>
      <div className="w-5 h-[2px] bg-emerald-500/30 -mt-0.5" />
      <span className="text-white font-bold text-[6px] tracking-[0.2em] uppercase opacity-70 mt-0.5">
        GLOBAL
      </span>
    </div>
  </div>
);

export default function Footer() {
  const { t, theme } = useLang();
  const isDark = theme === "dark";

  return (
    <footer className="relative bg-[#0B1526] text-white pt-24 mt-0">
      {/* Jagged Divider with Emerald Glow in Dark Mode */}
      <div className="absolute bottom-[99.5%] left-0 w-full overflow-hidden leading-0 transform translate-y-px">
        {/* Mobile : seulement 4 zigzags (4 crêtes) */}
        <svg
          className={`block h-[40px] w-full transition-colors duration-500 md:hidden ${isDark ? "text-[#0B1526]" : "text-[#0B1526]"}`}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          <polygon
            fill="currentColor"
            points="0,100 100,100 100,80 87.5,42 75,80 62.5,38 50,80 37.5,44 25,80 12.5,36 0,80"
          />
          {isDark && (
            <polyline
              points="100,80 87.5,42 75,80 62.5,38 50,80 37.5,44 25,80 12.5,36 0,80"
              fill="none"
              stroke="#10b981"
              strokeWidth="0.6"
              opacity="0.35"
            />
          )}
        </svg>
        {/* Tablette et + : motif architectural complet */}
        <svg
          className={`hidden h-[80px] w-full transition-colors duration-500 md:block ${isDark ? "text-[#0B1526]" : "text-[#0B1526]"}`}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          <polygon
            fill="currentColor"
            points="0,100 100,100 100,80 96,65 92,80 88,50 83,70 79,40 74,60 70,30 65,50 60,25 56,40 51,15 47,35 42,10 38,45 33,20 28,55 24,30 20,65 16,40 12,75 7,60 3,85 0,80"
          />
          {isDark && (
            <polyline
              points="0,80 3,85 7,60 12,75 16,40 20,65 24,30 28,55 33,20 38,45 42,10 47,35 51,15 56,40 60,25 65,50 70,30 74,60 79,40 83,70 88,50 92,80 96,65 100,80"
              fill="none"
              stroke="#10b981"
              strokeWidth="0.5"
              opacity="0.3"
            />
          )}
        </svg>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Col 1: Navigation */}
          <div>
            <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-widest">
              {t("ui.footer.navigation")}
            </h4>
            <ul className="flex flex-col gap-3 text-xs font-bold text-slate-400">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  {t("nav.home")}
                </Link>
              </li>
              <li>
                <Link
                  to="/smart-city"
                  className="hover:text-white transition-colors"
                >
                  {t("nav.smartCity")}
                </Link>
              </li>
              <li>
                <Link
                  to="/barrage"
                  className="hover:text-white transition-colors"
                >
                  {t("nav.barrage")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Engagement */}
          <div>
            <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-widest">
              {t("ui.footer.engagement")}
            </h4>
            <ul className="flex flex-col gap-3 text-xs font-bold text-slate-400">
              <li>
                <Link
                  to="/investir"
                  className="hover:text-white transition-colors"
                >
                  {t("nav.invest")}
                </Link>
              </li>
              <li>
                <Link
                  to="/financement"
                  className="hover:text-white transition-colors"
                >
                  {t("nav.funding")}
                </Link>
              </li>
              <li>
                <Link
                  to="/medias"
                  className="hover:text-white transition-colors"
                >
                  {t("nav.media")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Légal */}
          <div>
            <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-widest">
              {t("ui.footer.legal")}
            </h4>
            <ul className="flex flex-col gap-3 text-xs font-bold text-slate-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("ui.footer.privacy_policy")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("ui.footer.terms")}
                </a>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-white transition-colors"
                >
                  {t("ui.footer.contact_link")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter & Socials */}
          <div className="flex flex-col gap-8">
            <div>
              <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-widest">
                {t("ui.footer.newsletter")}
              </h4>
              <div className="flex flex-col gap-2">
                <input
                  type="email"
                  placeholder={t("ui.footer.email_placeholder")}
                  className="w-full min-w-0 rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-xs font-bold text-white outline-none focus:border-white transition-all"
                />
                <button
                  className={`w-full py-3 px-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all border whitespace-normal leading-tight ${
                    isDark
                      ? "bg-white text-slate-900 border-white/10 hover:bg-slate-50"
                      : "bg-slate-950 text-white border-slate-200 hover:bg-slate-800"
                  }`}
                >
                  {t("ui.footer.subscribe")}
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              {[FiMail, FiFacebook, FiLinkedin, FiTwitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-white"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#080F1E] py-8">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-bold text-white/50">
          <div className="flex items-center gap-4">
            <div className="scale-75 origin-left">
              <KscLogo />
            </div>
            <span className="text-white font-black uppercase tracking-widest">
              Kafumbu.cd
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-white/60">
            <a href="#" className="hover:text-white transition-colors">
              EULA
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Confidentialité
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Conditions
            </a>
            <div className="flex items-center gap-4 border-l border-white/10 pl-8">
              <SiMastercard
                size={20}
                className="opacity-40 hover:opacity-100 transition-opacity"
              />
              <SiVisa
                size={24}
                className="opacity-40 hover:opacity-100 transition-opacity"
              />
              <SiPaypal
                size={18}
                className="opacity-40 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>

          <p className="text-[8px] md:text-[9px] text-white/60 font-bold uppercase tracking-wider">
            {t("footer.rights").replace("2025", new Date().getFullYear())}
          </p>
        </div>
      </div>
    </footer>
  );
}
