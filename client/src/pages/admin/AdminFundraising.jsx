import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiDollarSign, FiTarget, FiTrendingUp, FiCalendar, FiUsers } from 'react-icons/fi';
import { useLang } from '../../context/LangContext';
import { useFundraising } from '../../context/FundraisingContext';

export default function AdminFundraising() {
  const { theme } = useLang();
  const isDark = theme === 'dark';
  const { campaigns, createCampaign, updateCampaign, deleteCampaign } = useFundraising();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);

  const handleCreateCampaign = (campaignData) => {
    createCampaign(campaignData);
    setShowCreateForm(false);
  };

  const handleUpdateCampaign = (id, updatedData) => {
    updateCampaign(id, updatedData);
    setEditingCampaign(null);
  };

  const handleDeleteCampaign = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette campagne ?')) {
      deleteCampaign(id);
    }
  };

  const toggleCampaignStatus = (id) => {
    const campaign = campaigns.find(c => c.id === id);
    if (campaign) {
      updateCampaign(id, { status: campaign.status === 'active' ? 'inactive' : 'active' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`rounded-2xl border p-6 shadow-xl ${isDark ? 'border-white/10 bg-linear-to-br from-[#0B1D35] to-[#08172B]' : 'border-slate-200 bg-linear-to-br from-white to-[#e8f7ef]'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#63b32e]">Levées de fonds</p>
            <h2 className={`mt-2 text-2xl font-black ${isDark ? 'text-white' : 'text-[#0f70b7]'}`}>
              Gestion des campagnes
            </h2>
            <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Créez et gérez vos campagnes de levée de fonds
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#63b32e] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#529426]"
          >
            <FiPlus size={16} />
            Nouvelle campagne
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { 
            icon: FiDollarSign, 
            label: 'Total collecté', 
            value: `${(campaigns.reduce((sum, c) => sum + (c.raised || 0), 0) / 1000000).toFixed(1)}M USD`,
            color: 'text-green-500'
          },
          { 
            icon: FiTarget, 
            label: 'Objectif total', 
            value: `${(campaigns.reduce((sum, c) => sum + (c.target || 0), 0) / 1000000).toFixed(1)}M USD`,
            color: 'text-blue-500'
          },
          { 
            icon: FiUsers, 
            label: 'Contributeurs', 
            value: campaigns.reduce((sum, c) => sum + (c.contributors || 0), 0).toLocaleString(),
            color: 'text-purple-500'
          },
          { 
            icon: FiTrendingUp, 
            label: 'Campagnes actives', 
            value: campaigns.filter(c => c.status === 'active').length,
            color: 'text-orange-500'
          }
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className={`rounded-xl border p-4 ${isDark ? 'border-white/10 bg-[#0B1D35]' : 'border-slate-200 bg-white shadow-sm'}`}>
            <Icon className={color} size={20} />
            <p className={`mt-2 text-xs uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</p>
            <p className={`mt-1 text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Campaigns List */}
      <div className={`rounded-xl border ${isDark ? 'border-white/10 bg-[#0B1D35]' : 'border-slate-200 bg-white shadow-sm'}`}>
        <div className="p-6 border-b ${isDark ? 'border-white/10' : 'border-slate-200'}">
          <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Campagnes en cours</h3>
        </div>
        <div className="divide-y ${isDark ? 'divide-white/10' : 'divide-slate-200'}">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{campaign.title}</h4>
                    <span className={`px-2 py-1 text-xs font-bold uppercase rounded-full ${
                      campaign.status === 'active' 
                        ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                        : 'bg-gray-500/10 text-gray-500 border border-gray-500/20'
                    }`}>
                      {campaign.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{campaign.description}</p>
                  
                  <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Objectif</p>
                      <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        ${(campaign.target / 1000000).toFixed(1)}M
                      </p>
                    </div>
                    <div>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Collecté</p>
                      <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        ${(campaign.raised / 1000000).toFixed(1)}M
                      </p>
                    </div>
                    <div>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Progression</p>
                      <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {((campaign.raised / campaign.target) * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Contributeurs</p>
                      <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {campaign.contributors.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className={`flex justify-between text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      <span>Progression</span>
                      <span>{((campaign.raised / campaign.target) * 100).toFixed(1)}%</span>
                    </div>
                    <div className={`mt-1 h-2 overflow-hidden rounded-full ${isDark ? 'bg-[#08172B]' : 'bg-slate-100'}`}>
                      <div 
                        className="h-full rounded-full bg-linear-to-r from-[#63b32e] to-[#0f70b7]" 
                        style={{ width: `${Math.min((campaign.raised / campaign.target) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className={`mt-4 flex items-center gap-2 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    <FiCalendar size={12} />
                    <span>Du {new Date(campaign.startDate).toLocaleDateString()} au {new Date(campaign.endDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="ml-4 flex gap-2">
                  <button
                    onClick={() => setEditingCampaign(campaign)}
                    className={`p-2 rounded-lg transition ${isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}
                    title="Modifier"
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
                    onClick={() => toggleCampaignStatus(campaign.id)}
                    className={`p-2 rounded-lg transition ${isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}
                    title={campaign.status === 'active' ? 'Désactiver' : 'Activer'}
                  >
                    <FiEye size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteCampaign(campaign.id)}
                    className="p-2 rounded-lg transition hover:bg-red-500/10 text-red-500"
                    title="Supprimer"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create/Edit Form Modal */}
      {(showCreateForm || editingCampaign) && (
        <FundraisingForm
          campaign={editingCampaign}
          onSubmit={editingCampaign ? handleUpdateCampaign : handleCreateCampaign}
          onCancel={() => {
            setShowCreateForm(false);
            setEditingCampaign(null);
          }}
          isDark={isDark}
        />
      )}
    </div>
  );
}

function FundraisingForm({ campaign, onSubmit, onCancel, isDark }) {
  const [formData, setFormData] = useState({
    title: campaign?.title || '',
    description: campaign?.description || '',
    target: campaign?.target || '',
    startDate: campaign?.startDate || '',
    endDate: campaign?.endDate || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (campaign) {
      onSubmit(campaign.id, formData);
    } else {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-2xl rounded-2xl border p-6 shadow-2xl ${isDark ? 'border-white/10 bg-[#0B1D35]' : 'border-slate-200 bg-white'}`}>
        <h3 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {campaign ? 'Modifier la campagne' : 'Nouvelle campagne de levée de fonds'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Titre de la campagne
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'border-white/10 bg-[#08172B] text-white' : 'border-slate-200 bg-white text-slate-900'} focus:outline-none focus:ring-2 focus:ring-[#63b32e]`}
              placeholder="Ex: Phase 1 - Construction des infrastructures"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Description
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'border-white/10 bg-[#08172B] text-white' : 'border-slate-200 bg-white text-slate-900'} focus:outline-none focus:ring-2 focus:ring-[#63b32e]`}
              placeholder="Décrivez en détail l'objectif de cette levée de fonds..."
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Objectif (USD)
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.target}
              onChange={(e) => setFormData({ ...formData, target: parseInt(e.target.value) })}
              className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'border-white/10 bg-[#08172B] text-white' : 'border-slate-200 bg-white text-slate-900'} focus:outline-none focus:ring-2 focus:ring-[#63b32e]`}
              placeholder="50000000"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Date de début
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'border-white/10 bg-[#08172B] text-white' : 'border-slate-200 bg-white text-slate-900'} focus:outline-none focus:ring-2 focus:ring-[#63b32e]`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Date de fin
              </label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'border-white/10 bg-[#08172B] text-white' : 'border-slate-200 bg-white text-slate-900'} focus:outline-none focus:ring-2 focus:ring-[#63b32e]`}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 rounded-xl bg-[#63b32e] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#529426]"
            >
              {campaign ? 'Mettre à jour' : 'Créer la campagne'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${isDark ? 'border-white/10 text-slate-200 hover:bg-white/5' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
