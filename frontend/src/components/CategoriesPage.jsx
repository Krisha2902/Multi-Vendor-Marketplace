import React, { useRef, useState } from 'react';
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
  Scissors,
  Sparkles,
  Gift
} from 'lucide-react';
import { 
  EXPLORE_CATEGORIES, 
  POPULAR_CATEGORIES_CIRCLES, 
  DISCOVER_MORE_PRODUCTS 
} from '../data/mockData';

// Icon map helper for dynamic icon rendering
const ICON_COMPONENTS = {
  Shirt,
  Home,
  Flower2,
  Laptop,
  Dumbbell,
  Gamepad2,
  Scissors
};

export default function CategoriesPage({
  wishlistIds = [],
  onToggleWishlist,
  onAddToCart,
  onQuickView,
  onNavigateShop,
  onNavigateHome,
  onShowToast
}) {
  const sliderRef = useRef(null);
  const [favoriteCategoryIds, setFavoriteCategoryIds] = useState(['fashion', 'beauty']);

  const toggleCategoryFavorite = (e, catId) => {
    e.stopPropagation();
    setFavoriteCategoryIds(prev => {
      const exists = prev.includes(catId);
      const next = exists ? prev.filter(id => id !== catId) : [...prev, catId];
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
            {/* Aesthetic architectural arch backdrop with vase & greenery */}
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

      {/* 3. 8 Main Category Cards Grid (4x2 Layout) */}
      <section className="cat-cards-section">
        <div className="cat-cards-grid">
          {EXPLORE_CATEGORIES.map((cat) => {
            const isFav = favoriteCategoryIds.includes(cat.id);
            return (
              <div 
                key={cat.id} 
                className="cat-card"
                onClick={() => handleExploreCategory(cat.id, cat.name)}
              >
                {/* Top Image Wrap with Wishlist Toggle */}
                <div className="cat-card-img-wrap">
                  <img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="cat-card-img" 
                    loading="lazy"
                  />
                  <button 
                    type="button"
                    className={`cat-card-fav-btn ${isFav ? 'is-active' : ''}`}
                    onClick={(e) => toggleCategoryFavorite(e, cat.id)}
                    aria-label={`Favorite ${cat.name}`}
                  >
                    <Heart size={16} fill={isFav ? '#cf633a' : 'none'} color={isFav ? '#cf633a' : '#575f56'} />
                  </button>
                </div>

                {/* Card Bottom Meta */}
                <div className="cat-card-content">
                  <h3 className="cat-card-title">{cat.name}</h3>
                  <p className="cat-card-count">{cat.count}</p>
                  <button 
                    type="button" 
                    className="cat-card-explore-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExploreCategory(cat.id, cat.name);
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
      </section>

      {/* 4. Promotional Banner: "Shop More, Save More" */}
      <section className="cat-promo-banner-wrap">
        <div className="cat-promo-banner">
          {/* Left Decorative Botanical Leaves */}
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

          {/* Right Gift Box Illustration */}
          <div className="cat-promo-gift-wrap">
            <img 
              src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=500&q=80" 
              alt="Exclusive deals gift package" 
              className="cat-promo-gift-img"
            />
          </div>
        </div>
      </section>

      {/* 5. Popular Categories Circular Quick Slider */}
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

        {/* Scrollable Track */}
        <div className="cat-popular-track" ref={sliderRef}>
          {POPULAR_CATEGORIES_CIRCLES.map((item) => {
            const IconComp = ICON_COMPONENTS[item.iconName] || Shirt;
            return (
              <div 
                key={item.id} 
                className="cat-popular-item"
                onClick={() => handleExploreCategory(item.id, item.name)}
              >
                <div 
                  className="cat-popular-circle"
                  style={{ backgroundColor: item.bg }}
                >
                  <IconComp size={26} color={item.iconColor} strokeWidth={1.8} />
                </div>
                <span className="cat-popular-name">{item.name}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Discover More Section (Left Callout + 4 Handpicked Products) */}
      <section className="cat-discover-section">
        <div className="cat-discover-grid">
          {/* Left Callout Card */}
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

          {/* Right 4 Products Cards */}
          <div className="cat-discover-products">
            {DISCOVER_MORE_PRODUCTS.map((prod) => {
              const isWishlisted = wishlistIds.includes(prod.id);
              return (
                <div key={prod.id} className="shop-product-card cat-discover-card">
                  {/* Image & Wishlist Button */}
                  <div className="shop-product-img-wrap">
                    <img 
                      src={prod.image} 
                      alt={prod.name} 
                      className="shop-product-img" 
                      loading="lazy"
                    />
                    <button 
                      type="button" 
                      className={`shop-wishlist-btn ${isWishlisted ? 'is-active' : ''}`}
                      onClick={() => onToggleWishlist(prod.id)}
                      aria-label="Toggle wishlist"
                    >
                      <Heart 
                        size={15} 
                        fill={isWishlisted ? '#cf633a' : 'none'} 
                        color={isWishlisted ? '#cf633a' : '#495246'} 
                      />
                    </button>
                  </div>

                  {/* Product Details */}
                  <div className="shop-product-info">
                    <h4 
                      className="shop-product-name"
                      onClick={() => onQuickView && onQuickView(prod)}
                      style={{ cursor: 'pointer' }}
                    >
                      {prod.name}
                    </h4>
                    <span className="shop-product-seller">by {prod.seller}</span>

                    {/* Rating */}
                    <div className="shop-product-rating">
                      <Star size={13} fill="#d97706" color="#d97706" />
                      <span className="shop-rating-val">{prod.rating}</span>
                      <span className="shop-rating-count">({prod.reviews})</span>
                    </div>

                    {/* Price and Discount */}
                    <div className="shop-product-pricing">
                      <span className="shop-current-price">₹{prod.price.toLocaleString('en-IN')}</span>
                      {prod.originalPrice && (
                        <span className="shop-original-price">₹{prod.originalPrice.toLocaleString('en-IN')}</span>
                      )}
                      {prod.discount && (
                        <span className="shop-discount-pill">{prod.discount}</span>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <button 
                      type="button" 
                      className="shop-add-cart-btn"
                      onClick={() => onAddToCart(prod)}
                    >
                      <ShoppingCart size={14} />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

