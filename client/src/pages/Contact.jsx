import { useState } from "react";
import { useLang } from "../context/LangContext";
import {
  FiMapPin,
  FiMail,
  FiPhone,
  FiCheck,
  FiClock,
  FiSend,
} from "react-icons/fi";

export default function Contact() {
  const { t, theme } = useLang();
  const isDark = theme === "dark";
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div
      className={`min-h-screen pt-32 pb-20 transition-colors duration-500 ${isDark ? "bg-[#071426]" : "bg-slate-50"}`}
    >
      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <h1
          className={`text-4xl md:text-6xl font-black mb-6 tracking-tighter ${isDark ? "text-white" : "text-slate-900"}`}
        >
          {t("contact.sectionTitle")}{" "}
          <span className="text-emerald-500">{t("contact.sectionBadge")}</span>
        </h1>
        <p
          className={`text-lg max-w-2xl mx-auto leading-relaxed ${isDark ? "text-slate-400" : "text-slate-500"}`}
        >
          {t("contact.sectionDesc")}
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Info Cards */}
          <div className="lg:col-span-4 space-y-4">
            {[
              {
                icon: FiMapPin,
                label: t("ui.contact.headquarters"),
                val: t("ui.contact.headquarters_value"),
              },
              {
                icon: FiMail,
                label: t("ui.contact.institutional_email"),
                val: "contact@kafumbu.cd",
              },
              {
                icon: FiPhone,
                label: t("ui.contact.direct_line"),
                val: "+243 XXX XXX XXX",
              },
            ].map((info, i) => (
              <div
                key={i}
                className={`p-6 rounded-xl md:rounded-2xl border transition-all ${
                  isDark
                    ? "bg-white/5 border-white/10 hover:bg-white/10"
                    : "bg-white border-slate-200 shadow-sm"
                }`}
              >
                <info.icon size={20} className="text-emerald-500 mb-4" />
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">
                  {info.label}
                </div>
                <div
                  className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}
                >
                  {info.val}
                </div>
              </div>
            ))}

            <div
              className={`p-6 rounded-xl md:rounded-2xl border-2 border-dashed ${isDark ? "border-white/5 bg-white/5" : "border-slate-100 bg-slate-100/50"}`}
            >
              <div className="flex items-center gap-3 mb-2 text-emerald-500">
                <FiClock size={18} />
                <span className="text-xs font-black uppercase tracking-widest">
                  {t("ui.contact.response_time")}
                </span>
              </div>
              <p
                className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-500"}`}
              >
                {t("ui.contact.response_time_text")}
              </p>
            </div>
          </div>

          {/* Form Container */}
          <div className="lg:col-span-8">
            <div
              className={`p-8 md:p-12 rounded-xl md:rounded-2xl border transition-all duration-500 ${
                isDark
                  ? "bg-white/5 border-white/10 shadow-2xl shadow-black/50"
                  : "bg-white border-slate-200 shadow-xl shadow-slate-200/50"
              }`}
            >
              {sent ? (
                <div className="text-center py-20 animate-in fade-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/20">
                    <FiCheck size={40} />
                  </div>
                  <h2
                    className={`text-3xl font-black mb-4 ${isDark ? "text-white" : "text-slate-900"}`}
                  >
                    {t("ui.contact.message_sent")}
                  </h2>
                  <p className={`text-slate-500 mb-8 max-w-sm mx-auto`}>
                    {t("ui.contact.message_thanks")}
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="text-emerald-500 font-black text-xs uppercase tracking-[0.2em] hover:opacity-70 transition-opacity"
                  >
                    {t("ui.contact.send_another")}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">
                        {t("ui.contact.full_name")}
                      </label>
                      <input
                        required
                        type="text"
                        className={`w-full px-6 py-4 rounded-xl border outline-none transition-all ${
                          isDark
                            ? "bg-white/5 border-white/10 text-white focus:border-emerald-500"
                            : "bg-slate-50 border-slate-200 focus:border-emerald-500 shadow-inner"
                        }`}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">
                        {t("ui.contact.email_professional")}
                      </label>
                      <input
                        required
                        type="email"
                        className={`w-full px-6 py-4 rounded-xl border outline-none transition-all ${
                          isDark
                            ? "bg-white/5 border-white/10 text-white focus:border-emerald-500"
                            : "bg-slate-50 border-slate-200 focus:border-emerald-500 shadow-inner"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">
                      {t("ui.contact.subject")}
                    </label>
                    <select
                      className={`w-full px-6 py-4 rounded-xl border outline-none cursor-pointer transition-all ${
                        isDark
                          ? "bg-white/5 border-white/10 text-white focus:border-emerald-500"
                          : "bg-slate-50 border-slate-200 focus:border-emerald-500 shadow-inner"
                      }`}
                    >
                      <option className={isDark ? "bg-[#071426]" : ""}>
                        {t("ui.contact.subject_investment")}
                      </option>
                      <option className={isDark ? "bg-[#071426]" : ""}>
                        {t("ui.contact.subject_partnership")}
                      </option>
                      <option className={isDark ? "bg-[#071426]" : ""}>
                        {t("ui.contact.subject_media")}
                      </option>
                      <option className={isDark ? "bg-[#071426]" : ""}>
                        {t("ui.contact.subject_other")}
                      </option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">
                      {t("ui.contact.message")}
                    </label>
                    <textarea
                      required
                      rows={6}
                      className={`w-full px-6 py-4 rounded-xl border outline-none transition-all resize-none ${
                        isDark
                          ? "bg-white/5 border-white/10 text-white focus:border-emerald-500"
                          : "bg-slate-50 border-slate-200 focus:border-emerald-500 shadow-inner"
                      }`}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-slate-900 text-white font-black text-sm uppercase tracking-[0.2em] rounded-xl shadow-2xl hover:bg-black transition-all"
                  >
                    {t("ui.contact.send")} <FiSend size={18} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
