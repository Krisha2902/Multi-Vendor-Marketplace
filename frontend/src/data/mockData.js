// Mock data matching the ShopNest marketplace design exactly

export const CATEGORIES = [
  { id: 'fashion', name: 'Fashion', icon: 'Shirt', color: '#e8e5e0', activeColor: '#d6cfc4' },
  { id: 'home', name: 'Home & Living', icon: 'Armchair', color: '#ede3d5', activeColor: '#dfd1be' },
  { id: 'beauty', name: 'Beauty', icon: 'Sparkles', color: '#fae3e3', activeColor: '#f3c7c7' },
  { id: 'electronics', name: 'Electronics', icon: 'Smartphone', color: '#e0eaf3', activeColor: '#c5daf0' },
  { id: 'sports', name: 'Sports', icon: 'Dumbbell', color: '#e0f1eb', activeColor: '#c3e7da' },
  { id: 'toys', name: 'Toys & Games', icon: 'Gamepad2', color: '#fbe8dc', activeColor: '#f7d3bb' },
  { id: 'books', name: 'Books', icon: 'BookOpen', color: '#fbe0e2', activeColor: '#f6c5c8' },
  { id: 'more', name: 'More', icon: 'MoreHorizontal', color: '#e6eaf0', activeColor: '#ccd4df' },
];

export const FEATURED_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Floral Midi Dress',
    seller: 'StyleHaven',
    sellerId: 'seller-3',
    price: 1499,
    originalPrice: 2199,
    rating: 4.8,
    reviews: 124,
    badge: 'Bestseller',
    badgeType: 'bestseller',
    category: 'fashion',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=700&q=80',
    description: 'Breezy bohemian floral midi dress crafted from breathable organic cotton blend. Features a delicate v-neckline and tiered skirt.',
    stock: 18,
    tags: ['Floral', 'Summer', 'Organic Cotton', 'Midi']
  },
  {
    id: 'prod-2',
    name: 'Smart Watch (Black)',
    seller: 'TechZone',
    sellerId: 'seller-2',
    price: 2999,
    originalPrice: 4499,
    rating: 4.8,
    reviews: 58,
    badge: 'New',
    badgeType: 'new',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=700&q=80',
    description: 'Sleek matte black smartwatch with AMOLED display, 24/7 heart-rate tracking, sleep insights, and 7-day battery life.',
    stock: 24,
    tags: ['Fitness', 'Bluetooth 5.3', 'Water Resistant']
  },
  {
    id: 'prod-3',
    name: 'Ceramic Plant Pot',
    seller: 'CozyHome',
    sellerId: 'seller-1',
    price: 799,
    originalPrice: 1199,
    rating: 4.7,
    reviews: 36,
    badge: 'Best Value',
    badgeType: 'best-value',
    category: 'home',
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=700&q=80',
    description: 'Handcrafted stoneware ceramic planter pot with minimal vertical fluting and built-in drainage saucer for thriving indoor plants.',
    stock: 35,
    tags: ['Handcrafted', 'Ceramic', 'Indoor Plant']
  },
  {
    id: 'prod-4',
    name: 'Running Shoes',
    seller: 'FitLife',
    sellerId: 'seller-2',
    price: 2499,
    originalPrice: 3899,
    rating: 4.9,
    reviews: 203,
    badge: 'Top Rated',
    badgeType: 'top-rated',
    category: 'sports',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80',
    description: 'Ultra-lightweight road running shoes with responsive foam cushioning and breathable engineered mesh upper for maximum daily comfort.',
    stock: 12,
    tags: ['Cushioned', 'Lightweight', 'Breathable']
  }
];

export const FEATURED_SELLERS = [
  {
    id: 'seller-1',
    name: 'The Clay Studio',
    rating: '4.9 (120+)',
    ratingScore: 4.9,
    reviewsCount: 120,
    avatar: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=180&q=80',
    category: 'Handmade Ceramics & Pottery',
    location: 'Jaipur, India',
    joined: 'Member since 2022',
    productsCount: 48,
    thumbnails: [
      {
        id: 'cs-1',
        title: 'Terracotta Jug',
        image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=300&q=80'
      },
      {
        id: 'cs-2',
        title: 'Dried Flora Vase',
        image: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=300&q=80'
      },
      {
        id: 'cs-3',
        title: 'Mini Potted Plant',
        image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=300&q=80'
      }
    ]
  },
  {
    id: 'seller-2',
    name: 'Green Bloom',
    rating: '4.9 (120+)',
    ratingScore: 4.9,
    reviewsCount: 120,
    avatar: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=180&q=80',
    category: 'Eco-Living & Artisan Goods',
    location: 'Bangalore, India',
    joined: 'Member since 2021',
    productsCount: 65,
    thumbnails: [
      {
        id: 'gb-1',
        title: 'Organic Dress',
        image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=300&q=80'
      },
      {
        id: 'gb-2',
        title: 'Stoneware Bottle',
        image: 'https://images.unsplash.com/photo-1606744888344-493238955de0?auto=format&fit=crop&w=300&q=80'
      },
      {
        id: 'gb-3',
        title: 'Leather Goods',
        image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=300&q=80'
      }
    ]
  },
  {
    id: 'seller-3',
    name: 'Threads & Co.',
    rating: '4.9 (120+)',
    ratingScore: 4.9,
    reviewsCount: 120,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=180&q=80',
    category: 'Artisanal Apparel & Home Scents',
    location: 'Pondicherry, India',
    joined: 'Member since 2023',
    productsCount: 39,
    thumbnails: [
      {
        id: 'tc-1',
        title: 'Handmade Mug',
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=300&q=80'
      },
      {
        id: 'tc-2',
        title: 'Soy Pillar Candles',
        image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=300&q=80'
      },
      {
        id: 'tc-3',
        title: 'Leather Sandals',
        image: 'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=300&q=80'
      }
    ]
  }
];

export const NEW_ARRIVALS = [
  {
    id: 'arr-1',
    name: 'Tote Bag',
    seller: 'StyleHaven',
    sellerId: 'seller-3',
    price: 1499,
    originalPrice: 1999,
    rating: 4.5,
    reviews: 104,
    category: 'fashion',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=700&q=80',
    description: 'Minimalist 100% natural cotton canvas tote bag with reinforced handles. Generous everyday capacity for groceries, books, and laptops.',
    stock: 40,
    tags: ['Eco-friendly', 'Canvas', 'Reusable']
  },
  {
    id: 'arr-2',
    name: 'Ceramic Mug',
    seller: 'The Clay Studio',
    sellerId: 'seller-1',
    price: 799,
    originalPrice: 1050,
    rating: 4.5,
    reviews: 86,
    category: 'home',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=700&q=80',
    description: 'Artisan wheel-thrown ceramic coffee mug featuring an unglazed tactile clay base and smooth speckled cream reactive glaze.',
    stock: 22,
    tags: ['Pottery', 'Coffee', 'Dishwasher Safe']
  },
  {
    id: 'arr-3',
    name: 'Wireless Earbuds',
    seller: 'TechZone',
    sellerId: 'seller-2',
    price: 799,
    originalPrice: 1599,
    rating: 4.7,
    reviews: 36,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=700&q=80',
    description: 'True wireless in-ear headphones with touch controls, instant pairing, deep bass, and 28-hour total playback with charging case.',
    stock: 19,
    tags: ['Wireless', 'Active Noise Canceling', 'Hi-Fi']
  },
  {
    id: 'arr-4',
    name: 'Leather Notebook',
    seller: 'FitLife',
    sellerId: 'seller-2',
    price: 2499,
    originalPrice: 3200,
    rating: 4.5,
    reviews: 303,
    category: 'books',
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=700&q=80',
    description: 'Vintage handcrafted full-grain leather bound journal with unlined antique cotton parchment paper and wraparound leather strap.',
    stock: 15,
    tags: ['Genuine Leather', 'Handmade Paper', 'Vintage']
  }
];

export const TRUST_POINTS = [
  {
    id: 1,
    title: 'Support Small Businesses',
    desc: 'Every purchase directly supports independent makers and local entrepreneurs.',
    icon: 'HeartHandshake'
  },
  {
    id: 2,
    title: 'Safe & Secure Payments',
    desc: 'Bank-grade 256-bit SSL encryption and verified checkout gateways.',
    icon: 'ShieldCheck'
  },
  {
    id: 3,
    title: 'Worldwide Shipping',
    desc: 'Fast, insured doorstep delivery with live tracking across all states and abroad.',
    icon: 'Globe'
  }
];


export const SHOP_CATALOG_PRODUCTS = [
  {
    id: 'shop-1',
    name: 'Bow Tote Bag',
    seller: 'StyleStudio',
    brand: 'StyleStudio',
    price: 799,
    originalPrice: 999,
    discount: '20% OFF',
    rating: 4.8,
    reviews: 1200,
    category: 'fashion',
    categoryName: 'Fashion',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=700&q=80',
    description: 'Charming minimalist bow-accent canvas tote bag. Crafted from sturdy natural cotton canvas with reinforced stitching.'
  },
  {
    id: 'shop-2',
    name: 'Wireless Headphones',
    seller: 'TechNest',
    brand: 'Sony',
    price: 2499,
    originalPrice: 3499,
    discount: '29% OFF',
    rating: 4.7,
    reviews: 856,
    category: 'electronics',
    categoryName: 'Electronics',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80',
    description: 'Matte off-white over-ear wireless headphones with deep bass response, plush memory foam earcups, and 30hr battery life.'
  },
  {
    id: 'shop-3',
    name: 'Ceramic Plant Pot',
    seller: 'UrbanCraft',
    brand: 'UrbanCraft',
    price: 599,
    originalPrice: 799,
    discount: '25% OFF',
    rating: 4.9,
    reviews: 420,
    category: 'home',
    categoryName: 'Home & Living',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=700&q=80',
    description: 'Smooth white ceramic planter with attached saucer for easy indoor houseplant drainage and minimalist aesthetic.'
  },
  {
    id: 'shop-4',
    name: 'Floral Perfume',
    seller: 'BloomBeauty',
    brand: 'Zara',
    price: 1299,
    originalPrice: 1899,
    discount: '32% OFF',
    rating: 4.7,
    reviews: 610,
    category: 'beauty',
    categoryName: 'Beauty',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=700&q=80',
    description: 'Elegant amber glass bottled artisanal fragrance infused with delicate notes of jasmine, peony petals, and fresh pear.'
  },
  {
    id: 'shop-5',
    name: 'Sports Sneakers',
    seller: 'FitZone',
    brand: 'Nike',
    price: 1999,
    originalPrice: 2999,
    discount: '33% OFF',
    rating: 4.6,
    reviews: 932,
    category: 'sports',
    categoryName: 'Sports',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80',
    description: 'Lightweight active lifestyle running sneakers with responsive foam sole and breathable grey and black mesh upper.'
  },
  {
    id: 'shop-6',
    name: 'Teddy Bear',
    seller: 'DreamToys',
    brand: 'Others',
    price: 699,
    originalPrice: 999,
    discount: '30% OFF',
    rating: 4.8,
    reviews: 742,
    category: 'toys',
    categoryName: 'Toys & Games',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=700&q=80',
    description: 'Classic cuddly plush teddy bear made from ultra-soft hypoallergenic fleece fabric. Perfect gift for all ages.'
  },
  {
    id: 'shop-7',
    name: 'Classic Books Set',
    seller: 'BookHaven',
    brand: 'Others',
    price: 899,
    originalPrice: 1199,
    discount: '25% OFF',
    rating: 4.7,
    reviews: 523,
    category: 'books',
    categoryName: 'Books',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=700&q=80',
    description: 'Curated stack of vintage literary classics in elegant hardcover bindings with ribbon bookmarks.'
  },
  {
    id: 'shop-8',
    name: 'Aroma Diffuser',
    seller: 'HomeAura',
    brand: 'HomeAura',
    price: 999,
    originalPrice: 1299,
    discount: '23% OFF',
    rating: 4.6,
    reviews: 410,
    category: 'home',
    categoryName: 'Home & Living',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=700&q=80',
    description: 'Natural rattan reed aroma diffuser in an amber apothecary glass flacon with therapeutic essential oil blend.'
  },
  {
    id: 'shop-9',
    name: 'Smart Watch',
    seller: 'TechNest',
    brand: 'Sony',
    price: 3499,
    originalPrice: 4999,
    discount: '30% OFF',
    rating: 4.7,
    reviews: 677,
    category: 'electronics',
    categoryName: 'Electronics',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=700&q=80',
    description: 'Advanced health-tracking smartwatch with AMOLED display, optical heart rate sensor, and waterproof silicone strap.'
  },
  {
    id: 'shop-10',
    name: 'Decorative Cushion',
    seller: 'CozyHome',
    brand: 'H&M',
    price: 499,
    originalPrice: 699,
    discount: '29% OFF',
    rating: 4.8,
    reviews: 389,
    category: 'home',
    categoryName: 'Home & Living',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=700&q=80',
    description: 'Textured tufted neutral cream cushion cover with boho diamond weave. Elevates any sofa or armchair.'
  },
  {
    id: 'shop-11',
    name: 'Insulated Bottle',
    seller: 'UrbanCraft',
    brand: 'Nike',
    price: 799,
    originalPrice: 1099,
    discount: '27% OFF',
    rating: 4.6,
    reviews: 521,
    category: 'sports',
    categoryName: 'Sports',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=700&q=80',
    description: 'Double-walled stainless steel thermal water bottle. Keeps liquids ice cold for 24 hours or steaming hot for 12 hours.'
  },
  {
    id: 'shop-12',
    name: 'Makeup Brush Set',
    seller: 'BloomBeauty',
    brand: 'Others',
    price: 1199,
    originalPrice: 1599,
    discount: '25% OFF',
    rating: 4.8,
    reviews: 674,
    category: 'beauty',
    categoryName: 'Beauty',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80',
    description: 'Professional 10-piece wooden handle makeup brush collection with silky vegan synthetic bristles for smooth application.'
  },
  {
    id: 'shop-13',
    name: 'Floral Midi Dress',
    seller: 'StyleStudio',
    brand: 'Zara',
    price: 1499,
    originalPrice: 2199,
    discount: '32% OFF',
    rating: 4.8,
    reviews: 124,
    category: 'fashion',
    categoryName: 'Fashion',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=700&q=80',
    description: 'Breezy bohemian floral midi dress crafted from breathable organic cotton blend with tiered skirt.'
  },
  {
    id: 'shop-14',
    name: 'Ceramic Coffee Mug',
    seller: 'UrbanCraft',
    brand: 'UrbanCraft',
    price: 649,
    originalPrice: 850,
    discount: '24% OFF',
    rating: 4.9,
    reviews: 185,
    category: 'home',
    categoryName: 'Home & Living',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=700&q=80',
    description: 'Hand-thrown stoneware rustic mug featuring a warm speckled glaze and ergonomic wide handle.'
  },
  {
    id: 'shop-15',
    name: 'Leather Notebook',
    seller: 'BookHaven',
    brand: 'Others',
    price: 1299,
    originalPrice: 1800,
    discount: '28% OFF',
    rating: 4.7,
    reviews: 240,
    category: 'books',
    categoryName: 'Books',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=700&q=80',
    description: 'Refillable genuine leather journal crafted with handmade tree-free deckle edge pages.'
  },
  {
    id: 'shop-16',
    name: 'Organic Face Serum',
    seller: 'BloomBeauty',
    brand: 'BloomBeauty',
    price: 1499,
    originalPrice: 2200,
    discount: '32% OFF',
    rating: 4.9,
    reviews: 312,
    category: 'beauty',
    categoryName: 'Beauty',
    inStock: false,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=700&q=80',
    description: 'Cold-pressed botanical serum enriched with rosehip seed oil and vitamin C for radiant dewy skin.'
  }
];

export const EXPLORE_CATEGORIES = [
  {
    id: 'fashion',
    name: 'Fashion',
    count: '1.2k+ Products',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80',
    description: 'Apparel, footwear & curated lifestyle essentials'
  },
  {
    id: 'home',
    name: 'Home & Living',
    count: '960+ Products',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    description: 'Furniture, decor, lighting & cosy interior accents'
  },
  {
    id: 'beauty',
    name: 'Beauty',
    count: '760+ Products',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
    description: 'Skincare, haircare, wellness & signature fragrances'
  },
  {
    id: 'electronics',
    name: 'Electronics',
    count: '1.5k+ Products',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
    description: 'Smart tech, wearables, audio gear & computing'
  },
  {
    id: 'sports',
    name: 'Sports',
    count: '540+ Products',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
    description: 'Athletic wear, sneakers, gym gear & outdoor essentials'
  },
  {
    id: 'toys',
    name: 'Toys & Games',
    count: '680+ Products',
    image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=800&q=80',
    description: 'Plush toys, educational games, puzzles & fun finds'
  },
  {
    id: 'books',
    name: 'Books',
    count: '420+ Products',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    description: 'Classics, paperbacks, journals & collector editions'
  },
  {
    id: 'handmade',
    name: 'Handmade',
    count: '310+ Products',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
    description: 'Artisan pottery, handwoven crafts & bespoke gifts'
  }
];

export const POPULAR_CATEGORIES_CIRCLES = [
  { id: 'fashion', name: 'Fashion', iconName: 'Shirt', bg: '#f1eee7', iconColor: '#5c6352' },
  { id: 'home', name: 'Home & Living', iconName: 'Home', bg: '#faeee3', iconColor: '#a8623d' },
  { id: 'beauty', name: 'Beauty', iconName: 'Flower2', bg: '#fbe8ea', iconColor: '#b8546b' },
  { id: 'electronics', name: 'Electronics', iconName: 'Laptop', bg: '#e8f0f8', iconColor: '#3d6c99' },
  { id: 'sports', name: 'Sports', iconName: 'Dumbbell', bg: '#e5f3ed', iconColor: '#367c61' },
  { id: 'toys', name: 'Toys & Games', iconName: 'Gamepad2', bg: '#fdeee7', iconColor: '#ba583a' },
  { id: 'handmade', name: 'Handmade', iconName: 'Scissors', bg: '#fdf3de', iconColor: '#a67b28' }
];

export const DISCOVER_MORE_PRODUCTS = [
  {
    id: 'disc-1',
    name: 'Aesthetic Mug',
    seller: 'UrbanCraft',
    brand: 'UrbanCraft',
    price: 499,
    originalPrice: 699,
    discount: '29% OFF',
    rating: 4.8,
    reviews: '1.2k',
    category: 'home',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=700&q=80',
    description: 'Speckled ceramic mug with inspiring typography print. Microwavable and dishwasher safe.'
  },
  {
    id: 'disc-2',
    name: 'Cotton T-Shirt',
    seller: 'StyleStudio',
    brand: 'Zara',
    price: 799,
    originalPrice: 999,
    discount: '20% OFF',
    rating: 4.7,
    reviews: '856',
    category: 'fashion',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=700&q=80',
    description: 'Ultra-soft heavy combed cotton t-shirt with ribbed crew neck and relaxed comfort fit.'
  },
  {
    id: 'disc-3',
    name: 'Mini Plant Pot',
    seller: 'GreenHome',
    brand: 'UrbanCraft',
    price: 399,
    originalPrice: 599,
    discount: '33% OFF',
    rating: 4.8,
    reviews: '742',
    category: 'home',
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=700&q=80',
    description: 'Minimalist glazed white ceramic planter perfect for succulents, herbs and desk decoration.'
  },
  {
    id: 'disc-4',
    name: 'Wireless Earbuds',
    seller: 'TechNest',
    brand: 'Sony',
    price: 1999,
    originalPrice: 2999,
    discount: '33% OFF',
    rating: 4.7,
    reviews: '677',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=700&q=80',
    description: 'True wireless stereo earbuds with active noise cancellation, deep bass, and fast wireless charging.'
  }
];


export const ALL_FEATURED_SELLERS_PAGE = [
  {
    id: 'seller-urbancraft',
    name: 'UrbanCraft',
    category: 'Handmade Home Decor',
    ratingScore: 4.9,
    reviewsCount: '1.2k',
    productsCount: '250+',
    location: 'Surat, India',
    bio: 'Bringing handmade elegance to your home with love & creativity.',
    iconName: 'Home',
    bg: '#faeee3',
    iconColor: '#a8623d',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    thumbnails: [
      { id: 'uc-1', title: 'Ceramic Plant Pot', price: 599, image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=300&q=80' },
      { id: 'uc-2', title: 'Aesthetic Coffee Mug', price: 499, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=300&q=80' },
      { id: 'uc-3', title: 'Insulated Bottle', price: 799, image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=300&q=80' }
    ]
  },
  {
    id: 'seller-stylestudio',
    name: 'StyleStudio',
    category: 'Fashion & Accessories',
    ratingScore: 4.7,
    reviewsCount: '980',
    productsCount: '180+',
    location: 'Mumbai, India',
    bio: 'Trendy fashion for every you.',
    isMonogram: true,
    monogramText: 'St.',
    bg: '#f2efe9',
    iconColor: '#2b302a',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80',
    thumbnails: [
      { id: 'ss-1', title: 'Cotton T-Shirt', price: 799, image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=300&q=80' },
      { id: 'ss-2', title: 'Bow Tote Bag', price: 799, image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=300&q=80' },
      { id: 'ss-3', title: 'Linen Dress', price: 1499, image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=300&q=80' }
    ]
  },
  {
    id: 'seller-technest',
    name: 'TechNest',
    category: 'Electronics & Gadgets',
    ratingScore: 4.8,
    reviewsCount: '760',
    productsCount: '120+',
    location: 'Bengaluru, India',
    bio: 'Smart Tech. Smarter Choice.',
    iconName: 'Laptop',
    bg: '#e8f0f8',
    iconColor: '#3d6c99',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
    thumbnails: [
      { id: 'tn-1', title: 'Wireless Headphones', price: 2499, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80' },
      { id: 'tn-2', title: 'Smart Watch', price: 3499, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80' },
      { id: 'tn-3', title: 'Wireless Earbuds', price: 1999, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=300&q=80' }
    ]
  },
  {
    id: 'seller-bloombeauty',
    name: 'BloomBeauty',
    category: 'Beauty & Skincare',
    ratingScore: 4.7,
    reviewsCount: '640',
    productsCount: '100+',
    location: 'Jaipur, India',
    bio: 'Pure organic botanical beauty crafted for everyday glow.',
    iconName: 'Flower2',
    bg: '#fbe8ea',
    iconColor: '#b8546b',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
    thumbnails: [
      { id: 'bb-1', title: 'Floral Perfume', price: 1299, image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=300&q=80' },
      { id: 'bb-2', title: 'Makeup Brush Set', price: 1199, image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=300&q=80' },
      { id: 'bb-3', title: 'Face Serum', price: 1499, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=300&q=80' }
    ]
  }
];

export const TOP_RATED_SELLERS_PAGE = [
  {
    id: 'top-urbancraft',
    name: 'UrbanCraft',
    category: 'Handmade Home Decor',
    ratingScore: 4.9,
    reviewsCount: '2.5k',
    location: 'Surat, India',
    bio: 'Bringing handmade elegance to your home with love & creativity.',
    iconName: 'Home',
    bg: '#faeee3',
    iconColor: '#a8623d',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    productsCount: '250+',
    thumbnails: [
      { id: 'uc-t1', title: 'Ceramic Plant Pot', price: 599, image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=300&q=80' },
      { id: 'uc-t2', title: 'Aesthetic Coffee Mug', price: 499, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=300&q=80' }
    ]
  },
  {
    id: 'top-stylestudio',
    name: 'StyleStudio',
    category: 'Fashion & Accessories',
    ratingScore: 4.8,
    reviewsCount: '1.8k',
    location: 'Mumbai, India',
    bio: 'Trendy fashion for every you.',
    isMonogram: true,
    monogramText: 'St',
    bg: '#f2efe9',
    iconColor: '#2b302a',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80',
    productsCount: '180+',
    thumbnails: [
      { id: 'ss-t1', title: 'Cotton T-Shirt', price: 799, image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=300&q=80' },
      { id: 'ss-t2', title: 'Bow Tote Bag', price: 799, image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=300&q=80' }
    ]
  },
  {
    id: 'top-technest',
    name: 'TechNest',
    category: 'Electronics & Gadgets',
    ratingScore: 4.8,
    reviewsCount: '1.6k',
    location: 'Bengaluru, India',
    bio: 'Smart Tech. Smarter Choice.',
    iconName: 'Laptop',
    bg: '#e8f0f8',
    iconColor: '#3d6c99',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
    productsCount: '120+',
    thumbnails: [
      { id: 'tn-t1', title: 'Wireless Headphones', price: 2499, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80' },
      { id: 'tn-t2', title: 'Smart Watch', price: 3499, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80' }
    ]
  }
];

export const DISCOVER_NEW_STORES_PAGE = [
  {
    id: 'store-bloomaura',
    name: 'BloomAura',
    category: 'Beauty & Wellness',
    ratingScore: 4.7,
    reviewsCount: '520',
    productsCount: '80+',
    location: 'Kerala, India',
    bio: 'Ayurvedic formulations and mindful botanical self-care remedies.',
    iconName: 'Sprout',
    bg: '#e8f5ec',
    iconColor: '#367c61',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    thumbnails: [
      { id: 'ba-1', title: 'Botanical Face Oil', price: 899, image: 'https://images.unsplash.com/photo-1608248597359-bb58cf9fb811?auto=format&fit=crop&w=300&q=80' },
      { id: 'ba-2', title: 'Herbal Clay Mask', price: 549, image: 'https://images.unsplash.com/photo-1567928815117-640a3e0f9b69?auto=format&fit=crop&w=300&q=80' }
    ]
  },
  {
    id: 'store-craftbloom',
    name: 'CraftBloom',
    category: 'Handmade Crafts',
    ratingScore: 4.8,
    reviewsCount: '430',
    productsCount: '70+',
    location: 'Ahmedabad, India',
    bio: 'Hand-knitted textiles, macrame wall art, and cozy rustic accents.',
    iconName: 'Sparkles',
    bg: '#fae8ee',
    iconColor: '#ba5875',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    thumbnails: [
      { id: 'cb-1', title: 'Macrame Plant Hanger', price: 449, image: 'https://images.unsplash.com/photo-1525974160448-038dacadcc71?auto=format&fit=crop&w=300&q=80' },
      { id: 'cb-2', title: 'Woven Coasters Set', price: 349, image: 'https://images.unsplash.com/photo-1596178060671-7a80dc8059ea?auto=format&fit=crop&w=300&q=80' }
    ]
  },
  {
    id: 'store-trendlane',
    name: 'TrendLane',
    category: 'Fashion & Lifestyle',
    ratingScore: 4.6,
    reviewsCount: '390',
    productsCount: '60+',
    location: 'Delhi, India',
    bio: 'Everyday casual minimalism and contemporary street silhouettes.',
    iconName: 'Shirt',
    bg: '#eff2ec',
    iconColor: '#5c6352',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    thumbnails: [
      { id: 'tl-1', title: 'Oversized Linen Shirt', price: 1199, image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=300&q=80' },
      { id: 'tl-2', title: 'Canvas Tote Bag', price: 599, image: 'https://images.unsplash.com/photo-1597484662317-c9314418ad1d?auto=format&fit=crop&w=300&q=80' }
    ]
  },
  {
    id: 'store-giftnest',
    name: 'GiftNest',
    category: 'Gifts & Personalised',
    ratingScore: 4.7,
    reviewsCount: '410',
    productsCount: '75+',
    location: 'Pune, India',
    bio: 'Customized wooden plaques, celebratory hampers, and memory keepsakes.',
    iconName: 'Gift',
    bg: '#faeee3',
    iconColor: '#a8623d',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    thumbnails: [
      { id: 'gn-1', title: 'Engraved Keepsake Box', price: 849, image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=300&q=80' },
      { id: 'gn-2', title: 'Hand-Poured Scented Candle', price: 499, image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=300&q=80' }
    ]
  }
];
