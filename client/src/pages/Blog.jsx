import { useLang } from '../context/LangContext';
import { FiCalendar, FiArrowRight, FiClock } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { getPublicContent } from '../services/publicService';

const ARTICLES = [
  {
    date: '2025-04-15',
    tag: 'Communiqué',
    title: 'Lancement officiel du projet Kafumbu Smart City',
    excerpt: 'Le projet de construction de la cité moderne de Kafumbu est officiellement lancé avec la signature des premiers accords de partenariat stratégique.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800'
  },
  {
    date: '2025-03-28',
    tag: 'Technique',
    title: 'Le barrage hydroélectrique entre en phase de faisabilité',
    excerpt: 'Les études géotechniques et hydrauliques sont en cours pour valider le site d\'implantation du barrage de 15 MW sur le fleuve Kafumbu.',
    image: 'https://images.unsplash.com/photo-1581094288338-2314dddb7bc3?auto=format&fit=crop&q=80&w=800'
  },
  {
    date: '2025-02-10',
    tag: 'Finance',
    title: 'Kafumbu attire des investisseurs internationaux',
    excerpt: 'Plusieurs fonds d\'investissement internationaux ont exprimé leur intérêt pour le projet lors du Forum Économique d\'Afrique centrale.',
    image: 'https://images.unsplash.com/photo-1454165833762-026522f22143?auto=format&fit=crop&q=80&w=800'
  }
];

export default function Blog() {
  const { theme } = useLang();
  const isDark = theme === 'dark';
  const [articles, setArticles] = useState(ARTICLES);

  useEffect(() => {
    getPublicContent()
      .then((data) => {
        if (Array.isArray(data.news) && data.news.length) {
          setArticles(data.news.map((item) => ({
            date: item.published_at || item.created_at,
            tag: item.category || 'Actualite',
            title: item.title,
            excerpt: item.excerpt || item.content,
            image: item.featured_image || data.settings?.blog_hero_image || ARTICLES[0].image,
          })));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className={`min-h-screen pt-32 pb-20 transition-colors duration-500 ${isDark ? 'bg-[#071426]' : 'bg-slate-50'}`}>
      
      {/* Header Section */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 mb-16">
        <div className="max-w-3xl">
          <h1 className={`text-4xl md:text-6xl font-black mb-6 tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Actualités & <span className="text-emerald-500">Blog</span>
          </h1>
          <p className={`text-lg leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Suivez en temps réel l'évolution du projet, les étapes de construction et les annonces institutionnelles.
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {articles.map((article, i) => (
            <article 
              key={i} 
              className={`group flex flex-col rounded-xl md:rounded-2xl border transition-all duration-500 overflow-hidden ${
                isDark ? 'bg-white/5 border-white/10 hover:border-emerald-500/50 hover:bg-white/10' : 'bg-white border-slate-200 hover:shadow-2xl hover:shadow-slate-200'
              }`}
            >
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-lg bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                    {article.tag}
                  </span>
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center gap-4 mb-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  <div className="flex items-center gap-1.5">
                    <FiCalendar className="text-emerald-500" />
                    {article.date}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FiClock className="text-emerald-500" />
                    4 min
                  </div>
                </div>

                <h2 className={`text-xl font-black mb-4 leading-snug group-hover:text-emerald-500 transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {article.title}
                </h2>

                <p className={`text-sm leading-relaxed mb-8 flex-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {article.excerpt}
                </p>

                <button className={`inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all ${
                  isDark ? 'text-white hover:text-emerald-500' : 'text-slate-900 hover:text-emerald-500'
                }`}>
                  Lire la suite <FiArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 mt-24">
        <div className={`p-8 md:p-12 rounded-xl md:rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 ${
          isDark ? 'bg-emerald-950/20 border-emerald-500/20' : 'bg-emerald-50 border-emerald-100'
        }`}>
          <div className="max-w-md text-center md:text-left">
            <h2 className={`text-3xl font-black mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Restez <span className="text-emerald-500">Informé</span>
            </h2>
            <p className={`text-sm font-medium leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Inscrivez-vous à notre lettre d'information pour recevoir les rapports d'avancement mensuels et les opportunités d'investissement.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <input 
              type="email" 
              placeholder="votre@email.com" 
              className={`px-6 py-4 rounded-xl border outline-none min-w-0 flex-1 md:min-w-[300px] transition-all ${
                isDark ? 'bg-white/5 border-white/10 text-white focus:border-emerald-500' : 'bg-white border-slate-200 focus:border-emerald-500'
              }`}
            />
            <button className="px-8 py-4 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-xl hover:bg-black transition-all whitespace-nowrap">
              S'inscrire
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
