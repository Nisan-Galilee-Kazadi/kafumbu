import React, { useEffect } from 'react';
import { FiCheckCircle, FiAlertTriangle, FiXCircle, FiInfo, FiX } from 'react-icons/fi';

export default function CustomAlertModal({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  type = 'info', 
  isDark = true 
}) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const typeConfig = {
    success: {
      tag: 'TRANSACTION // SECURE',
      stripeBg: 'bg-emerald-500',
      titleColor: 'text-emerald-500',
      btnBg: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/10',
      glowShadow: 'shadow-[0_0_50px_-10px_rgba(16,185,129,0.18)]',
      borderColor: 'border-emerald-500/20',
      bgColor: 'bg-emerald-500/10',
      iconColor: 'text-emerald-500',
      icon: FiCheckCircle
    },
    error: {
      tag: 'SYSTEM // ATTEMPT_FAILED',
      stripeBg: 'bg-rose-500',
      titleColor: 'text-rose-500',
      btnBg: 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-500/10',
      glowShadow: 'shadow-[0_0_50px_-10px_rgba(244,63,94,0.18)]',
      borderColor: 'border-rose-500/20',
      bgColor: 'bg-rose-500/10',
      iconColor: 'text-rose-500',
      icon: FiXCircle
    },
    warning: {
      tag: 'SECURITY // WARNING',
      stripeBg: 'bg-amber-500',
      titleColor: 'text-amber-500',
      btnBg: 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-500/10',
      glowShadow: 'shadow-[0_0_50px_-10px_rgba(245,158,11,0.18)]',
      borderColor: 'border-amber-500/20',
      bgColor: 'bg-amber-500/10',
      iconColor: 'text-amber-500',
      icon: FiAlertTriangle
    },
    info: {
      tag: 'SYSTEM // INFO_EXCHANGE',
      stripeBg: 'bg-[#0f70b7]',
      titleColor: 'text-[#0f70b7]',
      btnBg: 'bg-[#0f70b7] hover:bg-[#0c5991] text-white shadow-lg shadow-[#0f70b7]/10',
      glowShadow: 'shadow-[0_0_50px_-10px_rgba(15,112,183,0.18)]',
      borderColor: 'border-[#0f70b7]/20',
      bgColor: 'bg-[#0f70b7]/10',
      iconColor: 'text-[#0f70b7]',
      icon: FiInfo
    }
  };

  const config = typeConfig[type] || typeConfig.info;
  const Icon = config.icon;
  const isSuccess = type === 'success';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Card */}
      <div className={`relative z-10 w-full max-w-md rounded-xl border pl-10 pr-8 py-8 transition-all transform scale-100 animate-in fade-in zoom-in-95 duration-200 overflow-hidden ${config.glowShadow} ${
        isDark 
          ? 'bg-[#081120] border-white/10 text-white shadow-black/80' 
          : 'bg-white border-slate-200 text-slate-800 shadow-slate-350'
      }`}>
        
        {/* Left Side Stripe */}
        <div className={`absolute left-0 top-0 bottom-0 w-2.5 rounded-l-xl ${config.stripeBg}`} />

        {/* Close Button in a green circle */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-full border border-emerald-500 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-all duration-300 cursor-pointer"
        >
          <FiX size={12} />
        </button>

        {/* Local CSS Style for Animations */}
        {isSuccess && (
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes success-circle {
              0% { stroke-dasharray: 0, 158; }
              100% { stroke-dasharray: 158, 158; }
            }
            @keyframes success-check {
              0% { stroke-dashoffset: 48; }
              100% { stroke-dashoffset: 0; }
            }
            @keyframes success-scale {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.12); }
            }
            .anim-success-circle {
              stroke-dasharray: 158;
              stroke-dashoffset: 0;
              transform-origin: center;
              animation: success-circle 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
            }
            .anim-success-check {
              stroke-dasharray: 48;
              stroke-dashoffset: 48;
              animation: success-check 0.4s cubic-bezier(0.65, 0, 0.45, 1) 0.3s forwards;
            }
            .anim-success-scale {
              animation: success-scale 0.4s cubic-bezier(0.65, 0, 0.45, 1) forwards;
            }
          `}} />
        )}

        <div className="flex flex-col items-start text-left">
          
          {/* Header Monospace Tag & Icon Row */}
          <div className="flex items-center gap-3.5 w-full mb-4">
            {isSuccess ? (
              <div className="flex items-center justify-center shrink-0">
                <svg 
                  className="w-10 h-10 text-emerald-500 anim-success-scale" 
                  viewBox="0 0 52 52"
                  fill="none"
                >
                  <circle 
                    className="anim-success-circle" 
                    cx="26" 
                    cy="26" 
                    r="25" 
                    stroke="currentColor" 
                    strokeWidth="4" 
                    fill="none" 
                  />
                  <path 
                    className="anim-success-check" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    stroke="currentColor" 
                    strokeWidth="4" 
                    d="M14 27l8 8 16-16" 
                  />
                </svg>
              </div>
            ) : (
              <div className={`p-2.5 rounded-xl shrink-0 ${config.bgColor} border ${config.borderColor}`}>
                <Icon size={20} className={config.iconColor} />
              </div>
            )}
            
            <div className="min-w-0">
              <span className={`text-[8px] font-mono tracking-widest uppercase block ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                [ {config.tag} ]
              </span>
              <h3 className={`text-xs font-black uppercase tracking-wider ${config.titleColor} mt-0.5`}>
                {title}
              </h3>
            </div>
          </div>

          {/* Divider */}
          <div className={`w-full h-[1px] mb-4 ${isDark ? 'bg-white/5' : 'bg-slate-100'}`} />

          {/* Message Content */}
          <div className="w-full">
            <p className={`text-xs leading-relaxed font-semibold ${
              isDark ? 'text-slate-350' : 'text-slate-650'
            }`}>
              {message}
            </p>
          </div>

          {/* Action button */}
          <button
            onClick={onClose}
            className={`mt-6 w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${config.btnBg}`}
          >
            Fermer le message
          </button>
        </div>

      </div>
    </div>
  );
}
