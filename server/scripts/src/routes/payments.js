import { randomUUID } from 'node:crypto';
import { Router } from 'express';

const router = Router();

/** GET /v1/payments/methods */
router.get('/payments/methods', (_req, res) => {
  res.json({
    methods: ['stripe', 'paypal', 'mobile_money'],
    note: 'Visa/Mastercard passent par Stripe (PaymentIntents) ou par le checkout PayPal.',
  });
});

/**
 * POST /v1/payments
 * Crée un paiement unifié — à implémenter avec Stripe SDK / PayPal Orders API / agrégateur Mobile Money.
 */
router.post('/payments', (req, res) => {
  const { provider, amount, currency, reference } = req.body || {};
  if (!provider || !amount || !currency || !reference) {
    return res.status(400).json({
      error: 'validation_error',
      message: 'Champs requis: provider, amount, currency, reference',
    });
  }

  const paymentId = randomUUID();

  if (provider === 'stripe') {
    return res.status(201).json({
      paymentId,
      provider: 'stripe',
      status: 'requires_action',
      stripe: {
        clientSecret: 'pi_xxx_secret_xxx',
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_xxx',
      },
      _stub: true,
      _next: 'Front: Stripe.js confirmCardPayment ou Payment Element avec clientSecret',
    });
  }

  if (provider === 'paypal') {
    return res.status(201).json({
      paymentId,
      provider: 'paypal',
      status: 'requires_action',
      paypal: {
        orderId: 'PAYPAL_ORDER_STUB',
        approveUrl: 'https://www.sandbox.paypal.com/checkoutnow?token=PAYPAL_ORDER_STUB',
      },
      _stub: true,
      _next: 'Front: rediriger vers approveUrl puis POST /v1/payments/paypal/capture',
    });
  }

  if (provider === 'mobile_money') {
    const { phone, operator } = req.body.mobileMoney || {};
    if (!phone || !operator) {
      return res.status(400).json({
        error: 'validation_error',
        message: 'Pour mobile_money: body.mobileMoney.phone et .operator requis',
      });
    }
    return res.status(201).json({
      paymentId,
      provider: 'mobile_money',
      status: 'pending',
      mobileMoney: {
        transactionId: 'MM_STUB_' + paymentId.slice(0, 8),
        instructions: 'STUB — brancher agrégateur (Orange/MTN/Airtel) ou API opérateur',
      },
      _stub: true,
    });
  }

  return res.status(400).json({ error: 'unknown_provider', message: 'provider inconnu' });
});

/** GET /v1/payments/:paymentId */
router.get('/payments/:paymentId', (req, res) => {
  res.json({
    id: req.params.paymentId,
    provider: 'stripe',
    amount: 5000,
    currency: 'USD',
    status: 'succeeded',
    reference: 'demo-ref',
    providerRef: 'pi_stub',
    createdAt: new Date().toISOString(),
    _stub: true,
  });
});

/** POST /v1/payments/:paymentId/stripe/confirm */
router.post('/payments/:paymentId/stripe/confirm', (req, res) => {
  res.json({ ok: true, paymentId: req.params.paymentId, paymentIntentId: req.body?.paymentIntentId, _stub: true });
});

/** POST /v1/payments/paypal/order */
router.post('/payments/paypal/order', (req, res) => {
  const { amount, currency, reference } = req.body || {};
  if (!amount || !currency || !reference) {
    return res.status(400).json({ error: 'validation_error', message: 'amount, currency, reference requis' });
  }
  res.status(201).json({
    orderId: 'PAYPAL_ORDER_STUB',
    approveUrl: 'https://www.sandbox.paypal.com/checkoutnow?token=PAYPAL_ORDER_STUB',
    _stub: true,
  });
});

/** POST /v1/payments/paypal/capture */
router.post('/payments/paypal/capture', (req, res) => {
  const { orderId } = req.body || {};
  if (!orderId) return res.status(400).json({ error: 'validation_error', message: 'orderId requis' });
  res.json({ ok: true, orderId, status: 'COMPLETED', _stub: true });
});

/** POST /v1/webhooks/paypal */
router.post('/webhooks/paypal', (req, res) => {
  // TODO: vérifier en-têtes PayPal + idempotence
  res.status(200).send('OK');
});

/** POST /v1/payments/mobile-money/init */
router.post('/payments/mobile-money/init', (req, res) => {
  const { amount, currency, phone, operator, reference } = req.body || {};
  if (!amount || !currency || !phone || !operator || !reference) {
    return res.status(400).json({
      error: 'validation_error',
      message: 'amount, currency, phone, operator, reference requis',
    });
  }
  res.status(201).json({
    transactionId: 'MM_' + randomUUID().slice(0, 8),
    status: 'pending',
    instructions: 'STUB — en production: USSD / push / redirection opérateur',
    _stub: true,
  });
});

/** POST /v1/webhooks/mobile-money */
router.post('/webhooks/mobile-money', (req, res) => {
  // TODO: valider signature agrégateur
  res.status(200).json({ received: true });
});

export default router;
