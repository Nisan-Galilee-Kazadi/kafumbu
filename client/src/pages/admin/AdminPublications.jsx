import { useState, useEffect } from 'react';
import { FiTrash2, FiPlus, FiCheck } from 'react-icons/fi';
import { newsService } from '../../services/adminService';

export default function AdminPublications() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', slug: '', excerpt: '', status: 'draft', category: 'actualité' });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const data = await newsService.getAll();
      setNews(data);
    } catch (err) {
      console.error('Failed to fetch news:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      await newsService.create(formData);
      setFormData({ title: '', content: '', slug: '', excerpt: '', status: 'draft', category: 'actualité' });
      setShowForm(false);
      fetchNews();
    } catch (err) {
      console.error('Failed to create news:', err);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Etes-vous sur?')) {
      try {
        await newsService.delete(id);
        fetchNews();
      } catch (err) {
        console.error('Failed to delete news:', err);
      }
    }
  };

  const handlePublish = async (id, current) => {
    try {
      const item = news.find(n => n.id === id);
      await newsService.update(id, { ...item, status: current.status === 'published' ? 'draft' : 'published' });
      fetchNews();
    } catch (err) {
      console.error('Failed to toggle publish:', err);
    }
  };

  return (
    <section className="space-y-3">
      <div className="flex justify-between">
        <p className="text-sm text-slate-400">{news.length} publications</p>
        <button onClick={() => setShowForm(!showForm)} type="button" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-500 flex items-center gap-2">
          <FiPlus size={16} /> Nouvel article
        </button>
      </div>

      {showForm && (
        <div className="border border-white/10 rounded-xl bg-[#08172B] p-4 space-y-3">
          <input type="text" placeholder="Titre" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 rounded bg-[#0B1D35] border border-white/10 text-white text-sm" />
          <input type="text" placeholder="Slug" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="w-full px-3 py-2 rounded bg-[#0B1D35] border border-white/10 text-white text-sm" />
          <input type="text" placeholder="Extrait" value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} className="w-full px-3 py-2 rounded bg-[#0B1D35] border border-white/10 text-white text-sm" />
          <textarea placeholder="Contenu" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="w-full px-3 py-2 rounded bg-[#0B1D35] border border-white/10 text-white text-sm" rows="3" />
          <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 rounded bg-[#0B1D35] border border-white/10 text-white text-sm">
            <option value="draft">Brouillon</option>
            <option value="published">Publie</option>
          </select>
          <div className="flex gap-2">
            <button onClick={handleCreate} className="flex-1 rounded bg-emerald-600 px-3 py-2 text-sm font-bold text-white hover:bg-emerald-500">
              Creer
            </button>
            <button onClick={() => setShowForm(false)} className="flex-1 rounded bg-slate-700 px-3 py-2 text-sm font-bold text-white hover:bg-slate-600">
              Annuler
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-slate-400">Chargement...</p>
      ) : (
        <>
          {news.map((item) => (
            <article key={item.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-[#0B1D35] p-4 sm:p-5">
              <div>
                <h3 className="font-bold text-white">{item.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{item.category} · {new Date(item.created_at).toLocaleDateString('fr-FR')}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handlePublish(item.id, item)} className={`rounded px-3 py-1 text-xs font-semibold ${item.status === 'published' ? 'bg-emerald-600/20 text-emerald-400' : 'bg-amber-600/20 text-amber-400'}`}>
                  {item.status === 'published' ? 'Publie' : 'Brouillon'}
                </button>
                <button onClick={() => handleDelete(item.id)} className="rounded px-3 py-1 text-xs font-semibold bg-red-600/20 text-red-400 hover:bg-red-600/30">
                  Supprimer
                </button>
              </div>
            </article>
          ))}
        </>
      )}
    </section>
  );
}

