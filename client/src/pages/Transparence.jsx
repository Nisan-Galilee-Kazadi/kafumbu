import { useLang } from '../context/LangContext';
import { useFundraising } from '../context/FundraisingContext';
import { FiBarChart2, FiShield, FiFileText, FiCalendar, FiCheckCircle, FiDownload } from 'react-icons/fi';

export default function Transparence() {
  const { theme } = useLang();
  const { statistics } = useFundraising();
  const isDark = theme === 'dark';
  const totalRaised = `${statistics.totalRaised.toLocaleString('fr-FR')} USD`;
  const reports = [
    {
      period: 'T2 2026',
      funds: totalRaised,
      usage: statistics.totalRaised > 0 ? `${Math.round(statistics.totalRaised * 0.9).toLocaleString('fr-FR')} USD` : '0 USD',
      status: statistics.totalRaised > 0 ? 'Publie' : 'Initialise',
    },
  ];

  return (
    <div className={`min-h-screen pt-32 pb-20 transition-colors duration-500 ${isDark ? 'bg-[#071426]' : 'bg-slate-50'}`}>
      <section className="max-w-7xl mx-auto px-6 mb-16">
        <div className="max-w-3xl">
          <h1 className={`text-4xl md:text-6xl font-black mb-6 tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Transparence <span className="text-emerald-500">Financiere</span>
          </h1>
          <p className={`text-lg leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Nous assurons une tracabilite totale des fonds collectes. Chaque dollar investi est audite et affecte directement aux infrastructures de Kafumbu.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: FiBarChart2, label: 'Fonds Collectes', value: totalRaised },
            { icon: FiShield, label: 'Controle Audit', value: '100% Trace' },
            { icon: FiFileText, label: 'Contributeurs', value: statistics.totalContributors.toLocaleString('fr-FR') },
            { icon: FiCalendar, label: 'Prochain Audit', value: 'Juil 2026' },
          ].map((stat, i) => (
            <div key={i} className={`p-8 rounded-3xl border transition-all ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <stat.icon size={24} className="text-emerald-500 mb-4" />
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{stat.label}</div>
              <div className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{stat.value}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6">
        <div className={`rounded-[2.5rem] border overflow-hidden transition-all duration-500 ${
          isDark ? 'bg-white/5 border-white/10 shadow-2xl shadow-black/50' : 'bg-white border-slate-200 shadow-xl shadow-slate-200/50'
        }`}>
          <div className={`px-8 py-6 border-b flex flex-col md:flex-row md:items-center justify-between gap-4 ${
            isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'
          }`}>
            <h2 className={`text-xl font-black uppercase tracking-widest ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Publications Financieres
            </h2>
            <button className="inline-flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] hover:opacity-70 transition-opacity">
              Telecharger Tout <FiDownload size={14} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  <th className="px-8 py-6">Periode</th>
                  <th className="px-8 py-6">Fonds Collectes</th>
                  <th className="px-8 py-6">Affectation</th>
                  <th className="px-8 py-6">Certification</th>
                  <th className="px-8 py-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-slate-100'}`}>
                {reports.map((report, i) => (
                  <tr key={i} className={`transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                    <td className={`px-8 py-6 font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{report.period}</td>
                    <td className={`px-8 py-6 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{report.funds}</td>
                    <td className={`px-8 py-6 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{report.usage}</td>
                    <td className="px-8 py-6">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                        <FiCheckCircle size={12} /> {report.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className={`p-2 rounded-lg transition-colors ${isDark ? 'text-white hover:bg-white/10' : 'text-slate-700 hover:bg-slate-200'}`}>
                        <FiDownload size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 mt-20 text-center">
        <div className={`p-8 rounded-3xl border border-dashed ${isDark ? 'border-white/10 text-slate-500' : 'border-slate-200 text-slate-400'}`}>
          <p className="text-xs italic font-medium max-w-2xl mx-auto leading-relaxed">
            La transparence est le fondement de la confiance avec nos investisseurs et les populations de Kafumbu.
          </p>
        </div>
      </section>
    </div>
  );
}
