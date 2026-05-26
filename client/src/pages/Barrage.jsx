import { useLang } from '../context/LangContext';
import { FiZap, FiDroplet, FiBriefcase, FiUsers, FiArrowRight, FiShield, FiBarChart2 } from 'react-icons/fi';
import { RiWaterFlashLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';

const SPECS = [
  { label: 'Capacité Nominale', val: '15 MW', icon: FiZap },
  { label: 'Énergie Annuelle', val: '120 GWh', icon: FiBarChart2 },
  { label: 'Type de Centrale', val: 'Fil de l\'eau', icon: FiDroplet },
  { label: 'Population desservie', val: '500 000+', icon: FiUsers },
];

export default function Barrage() {
  const { theme } = useLang();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-[#071426]' : 'bg-slate-50'}`}>
      
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1581094288338-2314dddb7bc3?auto=format&fit=crop&q=80&w=2070" 
            alt="Hydroelectric Dam" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-b from-[#071426]/80 to-[#071426]' : 'bg-gradient-to-b from-white/80 to-slate-50'}`} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <h1 className={`text-5xl md:text-7xl font-black mb-6 tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Le Barrage de <span className="text-emerald-500">Kafumbu</span>
          </h1>
          <p className={`text-lg md:text-xl max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Une puissance hydroélectrique de 15 MW au service du développement industriel et domestique de toute la région.
          </p>
        </div>
      </section>

      {/* Technical Overview */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          <div className="relative order-2 lg:order-1">
            <div className={`absolute -inset-4 rounded-3xl blur-2xl opacity-10 bg-emerald-500`} />
            <div className={`relative rounded-xl md:rounded-2xl border overflow-hidden ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
              <img 
                src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=2070" 
                alt="Engineering" 
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute top-6 left-6 p-4 rounded-xl bg-[#071426]/80 backdrop-blur-md border border-white/10 text-white shadow-xl">
                <RiWaterFlashLine size={32} className="text-emerald-500 mb-2" />
                <div className="text-2xl font-black">15 MW</div>
                <div className="text-[8px] font-bold uppercase tracking-widest opacity-60">Puissance Installée</div>
              </div>
            </div>
          </div>

          <div className="space-y-8 order-1 lg:order-2">
            <div>
              <h2 className={`text-3xl md:text-4xl font-black mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Une Infrastructure Stratégique
              </h2>
              <p className={`text-lg leading-relaxed mb-8 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Le barrage hydroélectrique de Kafumbu constituera une source énergétique stratégique capable d’alimenter la cité moderne, les infrastructures industrielles et les zones rurales environnantes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              {SPECS.map((spec, i) => (
                <div key={i} className={`p-6 rounded-xl border transition-all ${
                  isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'
                }`}>
                  <spec.icon size={24} className="text-emerald-500 mb-4" />
                  <div className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {spec.label}
                  </div>
                  <div className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {spec.val}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Impact Section */}
      <section className={`py-24 ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            {[
              { title: 'Zéro Émissions', desc: 'Une énergie 100% propre pour préserver l\'écosystème local.', icon: FiDroplet },
              { title: 'Emplois Locaux', desc: 'Plus de 2 000 emplois directs et indirects durant la phase de construction.', icon: FiBriefcase },
              { title: 'Stabilité du Réseau', desc: 'Une production constante garantissant la sécurité énergétique.', icon: FiShield },
            ].map((item, i) => (
              <div key={i} className={`p-6 lg:p-8 rounded-xl md:rounded-2xl border transition-all ${
                isDark ? 'bg-[#071426] border-white/10 hover:border-emerald-500/50' : 'bg-white border-slate-200 hover:shadow-xl'
              }`}>
                <item.icon size={32} className="text-emerald-500 mb-6" />
                <h3 className={`text-lg font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.title}</h3>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <h2 className={`text-3xl md:text-4xl font-black mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>Contribuez à l'Indépendance Énergétique</h2>
        <Link 
          to="/investir" 
          className="inline-flex items-center gap-3 px-10 py-5 bg-slate-900 text-white font-black text-sm uppercase tracking-widest rounded-xl shadow-2xl hover:scale-105 transition-all"
        >
          Investir dans le Barrage <FiArrowRight size={20} />
        </Link>
      </section>

    </div>
  );
}
