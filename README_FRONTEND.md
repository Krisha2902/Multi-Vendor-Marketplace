# 🛍️ ShopNest — Multi-Vendor Marketplace Frontend

> Yeh documentation file **ShopNest** frontend ke features, architecture, aur working functionalities ko explain karti hai jo reference UI design ke mutabiq develop ki gayi hain.

---

## 📌 1. Overview (Kya Banaya Gaya Hai)

Reference screenshot ke mutabiq **ShopNest** ka ek modern, warm-toned, aur high-aesthetic multi-vendor e-commerce frontend tayyar kiya gaya hai. Isme clean Scandinavian / Japandi visual language, curated color palette, smooth micro-interactions, aur complete end-to-end user flows shaamil hain.

### 🎨 Design System & Visual Tokens:
* **Typography:**
  * **Headings:** Google Font `'Playfair Display'` (Editorial Serif)
  * **Body & UI Elements:** Google Font `'Plus Jakarta Sans'` (Modern Clean Sans-Serif)
* **Color Palette:**
  * **Page Background:** Warm Linen Cream (`#faf8f5`)
  * **Cards Background:** Pure White (`#ffffff`) with subtle warm borders (`#ebe6dd`)
  * **Primary Buttons & Dark Accents:** Deep Forest Green (`#20392c` / `#172c22`)
  * **Secondary / Warm Accents:** Terracotta Orange (`#e07a5f` / `#cf633a`)
  * **Vendor Banner:** Soft Warm Peach (`#f3e5d7`)
  * **Footer:** Rich Dark Olive Charcoal (`#28271e`)
* **Custom Assets Generated:**
  * `public/hero-banner.jpg` — Cozy Scandinavian interior with ceramic vase, eucalyptus branches, and glowing candle.
  * `public/seller-illustration.jpg` — Warm artisan craftsman illustration wearing an apron and welcoming customers.

---

## 🏗️ 2. Structure & Sections (Kahan Kya Hai)

| Section | Component File | Description |
| :--- | :--- | :--- |
| **Top Navbar** | [`Navbar.jsx`](file:///c:/alexora/Multi-Vendor-Marketplace/frontend/src/components/Navbar.jsx) | Brand Logo, Navigation Links, Global Search, Wishlist & Cart Counters, Profile Avatar, Mobile Menu |
| **Hero Banner** | [`HeroSection.jsx`](file:///c:/alexora/Multi-Vendor-Marketplace/frontend/src/components/HeroSection.jsx) | High-res background image, serif headline, subtitle, search input with 'Search' button, trending tags |
| **Category Icons** | [`CategoriesBar.jsx`](file:///c:/alexora/Multi-Vendor-Marketplace/frontend/src/components/CategoriesBar.jsx) | 8 pastel circular category buttons with smooth hover and active state filters |
| **Featured Products** | [`FeaturedProducts.jsx`](file:///c:/alexora/Multi-Vendor-Marketplace/frontend/src/components/FeaturedProducts.jsx) | 4-card grid with badges (Bestseller, New, Best Value, Top Rated), prices in ₹, ratings, wishlist toggle |
| **Featured Sellers** | [`FeaturedSellers.jsx`](file:///c:/alexora/Multi-Vendor-Marketplace/frontend/src/components/FeaturedSellers.jsx) | 3 artisan shop cards with avatar, star rating (★ 4.9, 120+), and 3 product preview thumbnails |
| **New Arrivals** | [`NewArrivals.jsx`](file:///c:/alexora/Multi-Vendor-Marketplace/frontend/src/components/NewArrivals.jsx) | 4-card grid (Tote Bag, Ceramic Mug, Wireless Earbuds, Leather Notebook) with live card actions |
| **Join as a Seller** | [`JoinSellerBanner.jsx`](file:///c:/alexora/Multi-Vendor-Marketplace/frontend/src/components/JoinSellerBanner.jsx) | Vendor onboarding banner with warm peach aesthetic, call-to-action button, and craftsman art |
| **Why Choose ShopNest**| [`TrustSection.jsx`](file:///c:/alexora/Multi-Vendor-Marketplace/frontend/src/components/TrustSection.jsx) | 3 Trust pillars: Support Small Businesses, Safe & Secure Payments, Worldwide Shipping |
| **Footer** | [`Footer.jsx`](file:///c:/alexora/Multi-Vendor-Marketplace/frontend/src/components/Footer.jsx) | Newsletter subscription, nav links, payment method badges (Visa, MC, Amex, Discover), social links, copyright |
| **Shopping Cart** | [`CartDrawer.jsx`](file:///c:/alexora/Multi-Vendor-Marketplace/frontend/src/components/CartDrawer.jsx) | Slide-over drawer with item management, quantity controls, shipping meter, subtotal & checkout CTA |
| **Wishlist Drawer** | [`WishlistDrawer.jsx`](file:///c:/alexora/Multi-Vendor-Marketplace/frontend/src/components/WishlistDrawer.jsx) | Slide-over drawer with saved items, remove option, and 1-click 'Move to Cart' |
| **Product Quick View** | [`QuickViewModal.jsx`](file:///c:/alexora/Multi-Vendor-Marketplace/frontend/src/components/QuickViewModal.jsx) | Popup modal with product image, description, rating breakdown, stock status, discount, qty, and Add to Cart |
| **Seller Showcase** | [`SellerDetailModal.jsx`](file:///c:/alexora/Multi-Vendor-Marketplace/frontend/src/components/SellerDetailModal.jsx) | Dedicated modal showing full artisan vendor profile, badges, location, reviews, and collection |
| **Seller Onboarding** | [`SellerModal.jsx`](file:///c:/alexora/Multi-Vendor-Marketplace/frontend/src/components/SellerModal.jsx) | Vendor registration form with shop name, category, description, and instant submission feedback |
| **Secure Checkout** | [`CheckoutModal.jsx`](file:///c:/alexora/Multi-Vendor-Marketplace/frontend/src/components/CheckoutModal.jsx) | Full order checkout modal with address input, payment method choice (Card, UPI, COD), and order confirmation |
| **Live Notifications** | [`Toast.jsx`](file:///c:/alexora/Multi-Vendor-Marketplace/frontend/src/components/Toast.jsx) | Floating toast notifications for cart updates, wishlist actions, newsletter signups, and orders |

---

## ⚡ 3. Working Features (Kya Kya Kaam Kar Raha Hai)

### 🛒 1. Interactive Shopping Cart
* **Live Counter:** Navbar me shopping cart icon ke upar real-time quantity badge show hota hai.
* **Slide-over Drawer:** Cart icon par click karne se slide-out panel smoothly right side se open hota hai.
* **Quantity Controls:** Kisi bhi item ki quantity badha (`+`) ya ghata (`-`) sakte hain.
* **Delete Item:** Trash button par click karke item cart se remove ho jaata hai.
* **Free Shipping Meter:** 
  * Agar subtotal ₹2,000 se kam hai to meter batata hai ki free shipping ke liye aur kitne rupees chahiye.
  * ₹2,000 poore hone par *"🎉 You unlocked FREE Worldwide Shipping!"* message show hota hai.
* **Live Subtotal:** Cart ke items ke hisaab se total calculation turant update hoti hai.
* **Empty Cart State:** Agar cart khaali ho jaye to clean empty illustration aur *"Continue Shopping"* button display hota hai.

### ❤️ 2. Wishlist Management
* **Heart Toggle:** Kisi bhi product card ke top-right heart icon par click karke item wishlist me add ya remove ho jaata hai.
* **Navbar Badge:** Saved items ka live count navbar me red/terracotta badge ke roop me dikhta hai.
* **Wishlist Drawer:** Navbar ke heart icon par click karne se saved items drawer khulta hai.
* **1-Click Move to Cart:** Wishlist drawer se direct kisi bhi item ko shopping cart me shift kiya ja sakta hai.

### 🔍 3. Real-Time Search & Category Filtering
* **Global Search Bar:** Navbar ya Hero section ke search box me type karne par product grid instantly filter hoti hai.
* **Category Bar:** 8 categories (*Fashion, Home & Living, Beauty, Electronics, Sports, Toys & Games, Books, More*) me se kisi par bhi click karne se sirf us category ke products filter ho jaate hain.
* **Active Filter Bar:** Agar search ya category active hai to ek clear notification pill aati hai jisme *"Clear filters"* par click karke original list restore ho jaati hai.
* **Trending Tags:** Hero section ke *"Ceramic Pots"*, *"Floral Dresses"*, *"Leather Journal"* tags par click karne se instant filter trigger hota hai.

### 🔍 4. Product Quick View Modal
* Card par click karne par ya **"Quick View"** button par hover karke click karne par detailed popup modal open hota hai.
* Isme high-resolution product image, vendor verification badge, star rating with reviews count, discounted price calculation (% off), product tags, stock information, aur quantity selector diya gaya hai.
* Direct **"Add to Cart"** aur **"Save to Wishlist"** buttons kaam karte hain.

### 👨‍🌾 5. Featured Seller Showcase
* Featured Sellers section ke kisi bhi card (*The Clay Studio*, *Green Bloom*, *Threads & Co.*) par click karne par seller ka detailed modal open hota hai.
* Isme seller ka verified badge, location, star ratings, products count, **"Follow Shop"** button, aur unki handmade collection display hoti hai.

### 📝 6. "Join as a Seller" Onboarding Flow
* Hero section ya banner ke **"Join as a Seller"** button par click karne se vendor application modal khulta hai.
* Isme Full Name, Shop Name, Email, Primary Category, aur Product description form fields hain.
* Form submit karne par real-time success screen aati hai jo batati hai ki application receive ho chuki hai.

### 💳 7. End-to-End Checkout Simulation
* Cart drawer se **"Proceed to Checkout"** par click karne par secure checkout dialog khulta hai.
* **Step 1:** Customer Delivery Address (Full Name, Street Address, City, Postal Code).
* **Step 2:** Payment Method selection:
  * Credit / Debit Card (Visa, MC, Amex)
  * UPI (GPay / PhonePe / Paytm)
  * Cash on Delivery (COD)
* **Step 3:** Right side order summary with free delivery tag and grand total.
* **Step 4:** **"Place Order & Pay"** par click karne par instant order confirmation screen aati hai with unique Order ID (`#SN-2024-8921`).

### 🔔 8. Interactive Toast Notifications
* Cart me item add hone par, wishlist me save hone par, newsletter subscribe karne par, aur order place hone par automatic floating toast notification bottom-right corner me display hota hai aur 3.8 seconds baad auto-dismiss hota hai.

---

## 🚀 4. How to Run Locally (Project Chalane Ka Tarika)

### Prerequisites:
* Node.js (v18 ya higher)
* npm

### Steps:
1. Terminal open karein aur `frontend` folder me navigate karein:
   ```bash
   cd c:\alexora\Multi-Vendor-Marketplace\frontend
   ```

2. Dependencies install karein (agar pehle nahi hui hain):
   ```bash
   npm install
   ```

3. Development Server start karein:
   ```bash
   npm run dev
   ```

4. Apne browser me open karein:
   ```
   http://localhost:5173/
   ```

5. Production build test karne ke liye:
   ```bash
   npm run build
   ```

---

## 📂 5. File Architecture Summary

```
frontend/
├── public/
│   ├── hero-banner.jpg          # Generated cozy Scandinavian Japandi hero banner
│   └── seller-illustration.jpg  # Generated friendly craftsman artisan illustration
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Navbar.jsx           # Sticky header, search, badges, mobile drawer
│   │   ├── HeroSection.jsx      # Warm aesthetic hero banner with search & tags
│   │   ├── CategoriesBar.jsx    # 8 circular pastel category filters
│   │   ├── ProductCard.jsx      # Individual card with image, price, rating, badges
│   │   ├── FeaturedProducts.jsx # 4-column featured product showcase
│   │   ├── FeaturedSellers.jsx  # 3-artisan seller cards with 3-photo previews
│   │   ├── NewArrivals.jsx      # New arrivals showcase matching screenshot
│   │   ├── JoinSellerBanner.jsx # Peach banner with artisan illustration & modal trigger
│   │   ├── TrustSection.jsx     # 'Why Choose ShopNest?' trust pillars
│   │   ├── Footer.jsx           # Dark olive footer with newsletter & payment badges
│   │   ├── CartDrawer.jsx       # Slide-over cart with shipping meter & qty controls
│   │   ├── WishlistDrawer.jsx   # Slide-over saved items with 1-click move to cart
│   │   ├── QuickViewModal.jsx   # Modal with full product specifications & add to cart
│   │   ├── SellerModal.jsx      # Vendor registration & onboarding modal form
│   │   ├── SellerDetailModal.jsx# Artisan seller profile & collection modal
│   │   ├── CheckoutModal.jsx    # Complete address, payment method & order flow
│   │   └── Toast.jsx            # Toast alert notification component
│   ├── data/
│   │   └── mockData.js          # Products, sellers, categories & trust items data
│   ├── App.css                  # Custom CSS matching exact screenshot aesthetics
│   ├── index.css                # Base tokens, fonts, and reset styles
│   ├── App.jsx                  # Main application state & assembling root
│   └── main.jsx                 # React root mount
├── index.html                   # Fonts (Playfair Display & Plus Jakarta Sans)
└── package.json                 # Dependencies (React 19, Lucide-react, Vite)
```
