import "dotenv/config";
import pool from "../src/database.js";

const settings = [
  ["home_hero_image", "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1600", "string"],
  ["home_hero_dark_image", "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80&w=1600", "string"],
  ["smart_city_cover", "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&q=80&w=1600", "string"],
  ["barrage_cover", "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80&w=1600", "string"],
  ["gallery_hero_image", "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=1600", "string"],
  ["blog_hero_image", "https://images.unsplash.com/photo-1454165833762-026522f22143?auto=format&fit=crop&q=80&w=1600", "string"],
  ["whatsapp_url", "https://wa.me/243000000000", "string"],
  ["brochure_url", "/brochure-kafumbu.pdf", "string"],
];

const news = [
  {
    title: "Kafumbu Smart City consolide sa feuille de route",
    slug: "kafumbu-smart-city-feuille-de-route",
    excerpt: "Les priorites techniques, sociales et environnementales du projet sont structurees pour la prochaine phase.",
    content: "Le programme Kafumbu Smart City avance avec une feuille de route centree sur les infrastructures essentielles, la gouvernance transparente, l'acces a l'energie et la mobilisation des partenaires.",
    category: "actualite",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200",
  },
  {
    title: "Focus sur les infrastructures vertes",
    slug: "infrastructures-vertes-kafumbu",
    excerpt: "Le plan urbain integre espaces verts, energie propre et mobilite durable.",
    content: "Les infrastructures vertes serviront de socle au developpement urbain de Kafumbu, avec une attention particuliere pour les corridors ecologiques, la gestion de l'eau et les quartiers durables.",
    category: "blog",
    image: "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=1200",
  },
  {
    title: "Transparence: premiers indicateurs de suivi",
    slug: "transparence-indicateurs-suivi",
    excerpt: "Des indicateurs publics permettront de suivre les campagnes, medias et jalons du projet.",
    content: "La plateforme admin-public connectee a la base de donnees permettra d'afficher les campagnes, publications et medias de reference en temps reel.",
    category: "rapport",
    image: "https://images.unsplash.com/photo-1454165833762-026522f22143?auto=format&fit=crop&q=80&w=1200",
  },
];

const media = [
  ["vision-urbaine.jpg", "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200", "Vision urbaine", "Concept de quartier intelligent"],
  ["energie-propre.jpg", "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80&w=1200", "Energie propre", "Infrastructure energetique durable"],
  ["espaces-verts.jpg", "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=1200", "Espaces verts", "Amenagements naturels de la ville"],
  ["centre-affaires.jpg", "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200", "Centre d'affaires", "Zone economique et innovation"],
];

const blocks = [
  ["hero", "Vision Kafumbu", "Une ville intelligente, durable et inclusive pour connecter habitat, energie, mobilite et investissement.", "published", 1],
  ["info", "Gouvernance transparente", "Les contenus publics du site sont relies a la base en ligne afin de faciliter la mise a jour depuis l'administration.", "published", 2],
  ["media", "Medias de reference", "La galerie publique peut maintenant afficher les medias geres en base de donnees.", "published", 3],
];

async function main() {
  const conn = await pool.getConnection();
  try {
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type ENUM('info','success','warning','urgent') DEFAULT 'info',
        status ENUM('unread','read') DEFAULT 'unread',
        created_by INT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_notifications_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS site_blocks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        block_key VARCHAR(100) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        content LONGTEXT NOT NULL,
        status ENUM('draft','published','archived') DEFAULT 'published',
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    for (const [key, value, type] of settings) {
      await conn.execute(
        "INSERT INTO settings (`key`, `value`, `type`) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE value = VALUES(value), type = VALUES(type)",
        [key, value, type],
      );
    }

    for (const item of news) {
      await conn.execute(
        `INSERT INTO news (title, content, slug, excerpt, status, featured_image, category, author_id, published_at)
         VALUES (?, ?, ?, ?, 'published', ?, ?, 1, NOW())
         ON DUPLICATE KEY UPDATE title = VALUES(title), content = VALUES(content), excerpt = VALUES(excerpt), featured_image = VALUES(featured_image), category = VALUES(category), status = 'published'`,
        [item.title, item.content, item.slug, item.excerpt, item.image, item.category],
      );
    }

    for (const [filename, filePath, title, description] of media) {
      await conn.execute(
        `INSERT INTO media (filename, file_path, file_type, mime_type, file_size, alt_text, title, description, uploaded_by)
         SELECT ?, ?, 'image', 'image/jpeg', 0, ?, ?, ?, 1
         WHERE NOT EXISTS (SELECT 1 FROM media WHERE file_path = ?)`,
        [filename, filePath, title, title, description, filePath],
      );
    }

    for (const [key, title, content, status, order] of blocks) {
      await conn.execute(
        `INSERT INTO site_blocks (block_key, title, content, status, sort_order)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE title = VALUES(title), content = VALUES(content), status = VALUES(status), sort_order = VALUES(sort_order)`,
        [key, title, content, status, order],
      );
    }

    await conn.execute(
      "INSERT INTO notifications (title, message, type, status, created_by) VALUES ('Templates publics charges', 'Actualites, medias, blocs et images principales ont ete pousses dans la DB.', 'success', 'unread', 1)",
    );

    const [counts] = await conn.query(`
      SELECT
        (SELECT COUNT(*) FROM news) AS news,
        (SELECT COUNT(*) FROM media WHERE status = 'active') AS media,
        (SELECT COUNT(*) FROM settings) AS settings,
        (SELECT COUNT(*) FROM site_blocks) AS site_blocks,
        (SELECT COUNT(*) FROM notifications) AS notifications
    `);
    console.log(JSON.stringify(counts[0], null, 2));
  } finally {
    conn.release();
    await pool.end();
  }
}

main().catch(async (error) => {
  console.error("Seed failed:", error.code || error.message);
  console.error(error.message);
  await pool.end().catch(() => {});
  process.exit(1);
});
