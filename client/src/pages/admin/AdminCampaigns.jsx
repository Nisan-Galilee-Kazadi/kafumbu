import { useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiSave, FiTrash2, FiX } from "react-icons/fi";
import { campaignService } from "../../services/adminService";

const emptyCampaign = {
  title: "",
  description: "",
  slug: "",
  status: "draft",
  goal_amount: 0,
  current_amount: 0,
  start_date: "",
  end_date: "",
  image_url: "",
  category: "",
};

export default function AdminCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyCampaign);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await campaignService.getAll();
    setCampaigns(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (editingId) {
      await campaignService.update(editingId, form);
    } else {
      await campaignService.create(form);
    }
    setForm(emptyCampaign);
    setEditingId(null);
    setShowForm(false);
    load();
  };

  const edit = (campaign) => {
    setEditingId(campaign.id);
    setForm({
      ...emptyCampaign,
      ...campaign,
      start_date: String(campaign.start_date || "").slice(0, 10),
      end_date: String(campaign.end_date || "").slice(0, 10),
    });
    setShowForm(true);
  };

  const remove = async (id) => {
    if (!confirm("Supprimer cette campagne ?")) return;
    await campaignService.delete(id);
    load();
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0B1D35] p-4">
        <p className="text-sm text-slate-400">{campaigns.length} campagne(s)</p>
        <button onClick={() => { setForm(emptyCampaign); setEditingId(null); setShowForm(true); }} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-500">
          <FiPlus /> Nouvelle campagne
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl border border-white/10 bg-[#0B1D35] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-white">{editingId ? "Modifier la campagne" : "Nouvelle campagne"}</h2>
            <button onClick={() => setShowForm(false)} className="text-slate-400"><FiX /></button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Titre" value={form.title} onChange={(value) => setForm({ ...form, title: value })} />
            <Field label="Slug" value={form.slug} onChange={(value) => setForm({ ...form, slug: value })} />
            <Field label="Categorie" value={form.category || ""} onChange={(value) => setForm({ ...form, category: value })} />
            <Field label="Image URL" value={form.image_url || ""} onChange={(value) => setForm({ ...form, image_url: value })} />
            <Field label="Objectif" type="number" value={form.goal_amount || 0} onChange={(value) => setForm({ ...form, goal_amount: Number(value) })} />
            <Field label="Collecte" type="number" value={form.current_amount || 0} onChange={(value) => setForm({ ...form, current_amount: Number(value) })} />
            <Field label="Debut" type="date" value={form.start_date || ""} onChange={(value) => setForm({ ...form, start_date: value })} />
            <Field label="Fin" type="date" value={form.end_date || ""} onChange={(value) => setForm({ ...form, end_date: value })} />
            <label>
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Statut</span>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="mt-2 w-full rounded-lg border border-white/10 bg-[#08172B] px-3 py-2 text-sm text-white">
                {["draft", "active", "completed", "archived"].map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>
            <label className="md:col-span-2">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Description</span>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="mt-2 w-full rounded-lg border border-white/10 bg-[#08172B] px-3 py-2 text-sm text-white" />
            </label>
          </div>
          <button onClick={save} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-500">
            <FiSave /> Enregistrer
          </button>
        </div>
      )}

      {loading ? <p className="text-slate-400">Chargement...</p> : (
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {campaigns.map((campaign) => {
            const progress = Math.min(100, Math.round((Number(campaign.current_amount || 0) / Math.max(1, Number(campaign.goal_amount || 1))) * 100));
            return (
              <article key={campaign.id} className="overflow-hidden rounded-xl border border-white/10 bg-[#0B1D35]">
                {campaign.image_url && <img src={campaign.image_url} alt="" className="h-36 w-full object-cover" />}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-bold text-white">{campaign.title}</h3>
                    <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-bold uppercase text-emerald-400">{campaign.status}</span>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm text-slate-400">{campaign.description}</p>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full bg-emerald-500" style={{ width: `${progress}%` }} /></div>
                  <p className="mt-2 text-xs text-slate-400">${Number(campaign.current_amount || 0).toLocaleString()} / ${Number(campaign.goal_amount || 0).toLocaleString()}</p>
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => edit(campaign)} className="flex-1 rounded-lg border border-white/10 py-2 text-sm font-semibold text-blue-300 hover:bg-blue-500/10"><FiEdit2 className="mx-auto" /></button>
                    <button onClick={() => remove(campaign.id)} className="flex-1 rounded-lg border border-white/10 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/10"><FiTrash2 className="mx-auto" /></button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function Field({ label, value, onChange, type = "text" }) {
  return (
    <label>
      <span className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="mt-2 w-full rounded-lg border border-white/10 bg-[#08172B] px-3 py-2 text-sm text-white" />
    </label>
  );
}
