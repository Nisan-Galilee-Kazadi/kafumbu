import { createContext, useContext, useEffect, useState } from 'react';

const FundraisingContext = createContext();
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/admin';
const FUNDING_GOAL = 500000000;

export function FundraisingProvider({ children }) {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCampaigns = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE_URL}/public/content`);
      const json = await res.json();
      if (json.campaigns) {
        const mappedCampaigns = json.campaigns.map(c => ({
          id: c.id,
          title: c.title,
          description: c.description,
          target: Number(c.goal_amount || FUNDING_GOAL),
          raised: Number(c.current_amount || 0),
          startDate: c.start_date,
          endDate: c.end_date,
          status: c.status,
          contributors: 0, // Placeholder
          donations: [],
        }));
        setCampaigns(mappedCampaigns);
        
        const active = mappedCampaigns.find((campaign) => campaign.status === 'active');
        if (active) setSelectedCampaign(active);
      }
    } catch (error) {
      console.error('Failed to fetch campaigns from DB:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const totalRaised = campaigns.reduce((sum, campaign) => sum + Number(campaign.raised || 0), 0);
  const totalContributors = campaigns.reduce((sum, campaign) => sum + Number(campaign.contributors || 0), 0);

  const statistics = {
    totalRaised,
    totalContributors,
    activeCampaigns: campaigns.filter((c) => c.status === 'active').length,
    averageDonation: totalContributors > 0 ? Number((totalRaised / totalContributors).toFixed(2)) : 0,
  };

  const settings = {
    modalDelay: 3000,
    checkInterval: 300000,
    sessionStorageKey: 'fundraisingModalClosed',
    currency: 'USD',
    timezone: 'Africa/Kinshasa',
  };

  const selectCampaign = (campaignId) => {
    const campaign = campaigns.find((item) => item.id === campaignId);
    if (campaign) setSelectedCampaign(campaign);
  };

  const addDonation = async (campaignId, donation) => {
    // Simulation d'un ajout de don (à relier à une vraie route de paiement si nécessaire)
    const amount = Number(donation.amount || 0);
    if (!amount || amount <= 0) return null;

    const fallbackCampaign = campaigns.find((campaign) => campaign.status === 'active') || campaigns[0];
    const targetCampaignId = campaignId || fallbackCampaign?.id;

    setCampaigns(prev => prev.map(campaign => {
      if (campaign.id === targetCampaignId) {
        return {
          ...campaign,
          raised: campaign.raised + amount,
          contributors: campaign.contributors + 1
        };
      }
      return campaign;
    }));
    return { amount };
  };

  const getActiveCampaigns = () => {
    return campaigns.filter(c => c.status === 'active');
  };

  // Mock des fonctions de création/update qui sont maintenant gérées par l'Admin Dashboard
  const createCampaign = () => {};
  const updateCampaign = () => {};
  const deleteCampaign = () => {};

  const value = {
    campaigns,
    selectedCampaign,
    statistics,
    isLoading,
    settings,
    fundingGoal: FUNDING_GOAL,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    selectCampaign,
    addDonation,
    getActiveCampaigns,
  };

  return <FundraisingContext.Provider value={value}>{children}</FundraisingContext.Provider>;
}

export function useFundraising() {
  const context = useContext(FundraisingContext);
  if (!context) throw new Error('useFundraising must be used within a FundraisingProvider');
  return context;
}
