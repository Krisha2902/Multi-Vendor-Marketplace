import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';

const seedAdmin = async () => {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in backend/.env');
  }

  await connectDB();

  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Admin already exists:', email);
  } else {
    await User.create({
      name: 'Admin',
      email,
      password,
      role: 'admin',
    });
    console.log('Admin created:', email);
  }
};

seedAdmin()
  .catch((err) => {
    console.error('Admin seed failed:', err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect().catch(() => {});
  });
