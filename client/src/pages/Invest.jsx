import { useState } from 'react';
import { useLang } from '../context/LangContext';
import CustomAlertModal from '../components/CustomAlertModal';
import { 
  FiArrowRight, FiCheck, FiUser, FiMail, FiPhone, FiCreditCard, 
  FiBriefcase, FiShield, FiTrendingUp, FiZap, FiGlobe, FiSmartphone 
} from 'react-icons/fi';
import { RiVipDiamondLine, RiMedalLine, RiSeedlingLine, RiBankLine } from 'react-icons/ri';

const TIERS = [
  {
    id: 'citizen',
    icon: RiSeedlingLine,
    name: 'Don Citoyen',
    amount: 10,
    color: 'emerald',
    perks: ['Certificat numérique', 'Rapport trimestriel', 'Newsletter'],
  },
  {
    id: 'bronze',
    icon: RiMedalLine,
    name: 'Investisseur Bronze',
    amount: 5000,
    color: 'amber',
    perks: ['Appel trimestriel CEO', 'Dashboard temps réel', 'Droit de visite'],
    featured: true,
  },
  {
    id: 'silver',
    icon: RiVipDiamondLine,
    name: 'Investisseur Silver',
    amount: 25000,
    color: 'amber',
    perks: ['Siège comité consultatif', 'Naming infrastructure', 'ROI prioritaire'],
  },
  {
    id: 'gold',
    icon: RiVipDiamondLine,
    name: 'Investisseur Gold',
    amount: 100000,
    color: 'amber',
    perks: ['Visibilité institutionnelle', 'Accompagnement dédié', 'Suivi stratégique'],
    featured: true,
  }
];

const PAYMENT_METHODS = [
  { id: 'card', name: 'Carte Bancaire', icon: FiCreditCard },
  { id: 'bank', name: 'Virement Bancaire', icon: RiBankLine },
  { id: 'mobile', name: 'Mobile Money', icon: FiSmartphone },
];

export default function Invest() {
  const { theme } = useLang();
  const isDark = theme === 'dark';
  const [step, setStep] = useState(1);
  const [selectedTier, setSelectedTier] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    type: 'individual'
  });
  const [paymentMethod, setPaymentMethod] = useState('');
  
  // Alert Modal State
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ title: '', message: '', type: 'info' });

  const triggerAlert = (title, message, type = 'info') => {
    setAlertConfig({ title, message, type });
    setAlertOpen(true);
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    triggerAlert('Félicitations !', 'Votre demande d\'investissement a été transmise avec succès. Notre équipe d\'accompagnement vous contactera sous 24h pour finaliser votre dossier.', 'success');
    setStep(1);
  };

  return (
    <div className={`min-h-screen pt-32 pb-20 transition-colors duration-500 ${isDark ? 'bg-[#071426]' : 'bg-slate-50'}`}>
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className={`text-4xl md:text-6xl font-black mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Investissez dans le <span className="text-transparent bg-clip-text bg-linear-to-r from-[#D4AF37] via-[#F9E076] to-[#996515]">Futur de Kafumbu</span>
          </h1>
          <p className={`text-lg leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Participez à la construction d'une infrastructure majeure. Choisissez votre niveau d'engagement et rejoignez une aventure historique.
          </p>
        </div>
      </section>

      {/* Main Form Container */}
      <section className="max-w-6xl mx-auto px-4 lg:px-6">
        <div className={`rounded-xl md:rounded-2xl border transition-all duration-500 overflow-hidden ${
          isDark ? 'bg-white/5 border-white/10 shadow-2xl shadow-black/50' : 'bg-white border-slate-200 shadow-xl shadow-slate-200/50'
        }`}>
          
          {/* Progress Header */}
          <div className={`px-8 py-6 flex items-center justify-between border-b ${isDark ? 'border-white/5 bg-white/5' : 'border-slate-100 bg-slate-50/50'}`}>
            <div className="flex items-center gap-8">
              {[1, 2, 3].map((num) => (
                <div key={num} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    step >= num 
                      ? 'bg-[#D4AF37] text-white shadow-lg shadow-[#D4AF37]/20' 
                      : isDark ? 'bg-white/10 text-slate-500' : 'bg-slate-200 text-slate-500'
                  }`}>
                    {num}
                  </div>
                  <span className={`hidden sm:block text-[11px] font-black uppercase tracking-widest ${
                    step >= num ? 'text-[#D4AF37]' : 'text-slate-500'
                  }`}>
                    {num === 1 ? 'Niveau' : num === 2 ? 'Informations' : 'Paiement'}
                  </span>
                </div>
              ))}
            </div>
            {selectedTier && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sélection :</span>
                <span className="text-amber-500 font-black text-xs uppercase tracking-widest">{selectedTier.name}</span>
              </div>
            )}
          </div>

          <div className="p-8 md:p-12">
            
            {/* STEP 1: SELECT TIER */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className={`text-2xl font-black mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>Sélectionnez votre palier</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                  {TIERS.map((tier) => (
                    <button
                      key={tier.id}
                      onClick={() => setSelectedTier(tier)}
                      className={`relative flex flex-col p-6 rounded-xl border-2 text-left transition-all min-h-[380px] group ${
                        selectedTier?.id === tier.id
                          ? 'border-[#D4AF37] bg-[#D4AF37]/5 ring-4 ring-[#D4AF37]/10'
                          : isDark ? 'border-white/10 hover:border-white/30 bg-white/5' : 'border-slate-100 hover:border-slate-300 bg-slate-50/50'
                      }`}
                    >
                      {tier.featured && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#D4AF37] text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-lg">
                          Prioritaire
                        </span>
                      )}
                      <tier.icon size={32} className={`mb-4 transition-transform group-hover:scale-110 ${
                        selectedTier?.id === tier.id ? 'text-[#D4AF37]' : 'text-slate-500'
                      }`} />
                      <h3 className={`font-black text-sm uppercase tracking-wider mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {tier.name}
                      </h3>
                      <p className="text-[#D4AF37] font-black text-lg mb-4">${tier.amount.toLocaleString()} <span className="text-[10px] opacity-70">min</span></p>
                      <ul className="space-y-2 mt-auto">
                        {tier.perks.map((perk, i) => (
                          <li key={i} className="flex items-center gap-2 text-[10px] text-slate-500 font-bold">
                            <FiCheck className="text-[#D4AF37] shrink-0" />
                            {perk}
                          </li>
                        ))}
                      </ul>
                    </button>
                  ))}
                </div>
                <div className="mt-12 flex justify-end">
                  <button
                    disabled={!selectedTier}
                    onClick={nextStep}
                    className="flex items-center gap-2 px-8 py-4 bg-amber-500 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-xl shadow-amber-500/20 hover:bg-amber-600 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:translate-y-0"
                  >
                    Continuer <FiArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: USER INFO */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl mx-auto">
                <h2 className={`text-2xl font-black mb-8 text-center ${isDark ? 'text-white' : 'text-slate-900'}`}>Vos informations</h2>
                <form className="space-y-6">
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, type: 'individual'})}
                      className={`flex-1 p-4 rounded-xl md:rounded-lg border-2 font-bold text-xs uppercase tracking-widest transition-all ${
                        formData.type === 'individual' ? 'border-amber-500 bg-amber-500/5 text-amber-500' : isDark ? 'border-white/10 text-slate-500' : 'border-slate-100 text-slate-500'
                      }`}
                    >
                      Particulier
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, type: 'business'})}
                      className={`flex-1 p-4 rounded-xl md:rounded-lg border-2 font-bold text-xs uppercase tracking-widest transition-all ${
                        formData.type === 'business' ? 'border-amber-500 bg-amber-500/5 text-amber-500' : isDark ? 'border-white/10 text-slate-500' : 'border-slate-100 text-slate-500'
                      }`}
                    >
                      Entreprise
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Prénom"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className={`w-full pl-12 pr-4 py-4 rounded-xl border outline-none transition-all ${
                          isDark ? 'bg-white/5 border-white/10 text-white focus:border-amber-500' : 'bg-slate-50 border-slate-200 focus:border-amber-500'
                        }`}
                      />
                    </div>
                    <div className="relative">
                      <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Nom"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className={`w-full pl-12 pr-4 py-4 rounded-xl border outline-none transition-all ${
                          isDark ? 'bg-white/5 border-white/10 text-white focus:border-amber-500' : 'bg-slate-50 border-slate-200 focus:border-amber-500'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="email" 
                      placeholder="Email Professionnel"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className={`w-full pl-12 pr-4 py-4 rounded-xl border outline-none transition-all ${
                        isDark ? 'bg-white/5 border-white/10 text-white focus:border-amber-500' : 'bg-slate-50 border-slate-200 focus:border-amber-500'
                      }`}
                    />
                  </div>

                  <div className="relative">
                    <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="tel" 
                      placeholder="Téléphone / WhatsApp"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className={`w-full pl-12 pr-4 py-4 rounded-xl border outline-none transition-all ${
                        isDark ? 'bg-white/5 border-white/10 text-white focus:border-amber-500' : 'bg-slate-50 border-slate-200 focus:border-amber-500'
                      }`}
                    />
                  </div>

                  {formData.type === 'business' && (
                    <div className="relative">
                      <FiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Nom de l'Organisation"
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                        className={`w-full pl-12 pr-4 py-4 rounded-xl border outline-none transition-all ${
                          isDark ? 'bg-white/5 border-white/10 text-white focus:border-amber-500' : 'bg-slate-50 border-slate-200 focus:border-amber-500'
                        }`}
                      />
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-12 pt-8 border-t border-white/5">
                    <button onClick={prevStep} className="text-slate-500 font-bold text-xs uppercase tracking-widest hover:text-amber-500 transition-colors">
                      Retour
                    </button>
                    <button
                      disabled={!formData.email || !formData.lastName}
                      onClick={nextStep}
                      className="flex items-center gap-2 px-8 py-4 bg-amber-500 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-xl shadow-amber-500/20 hover:bg-amber-600 transition-all disabled:opacity-50"
                    >
                      Suivant <FiArrowRight size={16} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* STEP 3: PAYMENT */}
            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl mx-auto">
                <h2 className={`text-2xl font-black mb-8 text-center ${isDark ? 'text-white' : 'text-slate-900'}`}>Mode de Paiement</h2>
                <div className="space-y-4">
                  {PAYMENT_METHODS.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`w-full flex items-center justify-between p-6 rounded-2xl border-2 transition-all group ${
                        paymentMethod === method.id 
                          ? 'border-amber-500 bg-amber-500/5 ring-4 ring-amber-500/10' 
                          : isDark ? 'border-white/10 bg-white/5 hover:border-white/30' : 'border-slate-100 bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl transition-colors ${
                          paymentMethod === method.id ? 'bg-amber-500 text-white' : isDark ? 'bg-white/10 text-slate-500' : 'bg-white text-slate-500'
                        }`}>
                          <method.icon size={24} />
                        </div>
                        <div className="text-left">
                          <h4 className={`font-black text-sm uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {method.name}
                          </h4>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Sécurisé & instantané</p>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        paymentMethod === method.id ? 'border-amber-500 bg-amber-500' : 'border-slate-400'
                      }`}>
                        {paymentMethod === method.id && <FiCheck className="text-white" size={14} />}
                      </div>
                    </button>
                  ))}
                </div>

                <div className={`mt-10 p-6 rounded-2xl border border-dashed flex items-start gap-4 ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                  <FiShield className="text-emerald-500 shrink-0 mt-1" size={20} />
                  <p className="text-xs text-slate-500 leading-relaxed font-medium italic">
                    Toutes les transactions sont sécurisées et font l'objet d'un audit de transparence financière trimestriel conformément aux lois en vigueur.
                  </p>
                </div>

                <div className="flex justify-between items-center mt-12 pt-8 border-t border-white/5">
                  <button onClick={prevStep} className="text-slate-500 font-bold text-xs uppercase tracking-widest hover:text-amber-500 transition-colors">
                    Retour
                  </button>
                  <button
                    disabled={!paymentMethod}
                    onClick={handleSubmit}
                    className="flex items-center gap-2 px-10 py-5 bg-linear-to-r from-[#996515] via-[#D4AF37] to-[#996515] text-white font-black text-sm uppercase tracking-[0.2em] rounded-xl shadow-2xl shadow-[#D4AF37]/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                  >
                    Confirmer l'engagement
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="max-w-4xl mx-auto px-6 mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
        <div className="flex flex-col items-center gap-2">
          <FiShield size={24} className={isDark ? 'text-white' : 'text-slate-900'} />
          <span className="text-[8px] font-black uppercase tracking-widest text-center">Sécurité Bancaire</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <FiTrendingUp size={24} className={isDark ? 'text-white' : 'text-slate-900'} />
          <span className="text-[8px] font-black uppercase tracking-widest text-center">ROI Garanti</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <FiGlobe size={24} className={isDark ? 'text-white' : 'text-slate-900'} />
          <span className="text-[8px] font-black uppercase tracking-widest text-center">Impact Global</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <FiZap size={24} className={isDark ? 'text-white' : 'text-slate-900'} />
          <span className="text-[8px] font-black uppercase tracking-widest text-center">Énergie Durable</span>
        </div>
      </section>

      {/* Custom Alert Modal */}
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
