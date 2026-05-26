import { useSearchParams } from "react-router-dom";
import { useEffect, useRef } from "react";

/**
 * Composant global qui applique la surbrillance du texte de recherche
 * à travers toute l'application - Fonctionne comme JW Library
 */
export function SearchHighlightProvider({ children }) {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const highlightedNodesRef = useRef(new Set());

  const normalizeText = (text) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  useEffect(() => {
    // Nettoyer les highlights précédents
    highlightedNodesRef.current.forEach((mark) => {
      const parent = mark.parentNode;
      if (parent) {
        while (mark.firstChild) {
          parent.insertBefore(mark.firstChild, mark);
        }
        parent.removeChild(mark);
        parent.normalize();
      }
    });
    highlightedNodesRef.current.clear();

    if (!query || query.trim().length === 0) return;

    const highlightMatches = () => {
      const normalizedQuery = normalizeText(query).trim();
      const words = normalizedQuery.split(/\s+/).filter((w) => w.length > 0);

      if (words.length === 0) return;

      // Créer des regex pour chaque mot
      const wordRegexes = words.map((word) => ({
        original: word,
        regex: new RegExp(
          `(${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
          "gi",
        ),
        normalizedRegex: new RegExp(word, "i"),
      }));

      // Exclure les zones: nav, footer, search-results page
      const isExcludedZone = (node) => {
        let parent = node.parentElement;
        while (parent) {
          // Exclure header/nav
          if (parent.tagName === "HEADER" || parent.tagName === "NAV")
            return true;
          // Exclure footer
          if (parent.tagName === "FOOTER") return true;
          // Exclure la page search-results
          if (parent.getAttribute("data-page") === "search-results")
            return true;
          const className = parent.getAttribute("class");
          if (className && className.includes("search-results-page"))
            return true;
          parent = parent.parentElement;
        }
        return false;
      };

      const processNode = (node) => {
        // Ignorer SEULEMENT les éléments techniques
        if (
          node.nodeType === Node.ELEMENT_NODE &&
          (node.tagName === "SCRIPT" ||
            node.tagName === "STYLE" ||
            node.tagName === "MARK" ||
            node.tagName === "INPUT" ||
            node.tagName === "TEXTAREA" ||
            node.tagName === "HEADER" ||
            node.tagName === "NAV" ||
            node.tagName === "FOOTER")
        ) {
          return;
        }

        // Exclure les zones spécifiques
        if (isExcludedZone(node)) {
          return;
        }

        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent;

          // Vérifier si le texte contient l'un des mots
          let hasMatch = false;
          for (const { normalizedRegex } of wordRegexes) {
            if (normalizedRegex.test(normalizeText(text))) {
              hasMatch = true;
              break;
            }
          }

          if (hasMatch) {
            const span = document.createElement("span");
            let html = text
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;");

            // Appliquer les highlights pour chaque mot
            wordRegexes.forEach(({ regex }) => {
              html = html.replace(
                regex,
                '<mark class="bg-emerald-400 text-slate-900 font-bold px-0.5 rounded shadow-sm" style="box-shadow: 0 0 8px rgba(52,211,153,0.5); animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;">$1</mark>',
              );
            });

            span.innerHTML = html;
            node.parentNode.replaceChild(span, node);

            // Ajouter les marks à la liste pour nettoyage ultérieur
            span.querySelectorAll("mark").forEach((mark) => {
              highlightedNodesRef.current.add(mark);
            });
          }
        } else {
          // Traiter les enfants
          for (let child of node.childNodes) {
            processNode(child);
          }
        }
      };

      // Commencer le traitement depuis le body
      processNode(document.body);

      // Scroller vers le premier résultat uniquement s'il y a un highlight
      const firstHighlight = document.querySelector("mark");
      if (firstHighlight) {
        setTimeout(() => {
          firstHighlight.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          
          // Faire disparaître progressivement la surbrillance après 3 secondes
          setTimeout(() => {
            document.querySelectorAll("mark").forEach(mark => {
              mark.style.transition = "all 1.5s ease-out";
              mark.style.backgroundColor = "transparent";
              mark.style.color = "inherit";
              mark.style.boxShadow = "none";
            });
          }, 3000);
          
        }, 100);
      }
    };

    // Attendre que le DOM soit prêt (pages React qui chargent du contenu)
    const timer = setTimeout(highlightMatches, 300);
    const observer = new MutationObserver(() => {
      clearTimeout(timer);
      const newTimer = setTimeout(highlightMatches, 200);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: false,
    });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [query]);

  return children;
}

export default SearchHighlightProvider;
