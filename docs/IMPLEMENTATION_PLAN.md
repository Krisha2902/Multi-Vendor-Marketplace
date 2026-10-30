# Vendora / ShopNest — 10 Day Solo Implementation Plan

> Ye plan ek akele developer ke liye hai. Frontend (React 19 + Vite) pehle se ready hai aur abhi `mockData.js` pe chalta hai. Backend (Express + MongoDB), auth, aur real data 10 din me banana hai.

---

## 1. Approach

Har din ek **vertical slice** hoga: backend API + usi din frontend integration. Isse har raat ko kuch working hota hai aur adhoora kaam nahi bachta.

> **Note:** Flow doc me project ka naam **Vendora** hai aur README me **ShopNest**. Ek naam final karke har jagah same use karein.

---

## 2. Scope

### Pakka karna hai
- Auth (JWT) aur 3 roles: Admin, Vendor, Customer
- Vendor registration → Admin approval
- Product CRUD (vendor)
- Search, category filter, pagination
- Checkout aur orders
- Vendor order fulfillment
- Admin dashboard

### Simple / mock rakhna hai
- **Payment:** real gateway nahi. COD aur simulated Card/UPI (order "paid" mark ho jaye)
- **Cart aur Wishlist:** frontend me localStorage. Checkout pe server validate karega
- **Clean Architecture:** simple layers `routes → controllers → services → repositories → models`
- **Newsletter, Follow Shop, Reviews:** mock hi rehne do. Time bacha to last me

---

## 3. Tech Stack

| Layer | Tools |
|---|---|
| Frontend | React 19, Vite, Lucide-react, Axios |
| Backend | Node.js, Express, Mongoose |
| Auth | JWT, bcrypt |
| Validation | zod ya joi |
| Security | helmet, cors, express-rate-limit |
| Images | Cloudinary + multer (ya simple image URL) |
| Database | MongoDB Atlas |
| Deploy | Render/Railway (backend), Vercel (frontend) |

---

## 4. Day-by-Day Plan

### Day 1 — Setup aur Authentication
- [x] API contract aur Mongo schemas finalize karna (pehle 1-2 ghante)
- [x] Backend setup: Express, Mongoose, dotenv, cors, helmet
- [x] Folder structure banana (section 5 dekhein)
- [x] MongoDB Atlas connect karna
- [x] User model: name, email, password, role
- [x] `POST /auth/register`, `POST /auth/login`, `GET /auth/me`
- [x] `auth` aur `role` middleware
- [x] Admin seed script
- [x] Frontend: AuthContext, axios instance, Login/Register modal

**End of day:** UI se login/register chalta hai aur token save hota hai.

### Day 2 — Vendor Flow
- [ ] Vendor model: shopName, category, description, status (`pending/approved/rejected`)
- [ ] `POST /vendors/apply`
- [ ] `PATCH /admin/vendors/:id/approve` aur `/reject`
- [ ] Frontend: `SellerModal.jsx` ko API se jodna
- [ ] Basic `/admin` page: applications list + approve/reject buttons
- [ ] Vendor Dashboard ka basic layout

**End of day:** Vendor apply karta hai, admin approve karta hai, vendor login karke dashboard dekh sakta hai.

### Day 3 — Categories aur Products (Vendor side)
- [ ] Category model + admin CRUD + 8 categories seed
- [ ] Product model: title, description, price, discount, stock, images, category, vendor
- [ ] Vendor product CRUD: `POST/PUT/DELETE /vendor/products`, `GET /vendor/products`
- [ ] Image upload (Cloudinary + multer, ya time kam ho to image URL)
- [ ] Vendor Dashboard: product list, add, edit, delete

**End of day:** Approved vendor apna product add/edit/delete kar sakta hai.

### Day 4 — Public Product APIs aur Frontend Integration
- [ ] `GET /products?search=&category=&page=&sort=`
- [ ] `GET /products/:id`
- [ ] Featured aur New Arrivals endpoints
- [ ] Sellers list aur seller detail endpoints
- [ ] Frontend se `mockData.js` hatana
- [ ] Hero search, CategoriesBar, FeaturedProducts, NewArrivals, FeaturedSellers, QuickViewModal ko real data se jodna

**End of day:** Home page poora real data pe chalta hai.

### Day 5 — Checkout aur Orders
- [ ] Order model: customer, items (product, vendor, qty, price, itemStatus), address, paymentMethod, paymentStatus, total, status
- [ ] `POST /orders`: stock check, price server se, total calculate, stock decrement
- [ ] Payment simulate (COD / Card / UPI)
- [ ] Frontend: `CheckoutModal` ko API se jodna
- [ ] Cart aur wishlist localStorage me persist

**End of day:** Customer order place kar sakta hai aur order ID DB se aata hai.

### Day 6 — Order Lifecycle
- [ ] `GET /orders/my` + "My Orders" page (list + detail)
- [ ] `GET /vendor/orders` (sirf apne items)
- [ ] `PATCH /vendor/orders/:id/status`: `pending → processing → shipped → delivered`
- [ ] Vendor dashboard me basic stats (total orders, revenue, products)

**End of day:** Order ka poora lifecycle chalta hai.

### Day 7 — Admin Dashboard
- [ ] `GET /admin/stats`: users, vendors, orders, revenue
- [ ] Vendors list: suspend / activate
- [ ] Category management UI
- [ ] All orders monitor
- [ ] Users list (optional: block/unblock)

**End of day:** Admin flow complete.

### Day 8 — Validation, Security, Polish
- [ ] Request validation (zod/joi) sab endpoints pe
- [ ] Global error handler
- [ ] Rate limiting (auth routes pe zaroor)
- [ ] Frontend protected routes (role-based)
- [ ] Loading, empty, error states
- [ ] Mobile responsive check

**End of day:** App stable aur secure.

### Day 9 — Testing aur Demo Data
- [ ] Poora end-to-end test: Admin → Vendor → Customer
- [ ] Bug fixing
- [ ] Demo seed data: 3 vendors, 20-30 products
- [ ] Postman collection
- [ ] 2-3 critical API tests (auth, checkout)

**End of day:** Demo-ready app.

### Day 10 — Deploy aur Documentation
- [ ] Backend deploy (Render/Railway), frontend deploy (Vercel), DB Atlas
- [ ] Environment variables set karna, CORS production URL ke liye
- [ ] Final README: setup steps, screenshots, API list
- [ ] Demo run-through
- [ ] **Buffer:** naya feature add nahi karna

**End of day:** Live link + documentation.

---

## 5. Backend Folder Structure

```
backend/
├── src/
│   ├── config/          # db, env, cloudinary
│   ├── models/          # User, Vendor, Category, Product, Order
│   ├── repositories/    # DB queries
│   ├── services/        # business logic
│   ├── controllers/     # req/res handling
│   ├── routes/          # auth, vendor, product, category, order, admin
│   ├── middlewares/     # auth, role, validate, errorHandler
│   ├── utils/
│   └── app.js
├── server.js
├── .env
└── package.json
```

---

## 6. API Endpoints

| Area | Endpoints |
|---|---|
| Auth | `POST /auth/register`, `POST /auth/login`, `GET /auth/me` |
| Vendor apply | `POST /vendors/apply` |
| Admin vendors | `PATCH /admin/vendors/:id/approve`, `PATCH /admin/vendors/:id/reject` |
| Categories | `GET /categories`, `POST/PUT/DELETE /admin/categories` |
| Public products | `GET /products?search=&category=&page=`, `GET /products/:id` |
| Vendor products | `POST/PUT/DELETE /vendor/products`, `GET /vendor/products` |
| Orders (customer) | `POST /orders`, `GET /orders/my` |
| Orders (vendor) | `GET /vendor/orders`, `PATCH /vendor/orders/:id/status` |
| Admin | `GET /admin/stats`, `GET /admin/orders` |

---

## 7. Rules (10 din me bachane ke liye)

1. Day 1 ke pehle 1-2 ghante me endpoints aur schemas finalize karo. Baad me change nahi.
2. Roz sone se pehle `git commit`. Din ka kaam working hona chahiye.
3. Kisi feature me 2 ghante se zyada atak jao to simple version rakho (jaise image upload ki jagah URL).
4. Day 5-6 tak 1 din peeche ho gaye to ye cut karo: Cloudinary (URL use karo), admin stats charts, API tests.
5. Day 10 buffer hai. Naya feature mat add karna.

---

## 8. Final Checklist (Demo se pehle)

- [ ] Vendor register → admin approve → vendor product add
- [ ] Customer search/filter → cart → checkout → order confirm
- [ ] Vendor order status update → customer "My Orders" me reflect
- [ ] Admin dashboard stats sahi dikha rahe hain
- [ ] Mobile pe UI theek hai
- [ ] Live link kaam kar raha hai
- [ ] README complete hai
