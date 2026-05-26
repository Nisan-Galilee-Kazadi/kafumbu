/**
 * POST /v1/webhooks/stripe
 * Brancher : stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET)
 * puis traiter payment_intent.succeeded, etc.
 */
export async function stripeWebhookHandler(req, res) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.warn('[stripe webhook] STRIPE_WEBHOOK_SECRET manquant — acceptation sans vérif (dev uniquement)');
  }
  // TODO: const event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], secret);
  res.status(200).json({ received: true });
}
