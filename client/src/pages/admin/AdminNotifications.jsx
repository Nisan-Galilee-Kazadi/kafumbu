import { useEffect, useMemo, useState } from "react";
import { FiBell, FiCheck, FiPlus, FiTrash2 } from "react-icons/fi";
import { notificationService } from "../../services/adminService";

const emptyForm = { title: "", message: "", type: "info", status: "unread" };

export default function AdminNotifications() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);

  const unread = useMemo(
    () => items.filter((item) => item.status === "unread").length,
    [items],
  );

  const load = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getAll();
      setItems(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    if (!form.title.trim() || !form.message.trim()) return;
    await notificationService.create(form);
    setForm(emptyForm);
    load();
  };

  return (
    <section className="grid gap-5 xl:grid-cols-[360px_1fr]">
      <div className="rounded-xl border border-white/10 bg-[#0B1D35] p-5">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-black text-white">Notifications</h2>
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
            {unread} non lues
          </span>
        </div>
        <div className="space-y-3">
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Titre"
            className="w-full rounded-lg border border-white/10 bg-[#08172B] px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/50"
          />
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Message"
            rows={4}
            className="w-full rounded-lg border border-white/10 bg-[#08172B] px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/50"
          />
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="w-full rounded-lg border border-white/10 bg-[#08172B] px-3 py-2 text-sm text-white outline-none"
          >
            <option value="info">Info</option>
            <option value="success">Succes</option>
            <option value="warning">Alerte</option>
            <option value="urgent">Urgent</option>
          </select>
          <button
            onClick={create}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-500"
          >
            <FiPlus /> Ajouter
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-[#0B1D35]">
        {loading ? (
          <p className="p-5 text-slate-400">Chargement...</p>
        ) : (
          <div className="divide-y divide-white/10">
            {items.map((item) => (
              <article key={item.id} className="flex flex-wrap items-start justify-between gap-4 p-5">
                <div className="flex gap-3">
                  <span className={`mt-1 grid h-9 w-9 place-items-center rounded-lg ${item.status === "unread" ? "bg-emerald-500/15 text-emerald-400" : "bg-white/5 text-slate-500"}`}>
                    <FiBell />
                  </span>
                  <div>
                    <h3 className="font-bold text-white">{item.title}</h3>
                    <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-400">{item.message}</p>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      {item.type} · {new Date(item.created_at).toLocaleString("fr-FR")}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {item.status === "unread" && (
                    <button onClick={() => notificationService.markRead(item.id).then(load)} className="rounded-lg border border-white/10 p-2 text-emerald-400 hover:bg-emerald-500/10" title="Marquer comme lu">
                      <FiCheck />
                    </button>
                  )}
                  <button onClick={() => notificationService.delete(item.id).then(load)} className="rounded-lg border border-white/10 p-2 text-red-400 hover:bg-red-500/10" title="Supprimer">
                    <FiTrash2 />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
