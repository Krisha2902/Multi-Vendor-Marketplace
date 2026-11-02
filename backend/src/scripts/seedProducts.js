import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

// OPTIONAL dev helper (not in your assignment): gives the product APIs data to return.
// Run AFTER: npm run seedcategories && npm run seedvendors
// Run: npm run seedproducts   (safe to rerun: skips products with the same name + vendor)
const PRODUCTS = [
  { name: 'Floral Midi Dress', vendor: 'stylehaven@vendora.test', category: 'fashion', price: 1499, originalPrice: 2199, stock: 18, tags: ['floral', 'summer', 'cotton'], description: 'Breezy floral midi dress in a breathable organic cotton blend.' },
  { name: 'Linen Kurta Set', vendor: 'stylehaven@vendora.test', category: 'fashion', price: 1899, originalPrice: 2499, stock: 12, tags: ['linen', 'ethnic'], description: 'Lightweight linen kurta with matching trousers.' },
  { name: 'Smart Watch (Black)', vendor: 'techzone@vendora.test', category: 'electronics', price: 2999, originalPrice: 4499, stock: 24, tags: ['fitness', 'bluetooth', 'watch'], description: 'AMOLED smartwatch with heart-rate tracking and 7-day battery.' },
  { name: 'Wireless Earbuds', vendor: 'techzone@vendora.test', category: 'electronics', price: 1799, originalPrice: 2999, stock: 40, tags: ['audio', 'bluetooth'], description: 'Noise-isolating earbuds with 24-hour charging case.' },
  { name: 'Ceramic Plant Pot', vendor: 'cozyhome@vendora.test', category: 'home', price: 799, originalPrice: 1199, stock: 30, tags: ['ceramic', 'decor', 'plants'], description: 'Handmade ceramic pot with drainage hole.' },
  { name: 'Terracotta Jug', vendor: 'cozyhome@vendora.test', category: 'home', price: 649, stock: 15, tags: ['terracotta', 'decor'], description: 'Hand-thrown terracotta water jug.' },
  { name: 'Yoga Mat (6mm)', vendor: 'fitlife@vendora.test', category: 'sports', price: 999, originalPrice: 1499, stock: 50, tags: ['yoga', 'fitness'], description: 'Non-slip 6mm yoga mat with carry strap.' },
  { name: 'Adjustable Dumbbell Set', vendor: 'fitlife@vendora.test', category: 'sports', price: 3499, originalPrice: 4299, stock: 8, tags: ['strength', 'fitness'], description: 'Adjustable dumbbells, 2 x 10 kg.' },
];

await mongoose.connect(process.env.MONGO_URI);

let created = 0;
for (const p of PRODUCTS) {
  const vendor = await User.findOne({ email: p.vendor, role: 'vendor' }).select('_id');
  const category = await Category.findOne({ slug: p.category }).select('_id');
  if (!vendor || !category) {
    console.warn(`Skipped "${p.name}": run seedcategories and seedvendors first`);
    continue;
  }
  const exists = await Product.exists({ name: p.name, vendor: vendor._id });
  if (exists) continue;

  const { vendor: _v, category: _c, ...rest } = p;
  await Product.create({ ...rest, vendor: vendor._id, category: category._id });
  created += 1;
}

console.log(`Products: ${created} created, ${PRODUCTS.length - created} skipped/existing`);
await mongoose.disconnect();
