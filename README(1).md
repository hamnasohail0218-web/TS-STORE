# TS Store — Full Stack Setup Guide

Ye ek complete online store hai: real database, real orders, admin panel,
Cash on Delivery + Online payment (Stripe cards). Neeche step-by-step guide
hai — kisi bhi step pe atkein to wahin ruk jayein aur wahi bata dein.

## What's inside
```
server.js          -> main backend server
models/             -> database structure (Product, Order, Admin)
routes/              -> API endpoints
public/index.html    -> customer-facing store (frontend)
public/admin.html    -> admin dashboard (products + orders)
public/order-success.html
seed.js              -> fills sample products into your database
.env.example          -> copy this to .env and fill your own values
```

---

## STEP 1 — Free Database (MongoDB Atlas)

1. Go to https://www.mongodb.com/cloud/atlas/register and make a free account.
2. Create a free **M0 cluster** (no credit card needed).
3. Under "Database Access" — create a database user (username + password).
4. Under "Network Access" — click "Add IP Address" → "Allow access from anywhere" (0.0.0.0/0).
5. Click "Connect" → "Drivers" → copy the connection string. It looks like:
   `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/`
6. Add `tsstore` at the end before the `?`, e.g.
   `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/tsstore?retryWrites=true&w=majority`

---

## STEP 2 — Run it on your computer first (to test)

You need **Node.js** installed (download from nodejs.org, LTS version).

```bash
cd tsstore
npm install
cp .env.example .env
```

Open `.env` in a text editor and fill in:
- `MONGODB_URI` — the connection string from Step 1
- `JWT_SECRET` — any long random text (e.g. mash your keyboard)
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — your admin login (created automatically on first run)
- Leave `STRIPE_SECRET_KEY` empty for now — Cash on Delivery will still work fine

Then run:
```bash
npm run seed      # adds sample products to your database (run once)
npm start
```

Open your browser at **http://localhost:5000** — your store is live locally!
Admin panel: **http://localhost:5000/admin.html**

---

## STEP 3 — Put it online for free (Render.com)

Render's free tier is enough to start.

1. Create a free GitHub account (github.com) if you don't have one.
2. Create a new repository and upload this whole `tsstore` folder to it
   (GitHub's website lets you drag-and-drop files — no command line needed).
   **Important:** do NOT upload the `.env` file or `node_modules` folder —
   the `.gitignore` file already excludes them for you.
3. Go to https://render.com → sign up free → "New +" → "Web Service"
4. Connect your GitHub repo.
5. Settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Under "Environment", add the same variables from your `.env` file
   (MONGODB_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD, FRONTEND_URL,
   STRIPE_SECRET_KEY, PORT=5000).
   For `FRONTEND_URL`, use the Render URL Render gives you, e.g.
   `https://tsstore.onrender.com`
7. Click "Create Web Service". After a few minutes your site is live at
   a URL like `https://tsstore.onrender.com`.

Your customer site, admin panel, and backend are ALL on that one link
(no separate frontend hosting needed) — for example:
- Store: `https://tsstore.onrender.com`
- Admin: `https://tsstore.onrender.com/admin.html`

⚠️ Free Render services "sleep" after inactivity and take ~30-60 seconds
to wake up on the first visit. This is fine for starting out; you can
upgrade later ($7/month) to remove the delay.

---

## STEP 4 — Online Payments (optional, can add later)

**Cash on Delivery works immediately, no setup needed.**

For card payments, this project uses **Stripe** (easiest to set up, works
internationally with test/live cards):
1. Sign up free at https://dashboard.stripe.com/register
2. Get your **Secret Key** from Developers → API Keys
3. Add it as `STRIPE_SECRET_KEY` in your Render environment variables

**JazzCash / EasyPaisa** (for direct local Pakistani wallets) require you to
apply for a merchant account with them directly (business documents needed)
— once you have their API credentials, tell me and I'll wire that
integration into the same "Pay Online" button.

---

## Admin Panel — what you can do
- Add / delete products (with price, category, image link, badges)
- Mark products as "Trending" or "Best Seller"
- View every order placed, customer details, and update order status
  (placed → processing → shipped → delivered)

## Notes
- All product data, cart, and orders are now REAL — saved in MongoDB,
  not just in the browser.
- To change images: upload your product photos anywhere (e.g. imgur.com,
  or your own hosting) and paste the image URL in the admin "Image URL" field.
