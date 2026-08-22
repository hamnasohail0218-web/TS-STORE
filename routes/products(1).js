const express = require('express');
const Product = require('../models/Product');
const requireAdmin = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/products              -> everyone can see all products
// GET /api/products?category=x   -> filter by category (used by category tiles)
// GET /api/products?section=trending / bestseller
router.get('/', async (req, res) => {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.section) filter.section = req.query.section;
  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.json(products);
});

// GET /api/products/:id -> single product detail
router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found.' });
  res.json(product);
});

// POST /api/products -> ADMIN ONLY: add a new product
router.post('/', requireAdmin, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/products/:id -> ADMIN ONLY: edit a product
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/products/:id -> ADMIN ONLY: remove a product
router.delete('/:id', requireAdmin, async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found.' });
  res.json({ message: 'Product deleted.' });
});

module.exports = router;
