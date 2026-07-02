import { Link } from "react-router-dom";
import { useLang } from "../context/LangContext";
import {
  ArrowRight,
  House,
  MapPin,
  Play,
  Lightning,
} from "@phosphor-icons/react";
import { motion, useInView, animate } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import heroImage from "../images/vu aerien.avif";
import darkHeroImage from "../images/hero-night.png";
import { getPublicContent } from "../services/publicService";
import { useFundraising } from "../context/FundraisingContext";

const WHY_CARDS = [
  {
    key: "item1",
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
  },
  {
    key: "item2",
    img: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80&w=800",
  },
  {
    key: "item3",
    img: "https://images.unsplash.com/photo-1541888081622-1ce82ebdb324?auto=format&fit=crop&q=80&w=800",
  },
  {
    key: "item4",
    img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800",
  },
];

export default function Home() {
  const { t, theme } = useLang();
  const isDark = theme === "dark";
  const [publicSettings, setPublicSettings] = useState({});
  const { statistics, fundingGoal } = useFundraising();

  useEffect(() => {
    getPublicContent()
      .then((data) => setPublicSettings(data.settings || {}))
      .catch(() => {});
  }, []);

  const currentHeroImage = isDark
    ? publicSettings.home_hero_dark_image || darkHeroImage
    : publicSettings.home_hero_image || heroImage;

  return (
    <main
      className={isDark ? "bg-[#071426] text-white" : "bg-white text-slate-900"}
    >
      {/* ── Hero Section ── */}
      <section
        className={`relative min-h-[calc(100svh-68px)] overflow-hidden lg:min-h-0 ${isDark ? "bg-[#071426]" : "bg-white"}`}
      >
        <div className="absolute inset-0 lg:hidden">
          <img
            src={currentHeroImage}
            alt=""
            className="h-full w-full object-cover object-center"
            aria-hidden="true"
          />
          <div
            className={`absolute inset-0 ${isDark ? "bg-[#071426]/55" : "bg-slate-950/28"}`}
          />
          <div
            className={`absolute inset-0 ${isDark ? "bg-gradient-to-b from-black/20 via-black/10 to-black/50" : "bg-gradient-to-b from-black/10 via-black/5 to-black/45"}`}
          />
        </div>
        <div
          className={`pointer-events-none absolute inset-y-0 right-0 hidden w-[44%] lg:block ${isDark ? "bg-white/5" : "bg-slate-50"}`}
        />

        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-68px)] max-w-7xl flex-col justify-center px-4 py-10 sm:px-6 lg:min-h-[calc(100vh-120px)] lg:px-8 lg:py-10">
          <div className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative z-20 max-w-xl">
              <h1
                className={`text-4xl font-black leading-[1.15] tracking-tight text-white drop-shadow-2xl sm:text-4xl lg:text-[53px] ${isDark ? "lg:text-white" : "lg:text-slate-950 lg:drop-shadow-none"}`}
              >
                Kafumbu Melys City (KMC){" "}
                <span className="text-emerald-600">& {t("hero.subtitle")}</span>
              </h1>

              <p
                className={`mt-6 max-w-xl text-base leading-relaxed text-white/88 drop-shadow-xl sm:text-lg ${isDark ? "lg:text-slate-300" : "lg:text-slate-500 lg:drop-shadow-none"}`}
              >
                {t("hero.desc")}
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  to="/financement"
                  className={`inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-sm font-black transition-all hover:-translate-y-0.5 ${
                    isDark
                      ? "bg-white text-slate-950 hover:bg-slate-50"
                      : "bg-white text-[#0B1526] shadow-xl shadow-black/20 hover:bg-slate-50 lg:bg-slate-950 lg:text-white lg:hover:bg-slate-800 lg:shadow-none"
                  }`}
                >
                  {t("hero.ctaInvest")}
                </Link>
                <Link
                  to="/smart-city"
                  className={`inline-flex items-center justify-center gap-3 px-2 py-3 text-sm font-black transition-colors hover:text-emerald-500 ${
                    isDark
                      ? "text-white"
                      : "text-white drop-shadow-xl lg:text-slate-900 lg:drop-shadow-none"
                  }`}
                >
                  <span
                    className={`grid h-12 w-12 place-items-center rounded-xl border-2 ${
                      isDark
                        ? "border-white bg-white/10"
                        : "border-white bg-white text-[#0B1526] shadow-lg shadow-black/15 lg:border-slate-950 lg:shadow-none"
                    }`}
                  >
                    <Play size={18} weight="fill" className="ml-0.5" />
                  </span>
                  {t("hero.ctaLearn")}
                </Link>
              </div>
            </div>

            <div className="relative z-10 hidden min-h-[320px] overflow-hidden sm:min-h-[420px] lg:block lg:min-h-[520px]">
              <img
                src={currentHeroImage}
                alt="Kafumbu Melys City residential district"
                className="h-[320px] w-full object-cover object-center shadow-2xl shadow-slate-900/10 sm:h-[420px] lg:h-[520px] lg:translate-x-8 lg:rounded-bl-[64px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Funding Progress Section ── */}
      <section
        className={`${isDark ? "bg-[#0B1D35]" : "bg-slate-950"} py-28 text-white overflow-hidden`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FundingProgressBar
            isDark={isDark}
            raised={statistics.totalRaised}
            goal={fundingGoal}
          />
        </div>
      </section>

      {/* ── Core Stats Grid ── */}
      <section className={`${isDark ? "bg-[#071426]" : "bg-slate-50"} py-24`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className={`grid gap-px overflow-hidden border ${isDark ? "border-white/10 bg-white/10" : "border-slate-200 bg-slate-200"} sm:grid-cols-2 lg:grid-cols-4 rounded-3xl`}
          >
            {[
              {
                icon: House,
                value: 600,
                suffix: "",
                label: t("stats.housesLabel"),
              },
              {
                icon: Lightning,
                value: 15,
                suffix: " MW",
                label: t("stats.mwLabel"),
              },
              {
                icon: ArrowRight,
                value: 1500,
                suffix: "+",
                label: t("stats.jobsLabel"),
              },
              {
                icon: MapPin,
                value: 200,
                suffix: " ha",
                label: t("stats.hectaresLabel"),
              },
            ].map(({ icon: Icon, value, suffix, label }, index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex min-h-48 flex-col justify-center gap-5 px-8 py-10 ${isDark ? "bg-[#0B1D35]" : "bg-white"} hover:bg-emerald-600/5 transition-colors group`}
              >
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                  <Icon size={26} />
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <StatCounter value={value} isDark={isDark} />
                    <span className="text-xl font-bold text-slate-500 group-hover:text-emerald-500 transition-colors">
                      {suffix}
                    </span>
                  </div>
                  <p className="mt-2 text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-emerald-500 transition-colors">
                    {label}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className={`py-24 ${isDark ? "bg-[#071426]" : "bg-slate-50"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 md:w-2/3">
            <h2
              className={`text-3xl md:text-4xl font-bold mb-6 tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}
            >
              {t("projects.sectionTitle")}
            </h2>
            <p
              className={`text-lg leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}
            >
              {t("projects.sectionDesc")}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            {/* Smart City Project Card */}
            <div
              className={`rounded border overflow-hidden shadow-sm flex flex-col ${isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}
            >
              <div className="h-72 w-full relative">
                <img
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200"
                  alt="Smart City Concept"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 md:p-10 flex-1 flex flex-col">
                <div className="uppercase tracking-wider text-xs font-bold text-emerald-600 mb-3">
                  Infrastructure Urbaine
                </div>
                <h3
                  className={`text-2xl font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}
                >
                  {t("projects.smartCityTitle")}
                </h3>
                <p
                  className={`leading-relaxed mb-8 flex-1 ${isDark ? "text-slate-300" : "text-slate-600"}`}
                >
                  {t("projects.smartCityDesc")}
                </p>
                <Link
                  to="/smart-city"
                  className={`inline-flex items-center gap-2 font-semibold hover:text-emerald-600 transition-colors ${isDark ? "text-white" : "text-slate-900"}`}
                >
                  {t("projects.learnMore")} <ArrowRight weight="bold" />
                </Link>
              </div>
            </div>

            {/* Barrage Project Card */}
            <div
              className={`rounded border overflow-hidden shadow-sm flex flex-col ${isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}
            >
              <div className="h-72 w-full relative">
                <img
                  src="https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80&w=1200"
                  alt="Barrage Hydroélectrique"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 md:p-10 flex-1 flex flex-col">
                <div className="uppercase tracking-wider text-xs font-bold text-emerald-600 mb-3">
                  Énergie Renouvelable
                </div>
                <h3
                  className={`text-2xl font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}
                >
                  {t("projects.barrageTitle")}
                </h3>
                <p
                  className={`leading-relaxed mb-8 flex-1 ${isDark ? "text-slate-300" : "text-slate-600"}`}
                >
                  {t("projects.barrageDesc")}
                </p>
                <Link
                  to="/barrage"
                  className={`inline-flex items-center gap-2 font-semibold hover:text-emerald-600 transition-colors ${isDark ? "text-white" : "text-slate-900"}`}
                >
                  {t("projects.learnMore")} <ArrowRight weight="bold" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Invest (Photo Cards) ── */}
      <section
        className={`py-24 border-t ${isDark ? "bg-[#071426] border-white/10" : "bg-white border-slate-200"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 md:w-2/3">
            <h2
              className={`text-3xl md:text-4xl font-bold mb-6 tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}
            >
              {t("why.sectionTitle")}
            </h2>
            <p
              className={`text-lg leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}
            >
              {t("why.sectionDesc")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_CARDS.map(({ key, img }) => (
              <div
                key={key}
                className={`border flex flex-col ${isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}
              >
                <div className="h-48 w-full">
                  <img
                    src={img}
                    alt={t(`why.${key}Title`)}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 flex-1">
                  <h4
                    className={`text-lg font-bold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}
                  >
                    {t(`why.${key}Title`)}
                  </h4>
                  <p
                    className={`text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}
                  >
                    {t(`why.${key}Desc`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function StatCounter({ value, isDark }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration: 2.5,
        ease: "easeOut",
        onUpdate: (v) => setDisplayValue(Math.round(v)),
      });
      return () => controls.stop();
    } else {
      setDisplayValue(0);
    }
  }, [isInView, value]);

  return (
    <span
      ref={ref}
      className={`text-4xl font-black tracking-tight sm:text-5xl ${isDark ? "text-white" : "text-slate-900"}`}
    >
      {displayValue.toLocaleString()}
    </span>
  );
}

function FundingProgressBar({ isDark, raised = 0, goal = 500000000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });
  const progress =
    goal > 0 ? Math.min((Number(raised || 0) / Number(goal)) * 100, 100) : 0;
  const formattedRaised = Number(raised || 0).toLocaleString("fr-FR");

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, progress, {
        duration: 2,
        ease: "easeOut",
        onUpdate: (value) => setCount(Number(value.toFixed(2))),
      });
      return () => controls.stop();
    } else {
      setCount(0);
    }
  }, [isInView, progress]);

  const milestones = [
    { label: "0", size: "text-[8px] md:text-[10px]" },
    { label: "100M", size: "text-[9px] md:text-[13px]" },
    { label: "200M", size: "text-[10px] md:text-[16px]" },
    { label: "300M", size: "text-[11px] md:text-[19px]" },
    { label: "400M", size: "text-[12px] md:text-[22px]" },
    { label: "500M", size: "text-[14px] md:text-[26px]" },
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8 }}
      className="max-w-5xl mx-auto px-1 sm:px-0"
    >
      <div className="mb-12 text-center">
        <p className="text-emerald-500 font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs mb-4">
          Progression du Financement Participatif
        </p>
        <h3 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter">
          {formattedRaised}{" "}
          <span className="text-slate-500 text-xl md:text-3xl">USD</span>
        </h3>
      </div>

      <div className="relative pt-2 pb-14 md:pb-12">
        {/* Progress Bar Background */}
        <div className="h-10 md:h-14 w-full bg-white/5 rounded-2xl border border-white/10 p-1.5 md:p-2 backdrop-blur-sm relative overflow-hidden flex items-center justify-center">
          {/* Animated Fill */}
          <motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: `${progress}%` } : { width: 0 }}
            transition={{ duration: 2, ease: "circOut" }}
            className="absolute left-1.5 md:left-2 top-1.5 md:top-2 bottom-1.5 md:bottom-2 bg-linear-to-r from-emerald-600 to-emerald-400 rounded-xl md:rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.3)]"
          >
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent animate-shimmer rounded-xl" />
          </motion.div>

          {/* Static Percentage Centered */}
          <span className="relative z-10 text-white font-black text-sm md:text-xl drop-shadow-md whitespace-nowrap">
            {count}%
          </span>
        </div>

        {/* Milestones */}
        <div className="absolute left-0 right-0 -bottom-2 flex justify-between items-end px-1 md:px-2">
          {milestones.map((m, i) => (
            <div key={i} className="flex flex-col items-center">
              <div
                className={`w-px bg-white/20 mb-2 ${
                  i === 5 ? "h-3 md:h-4 bg-emerald-500 w-0.5" : "h-1.5 md:h-2"
                }`}
              />
              <span
                className={`${m.size} font-black tracking-tighter ${i === 5 ? "text-emerald-500" : "text-slate-500"} transition-all`}
              >
                {m.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-16 text-center text-slate-400 text-sm font-medium tracking-wide max-w-2xl mx-auto leading-relaxed">
        Objectif final :{" "}
        <span className="text-white font-bold text-lg">500 000 000 USD</span>{" "}
        pour la phase 1 du projet Kafumbu Smart City. Rejoignez les
        investisseurs qui bâtissent l'avenir de la RDC.
      </p>
    </motion.div>
  );
}
