import { useState, useEffect } from "react";
import { FiTrash2, FiPlus, FiImage } from "react-icons/fi";
import { mediaService } from "../../services/adminService";

export default function AdminMedia() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    filename: "",
    file_path: "",
    file_type: "image",
    mime_type: "image/jpeg",
    file_size: 0,
    title: "",
    alt_text: "",
    description: "",
  });

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const data = await mediaService.getAll();
      setMedia(data);
    } catch (err) {
      console.error("Failed to fetch media:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Etes-vous sur?")) {
      try {
        await mediaService.delete(id);
        fetchMedia();
      } catch (err) {
        console.error("Failed to delete media:", err);
      }
    }
  };

  const handleCreate = async () => {
    await mediaService.create({
      ...form,
      filename: form.filename || form.file_path.split("/").pop() || "media",
    });
    setForm({ filename: "", file_path: "", file_type: "image", mime_type: "image/jpeg", file_size: 0, title: "", alt_text: "", description: "" });
    setShowForm(false);
    fetchMedia();
  };

  return (
    <section className="space-y-4">
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0B1D35]">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 p-4 sm:p-5">
        <p className="text-sm text-slate-400">{media.length} medias</p>
        <button onClick={() => setShowForm(!showForm)} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-500 flex items-center gap-2">
          <FiPlus size={16} /> Uploader
        </button>
      </div>
      {showForm && (
        <div className="grid gap-3 border-b border-white/10 p-4 md:grid-cols-2">
          {[
            ["title", "Titre"],
            ["file_path", "URL du media"],
            ["filename", "Nom fichier"],
            ["alt_text", "Texte alternatif"],
          ].map(([key, label]) => (
            <input key={key} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} placeholder={label} className="rounded-lg border border-white/10 bg-[#08172B] px-3 py-2 text-sm text-white outline-none" />
          ))}
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="rounded-lg border border-white/10 bg-[#08172B] px-3 py-2 text-sm text-white outline-none md:col-span-2" />
          <button onClick={handleCreate} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-500 md:col-span-2">Ajouter le media</button>
        </div>
      )}

      {loading ? (
        <p className="p-4 text-slate-400">Chargement...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-white/10 bg-[#08172B] text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Nom</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Taille</th>
                <th className="px-4 py-3">Uploader</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {media.map((item) => (
                <tr
                  key={item.id}
                  className="text-slate-300 hover:bg-white/[0.03]"
                >
                  <td className="px-4 py-3 font-semibold text-white flex items-center gap-2">
                    <FiImage size={16} className="text-slate-500" />
                    {item.filename}
                  </td>
                  <td className="px-4 py-3 text-slate-400">{item.file_type}</td>
                  <td className="px-4 py-3 text-slate-400">
                    {(item.file_size / 1024).toFixed(2)} KB
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {item.uploaded_by_name || "Admin"}
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </section>
  );
}
