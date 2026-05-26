import { useLang } from '../context/LangContext';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getPublicContent } from '../services/publicService';

const IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200',
    title: 'Vision Architecturale',
    category: 'Design'
  },
  {
    url: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80&w=1200',
    title: 'Barrage Hydroélectrique',
    category: 'Énergie'
  },
  {
    url: 'https://images.unsplash.com/photo-1541888081622-1ce82ebdb324?auto=format&fit=crop&q=80&w=1200',
    title: 'Infrastructures Routières',
    category: 'BTP'
  },
  {
    url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200',
    title: 'Quartier Résidentiel',
    category: 'Habitat'
  },
  {
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
    title: 'Centre d\'Affaires',
    category: 'Business'
  },
  {
    url: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=1200',
    title: 'Espaces Verts',
    category: 'Écologie'
  }
];

export default function Gallery() {
  const { theme } = useLang();
  const isDark = theme === 'dark';
  const [images, setImages] = useState(IMAGES);

  useEffect(() => {
    getPublicContent()
      .then((data) => {
        if (Array.isArray(data.media) && data.media.length) {
          setImages(data.media.map((item) => ({
            url: item.file_path,
            title: item.title || item.filename,
            category: item.file_type || 'Media',
          })));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className={`min-h-screen pt-32 pb-20 transition-colors duration-500 ${isDark ? 'bg-[#071426]' : 'bg-slate-50'}`}>
      
      {/* Header Section */}
      <section className="max-w-7xl mx-auto px-6 mb-16">
        <div className="max-w-3xl">
          <h1 className={`text-4xl md:text-6xl font-black mb-6 tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Galerie <span className="text-emerald-500">Multimédia</span>
          </h1>
          <p className={`text-lg leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Découvrez les visuels du projet Kafumbu Smart City, des concepts architecturaux aux avancées de chantier.
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {images.map((img, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative group cursor-pointer overflow-hidden rounded-2xl"
            >
              <img 
                src={img.url} 
                alt={img.title}
                className="w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-1">
                  {img.category}
                </span>
                <h3 className="text-white text-xl font-bold">
                  {img.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
}
