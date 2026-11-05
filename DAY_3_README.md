# 📦 Day 3 — Categories & Products (Vendor Side)

Complete documentation and testing guide for **Day 3** of the Multi-Vendor Marketplace implementation.

---

## 🎯 What Was Built

### 1. Backend Models & Repositories
* **`Category` Model (`backend/src/models/Category.js`)**:
  - `name`: Category name (required, unique, trimmed).
  - `slug`: URL slug (required, unique, lowercase).
  - `icon`: Lucide icon name.
  - `image`: Category visual photo.
  - `description`: Category summary.
  - `isActive`: Boolean status toggle.
* **`Product` Model (`backend/src/models/Product.js`)**:
  - `title`: Product title (required, trimmed).
  - `description`: Detailed product description (required, trimmed).
  - `price`: Price in INR ₹ (required, positive).
  - `discount`: Discount percentage (0–99%).
  - `stock`: Available stock quantity (min 0).
  - `images`: Array of product image URLs (at least 1 image required).
  - `category`: ObjectId ref to `Category`.
  - `vendor`: ObjectId ref to `Vendor` (automatically assigned from logged-in vendor).
  - `rating`: Default 4.8.
  - `reviewsCount`: Number of reviews.
  - `isActive`: Boolean status.
  - Virtual `discountedPrice`: Automatically calculates net price.

### 2. Category Seed Script
* **`backend/src/scripts/seedCategories.js`**:
  - Automatically seeds the 8 marketplace categories:
    1. **Fashion** (`fashion`)
    2. **Home & Living** (`home-living`)
    3. **Beauty** (`beauty`)
    4. **Electronics** (`electronics`)
    5. **Sports** (`sports`)
    6. **Toys & Games** (`toys-games`)
    7. **Books** (`books`)
    8. **Handmade** (`handmade`)
  - Added npm command: `npm run seed:categories`.

### 3. API Endpoints
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/categories` | Public | List all active categories |
| `POST` | `/api/categories` | Admin | Create new category |
| `PUT` | `/api/categories/:id` | Admin | Update category details |
| `DELETE` | `/api/categories/:id` | Admin | Remove category |
| `GET` | `/api/vendor/products` | Approved Vendor | Get all products belonging to logged-in vendor |
| `POST` | `/api/vendor/products` | Approved Vendor | Create a new product listing |
| `PUT` | `/api/vendor/products/:id` | Approved Vendor | Edit an existing product (with ownership check) |
| `DELETE` | `/api/vendor/products/:id` | Approved Vendor | Delete an existing product (with ownership check) |

### 4. Frontend: Vendor Dashboard (`VendorDashboard.jsx`)
* **Real-time Product Metrics**: Dynamic catalog count directly linked to database.
* **Product Catalog Table**:
  - Image thumbnail, Title, Category badge, Price, Discount badge, Stock status (`In Stock`, `Low Stock`, `Out of Stock`), Status.
  - Instant Search Filter by title or category.
  - Action buttons: **Edit (✏️)** and **Delete (🗑️)**.
* **Add / Edit Product Modal**:
  - Form with Title, Category dropdown (from `/api/categories`), Price (₹), Discount (%), Stock Quantity, Multiple Image URLs, and Description.
  - **Live Image Preview box**: Real-time thumbnail preview as soon as an image URL is pasted.
* **Delete Confirmation Dialog**:
  - Confirmation alert before removing any product.

---

## 🧪 Verification & Testing Commands

### 1. Seed the 8 Categories into MongoDB:
```bash
cd backend
npm run seed:categories
```

### 2. Run the Frontend Build:
```bash
cd frontend
npm run build
```

### 3. Run Development Servers:
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

---

## 🚀 How to Test in Browser

1. Open `http://localhost:5173/`.
2. Login as an **approved vendor** (e.g. approved seller account from Day 2).
3. Click your profile dropdown in the Navbar and select **"Vendor Dashboard"**.
4. Click **"+ Add New Product"**:
   - Enter Title: `Handmade Ceramic Mug`
   - Select Category: `Home & Living`
   - Enter Price: `499`, Discount: `20`, Stock: `15`
   - Paste Image URL: `https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=700&q=80`
   - Notice the **Live Image Preview** immediately rendering the mug!
   - Click **"Create Product"**.
5. The product will immediately appear in your store catalog table!
6. Click **"Edit"** to modify price or stock.
7. Click **"Delete"** to test removing a product.

