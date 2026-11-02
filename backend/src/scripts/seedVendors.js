import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Vendor from '../models/Vendor.js';

// Run: npm run seedvendors   (safe to run many times: skips existing emails)
// The password comes from SEED_VENDOR_PASSWORD in .env, never from the code.
// User.pre('save') hashes it with bcrypt, exactly like normal registration.
const VENDORS = [
  { name: 'Aarav Mehta', email: 'stylehaven@vendora.test', shopName: 'StyleHaven', description: 'Boutique fashion and ethnic wear' },
  { name: 'Rohan Iyer', email: 'techzone@vendora.test', shopName: 'TechZone', description: 'Smart gadgets and accessories' },
  { name: 'Neha Kapoor', email: 'cozyhome@vendora.test', shopName: 'CozyHome', description: 'Handmade home decor' },
  { name: 'Vikram Rao', email: 'fitlife@vendora.test', shopName: 'FitLife', description: 'Sports and fitness equipment' },
];

const password = process.env.SEED_VENDOR_PASSWORD;
if (!password || password.length < 6) {
  console.error('Set SEED_VENDOR_PASSWORD (min 6 characters) in backend/.env first.');
  process.exit(1);
}

await mongoose.connect(process.env.MONGO_URI);

let created = 0;
for (const v of VENDORS) {
  let user = await User.findOne({ email: v.email });
  if (!user) {
    user = await User.create({ name: v.name, email: v.email, password, role: 'vendor' });
    created += 1;
  }
  // Shop profile: created once per vendor user, 'approved' so the demo products show up.
  await Vendor.updateOne(
    { user: user._id },
    { $setOnInsert: { user: user._id, shopName: v.shopName, description: v.description, status: 'approved' } },
    { upsert: true }
  );
}

console.log(`Vendors: ${created} created, ${VENDORS.length - created} already existed`);
await mongoose.disconnect();
