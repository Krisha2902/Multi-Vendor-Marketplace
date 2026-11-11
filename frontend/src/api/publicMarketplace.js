
import api from './axios';

// Convert MongoDB product into frontend product format
export const normalizeProduct = (product) => {
  if (!product) return null;

  const originalPrice = Number(product.price || 0);
  const discount = Number(product.discount || 0);

  return {
    ...product,

    id: String(product._id),

    name: product.title,

    seller: product.vendor?.shopName || 'Independent Seller',

    sellerId: product.vendor?._id,

    price: Number(
      product.discountedPrice ??
      originalPrice * (1 - discount / 100)
    ),

    originalPrice: discount > 0
      ? originalPrice
      : null,

    rating: Number(product.rating || 0),

    reviews: Number(product.reviewsCount || 0),

    image: product.images?.[0] || '',

    images: product.images || [],

    category: product.category?._id || product.category,

    categoryName: product.category?.name || '',

    categorySlug: product.category?.slug || '',

    stock: Number(product.stock || 0),

    inStock: Number(product.stock || 0) > 0,

    badge: product.isFeatured ? 'Featured' : null,

    badgeType: product.isFeatured ? 'featured' : 'default',

    description: product.description || '',

    tags: [],
  };
};

// Convert MongoDB seller into frontend seller format
export const normalizeSeller = (seller) => {
  if (!seller) return null;

  const products = (seller.products || [])
    .map(normalizeProduct)
    .filter(Boolean);

  return {
    ...seller,

    id: String(seller._id),

    name: seller.shopName,

    category: seller.category,

    bio: seller.description || '',

    productsCount: seller.productCount ?? products.length,

    avatar: null,

    ratingScore: null,

    reviewsCount: null,

    products,

    thumbnails: products.map((product) => ({
      id: product.id,
      title: product.name,
      image: product.image,
      price: product.price,
      product,
    })),
  };
};

// GET /api/products?search=&category=&page=&sort=
export const getPublicProducts = async (params = {}) => {
  const { data } = await api.get('/products', {
    params,
  });

  return {
    ...data,
    products: (data.products || [])
      .map(normalizeProduct)
      .filter(Boolean),
  };
};

// GET /api/products/:id
export const getPublicProductById = async (id) => {
  const { data } = await api.get(`/products/${id}`);

  return normalizeProduct(data.product);
};

// GET /api/products/featured
export const getFeaturedProducts = async (params = {}) => {
  const { data } = await api.get('/products/featured', {
    params,
  });

  return (data.products || [])
    .map(normalizeProduct)
    .filter(Boolean);
};

// GET /api/products/new-arrivals
export const getNewArrivals = async (params = {}) => {
  const { data } = await api.get('/products/new-arrivals', {
    params,
  });

  return (data.products || [])
    .map(normalizeProduct)
    .filter(Boolean);
};

// GET /api/categories
export const getPublicCategories = async () => {
  const { data } = await api.get('/categories');

  return (data.categories || []).map((category) => ({
    ...category,
    id: String(category._id),
  }));
};

// GET /api/sellers
export const getPublicSellers = async () => {
  const { data } = await api.get('/sellers');

  return (data.sellers || [])
    .map(normalizeSeller)
    .filter(Boolean);
};

// GET /api/sellers/:id
export const getPublicSellerById = async (id) => {
  const { data } = await api.get(`/sellers/${id}`);

  return normalizeSeller(data.seller);
};
