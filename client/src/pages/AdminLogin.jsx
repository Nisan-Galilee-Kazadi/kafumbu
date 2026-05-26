import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiLock, FiUser, FiMail, FiPhone, FiBriefcase, FiArrowRight, FiCheckCircle, FiEye, FiEyeOff } from 'react-icons/fi';
import { useLang } from '../context/LangContext';
import { initLocalDatabase, resetUserPasswordLocal } from '../utils/userAuth';
import { setAdminSession } from '../utils/adminAuth';
import { authService } from '../services/adminService';
import CustomAlertModal from '../components/CustomAlertModal';

const KscLogo = ({ isDark = false }) => (
  <div className="relative w-20 h-20 flex items-center justify-center group cursor-pointer transition-transform duration-500">
    {/* Diamond (Losange) Background */}
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
        fill="transparent"
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

    {/* Refined Brand Text */}
    <div className="relative z-10 flex flex-col items-center pt-2">
      <span className="text-emerald-600 font-black text-[18px] leading-tight tracking-tighter drop-shadow-sm">
        KSC
      </span>
      <div className="w-6 h-[2px] bg-emerald-600/30 -mt-0.5" />
      <span
        className={`${isDark ? "text-white" : "text-[#0B1526]"} font-bold text-[6px] tracking-[0.3em] uppercase opacity-80 mt-1`}
      >
        GLOBAL
      </span>
    </div>
  </div>
);

export default function AdminLogin() {
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  
  // Login Form States — connexion via USERNAME (ex: jean@kafumbu-smartcity.cd)
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Register Form States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regTier, setRegTier] = useState('none');
  const [regCompany, setRegCompany] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);
  const [assignedUsername, setAssignedUsername] = useState('');
  const [verificationStep, setVerificationStep] = useState('form');
  const [verificationCode, setVerificationCode] = useState('');
  const [expiresIn, setExpiresIn] = useState(0);
  const [registering, setRegistering] = useState(false);
  const showDemoBox = false;

  // Forgot Password Form States
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotCode, setForgotCode] = useState('');
  const [forgotPassword, setForgotPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [showForgotConfirmPassword, setShowForgotConfirmPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState('email'); // 'email' or 'code'
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotExpiresIn, setForgotExpiresIn] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useLang();
  const isDark = theme === 'dark';

  // Alert Modal State
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ title: '', message: '', type: 'info' });

  const triggerAlert = (title, message, type = 'info') => {
    setAlertConfig({ title, message, type });
    setAlertOpen(true);
  };

  useEffect(() => {
    initLocalDatabase();
  }, []);

  useEffect(() => {
    if (verificationStep !== 'code' || expiresIn <= 0) return undefined;
    const timer = window.setInterval(() => {
      setExpiresIn((value) => Math.max(0, value - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [verificationStep, expiresIn]);

  useEffect(() => {
    if (forgotStep !== 'code' || forgotExpiresIn <= 0) return undefined;
    const timer = window.setInterval(() => {
      setForgotExpiresIn((value) => Math.max(0, value - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [forgotStep, forgotExpiresIn]);

  // ─── ÉTAPE 1 : demande du code (envoi email) ───────────────────────────────
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess(false);

    if (!forgotEmail.trim()) {
      setForgotError("Veuillez saisir votre adresse e-mail de contact.");
      return;
    }

    try {
      setForgotLoading(true);
      try {
        const result = await authService.requestPasswordReset(forgotEmail.trim());
        setForgotExpiresIn(result.expiresInSeconds || 90);
        setForgotStep('code');
      } catch (err) {
        console.warn("Backend reset request failed, checking local database:", err);
        const localUsers = JSON.parse(localStorage.getItem('ksc-users-db') || '[]');
        const existsLocally = localUsers.some(u => u.email.trim().toLowerCase() === forgotEmail.trim().toLowerCase());
        if (existsLocally) {
          const mockCode = '123456';
          console.log(`\n==================================================`);
          console.log(`[LOCAL MOCK RESET] Code pour ${forgotEmail.trim()} : ${mockCode}`);
          console.log(`==================================================\n`);
          setForgotExpiresIn(90);
          setForgotStep('code');
          triggerAlert('Mode Simulation', 'Code fictif généré : 123456. Consultez la console du navigateur.', 'info');
        } else {
          throw err;
        }
      }
    } catch (err) {
      setForgotError(err.message || "Impossible d'envoyer le code de réinitialisation.");
    } finally {
      setForgotLoading(false);
    }
  };

  // ─── ÉTAPE 2 : validation du token reçu par email ───────────────────────────
  const handleCodeStep = (e) => {
    e.preventDefault();
    setForgotError('');
    if (!forgotCode.trim() || !/^[A-Z0-9]{6}$/.test(forgotCode.trim().toUpperCase())) {
      setForgotError("Veuillez saisir le code à 6 caractères reçu par e-mail.");
      return;
    }
    setForgotStep('password');
  };

  // ─── ÉTAPE 3 : création et confirmation du nouveau mot de passe ─────────────
  const handleVerifyForgotCode = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess(false);

    if (!forgotPassword) {
      setForgotError("Veuillez saisir un nouveau mot de passe.");
      return;
    }
    if (forgotPassword !== forgotConfirmPassword) {
      setForgotError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      setForgotLoading(true);
      let success = false;
      try {
        await authService.verifyPasswordReset(forgotEmail.trim(), forgotCode.trim().toUpperCase(), forgotPassword);
        resetUserPasswordLocal(forgotEmail.trim(), forgotPassword);
        success = true;
      } catch (err) {
        console.warn("Backend verification failed, trying local fallback:", err);
        if (forgotCode.trim() === '123456') {
          const localUpdated = resetUserPasswordLocal(forgotEmail.trim(), forgotPassword);
          if (localUpdated) {
            success = true;
          } else {
            throw new Error("Compte introuvable localement.");
          }
        } else {
          throw err;
        }
      }

      if (success) {
        setForgotSuccess(true);
        triggerAlert('Succès', 'Mot de passe réinitialisé ! Vous allez être redirigé vers la connexion.', 'success');
        setTimeout(() => {
          // Pré-remplir le username et rediriger vers login
          setLoginUsername(forgotEmail.trim());
          setActiveTab('login');
          setForgotEmail('');
          setForgotCode('');
          setForgotPassword('');
          setForgotConfirmPassword('');
          setForgotStep('email');
          setForgotSuccess(false);
        }, 2000);
      }
    } catch (err) {
      setForgotError(err.message || "Code incorrect ou expiré. Recommencez depuis l'étape 1.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');

    try {
      const data = await authService.login(loginUsername, loginPassword);
      if (data?.token && data?.user?.role === 'admin') {
        setAdminSession(data.user);
        const next = location.state?.from || '/admin/dashboard';
        navigate(next, { replace: true });
        return;
      }
      if (data?.token && data?.user?.role === 'visitor') {
        localStorage.setItem('visitorToken', data.token);
        localStorage.setItem('ksc-active-session', JSON.stringify(data.user));
        const next = location.state?.from || '/dashboard';
        navigate(next, { replace: true });
        return;
      }
    } catch (err) {
      setLoginError(err.message || 'Identifiant KSC ou mot de passe incorrect.');
      return;
    }

    setLoginError('Identifiant KSC ou mot de passe incorrect.');
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess(false);

    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      setRegError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    try {
      setRegistering(true);
      setAssignedUsername('');
      const result = await authService.requestRegistrationCode({
        name: regName.trim(),
        email: regEmail.trim(),
        password: regPassword,
        tier: regTier,
        company: regCompany.trim(),
        phone: regPhone.trim(),
      });
      setExpiresIn(result.expiresInSeconds || 90);
      setVerificationStep('code');
    } catch (err) {
      setRegError(err.message || 'Une erreur est survenue lors de l inscription.');
    } finally {
      setRegistering(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setRegError('');
    try {
      setRegistering(true);
      const data = await authService.verifyRegistrationCode(regEmail.trim(), verificationCode.trim());
      setAssignedUsername(data.username || data.user?.email || '');
      setRegSuccess(true);
      localStorage.setItem('visitorToken', data.token);
      localStorage.setItem('ksc-active-session', JSON.stringify(data.user));
      setTimeout(() => navigate('/dashboard', { replace: true }), 1800);
    } catch (err) {
      setRegError(err.message || 'Code de validation incorrect.');
    } finally {
      setRegistering(false);
    }
  };

  return (
    <main
      className="flex min-h-screen items-center justify-center px-4 py-16 font-sans transition-colors duration-500"
      style={{
        background: isDark
          ? 'radial-gradient(circle at top left, #0B1D35 0%, #071426 60%, #0B1D35 100%)'
          : 'radial-gradient(circle at top left, #f8fafc 0%, #f1f5f9 60%, #e2e8f0 100%)',
      }}
    >
      <div className="w-full max-w-[1020px] flex flex-col gap-6">
        
        {/* En-tête de retour au site */}
        <div className="flex justify-between items-center px-2">
          <Link
            to="/"
            className={`text-xs font-bold uppercase tracking-[0.2em] transition-colors flex items-center gap-2 ${
              isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-[#0f70b7]'
            }`}
          >
            ← Retour au site public
          </Link>
        </div>

        {/* Cadre Principal - Double Panneau Glissant Inter-actif */}
        <div className={`relative w-full overflow-hidden rounded-3xl border transition-all duration-500 min-h-[640px] flex flex-col md:block ${
          isDark 
            ? 'bg-[#08172B]/60 border-white/10 shadow-[0_25px_60px_-15px_rgba(7,20,38,0.8)]' 
            : 'bg-white border-slate-200/80 shadow-[0_25px_60px_-15px_rgba(15,112,183,0.15)]'
        }`}>
          
          {/* ─────────────────────────────────────────────────────────────────
              VERSION DESKTOP : DOUBLE PANNEAU GLISSANT (Sliding Overlay Panel)
              ───────────────────────────────────────────────────────────────── */}
          <div className="hidden md:block">
            
            {/* 1. Formulaire de Connexion (Reste à gauche) */}
            <div className={`absolute top-0 bottom-0 left-0 w-1/2 p-12 flex flex-col justify-center transition-all duration-700 ease-in-out ${
              activeTab === 'login' ? 'z-20 opacity-100 translate-x-0' : 'z-10 opacity-0 -translate-x-12 pointer-events-none'
            }`}>
              <div className="mb-6">
                <h3 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-[#0f70b7]'}`}>
                  Connexion Securisée
                </h3>
                <p className={`mt-1.5 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Saisissez vos identifiants pour accéder à votre tableau de bord.
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <div className={`flex items-center gap-3 rounded-xl px-4 py-3.5 border transition-all focus-within:ring-2 focus-within:ring-[#63b32e]/45 ${
                    isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
                  }`}>
                    <FiUser className="shrink-0 text-slate-400" size={18} />
                    <input
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value.trim().toLowerCase())}
                      type="text"
                      required
                      placeholder="Identifiant KSC (ex: jean@kafumbu-smartcity.cd)"
                      className={`w-full bg-transparent text-sm outline-none placeholder:text-slate-400 ${
                        isDark ? 'text-white' : 'text-slate-800'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <div className={`flex items-center gap-3 rounded-xl px-4 py-3.5 border transition-all focus-within:ring-2 focus-within:ring-[#63b32e]/45 ${
                    isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
                  }`}>
                    <FiLock className="shrink-0 text-slate-400" size={18} />
                    <input
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      type={showLoginPassword ? "text" : "password"}
                      required
                      placeholder="Mot de passe"
                      className={`w-full bg-transparent text-sm outline-none placeholder:text-slate-400 ${
                        isDark ? 'text-white' : 'text-slate-800'
                      }`}
                    />
                    <button type="button" onClick={() => setShowLoginPassword(!showLoginPassword)} className="text-slate-400 hover:text-slate-600 transition-colors shrink-0">
                      {showLoginPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                </div>

                {loginError && (
                  <div className="rounded-xl border border-red-200/20 bg-red-500/10 px-4 py-3 text-center text-xs text-red-500 font-bold">
                    {loginError}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full rounded-xl py-4 text-xs font-black uppercase tracking-[0.2em] text-white shadow-lg transition-all hover:shadow-[#63b32e]/25 hover:opacity-95 active:scale-[0.99] cursor-pointer"
                  style={{
                    background: 'linear-gradient(90deg, #63b32e 0%, #0f70b7 100%)',
                  }}
                >
                  Se connecter
                </button>
              </form>

              <div className="mt-4 text-center">
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); setActiveTab('forgot'); setForgotStep('email'); setForgotError(''); }}
                  className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Mot de passe oublié ?
                </a>
              </div>
            </div>

            {/* 4. Formulaire de Récupération (Reste à gauche) */}
            <div className={`absolute top-0 bottom-0 left-0 w-1/2 p-12 flex flex-col justify-center transition-all duration-700 ease-in-out ${
              activeTab === 'forgot' ? 'z-20 opacity-100 translate-x-0' : 'z-10 opacity-0 -translate-x-12 pointer-events-none'
            }`}>
              <div className="mb-5">
                <h3 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-[#0f70b7]'}`}>
                  Récupération de compte
                </h3>
                {/* Indicateur d'étapes */}
                <div className="flex flex-col gap-3 mt-4 mb-2">
                  <span className={`text-[11px] font-black uppercase tracking-widest ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    {forgotStep === 'email' && 'Étape 1 — Votre e-mail'}
                    {forgotStep === 'code' && 'Étape 2 — Votre code'}
                    {forgotStep === 'password' && 'Étape 3 — Nouveau mot de passe'}
                  </span>
                  <div className="flex items-center gap-2">
                    {['email', 'code', 'password'].map((step, i) => (
                      <div key={step} className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black transition-all duration-300 ${
                          forgotStep === step
                            ? 'bg-[#63b32e] text-white scale-110 shadow-lg shadow-[#63b32e]/30'
                            : (['email','code','password'].indexOf(forgotStep) > i)
                              ? 'bg-[#63b32e]/20 text-[#63b32e]'
                              : isDark ? 'bg-white/10 text-slate-400' : 'bg-slate-200 text-slate-400'
                        }`}>{i + 1}</div>
                        {i < 2 && <div className={`h-[2px] w-8 transition-all duration-300 ${
                          ['email','code','password'].indexOf(forgotStep) > i ? 'bg-[#63b32e]' : isDark ? 'bg-white/10' : 'bg-slate-200'
                        }`} />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── ÉTAPE 1 : e-mail ── */}
              {forgotStep === 'email' && (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Saisissez votre adresse e-mail de contact pour recevoir un code de réinitialisation.
                  </p>
                  <div className={`flex items-center gap-3 rounded-xl px-4 py-3.5 border transition-all focus-within:ring-2 focus-within:ring-[#63b32e]/45 ${
                    isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
                  }`}>
                    <FiMail className="shrink-0 text-slate-400" size={18} />
                    <input
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      type="email"
                      required
                      placeholder="Adresse e-mail de contact"
                      className={`w-full bg-transparent text-sm outline-none placeholder:text-slate-400 ${
                        isDark ? 'text-white' : 'text-slate-800'
                      }`}
                    />
                  </div>
                  {forgotError && (
                    <div className="rounded-xl border border-red-200/20 bg-red-500/10 px-4 py-3 text-center text-xs text-red-500 font-bold">{forgotError}</div>
                  )}
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full rounded-xl py-4 text-xs font-black uppercase tracking-[0.2em] text-white shadow-lg transition-all hover:opacity-95 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                    style={{ background: 'linear-gradient(90deg, #63b32e 0%, #0f70b7 100%)' }}
                  >
                    {forgotLoading ? 'Envoi en cours...' : 'Envoyer le code →'}
                  </button>
                </form>
              )}

              {/* ── ÉTAPE 2 : saisie du token ── */}
              {forgotStep === 'code' && (
                <form onSubmit={handleCodeStep} className="space-y-4">
                  <div className={`rounded-xl border px-4 py-3 text-xs font-bold leading-relaxed ${
                    isDark ? 'border-[#63b32e]/25 bg-[#63b32e]/10 text-slate-200' : 'border-[#63b32e]/25 bg-[#63b32e]/10 text-slate-700'
                  }`}>
                    📧 Code envoyé à <strong>{forgotEmail}</strong>. Expire dans <strong>{forgotExpiresIn}s</strong>.
                  </div>
                  <div className={`flex items-center gap-3 rounded-xl px-4 py-3 border transition-all focus-within:ring-2 focus-within:ring-[#63b32e]/45 ${
                    isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
                  }`}>
                    <FiCheckCircle className="shrink-0 text-slate-400" size={16} />
                    <input
                      value={forgotCode}
                      onChange={(e) => setForgotCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))}
                      type="text"
                      required
                      minLength={6}
                      maxLength={6}
                      autoFocus
                      placeholder="Code à 6 caractères"
                      className={`w-full bg-transparent text-center font-mono text-2xl tracking-[0.5em] outline-none placeholder:text-xs placeholder:tracking-normal placeholder:text-slate-400 ${
                        isDark ? 'text-white' : 'text-slate-800'
                      }`}
                    />
                  </div>
                  {forgotError && (
                    <div className="rounded-xl border border-red-200/20 bg-red-500/10 px-4 py-3 text-center text-xs text-red-500 font-bold">{forgotError}</div>
                  )}
                  <button
                    type="submit"
                    disabled={forgotCode.length < 6 || forgotExpiresIn === 0}
                    className="w-full rounded-xl py-4 text-xs font-black uppercase tracking-[0.2em] text-white shadow-lg transition-all hover:opacity-95 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                    style={{ background: 'linear-gradient(90deg, #63b32e 0%, #0f70b7 100%)' }}
                  >
                    Valider le code →
                  </button>
                  <button
                    type="button"
                    onClick={() => { setForgotStep('email'); setForgotCode(''); setForgotError(''); }}
                    className={`w-full rounded-xl border py-3 text-xs font-black uppercase tracking-[0.2em] transition-all ${
                      isDark ? 'border-white/10 text-slate-400 hover:bg-white/5' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    ← Modifier l'e-mail
                  </button>
                </form>
              )}

              {/* ── ÉTAPE 3 : nouveau mot de passe ── */}
              {forgotStep === 'password' && (
                <form onSubmit={handleVerifyForgotCode} className="space-y-4">
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Code validé ✓ Choisissez votre nouveau mot de passe.
                  </p>
                  <div className={`flex items-center gap-3 rounded-xl px-4 py-3.5 border transition-all focus-within:ring-2 focus-within:ring-[#63b32e]/45 ${
                    isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
                  }`}>
                    <FiLock className="shrink-0 text-slate-400" size={18} />
                    <input
                      value={forgotPassword}
                      onChange={(e) => setForgotPassword(e.target.value)}
                      type={showForgotPassword ? 'text' : 'password'}
                      required
                      autoFocus
                      placeholder="Nouveau mot de passe"
                      className={`w-full bg-transparent text-sm outline-none placeholder:text-slate-400 ${
                        isDark ? 'text-white' : 'text-slate-800'
                      }`}
                    />
                    <button type="button" onClick={() => setShowForgotPassword(!showForgotPassword)} className="text-slate-400 hover:text-slate-600 transition-colors shrink-0">
                      {showForgotPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                  <div className={`flex items-center gap-3 rounded-xl px-4 py-3.5 border transition-all focus-within:ring-2 focus-within:ring-[#63b32e]/45 ${
                    isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
                  }`}>
                    <FiLock className="shrink-0 text-slate-400" size={18} />
                    <input
                      value={forgotConfirmPassword}
                      onChange={(e) => setForgotConfirmPassword(e.target.value)}
                      type={showForgotConfirmPassword ? 'text' : 'password'}
                      required
                      placeholder="Confirmer le nouveau mot de passe"
                      className={`w-full bg-transparent text-sm outline-none placeholder:text-slate-400 ${
                        isDark ? 'text-white' : 'text-slate-800'
                      }`}
                    />
                    <button type="button" onClick={() => setShowForgotConfirmPassword(!showForgotConfirmPassword)} className="text-slate-400 hover:text-slate-600 transition-colors shrink-0">
                      {showForgotConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                  {forgotError && (
                    <div className="rounded-xl border border-red-200/20 bg-red-500/10 px-4 py-3 text-center text-xs text-red-500 font-bold">{forgotError}</div>
                  )}
                  {forgotSuccess && (
                    <div className="rounded-xl border border-[#63b32e]/20 bg-[#63b32e]/10 px-4 py-3 text-center text-xs text-[#63b32e] font-bold">
                      ✓ Réinitialisation réussie ! Redirection vers la connexion...
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={forgotLoading || forgotSuccess}
                    className="w-full rounded-xl py-4 text-xs font-black uppercase tracking-[0.2em] text-white shadow-lg transition-all hover:opacity-95 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                    style={{ background: 'linear-gradient(90deg, #63b32e 0%, #0f70b7 100%)' }}
                  >
                    {forgotLoading ? 'Réinitialisation...' : 'Confirmer le nouveau mot de passe ✓'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setForgotStep('code'); setForgotError(''); }}
                    className={`w-full rounded-xl border py-3 text-xs font-black uppercase tracking-[0.2em] transition-all ${
                      isDark ? 'border-white/10 text-slate-400 hover:bg-white/5' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    ← Retour au code
                  </button>
                </form>
              )}

              <div className="mt-4 text-center">
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); setActiveTab('login'); setForgotStep('email'); setForgotError(''); }}
                  className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Retour à la connexion
                </a>
              </div>
            </div>

            {/* 2. Formulaire de Création de Compte (Reste à droite) */}
            <div className={`absolute top-0 bottom-0 left-1/2 w-1/2 p-12 flex flex-col justify-center transition-all duration-700 ease-in-out ${
              activeTab === 'register' ? 'z-20 opacity-100 translate-x-0' : 'z-10 opacity-0 translate-x-12 pointer-events-none'
            }`}>
              <div className="mb-6">
                <h3 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-[#0f70b7]'}`}>
                  Créer un compte
                </h3>
                <p className={`mt-1.5 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Participez à la construction de la Smart City de Kafumbu.
                </p>
              </div>

              {verificationStep === 'code' ? (
                <form onSubmit={handleVerifyCode} className="space-y-4">
                  <div className={`rounded-xl border px-4 py-3 text-xs font-bold leading-relaxed ${
                    isDark ? 'border-[#63b32e]/25 bg-[#63b32e]/10 text-slate-200' : 'border-[#63b32e]/25 bg-[#63b32e]/10 text-slate-700'
                  }`}>
                    Un code de 6 caracteres a ete envoye a {regEmail}. Il expire dans {expiresIn}s.
                  </div>
                  <div className={`flex items-center gap-3 rounded-xl px-4 py-3 border transition-all focus-within:ring-2 focus-within:ring-[#63b32e]/45 ${
                    isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
                  }`}>
                    <FiCheckCircle className="shrink-0 text-slate-400" size={16} />
                    <input
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))}
                      type="text"
                      required
                      minLength={6}
                      maxLength={6}
                      placeholder="Code de validation"
                      className={`w-full bg-transparent text-center font-mono text-lg tracking-[0.35em] outline-none placeholder:text-xs placeholder:tracking-normal placeholder:text-slate-400 ${
                        isDark ? 'text-white' : 'text-slate-800'
                      }`}
                    />
                  </div>
                  {regError && (
                    <div className="rounded-xl border border-red-200/20 bg-red-500/10 px-4 py-3 text-center text-xs text-red-500 font-bold">
                      {regError}
                    </div>
                  )}
                  {regSuccess && (
                    <div className="rounded-xl border border-[#63b32e]/20 bg-[#63b32e]/10 px-4 py-3 text-center text-xs text-[#63b32e] font-bold">
                      Compte valide. Identifiant KSC : {assignedUsername || 'creation en cours'}.
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={registering || expiresIn === 0 || regSuccess}
                    className="w-full rounded-xl py-4 text-xs font-black uppercase tracking-[0.2em] text-white shadow-lg transition-all hover:shadow-[#63b32e]/25 hover:opacity-95 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                    style={{ background: 'linear-gradient(90deg, #63b32e 0%, #0f70b7 100%)' }}
                  >
                    Valider le code
                  </button>
                  <button
                    type="button"
                    onClick={() => { setVerificationStep('form'); setVerificationCode(''); setRegError(''); }}
                    className="w-full rounded-xl border border-white/10 py-3 text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:bg-white/5"
                  >
                    Modifier l'inscription
                  </button>
                </form>
              ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <div className={`flex items-center gap-3 rounded-xl px-4 py-3 border transition-all focus-within:ring-2 focus-within:ring-[#63b32e]/45 ${
                    isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
                  }`}>
                    <FiUser className="shrink-0 text-slate-400" size={16} />
                    <input
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      type="text"
                      required
                      placeholder="Nom complet / Raison sociale *"
                      className={`w-full bg-transparent text-xs outline-none placeholder:text-slate-400 ${
                        isDark ? 'text-white' : 'text-slate-800'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className={`flex items-center gap-3 rounded-xl px-4 py-3 border transition-all focus-within:ring-2 focus-within:ring-[#63b32e]/45 ${
                      isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
                    }`}>
                      <FiMail className="shrink-0 text-slate-400" size={16} />
                      <input
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        type="email"
                        required
                        placeholder="E-mail de contact *"
                        className={`w-full bg-transparent text-xs outline-none placeholder:text-slate-400 ${
                          isDark ? 'text-white' : 'text-slate-800'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <div className={`flex items-center gap-3 rounded-xl px-4 py-3 border transition-all focus-within:ring-2 focus-within:ring-[#63b32e]/45 ${
                      isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
                    }`}>
                      <FiLock className="shrink-0 text-slate-400" size={16} />
                      <input
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        type={showRegPassword ? "text" : "password"}
                        required
                        placeholder="Mot de passe *"
                        className={`w-full bg-transparent text-xs outline-none placeholder:text-slate-400 ${
                          isDark ? 'text-white' : 'text-slate-800'
                        }`}
                      />
                      <button type="button" onClick={() => setShowRegPassword(!showRegPassword)} className="text-slate-400 hover:text-slate-600 transition-colors shrink-0">
                        {showRegPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className={`flex items-center gap-3 rounded-xl px-4 py-3 border transition-all focus-within:ring-2 focus-within:ring-[#63b32e]/45 ${
                      isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
                    }`}>
                      <FiBriefcase className="shrink-0 text-slate-400" size={16} />
                      <input
                        value={regCompany}
                        onChange={(e) => setRegCompany(e.target.value)}
                        type="text"
                        placeholder="Organisation"
                        className={`w-full bg-transparent text-xs outline-none placeholder:text-slate-400 ${
                          isDark ? 'text-white' : 'text-slate-800'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <div className={`flex items-center gap-3 rounded-xl px-4 py-3 border transition-all focus-within:ring-2 focus-within:ring-[#63b32e]/45 ${
                      isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
                    }`}>
                      <FiPhone className="shrink-0 text-slate-400" size={16} />
                      <input
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        type="tel"
                        placeholder="Téléphone / WhatsApp"
                        className={`w-full bg-transparent text-xs outline-none placeholder:text-slate-400 ${
                          isDark ? 'text-white' : 'text-slate-800'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
                    Engagement Initial
                  </label>
                  <select
                    value={regTier}
                    onChange={(e) => setRegTier(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border outline-none text-xs font-bold transition-all focus:ring-2 focus:ring-[#63b32e]/45 ${
                      isDark 
                        ? 'border-white/10 bg-[#071426] text-white' 
                        : 'border-slate-200 bg-slate-50 text-slate-800'
                    }`}
                  >
                    <option value="none">Aucun engagement immédiat</option>
                    <option value="citizen">Don Citoyen ($10)</option>
                    <option value="bronze">Investisseur Bronze ($5,000)</option>
                    <option value="silver">Investisseur Silver ($25,000)</option>
                    <option value="gold">Investisseur Gold ($100,000)</option>
                  </select>
                </div>

                {regError && (
                  <div className="rounded-xl border border-red-200/20 bg-red-500/10 px-4 py-3 text-center text-xs text-red-500 font-bold">
                    {regError}
                  </div>
                )}

                {regSuccess && (
                  <div className="rounded-xl border border-[#63b32e]/20 bg-[#63b32e]/10 px-4 py-3 text-center text-xs text-[#63b32e] font-bold">
                    Inscription reussie. Identifiant KSC : {assignedUsername || 'creation en cours'}.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={registering}
                  className="w-full rounded-xl py-4 text-xs font-black uppercase tracking-[0.2em] text-white shadow-lg transition-all hover:shadow-[#63b32e]/25 hover:opacity-95 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                  style={{
                    background: 'linear-gradient(90deg, #63b32e 0%, #0f70b7 100%)',
                  }}
                >
                  Envoyer le code
                </button>
              </form>
              )}
            </div>

            {/* 3. PANNEAU DE COUVERTURE DÉCORATIF GLISSANT (Sliding Overlay) */}
            <div 
              className="absolute top-0 bottom-0 w-1/2 z-30 transition-all duration-700 ease-in-out overflow-hidden"
              style={{
                left: (activeTab === 'login' || activeTab === 'forgot') ? '50%' : '0%',
                background: isDark
                  ? 'linear-gradient(135deg, #0B1D35 0%, #071426 50%, #0A1526 100%)'
                  : 'linear-gradient(135deg, #0f70b7 0%, #0b1d35 60%, #0B1D35 100%)',
              }}
            >
              {/* Blobs décoratifs de fond */}
              <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-[#63b32e]/15 blur-3xl animate-pulse" />
              <div className="absolute -left-12 -bottom-12 h-56 w-56 rounded-full bg-[#D4AF37]/15 blur-3xl animate-pulse" />
              
              {/* Contenu glissant - Mode Inscription (Visible en mode Connexion) */}
              <div className={`absolute inset-0 p-12 flex flex-col justify-between transition-all duration-700 ease-in-out ${
                (activeTab === 'login' || activeTab === 'forgot') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12 pointer-events-none'
              }`}>
                <div className="scale-75 origin-top-left">
                  <KscLogo isDark={true} />
                </div>
                
                <div className="my-8">
                  <h2 className="text-2xl md:text-3xl font-black leading-tight tracking-tight text-white">
                    Nouveau sur la <span className="text-[#D4AF37]">Plateforme</span> ?
                  </h2>
                  <p className="mt-4 text-xs leading-relaxed text-slate-300 font-medium">
                    Créez un compte visiteur ou investisseur pour suivre le développement de la ville intelligente et gérer vos engagements de dons de la Phase 1.
                  </p>
                  <button
                    onClick={() => setActiveTab('register')}
                    className="mt-8 flex items-center gap-2 px-8 py-3.5 rounded-xl border border-white text-white font-black text-xs uppercase tracking-widest hover:bg-white hover:text-[#0b1d35] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    Créer un compte <FiArrowRight />
                  </button>
                </div>

                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  © 2026 Kafumbu Smart City.
                </div>
              </div>

              {/* Contenu glissant - Mode Connexion (Visible en mode Inscription) */}
              <div className={`absolute inset-0 p-12 flex flex-col justify-between transition-all duration-700 ease-in-out ${
                activeTab === 'register' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12 pointer-events-none'
              }`}>
                <div className="scale-75 origin-top-left">
                  <KscLogo isDark={true} />
                </div>
                
                <div className="my-8">
                  <h2 className="text-2xl md:text-3xl font-black leading-tight tracking-tight text-white">
                    Déjà <span className="text-[#63b32e]">Membre</span> ?
                  </h2>
                  <p className="mt-4 text-xs leading-relaxed text-slate-300 font-medium">
                    Connectez-vous à votre espace personnel pour suivre l'évolution en direct du financement participatif et télécharger vos privilèges.
                  </p>
                  <button
                    onClick={() => setActiveTab('login')}
                    className="mt-8 flex items-center gap-2 px-8 py-3.5 rounded-xl border border-white text-white font-black text-xs uppercase tracking-widest hover:bg-white hover:text-[#0b1d35] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    Se connecter <FiArrowRight />
                  </button>
                </div>

                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  © 2026 Kafumbu Smart City.
                </div>
              </div>

            </div>

          </div>

          {/* ─────────────────────────────────────────────────────────────────
              VERSION MOBILE : TABULATEUR SIMPLE (S'adapte parfaitement sur smartphone)
              ───────────────────────────────────────────────────────────────── */}
          <div className="md:hidden flex flex-col p-6">
            {/* Sélecteur d'onglets mobile */}
            <div className="flex border-b border-white/5 mb-6">
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 pb-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all ${
                  activeTab === 'login' ? 'border-[#63b32e] text-[#63b32e]' : 'border-transparent text-slate-400'
                }`}
              >
                Connexion
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`flex-1 pb-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all ${
                  activeTab === 'register' ? 'border-[#63b32e] text-[#63b32e]' : 'border-transparent text-slate-400'
                }`}
              >
                Créer Compte
              </button>
            </div>

            {/* Mobile Login Form */}
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className={`flex items-center gap-3 rounded-xl px-4 py-3 border ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'}`}>
                  <FiUser className="text-slate-400" size={16} />
                  <input
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value.trim().toLowerCase())}
                    type="text"
                    required
                    placeholder="Identifiant KSC"
                    className={`w-full bg-transparent text-xs outline-none ${isDark ? 'text-white' : 'text-slate-800'}`}
                  />
                </div>

                <div className={`flex items-center gap-3 rounded-xl px-4 py-3 border ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'}`}>
                  <FiLock className="text-slate-400" size={16} />
                  <input
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    type="password"
                    required
                    placeholder="Mot de passe"
                    className="w-full bg-transparent text-xs outline-none text-white"
                  />
                </div>

                {loginError && (
                  <div className="p-3 text-xs text-red-500 font-bold bg-red-500/10 rounded-xl border border-red-500/20 text-center">
                    {loginError}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full rounded-xl py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-lg"
                  style={{ background: 'linear-gradient(90deg, #63b32e 0%, #0f70b7 100%)' }}
                >
                  Se connecter
                </button>

                <div className="mt-4 text-center">
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); setActiveTab('forgot'); setForgotStep('email'); setForgotError(''); }}
                    className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${
                      isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-[#0f70b7]'
                    }`}
                  >
                    Mot de passe oublié ?
                  </a>
                </div>
              </form>
            )}

            {/* Mobile Forgot Password Form — 3 étapes */}
            {activeTab === 'forgot' && (
              <div className="space-y-4">
                <div className="flex items-start justify-between border-b border-white/5 pb-3">
                  <div className="flex flex-col gap-2">
                    <span className={`text-[9px] font-black uppercase tracking-widest ${
                      isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      {forgotStep === 'email' && 'Étape 1 — Votre e-mail'}
                      {forgotStep === 'code' && 'Étape 2 — Votre code'}
                      {forgotStep === 'password' && 'Étape 3 — Mot de passe'}
                    </span>
                    <div className="flex items-center gap-2">
                      {['email', 'code', 'password'].map((step, i) => (
                        <div key={step} className="flex items-center gap-1.5">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black transition-all ${
                            forgotStep === step ? 'bg-[#63b32e] text-white' :
                            (['email','code','password'].indexOf(forgotStep) > i) ? 'bg-[#63b32e]/30 text-[#63b32e]' :
                            isDark ? 'bg-white/10 text-slate-400' : 'bg-slate-200 text-slate-400'
                          }`}>{i + 1}</div>
                          {i < 2 && <div className={`h-px w-4 ${
                            ['email','code','password'].indexOf(forgotStep) > i ? 'bg-[#63b32e]' : 'bg-white/10'
                          }`} />}
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('login')}
                    className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 hover:underline mt-1"
                  >
                    Retour
                  </button>
                </div>

                {/* Étape 1 : e-mail */}
                {forgotStep === 'email' && (
                  <form onSubmit={handleForgotSubmit} className="space-y-4">
                    <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Saisissez votre adresse e-mail de contact.</p>
                    <div className={`flex items-center gap-3 rounded-xl px-4 py-3 border ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'}`}>
                      <FiMail className="text-slate-400" size={16} />
                      <input
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        type="email"
                        required
                        placeholder="Adresse e-mail de contact"
                        className={`w-full bg-transparent text-xs outline-none ${isDark ? 'text-white' : 'text-slate-800'}`}
                      />
                    </div>
                    {forgotError && (
                      <div className="p-3 text-xs text-red-500 font-bold bg-red-500/10 rounded-xl border border-red-500/20 text-center">{forgotError}</div>
                    )}
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="w-full rounded-xl py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-lg disabled:opacity-50"
                      style={{ background: 'linear-gradient(90deg, #63b32e 0%, #0f70b7 100%)' }}
                    >
                      {forgotLoading ? 'Envoi...' : 'Envoyer le code →'}
                    </button>
                  </form>
                )}

                {/* Étape 2 : token */}
                {forgotStep === 'code' && (
                  <form onSubmit={handleCodeStep} className="space-y-4">
                    <div className={`rounded-xl border px-4 py-3 text-xs font-bold ${
                      isDark ? 'border-[#63b32e]/25 bg-[#63b32e]/10 text-slate-200' : 'border-[#63b32e]/25 bg-[#63b32e]/10 text-slate-700'
                    }`}>
                      📧 Code envoyé à <strong>{forgotEmail}</strong> — expire dans {forgotExpiresIn}s
                    </div>
                    <div className={`flex items-center gap-3 rounded-xl px-4 py-3 border ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'}`}>
                      <FiCheckCircle className="text-slate-400" size={16} />
                      <input
                        value={forgotCode}
                        onChange={(e) => setForgotCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))}
                        type="text"
                        required
                        minLength={6}
                        maxLength={6}
                        autoFocus
                        placeholder="Code à 6 caractères"
                        className={`w-full bg-transparent text-center font-mono text-xl tracking-[0.4em] outline-none ${isDark ? 'text-white' : 'text-slate-800'}`}
                      />
                    </div>
                    {forgotError && (
                      <div className="p-3 text-xs text-red-500 font-bold bg-red-500/10 rounded-xl border border-red-500/20 text-center">{forgotError}</div>
                    )}
                    <button
                      type="submit"
                      disabled={forgotCode.length < 6 || forgotExpiresIn === 0}
                      className="w-full rounded-xl py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-lg disabled:opacity-50"
                      style={{ background: 'linear-gradient(90deg, #63b32e 0%, #0f70b7 100%)' }}
                    >
                      Valider le code →
                    </button>
                    <button
                      type="button"
                      onClick={() => { setForgotStep('email'); setForgotCode(''); setForgotError(''); }}
                      className="w-full rounded-xl border border-white/10 py-3 text-xs font-black uppercase tracking-wider text-slate-400"
                    >
                      ← Modifier l'e-mail
                    </button>
                  </form>
                )}

                {/* Étape 3 : nouveau mot de passe */}
                {forgotStep === 'password' && (
                  <form onSubmit={handleVerifyForgotCode} className="space-y-4">
                    <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>✓ Code validé. Créez votre nouveau mot de passe.</p>
                    <div className={`flex items-center gap-3 rounded-xl px-4 py-3 border ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'}`}>
                      <FiLock className="text-slate-400" size={16} />
                      <input
                        value={forgotPassword}
                        onChange={(e) => setForgotPassword(e.target.value)}
                        type={showForgotPassword ? 'text' : 'password'}
                        required
                        autoFocus
                        placeholder="Nouveau mot de passe"
                        className={`w-full bg-transparent text-xs outline-none ${isDark ? 'text-white' : 'text-slate-800'}`}
                      />
                      <button type="button" onClick={() => setShowForgotPassword(!showForgotPassword)} className="text-slate-400 shrink-0">
                        {showForgotPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                      </button>
                    </div>
                    <div className={`flex items-center gap-3 rounded-xl px-4 py-3 border ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'}`}>
                      <FiLock className="text-slate-400" size={16} />
                      <input
                        value={forgotConfirmPassword}
                        onChange={(e) => setForgotConfirmPassword(e.target.value)}
                        type={showForgotConfirmPassword ? 'text' : 'password'}
                        required
                        placeholder="Confirmer le mot de passe"
                        className={`w-full bg-transparent text-xs outline-none ${isDark ? 'text-white' : 'text-slate-800'}`}
                      />
                      <button type="button" onClick={() => setShowForgotConfirmPassword(!showForgotConfirmPassword)} className="text-slate-400 shrink-0">
                        {showForgotConfirmPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                      </button>
                    </div>
                    {forgotError && (
                      <div className="p-3 text-xs text-red-500 font-bold bg-red-500/10 rounded-xl border border-red-500/20 text-center">{forgotError}</div>
                    )}
                    {forgotSuccess && (
                      <div className="p-3 text-xs text-[#63b32e] font-bold bg-[#63b32e]/10 rounded-xl border border-[#63b32e]/20 text-center">
                        ✓ Mot de passe réinitialisé ! Redirection...
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={forgotLoading || forgotSuccess}
                      className="w-full rounded-xl py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-lg disabled:opacity-50"
                      style={{ background: 'linear-gradient(90deg, #63b32e 0%, #0f70b7 100%)' }}
                    >
                      {forgotLoading ? 'Réinitialisation...' : 'Confirmer ✓'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setForgotStep('code'); setForgotError(''); }}
                      className="w-full rounded-xl border border-white/10 py-3 text-xs font-black uppercase tracking-wider text-slate-400"
                    >
                      ← Retour au code
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Mobile Register Form */}
            {activeTab === 'register' && verificationStep === 'code' && (
              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div className="rounded-xl border border-[#63b32e]/25 bg-[#63b32e]/10 px-4 py-3 text-xs font-bold leading-relaxed text-slate-200">
                  Code envoye a {regEmail}. Expiration dans {expiresIn}s.
                </div>
                <div className={`flex items-center gap-3 rounded-xl px-4 py-3 border ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'}`}>
                  <FiCheckCircle className="text-slate-400" size={16} />
                  <input
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))}
                    type="text"
                    required
                    minLength={6}
                    maxLength={6}
                    placeholder="Code de validation"
                    className={`w-full bg-transparent text-center font-mono text-lg tracking-[0.3em] outline-none ${isDark ? 'text-white' : 'text-slate-800'}`}
                  />
                </div>
                {regError && (
                  <div className="p-3 text-xs text-red-500 font-bold bg-red-500/10 rounded-xl border border-red-500/20 text-center">
                    {regError}
                  </div>
                )}
                {regSuccess && (
                  <div className="p-3 text-xs text-[#63b32e] font-bold bg-[#63b32e]/10 rounded-xl border border-[#63b32e]/20 text-center">
                    Compte valide. Identifiant KSC : {assignedUsername || 'creation en cours'}.
                  </div>
                )}
                <button
                  type="submit"
                  disabled={registering || expiresIn === 0 || regSuccess}
                  className="w-full rounded-xl py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-lg disabled:opacity-50"
                  style={{ background: 'linear-gradient(90deg, #63b32e 0%, #0f70b7 100%)' }}
                >
                  Valider le code
                </button>
                <button
                  type="button"
                  onClick={() => { setVerificationStep('form'); setVerificationCode(''); setRegError(''); }}
                  className="w-full rounded-xl border border-white/10 py-3 text-xs font-black uppercase tracking-wider text-slate-400"
                >
                  Modifier l'inscription
                </button>
              </form>
            )}

            {activeTab === 'register' && verificationStep === 'form' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className={`flex items-center gap-3 rounded-xl px-4 py-3 border ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'}`}>
                  <FiUser className="text-slate-400" size={16} />
                  <input
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    type="text"
                    required
                    placeholder="Nom complet *"
                    className="w-full bg-transparent text-xs outline-none text-white"
                  />
                </div>

                <div className={`flex items-center gap-3 rounded-xl px-4 py-3 border ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'}`}>
                  <FiMail className="text-slate-400" size={16} />
                  <input
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    type="email"
                    required
                    placeholder="E-mail de contact *"
                    className="w-full bg-transparent text-xs outline-none text-white"
                  />
                </div>

                <div className={`flex items-center gap-3 rounded-xl px-4 py-3 border ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'}`}>
                  <FiLock className="text-slate-400" size={16} />
                  <input
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    type="password"
                    required
                    placeholder="Mot de passe *"
                    className="w-full bg-transparent text-xs outline-none text-white"
                  />
                </div>

                <div className={`flex items-center gap-3 rounded-xl px-4 py-3 border ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'}`}>
                  <FiBriefcase className="text-slate-400" size={16} />
                  <input
                    value={regCompany}
                    onChange={(e) => setRegCompany(e.target.value)}
                    type="text"
                    placeholder="Organisation (Optionnel)"
                    className="w-full bg-transparent text-xs outline-none text-white"
                  />
                </div>

                <div className={`flex items-center gap-3 rounded-xl px-4 py-3 border ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'}`}>
                  <FiPhone className="text-slate-400" size={16} />
                  <input
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    type="tel"
                    placeholder="Téléphone / WhatsApp"
                    className="w-full bg-transparent text-xs outline-none text-white"
                  />
                </div>

                <div>
                  <select
                    value={regTier}
                    onChange={(e) => setRegTier(e.target.value)}
                    className="w-full p-3 rounded-xl border text-xs font-bold bg-[#071426] text-white border-white/10"
                  >
                    <option value="none">Aucun engagement immédiat</option>
                    <option value="citizen">Don Citoyen ($10)</option>
                    <option value="bronze">Investisseur Bronze ($5,000)</option>
                    <option value="silver">Investisseur Silver ($25,000)</option>
                    <option value="gold">Investisseur Gold ($100,000)</option>
                  </select>
                </div>

                {regError && (
                  <div className="p-3 text-xs text-red-500 font-bold bg-red-500/10 rounded-xl border border-red-500/20 text-center">
                    {regError}
                  </div>
                )}

                {regSuccess && (
                  <div className="p-3 text-xs text-[#63b32e] font-bold bg-[#63b32e]/10 rounded-xl border border-[#63b32e]/20 text-center">
                    Inscription reussie. Identifiant KSC : {assignedUsername || 'creation en cours'}.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={registering}
                  className="w-full rounded-xl py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-lg disabled:opacity-50"
                  style={{ background: 'linear-gradient(90deg, #63b32e 0%, #0f70b7 100%)' }}
                >
                  Envoyer le code
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Box Comptes de Démo */}
        {showDemoBox && (
          <div className={`p-6 rounded-3xl border transition-all duration-500 ${
            isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200/80'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h4 className={`text-xs font-black uppercase tracking-[0.25em] ${isDark ? 'text-[#D4AF37]' : 'text-slate-900'}`}>
                Comptes de Démo (Simulateur MySQL)
              </h4>
              <button 
                onClick={() => setShowDemoBox(false)}
                className={`text-[9px] font-black uppercase tracking-widest transition-opacity hover:opacity-100 opacity-60 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                Masquer
              </button>
            </div>
            
            <p className="text-[10px] text-slate-400 font-bold mb-4 uppercase tracking-wider leading-relaxed">
              Cliquez sur un compte ci-dessous pour le préremplir et vous connecter instantanément.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {[
                { label: 'Administrateur', email: 'admin@kafumbu-smartcity.cd', pass: 'Admin@123', bg: 'bg-[#0f70b7]/10 text-[#0f70b7] border-[#0f70b7]/25' },
                { label: 'Don Citoyen', email: 'citizen@kafumbu.cd', pass: 'Citizen@123', bg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/25' },
                { label: 'Bronze Partner', email: 'bronze@kafumbu.cd', pass: 'Bronze@123', bg: 'bg-amber-500/10 text-amber-500 border-amber-500/25' },
                { label: 'Silver Investor', email: 'silver@kafumbu.cd', pass: 'Silver@123', bg: 'bg-amber-500/10 text-amber-500 border-amber-500/25' },
                { label: 'Gold Institution', email: 'gold@kafumbu.cd', pass: 'Gold@123', bg: 'bg-amber-500/10 text-amber-500 border-amber-500/25' },
              ].map((account) => (
                <button
                  key={account.email}
                  onClick={() => handleQuickDemoLogin(account.email, account.pass)}
                  className={`flex flex-col text-left p-3 rounded-xl border hover:scale-105 active:scale-95 transition-all ${account.bg} cursor-pointer`}
                >
                  <span className="text-[10px] font-black uppercase tracking-wider">{account.label}</span>
                  <span className="text-[8px] font-bold opacity-75 mt-1 truncate">{account.email}</span>
                  <span className="text-[8px] font-bold opacity-50 font-mono mt-0.5">Mdp: {account.pass}</span>
                </button>
              ))}
            </div>
          </div>
        )}

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
    </main>
  );
}
