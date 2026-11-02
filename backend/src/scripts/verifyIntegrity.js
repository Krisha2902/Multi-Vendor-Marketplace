import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import OrderItem from '../models/OrderItem.js';

// Read-only check (changes nothing). Run: npm run verify:integrity
// Looks for broken references between Product/Category/User(vendor)/Cart/OrderItem.
await mongoose.connect(process.env.MONGO_URI);

const problems = [];
const report = (msg) => problems.push(msg);

// Sets of valid ids to compare against.
const categoryIds = new Set((await Category.find().select('_id').lean()).map((c) => String(c._id)));
const vendorIds = new Set(
  (await User.find({ role: 'vendor' }).select('_id').lean()).map((u) => String(u._id))
);
const products = await Product.find().select('name category vendor').lean();
const vendorOfProduct = new Map(products.map((p) => [String(p._id), String(p.vendor)]));

// 1. Products -> Category and Vendor
for (const p of products) {
  if (!categoryIds.has(String(p.category))) report(`Product "${p.name}" (${p._id}): category ${p.category} not found`);
  if (!vendorIds.has(String(p.vendor))) report(`Product "${p.name}" (${p._id}): vendor ${p.vendor} is not a vendor user`);
}

// 2. Cart items -> Product and Vendor (and does the vendor match the product's vendor?)
for (const cart of await Cart.find().lean()) {
  for (const item of cart.items) {
    const real = vendorOfProduct.get(String(item.product));
    if (!real) report(`Cart ${cart._id}: product ${item.product} not found`);
    else if (real !== String(item.vendor)) report(`Cart ${cart._id}: item vendor does not match product ${item.product}`);
  }
}

// 3. OrderItems -> Product and Vendor
for (const oi of await OrderItem.find().lean()) {
  const real = vendorOfProduct.get(String(oi.product));
  if (!real) report(`OrderItem ${oi._id}: product ${oi.product} not found`);
  else if (real !== String(oi.vendor)) report(`OrderItem ${oi._id}: vendor does not match product ${oi.product}`);
}

console.log(
  `Checked ${products.length} products, ${categoryIds.size} categories, ${vendorIds.size} vendors.`
);
if (problems.length === 0) {
  console.log('No integrity problems found.');
} else {
  console.log(`${problems.length} problem(s):`);
  problems.forEach((m) => console.log(' - ' + m));
}

await mongoose.disconnect();
process.exit(problems.length ? 1 : 0);
