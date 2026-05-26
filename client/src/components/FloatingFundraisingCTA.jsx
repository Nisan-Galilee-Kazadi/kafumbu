import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHeart, FiTrendingUp, FiX } from 'react-icons/fi';
import { useFundraising } from '../context/FundraisingContext';

export default function FloatingFundraisingCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCampaign, setActiveCampaign] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const navigate = useNavigate();
  const { getActiveCampaigns } = useFundraising();

  useEffect(() => {
    const checkActiveCampaigns = () => {
      const active = getActiveCampaigns().find(
        (campaign) => Number(campaign.raised || 0) < Number(campaign.target || 0),
      );

      setActiveCampaign(active || null);
      setIsVisible(Boolean(active));
    };

    checkActiveCampaigns();
    const interval = setInterval(checkActiveCampaigns, 30000);
    window.addEventListener('kafumbu-fundraising-updated', checkActiveCampaigns);

    return () => {
      clearInterval(interval);
      window.removeEventListener('kafumbu-fundraising-updated', checkActiveCampaigns);
    };
  }, [getActiveCampaigns]);

  if (!isVisible || !activeCampaign) return null;

  const progress = activeCampaign.target > 0 ? (activeCampaign.raised / activeCampaign.target) * 100 : 0;

  return (
    <div className="fixed bottom-48 right-6 z-[60] max-w-sm">
      <div
        className={`transform transition-all duration-500 ease-out ${
          isMinimized ? 'scale-90 opacity-80' : 'scale-100 opacity-100'
        } ${!isMinimized ? 'hover:scale-105' : ''}`}
      >
        <div className="relative rounded-2xl bg-gradient-to-br from-[#63b32e] to-[#0f70b7] p-4 text-white shadow-2xl">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="absolute right-2 top-2 rounded-full bg-white/20 p-1 transition-colors hover:bg-white/30"
            title={isMinimized ? 'Agrandir' : 'Reduire'}
          >
            <FiX size={14} />
          </button>

          <button
            onClick={() => setIsVisible(false)}
            className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 transition-colors hover:bg-red-600"
            title="Fermer"
          >
            <FiX size={12} />
          </button>

          {!isMinimized ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-white/20 p-2">
                  <FiHeart className="animate-pulse" size={16} />
                </div>
                <div className="flex-1 pr-5">
                  <p className="text-xs font-bold uppercase tracking-wider opacity-90">Levee de fonds</p>
                  <p className="text-sm font-bold leading-tight">{activeCampaign.title}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="opacity-90">Progression</span>
                  <span className="font-bold">{progress.toFixed(2)}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/30">
                  <div
                    className="h-full rounded-full bg-white transition-all duration-1000 ease-out"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs opacity-80">
                  <span>${(activeCampaign.raised / 1000000).toFixed(1)}M collectes</span>
                  <span>${(activeCampaign.target / 1000000).toFixed(0)}M objectif</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs opacity-90">
                <div className="flex items-center gap-1">
                  <FiTrendingUp size={12} />
                  <span>{activeCampaign.contributors.toLocaleString()} contributeurs</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/financement')}
                className="block w-full cursor-pointer rounded-lg bg-white/80 py-2 text-center text-xs font-bold text-[#63b32e] transition-colors hover:bg-white/90"
              >
                Voir la campagne
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-white/20 p-2">
                <FiHeart className="animate-pulse" size={16} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-wider opacity-90">Levee active</p>
                <p className="text-sm font-bold">{progress.toFixed(2)}%</p>
              </div>
              <button
                onClick={() => navigate('/financement')}
                className="cursor-pointer rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-[#63b32e] transition-colors hover:bg-white/90"
              >
                Voir
              </button>
            </div>
          )}
        </div>

        <div className="absolute inset-0 rounded-2xl bg-[#63b32e] opacity-20 animate-ping" />
      </div>
    </div>
  );
}
