import { useLang } from "../context/LangContext";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiHeart,
  FiTarget,
  FiUsers,
  FiTrendingUp,
} from "react-icons/fi";

const KmcLogo = ({ isDark = false }) => (
  <div className="relative flex h-28 w-28 items-center justify-center">
    <svg
      className={`absolute inset-0 h-full w-full ${isDark ? "text-white" : "text-[#0B1526]"}`}
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
      <span className="text-[26px] font-black leading-tight tracking-tight text-emerald-600 drop-shadow-sm">
        KMC
      </span>
      <div className="h-[2px] w-9 bg-emerald-600/30" />
      <span
        className={`${isDark ? "text-white" : "text-[#0B1526]"} mt-1.5 text-[8px] font-bold uppercase tracking-[0.3em] opacity-80`}
      >
        Kafumbu
      </span>
    </div>
  </div>
);

export default function About() {
  const { lang, theme } = useLang();
  const isDark = theme === "dark";

  const translations = {
    fr: {
      hero_title: "À Propos",
      hero_subtitle: "Kafumbu Melys City & Better Life",
      hero_desc:
        "Une collaboration visionnaire pour bâtir 600 logements, hôpitaux, écoles, un grand marché, tourisme durable, culture pérenne et élevage laitier autour du réseau KMCpure.",

      section1_title: "Notre Partenariat",
      section1_desc:
        "Kafumbu Melys City est le fruit d'une collaboration stratégique entre une vision ambitieuse et un engagement social profond. Better Life, en tant que porteur du projet, apporte l'expertise, les ressources et la passion nécessaires pour transformer cette vision en réalité.",

      better_life_title: "Better Life - Accompagnateur et Porteur du Projet",
      better_life_desc:
        "Better Life est une organisation engagée dans l'amélioration des conditions de vie et le développement communautaire durable. En tant que porteur du projet Kafumbu Melys City, Better Life met ses capacités au service d'une transformation urbaine profonde et durable.",

      jacques_title: "Mr Bill Kabongu Lwaba - Initiateur du Projet",
      jacques_desc:
        "Mr Bill Kabongu Lwaba est la figure clé derrière Better Life et le projet Kafumbu Melys City. Son engagement personnel et sa vision novatrice sont au cœur de cette transformation urbaine. Convaincu que le changement positif est possible, il mène les efforts pour créer une ville modèle qui améliore la qualité de vie de la communauté.",
      jacques_vision:
        "Sa vision : Un modèle urbain reproductible qui conjugue modernité, durabilité et inclusivité sociale.",

      mission_title: "Notre Mission Commune",
      mission_list: [
        {
          icon: FiTarget,
          title: "Transformer",
          desc: "Créer des villes intelligentes où technologie et humanité coexistent",
        },
        {
          icon: FiHeart,
          title: "Impacter",
          desc: "Améliorer la qualité de vie de 500 000 habitants",
        },
        {
          icon: FiUsers,
          title: "Inclure",
          desc: "Créer 50 000 emplois et opportunités économiques",
        },
        {
          icon: FiTrendingUp,
          title: "Croître",
          desc: "Développer une économie locale robuste et durable",
        },
      ],

      vision_title: "Une Ville Pensée Autrement",
      vision_points: [
        "Architecture moderne et durable",
        "Énergie renouvelable - Barrage hydroélectrique 15 MW",
        "Smart City avec technologies de pointe",
        "Communauté inclusive et participative",
        "Éducation et santé de qualité",
        "Respect de l'environnement et écologie",
      ],

      values_title: "Nos Valeurs Fondamentales",
      values: [
        {
          title: "Excellence",
          desc: "Dans chaque détail, chaque projet, chaque interaction",
        },
        {
          title: "Innovation",
          desc: "Utiliser la technologie pour résoudre les problèmes réels",
        },
        {
          title: "Durabilité",
          desc: "Construire pour les générations futures",
        },
        {
          title: "Transparence",
          desc: "Communication honnête et rapports réguliers",
        },
      ],

      timeline_title: "Le Parcours du Projet",
      timeline: [
        {
          year: "Vision",
          desc: "Conception du projet Kafumbu Smart City par Better Life",
        },
        {
          year: "Développement",
          desc: "Études de faisabilité et planification détaillée",
        },
        {
          year: "Construction",
          desc: "Phase de lancement des infrastructures majeures",
        },
        {
          year: "Réalisation",
          desc: "Une ville modèle pour l'Afrique et le monde",
        },
      ],

      commitment_title: "Notre Engagement",
      commitment_desc:
        "Better Life s'engage à accompagner chaque étape de Kafumbu Smart City avec professionnalisme, intégrité et vision à long terme. Nous construisons non pas pour aujourd'hui, mais pour les générations à venir.",

      cta_title: "Rejoignez la Transformation",
      cta_desc:
        "Que vous soyez investisseur, partenaire technologique ou futur résident, il existe une place pour vous dans cette aventure transformatrice.",
      invest_btn: "Investir",
      partner_btn: "Devenir Partenaire",
      contact_btn: "Nous Contacter",
    },
    en: {
      hero_title: "About",
      hero_subtitle: "Kafumbu Smart City & Better Life",
      hero_desc:
        "A visionary collaboration to transform communities through innovation and sustainable development.",

      section1_title: "Our Partnership",
      section1_desc:
        "Kafumbu Smart City is the result of a strategic collaboration between an ambitious vision and deep social commitment. Better Life, as facilitator and project bearer, brings the expertise, resources and passion needed to turn this vision into reality.",

      better_life_title: "Better Life - Facilitator and Project Bearer",
      better_life_desc:
        "Better Life is a non-profit organization committed to improving living conditions and sustainable community development. As the bearer and main supporter of Kafumbu Smart City, Better Life leverages its capabilities in service of profound and sustainable urban transformation.",

      jacques_title: "Mr JACQUES - Visionary and Mission Bearer",
      jacques_desc:
        "Mr JACQUES is the key figure behind Better Life and the Kafumbu Smart City project. His personal commitment and innovative vision are at the heart of this urban transformation. Convinced that positive change is possible, Mr JACQUES leads efforts to create a model city that improves the quality of life for hundreds of thousands of people.",
      jacques_vision:
        "His vision: A reproducible urban model that combines modernity, sustainability and social inclusivity.",

      mission_title: "Our Shared Mission",
      mission_list: [
        {
          icon: FiTarget,
          title: "Transform",
          desc: "Create smart cities where technology and humanity coexist",
        },
        {
          icon: FiHeart,
          title: "Impact",
          desc: "Improve quality of life for 500,000 residents",
        },
        {
          icon: FiUsers,
          title: "Include",
          desc: "Create 50,000 jobs and economic opportunities",
        },
        {
          icon: FiTrendingUp,
          title: "Grow",
          desc: "Develop a robust and sustainable local economy",
        },
      ],

      vision_title: "A City Rethought",
      vision_points: [
        "Modern and sustainable architecture",
        "Renewable energy - 15 MW hydroelectric dam",
        "Smart City with cutting-edge technologies",
        "Inclusive and participatory community",
        "Quality education and healthcare",
        "Environmental respect and ecology",
      ],

      values_title: "Our Core Values",
      values: [
        {
          title: "Excellence",
          desc: "In every detail, every project, every interaction",
        },
        {
          title: "Innovation",
          desc: "Using technology to solve real problems",
        },
        { title: "Sustainability", desc: "Building for future generations" },
        {
          title: "Transparency",
          desc: "Honest communication and regular reports",
        },
      ],

      timeline_title: "Project Journey",
      timeline: [
        {
          year: "Vision",
          desc: "Design of Kafumbu Smart City project by Better Life",
        },
        {
          year: "Development",
          desc: "Feasibility studies and detailed planning",
        },
        { year: "Construction", desc: "Major infrastructure launch phase" },
        { year: "Realization", desc: "A model city for Africa and the world" },
      ],

      commitment_title: "Our Commitment",
      commitment_desc:
        "Better Life is committed to accompanying every stage of Kafumbu Smart City with professionalism, integrity and long-term vision. We build not for today, but for generations to come.",

      cta_title: "Join the Transformation",
      cta_desc:
        "Whether you are an investor, technology partner or future resident, there is a place for you in this transformative adventure.",
      invest_btn: "Invest",
      partner_btn: "Become Partner",
      contact_btn: "Contact Us",
    },
    es: {
      hero_title: "Acerca De",
      hero_subtitle: "Kafumbu Melys City & Better Life",
      hero_desc:
        "Una colaboración visionaria para construir 600 viviendas, hospitales, escuelas, un gran mercado, turismo sostenible, cultura perdurable y ganadería lechera impulsada por la red KMCpure.",

      section1_title: "Nuestro Partenariado",
      section1_desc:
        "Kafumbu Melys City es el resultado de una colaboración estratégica entre una visión ambiciosa y un compromiso social profundo. Better Life, como promotor del proyecto, aporta la experiencia, recursos y pasión necesarios para convertir esta visión en realidad.",

      better_life_title: "Better Life - Facilitador y Portador del Proyecto",
      better_life_desc:
        "Better Life está comprometida con mejorar las condiciones de vida y el desarrollo comunitario sostenible. Como promotor de Kafumbu Melys City, Better Life aprovecha sus capacidades para ofrecer una transformación urbana profunda y sostenible.",

      jacques_title: "Mr Bill Kabongu Lwaba - Iniciador del Proyecto",
      jacques_desc:
        "Mr Bill Kabongu Lwaba es la figura clave detrás de Better Life y del proyecto Kafumbu Melys City. Su compromiso personal y su visión innovadora están en el corazón de esta transformación urbana. Convencido de que el cambio positivo es posible, lidera los esfuerzos para crear una ciudad modelo que mejore la calidad de vida de la comunidad.",
      jacques_vision:
        "Su visión: Un modelo urbano reproducible que combine modernidad, sostenibilidad e inclusividad social.",

      mission_title: "Nuestra Misión Compartida",
      mission_list: [
        {
          icon: FiTarget,
          title: "Transformar",
          desc: "Crear ciudades inteligentes donde la tecnología y la humanidad coexisten",
        },
        {
          icon: FiHeart,
          title: "Impactar",
          desc: "Mejorar la calidad de vida de 500.000 residentes",
        },
        {
          icon: FiUsers,
          title: "Incluir",
          desc: "Crear 50.000 empleos y oportunidades económicas",
        },
        {
          icon: FiTrendingUp,
          title: "Crecer",
          desc: "Desarrollar una economía local robusta y sostenible",
        },
      ],

      vision_title: "Una Ciudad Repensada",
      vision_points: [
        "Arquitectura moderna y sostenible",
        "Energía renovable - Presa hidroeléctrica de 15 MW",
        "Smart City con tecnologías de punta",
        "Comunidad inclusiva y participativa",
        "Educación y salud de calidad",
        "Respeto ambiental y ecología",
      ],

      values_title: "Nuestros Valores Fundamentales",
      values: [
        {
          title: "Excelencia",
          desc: "En cada detalle, cada proyecto, cada interacción",
        },
        {
          title: "Innovación",
          desc: "Usar la tecnología para resolver problemas reales",
        },
        {
          title: "Sostenibilidad",
          desc: "Construir para las generaciones futuras",
        },
        {
          title: "Transparencia",
          desc: "Comunicación honesta e informes regulares",
        },
      ],

      timeline_title: "El Camino del Proyecto",
      timeline: [
        {
          year: "Visión",
          desc: "Diseño del proyecto Kafumbu Smart City por Better Life",
        },
        {
          year: "Desarrollo",
          desc: "Estudios de viabilidad y planificación detallada",
        },
        {
          year: "Construcción",
          desc: "Fase de lanzamiento de infraestructuras mayores",
        },
        {
          year: "Realización",
          desc: "Una ciudad modelo para África y el mundo",
        },
      ],

      commitment_title: "Nuestro Compromiso",
      commitment_desc:
        "Better Life se compromete a acompañar cada etapa de Kafumbu Smart City con profesionalismo, integridad y visión a largo plazo. Construimos no para hoy, sino para las generaciones por venir.",

      cta_title: "Únete a la Transformación",
      cta_desc:
        "Ya sea inversor, socio tecnológico o futuro residente, hay un lugar para ti en esta aventura transformativa.",
      invest_btn: "Invertir",
      partner_btn: "Convertirse en Socio",
      contact_btn: "Contáctenos",
    },
  };

  const t = translations[lang] || translations.fr;

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${isDark ? "bg-[#071426]" : "bg-slate-50"}`}
    >
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2070"
            alt="Community"
            className="w-full h-full object-cover opacity-50"
          />
          <div
            className={`absolute inset-0 ${isDark ? "bg-gradient-to-b from-[#071426]/80 to-[#071426]" : "bg-gradient-to-b from-white/80 to-slate-50"}`}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <h1
            className={`text-5xl md:text-7xl font-black mb-6 tracking-tighter ${isDark ? "text-white" : "text-slate-900"}`}
          >
            {t.hero_title}{" "}
            <span className="text-emerald-500">{t.hero_subtitle}</span>
          </h1>
          <p
            className={`text-lg md:text-xl max-w-2xl mx-auto leading-relaxed ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            {t.hero_desc}
          </p>
        </div>
      </section>

      {/* Mr JACQUES Section - Photo Left, Text Right */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-14 items-center">
          <div className="relative">
            <div
              className={`rounded-lg border p-2 ${isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white shadow-sm"}`}
            >
              <img
                src="/images/mr-bill-kabongu-lwaba.jpg"
                alt="Mr Bill Kabongu Lwaba"
                className="h-[480px] w-full rounded-md object-cover object-center"
              />
            </div>
            <div
              className={`absolute bottom-5 left-5 right-5 rounded-md border px-5 py-4 backdrop-blur ${
                isDark
                  ? "border-white/10 bg-[#071426]/85 text-white"
                  : "border-white/70 bg-white/90 text-slate-900 shadow-sm"
              }`}
            >
              <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-500">
                Leadership
              </p>
              <p className="mt-1 text-lg font-black">Mr Bill KABONGU LWABA</p>
            </div>
          </div>

          <div className="space-y-7">
            <div>
              <p
                className={`mb-3 text-xs font-black uppercase tracking-[0.24em] ${isDark ? "text-emerald-400" : "text-emerald-700"}`}
              >
                Vision personnelle
              </p>
              <h2
                className={`text-3xl md:text-5xl font-black leading-tight ${isDark ? "text-white" : "text-slate-900"}`}
              >
                {t.jacques_title}
              </h2>
            </div>
            <div className="space-y-4">
              <p
                className={`text-lg leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}
              >
                {t.jacques_desc}
              </p>
              <div
                className={`rounded-lg border-l-4 p-6 ${isDark ? "bg-white/5 border-l-emerald-400 border-y-white/10 border-r-white/10" : "bg-white border-l-emerald-600 border-y-slate-200 border-r-slate-200 shadow-sm"}`}
              >
                <p
                  className={`text-lg font-bold leading-relaxed ${isDark ? "text-emerald-300" : "text-emerald-800"}`}
                >
                  {t.jacques_vision}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3 pt-2">
                {["Vision", "Terrain", "Impact"].map((label) => (
                  <div
                    key={label}
                    className={`rounded-lg border px-4 py-3 ${isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}
                  >
                    <p
                      className={`text-sm font-black ${isDark ? "text-white" : "text-slate-900"}`}
                    >
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Better Life & KSC Partnership - Logo Fusion Section */}
      <section className={`py-20 ${isDark ? "bg-[#0A1A2F]" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.05fr] gap-12 items-center">
            <div
              className={`logo-marriage-stage rounded-lg border p-6 md:p-10 ${isDark ? "border-white/10 bg-[#071426]" : "border-slate-200 bg-slate-50 shadow-sm"}`}
            >
              <div className="flex min-h-[360px] items-center justify-center">
                <div className="w-full max-w-md">
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                    <div
                      className={`logo-marriage-card logo-marriage-left flex h-40 items-center justify-center rounded-lg border p-5 ${
                        isDark
                          ? "border-white/10 bg-white"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <img
                        src="/betterlife-logo.webp"
                        alt="Logo Better Life"
                        className="max-h-28 w-full object-contain logo-marriage-image"
                      />
                    </div>

                    <div className="relative flex items-center justify-center">
                      <div className="logo-marriage-line" />
                      <div
                        className={`logo-marriage-heart relative z-10 flex h-12 w-12 items-center justify-center rounded-full border ${
                          isDark
                            ? "border-white/15 bg-[#071426]"
                            : "border-slate-200 bg-white shadow-sm"
                        }`}
                      >
                        <FiHeart className="text-emerald-500" size={20} />
                      </div>
                    </div>

                    <div
                      className={`logo-marriage-card logo-marriage-right flex h-40 items-center justify-center rounded-lg border ${
                        isDark
                          ? "border-white/10 bg-white/5"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <KmcLogo isDark={isDark} />
                    </div>
                  </div>

                  <div className="partner-pill mt-6 rounded-md bg-slate-950 px-4 py-3 text-center text-xs font-black uppercase tracking-[0.18em] text-white">
                    Better Life x Kafumbu Melys City
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 animate-stagger-children">
              <p
                className={`text-xs font-black uppercase tracking-[0.24em] ${isDark ? "text-emerald-400" : "text-emerald-700"}`}
              >
                Fusion du porteur et du projet
              </p>
              <h3
                className={`text-3xl md:text-5xl font-black leading-tight ${isDark ? "text-white" : "text-slate-900"}`}
              >
                {t.section1_title}
              </h3>
              <p
                className={`text-lg leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}
              >
                {t.section1_desc}
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {["Porteur social", "Projet urbain", "Impact durable"].map(
                  (label) => (
                    <div
                      key={label}
                      className={`rounded-lg border px-4 py-4 ${isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50"}`}
                    >
                      <p
                        className={`text-sm font-black ${isDark ? "text-white" : "text-slate-900"}`}
                      >
                        {label}
                      </p>
                    </div>
                  ),
                )}
              </div>
              <Link
                to="/investir"
                className="inline-flex items-center gap-3 rounded-lg bg-slate-900 px-8 py-4 text-sm font-black uppercase tracking-widest text-white transition-all hover:scale-105"
              >
                {t.invest_btn} <FiArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Better Life Organization Section - Image Right */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p
              className={`text-xs font-black uppercase tracking-[0.24em] ${isDark ? "text-[#0f70b7]" : "text-[#0f70b7]"}`}
            >
              Accompagnement Better Life
            </p>
            <h3
              className={`text-2xl md:text-3xl font-black ${isDark ? "text-white" : "text-slate-900"}`}
            >
              {t.better_life_title}
            </h3>
            <p
              className={`text-lg leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}
            >
              {t.better_life_desc}
            </p>
          </div>

          <div
            className={`rounded-lg border p-2 ${isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white shadow-sm"}`}
          >
            <img
              src="/images/mr-bill-kabongu-lwaba.jpg"
              alt="Mr Bill Kabongu Lwaba"
              className="h-[400px] w-full rounded-md object-cover"
            />
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className={`py-20 ${isDark ? "bg-white/5" : "bg-slate-100"}`}>
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="text-center mb-16">
            <h2
              className={`text-3xl md:text-4xl font-black mb-4 ${isDark ? "text-white" : "text-slate-900"}`}
            >
              {t.mission_title}
            </h2>
            <div className="w-20 h-1.5 bg-emerald-500 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.mission_list.map((item, i) => (
              <div
                key={i}
                className={`p-6 rounded-xl border transition-all ${
                  isDark
                    ? "bg-[#071426] border-white/10 hover:border-emerald-500/50"
                    : "bg-white border-slate-200 hover:shadow-xl"
                }`}
              >
                <item.icon size={32} className="text-emerald-500 mb-4" />
                <h3
                  className={`text-lg font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}
                >
                  {item.title}
                </h3>
                <p
                  className={`text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-20">
        <h2
          className={`text-3xl md:text-4xl font-black mb-12 text-center ${isDark ? "text-white" : "text-slate-900"}`}
        >
          {t.vision_title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.vision_points.map((point, i) => (
            <div
              key={i}
              className={`p-6 rounded-xl border ${
                isDark
                  ? "bg-white/5 border-white/10"
                  : "bg-white border-slate-200"
              }`}
            >
              <p
                className={`text-lg font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}
              >
                {point}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Values Section */}
      <section className={`py-20 ${isDark ? "bg-white/5" : "bg-slate-100"}`}>
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="text-center mb-16">
            <h2
              className={`text-3xl md:text-4xl font-black mb-4 ${isDark ? "text-white" : "text-slate-900"}`}
            >
              {t.values_title}
            </h2>
            <div className="w-20 h-1.5 bg-emerald-500 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.values.map((value, i) => (
              <div
                key={i}
                className={`p-8 rounded-xl border text-center transition-all ${
                  isDark
                    ? "bg-[#071426] border-white/10 hover:border-emerald-500/50"
                    : "bg-white border-slate-200 hover:shadow-lg"
                }`}
              >
                <h3
                  className={`text-xl font-bold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}
                >
                  {value.title}
                </h3>
                <p
                  className={`text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}
                >
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-20">
        <h2
          className={`text-3xl md:text-4xl font-black mb-12 text-center ${isDark ? "text-white" : "text-slate-900"}`}
        >
          {t.timeline_title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {t.timeline.map((item, i) => (
            <div
              key={i}
              className={`p-6 rounded-xl border relative ${
                isDark
                  ? "bg-white/5 border-emerald-500/50"
                  : "bg-white border-emerald-500/50"
              }`}
            >
              <div
                className={`text-2xl font-black mb-2 ${isDark ? "text-emerald-400" : "text-emerald-600"}`}
              >
                {i + 1}
              </div>
              <h3
                className={`text-lg font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}
              >
                {item.year}
              </h3>
              <p
                className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Commitment Section */}
      <section className={`py-20 ${isDark ? "bg-white/5" : "bg-slate-100"}`}>
        <div className="max-w-3xl mx-auto px-4 lg:px-6 text-center">
          <h2
            className={`text-3xl md:text-4xl font-black mb-6 ${isDark ? "text-white" : "text-slate-900"}`}
          >
            {t.commitment_title}
          </h2>
          <p
            className={`text-lg leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}
          >
            {t.commitment_desc}
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <h2
          className={`text-3xl md:text-4xl font-black mb-4 ${isDark ? "text-white" : "text-slate-900"}`}
        >
          {t.cta_title}
        </h2>
        <p
          className={`text-lg mb-8 leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}
        >
          {t.cta_desc}
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/investir"
            className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white font-black text-sm uppercase tracking-widest rounded-xl hover:scale-105 transition-all"
          >
            {t.invest_btn} <FiArrowRight size={20} />
          </Link>
          <Link
            to="/partenaires"
            className={`inline-flex items-center gap-3 px-8 py-4 font-black text-sm uppercase tracking-widest rounded-xl transition-all ${
              isDark
                ? "bg-emerald-900/30 text-emerald-400 border border-emerald-500 hover:scale-105"
                : "bg-emerald-50 text-emerald-700 border border-emerald-300 hover:scale-105"
            }`}
          >
            {t.partner_btn} <FiArrowRight size={20} />
          </Link>
          <Link
            to="/contact"
            className={`inline-flex items-center gap-3 px-8 py-4 font-black text-sm uppercase tracking-widest rounded-xl transition-all border ${
              isDark
                ? "bg-white/5 text-white border-white/20 hover:scale-105"
                : "bg-white text-slate-900 border-slate-300 hover:scale-105"
            }`}
          >
            {t.contact_btn} <FiArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}

const AboutLegacy = () => {
  const { lang, theme } = useLang();
  const isDark = theme === "dark";

  const translations = {
    fr: {
      title: "À Propos",
      subtitle: "Kafumbu Smart City - Parrainé par Better Life",
      aboutKafumbu: "À propos de Kafumbu Smart City",
      kafumbuDesc:
        "Kafumbu Smart City est une initiative visionnaire visant à transformer les communautés à travers l'innovation technologique, la gouvernance durable et l'inclusion économique.",
      ourMission: "Notre Mission",
      missionDesc:
        "Créer un écosystème urbain intelligent qui améliore la qualité de vie, crée des opportunités économiques et favorise le développement durable pour les générations futures.",
      ourVision: "Notre Vision",
      visionDesc:
        "Un avenir où la technologie, la nature et l'humanité coexistent harmonieusement pour bâtir des villes résilientes et inclusives.",
      supportedBy: "Soutenu par Better Life",
      betterLifeDesc:
        "Better Life est une organisation à but non lucratif dédiée à l'amélioration des conditions de vie et au développement communautaire. En tant que parrain de Kafumbu Smart City, Better Life apporte son expertise, ses ressources et son engagement envers un avenir durable.",
      betterLifeMission:
        "Better Life s'engage à catalyser le changement positif en soutenant des projets innovants qui créent un impact durable dans les communautés où nous opérons.",
      keyValues: "Valeurs Clés",
      value1: "Innovation",
      value1Desc: "Adopter la technologie pour résoudre les problèmes réels",
      value2: "Durabilité",
      value2Desc: "Protéger notre environnement pour les générations futures",
      value3: "Communauté",
      value3Desc: "Renforcer les liens et créer des opportunités partagées",
      value4: "Impact",
      value4Desc: "Mesurer et maximiser la différence positive que nous créons",
      partnership: "Partenariat pour l'Impact",
      partnershipDesc:
        "Le partenariat entre Kafumbu Smart City et Better Life incarne un engagement partagé envers l'excellence, l'innovation et la création de valeur durable. Ensemble, nous repoussons les limites de ce qui est possible dans le développement urbain intelligent et l'amélioration communautaire.",
      joinUs: "Rejoignez-nous",
      joinDesc:
        "Que vous soyez investisseur, partenaire technologique ou membre de la communauté, il existe de nombreuses façons de faire partie de cette transformation. Explorez les opportunités ci-dessous:",
      investBtn: "Investir",
      partnerBtn: "Devenir Partenaire",
      contactBtn: "Nous Contacter",
    },
    en: {
      title: "About",
      subtitle: "Kafumbu Smart City - Sponsored by Better Life",
      aboutKafumbu: "About Kafumbu Smart City",
      kafumbuDesc:
        "Kafumbu Smart City is a visionary initiative aimed at transforming communities through technological innovation, sustainable governance, and economic inclusion.",
      ourMission: "Our Mission",
      missionDesc:
        "Create an intelligent urban ecosystem that improves quality of life, creates economic opportunities, and fosters sustainable development for future generations.",
      ourVision: "Our Vision",
      visionDesc:
        "A future where technology, nature, and humanity coexist harmoniously to build resilient and inclusive cities.",
      supportedBy: "Supported by Better Life",
      betterLifeDesc:
        "Better Life is a non-profit organization dedicated to improving living conditions and community development. As the sponsor of Kafumbu Smart City, Better Life brings its expertise, resources, and commitment to a sustainable future.",
      betterLifeMission:
        "Better Life is committed to catalyzing positive change by supporting innovative projects that create lasting impact in the communities where we operate.",
      keyValues: "Key Values",
      value1: "Innovation",
      value1Desc: "Embracing technology to solve real-world problems",
      value2: "Sustainability",
      value2Desc: "Protecting our environment for future generations",
      value3: "Community",
      value3Desc: "Strengthening bonds and creating shared opportunities",
      value4: "Impact",
      value4Desc: "Measuring and maximizing the positive difference we create",
      partnership: "Partnership for Impact",
      partnershipDesc:
        "The partnership between Kafumbu Smart City and Better Life embodies a shared commitment to excellence, innovation, and creating lasting value. Together, we push the boundaries of what is possible in smart urban development and community improvement.",
      joinUs: "Join Us",
      joinDesc:
        "Whether you are an investor, technology partner, or community member, there are many ways to be part of this transformation. Explore opportunities below:",
      investBtn: "Invest",
      partnerBtn: "Become a Partner",
      contactBtn: "Contact Us",
    },
  };

  const t = translations[lang] || translations.fr;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark
          ? "bg-gradient-to-br from-[#071426] via-[#0a1a2e] to-[#0f2845]"
          : "bg-gradient-to-br from-white via-blue-50 to-emerald-50"
      }`}
    >
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className={`pt-32 pb-16 px-4 text-center ${
          isDark
            ? "bg-gradient-to-b from-[#0a1a2e] to-transparent"
            : "bg-gradient-to-b from-blue-50 to-transparent"
        }`}
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`text-5xl md:text-6xl font-bold mb-4 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {t.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className={`text-xl md:text-2xl ${
            isDark ? "text-blue-300" : "text-blue-600"
          }`}
        >
          {t.subtitle}
        </motion.p>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-16"
        >
          {/* Kafumbu Section */}
          <motion.section variants={itemVariants}>
            <div
              className={`p-8 rounded-xl ${
                isDark
                  ? "bg-[#0f2845] border border-blue-900/30"
                  : "bg-white border border-blue-200/30 shadow-lg"
              }`}
            >
              <h2
                className={`text-3xl font-bold mb-4 ${isDark ? "text-blue-300" : "text-blue-600"}`}
              >
                {t.aboutKafumbu}
              </h2>
              <p
                className={`text-lg leading-relaxed mb-6 ${isDark ? "text-gray-300" : "text-gray-700"}`}
              >
                {t.kafumbuDesc}
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3
                    className={`text-2xl font-bold mb-3 ${isDark ? "text-emerald-400" : "text-emerald-600"}`}
                  >
                    {t.ourMission}
                  </h3>
                  <p
                    className={`leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    {t.missionDesc}
                  </p>
                </div>
                <div>
                  <h3
                    className={`text-2xl font-bold mb-3 ${isDark ? "text-purple-400" : "text-purple-600"}`}
                  >
                    {t.ourVision}
                  </h3>
                  <p
                    className={`leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    {t.visionDesc}
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Better Life Section */}
          <motion.section variants={itemVariants}>
            <div
              className={`p-8 rounded-xl ${
                isDark
                  ? "bg-gradient-to-r from-[#0f2845] to-[#1a4d2e] border border-emerald-900/30"
                  : "bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200/50 shadow-lg"
              }`}
            >
              <h2
                className={`text-3xl font-bold mb-4 flex items-center gap-3 ${isDark ? "text-emerald-400" : "text-emerald-700"}`}
              >
                <FaHeart className="text-red-500" /> {t.supportedBy}
              </h2>
              <p
                className={`text-lg leading-relaxed mb-6 ${isDark ? "text-gray-300" : "text-gray-800"}`}
              >
                {t.betterLifeDesc}
              </p>
              <div
                className={`p-4 rounded-lg ${isDark ? "bg-[#0a1a2e]/50" : "bg-white/50"}`}
              >
                <p
                  className={`leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}
                >
                  <strong>{t.betterLifeMission}</strong>
                </p>
              </div>
            </div>
          </motion.section>

          {/* Key Values Section */}
          <motion.section variants={itemVariants}>
            <h2
              className={`text-3xl font-bold mb-8 ${isDark ? "text-white" : "text-gray-900"}`}
            >
              {t.keyValues}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: FaLeaf,
                  title: t.value1,
                  desc: t.value1Desc,
                  color: "from-blue-500 to-blue-600",
                },
                {
                  icon: FaGlobeAmericas,
                  title: t.value2,
                  desc: t.value2Desc,
                  color: "from-emerald-500 to-emerald-600",
                },
                {
                  icon: FaUsers,
                  title: t.value3,
                  desc: t.value3Desc,
                  color: "from-purple-500 to-purple-600",
                },
                {
                  icon: FaHeart,
                  title: t.value4,
                  desc: t.value4Desc,
                  color: "from-red-500 to-red-600",
                },
              ].map((value, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className={`p-6 rounded-xl ${
                    isDark
                      ? "bg-[#0f2845] border border-blue-900/30"
                      : "bg-white border border-gray-200 shadow-lg"
                  }`}
                >
                  <div
                    className={`bg-gradient-to-r ${value.color} p-4 rounded-lg w-16 h-16 flex items-center justify-center mb-4`}
                  >
                    <value.icon size={32} className="text-white" />
                  </div>
                  <h3
                    className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    {value.title}
                  </h3>
                  <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                    {value.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Partnership Section */}
          <motion.section variants={itemVariants}>
            <div
              className={`p-8 rounded-xl text-center ${
                isDark
                  ? "bg-gradient-to-r from-blue-900/20 to-emerald-900/20 border border-blue-500/20"
                  : "bg-gradient-to-r from-blue-100 to-emerald-100 border border-blue-200 shadow-lg"
              }`}
            >
              <h2
                className={`text-3xl font-bold mb-4 ${isDark ? "text-blue-300" : "text-blue-700"}`}
              >
                {t.partnership}
              </h2>
              <p
                className={`text-lg leading-relaxed max-w-3xl mx-auto ${isDark ? "text-gray-300" : "text-gray-800"}`}
              >
                {t.partnershipDesc}
              </p>
            </div>
          </motion.section>

          {/* Call to Action */}
          <motion.section variants={itemVariants}>
            <div className="text-center">
              <h2
                className={`text-3xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {t.joinUs}
              </h2>
              <p
                className={`text-lg mb-8 max-w-2xl mx-auto ${isDark ? "text-gray-300" : "text-gray-700"}`}
              >
                {t.joinDesc}
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="/investir"
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-bold hover:shadow-lg transition-all"
                >
                  {t.investBtn}
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="/partenaires"
                  className={`px-8 py-3 rounded-lg font-bold transition-all ${
                    isDark
                      ? "bg-emerald-900/30 text-emerald-400 border border-emerald-500 hover:shadow-lg"
                      : "bg-emerald-100 text-emerald-700 border border-emerald-300 hover:shadow-lg"
                  }`}
                >
                  {t.partnerBtn}
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="/contact"
                  className={`px-8 py-3 rounded-lg font-bold transition-all ${
                    isDark
                      ? "bg-purple-900/30 text-purple-400 border border-purple-500 hover:shadow-lg"
                      : "bg-purple-100 text-purple-700 border border-purple-300 hover:shadow-lg"
                  }`}
                >
                  {t.contactBtn}
                </motion.a>
              </div>
            </div>
          </motion.section>
        </motion.div>
      </div>
    </div>
  );
};
