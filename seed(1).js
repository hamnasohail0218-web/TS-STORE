// Run this once with: npm run seed
// It fills your database with the same sample products the demo site had.
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const sampleProducts = [
  { brand: 'Anker', name: '20W Fast Charger', category: 'charger', price: 1350, oldPrice: 1650, badge: 'Hot', section: 'trending' },
  { brand: 'Baseus', name: 'Wireless Earbuds Pro', category: 'earbuds', price: 3499, oldPrice: 3999, section: 'trending' },
  { brand: 'UGREEN', name: '20000mAh Power Bank', category: 'powerbank', price: 4499, section: 'trending' },
  { brand: 'Joyroom', name: 'Braided USB-C Cable', category: 'cable', price: 599, oldPrice: 699, section: 'trending' },
  { brand: 'Hoco', name: '10000mAh Power Bank', category: 'powerbank', price: 2999, badge: 'Best Seller', section: 'bestseller' },
  { brand: 'Remax', name: 'Clear Shockproof Case', category: 'case', price: 1099, oldPrice: 1299, section: 'bestseller' },
  { brand: 'Anker', name: '30W GaN Charger', category: 'charger', price: 2199, section: 'bestseller' },
  { brand: 'Baseus', name: 'ANC Earbuds', category: 'earbuds', price: 4999, section: 'bestseller' },
];

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    await Product.deleteMany({});
    await Product.insertMany(sampleProducts);
    console.log(`✔ Inserted ${sampleProducts.length} sample products.`);
    process.exit(0);
  })
  .catch((err) => {
    console.error('✗ Seeding failed:', err.message);
    process.exit(1);
  });
