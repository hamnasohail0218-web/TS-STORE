require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const path = require('path');

const Admin = require('./models/Admin');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

// Serve the frontend (public/index.html, public/admin.html, images etc.)
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

async function ensureDefaultAdmin() {
  const count = await Admin.countDocuments();
  if (count === 0 && process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    await Admin.create({ email: process.env.ADMIN_EMAIL.toLowerCase(), password: hashed });
    console.log(`✔ Default admin created: ${process.env.ADMIN_EMAIL}`);
  }
}

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✔ Connected to MongoDB');
    await ensureDefaultAdmin();
    app.listen(PORT, () => console.log(`✔ Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('✗ Could not connect to MongoDB:', err.message);
    process.exit(1);
  });
