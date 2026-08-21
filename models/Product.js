const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  name: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ['charger', 'cable', 'powerbank', 'case', 'earbuds', 'battery'],
  },
  price: { type: Number, required: true },
  oldPrice: { type: Number, default: null },
  image: { type: String, default: '' }, // image URL
  badge: { type: String, default: '' }, // e.g. "Hot", "Best Seller"
  section: {
    type: String,
    enum: ['trending', 'bestseller', 'none'],
    default: 'none',
  },
  stock: { type: Number, default: 50 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', productSchema);
