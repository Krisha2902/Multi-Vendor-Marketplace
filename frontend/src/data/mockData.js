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
