import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

/**
 * HOC pour ajouter la surbrillance du texte de recherche sur n'importe quelle page
 */
export function withSearchHighlight(Component) {
  return function HighlightedComponent(props) {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q");

    useEffect(() => {
      if (!query) return;

      const normalizedQuery = query
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

      const words = normalizedQuery.split(/\s+/).filter((w) => w.length > 0);
      if (words.length === 0) return;

      const highlightMatches = () => {
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
          null,
          false,
        );

        const nodesToProcess = [];
        let node;

        while ((node = walker.nextNode())) {
          // Ignorer les éléments de navigation, scripts, etc.
          if (
            node.parentElement?.closest("nav") ||
            node.parentElement?.closest("header") ||
            node.parentElement?.closest("script") ||
            node.parentElement?.closest("style") ||
            node.parentElement?.tagName === "MARK"
          ) {
            continue;
          }

          words.forEach((word) => {
            const regex = new RegExp(
              `(${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
              "gi",
            );
            if (regex.test(node.textContent)) {
              nodesToProcess.push({ node, word });
            }
          });
        }

        // Traiter les nœuds en évitant de modifier les marques existantes
        nodesToProcess.forEach(({ node, word }) => {
          if (node.parentElement?.tagName === "MARK") return;

          const span = document.createElement("span");
          const regex = new RegExp(
            `(${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
            "gi",
          );

          span.innerHTML = node.textContent.replace(
            regex,
            '<mark class="bg-yellow-300 font-bold text-slate-900 px-0.5 rounded animate-pulse">$1</mark>',
          );

          node.parentNode.replaceChild(span, node);
        });
      };

      // Petit délai pour s'assurer que le DOM est prêt
      const timer = setTimeout(highlightMatches, 100);
      return () => clearTimeout(timer);
    }, [query]);

    return <Component {...props} />;
  };
}

export default withSearchHighlight;
