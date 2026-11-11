import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Vendor from '../models/Vendor.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const SELLER_PASSWORD = 'Seller@123';
const CUSTOMER_PASSWORD = 'Customer@123';

const CATEGORY_SELLERS_DATA = [
  {
    category: {
      name: 'Fashion',
      slug: 'fashion',
      icon: 'Shirt',
      image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80',
      description: 'Apparel, footwear & curated lifestyle essentials',
    },
    seller: {
      ownerName: 'Meera Kapoor',
      email: 'fashion.seller@shopnest.com',
      shopName: 'StyleHaven',
      description: 'Curated bohemian apparel, organic cotton basics, and minimalist carryalls crafted for everyday wear.',
    },
    products: [
      {
        title: 'Floral Midi Dress',
        description: 'Breezy bohemian floral midi dress crafted from breathable organic cotton blend with tiered skirt.',
        price: 2199,
        discount: 32,
        stock: 18,
        images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=700&q=80'],
        isFeatured: true,
        rating: 4.8,
        reviewsCount: 124,
      },
      {
        title: 'Minimalist Cotton Tote Bag',
        description: 'Heavy-duty natural cotton canvas tote bag with reinforced shoulder straps for groceries, books, and laptops.',
        price: 999,
        discount: 20,
        stock: 35,
        images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=700&q=80'],
        isFeatured: false,
        rating: 4.7,
        reviewsCount: 104,
      },
      {
        title: 'Combed Cotton Crew T-Shirt',
        description: 'Ultra-soft heavy combed cotton t-shirt with ribbed crew neck and relaxed everyday fit.',
        price: 999,
        discount: 20,
        stock: 28,
        images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=700&q=80'],
        isFeatured: false,
        rating: 4.7,
        reviewsCount: 86,
      },
    ],
  },
  {
    category: {
      name: 'Home & Living',
      slug: 'home-living',
      icon: 'Home',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
      description: 'Furniture, decor, lighting & cosy interior accents',
    },
    seller: {
      ownerName: 'Kabir Mehta',
      email: 'home.seller@shopnest.com',
      shopName: 'HomeAura Studio',
      description: 'Thoughtfully designed home decor, indoor planters, botanical diffusers, and tactile cushions.',
    },
    products: [
      {
        title: 'Fluted Ceramic Plant Pot',
        description: 'Handcrafted stoneware ceramic planter pot with minimal vertical fluting and built-in drainage saucer.',
        price: 1199,
        discount: 33,
        stock: 35,
        images: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=700&q=80'],
        isFeatured: true,
        rating: 4.8,
        reviewsCount: 92,
      },
      {
        title: 'Tufted Boho Cushion Cover',
        description: 'Textured tufted neutral cream cushion cover with artisanal diamond weave for sofas and armchairs.',
        price: 699,
        discount: 29,
        stock: 25,
        images: ['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=700&q=80'],
        isFeatured: false,
        rating: 4.8,
        reviewsCount: 64,
      },
      {
        title: 'Rattan Reed Aroma Diffuser',
        description: 'Natural rattan reed diffuser in amber apothecary glass with soothing essential oil blend.',
        price: 1299,
        discount: 23,
        stock: 20,
        images: ['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=700&q=80'],
        isFeatured: false,
        rating: 4.6,
        reviewsCount: 48,
      },
    ],
  },
  {
    category: {
      name: 'Beauty',
      slug: 'beauty',
      icon: 'Flower2',
      image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
      description: 'Skincare, haircare, wellness & signature fragrances',
    },
    seller: {
      ownerName: 'Ananya Verma',
      email: 'beauty.seller@shopnest.com',
      shopName: 'BloomBotanicals',
      description: 'Clean botanical skincare, cold-pressed serums, and small-batch floral perfumes crafted mindfully.',
    },
    products: [
      {
        title: 'Jasmine & Peony Floral Perfume',
        description: 'Amber glass bottled artisanal fragrance infused with jasmine, peony petals, and fresh pear notes.',
        price: 1899,
        discount: 32,
        stock: 16,
        images: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=700&q=80'],
        isFeatured: true,
        rating: 4.8,
        reviewsCount: 110,
      },
      {
        title: 'Vegan 10-Piece Makeup Brush Set',
        description: 'Wooden handle makeup brush collection with ultra-soft vegan synthetic bristles for smooth blending.',
        price: 1599,
        discount: 25,
        stock: 22,
        images: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80'],
        isFeatured: false,
        rating: 4.8,
        reviewsCount: 74,
      },
      {
        title: 'Rosehip & Vitamin C Face Serum',
        description: 'Cold-pressed botanical facial serum enriched with rosehip seed oil and vitamin C for luminous skin.',
        price: 2200,
        discount: 32,
        stock: 14,
        images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=700&q=80'],
        isFeatured: false,
        rating: 4.9,
        reviewsCount: 132,
      },
    ],
  },
  {
    category: {
      name: 'Electronics',
      slug: 'electronics',
      icon: 'Laptop',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
      description: 'Smart tech, wearables, audio gear & computing',
    },
    seller: {
      ownerName: 'Rohan Desai',
      email: 'electronics.seller@shopnest.com',
      shopName: 'TechNest India',
      description: 'Independent boutique for smart wearables, Hi-Fi wireless audio, and desk tech accessories.',
    },
    products: [
      {
        title: 'AMOLED Fitness Smart Watch',
        description: 'Sleek matte smartwatch with AMOLED display, heart-rate tracking, sleep insights, and 7-day battery life.',
        price: 4499,
        discount: 33,
        stock: 24,
        images: ['https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=700&q=80'],
        isFeatured: true,
        rating: 4.8,
        reviewsCount: 95,
      },
      {
        title: 'Matte Over-Ear Wireless Headphones',
        description: 'Wireless over-ear headphones with deep bass response, memory foam earcups, and 30-hour playback.',
        price: 3499,
        discount: 29,
        stock: 15,
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80'],
        isFeatured: false,
        rating: 4.7,
        reviewsCount: 88,
      },
      {
        title: 'ANC True Wireless Earbuds',
        description: 'Compact true wireless earbuds with touch controls, instant Bluetooth 5.3 pairing, and 28-hour case battery.',
        price: 1599,
        discount: 25,
        stock: 30,
        images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=700&q=80'],
        isFeatured: false,
        rating: 4.7,
        reviewsCount: 61,
      },
    ],
  },
  {
    category: {
      name: 'Sports',
      slug: 'sports',
      icon: 'Dumbbell',
      image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
      description: 'Athletic wear, sneakers, gym gear & outdoor essentials',
    },
    seller: {
      ownerName: 'Vikram Singh',
      email: 'sports.seller@shopnest.com',
      shopName: 'FitZone Gear',
      description: 'Performance running footwear, hydration bottles, and daily workout essentials.',
    },
    products: [
      {
        title: 'Lightweight Mesh Running Shoes',
        description: 'Road running shoes with responsive foam cushioning and breathable engineered mesh upper.',
        price: 3899,
        discount: 36,
        stock: 12,
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80'],
        isFeatured: true,
        rating: 4.9,
        reviewsCount: 145,
      },
      {
        title: 'Double-Wall Insulated Steel Bottle',
        description: 'Stainless steel thermal water bottle keeping drinks ice-cold for 24 hours or hot for 12 hours.',
        price: 1099,
        discount: 27,
        stock: 40,
        images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=700&q=80'],
        isFeatured: false,
        rating: 4.6,
        reviewsCount: 54,
      },
      {
        title: 'Everyday Cushion Athletic Sneakers',
        description: 'All-day training sneakers built with shock-absorbing midsole and durable grip outsole.',
        price: 2999,
        discount: 30,
        stock: 18,
        images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80'],
        isFeatured: false,
        rating: 4.7,
        reviewsCount: 79,
      },
    ],
  },
  {
    category: {
      name: 'Toys & Games',
      slug: 'toys-games',
      icon: 'Gamepad2',
      image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=800&q=80',
      description: 'Plush toys, educational games, puzzles & fun finds',
    },
    seller: {
      ownerName: 'Neha Joshi',
      email: 'toys.seller@shopnest.com',
      shopName: 'DreamCraft Toys',
      description: 'Safe, cozy plush companions and curated gift boxes crafted for joyful moments.',
    },
    products: [
      {
        title: 'Hypoallergenic Plush Teddy Bear',
        description: 'Classic cuddly plush teddy bear stitched from ultra-soft hypoallergenic fleece fabric.',
        price: 999,
        discount: 30,
        stock: 25,
        images: ['https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=700&q=80'],
        isFeatured: true,
        rating: 4.8,
        reviewsCount: 82,
      },
      {
        title: 'Celebration Surprise Gift Box',
        description: 'Ready-to-gift keepsake box filled with handcrafted desk games, cards, and cheerful mini surprises.',
        price: 1499,
        discount: 20,
        stock: 20,
        images: ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=700&q=80'],
        isFeatured: false,
        rating: 4.7,
        reviewsCount: 41,
      },
    ],
  },
  {
    category: {
      name: 'Books',
      slug: 'books',
      icon: 'BookOpen',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
      description: 'Classics, paperbacks, journals & collector editions',
    },
    seller: {
      ownerName: 'Siddharth Rao',
      email: 'books.seller@shopnest.com',
      shopName: 'BookHaven Press',
      description: 'Independent bookstore offering hardcover literary classics and handmade leather notebooks.',
    },
    products: [
      {
        title: 'Vintage Hardcover Classics Set',
        description: 'Curated bundle of timeless literary classics in textured hardcover bindings with ribbon bookmarks.',
        price: 1199,
        discount: 25,
        stock: 22,
        images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=700&q=80'],
        isFeatured: true,
        rating: 4.8,
        reviewsCount: 69,
      },
      {
        title: 'Handcrafted Full-Grain Leather Journal',
        description: 'Refillable full-grain leather journal bound with handmade tree-free deckle-edge cotton paper.',
        price: 1800,
        discount: 28,
        stock: 15,
        images: ['https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=700&q=80'],
        isFeatured: false,
        rating: 4.7,
        reviewsCount: 94,
      },
    ],
  },
  {
    category: {
      name: 'Handmade',
      slug: 'handmade',
      icon: 'Scissors',
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
      description: 'Artisan pottery, handwoven crafts & bespoke gifts',
    },
    seller: {
      ownerName: 'Aditi Sharma',
      email: 'handmade.seller@shopnest.com',
      shopName: 'The Clay Studio',
      description: 'Wheel-thrown stoneware pottery, terracotta jugs, and hand-glazed artisan tableware from Jaipur.',
    },
    products: [
      {
        title: 'Wheel-Thrown Terracotta Craft Vase',
        description: 'Bespoke hand-thrown stoneware pottery vessel glazed in warm earth tones for dried stems.',
        price: 1499,
        discount: 20,
        stock: 16,
        images: ['https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80'],
        isFeatured: true,
        rating: 4.9,
        reviewsCount: 118,
      },
      {
        title: 'Speckled Stoneware Coffee Mug',
        description: 'Artisan wheel-thrown ceramic coffee mug featuring an unglazed tactile base and smooth cream glaze.',
        price: 850,
        discount: 24,
        stock: 26,
        images: ['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=700&q=80'],
        isFeatured: false,
        rating: 4.9,
        reviewsCount: 105,
      },
      {
        title: 'Sculpted Dried Flora Vase',
        description: 'Minimalist matte ceramic bottle vase handcrafted in small batches by studio potters.',
        price: 1299,
        discount: 15,
        stock: 14,
        images: ['https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=700&q=80'],
        isFeatured: false,
        rating: 4.8,
        reviewsCount: 63,
      },
    ],
  },
];

const seedDemo = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB. Seeding category-wise sellers & products...');

    let sellersCreated = 0;
    let productsCreated = 0;
    const seededProducts = [];

    for (const entry of CATEGORY_SELLERS_DATA) {
      // 1. Ensure category exists
      let categoryDoc = await Category.findOne({ slug: entry.category.slug });
      if (!categoryDoc) {
        categoryDoc = await Category.create(entry.category);
        console.log(`+ Created category: ${categoryDoc.name}`);
      }

      // 2. Ensure seller User exists with role 'vendor'
      let userDoc = await User.findOne({ email: entry.seller.email.toLowerCase() });
      if (!userDoc) {
        userDoc = await User.create({
          name: entry.seller.ownerName,
          email: entry.seller.email.toLowerCase(),
          password: SELLER_PASSWORD,
          role: 'vendor',
        });
      } else if (userDoc.role !== 'vendor') {
        userDoc.role = 'vendor';
        await userDoc.save();
      }

      // 3. Ensure approved Vendor profile exists
      let vendorDoc = await Vendor.findOne({ user: userDoc._id });
      if (!vendorDoc) {
        vendorDoc = await Vendor.create({
          user: userDoc._id,
          shopName: entry.seller.shopName,
          category: categoryDoc.name,
          description: entry.seller.description,
          status: 'approved',
        });
        sellersCreated += 1;
        console.log(`+ Created approved seller: ${vendorDoc.shopName} (${categoryDoc.name})`);
      } else if (vendorDoc.status !== 'approved') {
        vendorDoc.status = 'approved';
        await vendorDoc.save();
      }

      // 4. Create products for this vendor & category
      for (const item of entry.products) {
        let productDoc = await Product.findOne({
          vendor: vendorDoc._id,
          title: item.title,
        });

        if (!productDoc) {
          productDoc = await Product.create({
            ...item,
            category: categoryDoc._id,
            vendor: vendorDoc._id,
            isActive: true,
          });
          productsCreated += 1;
          console.log(`  + Added product: ${item.title} [${categoryDoc.name} / ${vendorDoc.shopName}]`);
        }
        seededProducts.push(productDoc);
      }
    }

    // 5. Ensure demo Customer user exists
    let customerDoc = await User.findOne({ email: 'customer@shopnest.com' });
    if (!customerDoc) {
      customerDoc = await User.create({
        name: 'Aarav Patel',
        email: 'customer@shopnest.com',
        password: CUSTOMER_PASSWORD,
        role: 'customer',
      });
      console.log('+ Created demo customer: customer@shopnest.com');
    }

    // 6. Ensure one pending vendor application exists for Admin workflow demo
    let pendingUser = await User.findOne({ email: 'pending.seller@shopnest.com' });
    if (!pendingUser) {
      pendingUser = await User.create({
        name: 'Priya Verma',
        email: 'pending.seller@shopnest.com',
        password: SELLER_PASSWORD,
        role: 'customer',
      });
    }
    const existingPendingVendor = await Vendor.findOne({ user: pendingUser._id });
    if (!existingPendingVendor) {
      await Vendor.create({
        user: pendingUser._id,
        shopName: 'Amber Craft Collective',
        category: 'Handmade',
        description: 'Hand-poured soy candles, woven baskets, and artisan table linens ready for review.',
        status: 'pending',
      });
      console.log('+ Created pending vendor application: Amber Craft Collective');
    }

    // 7. Create sample idempotent multi-vendor orders for Demo dashboard metrics
    const calcPrice = (prod) =>
      prod.discount > 0 ? Math.round(prod.price * (1 - prod.discount / 100)) : prod.price;

    if (seededProducts.length >= 4) {
      const demoOrders = [
        {
          orderNumber: 'SN-2026-DEMO01',
          customer: customerDoc._id,
          items: [seededProducts[0], seededProducts[3]].map((p, idx) => ({
            product: p._id,
            title: p.title,
            price: calcPrice(p),
            quantity: 1,
            image: p.images?.[0] || '',
            vendor: p.vendor,
            itemStatus: idx === 0 ? 'delivered' : 'shipped',
          })),
          shippingAddress: {
            fullName: 'Aarav Patel',
            street: '42 Heritage Courtyard, Navrangpura',
            city: 'Ahmedabad',
            postalCode: '380009',
            phone: '9876543210',
          },
          paymentMethod: 'card',
          paymentStatus: 'paid',
          status: 'shipped',
        },
        {
          orderNumber: 'SN-2026-DEMO02',
          customer: customerDoc._id,
          items: [seededProducts[9] || seededProducts[1]].map((p) => ({
            product: p._id,
            title: p.title,
            price: calcPrice(p),
            quantity: 1,
            image: p.images?.[0] || '',
            vendor: p.vendor,
            itemStatus: 'processing',
          })),
          shippingAddress: {
            fullName: 'Aarav Patel',
            street: '42 Heritage Courtyard, Navrangpura',
            city: 'Ahmedabad',
            postalCode: '380009',
            phone: '9876543210',
          },
          paymentMethod: 'cod',
          paymentStatus: 'pending',
          status: 'processing',
        },
      ];

      let ordersCreated = 0;
      for (const sample of demoOrders) {
        const exists = await Order.findOne({ orderNumber: sample.orderNumber });
        if (!exists) {
          const subtotal = sample.items.reduce((sum, it) => sum + it.price * it.quantity, 0);
          await Order.create({
            ...sample,
            subtotal,
            shippingFee: 0,
            totalAmount: subtotal,
          });
          ordersCreated += 1;
        }
      }
      if (ordersCreated > 0) {
        console.log(`+ Created ${ordersCreated} sample marketplace order(s)`);
      }
    }

    console.log(`\nDemo seed ready! Sellers created: ${sellersCreated}, Products created: ${productsCreated}`);
    console.log('Demo Customer : customer@shopnest.com / Customer@123');
    console.log('Demo Sellers  : fashion.seller@shopnest.com (or any category.seller@shopnest.com) / Seller@123');
    console.log('Pending Seller: pending.seller@shopnest.com / Seller@123');
  } catch (err) {
    console.error('Demo seed failed:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
};

seedDemo();

