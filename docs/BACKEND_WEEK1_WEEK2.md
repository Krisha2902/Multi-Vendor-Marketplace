# Backend – Week 1 & Week 2 (Priyanka's tasks)

Branch: `feature/priyanka-week1-backend`. Architecture used (same as auth):
`routes → controllers → services → repositories → models`.

## 1. Setup

```bash
cd backend
npm install
cp .env.example .env      # then fill the values; .env is git-ignored
```

Required in `backend/.env`: `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL`, plus
`SEED_VENDOR_PASSWORD` (min 6 chars) for the vendor seed. Never commit `.env`.

```bash
npm run seedcategories     # 8 categories (upsert by slug)
npm run seedvendors        # 4 vendor users + shop profiles (skips existing emails)
npm run seedproducts       # optional: 8 sample products so the product APIs return data
npm run verify:integrity   # read-only relationship check (exit code 1 if problems)
npm run dev                # start the API on PORT (default 5000)
```

All seeds can be run repeatedly; they never create duplicates. Vendor logins:
`stylehaven@vendora.test`, `techzone@vendora.test`, `cozyhome@vendora.test`, `fitlife@vendora.test`
with the password from `SEED_VENDOR_PASSWORD`.

## 2. Status checklist

| Task | Status |
|---|---|
| 1. Test routes | Done (`/api/health` already existed; added `/api/test/*`) |
| 1. Postman | Request folder provided as JSON; **must be merged into the team's existing collection** (see §6) |
| 2. Cart, OrderItem schemas | Done (draft) |
| 3. Seed scripts (vendors, categories) | Done; products seed is an optional extra |
| 4. Product list + detail APIs | Done |
| 5. Search + category filter (repository) | Done |
| 6. Relational integrity | Checker script + model review below |

## 3. Important dependency: placeholder models

On `main` and every remote branch only `User` existed. To make Week 1–2 work I added **draft**
`Category`, `Vendor` and `Product` models (field names follow `docs/IMPLEMENTATION_PLAN.md`, with
one deviation, see below). They are marked `DRAFT MODEL` at the top of each file. When the
teammates who own these push theirs, keep **their** file and make sure these fields still exist:

- `Product`: `name`, `description`, `price`, `originalPrice`, `stock`, `images`, `tags`, `category` (ref Category), `vendor` (ref **User**), `isActive`
- `Category`: `name`, `slug`, `isActive`
- `Vendor`: `user` (ref User), `shopName`

Deviation to agree with the team: the plan says product `title`; the frontend mock data and the
assignment say `name`, so I used `name`. If the team picks `title`, change it in
`product.repository.js` and `product.service.js` only.

## 4. OrderItem: embedded or separate? (recommendation)

`OrderItem.js` exports both `orderItemSchema` (to embed in `Order.items`, as the plan's Day 5 says)
and a model (separate `orderitems` collection). Recommendation: **separate collection** for a
multi-vendor marketplace, because vendors must list and update only their own items; with an
index on `vendor` that is one simple query, while embedded items need array filtering and
positional updates. Embedding is simpler for the customer's "My Orders" view. Both work; the
person who builds `Order` should choose one and tell the team. Prices are copied as snapshots
(`productName`, `unitPrice`) so old orders do not change when a product is edited.

## 5. API documentation

All responses are JSON with `success`. Errors use the existing handler: `{ "success": false, "message": "..." }`.

### Test routes
| Method & URL | Auth | Success |
|---|---|---|
| `GET /api/health` (existing) | none | 200 `{"ok":true}` |
| `GET /api/test/ping` | none | 200 `{"success":true,"message":"pong","time":"..."}` |
| `GET /api/test/db` | none | 200 `{"success":true,"database":"connected"}`; 503 `{"success":false,"database":"disconnected"}` |
| `GET /api/test/auth` | Bearer token | 200 `{"success":true,"message":"Token is valid","role":"customer"}`; 401 without token |
| `GET /api/test/vendor` | Bearer, vendor/admin | 200 `{"success":true,"message":"Vendor/admin access OK","role":"vendor"}`; 403 for customers |

### `GET /api/products`
Query: `page` (default 1), `limit` (default 12, max 50), `search` (optional, matches name, tags, description, case-insensitive), `category` (optional, a category slug or id).

- 400: `page`/`limit` not a positive whole number, `limit` > 50, repeated `search`/`category`, text too long.
- Blank `search`/`category` are ignored. Unknown category → 200 with empty list. Page beyond the last → 200 with empty list.

Example `GET /api/products?page=1&limit=2&category=electronics` (shape; values illustrative):
```json
{
  "success": true,
  "products": [
    {
      "id": "6650f0c2a1b2c3d4e5f60718",
      "name": "Wireless Earbuds",
      "description": "Noise-isolating earbuds with 24-hour charging case.",
      "price": 1799, "originalPrice": 2999, "discountPercent": 40,
      "stock": 40, "inStock": true, "images": [], "tags": ["audio", "bluetooth"],
      "category": { "id": "6650f0c2a1b2c3d4e5f60001", "name": "Electronics", "slug": "electronics" },
      "vendor": { "id": "6650f0c2a1b2c3d4e5f60002", "name": "Rohan Iyer", "shopName": "TechZone" },
      "createdAt": "2026-11-02T10:00:00.000Z"
    }
  ],
  "pagination": { "totalProducts": 2, "currentPage": 1, "pageSize": 2, "totalPages": 1 }
}
```

### `GET /api/products/:id`
- 200 `{ "success": true, "product": { ...same shape as above } }`
- 400 `{"success":false,"message":"Invalid product id"}` (not a 24-character hex id)
- 404 `{"success":false,"message":"Product not found"}` (missing or inactive)

Not exposed publicly: `isActive`, `__v`, vendor email or password, `updatedAt`.

## 6. Postman

Your repo does not contain a Postman collection, so I could not edit your existing one. Import
`docs/postman/Vendora-Week1-2-requests.postman_collection.json` only to copy its **folder**
"Week 1-2 Backend (Priyanka)" into your existing team collection (drag the folder across in
Postman). Do not keep it as a separate collection. It uses the variables `{{baseUrl}}`
(e.g. `http://localhost:5000`), `{{token}}`, `{{productId}}`; create them in your existing
environment if they are not there. Each request has basic test scripts for the status code.

## 7. Relational integrity review (Task 6)

Reviewed by reading the models and by `npm run verify:integrity` (needs a database).

- `Product.category` → `Category`, `Product.vendor` → `User`, `Cart.user` → `User`,
  `Cart.items.product` → `Product`, `Cart.items.vendor` → `User`, `OrderItem.product` → `Product`,
  `OrderItem.vendor` → `User`: all declared as `ObjectId` with `ref`. IDs in query strings are
  checked with a 24-hex regex before reaching MongoDB.
- `Cart` has a validation hook: every item's product must exist and `item.vendor` must equal
  that product's `vendor`. `OrderItem` has no such hook because it is created by the order
  service (not built yet); that service should copy `vendor` from the Product.
- Mongoose does **not** enforce references itself. Deleting a category or vendor leaves orphaned
  products; the checker reports them, and the product API then returns `category: null`
  instead of crashing.
- Inconsistencies found: (1) plan says product `title`, mock data says `name`; (2) the plan
  calls the product owner `vendor` but does not say whether it points to `User` or `Vendor`; I
  used `User` (the assignment says "Vendor User IDs"); (3) `Vendor` does not exist on `main`;
  (4) the plan keeps the cart in localStorage, so `Cart` is a draft that nothing calls yet.
- Search uses a case-insensitive regex (partial words work, but it cannot use an index). If the
  catalog grows large, switch to a MongoDB text index.

## 8. Testing performed (honest report)

MongoDB could not be started in my environment (the binary download is blocked), so **nothing that
touches the database has been executed**. Verified by running the real Express app without a DB:

| Check | Result |
|---|---|
| `/api/health`, `/api/test/ping` | 200 |
| `/api/test/db` with no DB | 503 `disconnected` |
| `/api/test/auth`, `/api/test/vendor` without token | 401 |
| `page=0`, `page=abc`, `limit=0`, `limit=51`, repeated `search` | 400 with message |
| `/api/products/123`, non-hex 24-char id | 400 `Invalid product id` |
| Cart: quantity 0 / negative price rejected; valid cart total computed | Pass |
| OrderItem: fractional quantity rejected; valid item `lineTotal`, default status | Pass |
| Search filter builder escapes regex characters | Pass |
| All seed scripts parse (`node --check`) | Pass |

**Not yet tested (please run locally):** the three seed scripts, their re-run idempotency, product
listing/detail with real data, search and category filtering, 404 for an unknown valid id, Cart's
reference hook, `verify:integrity`, and the login flow against `/api/test/auth` and `/api/test/vendor`.
The Postman requests in §6 cover these.

## 9. Pending / dependencies

- Teammates' real `Product`, `Category`, `Vendor` (and `Order`) models: replace the drafts, confirm field names.
- Decide `name` vs `title`, embedded vs separate `OrderItem`.
- Merge the Postman folder into the team collection.
- Cart routes/service (add/update/remove) are not in my assignment and not built.
