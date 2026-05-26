/**
 * Service de recherche global pour Kafumbu
 * Indexe et recherche à travers tout le contenu du site
 */

// Index de contenu pour chaque page
const SEARCH_INDEX = [
  {
    id: "home",
    title: "Accueil",
    path: "/",
    keywords: [
      "accueil",
      "home",
      "kafumbu",
      "bienvenue",
      "projet",
      "plateforme",
      "vision",
      "mission",
      "développement",
    ],
    content:
      "Bienvenue sur Kafumbu. Découvrez le projet phare du développement durable en RDC. Un projet transformateur alliant infrastructure, innovation et durabilité. Investissez dans l'avenir de la République Démocratique du Congo.",
    category: "Pages",
    icon: "FiHome",
  },
  {
    id: "smart-city",
    title: "Smart City",
    path: "/smart-city",
    keywords: [
      "smart city",
      "ville intelligente",
      "technologie",
      "innovation",
      "futuriste",
      "métropole",
      "5g",
      "iot",
      "électricité",
      "énergie renouvelable",
      "transport intelligent",
      "durabilité",
    ],
    content:
      "Smart City de Kafumbu : Une métropole futuriste pour 2 millions d'habitants. Intégrant technologie 5G, IoT, énergie renouvelable, transports intelligents et durabilité environnementale. Infrastructure de classe mondiale avec services numériques avancés. Zone économique spéciale pour entreprises technologiques. Centre financier panafricain.",
    category: "Infrastructure",
    icon: "FiBriefcase",
  },
  {
    id: "barrage",
    title: "Grand Barrage de Kafumbu",
    path: "/barrage",
    keywords: [
      "barrage",
      "hydroélectrique",
      "énergie",
      "électricité",
      "construction",
      "eau",
      "infrastructure",
      "3000 mw",
      "2025",
      "15 milliards",
      "emplois",
    ],
    content:
      "Le Grand Barrage de Kafumbu est une infrastructure hydroélectrique majeure. Capable de générer 3 000 MW d'électricité renouvelable. Mise en service prévue pour 2025. Budget total estimé: 15 milliards de dollars. Système d'irrigation de 500 000 hectares. Centre de recherche en énergies renouvelables. Création de 50 000 emplois.",
    category: "Infrastructure",
    icon: "FiZap",
  },
  {
    id: "investir",
    title: "Opportunités d'Investissement",
    path: "/investir",
    keywords: [
      "investir",
      "investissement",
      "opportunité",
      "retour",
      "rendement",
      "finance",
      "économique",
    ],
    content:
      "Investissez dans le projet Kafumbu et bénéficiez de rendements exceptionnels. Rendement annuel garanti de 12-18%. Secteurs: Énergie, Immobilier, Tourisme, Technologie.",
    category: "Finance",
    icon: "FiTrendingUp",
  },
  {
    id: "financement",
    title: "Financement du Projet",
    path: "/financement",
    keywords: [
      "financement",
      "budget",
      "coût",
      "investissement",
      "fonds",
      "capital",
    ],
    content:
      "Le projet Kafumbu requiert un budget total de $50 milliards. Répartition: Infrastructure 60%, Smart City 25%, Technologie 15%. Financement via emprunts internationaux et investissements privés.",
    category: "Finance",
    icon: "FiDollarSign",
  },
  {
    id: "fundraising",
    title: "Levée de Fonds",
    path: "/levée-de-fonds",
    keywords: [
      "levée de fonds",
      "crowdfunding",
      "contribution",
      "financement participatif",
      "campagne",
    ],
    content:
      "Participez à notre levée de fonds. Plusieurs campagnes actives pour différents projets. Investissement minimum: $1000. Transparence totale sur l'utilisation des fonds.",
    category: "Finance",
    icon: "FiTarget",
  },
  {
    id: "medias",
    title: "Médias et Galerie",
    path: "/medias/blog",
    keywords: [
      "médias",
      "blog",
      "actualités",
      "news",
      "article",
      "galerie",
      "photos",
      "images",
      "vidéo",
    ],
    content:
      "Dernières actualités et photos du projet Kafumbu. Galerie photos du chantier. Articles détaillés sur la progression du projet. Vidéos de drone des sites de construction.",
    category: "Contenu",
    icon: "FiImage",
  },
  {
    id: "transparence",
    title: "Transparence et Rapports",
    path: "/transparence",
    keywords: [
      "transparence",
      "rapport",
      "rapports financiers",
      "audit",
      "compliance",
      "gouvernance",
    ],
    content:
      "Rapports de transparence mensuels. Audits financiers réguliers. Informations détaillées sur l'utilisation des fonds. Gouvernance transparente. Engagement ESG.",
    category: "Information",
    icon: "FiEye",
  },
  {
    id: "partenaires",
    title: "Partenaires",
    path: "/partenaires",
    keywords: [
      "partenaires",
      "partenariat",
      "collaboration",
      "alliés",
      "entreprises",
      "organisations",
    ],
    content:
      "Nos partenaires stratégiques incluent des entreprises Fortune 500, institutions internationales, et gouvernements. Collaboration avec des experts mondiaux en infrastructure.",
    category: "Information",
    icon: "FiUsers",
  },
  {
    id: "contact",
    title: "Contactez-nous",
    path: "/contact",
    keywords: [
      "contact",
      "nous contacter",
      "communication",
      "email",
      "téléphone",
      "assistance",
      "support",
    ],
    content:
      "Formulaire de contact pour toute question. Email: contact@kafumbu.cd. Téléphone: +243 XXX XXX XXX. Équipe disponible 24/7 pour votre assistance.",
    category: "Support",
    icon: "FiMail",
  },
];

/**
 * Normalise un texte pour la recherche (enlève accents, minuscules)
 */
function normalizeText(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getQueryWords(query) {
  return normalizeText(query).split(/\s+/).filter((w) => w.length > 0);
}

function buildOccurrenceExcerpt(text, index, wordLength, maxLength = 170) {
  const value = String(text || "");
  const start = Math.max(0, index - 60);
  const end = Math.min(value.length, index + wordLength + maxLength - 60);
  const prefix = start > 0 ? "..." : "";
  const suffix = end < value.length ? "..." : "";

  return `${prefix}${value.substring(start, end)}${suffix}`;
}

function findFieldOccurrences({ text, field, label, words }) {
  const normalizedText = normalizeText(text);
  const seen = new Set();
  const occurrences = [];

  words.forEach((word) => {
    let index = normalizedText.indexOf(word);

    while (index !== -1) {
      const key = `${field}:${word}:${index}`;

      if (!seen.has(key)) {
        occurrences.push({
          field,
          label,
          term: word,
          index,
          excerpt: buildOccurrenceExcerpt(text, index, word.length),
        });
        seen.add(key);
      }

      index = normalizedText.indexOf(word, index + Math.max(1, word.length));
    }
  });

  return occurrences;
}

function findOccurrences(query, item) {
  const words = getQueryWords(query);

  if (words.length === 0) return [];

  return [
    ...findFieldOccurrences({
      text: item.title,
      field: "title",
      label: "Titre",
      words,
    }),
    ...findFieldOccurrences({
      text: item.content,
      field: "content",
      label: "Contenu",
      words,
    }),
    ...item.keywords.flatMap((keyword) =>
      findFieldOccurrences({
        text: keyword,
        field: "keyword",
        label: "Mot-clé",
        words,
      }),
    ),
  ];
}

/**
 * Calcule le score de pertinence d'une recherche
 */
function calculateRelevance(query, item) {
  const normalizedQuery = normalizeText(query);
  const words = getQueryWords(query);

  let score = 0;
  let matches = 0;

  words.forEach((word) => {
    // Vérifier dans le titre (bonus +50)
    if (normalizeText(item.title).includes(word)) {
      score += 50;
      matches++;
    }

    // Vérifier dans les mots-clés (bonus +30)
    if (item.keywords.some((k) => normalizeText(k).includes(word))) {
      score += 30;
      matches++;
    }

    // Vérifier dans le contenu (bonus +10)
    if (normalizeText(item.content).includes(word)) {
      score += 10;
      matches++;
    }
  });

  return { score, matches, query: normalizedQuery };
}

/**
 * Recherche dans l'index
 */
export function searchContent(query) {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const results = SEARCH_INDEX.map((item) => {
    const relevance = calculateRelevance(query, item);
    const occurrences = findOccurrences(query, item);

    return {
      ...item,
      relevance: relevance.score,
      matches: relevance.matches,
      occurrenceCount: occurrences.length,
      occurrences,
      searchQuery: relevance.query,
    };
  })
    .filter((item) => item.relevance > 0 || item.occurrenceCount > 0)
    .sort((a, b) => {
      if (b.relevance !== a.relevance) return b.relevance - a.relevance;
      return b.occurrenceCount - a.occurrenceCount;
    });

  return results;
}

/**
 * Surligne le texte de recherche dans une chaîne
 */
export function highlightText(text, query) {
  if (!query || !text) return text;

  const words = getQueryWords(query);

  if (words.length === 0) return text;

  // Créer un regex qui cherche les mots (case-insensitive et sans accents)
  let highlightedText = text;

  words.forEach((word) => {
    // Regex pour chercher le mot avec ou sans accents
    const regex = new RegExp(`(${escapeRegExp(word)})`, "gi");
    highlightedText = highlightedText.replace(
      regex,
      (match) =>
        `<mark class="bg-emerald-400 font-bold text-slate-900 px-1 rounded shadow-sm">${match}</mark>`,
    );
  });

  return highlightedText;
}

/**
 * Extrait et met en avant un extrait du contenu
 */
export function extractExcerpt(text, query, maxLength = 150) {
  if (!text) return "";

  const words = getQueryWords(query);

  if (words.length === 0) {
    return (
      text.substring(0, maxLength) + (text.length > maxLength ? "..." : "")
    );
  }

  // Chercher la première occurrence d'un mot
  const normalizedText = normalizeText(text);
  let startIndex = 0;

  for (const word of words) {
    const index = normalizedText.indexOf(word);
    if (index !== -1) {
      startIndex = Math.max(0, index - 50);
      break;
    }
  }

  const excerpt = text.substring(startIndex, startIndex + maxLength);
  const prefix = startIndex > 0 ? "..." : "";
  const suffix = startIndex + maxLength < text.length ? "..." : "";

  return prefix + excerpt + suffix;
}

/**
 * Retourne l'index complet (pour le debugging)
 */
export function getSearchIndex() {
  return SEARCH_INDEX;
}

export default {
  searchContent,
  highlightText,
  extractExcerpt,
  getSearchIndex,
};
