import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { adminSearchService } from "../../services/adminService";

const typeLinks = {
  user: "/admin/utilisateurs",
  campaign: "/admin/campagnes",
  news: "/admin/publications",
  media: "/admin/media",
};

export default function AdminSearch() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = params.get("q") || "";
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setQuery(q);
    setLoading(true);
    adminSearchService.search(q).then((data) => {
      setResults(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, [params]);

  const submit = (event) => {
    event.preventDefault();
    setParams({ q: query });
  };

  return (
    <section className="space-y-5">
      <form onSubmit={submit} className="flex gap-3 rounded-xl border border-white/10 bg-[#0B1D35] p-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher utilisateurs, campagnes, publications, medias..."
            className="w-full rounded-lg border border-white/10 bg-[#08172B] py-3 pl-10 pr-3 text-sm text-white outline-none focus:border-emerald-500/50"
          />
        </div>
        <button className="rounded-lg bg-emerald-600 px-5 text-sm font-bold text-white hover:bg-emerald-500">
          Chercher
        </button>
      </form>

      <div className="rounded-xl border border-white/10 bg-[#0B1D35]">
        {loading ? (
          <p className="p-5 text-slate-400">Recherche...</p>
        ) : results.length === 0 ? (
          <p className="p-5 text-slate-400">Aucun resultat pour le moment.</p>
        ) : (
          <div className="divide-y divide-white/10">
            {results.map((item, index) => (
              <Link key={`${item.type}-${item.id}-${index}`} to={typeLinks[item.type] || "/admin/dashboard"} className="block p-5 hover:bg-white/[0.03]">
                <span className="text-xs font-black uppercase tracking-widest text-emerald-400">{item.type}</span>
                <h3 className="mt-1 font-bold text-white">{item.title}</h3>
                <p className="mt-1 text-sm text-slate-400">{item.subtitle || "Sans detail"}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
