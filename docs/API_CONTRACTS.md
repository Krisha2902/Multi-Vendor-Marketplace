# ShopNest — API Contracts

Base URL (local): `http://localhost:5000/api`  
Auth Header for protected routes: `Authorization: Bearer <jwt_token>`  
Collection import: [ShopNest.postman_collection.json](./ShopNest.postman_collection.json)

---

## 1. Health & Authentication

| Method | Endpoint | Access | Notes |
|---|---|---|---|
| `GET` | `/api/health` | Public | Returns `{ ok: true }` |
| `POST` | `/api/auth/register` | Public (Rate limited) | Body: `{ name, email, password }` (always creates `customer`) |
| `POST` | `/api/auth/login` | Public (Rate limited) | Body: `{ email, password }`; rejects disabled users (`403`) |
| `GET` | `/api/auth/me` | Protected | Returns logged-in `{ user }` |

---

## 2. Public Marketplace (Storefront)

| Method | Endpoint | Access | Notes |
|---|---|---|---|
| `GET` | `/api/categories` | Public | Lists active categories (`isActive: true`) |
| `GET` | `/api/categories/:id` | Public | Get category by ID |
| `GET` | `/api/products` | Public | Supports `search`, `category`, `vendor`, `featured`, `sort` (`newest`, `price_asc`, `price_desc`, `rating`), `page`, `limit` |
| `GET` | `/api/products/:id` | Public | Full product detail for active approved vendor listing |
| `GET` | `/api/sellers` | Public | Approved vendor storefronts + active product count |
| `GET` | `/api/sellers/:id` | Public | Vendor profile + active vendor products |

---

## 3. Customer Orders

| Method | Endpoint | Access | Notes |
|---|---|---|---|
| `POST` | `/api/orders` | Protected | Body: `{ items: [{ productId, quantity }], shippingAddress: { fullName, street, city, postalCode, phone? }, paymentMethod: 'card' \| 'upi' \| 'cod' }`. Server recomputes discounted totals and atomically decrements stock with rollback on failure. |
| `GET` | `/api/orders/my` | Protected | Orders created by current user |
| `GET` | `/api/orders/:id` | Protected | Single order by ObjectId or `orderNumber` (`customer`, involved `vendor`, or `admin`) |

---

## 4. Vendor Application & Seller Dashboard

| Method | Endpoint | Access | Notes |
|---|---|---|---|
| `POST` | `/api/vendors/apply` | Protected | Body: `{ shopName, category, description? }` (blocked for `admin` or `suspended` stores) |
| `GET` | `/api/vendors/me` | Protected | Current user's vendor store status & details |
| `GET` | `/api/vendor/products` | Vendor (`approved`) | Seller catalog & total count |
| `POST` | `/api/vendor/products` | Vendor (`approved`) | Body: `{ title, description, price, discount?, stock?, category, images }` |
| `PUT` | `/api/vendor/products/:id` | Vendor (`approved`, owner) | Updates owned product |
| `DELETE` | `/api/vendor/products/:id` | Vendor (`approved`, owner) | Deletes owned product |
| `GET` | `/api/vendor/orders` | Vendor (`approved`) | Customer orders scoped strictly to seller's own items |
| `PATCH` | `/api/vendor/orders/:id/status` | Vendor (`approved`) | Body: `{ status: 'pending' \| 'processing' \| 'shipped' \| 'delivered' \| 'cancelled', itemId? }` |
| `GET` | `/api/vendor/stats` | Vendor (`approved`) | `{ totalProducts, totalOrders, totalRevenue, pendingOrders }` |

---

## 5. Admin Control Center

All `/api/admin/*` endpoints require `admin` role (`protect`, `authorize('admin')`).

| Method | Endpoint | Access | Notes |
|---|---|---|---|
| `GET` | `/api/admin/stats` | Admin | Users, vendors, products, categories, order lifecycle & revenue KPIs |
| `GET` | `/api/admin/vendors` | Admin | Supports optional `status` filter (`pending`, `approved`, `suspended`, `rejected`) |
| `PATCH` | `/api/admin/vendors/:id/approve` | Admin | Approves vendor & promotes user role to `vendor` |
| `PATCH` | `/api/admin/vendors/:id/reject` | Admin | Body: `{ reason? }`; sets `rejected` & demotes non-admin user |
| `PATCH` | `/api/admin/vendors/:id/suspend` | Admin | Body: `{ reason? }`; sets `suspended` on approved vendor |
| `PATCH` | `/api/admin/vendors/:id/activate` | Admin | Reactivates `suspended` vendor back to `approved` |
| `GET` | `/api/admin/categories` | Admin | Lists both active & hidden categories |
| `POST` | `/api/admin/categories` | Admin | Body: `{ name, icon?, image?, description?, isActive? }` |
| `PUT` | `/api/admin/categories/:id` | Admin | Updates category metadata or active toggle |
| `DELETE` | `/api/admin/categories/:id` | Admin | Rejects delete (`400`) when products still reference category |
| `GET` | `/api/admin/orders` | Admin | Supports `status`, `paymentStatus`, `search`, `page`, `limit` |
| `GET` | `/api/admin/users` | Admin | Supports `role`, `isActive`, `search`, `page`, `limit` |
| `PATCH` | `/api/admin/users/:id/status` | Admin | Body: `{ isActive: boolean }`; prevents blocking self or admin accounts |

---

## 6. Security & Error Format

- **Validation (`400`) & Error Handling**: Central `errorHandler` returns `{ "success": false, "message": "<reason>" }` cleanly across Mongoose validation, cast, duplicate key (`409`), auth (`401`), RBAC (`403`), and request validation errors (`400`).
- **Rate Limiting (`429`)**:
  - `authLimiter`: `25` requests / 15 minutes per IP on `/api/auth/login` & `/api/auth/register`
  - `apiLimiter`: `300` requests / 15 minutes per IP across `/api/*` (excluding `/api/health`)
