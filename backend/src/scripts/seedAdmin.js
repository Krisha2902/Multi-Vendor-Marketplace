import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';

await mongoose.connect(process.env.MONGO_URI);

const email = process.env.ADMIN_EMAIL.toLowerCase();
const existing = await User.findOne({ email });

if (existing) {
  console.log('Admin already exists');
} else {
  await User.create({
    name: 'Admin',
    email,
    password: process.env.ADMIN_PASSWORD,
    role: 'admin',
  });
  console.log('Admin created:', email);
}

await mongoose.disconnect();