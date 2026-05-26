import { useEffect, useMemo, useState } from 'react';
import { FiArrowRight, FiCalendar, FiCheckCircle, FiHeart, FiShare2, FiTarget, FiTrendingUp, FiUsers } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import { useLang } from '../context/LangContext';
import { useFundraising } from '../context/FundraisingContext';

const formatMoney = (value) =>
  Number(value || 0) >= 1000000
    ? `$${(Number(value || 0) / 1000000).toFixed(1)}M`
    : `$${Number(value || 0).toLocaleString()}`;

export default function Fundraising() {
  const { theme } = useLang();
  const { id } = useParams();
  const isDark = theme === 'dark';
  const { campaigns, selectedCampaign, selectCampaign, addDonation, statistics } = useFundraising();
  const [customAmount, setCustomAmount] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);

  useEffect(() => {
    if (id) selectCampaign(Number(id));
  }, [id, campaigns, selectCampaign]);

  const activeCampaigns = useMemo(() => campaigns.filter((campaign) => campaign.status === 'active'), [campaigns]);
  const progress = selectedCampaign ? Math.min((selectedCampaign.raised / selectedCampaign.target) * 100, 100) : 0;

  const handleDonation = (amount) => {
    const donationValue = Number(amount || 0);
    if (donationValue <= 0) return;

    addDonation(selectedCampaign?.id, {
      amount: donationValue,
      contributor: 'Visiteur public',
      source: 'fundraising-page',
    });
    setShowThankYou(true);
    setTimeout(() => setShowThankYou(false), 3000);
    setCustomAmount('');
  };

  if (showThankYou) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-[#63b32e] to-[#0f70b7]">
        <div className="p-8 text-center text-white">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20">
            <FiCheckCircle size={40} />
          </div>
          <h2 className="mb-2 text-3xl font-bold">Merci pour votre contribution!</h2>
          <p className="text-lg opacity-90">Votre donation met les compteurs a jour en temps reel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#071426]' : 'bg-white'}`}>
      <div className="relative overflow-hidden bg-linear-to-br from-[#63b32e] to-[#0f70b7] text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4 py-20">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-black md:text-6xl">
              Investissez dans l'Avenir de Kafumbu
            </h1>
            <p className="mb-8 text-xl opacity-90 md:text-2xl">
              Rejoignez notre mission pour construire une ville intelligente et durable
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="rounded-xl bg-white/20 p-4 backdrop-blur-sm">
                <p className="text-3xl font-bold">{formatMoney(statistics.totalRaised)}</p>
                <p className="text-sm opacity-90">Deja collecte</p>
              </div>
              <div className="rounded-xl bg-white/20 p-4 backdrop-blur-sm">
                <p className="text-3xl font-bold">{statistics.totalContributors.toLocaleString()}</p>
                <p className="text-sm opacity-90">Contributeurs</p>
              </div>
              <div className="rounded-xl bg-white/20 p-4 backdrop-blur-sm">
                <p className="text-3xl font-bold">{activeCampaigns.length}</p>
                <p className="text-sm opacity-90">Campagnes actives</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto mb-12 grid max-w-4xl gap-4">
          {campaigns.map((campaign) => (
            <button
              key={campaign.id}
              onClick={() => selectCampaign(campaign.id)}
              className={`rounded-xl border-2 p-6 text-left transition-all ${
                selectedCampaign?.id === campaign.id
                  ? 'border-[#63b32e] bg-[#63b32e]/5'
                  : isDark
                    ? 'border-white/10 bg-[#0B1D35] hover:border-white/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className={`mb-2 text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {campaign.title}
                  </h3>
                  <p className={`mb-4 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {campaign.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-5 text-sm">
                    <span className="flex items-center gap-2">
                      <FiTarget className="text-[#63b32e]" /> {formatMoney(campaign.target)} objectif
                    </span>
                    <span className="flex items-center gap-2">
                      <FiTrendingUp className="text-[#0f70b7]" /> {((campaign.raised / campaign.target) * 100).toFixed(2)}%
                    </span>
                    <span className="flex items-center gap-2">
                      <FiUsers className="text-purple-500" /> {campaign.contributors.toLocaleString()} contributeurs
                    </span>
                  </div>
                </div>
                <div className={`flex h-16 w-16 items-center justify-center rounded-full ${selectedCampaign?.id === campaign.id ? 'bg-[#63b32e] text-white' : 'bg-gray-200'}`}>
                  {selectedCampaign?.id === campaign.id ? <FiCheckCircle size={24} /> : <div className="h-6 w-6 rounded-full border-2 border-gray-400" />}
                </div>
              </div>
            </button>
          ))}
        </div>

        {selectedCampaign && (
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
            <div className="space-y-8">
              <div className={`rounded-2xl border p-8 ${isDark ? 'border-white/10 bg-[#0B1D35]' : 'border-slate-200 bg-white shadow-lg'}`}>
                <h3 className={`mb-6 text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Progression de la campagne
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Objectif</span>
                    <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {formatMoney(selectedCampaign.target)}
                    </span>
                  </div>
                  <div>
                    <div className={`h-4 overflow-hidden rounded-full ${isDark ? 'bg-[#08172B]' : 'bg-slate-200'}`}>
                      <div
                        className="h-full rounded-full bg-linear-to-r from-[#63b32e] to-[#0f70b7] transition-all duration-1000"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="mt-2 flex justify-between text-sm">
                      <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                        {formatMoney(selectedCampaign.raised)} collectes
                      </span>
                      <span className="font-bold text-[#63b32e]">{progress.toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className={`rounded-2xl border p-8 ${isDark ? 'border-white/10 bg-[#0B1D35]' : 'border-slate-200 bg-white shadow-lg'}`}>
                <h3 className={`mb-6 text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Faites un don
                </h3>
                <div className="mb-6 grid grid-cols-2 gap-4">
                  {[10, 25, 50, 100, 250, 500].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleDonation(amount)}
                      className={`rounded-xl border-2 p-4 transition-all hover:border-[#63b32e] hover:bg-[#63b32e]/5 ${
                        isDark ? 'border-white/10 bg-[#08172B]' : 'border-slate-200 bg-white'
                      }`}
                    >
                      <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>${amount}</p>
                    </button>
                  ))}
                </div>
                <label className={`mb-2 block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Montant personnalise (USD)
                </label>
                <input
                  type="number"
                  min="1"
                  value={customAmount}
                  onChange={(event) => setCustomAmount(event.target.value)}
                  className={`mb-6 w-full rounded-lg border px-4 py-3 ${isDark ? 'border-white/10 bg-[#08172B] text-white' : 'border-slate-200 bg-white text-slate-900'} focus:outline-none focus:ring-2 focus:ring-[#63b32e]`}
                  placeholder="Entrez votre montant"
                />
                <button
                  onClick={() => handleDonation(customAmount)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#63b32e] to-[#0f70b7] py-4 font-bold text-white transition-all hover:shadow-lg"
                >
                  <FiHeart size={20} />
                  Faire un don de ${customAmount || '0'}
                  <FiArrowRight size={20} />
                </button>
              </div>

              <div className={`rounded-2xl border p-8 ${isDark ? 'border-white/10 bg-[#0B1D35]' : 'border-slate-200 bg-white shadow-lg'}`}>
                <h3 className={`mb-4 text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Partager cette campagne</h3>
                <p className={`mb-4 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Aidez-nous a etendre notre portee en partageant cette campagne avec votre reseau.
                </p>
                <button className={`flex w-full items-center justify-center gap-2 rounded-lg border p-3 transition ${isDark ? 'border-white/10 bg-[#08172B] hover:bg-white/10' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
                  <FiShare2 size={16} />
                  <span className="text-sm font-medium">Partager</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
