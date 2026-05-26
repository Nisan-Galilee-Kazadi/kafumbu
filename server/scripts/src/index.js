import "dotenv/config";
import express from "express";
import cors from "cors";
import adminRouter from "./routes/admin.js";
import paymentsRouter from "./routes/payments.js";
import { stripeWebhookHandler } from "./webhooks/stripe.js";

const app = express();
const PORT = process.env.PORT || 4000;
const configuredOrigins = process.env.CORS_ORIGIN?.split(",").map((origin) => origin.trim()).filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (configuredOrigins?.includes(origin)) return callback(null, true);
      if (/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
  }),
);

// Stripe exige le corps brut pour vérifier la signature
app.post(
  "/v1/webhooks/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhookHandler,
);

app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "kafumbu-payments-api" });
});

// Admin API routes
app.use("/api/admin", adminRouter);

// Payments API routes
app.use("/v1", paymentsRouter);

// Signature Express : 4 arguments requis pour le middleware d’erreur
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "internal_error", message: err.message });
});

app.listen(PORT, () => {
  console.log(`Kafumbu API listening on http://localhost:${PORT}`);
});
