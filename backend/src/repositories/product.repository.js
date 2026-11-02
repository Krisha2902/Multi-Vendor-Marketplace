import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Vendor from '../models/Vendor.js';

// Only these fields leave the database for PUBLIC product APIs (no isActive, __v, etc.).
const PUBLIC_FIELDS = 'name description price originalPrice stock images tags category vendor createdAt';

const OBJECT_ID_REGEX = /^[a-f\d]{24}$/i;

// Turns "a.b*" into "a\.b\*" so user text is searched literally (prevents regex injection).
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// ---- Category filter hook --------------------------------------------------
// Accepts a category _id OR a slug (e.g. "electronics"). Returns the ObjectId string,
// or null when no such category exists.
export const resolveCategoryId = async (value) => {
  if (OBJECT_ID_REGEX.test(value)) {
    const exists = await Category.exists({ _id: value });
    return exists ? value : null;
  }
  const category = await Category.findOne({ slug: value.toLowerCase() }).select('_id').lean();
  return category ? String(category._id) : null;
};

// ---- Search + category filter hook ----------------------------------------
// Builds the MongoDB filter. Always hides inactive products.
export const buildProductFilter = ({ search, categoryId } = {}) => {
  const filter = { isActive: true };
  if (categoryId) filter.category = categoryId;
  if (search) {
    const pattern = new RegExp(escapeRegex(search), 'i');
    filter.$or = [{ name: pattern }, { tags: pattern }, { description: pattern }];
  }
  return filter;
};

// Adds `shopName` to every populated vendor (shop names live in the Vendor collection).
const attachShopNames = async (products) => {
  const userIds = products.map((p) => p.vendor?._id).filter(Boolean);
  if (userIds.length === 0) return products;

  const shops = await Vendor.find({ user: { $in: userIds } }).select('user shopName').lean();
  const shopByUser = new Map(shops.map((s) => [String(s.user), s.shopName]));
  products.forEach((p) => {
    if (p.vendor) p.vendor.shopName = shopByUser.get(String(p.vendor._id)) || null;
  });
  return products;
};

const withRelations = (query) =>
  query.populate('category', 'name slug').populate('vendor', 'name').lean();

// ---- Listing --------------------------------------------------------------
// `category` is the raw ?category= value. Returns { products, total }.
export const findPublicProducts = async ({ page, limit, search, category }) => {
  let categoryId = null;
  if (category) {
    categoryId = await resolveCategoryId(category);
    // Unknown category -> nothing can match, skip querying the products collection.
    if (!categoryId) return { products: [], total: 0 };
  }

  const filter = buildProductFilter({ search, categoryId });

  // Run the page query and the count at the same time.
  const [products, total] = await Promise.all([
    withRelations(
      Product.find(filter)
        .select(PUBLIC_FIELDS)
        .sort({ createdAt: -1, _id: -1 }) // _id keeps the order stable between pages
        .skip((page - 1) * limit)
        .limit(limit)
    ),
    Product.countDocuments(filter),
  ]);

  return { products: await attachShopNames(products), total };
};

// ---- Single product -------------------------------------------------------
export const findPublicProductById = async (id) => {
  const product = await withRelations(
    Product.findOne({ _id: id, isActive: true }).select(PUBLIC_FIELDS)
  );
  if (!product) return null;
  await attachShopNames([product]);
  return product;
};
