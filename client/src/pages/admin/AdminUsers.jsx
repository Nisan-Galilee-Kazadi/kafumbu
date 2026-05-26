import { useEffect, useMemo, useState } from "react";
import { FiEdit2, FiMessageSquare, FiPlus, FiSave, FiSearch, FiTrash2, FiX } from "react-icons/fi";
import { userService } from "../../services/adminService";

const emptyUser = {
  name: "",
  email: "",
  password: "User@123",
  role: "visitor",
  tier: "none",
  company: "",
  phone: "",
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState(emptyUser);
  const [showCreate, setShowCreate] = useState(false);
  const [newUser, setNewUser] = useState(emptyUser);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAll();
      setUsers(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return users.filter((user) => {
      const matchesRole = role === "all" || user.role === role;
      const matchesQuery =
        !q ||
        [user.name, user.email, user.company, user.phone, user.tier]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(q));
      return matchesRole && matchesQuery;
    });
  }, [users, query, role]);

  const saveEdit = async () => {
    await userService.update(editingId, editData);
    setEditingId(null);
    fetchUsers();
  };

  const createUser = async () => {
    await userService.create(newUser);
    setNewUser(emptyUser);
    setShowCreate(false);
    fetchUsers();
  };

  const deleteUser = async (id) => {
    if (!confirm("Supprimer cet utilisateur et toute sa messagerie ?")) return;
    await userService.delete(id);
    fetchUsers();
  };

  const deleteUserMessages = async (id) => {
    if (!confirm("Effacer uniquement la messagerie de cet utilisateur ?")) return;
    await userService.deleteMessages(id);
  };

  const cleanupUsers = async () => {
    if (!confirm("Supprimer tous les visiteurs, les admins secondaires et leurs messageries ?")) return;
    await userService.cleanupNonPrimary();
    fetchUsers();
  };

  return (
    <section className="space-y-4">
      <div className="rounded-xl border border-white/10 bg-[#0B1D35] p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[240px] flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nom, email, entreprise, telephone..."
              className="w-full rounded-lg border border-white/10 bg-[#08172B] py-2.5 pl-10 pr-3 text-sm text-white outline-none focus:border-emerald-500/50"
            />
          </div>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="rounded-lg border border-white/10 bg-[#08172B] px-3 py-2.5 text-sm text-white outline-none">
            <option value="all">Tous les roles</option>
            <option value="admin">Admins</option>
            <option value="visitor">Visiteurs</option>
          </select>
          <button onClick={() => setShowCreate(true)} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-500">
            <FiPlus /> Ajouter
          </button>
          <button onClick={cleanupUsers} className="inline-flex items-center gap-2 rounded-lg border border-red-500/30 px-4 py-2.5 text-sm font-bold text-red-300 hover:bg-red-500/10">
            <FiTrash2 /> Nettoyer
          </button>
        </div>
        <p className="mt-3 text-sm text-slate-400">{filtered.length} utilisateur(s) affiche(s) sur {users.length}</p>
      </div>

      {showCreate && (
        <UserForm
          title="Nouvel utilisateur"
          data={newUser}
          setData={setNewUser}
          onSave={createUser}
          onCancel={() => setShowCreate(false)}
        />
      )}

      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0B1D35]">
        {loading ? (
          <p className="p-5 text-slate-400">Chargement...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b border-white/10 bg-[#08172B] text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Nom</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Tier</th>
                  <th className="px-4 py-3">Entreprise</th>
                  <th className="px-4 py-3">Telephone</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((user) => {
                  const isEditing = editingId === user.id;
                  const row = isEditing ? editData : user;
                  return (
                    <tr key={user.id} className="text-slate-300 hover:bg-white/[0.03]">
                      {["name", "email", "role", "tier", "company", "phone"].map((field) => (
                        <td key={field} className="px-4 py-3">
                          {isEditing ? (
                            field === "role" || field === "tier" ? (
                              <select value={row[field] || ""} onChange={(e) => setEditData({ ...editData, [field]: e.target.value })} className="w-full rounded border border-white/10 bg-[#08172B] px-2 py-1 text-white">
                                {(field === "role" ? ["admin", "visitor"] : ["none", "citizen", "bronze", "silver", "gold"]).map((value) => (
                                  <option key={value} value={value}>{value}</option>
                                ))}
                              </select>
                            ) : (
                              <input value={row[field] || ""} onChange={(e) => setEditData({ ...editData, [field]: e.target.value })} className="w-full rounded border border-white/10 bg-[#08172B] px-2 py-1 text-white" />
                            )
                          ) : (
                            <span className={field === "name" ? "font-semibold text-white" : ""}>{row[field] || "-"}</span>
                          )}
                        </td>
                      ))}
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {isEditing ? (
                            <>
                              <button onClick={saveEdit} className="rounded p-2 text-emerald-400 hover:bg-emerald-500/10"><FiSave /></button>
                              <button onClick={() => setEditingId(null)} className="rounded p-2 text-slate-400 hover:bg-white/10"><FiX /></button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => { setEditingId(user.id); setEditData(user); }} className="rounded p-2 text-blue-400 hover:bg-blue-500/10"><FiEdit2 /></button>
                              <button onClick={() => deleteUserMessages(user.id)} title="Effacer la messagerie" className="rounded p-2 text-amber-300 hover:bg-amber-500/10"><FiMessageSquare /></button>
                              <button onClick={() => deleteUser(user.id)} className="rounded p-2 text-red-400 hover:bg-red-500/10"><FiTrash2 /></button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

function UserForm({ title, data, setData, onSave, onCancel }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#0B1D35] p-4">
      <h3 className="mb-4 font-bold text-white">{title}</h3>
      <div className="grid gap-3 md:grid-cols-2">
        {["name", "email", "password", "company", "phone"].map((field) => (
          <input
            key={field}
            type={field === "password" ? "text" : "text"}
            value={data[field] || ""}
            onChange={(e) => setData({ ...data, [field]: e.target.value })}
            placeholder={field}
            className="rounded-lg border border-white/10 bg-[#08172B] px-3 py-2 text-sm text-white outline-none"
          />
        ))}
        <select value={data.role} onChange={(e) => setData({ ...data, role: e.target.value })} className="rounded-lg border border-white/10 bg-[#08172B] px-3 py-2 text-sm text-white outline-none">
          <option value="visitor">visitor</option>
          <option value="admin">admin</option>
        </select>
        <select value={data.tier} onChange={(e) => setData({ ...data, tier: e.target.value })} className="rounded-lg border border-white/10 bg-[#08172B] px-3 py-2 text-sm text-white outline-none">
          {["none", "citizen", "bronze", "silver", "gold"].map((value) => <option key={value} value={value}>{value}</option>)}
        </select>
      </div>
      <div className="mt-4 flex gap-2">
        <button onClick={onSave} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-500">Enregistrer</button>
        <button onClick={onCancel} className="rounded-lg border border-white/10 px-4 py-2 text-sm font-bold text-slate-300 hover:bg-white/5">Annuler</button>
      </div>
    </div>
  );
}
