import 'dotenv/config';
import mongoose from 'mongoose';
import Category from '../models/Category.js';

// Run: npm run seedcategories   (safe to run many times: it upserts by slug)
const CATEGORIES = [
  { name: 'Fashion', slug: 'fashion', icon: 'Shirt', description: 'Clothing, footwear and accessories' },
  { name: 'Home & Living', slug: 'home', icon: 'Armchair', description: 'Decor, furniture and kitchen' },
  { name: 'Beauty', slug: 'beauty', icon: 'Sparkles', description: 'Skincare, makeup and grooming' },
  { name: 'Electronics', slug: 'electronics', icon: 'Smartphone', description: 'Gadgets, wearables and audio' },
  { name: 'Sports', slug: 'sports', icon: 'Dumbbell', description: 'Fitness and outdoor gear' },
  { name: 'Toys & Games', slug: 'toys', icon: 'Gamepad2', description: 'Toys, puzzles and board games' },
  { name: 'Books', slug: 'books', icon: 'BookOpen', description: 'Books and stationery' },
  { name: 'Food & Grocery', slug: 'grocery', icon: 'ShoppingBasket', description: 'Packaged and gourmet food' },
];

await mongoose.connect(process.env.MONGO_URI);

let created = 0;
for (const c of CATEGORIES) {
  // $setOnInsert: only fills the fields when the record is new, so reruns never overwrite edits.
  const res = await Category.updateOne({ slug: c.slug }, { $setOnInsert: c }, { upsert: true });
  if (res.upsertedCount) created += 1;
}

console.log(`Categories: ${created} created, ${CATEGORIES.length - created} already existed`);
await mongoose.disconnect();
