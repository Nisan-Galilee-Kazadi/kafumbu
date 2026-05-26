import "dotenv/config";
import pool from "../src/database.js";

const PRIMARY_ADMIN_EMAIL =
  process.env.PRIMARY_ADMIN_EMAIL || "admin@kafumbu-smartcity.cd";

async function main() {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [primaryAdmins] = await conn.execute(
      "SELECT id FROM users WHERE email = ? AND role = 'admin' LIMIT 1",
      [PRIMARY_ADMIN_EMAIL],
    );
    const primaryAdminId = primaryAdmins[0]?.id || null;

    const [targets] = await conn.execute(
      "SELECT id FROM users WHERE role = 'visitor' OR (role = 'admin' AND email <> ?)",
      [PRIMARY_ADMIN_EMAIL],
    );
    const targetIds = targets.map((row) => row.id);

    if (targetIds.length === 0) {
      await conn.commit();
      console.log(JSON.stringify({ ok: true, deletedUsers: 0, deletedMessages: 0 }));
      return;
    }

    const placeholders = targetIds.map(() => "?").join(",");

    let reassignedContent = 0;
    if (primaryAdminId) {
      const [campaigns] = await conn.execute(
        `UPDATE campaigns SET created_by = ? WHERE created_by IN (${placeholders})`,
        [primaryAdminId, ...targetIds],
      );
      const [news] = await conn.execute(
        `UPDATE news SET author_id = ? WHERE author_id IN (${placeholders})`,
        [primaryAdminId, ...targetIds],
      );
      const [media] = await conn.execute(
        `UPDATE media SET uploaded_by = ? WHERE uploaded_by IN (${placeholders})`,
        [primaryAdminId, ...targetIds],
      );
      reassignedContent =
        campaigns.affectedRows + news.affectedRows + media.affectedRows;
    }

    const [messages] = await conn.execute(
      `DELETE FROM messages WHERE sender_id IN (${placeholders}) OR receiver_id IN (${placeholders})`,
      [...targetIds, ...targetIds],
    );
    await conn.execute(
      `DELETE FROM visitor_notifications WHERE user_id IN (${placeholders}) OR created_by IN (${placeholders})`,
      [...targetIds, ...targetIds],
    );
    await conn.execute(
      `UPDATE notifications SET created_by = NULL WHERE created_by IN (${placeholders})`,
      targetIds,
    );
    await conn.execute(
      `UPDATE settings SET updated_by = NULL WHERE updated_by IN (${placeholders})`,
      targetIds,
    );
    const [users] = await conn.execute(
      `DELETE FROM users WHERE id IN (${placeholders})`,
      targetIds,
    );

    await conn.commit();
    console.log(
      JSON.stringify({
        ok: true,
        deletedUsers: users.affectedRows,
        deletedMessages: messages.affectedRows,
        reassignedContent,
        keptAdmin: primaryAdminId ? PRIMARY_ADMIN_EMAIL : null,
      }),
    );
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error.code || error.message);
  process.exit(1);
});
