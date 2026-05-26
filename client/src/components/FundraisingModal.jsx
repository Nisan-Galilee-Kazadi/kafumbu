import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiArrowRight, FiTrendingUp, FiTarget, FiClock } from 'react-icons/fi';
import { useLang } from '../context/LangContext';
import { useFundraising } from '../context/FundraisingContext';

export default function FundraisingModal() {
  const { theme } = useLang();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const { getActiveCampaigns, settings } = useFundraising();
  const [showModal, setShowModal] = useState(false);
  const [activeCampaign, setActiveCampaign] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const active = getActiveCampaigns();
      if (active.length > 0) {
        setActiveCampaign(active[0]);
        setShowModal(true);
      }
    }, settings?.modalDelay || 3000);
    return () => clearTimeout(timer);
  }, []); // Pas de sessionStorage → réapparaît à chaque chargement

  const handleClose = () => setShowModal(false);

  const handleParticipate = () => {
    setShowModal(false);
    navigate(activeCampaign ? `/levée-de-fonds/${activeCampaign.id}` : '/levée-de-fonds');
  };

  if (!activeCampaign) return null;

  const progress = Math.min((activeCampaign.raised / activeCampaign.target) * 100, 100);
  const daysLeft = Math.ceil((new Date(activeCampaign.endDate) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ x: 120, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 120, opacity: 0 }}
          transition={{ type: 'spring', damping: 22, stiffness: 200 }}
          className="fixed bottom-8 right-6 z-70 w-72"
        >
          {/* Pulsing glow ring */}
          <motion.div
            animate={{ scale: [1, 1.06, 1], opacity: [0.5, 0.9, 0.5] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-2xl bg-emerald-500/20 blur-xl -z-10"
          />

          <div className={`relative rounded-2xl border overflow-hidden shadow-2xl ${isDark
              ? 'bg-[#0B1D35] border-white/10'
              : 'bg-white border-slate-200'
            }`}>
            {/* Color bar top */}
            <div className="h-1 w-full bg-linear-to-r from-emerald-500 to-[#0f70b7]" />

            {/* Close button */}
            <button
              onClick={handleClose}
              className={`absolute top-3 right-3 p-1 rounded-full transition-colors ${isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
                }`}
            >
              <FiX size={14} />
            </button>

            <div className="p-4 pt-3">
              {/* Header */}
              <div className="flex items-center gap-2 mb-3 pr-4">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <FiTrendingUp size={14} className="text-emerald-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Levée de fonds</p>
                  <h3 className={`text-xs font-bold leading-tight line-clamp-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {activeCampaign.title}
                  </h3>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-[10px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    ${(activeCampaign.raised / 1000000).toFixed(1)}M collectés
                  </span>
                  <span className="text-[10px] font-black text-emerald-500">{progress.toFixed(0)}%</span>
                </div>
                <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-slate-100'}`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                    className="h-full rounded-full bg-linear-to-r from-emerald-500 to-[#0f70b7]"
                  />
                </div>
              </div>

              {/* Stats row */}
              <div className={`flex justify-between text-[10px] font-semibold mb-3 px-2 py-1.5 rounded-lg ${isDark ? 'bg-white/5' : 'bg-slate-50'
                }`}>
                <span className={`flex items-center gap-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  <FiTarget size={12} className="text-[#0f70b7]" />
                  ${(activeCampaign.target / 1000000).toFixed(0)}M objectif
                </span>
                <span className={`flex items-center gap-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  <FiClock size={12} className="text-orange-500" />
                  {daysLeft > 0 ? `${daysLeft}j restants` : 'Expire bientôt'}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={handleParticipate}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-black uppercase tracking-wider transition-all hover:shadow-lg hover:shadow-emerald-500/30 active:scale-95"
                >
                  Participer <FiArrowRight size={12} />
                </button>
                <button
                  onClick={handleClose}
                  className={`px-3 py-2 rounded-xl text-[11px] font-semibold transition-colors border ${isDark
                      ? 'border-white/10 text-slate-400 hover:bg-white/5'
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                >
                  Plus tard
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
