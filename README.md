# ShopNest — Multi-Vendor Marketplace Platform

**ShopNest** is a full-stack multi-vendor e-commerce web application built with **React (Vite)**, **Node.js**, **Express 5**, and **MongoDB (Mongoose)**. Customers can browse category-curated catalogs and independent seller storefronts, manage wishlists and multi-vendor carts, and check out securely, while vendors manage inventory/orders and administrators govern the entire marketplace.

---

## Key Features

### Customer Experience
- Real-time product catalog search, category filtering, price/rating sorting, and pagination
- Independent Seller Storefronts directory and individual seller shops
- Product Quick View modal with live stock checks
- LocalStorage-persisted multi-vendor shopping cart and wishlist drawers
- Simulated Card / UPI / Cash-on-Delivery (COD) checkout with server-calculated totals & atomic stock decrement
- Customer **My Orders** view with item-level fulfillment tracking across vendors

### Vendor Portal (`/vendor` dashboard)
- Seller application workflow (`POST /api/vendors/apply`) with live approval/rejection/suspension feedback
- Product CRUD (create, edit, toggle active status, delete) scoped to the approved vendor
- Incoming vendor orders dashboard showing strictly the seller's own items + lifecycle status updates (`pending` -> `processing` -> `shipped` -> `delivered` / `cancelled`)
- Live vendor revenue, orders, pending fulfillment, and catalog metrics

### Admin Control Center
- **Overview KPIs**: Gross revenue, paid vs. COD pending revenue, order status breakdown, active sellers, users & catalog counts
- **Vendor Governance**: Approve, reject (with reason), suspend active stores, and reactivate suspended stores
- **Category Management**: Create, edit, hide/activate, and safely delete product categories
- **All Orders Monitor**: Filter by order/payment status, search by order `#` / buyer / city, inspect vendor split per order
- **User Directory**: Filter customers/vendors/admins and block/unblock user accounts safely

### Security & Validation
- Password hashing via `bcryptjs` + JWT authentication + role-based authorization (`customer`, `vendor`, `admin`)
- Declarative request body & Mongo ObjectId validation (`validateBody`, `validateObjectIdParam`)
- In-memory IP rate limiting on auth (`/api/auth/login`, `/api/auth/register`) and general `/api/*` routes
- Security headers via `helmet` and environment-driven `CLIENT_URL` CORS allowlist

---

## Tech Stack

- **Frontend:** React 19, Vite 8, Axios, Lucide React Icons, Custom Responsive CSS
- **Backend:** Node.js, Express 5, Mongoose 9, Helmet, CORS, Morgan, dotenv
- **Database:** MongoDB / MongoDB Atlas
- **Testing:** Node built-in `node:test` + `node:assert/strict` (API integration tests), ESLint, Vite Production Build

---

## Project Structure

```text
Multi-Vendor-Marketplace/
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB connection (db.js)
│   │   ├── controllers/     # Route handlers (auth, admin, vendor, product, category, order)
│   │   ├── middlewares/     # protect/authorize, validateBody, rateLimiter, errorHandler
│   │   ├── models/          # User, Vendor, Category, Product, Order schemas
│   │   ├── repositories/    # Mongoose data access layer
│   │   ├── routes/          # REST API route definitions
│   │   ├── scripts/         # seedAdmin.js, seedCategories.js, seedDemo.js
│   │   ├── services/        # Business logic & atomic stock/order services
│   │   ├── utils/           # ApiError, asyncHandler
│   │   ├── validations/     # Request validation schemas
│   │   └── app.js           # Express app configuration
│   ├── tests/
│   │   └── api.test.js      # Critical auth, RBAC, checkout & rate-limit integration tests
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/              # Static assets & banners
│   ├── src/
│   │   ├── api/             # Axios instance & public marketplace endpoints
│   │   ├── components/      # Storefront, Checkout, VendorDashboard, AdminVendors, Modals
│   │   ├── context/         # AuthContext (JWT & role persistence)
│   │   ├── App.jsx
│   │   └── App.css
│   ├── .env.example
│   ├── vercel.json          # Vercel SPA rewrite rules
│   ├── package.json
│   └── vite.config.js
├── docs/
│   ├── API_CONTRACTS.md
│   ├── IMPLEMENTATION_PLAN.md
│   ├── PROJECT_FLOW.md
│   └── ShopNest.postman_collection.json
├── render.yaml              # One-click Render Blueprint for backend
└── README.md
```

---

## Local Development Setup

### Prerequisites
- Node.js `>= 18` (LTS `20+` recommended)
- MongoDB Atlas connection URI (or local MongoDB instance)

### 1. Backend Setup
```bash
cd Multi-Vendor-Marketplace/backend
npm install
cp .env.example .env
```
Update `backend/.env` with your MongoDB Atlas URI, `JWT_SECRET`, `CLIENT_URL=http://localhost:5173`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`.

Seed Admin & Demo Marketplace Data:
```bash
npm run seedadmin      # Creates Admin account from .env
npm run seed:demo      # Seeds 8 categories, 8 sellers, 22 products, demo customer, pending vendor & sample orders
```

Start Backend Server:
```bash
npm run dev
```

### 2. Frontend Setup
```bash
cd Multi-Vendor-Marketplace/frontend
npm install
cp .env.example .env
```
Ensure `frontend/.env` points to your backend API (`VITE_API_URL=http://localhost:5000/api`), then run:
```bash
npm run dev
```

---

## Demo Accounts (After Running `npm run seedadmin` + `npm run seed:demo`)

| Role | Email | Password | Notes |
|---|---|---|---|
| **Admin** | *(from `ADMIN_EMAIL` in `backend/.env`)* | *(from `ADMIN_PASSWORD`)* | Full governance access |
| **Customer** | `customer@shopnest.com` | `Customer@123` | Pre-seeded with sample orders |
| **Approved Seller (Fashion)** | `fashion.seller@shopnest.com` | `Seller@123` | Store: `StyleHaven` |
| **Approved Seller (Handmade)** | `handmade.seller@shopnest.com` | `Seller@123` | Store: `The Clay Studio` |
| **Pending Seller** | `pending.seller@shopnest.com` | `Seller@123` | Ready for Admin approval review |

*(All 8 categories also have dedicated approved sellers `home.seller@shopnest.com`, `beauty.seller@shopnest.com`, `electronics.seller@shopnest.com`, `sports.seller@shopnest.com`, `toys.seller@shopnest.com`, `books.seller@shopnest.com` with password `Seller@123`.)*

---

## Verification & Automated Tests

```bash
# Backend critical API tests (Auth, RBAC, Checkout stock atomicity/rollback, Rate Limiter)
cd Multi-Vendor-Marketplace/backend
npm test

# Frontend ESLint + Production Build
cd Multi-Vendor-Marketplace/frontend
npm run lint
npm run build
```

---

## API Documentation & Postman

- Full endpoint specification: [docs/API_CONTRACTS.md](./docs/API_CONTRACTS.md)
- Importable Postman collection: [docs/ShopNest.postman_collection.json](./docs/ShopNest.postman_collection.json)

---

## Production Deployment Guide

### Step 1: Database (MongoDB Atlas)
1. Create a cluster in MongoDB Atlas and add your database user credentials.
2. Under **Network Access**, allow access from Render/Railway IPs (or `0.0.0.0/0` for dynamic cloud IPs).
3. Copy your connection string with database name (e.g. `.../shopnest?retryWrites=true&w=majority`).

### Step 2: Backend Deploy (Render / Railway)
- Using the included [render.yaml](./render.yaml) Blueprint (or manual Web Service with Root Directory `Multi-Vendor-Marketplace/backend`):
  - **Build Command:** `npm install`
  - **Start Command:** `npm start`
  - **Health Check Path:** `/api/health`
  - **Environment Variables:**
    - `MONGO_URI`
    - `JWT_SECRET`
    - `JWT_EXPIRES_IN=7d`
    - `CLIENT_URL=https://<your-vercel-domain>.vercel.app`
    - `ADMIN_EMAIL` & `ADMIN_PASSWORD` (to run `npm run seedadmin` / `npm run seed:demo` once via shell if desired)

### Step 3: Frontend Deploy (Vercel)
1. Import repository in Vercel and set **Root Directory** to `Multi-Vendor-Marketplace/frontend`.
2. Vercel auto-detects Vite + [frontend/vercel.json](./frontend/vercel.json) SPA routing.
3. Add Environment Variable:
   - `VITE_API_URL=https://<your-render-backend>.onrender.com/api`
4. Deploy, copy your final Vercel HTTPS domain, and set it as `CLIENT_URL` on Render/Railway so CORS allows your live frontend cleanly.
