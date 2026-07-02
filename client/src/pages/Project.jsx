import { useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useLang } from "../context/LangContext";
import {
  FiArrowRight,
  FiHome,
  FiHeart,
  FiBookOpen,
  FiShoppingBag,
  FiMapPin,
  FiTrendingUp,
  FiDroplet,
} from "react-icons/fi";

const SECTION_GROUPS = [
  {
    title: "Architecture du projet",
    items: [
      {
        id: "habitation",
        title: "Habitation",
        description:
          "600 logements modernes et pérennes, conçus pour la vie familiale et la proximité des services. Chaque quartier est structuré autour d'espaces verts, de réseaux KMCpure et d'accès direct aux écoles, aux commerces et aux transports.",
        icon: FiHome,
      },
      {
        id: "hopitaux",
        title: "Hôpitaux & Pharmacies",
        description:
          "Des soins de santé de proximité avec des centres médicaux, des hôpitaux et des pharmacies intégrés pour garantir un accès rapide à la santé pour toute la communauté.",
        icon: FiHeart,
      },
      {
        id: "ecoles",
        title: "Écoles & Formation",
        description:
          "Des écoles primaires, secondaires et des centres de formation pour accompagner la jeunesse, développer les talents locaux et renforcer l'employabilité régionale.",
        icon: FiBookOpen,
      },
      {
        id: "grand-marche",
        title: "Grand Marché",
        description:
          "Un grand marché central animé pour fédérer le commerce local, les artisans, les producteurs agricoles et offrir une vitrine permanente aux entreprises du territoire.",
        icon: FiShoppingBag,
      },
    ],
  },
  {
    title: "Tourisme & Développement",
    items: [
      {
        id: "tourisme",
        title: "Tourisme & Loisirs",
        description:
          "Un hub touristique tourné vers la découverte, la nature et le patrimoine culturel de Kafumbu, avec des hébergements, des parcours et des activités pour les visiteurs.",
        icon: FiMapPin,
      },
      {
        id: "culture-perenne",
        title: "Culture Pérène",
        description:
          "Un centre culturel vivant et durable, dédié au patrimoine local, aux arts, aux événements et à la transmission des savoir-faire de la région.",
        icon: FiTrendingUp,
      },
      {
        id: "elevage-laitier",
        title: "Élevage de Vache à Lait",
        description:
          "Une filière laitière intégrée avec des fermes de vaches laitières, des unités de transformation et des circuits courts pour soutenir l'agriculture régionale.",
        icon: FiDroplet,
      },
    ],
  },
];

const SECTIONS = SECTION_GROUPS.flatMap((group) => group.items);

export default function Project() {
  const { section } = useParams();
  const { theme } = useLang();
  const isDark = theme === "dark";
  const sectionRefs = useRef({});

  useEffect(() => {
    if (section && sectionRefs.current[section]) {
      sectionRefs.current[section].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [section]);

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${isDark ? "bg-[#071426] text-white" : "bg-slate-50 text-slate-900"}`}
    >
      <section className="relative h-[55vh] overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516251193007-45ef944ab0c6?auto=format&fit=crop&q=80&w=1600')] bg-cover bg-center opacity-70" />
        <div
          className={`absolute inset-0 ${isDark ? "bg-[#071426]/80" : "bg-slate-950/45"}`}
        />
        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-center px-6 text-center sm:px-10">
          <p className="mb-4 inline-flex rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-black uppercase tracking-[0.35em] text-emerald-300">
            Projet Kafumbu
          </p>
          <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Habitat, santé, enseignement, marché et tourisme durable
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-slate-100 sm:text-lg lg:text-xl">
            Kafumbu Melys City rassemble 600 logements, hôpitaux, écoles, un
            grand marché, une destination touristique, une culture pérenne et
            une filière d'élevage laitier alimentée par l'eau KMCpure.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
        <div className="mb-12 grid gap-4 md:grid-cols-[280px_1fr]">
          <aside className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-lg shadow-slate-900/5 backdrop-blur-2xl dark:border-white/10 dark:bg-[#071426]/60">
            <h2 className="text-lg font-black uppercase tracking-[0.25em] text-emerald-600">
              Sections
            </h2>
            <div className="mt-8 space-y-8 text-sm font-bold uppercase tracking-[0.3em] text-slate-700 dark:text-slate-200">
              {SECTION_GROUPS.map((group) => (
                <div key={group.title}>
                  <p className="mb-3 text-[11px] font-black tracking-[0.35em] text-slate-400 dark:text-slate-500">
                    {group.title}
                  </p>
                  <nav className="space-y-2">
                    {group.items.map((item) => (
                      <Link
                        key={item.id}
                        to={`/projet/${item.id}`}
                        className={`block rounded-2xl px-4 py-3 transition-colors duration-200 hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-200 ${item.id !== "tourisme" ? "pl-8" : ""}`}
                      >
                        {item.title}
                      </Link>
                    ))}
                  </nav>
                </div>
              ))}
            </div>
          </aside>

          <div className="space-y-16">
            {SECTIONS.map((item) => (
              <section
                key={item.id}
                id={item.id}
                ref={(node) => {
                  if (node) sectionRefs.current[item.id] = node;
                }}
                className={`rounded-[2rem] border p-10 shadow-xl transition-colors duration-500 ${isDark ? "border-white/10 bg-[#0B1D35]/90" : "border-slate-200 bg-white"}`}
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <span className="inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.28em] text-emerald-300">
                      {item.title}
                    </span>
                    <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                      {item.title}
                    </h2>
                  </div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-500">
                    <item.icon size={26} />
                  </div>
                </div>

                <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-400">
                  {item.description}
                </p>
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className={`rounded-3xl border p-6 ${isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50"}`}
                    >
                      <p className="text-sm font-bold uppercase tracking-[0.35em] text-slate-300">
                        Action
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-300">
                        {item.title} planifiée avec qualité, cohérence locale et
                        développement durable.
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
