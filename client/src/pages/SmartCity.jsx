import { useLang } from "../context/LangContext";
import {
  FiArrowRight,
  FiHome,
  FiHeart,
  FiLayers,
  FiShoppingBag,
  FiMap,
  FiTruck,
  FiShield,
  FiZap,
  FiGlobe,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const FEATURES = [
  { icon: FiHome, label: "Logements résidentiels & sociaux" },
  { icon: FiHeart, label: "Centres de santé & hôpitaux" },
  { icon: FiLayers, label: "Écoles & universités" },
  { icon: FiShoppingBag, label: "Zones commerciales & marchés" },
  { icon: FiMap, label: "Parcs & espaces verts" },
  { icon: FiTruck, label: "Réseau routier moderne" },
];

export default function SmartCity() {
  const { theme } = useLang();
  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${isDark ? "bg-[#071426]" : "bg-slate-50"}`}
    >
      {/* Hero Section with Parallax-like Background */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070"
            alt="Futuristic City"
            className="w-full h-full object-cover opacity-50"
          />
          <div
            className={`absolute inset-0 ${isDark ? "bg-gradient-to-b from-[#071426]/80 to-[#071426]" : "bg-gradient-to-b from-white/80 to-slate-50"}`}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <h1
            className={`text-5xl md:text-7xl font-black mb-6 tracking-tighter ${isDark ? "text-white" : "text-slate-900"}`}
          >
            Kafumbu Melys City <span className="text-emerald-500">(KMC)</span>
          </h1>
          <p
            className={`text-lg md:text-xl max-w-2xl mx-auto leading-relaxed ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            Une cité planifiée de 600 logements axée sur la durabilité, la
            sécurité et le développement local (marché, écoles, hôpitaux, fermes
            laitières).
          </p>
        </div>
      </section>

      {/* Vision & Content */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-8">
            <div>
              <h2
                className={`text-3xl md:text-4xl font-black mb-6 ${isDark ? "text-white" : "text-slate-900"}`}
              >
                Une Vision Urbaine Sans Précédent
              </h2>
              <p
                className={`text-lg leading-relaxed mb-8 ${isDark ? "text-slate-400" : "text-slate-500"}`}
              >
                La cité moderne de Kafumbu représente une nouvelle génération de
                développement urbain durable destinée à accueillir plus de 500
                000 habitants dans un environnement sécurisé, connecté et
                économiquement dynamique.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FEATURES.map((feature, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                    isDark
                      ? "bg-white/5 border-white/10 hover:bg-white/10"
                      : "bg-white border-slate-200 hover:shadow-lg"
                  }`}
                >
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
                    <feature.icon size={20} />
                  </div>
                  <span
                    className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-300" : "text-slate-700"}`}
                  >
                    {feature.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div
              className={`absolute -inset-4 rounded-3xl blur-2xl opacity-20 bg-emerald-500`}
            />
            <div
              className={`relative rounded-xl md:rounded-2xl border overflow-hidden ${isDark ? "border-white/10" : "border-slate-200"}`}
            >
              <img
                src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=2070"
                alt="Urban Plan"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex gap-4 md:gap-8">
                  <div className="text-white">
                    <div className="text-2xl md:text-3xl font-black mb-1">
                      600
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-widest opacity-70">
                      Maisons
                    </div>
                  </div>
                  <div className="text-white">
                    <div className="text-2xl md:text-3xl font-black mb-1">
                      2400
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-widest opacity-70">
                      Résidents
                    </div>
                  </div>
                  <div className="text-white">
                    <div className="text-2xl md:text-3xl font-black mb-1">
                      200
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-widest opacity-70">
                      Hectares
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Modules Grid */}
      <section className={`py-24 ${isDark ? "bg-white/5" : "bg-slate-100"}`}>
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="text-center mb-16">
            <h2
              className={`text-3xl font-black mb-4 ${isDark ? "text-white" : "text-slate-900"}`}
            >
              Infrastructures de Nouvelle Génération
            </h2>
            <div className="w-20 h-1.5 bg-emerald-500 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            {[
              {
                title: "Énergie Durable",
                desc: "Alimentation 24/7 via le barrage hydroélectrique de 15 MW.",
                icon: FiZap,
              },
              {
                title: "Sécurité Intégrée",
                desc: "Réseau de surveillance intelligent et police de proximité.",
                icon: FiShield,
              },
              {
                title: "Connectivité 5G",
                desc: "Fibre optique et couverture haut débit dans toute la cité.",
                icon: FiGlobe,
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`p-6 lg:p-8 rounded-xl md:rounded-2xl border transition-all ${
                  isDark
                    ? "bg-[#071426] border-white/10 hover:border-emerald-500/50"
                    : "bg-white border-slate-200 hover:shadow-xl"
                }`}
              >
                <item.icon size={32} className="text-emerald-500 mb-6" />
                <h3
                  className={`text-lg font-bold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}
                >
                  {item.title}
                </h3>
                <p
                  className={`text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <h2
          className={`text-3xl md:text-4xl font-black mb-8 ${isDark ? "text-white" : "text-slate-900"}`}
        >
          Prêt à faire partie de l'histoire ?
        </h2>
        <Link
          to="/investir"
          className="inline-flex items-center gap-3 px-10 py-5 bg-slate-900 text-white font-black text-sm uppercase tracking-widest rounded-xl shadow-2xl hover:scale-105 transition-all"
        >
          Devenir Partenaire <FiArrowRight size={20} />
        </Link>
      </section>
    </div>
  );
}
