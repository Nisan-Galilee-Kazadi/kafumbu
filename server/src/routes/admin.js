import express from "express";
import pool from "../database.js";
import { authMiddleware, adminOnly } from "../auth.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";

const router = express.Router();

const TOKEN_TTL_SECONDS = 90;
const TOKEN_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const EMAIL_TOKEN_SECRET =
  process.env.EMAIL_TOKEN_SECRET ||
  process.env.JWT_SECRET ||
  "kafumbu-smart-city-secret-key-change-in-prod";

const generateVerificationCode = () =>
  Array.from(
    { length: 6 },
    () => TOKEN_ALPHABET[crypto.randomInt(0, TOKEN_ALPHABET.length)],
  ).join("");

const hashVerificationCode = (email, code) =>
  crypto
    .createHash("sha256")
    .update(`${email.trim().toLowerCase()}:${code}:${EMAIL_TOKEN_SECRET}`)
    .digest("hex");

const slugifyNamePart = (value) => {
  const cleaned = String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "");

  return cleaned || "visiteur";
};

const getFirstName = (name) =>
  String(name || "")
    .trim()
    .split(/\s+/)[0] || "visiteur";

const generateKafumbuUsername = async (conn, name) => {
  const base = slugifyNamePart(getFirstName(name));
  const domain = "kafumbu-smartcity.cd";
  let candidate = `${base}@${domain}`;
  let suffix = 2;

  while (true) {
    const [rows] = await conn.execute(
      "SELECT id FROM users WHERE username = ? LIMIT 1",
      [candidate],
    );
    if (rows.length === 0) return candidate;
    candidate = `${base}${suffix}@${domain}`;
    suffix += 1;
  }
};

const ensureVerificationTable = async (conn) => {
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS email_verification_tokens (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      token_hash VARCHAR(64) NOT NULL,
      payload JSON NOT NULL,
      expires_at DATETIME NOT NULL,
      attempts INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uniq_email_verification_tokens_email (email),
      INDEX idx_email_verification_tokens_expires_at (expires_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
};

const createTransportConfig = (host, port, secure) => ({
  host,
  port,
  secure,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: { rejectUnauthorized: false },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
});

const sendMailRobust = async ({ to, subject, text }) => {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    throw new Error("SMTP_USER ou SMTP_PASS non configuré dans .env");
  }

  // Liste de configurations à essayer dans l'ordre
  const configs = [
    // 1. Config du .env (127.0.0.1 port 587 si défini)
    createTransportConfig(
      process.env.SMTP_HOST || "127.0.0.1",
      Number(process.env.SMTP_PORT || 587),
      String(process.env.SMTP_SECURE || "false") === "true",
    ),
    // 2. Localhost port 25 (fallback cPanel)
    createTransportConfig("127.0.0.1", 25, false),
    // 3. Localhost port 587 non-sécurisé
    createTransportConfig("localhost", 587, false),
    // 4. Serveur mail externe
    createTransportConfig("mail.betterlife-ong.org", 465, true),
    // 5. Serveur mail externe port 587
    createTransportConfig("mail.betterlife-ong.org", 587, false),
  ];

  const from = process.env.SMTP_FROM || user;
  let lastError;

  for (let i = 0; i < configs.length; i++) {
    try {
      const transporter = nodemailer.createTransport(configs[i]);
      await transporter.verify();
      await transporter.sendMail({ from, to, subject, text });
      console.log(
        `[SMTP] Mail envoyé avec succès via config #${i + 1} (host: ${configs[i].host}:${configs[i].port})`,
      );
      return; // succès !
    } catch (err) {
      console.warn(
        `[SMTP] Config #${i + 1} échouée (${configs[i].host}:${configs[i].port}): ${err.message}`,
      );
      lastError = err;
    }
  }

  // Toutes les configs ont échoué
  throw lastError;
};

const sendVerificationEmail = async ({ email, name, code }) => {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    console.log(`\n==================================================`);
    console.log(`[DEV MODE] SMTP non configuré.`);
    console.log(`Code de validation pour ${name} (${email}) : ${code}`);
    console.log(`==================================================\n`);
    return;
  }

  await sendMailRobust({
    to: email,
    subject: "Code de validation Kafumbu Smart City",
    text: `Bonjour ${name},\n\nVotre code de validation Kafumbu Smart City est : ${code}\n\nIl expire dans 1 minute 30.\n\nSi vous n'avez pas demande cette inscription, ignorez ce message.\n\n— L'équipe Kafumbu Smart City`,
  });
};

const sendPasswordResetEmail = async ({ email, name, code }) => {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    console.log(`\n==================================================`);
    console.log(`[DEV MODE] SMTP non configuré.`);
    console.log(`Code de réinitialisation pour ${name} (${email}) : ${code}`);
    console.log(`==================================================\n`);
    return;
  }

  await sendMailRobust({
    to: email,
    subject: "Réinitialisation de mot de passe Kafumbu Smart City",
    text: `Bonjour ${name},\n\nVotre code de réinitialisation de mot de passe est : ${code}\n\nIl expire dans 1 minute 30.\n\nSi vous n'avez pas demande cette reinitialisation, ignorez ce message.\n\n— L'équipe Kafumbu Smart City`,
  });
};

const signUserToken = (user) =>
  jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      role: user.role,
    },
    process.env.JWT_SECRET || "kafumbu-smart-city-secret-key-change-in-prod",
    { expiresIn: process.env.JWT_EXPIRY || "7d" },
  );

const publicUser = (user) => ({
  id: user.id,
  email: user.email,
  username: user.username,
  name: user.name,
  role: user.role,
  tier: user.tier,
  company: user.company,
  phone: user.phone,
});

// ============================================================================
// AUTH ROUTES
// ============================================================================

// Login avec le USERNAME de la plateforme (ex: jean@kafumbu-smartcity.cd)
// La récupération de mot de passe et les tokens restent via l'adresse EMAIL de contact.
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Le nom d'utilisateur et le mot de passe sont requis." });
    }

    const cleanUsername = String(username).trim().toLowerCase();
    const conn = await pool.getConnection();

    // Recherche par username (ex: jean@kafumbu-smartcity.cd)
    const [rows] = await conn.execute(
      "SELECT * FROM users WHERE username = ? LIMIT 1",
      [cleanUsername],
    );
    conn.release();

    if (rows.length === 0) {
      return res.status(401).json({ error: "Nom d'utilisateur ou mot de passe incorrect." });
    }

    const user = rows[0];
    const validPassword =
      password === user.password ||
      (await bcrypt.compare(password, user.password));

    if (!validPassword) {
      return res.status(401).json({ error: "Nom d'utilisateur ou mot de passe incorrect." });
    }

    const token = signUserToken(user);

    res.json({
      token,
      user: publicUser(user),
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed", message: err.message });
  }
});

router.post("/register/request", async (req, res) => {
  let conn;
  try {
    const {
      name,
      email,
      password,
      tier = "none",
      company = "",
      phone = "",
    } = req.body;
    const cleanEmail = String(email || "")
      .trim()
      .toLowerCase();
    const cleanName = String(name || "").trim();

    if (!cleanName || !cleanEmail || !password) {
      return res
        .status(400)
        .json({ error: "name, email and password are required" });
    }

    conn = await pool.getConnection();
    await ensureVerificationTable(conn);

    const [existing] = await conn.execute(
      "SELECT id FROM users WHERE email = ? OR username = ? LIMIT 1",
      [cleanEmail, cleanEmail],
    );
    if (existing.length > 0) {
      conn.release();
      return res.status(409).json({ error: "Cet e-mail est deja utilise." });
    }

    const code = generateVerificationCode();
    const passwordHash = await bcrypt.hash(password, 10);
    const expiresAt = new Date(Date.now() + TOKEN_TTL_SECONDS * 1000);
    const payload = JSON.stringify({
      name: cleanName,
      contactEmail: cleanEmail,
      passwordHash,
      tier,
      company: String(company || "").trim(),
      phone: String(phone || "").trim(),
    });

    await conn.execute(
      `INSERT INTO email_verification_tokens (email, token_hash, payload, expires_at, attempts)
       VALUES (?, ?, ?, ?, 0)
       ON DUPLICATE KEY UPDATE token_hash = VALUES(token_hash), payload = VALUES(payload), expires_at = VALUES(expires_at), attempts = 0`,
      [cleanEmail, hashVerificationCode(cleanEmail, code), payload, expiresAt],
    );

    await sendVerificationEmail({ email: cleanEmail, name: cleanName, code });
    conn.release();

    res.status(202).json({
      message: "Verification code sent",
      expiresInSeconds: TOKEN_TTL_SECONDS,
    });
  } catch (err) {
    if (conn) conn.release();
    res
      .status(err.statusCode || 500)
      .json({
        error: "Failed to send verification code",
        message: err.message,
      });
  }
});

router.post("/register/verify", async (req, res) => {
  let conn;
  try {
    const cleanEmail = String(req.body.email || "")
      .trim()
      .toLowerCase();
    const code = String(req.body.code || "")
      .trim()
      .toUpperCase();

    if (!cleanEmail || !/^[A-Z0-9]{6}$/.test(code)) {
      return res
        .status(400)
        .json({ error: "Valid email and 6-character code are required" });
    }

    conn = await pool.getConnection();
    await ensureVerificationTable(conn);
    await conn.beginTransaction();

    const [rows] = await conn.execute(
      "SELECT * FROM email_verification_tokens WHERE email = ? FOR UPDATE",
      [cleanEmail],
    );

    if (rows.length === 0) {
      await conn.rollback();
      conn.release();
      return res.status(404).json({ error: "Verification request not found" });
    }

    const row = rows[0];
    if (new Date(row.expires_at).getTime() < Date.now()) {
      await conn.execute(
        "DELETE FROM email_verification_tokens WHERE email = ?",
        [cleanEmail],
      );
      await conn.commit();
      conn.release();
      return res.status(410).json({ error: "Verification code expired" });
    }

    if (
      row.attempts >= 5 ||
      row.token_hash !== hashVerificationCode(cleanEmail, code)
    ) {
      await conn.execute(
        "UPDATE email_verification_tokens SET attempts = attempts + 1 WHERE email = ?",
        [cleanEmail],
      );
      await conn.commit();
      conn.release();
      return res.status(401).json({ error: "Invalid verification code" });
    }

    const payload =
      typeof row.payload === "string" ? JSON.parse(row.payload) : row.payload;
    const platformEmail = await generateKafumbuUsername(conn, payload.name);
    const [existing] = await conn.execute(
      "SELECT id FROM users WHERE email = ? OR username = ? LIMIT 1",
      [cleanEmail, platformEmail],
    );
    if (existing.length > 0) {
      await conn.rollback();
      conn.release();
      return res.status(409).json({ error: "Cet e-mail est deja utilise." });
    }

    const [result] = await conn.execute(
      "INSERT INTO users (name, email, username, password, role, tier, company, phone) VALUES (?, ?, ?, ?, 'visitor', ?, ?, ?)",
      [
        payload.name,
        cleanEmail,
        platformEmail,
        payload.passwordHash,
        payload.tier,
        payload.company,
        payload.phone,
      ],
    );
    await conn.execute(
      "DELETE FROM email_verification_tokens WHERE email = ?",
      [cleanEmail],
    );
    await conn.commit();

    const user = {
      id: result.insertId,
      name: payload.name,
      email: cleanEmail,
      username: platformEmail,
      role: "visitor",
      tier: payload.tier,
      company: payload.company,
      phone: payload.phone,
    };

    conn.release();
    res.status(201).json({
      token: signUserToken(user),
      username: platformEmail,
      user: publicUser(user),
    });
  } catch (err) {
    if (conn) {
      await conn.rollback().catch(() => {});
      conn.release();
    }
    res
      .status(500)
      .json({ error: "Failed to verify registration", message: err.message });
  }
});

// ============================================================================
// USERS ROUTES (Admin Management)
// ============================================================================

router.get("/users", authMiddleware, adminOnly, async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [users] = await conn.execute(
      "SELECT id, name, email, username, role, tier, company, phone, created_at FROM users ORDER BY created_at DESC",
    );
    conn.release();
    res.json(users);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch users", message: err.message });
  }
});

router.post("/users", authMiddleware, adminOnly, async (req, res) => {
  try {
    const {
      name,
      email,
      username = email,
      password = "User@123",
      role = "visitor",
      tier = "none",
      company = "",
      phone = "",
    } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const conn = await pool.getConnection();

    const [result] = await conn.execute(
      "INSERT INTO users (name, email, username, password, role, tier, company, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [name, email, username, passwordHash, role, tier, company, phone],
    );
    conn.release();

    res.status(201).json({ id: result.insertId, message: "User created" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to create user", message: err.message });
  }
});

router.get("/users/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [users] = await conn.execute("SELECT * FROM users WHERE id = ?", [
      req.params.id,
    ]);
    conn.release();

    if (users.length === 0)
      return res.status(404).json({ error: "User not found" });
    res.json(users[0]);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch user", message: err.message });
  }
});

router.put("/users/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { name, email, username, role, tier, company, phone } = req.body;
    const conn = await pool.getConnection();

    if (typeof username !== "undefined") {
      await conn.execute(
        "UPDATE users SET name = ?, email = ?, username = ?, role = ?, tier = ?, company = ?, phone = ? WHERE id = ?",
        [name, email, username, role, tier, company, phone, req.params.id],
      );
    } else {
      await conn.execute(
        "UPDATE users SET name = ?, email = ?, role = ?, tier = ?, company = ?, phone = ? WHERE id = ?",
        [name, email, role, tier, company, phone, req.params.id],
      );
    }
    conn.release();

    res.json({ message: "User updated successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to update user", message: err.message });
  }
});

router.delete("/users/:id", authMiddleware, adminOnly, async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();
    await conn.execute(
      "DELETE FROM messages WHERE sender_id = ? OR receiver_id = ?",
      [req.params.id, req.params.id],
    );
    await conn.execute(
      "DELETE FROM visitor_notifications WHERE user_id = ? OR created_by = ?",
      [req.params.id, req.params.id],
    );
    await conn.execute(
      "UPDATE notifications SET created_by = NULL WHERE created_by = ?",
      [req.params.id],
    );
    await conn.execute(
      "UPDATE settings SET updated_by = NULL WHERE updated_by = ?",
      [req.params.id],
    );
    await conn.execute("DELETE FROM users WHERE id = ?", [req.params.id]);
    await conn.commit();
    conn.release();
    res.json({ message: "User and related messages deleted successfully" });
  } catch (err) {
    if (conn) {
      await conn.rollback().catch(() => {});
      conn.release();
    }
    res
      .status(500)
      .json({ error: "Failed to delete user", message: err.message });
  }
});

router.delete(
  "/users/:id/messages",
  authMiddleware,
  adminOnly,
  async (req, res) => {
    try {
      const conn = await pool.getConnection();
      const [result] = await conn.execute(
        "DELETE FROM messages WHERE sender_id = ? OR receiver_id = ?",
        [req.params.id, req.params.id],
      );
      await conn.execute(
        "DELETE FROM visitor_notifications WHERE user_id = ?",
        [req.params.id],
      );
      conn.release();
      res.json({
        message: "User messages deleted",
        deleted: result.affectedRows,
      });
    } catch (err) {
      res
        .status(500)
        .json({
          error: "Failed to delete user messages",
          message: err.message,
        });
    }
  },
);

router.delete(
  "/users-cleanup/non-primary",
  authMiddleware,
  adminOnly,
  async (req, res) => {
    let conn;
    try {
      const primaryEmail = process.env.PRIMARY_ADMIN_EMAIL || req.user.email;
      conn = await pool.getConnection();
      await conn.beginTransaction();

      const [primaryAdmins] = await conn.execute(
        "SELECT id FROM users WHERE email = ? AND role = 'admin' LIMIT 1",
        [primaryEmail],
      );
      const primaryAdminId = primaryAdmins[0]?.id || req.user.id;
      const [targets] = await conn.execute(
        "SELECT id FROM users WHERE role = 'visitor' OR (role = 'admin' AND email <> ?)",
        [primaryEmail],
      );
      const targetIds = targets
        .map((row) => row.id)
        .filter((id) => Number(id) !== Number(primaryAdminId));

      if (targetIds.length === 0) {
        await conn.commit();
        conn.release();
        return res.json({
          message: "No users to clean",
          deletedUsers: 0,
          deletedMessages: 0,
        });
      }

      const placeholders = targetIds.map(() => "?").join(",");
      await conn.execute(
        `UPDATE campaigns SET created_by = ? WHERE created_by IN (${placeholders})`,
        [primaryAdminId, ...targetIds],
      );
      await conn.execute(
        `UPDATE news SET author_id = ? WHERE author_id IN (${placeholders})`,
        [primaryAdminId, ...targetIds],
      );
      await conn.execute(
        `UPDATE media SET uploaded_by = ? WHERE uploaded_by IN (${placeholders})`,
        [primaryAdminId, ...targetIds],
      );
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
      conn.release();
      res.json({
        message: "Users and related messages cleaned",
        deletedUsers: users.affectedRows,
        deletedMessages: messages.affectedRows,
        keptAdmin: primaryEmail,
      });
    } catch (err) {
      if (conn) {
        await conn.rollback().catch(() => {});
        conn.release();
      }
      res
        .status(500)
        .json({ error: "Failed to clean users", message: err.message });
    }
  },
);

// ============================================================================
// CAMPAIGNS ROUTES
// ============================================================================

router.get("/campaigns", authMiddleware, adminOnly, async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [campaigns] = await conn.execute(`
      SELECT c.*, u.name as created_by_name FROM campaigns c 
      LEFT JOIN users u ON c.created_by = u.id 
      ORDER BY c.created_at DESC
    `);
    conn.release();
    res.json(campaigns);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch campaigns", message: err.message });
  }
});

router.get("/campaigns/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [campaigns] = await conn.execute(
      "SELECT * FROM campaigns WHERE id = ?",
      [req.params.id],
    );
    conn.release();
    if (campaigns.length === 0)
      return res.status(404).json({ error: "Campaign not found" });
    res.json(campaigns[0]);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch campaign", message: err.message });
  }
});

router.post("/campaigns", authMiddleware, adminOnly, async (req, res) => {
  try {
    const {
      title,
      description,
      slug,
      status,
      goal_amount,
      start_date,
      end_date,
      image_url,
      category,
    } = req.body;
    const conn = await pool.getConnection();

    const [result] = await conn.execute(
      "INSERT INTO campaigns (title, description, slug, status, goal_amount, start_date, end_date, image_url, category, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        title,
        description,
        slug,
        status || "draft",
        goal_amount,
        start_date,
        end_date,
        image_url,
        category,
        req.user.id,
      ],
    );
    conn.release();

    res
      .status(201)
      .json({ id: result.insertId, message: "Campaign created successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to create campaign", message: err.message });
  }
});

router.put("/campaigns/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const {
      title,
      description,
      slug,
      status,
      goal_amount,
      current_amount,
      start_date,
      end_date,
      image_url,
      category,
    } = req.body;
    const conn = await pool.getConnection();

    await conn.execute(
      "UPDATE campaigns SET title = ?, description = ?, slug = ?, status = ?, goal_amount = ?, current_amount = ?, start_date = ?, end_date = ?, image_url = ?, category = ? WHERE id = ?",
      [
        title,
        description,
        slug,
        status,
        goal_amount,
        current_amount,
        start_date,
        end_date,
        image_url,
        category,
        req.params.id,
      ],
    );
    conn.release();

    res.json({ message: "Campaign updated successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to update campaign", message: err.message });
  }
});

router.delete("/campaigns/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const conn = await pool.getConnection();
    await conn.execute("DELETE FROM campaigns WHERE id = ?", [req.params.id]);
    conn.release();
    res.json({ message: "Campaign deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete campaign", message: err.message });
  }
});

// ============================================================================
// NEWS/PUBLICATIONS ROUTES
// ============================================================================

router.get("/news", authMiddleware, adminOnly, async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [news] = await conn.execute(`
      SELECT n.*, u.name as author_name FROM news n 
      LEFT JOIN users u ON n.author_id = u.id 
      ORDER BY n.created_at DESC
    `);
    conn.release();
    res.json(news);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch news", message: err.message });
  }
});

router.get("/news/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [news] = await conn.execute("SELECT * FROM news WHERE id = ?", [
      req.params.id,
    ]);
    conn.release();
    if (news.length === 0)
      return res.status(404).json({ error: "News not found" });
    res.json(news[0]);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch news", message: err.message });
  }
});

router.post("/news", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { title, content, slug, excerpt, status, featured_image, category } =
      req.body;
    const conn = await pool.getConnection();

    const [result] = await conn.execute(
      "INSERT INTO news (title, content, slug, excerpt, status, featured_image, category, author_id, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        title,
        content,
        slug,
        excerpt,
        status || "draft",
        featured_image,
        category,
        req.user.id,
        status === "published" ? new Date() : null,
      ],
    );
    conn.release();

    res
      .status(201)
      .json({ id: result.insertId, message: "News created successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to create news", message: err.message });
  }
});

router.put("/news/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { title, content, slug, excerpt, status, featured_image, category } =
      req.body;
    const conn = await pool.getConnection();

    await conn.execute(
      "UPDATE news SET title = ?, content = ?, slug = ?, excerpt = ?, status = ?, featured_image = ?, category = ?, published_at = ? WHERE id = ?",
      [
        title,
        content,
        slug,
        excerpt,
        status,
        featured_image,
        category,
        status === "published" ? new Date() : null,
        req.params.id,
      ],
    );
    conn.release();

    res.json({ message: "News updated successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to update news", message: err.message });
  }
});

router.delete("/news/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const conn = await pool.getConnection();
    await conn.execute("DELETE FROM news WHERE id = ?", [req.params.id]);
    conn.release();
    res.json({ message: "News deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete news", message: err.message });
  }
});

// ============================================================================
// MEDIA ROUTES
// ============================================================================

router.get("/media", authMiddleware, adminOnly, async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [media] = await conn.execute(`
      SELECT m.*, u.name as uploaded_by_name FROM media m 
      LEFT JOIN users u ON m.uploaded_by = u.id 
      WHERE m.status = 'active'
      ORDER BY m.created_at DESC
    `);
    conn.release();
    res.json(media);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch media", message: err.message });
  }
});

router.delete("/media/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const conn = await pool.getConnection();
    await conn.execute("UPDATE media SET status = ? WHERE id = ?", [
      "deleted",
      req.params.id,
    ]);
    conn.release();
    res.json({ message: "Media deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete media", message: err.message });
  }
});

router.post("/media", authMiddleware, adminOnly, async (req, res) => {
  try {
    const {
      filename,
      file_path,
      file_type = "image",
      mime_type = "image/jpeg",
      file_size = 0,
      width = null,
      height = null,
      alt_text = "",
      title = "",
      description = "",
    } = req.body;
    const conn = await pool.getConnection();
    const [result] = await conn.execute(
      `INSERT INTO media
       (filename, file_path, file_type, mime_type, file_size, width, height, alt_text, title, description, uploaded_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        filename,
        file_path,
        file_type,
        mime_type,
        file_size,
        width,
        height,
        alt_text,
        title,
        description,
        req.user.id,
      ],
    );
    conn.release();
    res.status(201).json({ id: result.insertId, message: "Media created" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to create media", message: err.message });
  }
});

// ============================================================================
// SETTINGS ROUTES
// ============================================================================

router.get("/settings", authMiddleware, adminOnly, async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [settings] = await conn.execute("SELECT * FROM settings");
    conn.release();

    const result = {};
    settings.forEach((s) => {
      result[s.key] = s.value;
    });
    res.json(result);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch settings", message: err.message });
  }
});

router.put("/settings/:key", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { value, type } = req.body;
    const conn = await pool.getConnection();

    await conn.execute(
      "INSERT INTO settings (key, value, type, updated_by) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE value = ?, type = ?, updated_by = ?",
      [
        req.params.key,
        value,
        type || "string",
        req.user.id,
        value,
        type || "string",
        req.user.id,
      ],
    );
    conn.release();

    res.json({ message: "Setting updated successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to update setting", message: err.message });
  }
});

// ============================================================================
// STATS ROUTES
// ============================================================================

router.get("/stats", authMiddleware, adminOnly, async (req, res) => {
  try {
    const conn = await pool.getConnection();

    const [userStats] = await conn.execute(
      'SELECT COUNT(*) as total FROM users WHERE role = "visitor"',
    );
    const [donationStats] = await conn.execute(
      'SELECT SUM(amount) as total FROM donations WHERE status = "completed"',
    );
    const [campaignStats] = await conn.execute(
      'SELECT COUNT(*) as total FROM campaigns WHERE status = "active"',
    );
    const [newsStats] = await conn.execute(
      'SELECT COUNT(*) as total FROM news WHERE status = "published"',
    );
    const [mediaStats] = await conn.execute(
      'SELECT COUNT(*) as total FROM media WHERE status = "active"',
    );

    conn.release();

    res.json({
      users: userStats[0]?.total || 0,
      totalDonations: Number(donationStats[0]?.total) || 0,
      activeCampaigns: campaignStats[0]?.total || 0,
      publishedNews: newsStats[0]?.total || 0,
      totalMedia: mediaStats[0]?.total || 0,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch stats", message: err.message });
  }
});

// ============================================================================
// NOTIFICATIONS ROUTES
// ============================================================================

router.get("/notifications", authMiddleware, adminOnly, async (_req, res) => {
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.execute(
      "SELECT * FROM notifications ORDER BY created_at DESC LIMIT 100",
    );
    conn.release();
    res.json(rows);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch notifications", message: err.message });
  }
});

router.post("/notifications", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { title, message, type = "info", status = "unread" } = req.body;
    const conn = await pool.getConnection();
    const [result] = await conn.execute(
      "INSERT INTO notifications (title, message, type, status, created_by) VALUES (?, ?, ?, ?, ?)",
      [title, message, type, status, req.user.id],
    );
    conn.release();
    res
      .status(201)
      .json({ id: result.insertId, message: "Notification created" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to create notification", message: err.message });
  }
});

router.put(
  "/notifications/:id/read",
  authMiddleware,
  adminOnly,
  async (req, res) => {
    try {
      const conn = await pool.getConnection();
      await conn.execute(
        "UPDATE notifications SET status = 'read' WHERE id = ?",
        [req.params.id],
      );
      conn.release();
      res.json({ message: "Notification marked as read" });
    } catch (err) {
      res
        .status(500)
        .json({ error: "Failed to update notification", message: err.message });
    }
  },
);

router.delete(
  "/notifications/:id",
  authMiddleware,
  adminOnly,
  async (req, res) => {
    try {
      const conn = await pool.getConnection();
      await conn.execute("DELETE FROM notifications WHERE id = ?", [
        req.params.id,
      ]);
      conn.release();
      res.json({ message: "Notification deleted" });
    } catch (err) {
      res
        .status(500)
        .json({ error: "Failed to delete notification", message: err.message });
    }
  },
);

// ============================================================================
// MESSAGING ROUTES
// ============================================================================

const mapMessage = (row) => ({
  id: row.id,
  senderId: row.sender_id,
  receiverId: row.receiver_id,
  senderRole: row.sender_role,
  receiverRole: row.receiver_role,
  senderName:
    row.sender_name ||
    (row.sender_role === "admin" ? "Admin Kafumbu" : "Visiteur"),
  receiverName:
    row.receiver_name ||
    (row.receiver_role === "admin" ? "Admin Kafumbu" : "Visiteur"),
  subject: row.subject,
  content: row.content,
  read: row.status === "read",
  status: row.status,
  createdAt: row.created_at,
});

router.get(
  "/messages/conversations",
  authMiddleware,
  adminOnly,
  async (_req, res) => {
    try {
      const conn = await pool.getConnection();
      const [rows] = await conn.execute(`
      SELECT
        u.id,
        u.name,
        u.email,
        u.role,
        u.tier,
        u.company,
        u.phone,
        u.created_at,
        lm.content AS last_message,
        lm.created_at AS last_message_at,
        lm.sender_role AS last_sender_role,
        COALESCE(unread.unread_count, 0) AS unread_count,
        COALESCE(total.total_count, 0) AS total_count
      FROM users u
      LEFT JOIN (
        SELECT m1.*
        FROM messages m1
        INNER JOIN (
          SELECT
            CASE WHEN sender_role = 'visitor' THEN sender_id ELSE receiver_id END AS visitor_id,
            MAX(created_at) AS max_created_at
          FROM messages
          GROUP BY visitor_id
        ) latest
          ON latest.visitor_id = CASE WHEN m1.sender_role = 'visitor' THEN m1.sender_id ELSE m1.receiver_id END
         AND latest.max_created_at = m1.created_at
      ) lm ON lm.sender_id = u.id OR lm.receiver_id = u.id
      LEFT JOIN (
        SELECT sender_id AS visitor_id, COUNT(*) AS unread_count
        FROM messages
        WHERE sender_role = 'visitor' AND receiver_role = 'admin' AND status = 'unread'
        GROUP BY sender_id
      ) unread ON unread.visitor_id = u.id
      LEFT JOIN (
        SELECT
          CASE WHEN sender_role = 'visitor' THEN sender_id ELSE receiver_id END AS visitor_id,
          COUNT(*) AS total_count
        FROM messages
        GROUP BY visitor_id
      ) total ON total.visitor_id = u.id
      WHERE u.role = 'visitor'
      ORDER BY COALESCE(lm.created_at, u.created_at) DESC
    `);
      conn.release();
      res.json(rows);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Failed to fetch conversations", message: err.message });
    }
  },
);

router.get("/messages/:userId", authMiddleware, adminOnly, async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.execute(
      `
      SELECT m.*, s.name AS sender_name, r.name AS receiver_name
      FROM messages m
      LEFT JOIN users s ON s.id = m.sender_id
      LEFT JOIN users r ON r.id = m.receiver_id
      WHERE (m.sender_role = 'visitor' AND m.sender_id = ? AND m.receiver_role = 'admin')
         OR (m.sender_role = 'admin' AND m.receiver_id = ? AND m.receiver_role = 'visitor')
      ORDER BY m.created_at ASC
    `,
      [req.params.userId, req.params.userId],
    );
    await conn.execute(
      "UPDATE messages SET status = 'read' WHERE sender_role = 'visitor' AND receiver_role = 'admin' AND sender_id = ?",
      [req.params.userId],
    );
    conn.release();
    res.json(rows.map(mapMessage));
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch messages", message: err.message });
  }
});

router.post(
  "/messages/:userId",
  authMiddleware,
  adminOnly,
  async (req, res) => {
    try {
      const { content, subject = "Message de l'administration" } = req.body;
      if (!content?.trim())
        return res.status(400).json({ error: "Message content is required" });

      const conn = await pool.getConnection();
      const [userRows] = await conn.execute(
        "SELECT id, name FROM users WHERE id = ? AND role = 'visitor'",
        [req.params.userId],
      );
      if (userRows.length === 0) {
        conn.release();
        return res.status(404).json({ error: "Visitor not found" });
      }

      const [result] = await conn.execute(
        `INSERT INTO messages (sender_id, receiver_id, sender_role, receiver_role, subject, content, status)
       VALUES (?, ?, 'admin', 'visitor', ?, ?, 'unread')`,
        [req.user.id, req.params.userId, subject, content.trim()],
      );
      await conn.execute(
        `INSERT INTO visitor_notifications (user_id, title, message, type, status, created_by)
       VALUES (?, ?, ?, 'message', 'unread', ?)`,
        [
          req.params.userId,
          "Nouveau message",
          content.trim().slice(0, 240),
          req.user.id,
        ],
      );
      conn.release();

      res.status(201).json({ id: result.insertId, message: "Message sent" });
    } catch (err) {
      res
        .status(500)
        .json({ error: "Failed to send message", message: err.message });
    }
  },
);

router.get("/visitor/:userId/messages", async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.execute(
      `
      SELECT m.*, s.name AS sender_name, r.name AS receiver_name
      FROM messages m
      LEFT JOIN users s ON s.id = m.sender_id
      LEFT JOIN users r ON r.id = m.receiver_id
      WHERE (m.sender_role = 'visitor' AND m.sender_id = ? AND m.receiver_role = 'admin')
         OR (m.sender_role = 'admin' AND m.receiver_id = ? AND m.receiver_role = 'visitor')
      ORDER BY m.created_at ASC
    `,
      [req.params.userId, req.params.userId],
    );
    conn.release();
    res.json(rows.map(mapMessage));
  } catch (err) {
    res
      .status(500)
      .json({
        error: "Failed to fetch visitor messages",
        message: err.message,
      });
  }
});

router.post("/visitor/:userId/messages", async (req, res) => {
  try {
    const { content, subject = "Reponse visiteur" } = req.body;
    if (!content?.trim())
      return res.status(400).json({ error: "Message content is required" });

    const conn = await pool.getConnection();
    const [visitorRows] = await conn.execute(
      "SELECT id, name FROM users WHERE id = ? AND role = 'visitor'",
      [req.params.userId],
    );
    const [adminRows] = await conn.execute(
      "SELECT id FROM users WHERE role = 'admin' ORDER BY id ASC LIMIT 1",
    );
    if (visitorRows.length === 0 || adminRows.length === 0) {
      conn.release();
      return res.status(404).json({ error: "Visitor or admin not found" });
    }

    const adminId = adminRows[0].id;
    const [result] = await conn.execute(
      `INSERT INTO messages (sender_id, receiver_id, sender_role, receiver_role, subject, content, status)
       VALUES (?, ?, 'visitor', 'admin', ?, ?, 'unread')`,
      [req.params.userId, adminId, subject, content.trim()],
    );
    await conn.execute(
      `INSERT INTO notifications (title, message, type, status, created_by)
       VALUES (?, ?, 'info', 'unread', ?)`,
      [
        `Message de ${visitorRows[0].name}`,
        content.trim().slice(0, 240),
        req.params.userId,
      ],
    );
    conn.release();

    res.status(201).json({ id: result.insertId, message: "Reply sent" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to send visitor message", message: err.message });
  }
});

router.put("/visitor/:userId/messages/read", async (req, res) => {
  try {
    const conn = await pool.getConnection();
    await conn.execute(
      "UPDATE messages SET status = 'read' WHERE receiver_id = ? AND receiver_role = 'visitor' AND sender_role = 'admin'",
      [req.params.userId],
    );
    conn.release();
    res.json({ message: "Visitor messages marked as read" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to mark visitor messages", message: err.message });
  }
});

router.get("/visitor/:userId/notifications", async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.execute(
      "SELECT * FROM visitor_notifications WHERE user_id IS NULL OR user_id = ? ORDER BY created_at DESC LIMIT 100",
      [req.params.userId],
    );
    conn.release();
    res.json(rows);
  } catch (err) {
    res
      .status(500)
      .json({
        error: "Failed to fetch visitor notifications",
        message: err.message,
      });
  }
});

router.put("/visitor/:userId/notifications/:id/read", async (req, res) => {
  try {
    const conn = await pool.getConnection();
    await conn.execute(
      "UPDATE visitor_notifications SET status = 'read' WHERE id = ? AND (user_id IS NULL OR user_id = ?)",
      [req.params.id, req.params.userId],
    );
    conn.release();
    res.json({ message: "Visitor notification marked as read" });
  } catch (err) {
    res
      .status(500)
      .json({
        error: "Failed to mark visitor notification",
        message: err.message,
      });
  }
});

// ============================================================================
// SEARCH + PUBLIC READ ROUTES
// ============================================================================

router.get("/search", authMiddleware, adminOnly, async (req, res) => {
  try {
    const q = `%${String(req.query.q || "").trim()}%`;
    const conn = await pool.getConnection();
    const [users] = await conn.execute(
      "SELECT 'user' AS type, id, name AS title, email AS subtitle, created_at FROM users WHERE name LIKE ? OR email LIKE ? OR company LIKE ? LIMIT 20",
      [q, q, q],
    );
    const [campaigns] = await conn.execute(
      "SELECT 'campaign' AS type, id, title, status AS subtitle, created_at FROM campaigns WHERE title LIKE ? OR description LIKE ? OR category LIKE ? LIMIT 20",
      [q, q, q],
    );
    const [news] = await conn.execute(
      "SELECT 'news' AS type, id, title, status AS subtitle, created_at FROM news WHERE title LIKE ? OR excerpt LIKE ? OR content LIKE ? LIMIT 20",
      [q, q, q],
    );
    const [media] = await conn.execute(
      "SELECT 'media' AS type, id, COALESCE(title, filename) AS title, file_type AS subtitle, created_at FROM media WHERE title LIKE ? OR filename LIKE ? OR description LIKE ? LIMIT 20",
      [q, q, q],
    );
    conn.release();
    res.json([...users, ...campaigns, ...news, ...media]);
  } catch (err) {
    res.status(500).json({ error: "Search failed", message: err.message });
  }
});

router.get("/public/content", async (_req, res) => {
  try {
    const conn = await pool.getConnection();
    const [settingsRows] = await conn.execute(
      "SELECT `key`, `value`, `type` FROM settings",
    );
    const [campaigns] = await conn.execute(
      "SELECT * FROM campaigns WHERE status IN ('active','completed') ORDER BY created_at DESC LIMIT 12",
    );
    const [news] = await conn.execute(
      "SELECT * FROM news WHERE status = 'published' ORDER BY published_at DESC, created_at DESC LIMIT 12",
    );
    const [media] = await conn.execute(
      "SELECT * FROM media WHERE status = 'active' ORDER BY created_at DESC LIMIT 24",
    );
    const [blocks] = await conn.execute(
      "SELECT * FROM site_blocks WHERE status = 'published' ORDER BY sort_order ASC, created_at DESC",
    );
    conn.release();

    const settings = {};
    settingsRows.forEach((row) => {
      settings[row.key] =
        row.type === "json" ? JSON.parse(row.value || "null") : row.value;
    });
    res.json({ settings, campaigns, news, media, blocks });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch public content", message: err.message });
  }
});

router.get("/public/search", async (req, res) => {
  try {
    const q = `%${String(req.query.q || "").trim()}%`;
    const conn = await pool.getConnection();
    const [news] = await conn.execute(
      "SELECT 'Actualite' AS category, title, excerpt AS content, CONCAT('/medias/blog?q=', slug) AS path FROM news WHERE status = 'published' AND (title LIKE ? OR excerpt LIKE ? OR content LIKE ?) LIMIT 20",
      [q, q, q],
    );
    const [campaigns] = await conn.execute(
      "SELECT 'Campagne' AS category, title, description AS content, CONCAT('/levee-de-fonds/', id) AS path FROM campaigns WHERE status = 'active' AND (title LIKE ? OR description LIKE ? OR category LIKE ?) LIMIT 20",
      [q, q, q],
    );
    const [media] = await conn.execute(
      "SELECT 'Media' AS category, COALESCE(title, filename) AS title, description AS content, '/medias/galerie' AS path FROM media WHERE status = 'active' AND (title LIKE ? OR filename LIKE ? OR description LIKE ?) LIMIT 20",
      [q, q, q],
    );
    conn.release();
    res.json([...news, ...campaigns, ...media]);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Public search failed", message: err.message });
  }
});

// ============================================================================
// PASSWORD RESET ROUTES
// Récupération et réinitialisation via l'adresse EMAIL de contact de l'utilisateur.
// (indépendant du username utilisé pour se connecter)
// ============================================================================

router.post("/password/reset-request", async (req, res) => {
  let conn;
  try {
    const cleanEmail = String(req.body.email || "")
      .trim()
      .toLowerCase();
    if (!cleanEmail) {
      return res.status(400).json({ error: "L'adresse email est requise." });
    }

    conn = await pool.getConnection();
    const [existing] = await conn.execute(
      "SELECT id, name, email FROM users WHERE email = ?",
      [cleanEmail],
    );
    if (existing.length === 0) {
      conn.release();
      return res
        .status(404)
        .json({ error: "Aucun utilisateur trouvé avec cette adresse e-mail." });
    }

    const user = existing[0];
    await ensureVerificationTable(conn);

    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + TOKEN_TTL_SECONDS * 1000);
    const payload = JSON.stringify({
      action: "password_reset",
      userId: user.id,
      email: cleanEmail,
    });

    await conn.execute(
      `INSERT INTO email_verification_tokens (email, token_hash, payload, expires_at, attempts)
       VALUES (?, ?, ?, ?, 0)
       ON DUPLICATE KEY UPDATE token_hash = VALUES(token_hash), payload = VALUES(payload), expires_at = VALUES(expires_at), attempts = 0`,
      [cleanEmail, hashVerificationCode(cleanEmail, code), payload, expiresAt],
    );

    await sendPasswordResetEmail({ email: cleanEmail, name: user.name, code });
    conn.release();

    res.status(202).json({
      message: "Code de reinitialisation envoye",
      expiresInSeconds: TOKEN_TTL_SECONDS,
    });
  } catch (err) {
    if (conn) conn.release();
    res
      .status(500)
      .json({
        error: "Impossible d'envoyer le code de reinitialisation",
        message: err.message,
      });
  }
});

router.post("/password/reset-verify", async (req, res) => {
  let conn;
  try {
    const cleanEmail = String(req.body.email || "")
      .trim()
      .toLowerCase();
    const code = String(req.body.code || "")
      .trim()
      .toUpperCase();
    const { newPassword } = req.body;

    if (!cleanEmail || !/^[A-Z0-9]{6}$/.test(code) || !newPassword) {
      return res
        .status(400)
        .json({
          error:
            "L'e-mail, le code à 6 caractères et le nouveau mot de passe sont requis.",
        });
    }

    conn = await pool.getConnection();
    await ensureVerificationTable(conn);
    await conn.beginTransaction();

    const [rows] = await conn.execute(
      "SELECT * FROM email_verification_tokens WHERE email = ? FOR UPDATE",
      [cleanEmail],
    );

    if (rows.length === 0) {
      await conn.rollback();
      conn.release();
      return res
        .status(404)
        .json({ error: "Demande de verification introuvable." });
    }

    const row = rows[0];
    if (new Date(row.expires_at).getTime() < Date.now()) {
      await conn.execute(
        "DELETE FROM email_verification_tokens WHERE email = ?",
        [cleanEmail],
      );
      await conn.commit();
      conn.release();
      return res.status(410).json({ error: "Code expire." });
    }

    if (
      row.attempts >= 5 ||
      row.token_hash !== hashVerificationCode(cleanEmail, code)
    ) {
      await conn.execute(
        "UPDATE email_verification_tokens SET attempts = attempts + 1 WHERE email = ?",
        [cleanEmail],
      );
      await conn.commit();
      conn.release();
      return res.status(401).json({ error: "Code incorrect." });
    }

    const payload =
      typeof row.payload === "string" ? JSON.parse(row.payload) : row.payload;
    if (payload.action !== "password_reset") {
      await conn.rollback();
      conn.release();
      return res.status(400).json({ error: "Action invalide." });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await conn.execute("UPDATE users SET password = ? WHERE email = ?", [
      passwordHash,
      cleanEmail,
    ]);
    await conn.execute(
      "DELETE FROM email_verification_tokens WHERE email = ?",
      [cleanEmail],
    );
    await conn.commit();
    conn.release();

    res.json({ message: "Mot de passe réinitialisé avec succès." });
  } catch (err) {
    if (conn) {
      await conn.rollback().catch(() => {});
      conn.release();
    }
    res
      .status(500)
      .json({
        error: "Impossible de reinitialiser le mot de passe",
        message: err.message,
      });
  }
});

export default router;
