import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  FiArrowRight,
  FiClock,
  FiFileText,
  FiImage,
  FiSearch,
  FiZap,
} from "react-icons/fi";
import { useLang } from "../context/LangContext";
import { extractExcerpt, searchContent, highlightText } from "../services/searchService";
import { searchPublicContent } from "../services/publicService";

const CATEGORY_ICONS = {
  Infrastructure: FiZap,
  Finance: FiImage,
  Contenu: FiImage,
  Information: FiFileText,
  Support: FiFileText,
  Pages: FiFileText,
};

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const { theme } = useLang();
  const isDark = theme === "dark";
  const [remoteResults, setRemoteResults] = useState([]);

  useEffect(() => {
    if (!query.trim()) {
      setRemoteResults([]);
      return;
    }
    searchPublicContent(query)
      .then((data) => setRemoteResults(Array.isArray(data) ? data : []))
      .catch(() => setRemoteResults([]));
  }, [query]);

  const results = useMemo(() => {
    const local = searchContent(query);
    const remote = remoteResults.map((item, index) => ({
      id: `remote-${index}`,
      title: item.title,
      path: item.path || "/",
      keywords: [],
      content: item.content || "",
      category: item.category || "Contenu",
      relevance: 75,
      occurrenceCount: 1,
      occurrences: [],
    }));
    return [...remote, ...local];
  }, [query, remoteResults]);
  const occurrenceTotal = results.reduce(
    (total, result) => total + (result.occurrenceCount || 0),
    0,
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [query]);

  return (
    <div
      data-page="search-results"
      className={`min-h-screen pt-32 pb-20 ${isDark ? "bg-[#071426] text-white" : "bg-slate-50 text-slate-900"}`}
    >
      <div className="max-w-4xl mx-auto px-4 lg:px-6">
        <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3 mb-4 text-emerald-500 font-bold tracking-widest uppercase text-xs">
            <FiSearch className="animate-pulse" />
            <span>Resultats de recherche</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            {query ? (
              <>
                Resultats pour{" "}
                <span className="text-emerald-500">"{query}"</span>
              </>
            ) : (
              "Effectuez une recherche"
            )}
          </h1>
          <p
            className={`text-lg ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            Nous avons trouve{" "}
            <span className="font-bold text-emerald-500">{results.length}</span>{" "}
            page{results.length > 1 ? "s" : ""} et{" "}
            <span className="font-bold text-emerald-500">
              {occurrenceTotal}
            </span>{" "}
            occurrence{occurrenceTotal > 1 ? "s" : ""} correspondant a votre
            recherche.
          </p>
        </div>

        <div className="space-y-6">
          {results.length > 0 ? (
            results.map((result, index) => {
              const IconComponent =
                CATEGORY_ICONS[result.category] || FiFileText;
              const excerpt = extractExcerpt(result.content, query, 180);
              const target = `${result.path}?q=${encodeURIComponent(query)}`;

              return (
                <Link
                  key={result.id}
                  to={target}
                  className={`group block w-full p-5 md:p-6 rounded-xl md:rounded-2xl border transition-all hover:translate-x-2 animate-in fade-in slide-in-from-bottom-3 duration-500 ${
                    index % 2 === 0 ? "delay-0" : "delay-100"
                  } ${
                    isDark
                      ? "bg-white/5 border-white/10 hover:border-emerald-500/50 hover:bg-white/10"
                      : "bg-white border-slate-200 hover:border-emerald-500/50 hover:shadow-xl shadow-slate-200/50"
                  }`}
                >
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`p-1.5 md:p-2 rounded-lg transition-colors shrink-0 ${isDark ? "bg-white/10 text-emerald-400 group-hover:text-emerald-300" : "bg-emerald-50 text-emerald-600 group-hover:text-emerald-700"}`}
                        >
                          <IconComponent size={16} />
                        </div>
                        <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-emerald-500">
                          {result.category}
                        </span>
                      </div>
                      <span
                        className={`text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] ${isDark ? "text-slate-500" : "text-slate-400"}`}
                      >
                        Pertinence:{" "}
                        {Math.min(
                          100,
                          Math.round((result.relevance / 90) * 100),
                        )}
                        %
                      </span>
                    </div>

                    <h3 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-emerald-500 transition-colors wrap-break-word">
                      {result.title}
                    </h3>

                    <p
                      className={`text-sm md:text-base leading-relaxed wrap-break-word ${isDark ? "text-slate-400" : "text-slate-500"}`}
                      dangerouslySetInnerHTML={{ __html: highlightText(excerpt, query) }}
                    />

                    {result.occurrences?.length > 0 && (
                      <div className="mt-5 space-y-3">
                        <div
                          className={`text-xs font-bold uppercase tracking-[0.18em] ${isDark ? "text-slate-500" : "text-slate-400"}`}
                        >
                          {result.occurrenceCount} occurrence
                          {result.occurrenceCount > 1 ? "s" : ""} trouvee
                          {result.occurrenceCount > 1 ? "s" : ""}
                        </div>
                        <div className="space-y-2">
                          {result.occurrences.map(
                            (occurrence, occurrenceIndex) => (
                              <div
                                key={`${result.id}-${occurrence.field}-${occurrence.index}-${occurrenceIndex}`}
                                className={`block rounded-lg md:rounded-xl border px-4 py-3 text-sm transition hover:border-emerald-500/60 ${
                                  isDark
                                    ? "border-white/10 bg-white/3 text-slate-300 hover:bg-white/10"
                                    : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-emerald-50"
                                }`}
                              >
                                <span className="mb-1 block text-[10px] font-black uppercase tracking-[0.16em] text-emerald-500">
                                  {occurrence.label}
                                </span>
                                <span 
                                  className="block wrap-break-word leading-relaxed"
                                  dangerouslySetInnerHTML={{ __html: highlightText(occurrence.excerpt, query) }}
                                />
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                    <div
                      className="mt-4 flex items-center text-emerald-500 opacity-0 group-hover:opacity-100 transition-all"
                      aria-label={`Ouvrir ${result.title}`}
                    >
                      <FiArrowRight
                        className="group-hover:translate-x-2 transition-transform"
                        size={16}
                      />
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div
              className={`p-12 text-center rounded-xl md:rounded-2xl border-2 border-dashed animate-in fade-in duration-500 ${isDark ? "border-white/10 text-slate-500" : "border-slate-200 text-slate-400"}`}
            >
              <FiSearch size={48} className="mx-auto mb-4 opacity-20" />
              <p className="text-xl font-bold mb-2">Aucun resultat trouve</p>
              <p>Essayez avec d'autres mots-cles ou verifiez l'orthographe.</p>
              <div
                className="mt-6 pt-6 border-t"
                style={{
                  borderColor: isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.1)",
                }}
              >
                <p
                  className={`text-sm mb-4 ${isDark ? "text-slate-500" : "text-slate-600"}`}
                >
                  Suggestions de recherche:
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    "Barrage",
                    "Smart City",
                    "Investissement",
                    "Financement",
                  ].map((suggestion) => (
                    <Link
                      key={suggestion}
                      to={`/search-results?q=${encodeURIComponent(suggestion)}`}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-all hover:scale-105 ${
                        isDark
                          ? "bg-white/10 text-emerald-400 hover:bg-white/20"
                          : "bg-slate-100 text-emerald-600 hover:bg-slate-200"
                      }`}
                    >
                      {suggestion}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div
          className={`mt-20 p-8 rounded-xl md:rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-700 ${isDark ? "bg-white/5" : "bg-white shadow-xl shadow-slate-200/50"}`}
        >
          <div className="flex items-start gap-4">
            <FiClock
              className="text-emerald-500 flex-shrink-0 mt-1"
              size={24}
            />
            <div className="flex-1">
              <h4 className="text-lg font-bold mb-2">Besoin d'aide ?</h4>
              <p
                className={`text-sm mb-4 ${isDark ? "text-slate-400" : "text-slate-500"}`}
              >
                Si vous ne trouvez pas ce que vous cherchez, contactez notre
                equipe d'assistance.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-emerald-500 font-bold hover:gap-4 transition-all group"
              >
                Nous contacter{" "}
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
