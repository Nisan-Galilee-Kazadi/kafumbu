import { useState } from 'react';
import { useLang } from '../context/LangContext';
import { FiGlobe, FiShield, FiTool, FiUsers, FiArrowRight, FiSend, FiX, FiUser, FiMail, FiBriefcase, FiMessageSquare } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const PARTNERS_CAT = [
  { name: 'Institutions financières internationales', type: 'Finance & Bailleurs' },
  { name: 'Agences publiques et gouvernements', type: 'Institutionnel & Régulation' },
  { name: 'ONG et acteurs du développement', type: 'Impact social & ODD' },
  { name: 'Partenaires techniques et industriels', type: 'Ingénierie & BTP' },
];

export default function Partenaires() {
  const { theme } = useLang();
  const isDark = theme === 'dark';
  const [showForm, setShowForm] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    type: 'partnership',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleNextStep = (e) => {
    e.preventDefault();
    // Valider les champs de l'étape 1
    if (!formData.name || !formData.email || !formData.company) {
      setSubmitMessage('⚠️ Veuillez remplir tous les champs obligatoires');
      setTimeout(() => setSubmitMessage(''), 3000);
      return;
    }
    setFormStep(2);
    setSubmitMessage('');
  };

  const handlePrevStep = () => {
    setFormStep(1);
    setSubmitMessage('');
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setFormStep(1);
    setSubmitMessage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    // Simuler l'envoi du formulaire
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitMessage('✅ Votre demande de partenariat a été envoyée avec succès ! Nous vous contacterons dans les 48 heures.');
      setFormData({
        name: '',
        email: '',
        company: '',
        type: 'partnership',
        message: ''
      });
      
      // Fermer le formulaire après 3 secondes
      setTimeout(() => {
        handleCloseForm();
      }, 3000);
    }, 2000);
  };

  return (
    <div className={`min-h-screen pt-32 pb-20 transition-colors duration-500 ${isDark ? 'bg-[#071426]' : 'bg-slate-50'}`}>
      
      {/* Header Section */}
      <section className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <h1 className={`text-4xl md:text-6xl font-black mb-6 tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Réseau de <span className="text-emerald-500">Partenaires</span>
        </h1>
        <p className={`text-lg max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Le projet mobilise une coalition d'acteurs publics et privés pour garantir un impact économique, énergétique et social durable.
        </p>
      </section>

      {/* Strategic Pillars */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {[
            { icon: FiUsers, title: 'Investisseurs', text: 'Participation au financement long terme et levée de fonds.' },
            { icon: FiShield, title: 'Gouvernance', text: 'Cadre de régulation et crédibilité auprès des institutions.' },
            { icon: FiTool, title: 'Expertise', text: 'Ingénierie de pointe et contrôle qualité des infrastructures.' },
            { icon: FiGlobe, title: 'Impact', text: 'Alignement sur les objectifs de développement durable.' },
          ].map((pillar, i) => (
            <div key={i} className={`p-8 rounded-xl md:rounded-2xl border transition-all duration-500 ${
              isDark ? 'bg-white/5 border-white/10 hover:border-emerald-500/50' : 'bg-white border-slate-200 shadow-sm hover:shadow-xl'
            }`}>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-6">
                <pillar.icon size={24} />
              </div>
              <h3 className={`text-lg font-black mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>{pillar.title}</h3>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{pillar.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Target Categories */}
      <section className={`py-24 ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-xl">
              <h2 className={`text-3xl font-black mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Catégories de Partenaires Cibles</h2>
              <div className="w-20 h-1.5 bg-emerald-500 rounded-full" />
            </div>
            <button 
              onClick={() => setShowForm(!showForm)}
              className="text-emerald-500 font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all"
            >
              {showForm ? 'Masquer le formulaire' : 'Demande de partenariat'} <FiArrowRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PARTNERS_CAT.map((cat, i) => (
              <div key={i} className={`flex items-center justify-between p-6 rounded-xl md:rounded-lg border transition-all ${
                isDark ? 'bg-[#071426] border-white/10 hover:bg-white/5' : 'bg-white border-slate-200 hover:shadow-lg'
              }`}>
                <div>
                  <div className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{cat.name}</div>
                  <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{cat.type}</div>
                </div>
                <div className={`w-8 h-8 rounded-full border flex items-center justify-center ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
                  <FiArrowRight size={14} className="text-slate-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <h2 className={`text-2xl font-black mb-8 ${isDark ? 'text-white' : 'text-slate-400 opacity-60'}`}>Collaborons pour bâtir Kafumbu</h2>
        <div className="flex flex-wrap justify-center gap-12 opacity-30 grayscale filter invert-[0.5]">
          {/* Placeholders for partner logos */}
          <div className="font-black text-2xl tracking-tighter">FINANCE.CO</div>
          <div className="font-black text-2xl tracking-tighter">GOV.INT</div>
          <div className="font-black text-2xl tracking-tighter">TECH.HUB</div>
          <div className="font-black text-2xl tracking-tighter">GLOBAL.NGO</div>
        </div>
      </section>

      {/* Partnership Request Form Modal */}
      {showForm && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={handleCloseForm}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <div className={`max-w-2xl w-full max-h-[85vh] overflow-y-auto rounded-2xl border p-8 shadow-2xl transform transition-all duration-300 scale-100 ${
              isDark ? 'bg-white border-slate-800' : 'bg-white border-slate-200'
            }`}>
              {/* Form Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-2xl font-black ${isDark ? 'text-slate-900' : 'text-slate-900'}`}>
                  Demande de Partenariat
                </h3>
                <button
                  onClick={handleCloseForm}
                  className={`p-2 rounded-lg transition-colors ${isDark ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Success Message */}
              {submitMessage && (
                <div className={`p-4 rounded-xl mb-6 ${submitMessage.includes('succès') ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                  <p className="font-medium">{submitMessage}</p>
                </div>
              )}

              {/* Progress Steps */}
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center gap-4">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-colors ${
                    formStep >= 1 ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'
                  }`}>
                    1
                  </div>
                  <div className={`w-16 h-0.5 transition-colors ${
                    formStep >= 2 ? 'bg-emerald-500' : 'bg-slate-200'
                  }`} />
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-colors ${
                    formStep >= 2 ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'
                  }`}>
                    2
                  </div>
                </div>
              </div>

              {/* Step Labels */}
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center gap-12">
                  <div className={`text-xs font-bold transition-colors ${
                    formStep >= 1 ? 'text-emerald-500' : 'text-slate-400'
                  }`}>
                    Informations
                  </div>
                  <div className={`text-xs font-bold transition-colors ${
                    formStep >= 2 ? 'text-emerald-500' : 'text-slate-400'
                  }`}>
                    Proposition
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={formStep === 1 ? handleNextStep : handleSubmit} className="space-y-6">
                {/* Step 1: Basic Information */}
                {formStep === 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-slate-900' : 'text-slate-900'}`}>
                        <FiUser className="inline mr-2" size={16} />
                        Nom complet
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                          isDark 
                            ? 'bg-white/10 border-slate-600 text-slate-900 placeholder-slate-400 focus:bg-white/20 focus:border-emerald-500' 
                            : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-emerald-500'
                        }`}
                        placeholder="Votre nom complet"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-slate-900' : 'text-slate-900'}`}>
                        <FiMail className="inline mr-2" size={16} />
                        Adresse e-mail
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                          isDark 
                            ? 'bg-white/10 border-slate-600 text-slate-900 placeholder-slate-400 focus:bg-white/20 focus:border-emerald-500' 
                            : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-emerald-500'
                        }`}
                        placeholder="votre.email@entreprise.com"
                      />
                    </div>

                    {/* Company */}
                    <div>
                      <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-slate-900' : 'text-slate-900'}`}>
                        <FiBriefcase className="inline mr-2" size={16} />
                        Entreprise / Organisation
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                        className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                          isDark 
                            ? 'bg-white/10 border-slate-600 text-slate-900 placeholder-slate-400 focus:bg-white/20 focus:border-emerald-500' 
                            : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-emerald-500'
                        }`}
                        placeholder="Nom de votre entreprise ou organisation"
                      />
                    </div>

                    {/* Type */}
                    <div>
                      <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-slate-900' : 'text-slate-900'}`}>
                        Type de partenariat
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                        className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                          isDark 
                            ? 'bg-white/10 border-slate-600 text-slate-900 focus:bg-white/20 focus:border-emerald-500' 
                            : 'bg-white border-slate-200 text-slate-900 focus:border-emerald-500'
                        }`}
                      >
                        <option value="partnership">Partenariat stratégique</option>
                        <option value="investment">Investissement</option>
                        <option value="technical">Partenariat technique</option>
                        <option value="sponsorship">Sponsoring</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Step 2: Partnership Details */}
                {formStep === 2 && (
                  <div className="space-y-6">
                    {/* Message */}
                    <div>
                      <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-slate-900' : 'text-slate-900'}`}>
                        <FiMessageSquare className="inline mr-2" size={16} />
                        Votre message
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${
                          isDark 
                            ? 'bg-white/10 border-slate-600 text-slate-900 placeholder-slate-400 focus:bg-white/20 focus:border-emerald-500' 
                            : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-emerald-500'
                        }`}
                        placeholder="Décrivez votre proposition d'auteur..."
                      />
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-4">
                  {formStep === 2 && (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className={`flex-1 py-4 rounded-xl font-bold transition-colors ${
                        isDark 
                          ? 'bg-white/10 text-slate-900 hover:bg-white/20' 
                          : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                      }`}
                    >
                      Retour
                    </button>
                  )}
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-linear-to-r from-emerald-500 to-emerald-600 text-white font-bold py-4 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-transparent animate-spin rounded-full" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        {formStep === 1 ? 'Suivant' : 'Envoyer la demande'}
                        <FiSend size={20} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
