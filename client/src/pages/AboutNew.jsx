import { useLang } from "../context/LangContext";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiHeart,
  FiTarget,
  FiUsers,
  FiTrendingUp,
} from "react-icons/fi";

export default function About() {
  const { lang, theme } = useLang();
  const isDark = theme === "dark";

  const translations = {
    fr: {
      hero_title: "À Propos",
      hero_subtitle: "Kafumbu Smart City & Better Life",
      hero_desc:
        "Une collaboration visionnaire pour transformer les communautés à travers l'innovation et le développement durable.",

      section1_title: "Notre Partenariat",
      section1_desc:
        "Kafumbu Smart City est le fruit d'une collaboration stratégique entre une vision ambitieuse et un engagement social profond. Better Life, en tant qu'apporteur et partenaire fondateur, apporte l'expertise, les ressources et la passion nécessaires pour transformer cette vision en réalité.",

      better_life_founder: "Better Life - L'Apporteur du Projet",
      better_life_desc:
        "Better Life est une organisation à but non lucratif engagée dans l'amélioration des conditions de vie et le développement communautaire durable. En tant qu'initiateur et principal soutien de Kafumbu Smart City, Better Life met ses capacités au service d'une transformation urbaine profonde.",

      better_life_person: "Better Life - La Personne Physique",
      better_life_person_desc:
        "Derrière Better Life se trouve une personne visionnaire dédiée à créer un impact positif et durable. C'est cette volonté individuelle qui alimente la mission collective de Better Life et qui fait avancer chaque projet avec détermination et éthique.",

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
          desc: "Améliorer la qualité de vie de 500 000+ habitants",
        },
        {
          icon: FiUsers,
          title: "Inclure",
          desc: "Créer 50 000+ emplois et opportunités économiques",
        },
        {
          icon: FiTrendingUp,
          title: "Croître",
          desc: "Développer une économie locale robuste et durable",
        },
      ],

      vision_title: "Une Ville Pensée Autrement",
      vision_points: [
        "🏗️ Architecture moderne et durable",
        "⚡ Énergie renouvelable (Barrage 15 MW)",
        "🌍 Smart City technologies",
        "👥 Communauté et inclusion",
        "📚 Éducation & santé de qualité",
        "🌱 Respect de l'environnement",
      ],

      values_title: "Nos Valeurs",
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

      timeline_title: "Le Parcours",
      timeline: [
        { year: "Vision", desc: "Conception du projet Kafumbu Smart City" },
        {
          year: "Développement",
          desc: "Études de faisabilité et planification détaillée",
        },
        {
          year: "Construction",
          desc: "Phase de lancement des infrastructures",
        },
        { year: "Réalisation", desc: "Une ville modèle pour l'Afrique" },
      ],

      cta_title: "Rejoignez la Transformation",
      cta_desc:
        "Que vous soyez investisseur, partenaire technologique ou futur résident, il existe une place pour vous dans cette aventure.",
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
        "Kafumbu Smart City is the result of a strategic collaboration between an ambitious vision and deep social commitment. Better Life, as founder and main partner, brings the expertise, resources and passion needed to turn this vision into reality.",

      better_life_founder: "Better Life - The Project Sponsor",
      better_life_desc:
        "Better Life is a non-profit organization committed to improving living conditions and sustainable community development. As the initiator and main supporter of Kafumbu Smart City, Better Life leverages its capabilities in service of profound urban transformation.",

      better_life_person: "Better Life - The Individual",
      better_life_person_desc:
        "Behind Better Life stands a visionary person dedicated to creating lasting positive impact. This individual commitment fuels Better Life's collective mission and drives every project forward with determination and ethics.",

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
          desc: "Improve quality of life for 500,000+ residents",
        },
        {
          icon: FiUsers,
          title: "Include",
          desc: "Create 50,000+ jobs and economic opportunities",
        },
        {
          icon: FiTrendingUp,
          title: "Grow",
          desc: "Develop a robust and sustainable local economy",
        },
      ],

      vision_title: "A City Rethought",
      vision_points: [
        "🏗️ Modern and sustainable architecture",
        "⚡ Renewable energy (15 MW Dam)",
        "🌍 Smart City technologies",
        "👥 Community and inclusion",
        "📚 Quality education & healthcare",
        "🌱 Environmental respect",
      ],

      values_title: "Our Values",
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

      timeline_title: "The Journey",
      timeline: [
        { year: "Vision", desc: "Design of Kafumbu Smart City project" },
        {
          year: "Development",
          desc: "Feasibility studies and detailed planning",
        },
        { year: "Construction", desc: "Infrastructure launch phase" },
        { year: "Realization", desc: "A model city for Africa" },
      ],

      cta_title: "Join the Transformation",
      cta_desc:
        "Whether you are an investor, technology partner or future resident, there is a place for you in this adventure.",
      invest_btn: "Invest",
      partner_btn: "Become Partner",
      contact_btn: "Contact Us",
    },
    es: {
      hero_title: "Acerca De",
      hero_subtitle: "Kafumbu Smart City & Better Life",
      hero_desc:
        "Una colaboración visionaria para transformar comunidades a través de la innovación y el desarrollo sostenible.",

      section1_title: "Nuestro Partenariado",
      section1_desc:
        "Kafumbu Smart City es el resultado de una colaboración estratégica entre una visión ambiciosa y un profundo compromiso social. Better Life, como fundador y socio principal, aporta la experiencia, recursos y pasión necesarios para convertir esta visión en realidad.",

      better_life_founder: "Better Life - El Patrocinador del Proyecto",
      better_life_desc:
        "Better Life es una organización sin fines de lucro comprometida con mejorar las condiciones de vida y el desarrollo comunitario sostenible. Como iniciador y principal apoyo de Kafumbu Smart City, Better Life aprovecha sus capacidades al servicio de una transformación urbana profunda.",

      better_life_person: "Better Life - El Individuo",
      better_life_person_desc:
        "Detrás de Better Life hay una persona visionaria dedicada a crear un impacto positivo duradero. Este compromiso individual alimenta la misión colectiva de Better Life e impulsa cada proyecto adelante con determinación y ética.",

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
          desc: "Mejorar la calidad de vida de 500.000+ residentes",
        },
        {
          icon: FiUsers,
          title: "Incluir",
          desc: "Crear 50.000+ empleos y oportunidades económicas",
        },
        {
          icon: FiTrendingUp,
          title: "Crecer",
          desc: "Desarrollar una economía local robusta y sostenible",
        },
      ],

      vision_title: "Una Ciudad Repensada",
      vision_points: [
        "🏗️ Arquitectura moderna y sostenible",
        "⚡ Energía renovable (Presa 15 MW)",
        "🌍 Tecnologías Smart City",
        "👥 Comunidad e inclusión",
        "📚 Educación y salud de calidad",
        "🌱 Respeto ambiental",
      ],

      values_title: "Nuestros Valores",
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

      timeline_title: "El Camino",
      timeline: [
        { year: "Visión", desc: "Diseño del proyecto Kafumbu Smart City" },
        {
          year: "Desarrollo",
          desc: "Estudios de viabilidad y planificación detallada",
        },
        {
          year: "Construcción",
          desc: "Fase de lanzamiento de infraestructuras",
        },
        { year: "Realización", desc: "Una ciudad modelo para África" },
      ],

      cta_title: "Únete a la Transformación",
      cta_desc:
        "Ya sea inversor, socio tecnológico o futuro residente, hay un lugar para ti en esta aventura.",
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
            {t.hero_title} <span className="text-emerald-500">Kafumbu</span>
          </h1>
          <p
            className={`text-lg md:text-xl max-w-2xl mx-auto leading-relaxed ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            {t.hero_desc}
          </p>
        </div>
      </section>

      {/* Partnership Section */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6">
            <h2
              className={`text-3xl md:text-4xl font-black mb-6 ${isDark ? "text-white" : "text-slate-900"}`}
            >
              {t.section1_title}
            </h2>
            <p
              className={`text-lg leading-relaxed mb-8 ${isDark ? "text-slate-400" : "text-slate-500"}`}
            >
              {t.section1_desc}
            </p>
            <Link
              to="/investir"
              className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white font-black text-sm uppercase tracking-widest rounded-xl hover:scale-105 transition-all"
            >
              {t.invest_btn} <FiArrowRight size={20} />
            </Link>
          </div>

          <div className="relative">
            <div
              className={`absolute -inset-4 rounded-3xl blur-2xl opacity-20 bg-emerald-500`}
            />
            <div
              className={`relative rounded-xl md:rounded-2xl border overflow-hidden ${isDark ? "border-white/10" : "border-slate-200"}`}
            >
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2070"
                alt="Partnership"
                className="w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Better Life Organization */}
      <section className={`py-20 ${isDark ? "bg-white/5" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div
                className={`absolute -inset-4 rounded-3xl blur-2xl opacity-20 bg-blue-500`}
              />
              <div
                className={`relative rounded-xl md:rounded-2xl border overflow-hidden ${isDark ? "border-white/10" : "border-slate-200"}`}
              >
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2070"
                  alt="Better Life NGO"
                  className="w-full h-[400px] object-cover"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3
                  className={`text-2xl md:text-3xl font-black mb-4 flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}
                >
                  <FiHeart className="text-red-500" size={32} />
                  {t.better_life_founder}
                </h3>
                <p
                  className={`text-lg leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}
                >
                  {t.better_life_desc}
                </p>
              </div>

              <div
                className={`p-6 rounded-xl border ${isDark ? "bg-white/5 border-white/10" : "bg-slate-100 border-slate-200"}`}
              >
                <h4
                  className={`text-lg font-bold mb-3 ${isDark ? "text-emerald-400" : "text-emerald-600"}`}
                >
                  {t.better_life_person}
                </h4>
                <p
                  className={`leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}
                >
                  {t.better_life_person_desc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-20">
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
                  ? "bg-white/5 border-white/10 hover:border-emerald-500/50"
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
      </section>

      {/* Vision Section */}
      <section className={`py-20 ${isDark ? "bg-white/5" : "bg-slate-100"}`}>
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
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
                    ? "bg-[#071426] border-white/10"
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
        </div>
      </section>

      {/* Values Section */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-20">
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
                  ? "bg-white/5 border-white/10 hover:border-emerald-500/50"
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
      </section>

      {/* Timeline Section */}
      <section className={`py-20 ${isDark ? "bg-white/5" : "bg-slate-100"}`}>
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
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
                    ? "bg-[#071426] border-emerald-500/50"
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
