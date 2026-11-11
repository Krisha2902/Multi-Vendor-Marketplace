import React, { useRef, useState, useEffect } from 'react';
import {
  Heart,
  Star,
  ShoppingCart,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Shirt,
  Home,
  Flower2,
  Laptop,
  Dumbbell,
  Gamepad2,
  BookOpen,
  Scissors,
  Sparkles,
} from 'lucide-react';
import { getPublicCategories, getPublicProducts } from '../api/publicMarketplace';

const ICON_COMPONENTS = {
  Shirt,
  Home,
  Armchair: Home,
  Flower2,
  Laptop,
  Smartphone: Laptop,
  Dumbbell,
  Gamepad2,
  BookOpen,
  Scissors,
  Sparkles,
};

const CATEGORY_COLORS = [
  { bg: '#e8e5e0', iconColor: '#5c5548' },
  { bg: '#ede3d5', iconColor: '#7a5c3a' },
  { bg: '#fae3e3', iconColor: '#a64d4d' },
  { bg: '#e0eaf3', iconColor: '#3b648a' },
  { bg: '#e0f1eb', iconColor: '#2f6b56' },
  { bg: '#fbe8dc', iconColor: '#9c5633' },
  { bg: '#fbe0e2', iconColor: '#963e45' },
  { bg: '#e6eaf0', iconColor: '#48566b' },
];

const FALLBACK_CATEGORY_IMAGE =
  'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=800&q=80';

export default function CategoriesPage({
  categories: propCategories = [],
  wishlistIds = [],
  onToggleWishlist,
  onAddToCart,
  onQuickView,
  onNavigateShop,
  onNavigateHome,
  onShowToast
}) {
  const sliderRef = useRef(null);
  const [categories, setCategories] = useState(propCategories);
  const [discoverProducts, setDiscoverProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favoriteCategoryIds, setFavoriteCategoryIds] = useState([]);

  useEffect(() => {
    if (propCategories.length > 0) {
      setCategories(propCategories);
    }
  }, [propCategories]);

  useEffect(() => {
    let active = true;

    const loadCategoriesPageData = async () => {
      try {
        setLoading(true);
        const [catList, productRes] = await Promise.all([
          propCategories.length > 0 ? Promise.resolve(propCategories) : getPublicCategories(),
          getPublicProducts({ page: 1, limit: 4, sort: 'popular' }),
        ]);

        if (!active) return;
        setCategories(catList || []);
        setDiscoverProducts(productRes?.products || []);
      } catch (err) {
        console.error('Failed to load categories page data:', err);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadCategoriesPageData();
    return () => {
      active = false;
    };
  }, []);

  const toggleCategoryFavorite = (e, catId) => {
    e.stopPropagation();
    setFavoriteCategoryIds((prev) => {
      const exists = prev.includes(catId);
      const next = exists ? prev.filter((id) => id !== catId) : [...prev, catId];
      if (onShowToast) {
        onShowToast(exists ? 'Category removed from favorites' : 'Category added to favorites');
      }
      return next;
    });
  };

  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      const amount = direction === 'left' ? -280 : 280;
      sliderRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const handleExploreCategory = (catId, catName) => {
    if (onNavigateShop) {
      onNavigateShop(catId);
    }
    if (onShowToast) {
      onShowToast(`Browsing ${catName} products in Shop`);
    }
  };

  return (
    <div className="categories-page-container">
      {/* 1. Breadcrumbs */}
      <div className="cat-breadcrumb-wrap">
        <div className="cat-breadcrumb">
          <span className="crumb-link" onClick={onNavigateHome}>Home</span>
          <span className="crumb-sep">&gt;</span>
          <span className="crumb-current">Categories</span>
        </div>
      </div>

      {/* 2. Hero Header Section */}
      <section className="cat-hero-section">
        <div className="cat-hero-left">
          <h1 className="cat-hero-title">Explore Our Categories</h1>
          <p className="cat-hero-subtitle">
            Discover products for every passion, lifestyle and everyday need.
          </p>
        </div>
        <div className="cat-hero-right">
          <div className="cat-hero-decor">
            <div className="cat-arch-frame">
              <img
                src="https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=800&q=80"
                alt="Aesthetic Home & Living decor"
                className="cat-hero-decor-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Main Category Cards Grid */}
      <section className="cat-cards-section">
        {loading && categories.length === 0 ? (
          <p className="empty-state">Loading categories...</p>
        ) : categories.length === 0 ? (
          <p className="empty-state">No categories available yet.</p>
        ) : (
          <div className="cat-cards-grid">
            {categories.map((cat) => {
              const catId = String(cat._id || cat.id);
              const isFav = favoriteCategoryIds.includes(catId);
              return (
                <div
                  key={catId}
                  className="cat-card"
                  onClick={() => handleExploreCategory(catId, cat.name)}
                >
                  <div className="cat-card-img-wrap">
                    <img
                      src={cat.image || FALLBACK_CATEGORY_IMAGE}
                      alt={cat.name}
                      className="cat-card-img"
                      loading="lazy"
                    />
                    <button
                      type="button"
                      className={`cat-card-fav-btn ${isFav ? 'is-active' : ''}`}
                      onClick={(e) => toggleCategoryFavorite(e, catId)}
                      aria-label={`Favorite ${cat.name}`}
                    >
                      <Heart size={16} fill={isFav ? '#cf633a' : 'none'} color={isFav ? '#cf633a' : '#575f56'} />
                    </button>
                  </div>

                  <div className="cat-card-content">
                    <h3 className="cat-card-title">{cat.name}</h3>
                    <p className="cat-card-count">{cat.description || 'Explore curated finds'}</p>
                    <button
                      type="button"
                      className="cat-card-explore-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExploreCategory(catId, cat.name);
                      }}
                    >
                      <span>Explore</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. Promotional Banner */}
      <section className="cat-promo-banner-wrap">
        <div className="cat-promo-banner">
          <div className="cat-promo-leaves-deco" aria-hidden="true">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 100C35 75 60 65 95 60M95 60C85 40 70 25 45 20M95 60C70 65 40 50 30 30M95 60C85 75 75 95 60 110" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>

          <div className="cat-promo-content">
            <h2 className="cat-promo-title">Shop More, Save More</h2>
            <p className="cat-promo-subtitle">
              Get exclusive deals on your favourite categories.
            </p>
            <button
              type="button"
              className="cat-promo-btn"
              onClick={() => {
                if (onNavigateShop) onNavigateShop(null);
                if (onShowToast) onShowToast('Exploring category deals in Shop');
              }}
            >
              <span>Shop Deals</span>
              <ArrowRight size={15} />
            </button>
          </div>

          <div className="cat-promo-gift-wrap">
            <img
              src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=500&q=80"
              alt="Exclusive deals gift package"
              className="cat-promo-gift-img"
            />
          </div>
        </div>
      </section>

      {/* 5. Popular Categories Quick Slider */}
      {categories.length > 0 && (
        <section className="cat-popular-section">
          <div className="cat-popular-header">
            <h2 className="cat-popular-title">Popular Categories</h2>
            <div className="cat-popular-controls">
              <button
                type="button"
                className="cat-slider-nav-btn"
                onClick={() => scrollSlider('left')}
                aria-label="Previous categories"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                className="cat-slider-nav-btn"
                onClick={() => scrollSlider('right')}
                aria-label="Next categories"
              >
                <ChevronRight size={18} />
              </button>
              <button
                type="button"
                className="cat-view-all-link"
                onClick={() => {
                  if (onNavigateShop) onNavigateShop(null);
                }}
              >
                <span>View All</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          <div className="cat-popular-track" ref={sliderRef}>
            {categories.map((item, idx) => {
              const catId = String(item._id || item.id);
              const IconComp = ICON_COMPONENTS[item.icon] || Sparkles;
              const palette = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];
              return (
                <div
                  key={catId}
                  className="cat-popular-item"
                  onClick={() => handleExploreCategory(catId, item.name)}
                >
                  <div
                    className="cat-popular-circle"
                    style={{ backgroundColor: palette.bg }}
                  >
                    <IconComp size={26} color={palette.iconColor} strokeWidth={1.8} />
                  </div>
                  <span className="cat-popular-name">{item.name}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 6. Discover More Section (Real Products from DB) */}
      <section className="cat-discover-section">
        <div className="cat-discover-grid">
          <div className="cat-discover-callout">
            <div className="cat-discover-callout-inner">
              <h2 className="cat-discover-title">Discover More</h2>
              <p className="cat-discover-sub">
                Handpicked products from our top categories.
              </p>
              <button
                type="button"
                className="cat-discover-btn"
                onClick={() => {
                  if (onNavigateShop) onNavigateShop(null);
                  if (onShowToast) onShowToast('Exploring full Shop catalog');
                }}
              >
                <span>Explore Shop</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          <div className="cat-discover-products">
            {discoverProducts.length === 0 ? (
              <p className="empty-state">No products available yet.</p>
            ) : (
              discoverProducts.map((prod) => {
                const prodId = String(prod._id || prod.id);
                const isWishlisted = wishlistIds.includes(prodId);
                return (
                  <div key={prodId} className="shop-product-card cat-discover-card">
                    <div
                      className="shop-product-img-wrap"
                      onClick={() => onQuickView && onQuickView(prod)}
                      style={{ cursor: 'pointer' }}
                    >
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="shop-product-img"
                        loading="lazy"
                      />
                      <button
                        type="button"
                        className={`shop-wishlist-btn ${isWishlisted ? 'is-active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onToggleWishlist) onToggleWishlist(prod);
                        }}
                        aria-label="Toggle wishlist"
                      >
                        <Heart
                          size={15}
                          fill={isWishlisted ? '#cf633a' : 'none'}
                          color={isWishlisted ? '#cf633a' : '#495246'}
                        />
                      </button>
                    </div>

                    <div className="shop-product-info">
                      <h4
                        className="shop-product-name"
                        onClick={() => onQuickView && onQuickView(prod)}
                        style={{ cursor: 'pointer' }}
                      >
                        {prod.name}
                      </h4>
                      <span className="shop-product-seller">by {prod.seller}</span>

                      <div className="shop-product-rating">
                        <Star size={13} fill="#d97706" color="#d97706" />
                        <span className="shop-rating-val">{prod.rating || 4.8}</span>
                        <span className="shop-rating-count">({prod.reviews || 0})</span>
                      </div>

                      <div className="shop-product-pricing">
                        <span className="shop-current-price">₹{Number(prod.price || 0).toLocaleString('en-IN')}</span>
                        {prod.originalPrice && (
                          <span className="shop-original-price">₹{Number(prod.originalPrice).toLocaleString('en-IN')}</span>
                        )}
                        {Number(prod.discount) > 0 && (
                          <span className="shop-discount-pill">{prod.discount}% OFF</span>
                        )}
                      </div>

                      <button
                        type="button"
                        className="shop-add-cart-btn"
                        disabled={prod.stock === 0}
                        onClick={() => onAddToCart && onAddToCart(prod)}
                      >
                        <ShoppingCart size={14} />
                        <span>{prod.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
