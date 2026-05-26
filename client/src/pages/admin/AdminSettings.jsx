import { useEffect, useState } from "react";
import { FiImage, FiSave } from "react-icons/fi";
import { settingsService } from "../../services/adminService";

const GROUPS = [
  {
    title: "Identite",
    fields: [
      ["site_title", "Nom de la plateforme"],
      ["site_description", "Description"],
      ["contact_email", "Email de contact"],
      ["contact_phone", "Telephone"],
      ["headquarters_address", "Adresse"],
    ],
  },
  {
    title: "Images principales cote visiteur",
    icon: FiImage,
    fields: [
      ["home_hero_image", "Image hero accueil"],
      ["home_hero_dark_image", "Image hero sombre"],
      ["smart_city_cover", "Image Smart City"],
      ["barrage_cover", "Image Barrage"],
      ["gallery_hero_image", "Image hero galerie"],
      ["blog_hero_image", "Image hero actualites"],
    ],
  },
  {
    title: "Liens",
    fields: [
      ["social_twitter", "Twitter / X"],
      ["social_facebook", "Facebook"],
      ["social_linkedin", "LinkedIn"],
      ["brochure_url", "Brochure"],
      ["whatsapp_url", "WhatsApp"],
    ],
  },
];

export default function AdminSettings() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    settingsService.getAll().then((data) => {
      setSettings(data || {});
      setLoading(false);
    });
  }, []);

  const handleChange = (key, value) => {
    setSettings((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    for (const [key, value] of Object.entries(settings)) {
      await settingsService.update(key, value);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (loading) return <p className="text-slate-400">Chargement...</p>;

  return (
    <section className="space-y-5">
      {GROUPS.map(({ title, fields, icon: Icon }) => (
        <div key={title} className="rounded-xl border border-white/10 bg-[#0B1D35] p-5">
          <div className="mb-5 flex items-center gap-2">
            {Icon && <Icon className="text-emerald-400" />}
            <h2 className="text-lg font-black text-white">{title}</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {fields.map(([key, label]) => (
              <label key={key} className={key.includes("description") ? "md:col-span-2" : ""}>
                <span className="block text-xs font-bold uppercase tracking-wide text-slate-500">{label}</span>
                {key.includes("description") ? (
                  <textarea
                    value={settings[key] || ""}
                    onChange={(e) => handleChange(key, e.target.value)}
                    rows={3}
                    className="mt-2 w-full rounded-lg border border-white/10 bg-[#08172B] px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/50"
                  />
                ) : (
                  <input
                    value={settings[key] || ""}
                    onChange={(e) => handleChange(key, e.target.value)}
                    placeholder="https://..."
                    className="mt-2 w-full rounded-lg border border-white/10 bg-[#08172B] px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/50"
                  />
                )}
              </label>
            ))}
          </div>
        </div>
      ))}

      <button onClick={handleSave} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-500">
        <FiSave /> Enregistrer les parametres
      </button>
      {saved && <span className="ml-3 text-sm font-semibold text-emerald-400">Parametres enregistres</span>}
    </section>
  );
}
