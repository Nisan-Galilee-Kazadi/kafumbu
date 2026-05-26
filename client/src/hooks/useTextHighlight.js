import { useEffect, useRef } from "react";

/**
 * Hook pour mettre en surbrillance le texte de recherche dans un élément DOM
 */
export function useTextHighlight(query, enabled = true) {
  const contentRef = useRef(null);

  useEffect(() => {
    if (!enabled || !query || !contentRef.current) return;

    const normalizedQuery = query
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

    const words = normalizedQuery.split(/\s+/).filter((w) => w.length > 0);
    if (words.length === 0) return;

    const element = contentRef.current;
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
      false,
    );

    const nodesToReplace = [];
    let node;

    // Parcourir tous les nœuds de texte
    while ((node = walker.nextNode())) {
      words.forEach((word) => {
        const regex = new RegExp(
          `(${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
          "gi",
        );
        if (regex.test(node.textContent)) {
          nodesToReplace.push({
            node,
            text: node.textContent,
            word: word,
          });
        }
      });
    }

    // Remplacer les nœuds avec du HTML surligné
    nodesToReplace.forEach(({ node, text, word }) => {
      const span = document.createElement("span");
      const regex = new RegExp(
        `(${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
        "gi",
      );

      span.innerHTML = text.replace(
        regex,
        '<mark class="bg-yellow-300 font-bold text-slate-900 px-1 rounded animate-pulse">$1</mark>',
      );

      node.parentNode.replaceChild(span, node);
    });
  }, [query, enabled]);

  return contentRef;
}

export default useTextHighlight;
