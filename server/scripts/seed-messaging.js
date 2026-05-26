import "dotenv/config";
import pool from "../src/database.js";

async function main() {
  const conn = await pool.getConnection();
  try {
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sender_id INT NOT NULL,
        receiver_id INT NOT NULL,
        sender_role ENUM('admin','visitor') NOT NULL,
        receiver_role ENUM('admin','visitor') NOT NULL,
        subject VARCHAR(255) NULL,
        content TEXT NOT NULL,
        status ENUM('unread','read') DEFAULT 'unread',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_messages_visitor_sender (sender_role, sender_id),
        INDEX idx_messages_visitor_receiver (receiver_role, receiver_id),
        INDEX idx_messages_status (status),
        INDEX idx_messages_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await conn.execute(`
      CREATE TABLE IF NOT EXISTS visitor_notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type ENUM('info','success','warning','urgent','message') DEFAULT 'info',
        status ENUM('unread','read') DEFAULT 'unread',
        created_by INT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_visitor_notifications_user (user_id),
        INDEX idx_visitor_notifications_status (status),
        INDEX idx_visitor_notifications_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    const [admins] = await conn.execute("SELECT id FROM users WHERE role = 'admin' ORDER BY id ASC LIMIT 1");
    const [visitors] = await conn.execute("SELECT id, name FROM users WHERE role = 'visitor' ORDER BY id ASC LIMIT 5");

    if (admins.length > 0 && visitors.length > 0) {
      const adminId = admins[0].id;
      for (const visitor of visitors) {
        await conn.execute(
          `INSERT INTO messages (sender_id, receiver_id, sender_role, receiver_role, subject, content, status)
           SELECT ?, ?, 'admin', 'visitor', 'Bienvenue', ?, 'unread'
           WHERE NOT EXISTS (
             SELECT 1 FROM messages
             WHERE receiver_id = ? AND receiver_role = 'visitor' AND subject = 'Bienvenue'
           )`,
          [
            adminId,
            visitor.id,
            `Bonjour ${visitor.name}, la messagerie Kafumbu Smart City est maintenant connectee a la base en ligne. Vous pouvez repondre ici directement.`,
            visitor.id,
          ],
        );

        await conn.execute(
          `INSERT INTO visitor_notifications (user_id, title, message, type, status, created_by)
           SELECT ?, 'Messagerie active', 'Vous avez recu un message de bienvenue de l administration.', 'message', 'unread', ?
           WHERE NOT EXISTS (
             SELECT 1 FROM visitor_notifications
             WHERE user_id = ? AND title = 'Messagerie active'
           )`,
          [visitor.id, adminId, visitor.id],
        );
      }
    }

    const [messageCount] = await conn.execute("SELECT COUNT(*) AS total FROM messages");
    const [notificationCount] = await conn.execute("SELECT COUNT(*) AS total FROM visitor_notifications");
    console.log(JSON.stringify({
      ok: true,
      messages: messageCount[0].total,
      visitorNotifications: notificationCount[0].total,
    }));
  } finally {
    conn.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err.code || err.message);
  process.exit(1);
});
