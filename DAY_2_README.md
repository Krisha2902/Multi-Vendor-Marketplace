# Day 2 Implementation: Vendor Flow (Vendora / ShopNest)

Ye document **Day 2: Vendor Flow** ke sabhi features, code changes, aur testing steps ko detail me explain karta hai.

---

## 📋 Day 2 Goal Summary

| Feature | Description | Status |
|---|---|---|
| **Vendor Model** | `user`, `shopName`, `category`, `description`, `status` (`pending`/`approved`/`rejected`) | ✅ Complete |
| **Apply API** | `POST /api/vendors/apply` (Protected) | ✅ Complete |
| **Admin APIs** | `GET /api/admin/vendors`, `PATCH /api/admin/vendors/:id/approve`, `PATCH /admin/vendors/:id/reject` | ✅ Complete |
| **Frontend SellerModal** | Real API integration, validation, pending review state, prefilled user info | ✅ Complete |
| **Admin Review Panel** | `/admin` view with live list, counters, and Approve/Reject buttons | ✅ Complete |
| **Vendor Dashboard** | Header, verified seller badge, metrics grid, Day 3 product roadmap banner | ✅ Complete |

---

## 📁 Files Created & Modified

### 1. Backend (`backend/`)
- `src/models/Vendor.js` *(Naya)*: Vendor Mongoose schema with user reference & status enum.
- `src/repositories/vendor.repository.js` *(Naya)*: DB layer queries (`createVendor`, `findByUserId`, `findById`, `findAll`, `updateStatus`).
- `src/repositories/user.repository.js` *(Update)*: `updateRole` helper function add kiya (customer -> vendor promotion ke liye).
- `src/services/vendor.service.js` *(Naya)*: Application check, re-application logic, approval, and user role update.
- `src/controllers/vendor.controller.js` *(Naya)*: `apply` aur `getMe` controllers.
- `src/controllers/admin.controller.js` *(Naya)*: `listVendors`, `approveVendor`, `rejectVendor` controllers.
- `src/routes/vendor.routes.js` *(Naya)*: `/apply` and `/me` routes with `protect` middleware.
- `src/routes/admin.routes.js` *(Naya)*: Admin vendor management routes with `protect` + `authorize('admin')`.
- `src/app.js` *(Update)*: `/api/vendors` aur `/api/admin` routes mount kiye.

### 2. Frontend (`frontend/`)
- `src/context/AuthContext.jsx` *(Update)*: `refreshUser()` method add kiya taaki role change turant sync ho jaye.
- `src/components/SellerModal.jsx` *(Update)*: Real API call (`POST /vendors/apply`), check if already pending/approved, auth requirement banner.
- `src/components/AdminVendors.jsx` *(Naya)*: Admin review portal: counters, status filters, approve/reject confirmation.
- `src/components/VendorDashboard.jsx` *(Naya)*: Approved vendor ka dashboard: stats, verified badge, Day 3 product teaser.
- `src/components/Navbar.jsx` *(Update)*: Role-based navigation buttons (`Admin Panel`, `Vendor Hub`), dropdown menu links.
- `src/App.jsx` *(Update)*: View routing for `'admin'` aur `'vendor-dashboard'` views.
- `src/App.css` *(Update)*: Admin, Vendor dashboard aur SellerModal ke complete modern styles.

---

## 🚀 Project Run Kese Karein

### 1. Backend Start Karein
```bash
cd backend
npm install
npm run dev
```
Backend `http://localhost:5000` par run hoga.

*(Agar pehle se admin create nahi kiya hai, to ek baar ye command run karein)*:
```bash
npm run seedadmin
```
> Admin credentials:
> - **Email**: `admin@vendora.com`
> - **Password**: `Admin@12345`

### 2. Frontend Start Karein
```bash
cd frontend
npm install
npm run dev
```
Frontend `http://localhost:5173` par open hoga.

---

## 🧪 Step-by-Step Testing Guide

Follow these 4 simple steps to test the entire Day 2 flow:

### Step 1: Customer Register / Login
1. Browser me `http://localhost:5173` open karein.
2. Top right me **"Sign In"** button par click karein.
3. **Register** tab par click karke ek naya customer account banayein (e.g. `rohit@example.com`, pass: `password123`).
4. Login hone ke baad Navbar me aapka naam dikhega with role **"customer"**.

### Step 2: Apply as a Seller
1. Navbar ya Banner me **"Become a Seller"** button par click karein.
2. `SellerModal` open hoga jisme aapka Name aur Email auto-fill honge.
3. Fill details:
   - **Shop / Brand Name**: `Artisan Clay Studio`
   - **Category**: `Home & Living`
   - **Bio**: `Handcrafted ceramic mugs and pottery.`
4. Click **"Submit Seller Application"**.
5. Modal par **"Application Submitted - Pending Admin Approval"** ka confirmation screen aayega.

### Step 3: Admin Login & Application Approval
1. Top right me user profile dropdown se **"Log Out"** karein.
2. **"Sign In"** par click karein aur demo admin credentials se login karein:
   - Email: `admin@vendora.com`
   - Password: `Admin@12345`
   - *(Tip: Auth modal me "Quick fill Admin login" button par bhi click kar sakte hain)*
3. Login hote hi Navbar me golden **"Admin Panel"** button dikhai dega.
4. Us par click karein — aap **Admin Review Portal** me pahunch jayenge.
5. Wahan `Artisan Clay Studio` ki pending application dikhegi.
6. **"Approve Vendor"** green button par click karein!
7. Application turant `APPROVED` ho jayegi aur applicant ka role MongoDB me `vendor` ban jayega.

### Step 4: Vendor Dashboard Access Verify Karein
1. Admin se **"Log Out"** karein.
2. Wapas pehle wale user account se login karein (`rohit@example.com`).
3. Ab Navbar me green color ka **"Vendor Hub"** button aur dropdown me **"Vendor Dashboard"** activate ho chuka hoga!
4. Click karein aur apna **Vendor Dashboard** dekhein (Store Name, Verified Seller Badge, Store Stats).

---

## 📡 API Reference (Day 2)

### 1. Vendor Apply
- **Endpoint**: `POST /api/vendors/apply`
- **Auth**: Bearer Token (`protect`)
- **Body**:
  ```json
  {
    "shopName": "My Store",
    "category": "Fashion",
    "description": "Premium linen clothing"
  }
  ```
- **Response**: `201 Created` with vendor object (`status: "pending"`).

### 2. Get Current Vendor Status
- **Endpoint**: `GET /api/vendors/me`
- **Auth**: Bearer Token (`protect`)
- **Response**: `200 OK` with user's vendor application / profile.

### 3. List Applications (Admin Only)
- **Endpoint**: `GET /api/admin/vendors?status=pending`
- **Auth**: Bearer Token + Role Admin (`protect`, `authorize('admin')`)
- **Response**: `200 OK` with applications array.

### 4. Approve Vendor (Admin Only)
- **Endpoint**: `PATCH /api/admin/vendors/:id/approve`
- **Auth**: Bearer Token + Role Admin
- **Response**: `200 OK` (updates vendor status to `approved` & promotes user role to `vendor`).

### 5. Reject Vendor (Admin Only)
- **Endpoint**: `PATCH /api/admin/vendors/:id/reject`
- **Auth**: Bearer Token + Role Admin
- **Body**: `{ "reason": "Store bio does not meet requirements" }`
- **Response**: `200 OK`.
