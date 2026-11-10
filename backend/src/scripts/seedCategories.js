import 'dotenv/config';
import { connectDB } from '../config/db.js';
import Category from '../models/Category.js';

const SEED_CATEGORIES = [
  {
    name: 'Fashion',
    slug: 'fashion',
    icon: 'Shirt',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80',
    description: 'Apparel, footwear & curated lifestyle essentials'
  },
  {
    name: 'Home & Living',
    slug: 'home-living',
    icon: 'Home',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    description: 'Furniture, decor, lighting & cosy interior accents'
  },
  {
    name: 'Beauty',
    slug: 'beauty',
    icon: 'Flower2',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
    description: 'Skincare, haircare, wellness & signature fragrances'
  },
  {
    name: 'Electronics',
    slug: 'electronics',
    icon: 'Laptop',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
    description: 'Smart tech, wearables, audio gear & computing'
  },
  {
    name: 'Sports',
    slug: 'sports',
    icon: 'Dumbbell',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
    description: 'Athletic wear, sneakers, gym gear & outdoor essentials'
  },
  {
    name: 'Toys & Games',
    slug: 'toys-games',
    icon: 'Gamepad2',
    image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=800&q=80',
    description: 'Plush toys, educational games, puzzles & fun finds'
  },
  {
    name: 'Books',
    slug: 'books',
    icon: 'BookOpen',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    description: 'Classics, paperbacks, journals & collector editions'
  },
  {
    name: 'Handmade',
    slug: 'handmade',
    icon: 'Scissors',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
    description: 'Artisan pottery, handwoven crafts & bespoke gifts'
  }
];

const seed = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB. Seeding categories...');

    for (const cat of SEED_CATEGORIES) {
      const exists = await Category.findOne({ slug: cat.slug });
      if (!exists) {
        await Category.create(cat);
        console.log(`+ Created category: ${cat.name}`);
      } else {
        console.log(`~ Category exists: ${cat.name}`);
      }
    }

    console.log('Category seed completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Category seed failed:', err.message);
    process.exit(1);
  }
};

seed();

