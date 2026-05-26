import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  getCurrentUser, 
  logoutUser, 
  getDonationsForUser, 
  getInteractionsForUser, 
  addDonation, 
  addInteraction,
  updateUserProfile,
  getMessagesForUser
} from '../utils/userAuth';
import { visitorMessageService } from '../services/messageService';
import { useLang } from '../context/LangContext';
import { 
  FiUser, FiMail, FiPhone, FiBriefcase, FiDollarSign, FiActivity, 
  FiDownload, FiLogOut, FiCheckCircle, FiClock, FiTrendingUp, 
  FiCalendar, FiGrid, FiAward, FiFileText, FiBookOpen, FiMoon, FiSun, FiMenu, FiX, FiArrowLeft, FiBell, FiSearch, FiSettings,
  FiSend, FiFolder, FiInbox, FiMessageSquare
} from 'react-icons/fi';
import CustomAlertModal from '../components/CustomAlertModal';
import { RiSeedlingLine, RiMedalLine, RiVipDiamondLine } from 'react-icons/ri';
import { User, Leaf, Medal, Diamond, Crown } from '@phosphor-icons/react';
import { useFundraising } from '../context/FundraisingContext';

const TIER_DETAILS = {
  none: {
    name: 'Nouveau Visiteur',
    color: 'text-slate-400 bg-slate-400/10 border-slate-400/20',
    icon: User,
    desc: 'Vous n\'avez pas encore d\'investissement actif. Soutenez le projet pour débloquer votre dashboard.',
    nextMilestone: 10,
    nextTierName: 'Don Citoyen'
  },
  citizen: {
    name: 'Don Citoyen',
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    icon: Leaf,
    desc: 'Merci pour votre engagement citoyen ! Vous participez à l\'essor de l\'infrastructure locale.',
    nextMilestone: 5000,
    nextTierName: 'Investisseur Bronze'
  },
  bronze: {
    name: 'Investisseur Bronze',
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    icon: Medal,
    desc: 'Investisseur clé de la Phase 1. Vous bénéficiez d\'un accès régulier aux équipes dirigeantes.',
    nextMilestone: 25000,
    nextTierName: 'Investisseur Silver'
  },
  silver: {
    name: 'Investisseur Silver',
    color: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
    icon: Diamond,
    desc: 'Partenaire stratégique. Vous disposez d\'un droit de regard et d\'un ROI prioritaire sur la Smart City.',
    nextMilestone: 100000,
    nextTierName: 'Investisseur Gold'
  },
  gold: {
    name: 'Investisseur Gold',
    color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.15)]',
    icon: Crown,
    desc: 'Membre d\'élite institutionnel. Accompagnement VIP dédié et intégration au comité consultatif suprême.',
    nextMilestone: null,
    nextTierName: ''
  }
};

const renderTierBadge = (tier, isDark) => {
  const badgeConfig = {
    none: {
      label: 'Nouveau Visiteur',
      icon: User,
      colors: isDark 
        ? 'bg-slate-500/5 border-white/5 text-slate-400' 
        : 'bg-slate-100 border-slate-200/80 text-slate-600'
    },
    citizen: {
      label: 'Don Citoyen',
      icon: Leaf,
      colors: isDark 
        ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' 
        : 'bg-emerald-50 border-emerald-200/60 text-emerald-700'
    },
    bronze: {
      label: 'Investisseur Bronze',
      icon: Medal,
      colors: isDark 
        ? 'bg-amber-500/5 border-amber-500/20 text-amber-400' 
        : 'bg-amber-50 border-amber-200/60 text-amber-700'
    },
    silver: {
      label: 'Investisseur Silver',
      icon: Diamond,
      colors: isDark 
        ? 'bg-cyan-500/5 border-cyan-500/20 text-cyan-400' 
        : 'bg-cyan-50 border-cyan-200/60 text-cyan-700'
    },
    gold: {
      label: 'Investisseur Gold',
      icon: Crown,
      colors: isDark 
        ? 'bg-yellow-500/5 border-[#D4AF37]/35 text-[#D4AF37]' 
        : 'bg-yellow-50/50 border-[#D4AF37]/45 text-[#b58c1e]'
    }
  };

  const config = badgeConfig[tier] || badgeConfig.none;
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border text-[10px] font-semibold tracking-wider font-mono transition-all duration-300 ${config.colors}`}>
      <Icon size={14} weight="fill" className="shrink-0" />
      <span>{config.label}</span>
    </div>
  );
};

const KscLogo = ({ isDark = false }) => (
  <div className="relative w-16 h-16 flex items-center justify-center group cursor-pointer transition-transform duration-500">
    <svg
      className={`absolute inset-0 w-full h-full transition-all duration-500 ease-in-out group-hover:scale-105 ${isDark ? "text-white" : "text-[#0B1526]"}`}
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
    >
      <path
        d="M50 5 L95 50 L50 95 L5 50 Z"
        strokeWidth="2.5"
        strokeLinejoin="miter"
        fill={isDark ? "#071426" : "white"}
      />
      <path
        d="M50 18 L82 50 L50 82 L18 50 Z"
        strokeWidth="1"
        strokeDasharray="4 2"
        opacity="0.4"
        fill="none"
      />
      <path d="M50 5 L50 95" strokeWidth="0.5" opacity="0.15" fill="none" />
    </svg>

    <div className="relative z-10 flex flex-col items-center pt-2">
      <span className="text-emerald-600 font-black text-[14px] leading-tight tracking-tighter drop-shadow-sm">
        KSC
      </span>
      <div className="w-5 h-[1.5px] bg-emerald-600/30 -mt-0.5" />
      <span
        className={`${isDark ? "text-white" : "text-[#0B1526]"} font-bold text-[5px] tracking-[0.3em] uppercase opacity-80 mt-0.5`}
      >
        PORTAL
      </span>
    </div>
  </div>
);

export default function VisitorDashboard() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useLang();
  const { campaigns, addDonation: addFundraisingDonation } = useFundraising();
  const isDark = theme === 'dark';

  const [user, setUser] = useState(null);
  const [donations, setDonations] = useState([]);
  const [interactions, setInteractions] = useState([]);
  const [visitorNotifications, setVisitorNotifications] = useState([]);

  // Active Tab state (persisted on page refresh)
  const [activeTab, setActiveTab] = useState(() => {
    return sessionStorage.getItem('ksc-visitor-active-tab') || 'overview';
  });
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  useEffect(() => {
    sessionStorage.setItem('ksc-visitor-active-tab', activeTab);
  }, [activeTab]);

  const updateUnreadCount = () => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      const allMsgs = getMessagesForUser(currentUser.id);
      const count = allMsgs.filter(m => m.senderId === 1 && !m.read).length;
      setUnreadMessagesCount(count);
    }
  };

  useEffect(() => {
    updateUnreadCount();
    const handleStorage = () => {
      updateUnreadCount();
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [user?.id]);

  useEffect(() => {
    updateUnreadCount();
  }, [activeTab]);

  // Settings Form States
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileCompany, setProfileCompany] = useState('');
  const [profilePassword, setProfilePassword] = useState('');
  const [profileConfirmPassword, setProfileConfirmPassword] = useState('');
  
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [newPayType, setNewPayType] = useState('card');
  const [newPayName, setNewPayName] = useState('');
  const [newPayDetails, setNewPayDetails] = useState('');
  
  const [settingsSuccess, setSettingsSuccess] = useState('');
  const [settingsError, setSettingsError] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Simulation State
  const [simulatedAmount, setSimulatedAmount] = useState(1000);

  // Search & Command Palette States
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Alert Modal State
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ title: '', message: '', type: 'info' });

  const triggerAlert = (title, message, type = 'info') => {
    setAlertConfig({ title, message, type });
    setAlertOpen(true);
  };

  // Keyboard listener for Cmd/Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(prev => !prev);
      }
      if (e.key === 'Escape') {
        setShowCommandPalette(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getFilteredCommands = () => {
    const query = searchQuery.toLowerCase().trim();
    
    const allItems = [
      { id: 'act-donate', title: 'Faire une contribution / don financière', type: 'action', action: () => { setActiveTab('donations'); setShowCommandPalette(false); } },
      { id: 'act-cert', title: 'Télécharger mon Certificat d\'Engagement d\'Investisseur', type: 'action', action: () => { handleDownloadCertificate(); setShowCommandPalette(false); } },
      { id: 'act-settings', title: 'Accéder aux Paramètres de mon profil', type: 'action', action: () => { setActiveTab('settings'); setShowCommandPalette(false); } },
      { id: 'act-logout', title: 'Me déconnecter du portail', type: 'action', action: () => { handleLogout(); setShowCommandPalette(false); } },
      { id: 'doc-brochure', title: 'Télécharger la Brochure officielle KSC (PDF)', type: 'document', action: () => { handleDownloadBrochure(); setShowCommandPalette(false); } },
      { id: 'doc-impact', title: 'Télécharger le Rapport d\'Impact Social 2026 (PDF)', type: 'document', action: () => { handleDownloadBrochure(); setShowCommandPalette(false); } },
      { id: 'doc-plan', title: 'Télécharger le Plan Directeur de Construction (ZIP)', type: 'document', action: () => { handleDownloadBrochure(); setShowCommandPalette(false); } },
      { id: 'perk-all', title: 'Voir la liste complète de mes Privilèges et Avantages', type: 'perk', action: () => { setActiveTab('perks'); setShowCommandPalette(false); } }
    ];

    if (!query) return allItems.slice(0, 5);

    return allItems.filter(item => 
      item.title.toLowerCase().includes(query) || 
      item.type.toLowerCase().includes(query)
    );
  };

  // Donation form state
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [showDonationSuccess, setShowDonationSuccess] = useState(false);
  const [lastUpgradeMsg, setLastUpgradeMsg] = useState('');

  // Mobile sidebar open state
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadUserData = () => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/admin/login');
      return;
    }
    if (currentUser.role === 'admin') {
      navigate('/admin/dashboard');
      return;
    }

    setUser(currentUser);
    setDonations(getDonationsForUser(currentUser.id));
    setInteractions(getInteractionsForUser(currentUser.id));
    visitorMessageService.getNotifications(currentUser.id).then((items) => {
      setVisitorNotifications(Array.isArray(items) ? items : []);
    });
    
    // Initialisation des données de profil
    setProfileName(currentUser.name || '');
    setProfileEmail(currentUser.email || '');
    setProfilePhone(currentUser.phone || '');
    setProfileCompany(currentUser.company || '');
    setPaymentMethods(currentUser.paymentMethods || [
      { id: '1', type: 'card', name: 'Visa de simulation', details: '•••• •••• •••• 4242' },
      { id: '2', type: 'mobile', name: 'M-Pesa / Orange Money', details: currentUser.phone || '+243 888 888 888' }
    ]);

    setLoading(false);
    updateUnreadCount();
  };

  const handleMarkNotificationRead = async (id) => {
    if (!user) return;
    await visitorMessageService.markNotificationRead(user.id, id);
    const refreshed = await visitorMessageService.getNotifications(user.id);
    setVisitorNotifications(Array.isArray(refreshed) ? refreshed : []);
  };

  const markAllNotificationsAsRead = async () => {
    if (!user) return;
    const unread = visitorNotifications.filter((item) => item.status !== 'read');
    await Promise.all(unread.map((item) => visitorMessageService.markNotificationRead(user.id, item.id)));
    const refreshed = await visitorMessageService.getNotifications(user.id);
    setVisitorNotifications(Array.isArray(refreshed) ? refreshed : []);
  };

  const getNotifCategory = (notif) => {
    const title = notif.title.toLowerCase();
    const msg = notif.message.toLowerCase();
    if (title.includes('message') || title.includes('réponse') || msg.includes('message') || msg.includes('réponse') || title.includes('discut')) {
      return { icon: FiMessageSquare, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', borderLeft: 'border-l-blue-500' };
    }
    if (title.includes('don') || title.includes('versement') || title.includes('paiement') || title.includes('transaction') || msg.includes('don') || msg.includes('versement')) {
      return { icon: FiDollarSign, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', borderLeft: 'border-l-emerald-500' };
    }
    if (title.includes('privilège') || title.includes('badge') || title.includes('statut') || title.includes('tier') || msg.includes('privilège')) {
      return { icon: FiAward, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', borderLeft: 'border-l-amber-500' };
    }
    return { icon: FiBell, color: 'text-slate-400 bg-slate-500/10 border-slate-500/20', borderLeft: 'border-l-slate-500' };
  };

  const handleNotificationClick = async (notif) => {
    await handleMarkNotificationRead(notif.id);
    const title = notif.title.toLowerCase();
    const msg = notif.message.toLowerCase();
    if (title.includes('message') || title.includes('réponse') || msg.includes('message') || msg.includes('réponse') || title.includes('discut')) {
      setActiveTab('messages');
    } else if (title.includes('don') || title.includes('versement') || title.includes('paiement') || title.includes('transaction') || msg.includes('don') || msg.includes('versement')) {
      setActiveTab('donations');
    } else if (title.includes('privilège') || title.includes('badge') || title.includes('statut') || title.includes('tier') || msg.includes('privilège')) {
      setActiveTab('perks');
    } else if (title.includes('document') || title.includes('pdf') || msg.includes('document')) {
      setActiveTab('documents');
    }
    setShowNotifDropdown(false);
  };

  useEffect(() => {
    loadUserData();
  }, [navigate]);

  if (loading || !user) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#071426]' : 'bg-slate-50'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#63b32e]" />
      </div>
    );
  }

  // Calculations
  const totalInvested = donations.reduce((sum, d) => sum + d.amount, 0);
  const donationsCount = donations.length;
  const projectedROI = totalInvested > 0 ? (totalInvested * 0.08) : 0;

  const tierInfo = TIER_DETAILS[user.tier] || TIER_DETAILS.none;
  const TierIcon = tierInfo.icon;

  let progressPercent = 100;
  let remainingForNext = 0;
  if (tierInfo.nextMilestone !== null) {
    remainingForNext = tierInfo.nextMilestone - totalInvested;
    if (remainingForNext < 0) remainingForNext = 0;
    progressPercent = Math.min(100, Math.max(0, (totalInvested / tierInfo.nextMilestone) * 100));
  }

  const handleLogout = () => {
    logoutUser();
    navigate('/admin/login');
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setSettingsSuccess('');
    setSettingsError('');

    try {
      const updated = updateUserProfile(user.id, {
        name: profileName,
        email: profileEmail,
        phone: profilePhone,
        company: profileCompany
      });
      if (updated) {
        setUser(updated);
        setSettingsSuccess('Informations de profil mises à jour avec succès !');
        setIsEditingProfile(false);
        setTimeout(() => setSettingsSuccess(''), 4000);
      }
    } catch (err) {
      setSettingsError(err.message || 'Une erreur est survenue.');
    }
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    setSettingsSuccess('');
    setSettingsError('');

    if (!profilePassword) {
      setSettingsError('Veuillez entrer un nouveau mot de passe.');
      return;
    }
    if (profilePassword !== profileConfirmPassword) {
      setSettingsError('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      const updated = updateUserProfile(user.id, { password: profilePassword });
      if (updated) {
        setSettingsSuccess('Mot de passe mis à jour avec succès !');
        setProfilePassword('');
        setProfileConfirmPassword('');
        setTimeout(() => setSettingsSuccess(''), 4000);
      }
    } catch (err) {
      setSettingsError(err.message || 'Une erreur est survenue.');
    }
  };

  const handleAddPaymentMethod = (e) => {
    e.preventDefault();
    setSettingsSuccess('');
    setSettingsError('');

    if (!newPayName || !newPayDetails) {
      setSettingsError('Veuillez renseigner le nom et les détails du moyen de paiement.');
      return;
    }

    const newMethod = {
      id: Date.now().toString(),
      type: newPayType,
      name: newPayName,
      details: newPayDetails
    };

    const updatedMethods = [...paymentMethods, newMethod];
    
    try {
      const updated = updateUserProfile(user.id, { paymentMethods: updatedMethods });
      if (updated) {
        setUser(updated);
        setPaymentMethods(updatedMethods);
        setNewPayName('');
        setNewPayDetails('');
        setSettingsSuccess('Méthode de paiement ajoutée !');
        setTimeout(() => setSettingsSuccess(''), 4000);
      }
    } catch (err) {
      setSettingsError(err.message || 'Une erreur est survenue.');
    }
  };

  const handleDeletePaymentMethod = (id) => {
    const updatedMethods = paymentMethods.filter(m => m.id !== id);
    try {
      const updated = updateUserProfile(user.id, { paymentMethods: updatedMethods });
      if (updated) {
        setUser(updated);
        setPaymentMethods(updatedMethods);
        setSettingsSuccess('Méthode de paiement supprimée !');
        setTimeout(() => setSettingsSuccess(''), 4000);
      }
    } catch (err) {
      setSettingsError(err.message || 'Une erreur est survenue.');
    }
  };

  const handleNewDonation = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    const previousTier = user.tier;

    const donationAmount = Number(amount);
    addDonation(user.id, donationAmount, paymentMethod);
    const activeCampaign = campaigns.find((campaign) => campaign.status === 'active') || campaigns[0];
    if (activeCampaign) {
      addFundraisingDonation(activeCampaign.id, {
        amount: donationAmount,
        contributor: user.name,
        source: 'visitor-dashboard',
        message: `Contribution ${paymentMethod}`,
      });
    }
    
    const updatedUser = getCurrentUser();
    const updatedDonations = getDonationsForUser(user.id);
    const updatedInteractions = getInteractionsForUser(user.id);

    setUser(updatedUser);
    setDonations(updatedDonations);
    setInteractions(updatedInteractions);
    
    const isUpgrade = updatedUser.tier !== previousTier;
    let successMsg = `Votre versement de $${donationAmount.toLocaleString()} USD a été enregistré et synchronisé avec les statistiques de financement.`;
    if (isUpgrade) {
      successMsg += `\n\nFÉLICITATIONS ! Votre profil d'investisseur a été mis à niveau au statut : ${updatedUser.tier.toUpperCase()} !`;
    }
    
    setAmount('');
    triggerAlert('Transaction Validée', successMsg, 'success');
  };

  const handleDownloadCertificate = () => {
    addInteraction(user.id, 'download', 'Téléchargement du Certificat Numérique d\'engagement');
    setInteractions(getInteractionsForUser(user.id));
    triggerAlert('Certificat d\'Engagement', 'Votre certificat numérique d\'investisseur de la Smart City de Kafumbu a été généré avec succès et son téléchargement a débuté.', 'success');
  };

  const handleDownloadBrochure = () => {
    addInteraction(user.id, 'download', 'Téléchargement de la brochure KSC');
    setInteractions(getInteractionsForUser(user.id));
    triggerAlert('Brochure de Présentation', 'Le téléchargement du document officiel de présentation (Kafumbu Smart City Phase 1) a commencé. Merci de votre intérêt !', 'success');
  };

  return (
    <div className={`min-h-screen flex font-sans transition-colors duration-500 ${
      isDark ? 'bg-[#071426] text-white' : 'bg-slate-50 text-slate-800'
    }`}>
      
      {/* ─────────────────────────────────────────────────────────────────
          SIDEBAR : STICKY SUR DESKTOP, COULISSANTE SUR MOBILE
          ───────────────────────────────────────────────────────────────── */}
      <aside className={`shrink-0 w-[320px] border-r flex flex-col justify-between transition-transform duration-300 z-50 ${
        mobileSidebarOpen ? 'fixed inset-y-0 left-0 translate-x-0' : 'fixed inset-y-0 left-0 -translate-x-full lg:sticky lg:top-0 lg:h-screen lg:translate-x-0'
      } ${
        isDark ? 'bg-[#0B1526] border-white/5' : 'bg-white border-slate-200'
      }`}>
        
        {/* En-tête Sidebar - alignement parfait à h-16 border-b */}
        <div className={`h-16 flex items-center px-6 border-b shrink-0 transition-colors duration-500 ${
          isDark ? 'border-white/5 bg-[#0B1526]' : 'border-slate-200 bg-white'
        }`}>
          <div className="flex items-center gap-3">
            <div className="scale-75 origin-left shrink-0">
              <KscLogo isDark={isDark} />
            </div>
            <div>
              <h2 className={`text-xs font-black tracking-widest uppercase leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Kafumbu
              </h2>
              <span className="text-[7px] font-black text-[#63b32e] tracking-[0.2em] uppercase block">
                Espace Invest
              </span>
            </div>
          </div>
        </div>

        {/* Section de navigation scrollable */}
        <div className="p-6 flex-1 overflow-y-auto">
          <nav className="space-y-1.5">
            {[
              { id: 'overview', label: 'Vue d\'ensemble', icon: FiGrid },
              { id: 'perks', label: 'Mes Privilèges', icon: FiAward },
              { id: 'donations', label: 'Transactions & Dons', icon: FiDollarSign },
              { id: 'messages', label: 'Messagerie', icon: FiMessageSquare },
              { id: 'documents', label: 'Documents Officiels', icon: FiFileText },
              { id: 'activity', label: 'Journal d\'Activité', icon: FiActivity },
              { id: 'settings', label: 'Paramètres', icon: FiSettings }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all relative ${
                    isActive 
                      ? isDark ? 'bg-white/5 text-emerald-400' : 'bg-slate-100 text-[#0f70b7]'
                      : isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r bg-emerald-500" />
                  )}
                  <Icon size={16} />
                  <span>{tab.label}</span>
                  {tab.id === 'messages' && unreadMessagesCount > 0 && (
                    <span className={`ml-auto px-2 py-0.5 text-[8px] font-black rounded-full border flex items-center justify-center shrink-0 ${
                      isDark 
                        ? 'bg-emerald-650/20 text-emerald-400 border-emerald-500/30' 
                        : 'bg-emerald-500/10 text-emerald-600 border-emerald-550/25'
                    }`}>
                      {unreadMessagesCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Profil & Déconnexion en bas */}
        <div className={`p-6 border-t ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
          <div className="flex flex-col gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${tierInfo.color}`}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className={`text-xs font-black truncate leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{user.name}</h4>
                <span className="text-[7px] text-slate-500 font-bold block mt-0.5 truncate">{user.email}</span>
              </div>
            </div>
            <div>
              {renderTierBadge(user.tier, isDark)}
            </div>
          </div>

          <button
            onClick={handleLogout}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors border ${
              isDark 
                ? 'border-white/10 text-slate-300 hover:text-white hover:bg-white/5' 
                : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FiLogOut size={12} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Overlay Mobile */}
      {mobileSidebarOpen && (
        <div 
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* ─────────────────────────────────────────────────────────────────
          CONTENU PRINCIPAL : ESPACE DE TRAVAIL RESPONSIVE
          ───────────────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden min-w-0">
        
        {/* Topbar - alignement de hauteur parfait h-16 border-b */}
        <header className={`h-16 px-4 md:px-6 border-b flex items-center justify-between sticky top-0 z-30 transition-colors duration-500 ${
          isDark ? 'bg-[#071426]/80 backdrop-blur-md border-white/5' : 'bg-white/80 backdrop-blur-md border-slate-200'
        }`}>
          {/* Gauche : Burger mobile & Search Input */}
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className={`p-2 rounded-lg lg:hidden border shrink-0 ${
                isDark ? 'border-white/10 text-white' : 'border-slate-200 text-slate-800'
              }`}
            >
              <FiMenu size={18} />
            </button>

            {/* Search Pill */}
            <button
              onClick={() => setShowCommandPalette(true)}
              className={`hidden sm:flex items-center justify-between gap-2.5 rounded-xl px-3 py-1.5 border w-full max-w-[280px] transition-all text-left cursor-pointer ${
                isDark ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <FiSearch className="text-slate-400 shrink-0" size={14} />
                <span className="text-slate-400 text-[11px] font-bold">Rechercher...</span>
              </div>
              <span className={`text-[9px] font-mono border px-1.5 py-0.5 rounded-md font-bold shrink-0 ${
                isDark ? 'border-white/15 text-slate-500 bg-white/5' : 'border-slate-200 text-slate-405 bg-white'
              }`}>Ctrl K</span>
            </button>
          </div>

          {/* Droite : Actions globales (Notifications, Thème, Profil) */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Notification Bell Icon */}
            {/* Notification Bell Icon & Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className={`p-2 rounded-lg border relative transition-all cursor-pointer ${
                  isDark ? 'border-white/10 text-slate-300 hover:text-white bg-white/5' : 'border-slate-200 text-slate-600 hover:text-slate-900 bg-slate-50'
                }`}
              >
                <FiBell size={14} />
                {(() => {
                  const unreadNotifCount = visitorNotifications.filter((item) => item.status !== 'read').length;
                  if (unreadNotifCount > 0) {
                    return (
                      <span className={`absolute -top-1 -right-1 px-1 py-0.5 text-[8px] font-black rounded-full border flex items-center justify-center min-w-[12px] h-[12px] shrink-0 leading-none ${
                        isDark
                          ? 'bg-emerald-500 text-[#081120] border-[#081120]'
                          : 'bg-emerald-500 text-white border-white'
                      }`}>
                        {unreadNotifCount}
                      </span>
                    );
                  }
                  return null;
                })()}
              </button>

              {showNotifDropdown && (
                <>
                  {/* Transparent overlay backdrop to close dropdown */}
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifDropdown(false)} />
                  
                  {/* Dropdown Card */}
                  <div className={`absolute right-0 top-full mt-2 w-80 rounded-xl border p-4 z-50 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 ${
                    isDark 
                      ? 'bg-[#0B1526] border-white/10 text-white shadow-black/80' 
                      : 'bg-white border-slate-200 text-slate-800 shadow-slate-350/50'
                  }`}>
                    <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Notifications</span>
                      {visitorNotifications.some(n => n.status !== 'read') && (
                        <button 
                          onClick={markAllNotificationsAsRead}
                          className="text-[9px] font-bold text-emerald-505 hover:text-emerald-400 uppercase tracking-wider cursor-pointer bg-transparent border-none outline-none"
                        >
                          Tout lu
                        </button>
                      )}
                    </div>

                    <div className="max-h-64 overflow-y-auto space-y-2.5 divide-y divide-white/5 pr-1">
                      {visitorNotifications.length === 0 ? (
                        <div className="py-6 text-center text-[10px] font-bold text-slate-500 uppercase">
                          Aucune notification
                        </div>
                      ) : (
                        visitorNotifications.map((notif) => {
                          const cat = getNotifCategory(notif);
                          const CatIcon = cat.icon;
                          const isUnread = notif.status !== 'read';
                          return (
                            <div 
                              key={notif.id} 
                              onClick={() => handleNotificationClick(notif)}
                              className={`pt-2.5 pb-1.5 px-2 border-l-2 flex items-start gap-3 transition-all rounded-r-lg cursor-pointer ${cat.borderLeft} ${
                                isUnread 
                                  ? isDark ? 'bg-white/[0.02] hover:bg-white/[0.04]' : 'bg-slate-50 hover:bg-slate-100'
                                  : 'opacity-50 hover:opacity-100 hover:bg-white/[0.01]'
                              }`}
                            >
                              <div className={`p-1.5 rounded-lg border shrink-0 ${cat.color}`}>
                                <CatIcon size={12} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <span className={`text-[9.5px] font-black uppercase tracking-wide block truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    {notif.title}
                                  </span>
                                  {isUnread && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                  )}
                                </div>
                                <p className={`text-[9px] mt-0.5 leading-relaxed break-words ${isDark ? 'text-slate-400' : 'text-slate-650'}`}>
                                  {notif.message}
                                </p>
                                {notif.createdAt && (
                                  <span className="text-[7.5px] text-slate-500 font-bold block mt-1 font-mono uppercase">
                                    {new Date(notif.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Theme selector */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg border transition-all ${
                isDark ? 'border-white/10 text-amber-300 bg-white/5' : 'border-slate-200 text-slate-600 bg-slate-50'
              }`}
            >
              {isDark ? <FiSun size={14} /> : <FiMoon size={14} />}
            </button>

            {/* Vertical Divider */}
            <div className={`w-[1px] h-6 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />

            {/* Profile User Pill Info */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col text-right">
                <span className={`text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {user.name}
                </span>
                <span className="text-[8px] text-slate-450 font-bold uppercase tracking-widest mt-0.5">
                  {tierInfo.name}
                </span>
              </div>
              <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs ${tierInfo.color}`}>
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Lien retour site */}
            <Link
              to="/"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-colors border ${
                isDark 
                  ? 'border-white/10 text-slate-300 hover:text-white bg-white/5' 
                  : 'border-slate-200 text-slate-600 hover:text-slate-900 bg-slate-50'
              }`}
            >
              <FiArrowLeft size={10} /> Site
            </Link>
          </div>
        </header>

        {/* Espace de contenu */}
        <div className="flex-1 py-6 md:py-8 px-4 md:px-6 w-full max-w-full mx-auto">
          
          {/* ALERTE UPGRADE / TRANSACTION SUCCÈS */}
          {showDonationSuccess && (
            <div className="mb-6 p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 flex items-start gap-4 animate-in fade-in zoom-in-95 duration-300">
              <FiCheckCircle className="text-emerald-500 shrink-0 mt-1" size={24} />
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-wider">Transaction validée avec succès</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Votre investissement a bien été ajouté à la base de données.
                </p>
                {lastUpgradeMsg && (
                  <p className="text-xs font-black text-[#D4AF37] mt-3 uppercase tracking-widest bg-black/40 px-3 py-1.5 rounded-lg inline-block border border-[#D4AF37]/20">
                    {lastUpgradeMsg}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────────
              TAB 1 : VUE D'ENSEMBLE (OVERVIEW)
              ───────────────────────────────────────────────────────────────── */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Carte de Bienvenue redesignée avec le badge élite */}
              <div className={`p-6 rounded-xl border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-colors duration-500 ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-md'
              }`}>
                <div>
                  <h2 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Bienvenue, {user.name}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Accédez au résumé de vos engagements et suivez la progression de la Phase 1 de Kafumbu Smart City.
                  </p>
                </div>
                <div className="shrink-0 self-start sm:self-center">
                  {renderTierBadge(user.tier, isDark)}
                </div>
              </div>

              {/* Compteurs Statistiques */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`p-6 rounded-xl border flex flex-col justify-between min-h-[140px] transition-colors duration-500 ${
                  isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'
                }`}>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Investi</span>
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                      <FiDollarSign size={18} />
                    </div>
                  </div>
                  <div>
                    <h3 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      ${totalInvested.toLocaleString()} <span className="text-[10px] font-bold text-slate-500">USD</span>
                    </h3>
                  </div>
                </div>

                <div className={`p-6 rounded-xl border flex flex-col justify-between min-h-[140px] transition-colors duration-500 ${
                  isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'
                }`}>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Versements</span>
                    <div className="p-2 rounded-lg bg-[#0f70b7]/10 text-[#0f70b7]">
                      <FiClock size={18} />
                    </div>
                  </div>
                  <div>
                    <h3 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {donationsCount} <span className="text-[10px] font-bold text-slate-500">Transactions</span>
                    </h3>
                  </div>
                </div>

                <div className={`p-6 rounded-xl border flex flex-col justify-between min-h-[140px] transition-colors duration-500 ${
                  isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'
                }`}>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ROI Estimé (Annuel)</span>
                    <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500">
                      <FiTrendingUp size={18} />
                    </div>
                  </div>
                  <div>
                    <h3 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      ${projectedROI.toLocaleString()} <span className="text-[10px] font-bold text-slate-500">USD/an</span>
                    </h3>
                  </div>
                </div>
              </div>

              {/* Barre de Progression de Niveau */}
              {tierInfo.nextMilestone !== null && (
                <div className={`p-6 rounded-xl border transition-colors duration-500 ${
                  isDark ? 'bg-[#0B1D35] border-white/10' : 'bg-white border-slate-200 shadow-sm'
                }`}>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Progression vers le niveau supérieur
                    </span>
                    <span className="text-[#D4AF37] font-black text-xs uppercase tracking-widest">
                      {tierInfo.nextTierName}
                    </span>
                  </div>
                  
                  <div className="h-6 w-full bg-white/5 rounded-xl border border-white/10 p-1 relative overflow-hidden flex items-center justify-center">
                    <div
                      style={{ width: `${progressPercent}%` }}
                      className="absolute left-1 top-1 bottom-1 bg-linear-to-r from-[#D4AF37] to-[#996515] rounded-lg transition-all duration-500"
                    />
                    <span className="relative z-10 text-white font-black text-[10px] tracking-widest drop-shadow-md">
                      {Math.round(progressPercent)}%
                    </span>
                  </div>

                  <div className="flex justify-between items-center mt-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <span>Actuel : ${totalInvested.toLocaleString()}</span>
                    <span>Encore ${remainingForNext.toLocaleString()} pour débloquer</span>
                  </div>
                </div>
              )}

              {/* SIMULATEUR ROI & CROISSANCE D'INVESTISSEMENT */}
              <div className={`p-6 rounded-xl border transition-colors duration-500 ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className={`text-base font-black uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Simulateur ROI & Croissance d'Investissement
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">
                      Ajustez le montant pour estimer le retour annuel estimé et visualiser l'évolution de vos gains.
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <span className="text-[10px] font-black text-[#63b32e] uppercase tracking-widest bg-[#63b32e]/10 border border-[#63b32e]/20 px-3 py-1.5 rounded-lg">
                      Rendement de base : +12.5% / an
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Curseur de simulation */}
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Montant Simulé (USD)</span>
                        <span className={`text-sm font-black ${isDark ? 'text-emerald-450' : 'text-[#0f70b7]'}`}>
                          ${simulatedAmount.toLocaleString()} USD
                        </span>
                      </div>
                      
                      <input 
                        type="range" 
                        min="100" 
                        max="250000" 
                        step="500"
                        value={simulatedAmount}
                        onChange={(e) => setSimulatedAmount(Number(e.target.value))}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-700 accent-emerald-500 focus:outline-none"
                      />
                      
                      <div className="flex flex-wrap gap-2 mt-4">
                        {[1000, 5000, 25000, 100000, 250000].map((val) => (
                          <button
                            key={val}
                            onClick={() => setSimulatedAmount(val)}
                            className={`px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-widest transition-colors cursor-pointer ${
                              simulatedAmount === val
                                ? 'bg-[#63b32e] text-white border-[#63b32e]'
                                : isDark 
                                  ? 'border-white/10 text-slate-300 bg-white/5 hover:bg-white/10' 
                                  : 'border-slate-200 text-slate-600 bg-slate-100 hover:bg-slate-200'
                            }`}
                          >
                            ${val.toLocaleString()}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Prédictions Visuelles */}
                  <div className={`p-5 rounded-xl border flex flex-col justify-between gap-4 ${
                    isDark ? 'bg-[#0B1526] border-white/5' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                        <span className="text-slate-400">Année 1 (ROI) :</span>
                        <span className="text-emerald-500 font-black">+${Math.round(simulatedAmount * 0.125).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                        <span className="text-slate-400">Année 3 (Cumulé) :</span>
                        <span className="text-emerald-500 font-black">+${Math.round(simulatedAmount * 0.125 * 3).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                        <span className="text-slate-400">Année 5 (Cumulé) :</span>
                        <span className="text-emerald-500 font-black">+${Math.round(simulatedAmount * 0.125 * 5).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className={`border-t pt-3 ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">Niveau Débloqué Estimé</span>
                      <div className="flex items-center gap-1.5 mt-1">
                        {(() => {
                          let tierName = 'CITOYEN';
                          let Icon = Leaf;
                          let colorClass = 'text-emerald-500';
                          if (simulatedAmount >= 100000) {
                            tierName = 'OR (Élite)';
                            Icon = Crown;
                            colorClass = 'text-amber-500';
                          } else if (simulatedAmount >= 25000) {
                            tierName = 'ARGENT';
                            Icon = Diamond;
                            colorClass = 'text-slate-350';
                          } else if (simulatedAmount >= 5000) {
                            tierName = 'BRONZE';
                            Icon = Medal;
                            colorClass = 'text-amber-600';
                          }
                          return (
                            <>
                              <Icon size={14} className={colorClass} weight="fill" />
                              <span className={`text-[10px] font-black uppercase tracking-widest ${colorClass}`}>
                                {tierName}
                              </span>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* GRID INFRASTRUCTURE & ACTIVITÉS RÉCENTES */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Progression Globale Smart City */}
                <div className={`p-6 rounded-xl border transition-colors duration-500 ${
                  isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'
                }`}>
                  <h3 className={`text-base font-black uppercase tracking-wider mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Progression Globale du Projet Kafumbu
                  </h3>

                  <div className="space-y-4">
                    {[
                      { name: 'Phase 1 : Énergie Solaire & Voirie', percent: 87, status: 'En cours de finalisation', color: 'from-emerald-500 to-teal-600' },
                      { name: 'Phase 2 : Hub Technologique & Résidences', percent: 15, status: 'Planification stratégique', color: 'from-[#0f70b7] to-cyan-500' },
                      { name: 'Phase 3 : Port Autonome & Agro-industrie', percent: 0, status: 'Études d\'impact', color: 'from-[#996515] to-[#D4AF37]' },
                    ].map((phase, i) => (
                      <div key={i} className="space-y-1.5">
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                          <span className={isDark ? 'text-white' : 'text-slate-700'}>{phase.name}</span>
                          <span className="text-slate-400">{phase.percent}%</span>
                        </div>
                        <div className="h-3 w-full bg-white/5 rounded-md border border-white/5 overflow-hidden relative">
                          <div 
                            style={{ width: `${phase.percent}%` }}
                            className={`h-full bg-linear-to-r ${phase.color} rounded-r`}
                          />
                        </div>
                        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{phase.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Historique des Activités / Transactions Récentes */}
                <div className={`p-6 rounded-xl border transition-colors duration-500 ${
                  isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'
                } flex flex-col justify-between`}>
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className={`text-base font-black uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Versements Récents
                      </h3>
                      <button
                        onClick={() => setActiveTab('donations')}
                        className="text-[9px] font-black uppercase tracking-widest text-[#0f70b7] hover:underline cursor-pointer"
                      >
                        Voir tout
                      </button>
                    </div>

                    <div className="space-y-3">
                      {donations.slice(0, 3).map((don, idx) => (
                        <div key={don.id || idx} className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                          isDark ? 'border-white/5 bg-[#0B1526]/50' : 'border-slate-100 bg-slate-50'
                        }`}>
                          <div className="min-w-0">
                            <span className={`text-[10px] font-black uppercase tracking-wider block ${isDark ? 'text-white' : 'text-slate-800'}`}>
                              ${don.amount.toLocaleString()} USD
                            </span>
                            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block mt-0.5">
                              Réf: {don.transactionRef} • {new Date(don.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${
                            don.status === 'completed'
                              ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500'
                              : 'border-amber-500/20 bg-amber-500/10 text-amber-500'
                          }`}>
                            {don.status === 'completed' ? 'Validé' : 'En attente'}
                          </span>
                        </div>
                      ))}

                      {donations.length === 0 && (
                        <div className="text-center py-8">
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Aucun versement enregistré</p>
                          <button
                            onClick={() => setActiveTab('donations')}
                            className="mt-3 px-4 py-2 border border-dashed border-[#63b32e]/45 hover:border-[#63b32e] text-[#63b32e] text-[9px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer"
                          >
                            Faire mon premier versement
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {donations.length > 0 && (
                    <div className={`border-t pt-3 mt-4 text-[9px] font-bold uppercase tracking-widest text-slate-500 flex justify-between items-center ${
                      isDark ? 'border-white/5' : 'border-slate-150'
                    }`}>
                      <span>Total Transactions: {donationsCount}</span>
                      <span>Dernière activité le {new Date(donations[0]?.createdAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────────
              TAB 2 : MES PRIVILÈGES (PERKS)
              ───────────────────────────────────────────────────────────────── */}
          {activeTab === 'perks' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className={`p-6 rounded-3xl border ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-md'
              }`}>
                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Vos Privilèges et Avantages
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Les privilèges s'accumulent au fur et à mesure de vos contributions financières.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {[
                    { key: 'citizen', label: 'Certificat numérique d\'engagement', has: user.tier !== 'none', action: handleDownloadCertificate, actionLabel: 'Télécharger' },
                    { key: 'citizen', label: 'Rapports financiers trimestriels', has: user.tier !== 'none' },
                    { key: 'bronze', label: 'Droit de visite de l\'infrastructure', has: ['bronze', 'silver', 'gold'].includes(user.tier) },
                    { key: 'bronze', label: 'Appel trimestriel direct avec le CEO', has: ['bronze', 'silver', 'gold'].includes(user.tier) },
                    { key: 'silver', label: 'Siège consultatif stratégique', has: ['silver', 'gold'].includes(user.tier) },
                    { key: 'silver', label: 'Droit de Naming infrastructure', has: ['silver', 'gold'].includes(user.tier) },
                    { key: 'gold', label: 'Accompagnement VIP dédié', has: user.tier === 'gold' },
                    { key: 'gold', label: 'Rapports financiers audités prioritaires', has: user.tier === 'gold' },
                  ].map((perk, i) => (
                    <div key={i} className={`flex items-start justify-between p-4 rounded-xl border ${
                      perk.has 
                        ? isDark ? 'border-emerald-500/10 bg-emerald-500/5 text-emerald-400' : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        : isDark ? 'border-white/5 bg-white/5 text-slate-600' : 'border-slate-100 bg-slate-50 text-slate-400'
                    }`}>
                      <span className="text-xs font-bold leading-tight">{perk.label}</span>
                      {perk.action && perk.has && (
                        <button
                          onClick={perk.action}
                          className="text-[9px] font-black uppercase tracking-widest text-[#D4AF37] hover:underline whitespace-nowrap ml-2"
                        >
                          {perk.actionLabel}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────────
              TAB 3 : TRANSACTIONS & DONS
              ───────────────────────────────────────────────────────────────── */}
          {activeTab === 'donations' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Formulaire de don */}
              <div className={`p-6 rounded-3xl border ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-md'
              }`}>
                <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Effectuer un nouvel investissement ou un don
                </h3>

                <form onSubmit={handleNewDonation} className="space-y-6">
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">
                      Montant de la Contribution (USD) *
                    </label>
                    <div className={`flex items-center gap-3 rounded-xl px-4 py-3.5 border transition-all focus-within:ring-2 focus-within:ring-[#63b32e]/45 ${
                      isDark ? 'border-white/10 bg-[#071426]' : 'border-slate-200 bg-slate-50'
                    }`}>
                      <FiDollarSign className="text-slate-400" size={18} />
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        min="1"
                        placeholder="Ex: 5000"
                        className={`w-full bg-transparent text-sm font-bold outline-none ${
                          isDark ? 'text-white' : 'text-slate-800'
                        }`}
                      />
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      {[10, 100, 1000, 5000, 20000].map((quick) => (
                        <button
                          key={quick}
                          type="button"
                          onClick={() => setAmount(quick.toString())}
                          className={`px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-colors ${
                            isDark 
                              ? 'border-white/10 text-slate-300 bg-white/5 hover:bg-white/10' 
                              : 'border-slate-200 text-slate-600 bg-slate-100 hover:bg-slate-200'
                          }`}
                        >
                          +${quick.toLocaleString()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">
                      Mode de Règlement Sécurisé
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'card', name: 'Carte Bancaire', desc: 'Stripe/Visa' },
                        { id: 'bank', name: 'Virement', desc: 'Swift/SEPA' },
                        { id: 'mobile', name: 'Mobile Money', desc: 'M-Pesa/Airtel' },
                      ].map((method) => (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setPaymentMethod(method.id)}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            paymentMethod === method.id 
                              ? 'border-[#63b32e] bg-[#63b32e]/5' 
                              : isDark ? 'border-white/5 bg-white/5' : 'border-slate-100 bg-slate-50'
                          }`}
                        >
                          <span className={`text-[10px] font-black uppercase tracking-wider block ${
                            paymentMethod === method.id ? 'text-[#63b32e]' : isDark ? 'text-white' : 'text-slate-800'
                          }`}>{method.name}</span>
                          <span className="text-[8px] text-slate-500 font-bold block mt-0.5">{method.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl py-4 text-xs font-black uppercase tracking-[0.2em] text-white shadow-lg"
                    style={{
                      background: 'linear-gradient(90deg, #996515 0%, #D4AF37 100%)',
                    }}
                  >
                    Confirmer la contribution
                  </button>
                </form>
              </div>

              {/* Historique Financier */}
              <div className={`p-6 rounded-3xl border ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-md'
              }`}>
                <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Historique Financier
                </h3>
                
                <div className="space-y-3 max-h-[350px] overflow-y-auto">
                  {donations.length === 0 ? (
                    <p className="text-[10px] text-slate-400 font-bold text-center py-6 uppercase tracking-wider">Aucun versement effectué</p>
                  ) : (
                    donations.map((don) => (
                      <div key={don.id} className={`p-4 rounded-xl border flex justify-between items-center ${
                        isDark ? 'border-white/5 bg-[#071426]/40' : 'border-slate-100 bg-slate-50'
                      }`}>
                        <div>
                          <div className={`text-xs font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            ${don.amount.toLocaleString()} USD
                          </div>
                          <span className="text-[8px] font-mono text-slate-500">Ref: {don.transactionRef}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 block">
                            Succès
                          </span>
                          <span className="text-[8px] text-slate-500 font-bold block mt-1">
                            {new Date(don.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────────
              TAB 4 : DOCUMENTS OFFICIELS
              ───────────────────────────────────────────────────────────────── */}
          {activeTab === 'documents' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className={`p-6 rounded-3xl border ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-md'
              }`}>
                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Documents du Projet & Rapport Trimestriel
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Accédez aux brochures officielles, plans d'infrastructures et chartes de transparence de la Smart City.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                  {[
                    { name: 'Brochure Kafumbu Phase 1', size: '14.2 Mo', format: 'PDF', action: handleDownloadBrochure },
                    { name: 'Rapport d\'Impact Social 2026', size: '8.5 Mo', format: 'PDF', action: handleDownloadBrochure },
                    { name: 'Plan Directeur de Construction', size: '28.1 Mo', format: 'ZIP', action: handleDownloadBrochure }
                  ].map((doc) => (
                    <button
                      key={doc.name}
                      onClick={doc.action}
                      className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                        isDark 
                          ? 'border-white/10 bg-white/5 hover:bg-white/10 text-white' 
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 shrink-0">
                        <FiDownload size={16} />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider block truncate max-w-[120px]">{doc.name}</span>
                        <span className="text-[8px] text-slate-500 font-bold block mt-0.5">{doc.format} • {doc.size}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────────
              TAB 5 : LOGS D'ACTIVITÉ
              ───────────────────────────────────────────────────────────────── */}
          {activeTab === 'activity' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className={`p-6 rounded-3xl border ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-md'
              }`}>
                <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Journal d'Activité
                </h3>

                <div className="space-y-3 max-h-[450px] overflow-y-auto">
                  {interactions.length === 0 ? (
                    <p className="text-[10px] text-slate-400 font-bold text-center py-6 uppercase tracking-wider">Aucune activité enregistrée</p>
                  ) : (
                    interactions.slice().reverse().map((act) => (
                      <div key={act.id} className={`p-4 rounded-xl border flex gap-3 items-start ${
                        isDark ? 'border-white/5 bg-[#071426]/40' : 'border-slate-100 bg-slate-50'
                      }`}>
                        <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                          act.type === 'invest' 
                            ? 'bg-amber-500/10 text-amber-500' 
                            : act.type === 'download' 
                              ? 'bg-blue-500/10 text-blue-500' 
                              : 'bg-slate-400/10 text-slate-400'
                        }`}>
                          <FiActivity size={14} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold">
                            {act.details}
                          </p>
                          <span className="text-[8px] text-slate-500 font-bold block mt-1 font-mono">
                            {new Date(act.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────────
              TAB 6 : PARAMÈTRES (SETTINGS)
              ───────────────────────────────────────────────────────────────── */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Alertes d'état pour les Paramètres */}
              {settingsSuccess && (
                <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                  <FiCheckCircle size={16} />
                  {settingsSuccess}
                </div>
              )}
              {settingsError && (
                <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                  <FiX size={16} />
                  {settingsError}
                </div>
              )}

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* COLONNE DE GAUCHE : Carte & Préférences de l'App */}
                <div className="xl:col-span-1 space-y-6">
                  
                  {/* Carte de Membre */}
                  <div className={`relative p-6 rounded-3xl overflow-hidden shadow-xl ${isDark ? 'bg-gradient-to-br from-[#0B1526] to-[#071426] border border-white/10' : 'bg-gradient-to-br from-[#0f70b7] to-[#0c5991] text-white border-none'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <FiAward size={80} />
                    </div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-6">
                        <h3 className="text-[9px] font-black uppercase tracking-widest text-white/60">Carte d'Investisseur KSC</h3>
                        <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-black">{tierInfo.name}</span>
                      </div>
                      
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-2xl font-black border border-white/20 shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h2 className="text-xl font-black truncate">{user.name}</h2>
                          <span className="text-[11px] text-white/70 block truncate mt-0.5">{user.company || 'Investisseur Privé'}</span>
                        </div>
                      </div>

                      <div className="space-y-3 mt-8 text-xs">
                        <div className="flex justify-between items-center border-b border-white/10 pb-2">
                          <span className="text-white/50 uppercase text-[9px] font-bold tracking-widest">Email</span>
                          <span className="font-bold">{user.email}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/10 pb-2">
                          <span className="text-white/50 uppercase text-[9px] font-bold tracking-widest">Téléphone</span>
                          <span className="font-bold">{user.phone || 'Non renseigné'}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2">
                          <span className="text-white/50 uppercase text-[9px] font-bold tracking-widest">Statut</span>
                          <span className="font-bold text-emerald-400">Actif</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => setIsEditingProfile(!isEditingProfile)} 
                        className={`mt-6 w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          isEditingProfile 
                            ? 'bg-red-500/20 text-red-200 border border-red-500/30 hover:bg-red-500/30' 
                            : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                        }`}
                      >
                        {isEditingProfile ? 'Annuler la modification' : 'Modifier mes informations'}
                      </button>
                    </div>
                  </div>

                  {/* Préférences Générales (App Settings) */}
                  <div className={`p-6 rounded-3xl border space-y-4 ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-md'
                  }`}>
                    <h3 className={`text-sm font-black uppercase tracking-wider border-b pb-3 ${isDark ? 'text-white border-white/5' : 'text-slate-900 border-slate-100'}`}>
                      Paramètres de l'Application
                    </h3>
                    
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <span className="text-xs font-bold block">Mode Sombre</span>
                        <span className="text-[9px] text-slate-500 block mt-0.5">Basculer le thème visuel du portail</span>
                      </div>
                      <button
                        onClick={toggleTheme}
                        className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 cursor-pointer shrink-0 ${isDark ? 'bg-[#63b32e]' : 'bg-slate-300'}`}
                      >
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${isDark ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-2 border-t border-white/5">
                      <div>
                        <span className="text-xs font-bold block">Langue de l'interface</span>
                        <span className="text-[9px] text-slate-500 block mt-0.5">Langue active : Français</span>
                      </div>
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border shrink-0 ${isDark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-600'}`}>
                        FR
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-t border-white/5">
                      <div>
                        <span className="text-xs font-bold block">Notifications Push</span>
                        <span className="text-[9px] text-slate-500 block mt-0.5">Mises à jour du projet</span>
                      </div>
                      <div className="w-12 h-6 rounded-full p-1 bg-[#63b32e] cursor-not-allowed opacity-50 shrink-0">
                        <div className="bg-white w-4 h-4 rounded-full shadow-md transform translate-x-6" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* COLONNE DE DROITE : Formulaires (Profil Edit, Password, Pay) */}
                <div className="xl:col-span-2 space-y-6">
                  
                  {/* Formulaire d'édition de profil (Visible seulement si isEditingProfile) */}
                  {isEditingProfile && (
                    <form onSubmit={handleUpdateProfile} className={`p-6 rounded-3xl border space-y-5 animate-in fade-in slide-in-from-top-4 duration-300 ${
                      isDark ? 'bg-[#0B1526]/50 border-emerald-500/30' : 'bg-slate-50 border-emerald-500/30 shadow-md'
                    }`}>
                      <h3 className={`text-sm font-black uppercase tracking-wider border-b pb-3 ${isDark ? 'text-white border-white/5' : 'text-slate-900 border-slate-200'}`}>
                        Modifier mes informations
                      </h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">Nom Complet</label>
                          <input
                            type="text"
                            value={profileName}
                            onChange={(e) => setProfileName(e.target.value)}
                            className={`mt-1.5 w-full rounded-xl border px-4 py-2.5 text-xs font-semibold outline-none transition-all ${
                              isDark 
                                ? 'border-white/10 bg-[#08172B] text-white focus:border-emerald-500/40' 
                                : 'border-slate-300 bg-white text-slate-800 focus:border-[#0f70b7]/40'
                            }`}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">Adresse E-mail</label>
                          <input
                            type="email"
                            value={profileEmail}
                            onChange={(e) => setProfileEmail(e.target.value)}
                            className={`mt-1.5 w-full rounded-xl border px-4 py-2.5 text-xs font-semibold outline-none transition-all ${
                              isDark 
                                ? 'border-white/10 bg-[#08172B] text-white focus:border-emerald-500/40' 
                                : 'border-slate-300 bg-white text-slate-800 focus:border-[#0f70b7]/40'
                            }`}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">Téléphone</label>
                          <input
                            type="text"
                            value={profilePhone}
                            onChange={(e) => setProfilePhone(e.target.value)}
                            className={`mt-1.5 w-full rounded-xl border px-4 py-2.5 text-xs font-semibold outline-none transition-all ${
                              isDark 
                                ? 'border-white/10 bg-[#08172B] text-white focus:border-emerald-500/40' 
                                : 'border-slate-300 bg-white text-slate-800 focus:border-[#0f70b7]/40'
                            }`}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">Organisation / Entreprise</label>
                          <input
                            type="text"
                            value={profileCompany}
                            onChange={(e) => setProfileCompany(e.target.value)}
                            className={`mt-1.5 w-full rounded-xl border px-4 py-2.5 text-xs font-semibold outline-none transition-all ${
                              isDark 
                                ? 'border-white/10 bg-[#08172B] text-white focus:border-emerald-500/40' 
                                : 'border-slate-300 bg-white text-slate-800 focus:border-[#0f70b7]/40'
                            }`}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={() => setIsEditingProfile(false)} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors ${isDark ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-slate-200 text-slate-600'}`}>
                          Annuler
                        </button>
                        <button type="submit" className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors ${isDark ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-[#0f70b7] hover:bg-[#0c5991] text-white'}`}>
                          Enregistrer
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Changement de Mot de Passe */}
                  <form onSubmit={handleUpdatePassword} className={`p-6 rounded-3xl border space-y-4 ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-md'
                  }`}>
                    <h3 className={`text-sm font-black uppercase tracking-wider border-b pb-3 ${isDark ? 'text-white border-white/5' : 'text-slate-900 border-slate-100'}`}>
                      Sécurité & Mot de Passe
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">Nouveau Mot de Passe</label>
                        <input
                          type="password"
                          value={profilePassword}
                          onChange={(e) => setProfilePassword(e.target.value)}
                          className={`mt-1.5 w-full rounded-xl border px-4 py-2.5 text-xs font-semibold outline-none transition-all ${
                            isDark 
                              ? 'border-white/10 bg-[#08172B] text-white focus:border-emerald-500/40' 
                              : 'border-slate-200 bg-slate-50 text-slate-800 focus:border-[#0f70b7]/40 focus:bg-white'
                          }`}
                          placeholder="••••••••"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">Confirmer le Mot de Passe</label>
                        <input
                          type="password"
                          value={profileConfirmPassword}
                          onChange={(e) => setProfileConfirmPassword(e.target.value)}
                          className={`mt-1.5 w-full rounded-xl border px-4 py-2.5 text-xs font-semibold outline-none transition-all ${
                            isDark 
                              ? 'border-white/10 bg-[#08172B] text-white focus:border-emerald-500/40' 
                              : 'border-slate-200 bg-slate-50 text-slate-800 focus:border-[#0f70b7]/40 focus:bg-white'
                          }`}
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={!profilePassword}
                      className={`w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer disabled:opacity-50 ${
                        isDark 
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                          : 'bg-slate-800 hover:bg-slate-900 text-white'
                      }`}
                    >
                      Mettre à jour la sécurité
                    </button>
                  </form>
                </div>
              </div>

              {/* 4. Gestion des Méthodes de Paiement */}
              <div className={`p-6 rounded-3xl border space-y-6 ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-md'
              }`}>
                <h3 className={`text-sm font-black uppercase tracking-wider border-b pb-3 ${isDark ? 'text-white border-white/5' : 'text-slate-900 border-slate-100'}`}>
                  Méthodes de Paiement de Simulation
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Formulaire d'ajout */}
                  <form onSubmit={handleAddPaymentMethod} className={`space-y-3.5 pr-0 md:pr-6 md:border-r ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#63b32e]">Ajouter une méthode</h4>
                    
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500">Type de paiement</label>
                      <select
                        value={newPayType}
                        onChange={(e) => setNewPayType(e.target.value)}
                        className={`mt-1 w-full rounded-xl border px-3 py-2 text-xs font-semibold outline-none transition-all ${
                          isDark 
                            ? 'border-white/10 bg-[#08172B] text-white' 
                            : 'border-slate-200 bg-slate-50 text-slate-800'
                        }`}
                      >
                        <option value="card">Carte Bancaire</option>
                        <option value="mobile">Mobile Money</option>
                        <option value="bank">Compte Bancaire</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500">Nom du Compte / Fournisseur</label>
                      <input
                        type="text"
                        value={newPayName}
                        onChange={(e) => setNewPayName(e.target.value)}
                        placeholder="Ex: Orange Money RDC, Carte Perso"
                        className={`mt-1 w-full rounded-xl border px-3 py-2 text-xs font-semibold outline-none transition-all ${
                          isDark 
                            ? 'border-white/10 bg-[#08172B] text-white placeholder:text-slate-600' 
                            : 'border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400'
                        }`}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500">Numéro / Identifiant Masqué</label>
                      <input
                        type="text"
                        value={newPayDetails}
                        onChange={(e) => setNewPayDetails(e.target.value)}
                        placeholder="Ex: +243 899... ou •••• 1234"
                        className={`mt-1 w-full rounded-xl border px-3 py-2 text-xs font-semibold outline-none transition-all ${
                          isDark 
                            ? 'border-white/10 bg-[#08172B] text-white placeholder:text-slate-500' 
                            : 'border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400'
                        }`}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className={`w-full py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-colors cursor-pointer ${
                        isDark 
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                          : 'bg-[#0f70b7] hover:bg-[#0c5991] text-white'
                      }`}
                    >
                      Ajouter la méthode
                    </button>
                  </form>

                  {/* Liste des méthodes existantes */}
                  <div className="md:col-span-2 space-y-3">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Comptes enregistrés</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {paymentMethods.map((m) => (
                        <div 
                          key={m.id} 
                          className={`p-4 rounded-xl border flex items-center justify-between ${
                            isDark ? 'border-white/5 bg-[#071426]/40' : 'border-slate-100 bg-slate-50'
                          }`}
                        >
                          <div>
                            <span className="text-[9px] font-black uppercase tracking-wider block">{m.name}</span>
                            <span className="text-[10px] text-slate-500 font-bold block mt-0.5 font-mono">{m.details}</span>
                            <span className="text-[8px] bg-slate-500/10 text-slate-400 border border-slate-500/20 px-2 py-0.5 rounded-md uppercase tracking-wider inline-block mt-2 font-mono">
                              {m.type}
                            </span>
                          </div>
                          
                          <button
                            onClick={() => handleDeletePaymentMethod(m.id)}
                            className="text-red-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer"
                            title="Supprimer cette méthode"
                          >
                            <FiX size={14} />
                          </button>
                        </div>
                      ))}
                      
                      {paymentMethods.length === 0 && (
                        <div className="col-span-2 text-center py-8">
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Aucune méthode enregistrée</p>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────────
              TAB 7 : MESSAGERIE OUTLOOK
              ───────────────────────────────────────────────────────────────── */}
          {activeTab === 'messages' && (
            <VisitorMessagesView isDark={isDark} user={user} />
          )}

        </div>
      </main>

      {/* Command Palette / Search Modal */}
      {showCommandPalette && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] p-4">
          {/* Backdrop */}
          <div 
            onClick={() => setShowCommandPalette(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          />

          {/* Dialog Body */}
          <div className={`relative z-10 w-full max-w-lg rounded-2xl border p-4 shadow-2xl overflow-hidden transition-all transform scale-100 ${
            isDark 
              ? 'bg-[#0b1626]/95 border-white/10 text-white shadow-black/80' 
              : 'bg-white border-slate-200 text-slate-800 shadow-slate-300'
          }`}>
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 border-b pb-3 border-white/5">
              <FiSearch className="text-slate-400 shrink-0" size={18} />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tapez pour rechercher (donations, documents, actions...)"
                className="w-full bg-transparent text-sm font-semibold outline-none border-none placeholder:text-slate-500"
              />
              <span className={`text-[9px] font-mono border px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider shrink-0 ${
                isDark ? 'border-white/15 text-slate-400 bg-white/5' : 'border-slate-200 text-slate-400 bg-slate-50'
              }`}>Esc</span>
            </div>

            {/* Matching Results List */}
            <div className="mt-3 max-h-[300px] overflow-y-auto space-y-1">
              {getFilteredCommands().length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Aucun résultat trouvé pour "{searchQuery}"</p>
                </div>
              ) : (
                getFilteredCommands().map((item) => (
                  <button
                    key={item.id}
                    onClick={item.action}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all cursor-pointer ${
                      isDark 
                        ? 'hover:bg-white/5 text-slate-300 hover:text-white' 
                        : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 rounded-lg shrink-0 ${
                        item.type === 'action' 
                          ? 'bg-emerald-500/10 text-emerald-500' 
                          : item.type === 'document'
                            ? 'bg-[#0f70b7]/10 text-[#0f70b7]'
                            : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        {item.type === 'action' ? <FiGrid size={14} /> : item.type === 'document' ? <FiFileText size={14} /> : <FiAward size={14} />}
                      </div>
                      <span className="text-xs font-bold truncate">{item.title}</span>
                    </div>
                    <span className={`text-[8px] font-mono border px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0 font-black ${
                      isDark ? 'border-white/10 text-slate-500' : 'border-slate-200 text-slate-400'
                    }`}>
                      {item.type}
                    </span>
                  </button>
                ))
              )}
            </div>

            {/* Quick tips footer */}
            <div className={`mt-3 pt-3 border-t text-[9px] font-bold uppercase tracking-widest text-slate-500 flex justify-between items-center ${
              isDark ? 'border-white/5' : 'border-slate-100'
            }`}>
              <span>Raccourci: Ctrl + K</span>
              <span>Filtrage en temps réel</span>
            </div>
          </div>
        </div>
      )}

      {/* Reusable Alert Modal */}
      <CustomAlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        isDark={isDark}
      />

    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPOSANT MESSAGERIE STYLE OUTLOOK (VISITEUR / INVESTISSEUR)
// ─────────────────────────────────────────────────────────────────────────────
function VisitorMessagesView({ isDark, user }) {
  const [messages, setMessages] = useState([]);
  const [activeFolder, setActiveFolder] = useState('live'); // 'inbox', 'sent', 'live'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);

  const loadMessages = async () => {
    const data = await visitorMessageService.getMessages(user);
    setMessages(data);
  };

  useEffect(() => {
    loadMessages();
    const timer = window.setInterval(loadMessages, 12000);
    return () => window.clearInterval(timer);
  }, [user.id]);

  useEffect(() => {
    if (activeFolder === 'live' || selectedMessageId) {
      visitorMessageService.markMessagesRead(user.id).then(loadMessages);
    }
  }, [user.id, activeFolder, selectedMessageId]);

  const filteredMessages = messages.filter(m => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return m.content.toLowerCase().includes(query) || m.senderName.toLowerCase().includes(query);
  });

  const inboxMessages = filteredMessages.filter(m => m.senderId === 1);
  const sentMessages = filteredMessages.filter(m => m.senderId === user.id);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setSending(true);
    await visitorMessageService.sendMessage(user.id, inputText.trim());
    setInputText('');
    await loadMessages();
    setSending(false);
    
    setTimeout(() => {
      const chatContainer = document.getElementById('chat-scroll-container');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 50);
  };

  useEffect(() => {
    const chatContainer = document.getElementById('chat-scroll-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [activeFolder, messages.length]);

  return (
    <div className={`rounded-xl border flex flex-col md:flex-row h-[620px] overflow-hidden transition-colors duration-500 ${
      isDark ? 'bg-[#081120] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800 shadow-sm'
    }`}>
      
      {/* 1. OUTLOOK FOLDERS SIDEBAR (Left - w-52) */}
      <div className={`w-full md:w-52 border-r shrink-0 p-4 flex flex-col justify-between ${
        isDark ? 'border-white/5 bg-[#0A1526]/50' : 'border-slate-100 bg-slate-50'
      }`}>
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <FiFolder size={14} className="text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">Dossiers Outlook</span>
          </div>
          
          <nav className="space-y-1">
            <button
              onClick={() => { setActiveFolder('live'); setSelectedMessageId(null); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                activeFolder === 'live'
                  ? isDark ? 'bg-white/5 text-emerald-400' : 'bg-slate-200/80 text-[#0f70b7]'
                  : isDark ? 'text-slate-400 hover:bg-white/5 hover:text-white' : 'text-slate-650 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <span className="flex items-center gap-2">
                <FiMessageSquare size={13} />
                Discussion Directe
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </button>

            <button
              onClick={() => { setActiveFolder('inbox'); setSelectedMessageId(null); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                activeFolder === 'inbox'
                  ? isDark ? 'bg-white/5 text-emerald-400' : 'bg-slate-200/80 text-[#0f70b7]'
                  : isDark ? 'text-slate-400 hover:bg-white/5 hover:text-white' : 'text-slate-650 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <span className="flex items-center gap-2">
                <FiInbox size={13} />
                Boîte de Réception
              </span>
              {inboxMessages.filter(m => !m.read).length > 0 && (
                <span className="bg-emerald-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md">
                  {inboxMessages.filter(m => !m.read).length}
                </span>
              )}
            </button>

            <button
              onClick={() => { setActiveFolder('sent'); setSelectedMessageId(null); }}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                activeFolder === 'sent'
                  ? isDark ? 'bg-white/5 text-emerald-400' : 'bg-slate-200/80 text-[#0f70b7]'
                  : isDark ? 'text-slate-400 hover:bg-white/5 hover:text-white' : 'text-slate-650 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <FiSend size={13} />
              Messages Envoyés
            </button>
          </nav>
        </div>

        <div className="p-2 border-t border-white/5 text-center">
          <span className="text-[7px] font-mono tracking-widest text-slate-500 uppercase">
            [ Sync Active // RDC ]
          </span>
        </div>
      </div>

      {/* 2. OUTLOOK MESSAGE LIST (Middle - w-72) */}
      <div className={`w-full md:w-72 border-r flex flex-col shrink-0 ${
        isDark ? 'border-white/5' : 'border-slate-150 bg-white'
      }`}>
        <div className="p-3 border-b border-white/5">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
              <FiSearch size={12} />
            </span>
            <input
              type="text"
              placeholder="Rechercher un message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-8 pr-3 py-2 rounded-lg text-[10px] font-semibold outline-none transition-all ${
                isDark 
                  ? 'border border-white/10 bg-[#08172B] text-white focus:border-emerald-500/40' 
                  : 'border border-slate-200 bg-slate-50 text-slate-800 focus:border-[#0f70b7]/40 focus:bg-white'
              }`}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-white/5">
          {activeFolder === 'live' && (
            <button
              onClick={() => setSelectedMessageId(null)}
              className={`w-full p-4 text-left flex items-start gap-3 transition-colors ${
                isDark ? 'bg-white/5' : 'bg-slate-50'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                A
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex justify-between items-center">
                  <span className={`text-[10px] font-black uppercase tracking-wider block truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    Support Kafumbu Smart City
                  </span>
                  <span className="text-[7px] text-slate-500 font-bold block shrink-0">LIVE</span>
                </div>
                <p className="text-[10px] font-bold text-[#63b32e] mt-1">Discussion en direct avec l'administration</p>
                <p className="text-[9px] text-slate-400 mt-1 truncate">
                  {messages.length > 0 ? messages[messages.length - 1].content : "Aucun message..."}
                </p>
              </div>
            </button>
          )}

          {activeFolder === 'inbox' && (
            inboxMessages.length === 0 ? (
              <div className="p-8 text-center text-[10px] font-black uppercase tracking-widest text-slate-500">Aucun message reçu</div>
            ) : (
              inboxMessages.map(m => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMessageId(m.id)}
                  className={`w-full p-4 text-left flex items-start gap-3 transition-all ${
                    selectedMessageId === m.id
                      ? isDark ? 'bg-white/5 border-l-2 border-emerald-500' : 'bg-slate-100 border-l-2 border-[#0f70b7]'
                      : isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-[#0f70b7]/10 border border-[#0f70b7]/20 text-[#0f70b7] flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                    A
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-center">
                      <span className={`text-[10px] font-black uppercase tracking-wider block truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        {m.senderName}
                      </span>
                      <span className="text-[7px] text-slate-500 font-bold block shrink-0">
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className={`text-[9px] mt-1 leading-normal ${!m.read ? 'font-black text-white' : 'text-slate-400'}`}>
                      {m.content}
                    </p>
                  </div>
                </button>
              ))
            )
          )}

          {activeFolder === 'sent' && (
            sentMessages.length === 0 ? (
              <div className="p-8 text-center text-[10px] font-black uppercase tracking-widest text-slate-500">Aucun message envoyé</div>
            ) : (
              sentMessages.map(m => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMessageId(m.id)}
                  className={`w-full p-4 text-left flex items-start gap-3 transition-all ${
                    selectedMessageId === m.id
                      ? isDark ? 'bg-white/5 border-l-2 border-emerald-500' : 'bg-slate-100 border-l-2 border-[#0f70b7]'
                      : isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-center">
                      <span className={`text-[10px] font-black uppercase tracking-wider block truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        À : Admin
                      </span>
                      <span className="text-[7px] text-slate-500 font-bold block shrink-0">
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[9px] mt-1 leading-normal text-slate-400">
                      {m.content}
                    </p>
                  </div>
                </button>
              ))
            )
          )}
        </div>
      </div>

      {/* 3. OUTLOOK READING PANE / CHAT (Right - flex-1) */}
      <div className="flex-1 flex flex-col justify-between h-full bg-[#081120]/20">
        <div className={`p-4 border-b flex items-center justify-between shrink-0 ${
          isDark ? 'border-white/5 bg-[#0B1526]/30' : 'border-slate-100 bg-white'
        }`}>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-black uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {activeFolder === 'live' ? 'Assistance Investisseurs' : 'Aperçu du Message'}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[7px] text-slate-500 font-bold uppercase tracking-widest">En ligne</span>
            </div>
            <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
              {activeFolder === 'live' ? 'Assistance technique, administrative & investissements' : 'Message individuel de la boîte'}
            </p>
          </div>

          <div className="text-right">
            <span className="text-[7px] font-mono tracking-widest text-slate-500 uppercase">
              [ SECURE_ROUTE // TLS_1.3 ]
            </span>
          </div>
        </div>

        <div 
          id="chat-scroll-container"
          className="flex-1 p-6 overflow-y-auto space-y-4"
        >
          {activeFolder === 'live' ? (
            messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <FiMessageSquare size={32} className="text-slate-600 mb-2" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Aucun message de support</span>
                <p className="text-[9px] text-slate-600 mt-1 max-w-[200px]">Écrivez votre message ci-dessous pour démarrer l'échange.</p>
              </div>
            ) : (
              messages.map((m) => {
                const isAdmin = m.senderId === 1;
                return (
                  <div key={m.id} className={`flex ${isAdmin ? 'justify-start' : 'justify-end'} animate-in fade-in duration-200`}>
                    <div className={`max-w-[80%] rounded-xl px-4 py-3 border ${
                      isAdmin 
                        ? isDark 
                          ? 'bg-[#0B1526] border-white/5 text-slate-200' 
                          : 'bg-slate-50 border-slate-200 text-slate-800'
                        : isDark
                          ? 'bg-emerald-600/10 border-emerald-500/20 text-emerald-450'
                          : 'bg-[#0f70b7]/10 border-[#0f70b7]/20 text-[#0f70b7]'
                    }`}>
                      <div className="flex justify-between items-center gap-8 mb-1">
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 font-mono">{m.senderName}</span>
                        <span className="text-[6.5px] text-slate-500 font-bold">
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[10px] leading-relaxed font-semibold break-words whitespace-pre-wrap">{m.content}</p>
                    </div>
                  </div>
                );
              })
            )
          ) : (
            (() => {
              const selectedMsg = messages.find(m => m.id === selectedMessageId);
              if (!selectedMsg) {
                return (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <FiInbox size={32} className="text-slate-600 mb-2" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Sélectionnez un message</span>
                    <p className="text-[9px] text-slate-600 mt-1 max-w-[200px]">Cliquez sur un message dans la liste du milieu pour lire son contenu.</p>
                  </div>
                );
              }
              const isAdmin = selectedMsg.senderId === 1;
              return (
                <div className={`p-6 rounded-xl border animate-in fade-in duration-300 ${
                  isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex justify-between items-start border-b border-white/5 pb-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm font-mono ${
                        isAdmin ? 'bg-[#0f70b7]/15 text-[#0f70b7]' : 'bg-emerald-500/15 text-emerald-500'
                      }`}>
                        {selectedMsg.senderName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest">{selectedMsg.senderName}</h4>
                        <span className="text-[8px] text-slate-500 font-bold block mt-0.5">Expéditeur de ce message</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[7.5px] text-slate-500 font-bold block font-mono">
                        {new Date(selectedMsg.createdAt).toLocaleDateString()} • {new Date(selectedMsg.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-[11px] leading-relaxed font-semibold whitespace-pre-wrap text-slate-350">
                      {selectedMsg.content}
                    </p>
                  </div>

                  <div className="border-t border-white/5 mt-6 pt-4 flex justify-end">
                    <button
                      onClick={() => {
                        setActiveFolder('live');
                        setSelectedMessageId(null);
                      }}
                      className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                        isDark ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-[#0f70b7] text-white hover:bg-[#0c5991]'
                      }`}
                    >
                      Ouvrir dans la discussion pour répondre
                    </button>
                  </div>
                </div>
              );
            })()
          )}
        </div>

        <div className={`p-4 border-t shrink-0 ${
          isDark ? 'border-white/5 bg-[#0B1526]/50' : 'border-slate-100 bg-white'
        }`}>
          {activeFolder === 'live' ? (
            <form onSubmit={handleSend} className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Écrivez un message ici... (Entrée ou Envoyer)"
                className={`flex-1 px-4 py-3 rounded-xl text-xs font-semibold outline-none transition-all ${
                  isDark 
                    ? 'border border-white/10 bg-[#08172B] text-white focus:border-emerald-500/40' 
                    : 'border border-slate-200 bg-slate-50 text-slate-800 focus:border-[#0f70b7]/45 focus:bg-white'
                }`}
              />
              <button
                type="submit"
                disabled={sending}
                className={`px-5 rounded-xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
                  isDark
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-500/10'
                    : 'bg-[#0f70b7] hover:bg-[#0c5991] text-white shadow-md shadow-[#0f70b7]/10'
                }`}
              >
                <FiSend size={14} />
                <span className="hidden sm:inline">{sending ? 'Envoi...' : 'Envoyer'}</span>
              </button>
            </form>
          ) : (
            <div className="text-center py-2">
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                Utilisez le canal "Discussion Directe" pour envoyer des messages.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
