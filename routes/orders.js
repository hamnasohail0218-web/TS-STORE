const express = require('express');
const Order = require('../models/Order');
const requireAdmin = require('../middleware/authMiddleware');

const router = express.Router();

// Stripe is only initialized if a real key is provided, so COD still works
// even before you've set up online payments.
let stripe = null;
if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.startsWith('sk_')) {
  stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
}

// POST /api/orders -> customer places an order (COD or online)
router.post('/', async (req, res) => {
  const { items, total, customer, paymentMethod } = req.body;

  if (!items || !items.length || !customer || !paymentMethod) {
    return res.status(400).json({ message: 'Missing order details.' });
  }

  try {
    const order = await Order.create({
      items,
      total,
      customer,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
    });

    // Cash on Delivery -> order is placed immediately, nothing more to do
    if (paymentMethod === 'cod') {
      return res.status(201).json({ order, checkoutUrl: null });
    }

    // Online payment -> create a Stripe Checkout session and send the
    // customer to Stripe's secure payment page
    if (paymentMethod === 'online') {
      if (!stripe) {
        return res.status(400).json({
          message: 'Online payment is not configured yet on the server. Please set STRIPE_SECRET_KEY in .env, or choose Cash on Delivery.',
        });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: items.map((i) => ({
          price_data: {
            currency: 'pkr',
            product_data: { name: `${i.brand} ${i.name}` },
            unit_amount: Math.round(i.price * 100),
          },
          quantity: i.qty,
        })),
        success_url: `${process.env.FRONTEND_URL}/order-success.html?orderId=${order._id}`,
        cancel_url: `${process.env.FRONTEND_URL}/index.html`,
      });

      order.stripeSessionId = session.id;
      await order.save();

      return res.status(201).json({ order, checkoutUrl: session.url });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/:id -> check status of one order (used by success page)
router.get('/:id', async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found.' });
  res.json(order);
});

// GET /api/orders -> ADMIN ONLY: see every order
router.get('/', requireAdmin, async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

// PUT /api/orders/:id -> ADMIN ONLY: update order/payment status
router.put('/:id', requireAdmin, async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!order) return res.status(404).json({ message: 'Order not found.' });
  res.json(order);
});

module.exports = router;
