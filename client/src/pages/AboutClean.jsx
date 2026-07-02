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
      hero_subtitle: "Kafumbu Melys City & Better Life",
      hero_desc:
        "Une collaboration visionnaire pour transformer les communautés à travers l'innovation et le développement durable.",

      section1_title: "Notre Partenariat",
      section1_desc:
        "Kafumbu Melys City est le fruit d'une collaboration stratégique entre une vision ambitieuse et un engagement social profond. Better Life, en tant qu'accompagnateur et porteur du projet, apporte l'expertise, les ressources et la passion nécessaires pour transformer cette vision en réalité.",

      better_life_title: "Better Life - Accompagnateur et Porteur du Projet",
      better_life_desc:
        "Better Life est une organisation à but non lucratif engagée dans l'amélioration des conditions de vie et le développement communautaire durable. En tant que porteur et principal soutien de Kafumbu Smart City, Better Life met ses capacités au service d'une transformation urbaine profonde et durable.",

      jacques_title: "Mr JACQUES - Visionnaire et Porteur de la Mission",
      jacques_desc:
        "Mr JACQUES est la figure clé derrière Better Life et le projet Kafumbu Melys City. Son engagement personnel et sa vision novatrice sont au cœur de cette transformation urbaine. Convaincu que le changement positif est possible, Mr JACQUES dirige les efforts pour créer une cité modèle qui améliore la qualité de vie de la communauté locale.",
      jacques_vision:
        "Sa vision : Un modèle urbain reproductible pour l'Afrique qui conjugue modernité, durabilité et inclusivité sociale.",

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
        "Réseau d'eau potable KMCpure pour distribution d'eau pure",
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
        "His vision: A reproducible urban model for Africa that combines modernity, sustainability and social inclusivity.",

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
      hero_subtitle: "Kafumbu Smart City & Better Life",
      hero_desc:
        "Una colaboración visionaria para transformar comunidades a través de la innovación y el desarrollo sostenible.",

      section1_title: "Nuestro Partenariado",
      section1_desc:
        "Kafumbu Smart City es el resultado de una colaboración estratégica entre una visión ambiciosa y un profundo compromiso social. Better Life, como facilitador y portador del proyecto, aporta la experiencia, recursos y pasión necesarios para convertir esta visión en realidad.",

      better_life_title: "Better Life - Facilitador y Portador del Proyecto",
      better_life_desc:
        "Better Life es una organización sin fines de lucro comprometida con mejorar las condiciones de vida y el desarrollo comunitario sostenible. Como portador y principal apoyo de Kafumbu Smart City, Better Life aprovecha sus capacidades al servicio de una transformación urbana profunda y sostenible.",

      jacques_title: "Mr JACQUES - Visionario y Portador de la Misión",
      jacques_desc:
        "Mr JACQUES es la figura clave detrás de Better Life y del proyecto Kafumbu Smart City. Su compromiso personal y su visión innovadora están en el corazón de esta transformación urbana. Convencido de que el cambio positivo es posible, Mr JACQUES lidera los esfuerzos para crear una ciudad modelo que mejore la calidad de vida de cientos de miles de personas.",
      jacques_vision:
        "Su visión: Un modelo urbano reproducible para África que conjugue modernidad, sostenibilidad e inclusividad social.",

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
            src="/images/hero-aerial-placeholder.svg"
            alt="Kafumbu aerial view"
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

      {/* Mr JACQUES Section - Photo Left, Text Below */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-20">
        <div className="space-y-8">
          {/* Photo */}
          <div className="relative w-full md:w-96">
            <div
              className={`absolute -inset-4 rounded-3xl blur-2xl opacity-20 bg-emerald-500`}
            />
            <div
              className={`relative rounded-xl md:rounded-2xl border overflow-hidden ${isDark ? "border-white/10" : "border-slate-200"}`}
            >
              <img
                src="/images/mr-bill-kabongu-lwaba.jpg"
                alt="Initiateur du projet"
                className="w-full h-[400px] object-cover"
              />
            </div>
          </div>

          {/* Text Below */}
          <div className="space-y-6">
            <h2
              className={`text-3xl md:text-4xl font-black ${isDark ? "text-white" : "text-slate-900"}`}
            >
              {t.jacques_title}
            </h2>
            <div className="space-y-4">
              <p
                className={`text-lg leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}
              >
                {t.jacques_desc}
              </p>
              <div
                className={`p-6 rounded-xl border ${isDark ? "bg-white/5 border-emerald-500/30" : "bg-slate-100 border-emerald-500/30"}`}
              >
                <p
                  className={`text-lg font-semibold leading-relaxed ${isDark ? "text-emerald-400" : "text-emerald-700"}`}
                >
                  {t.jacques_vision}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Better Life & KSC Partnership - Logo Fusion Section */}
      <section className={`py-20 ${isDark ? "bg-white/5" : "bg-slate-100"}`}>
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image Left - Logo Fusion */}
            <div className="relative">
              <div
                className={`absolute -inset-4 rounded-3xl blur-2xl opacity-20 bg-blue-500`}
              />
              <div
                className={`relative rounded-xl md:rounded-2xl border overflow-hidden ${isDark ? "border-white/10" : "border-slate-200"}`}
              >
                <div
                  className={`w-full h-[400px] flex items-center justify-center ${isDark ? "bg-[#071426]" : "bg-white"}`}
                >
                  <div className="text-center">
                    <p
                      className={`text-sm font-bold uppercase tracking-widest mb-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`}
                    >
                      Better Life + Kafumbu Smart City
                    </p>
                    <div className="text-6xl font-black text-emerald-500">
                      KSC
                    </div>
                    <p
                      className={`text-xs font-bold uppercase tracking-widest mt-4 ${isDark ? "text-slate-400" : "text-slate-600"}`}
                    >
                      Un partenariat pour transformer
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Text Right */}
            <div className="space-y-6">
              <h3
                className={`text-2xl md:text-3xl font-black ${isDark ? "text-white" : "text-slate-900"}`}
              >
                {t.section1_title}
              </h3>
              <p
                className={`text-lg leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}
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
          </div>
        </div>
      </section>

      {/* Better Life Organization Section - Image Right */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Left */}
          <div className="space-y-6">
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

          {/* Image Right */}
          <div className="relative">
            <div
              className={`absolute -inset-4 rounded-3xl blur-2xl opacity-20 bg-blue-500`}
            />
            <div
              className={`relative rounded-xl md:rounded-2xl border overflow-hidden ${isDark ? "border-white/10" : "border-slate-200"}`}
            >
              <img
                src="/images/villa-placeholder.svg"
                alt="Better Life Organization"
                className="w-full h-[400px] object-cover"
              />
            </div>
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
