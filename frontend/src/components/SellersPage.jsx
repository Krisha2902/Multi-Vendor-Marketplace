import React, { useRef } from 'react';
import { 
  Star, 
  ArrowRight, 
  Home, 
  Laptop, 
  Flower2, 
  Sprout, 
  Sparkles, 
  Shirt, 
  Gift, 
  Heart,
  Store,
  MapPin
} from 'lucide-react';
import { 
  ALL_FEATURED_SELLERS_PAGE, 
  TOP_RATED_SELLERS_PAGE, 
  DISCOVER_NEW_STORES_PAGE 
} from '../data/mockData';

const ICON_MAP = {
  Home,
  Laptop,
  Flower2,
  Sprout,
  Sparkles,
  Shirt,
  Gift
};

export default function SellersPage({
  onSelectSeller,
  onOpenSellerModal,
  onNavigateHome,
  onShowToast
}) {
  const featuredSectionRef = useRef(null);

  const scrollToFeatured = () => {
    if (featuredSectionRef.current) {
      featuredSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenStore = (seller) => {
    if (onSelectSeller) {
      onSelectSeller(seller);
    }
    if (onShowToast) {
      onShowToast(`Viewing ${seller.name}'s artisan store`);
    }
  };

  return (
    <div className="sellers-page-container">
      {/* 1. Breadcrumbs */}
      <div className="sellers-breadcrumb-wrap">
        <div className="sellers-breadcrumb">
          <span className="crumb-link" onClick={onNavigateHome}>Home</span>
          <span className="crumb-sep">&gt;</span>
          <span className="crumb-current">Sellers</span>
        </div>
      </div>

      {/* 2. Hero Header Section */}
      <section className="sellers-hero-section">
        <div className="sellers-hero-left">
          <h1 className="sellers-hero-title">Meet the Makers Behind Your Favorites</h1>
          <p className="sellers-hero-subtitle">
            Discover independent brands, creative entrepreneurs and passionate sellers.
          </p>
          <div className="sellers-hero-actions">
            <button 
              type="button" 
              className="sellers-explore-btn"
              onClick={scrollToFeatured}
            >
              <span>Explore Sellers</span>
              <ArrowRight size={15} />
            </button>
            <button 
              type="button" 
              className="sellers-become-btn"
              onClick={onOpenSellerModal}
            >
              <span>Become a Seller</span>
            </button>
          </div>
        </div>

        <div className="sellers-hero-right">
          <div className="sellers-hero-shelf-decor">
            {/* Wooden shelf aesthetic framed board & potted plants */}
            <div className="shelf-sign-frame">
              <div className="shelf-sign-inner">
                <span className="shelf-sign-line1">Support</span>
                <span className="shelf-sign-line2">Small</span>
                <span className="shelf-sign-line3">Business &hearts;</span>
              </div>
            </div>
            <div className="shelf-plants-decor">
              <img 
                src="https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=500&q=80" 
                alt="Support small sellers decor" 
                className="shelf-plants-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Section: Featured Sellers (5 Columns Layout) */}
      <section className="sellers-section" ref={featuredSectionRef}>
        <div className="sellers-section-header">
          <h2 className="sellers-section-title">Featured Sellers</h2>
          <button 
            type="button" 
            className="sellers-view-all"
            onClick={scrollToFeatured}
          >
            <span>View All</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="sellers-featured-grid">
          {ALL_FEATURED_SELLERS_PAGE.map((seller) => {
            const IconComp = ICON_MAP[seller.iconName] || Store;
            return (
              <div key={seller.id} className="sellers-featured-card">
                {/* Circle Icon or Monogram */}
                <div 
                  className="sellers-avatar-circle"
                  style={{ backgroundColor: seller.bg, color: seller.iconColor }}
                >
                  {seller.isMonogram ? (
                    <span className="sellers-monogram">{seller.monogramText}</span>
                  ) : (
                    <IconComp size={24} strokeWidth={1.9} color={seller.iconColor} />
                  )}
                </div>

                <h3 className="sellers-card-name">{seller.name}</h3>
                <p className="sellers-card-category">{seller.category}</p>

                {/* Rating & Product Count */}
                <div className="sellers-card-stats">
                  <span className="sellers-stat-rating">
                    <Star size={13} fill="#d97706" color="#d97706" />
                    <strong>{seller.ratingScore}</strong> ({seller.reviewsCount})
                  </span>
                  <span className="sellers-stat-divider">|</span>
                  <span className="sellers-stat-products">{seller.productsCount} Products</span>
                </div>

                {/* View Store Button */}
                <button 
                  type="button" 
                  className="sellers-view-store-btn"
                  onClick={() => handleOpenStore(seller)}
                >
                  <span>View Store</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            );
          })}

          {/* 5th Card: "Have Something Unique to Sell?" CTA Card */}
          <div className="sellers-cta-card">
            <h3 className="sellers-cta-title">Have Something Unique to Sell?</h3>
            <p className="sellers-cta-text">
              Turn your passion into a business. Join ShopNest and reach thousands of customers.
            </p>
            <button 
              type="button" 
              className="sellers-cta-action-btn"
              onClick={onOpenSellerModal}
            >
              <span>Start Selling Today</span>
              <ArrowRight size={14} />
            </button>
            <div className="sellers-cta-heart-deco" aria-hidden="true">
              <Heart size={38} strokeWidth={1.3} color="#2d4a36" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Section: Top Rated Sellers (3 Wide Cards Layout) */}
      <section className="sellers-section">
        <div className="sellers-section-header">
          <h2 className="sellers-section-title">Top Rated Sellers</h2>
          <button 
            type="button" 
            className="sellers-view-all"
            onClick={scrollToFeatured}
          >
            <span>View All</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="sellers-top-rated-grid">
          {TOP_RATED_SELLERS_PAGE.map((seller) => {
            const IconComp = ICON_MAP[seller.iconName] || Store;
            return (
              <div key={seller.id} className="sellers-top-card">
                {/* Top Cover Image */}
                <div className="sellers-top-cover-wrap">
                  <img 
                    src={seller.coverImage} 
                    alt={seller.name} 
                    className="sellers-top-cover" 
                    loading="lazy"
                  />
                  {/* Floating Avatar */}
                  <div 
                    className="sellers-top-avatar"
                    style={{ backgroundColor: seller.bg, color: seller.iconColor }}
                  >
                    {seller.isMonogram ? (
                      <span className="sellers-monogram">{seller.monogramText}</span>
                    ) : (
                      <IconComp size={24} strokeWidth={1.9} color={seller.iconColor} />
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="sellers-top-content">
                  <h3 className="sellers-top-name">{seller.name}</h3>
                  <p className="sellers-top-cat">{seller.category}</p>

                  <div className="sellers-top-meta">
                    <span className="sellers-stat-rating">
                      <Star size={13} fill="#d97706" color="#d97706" />
                      <strong>{seller.ratingScore}</strong> ({seller.reviewsCount})
                    </span>
                    <span className="sellers-stat-divider">|</span>
                    <span className="sellers-stat-location">
                      <MapPin size={12} />
                      {seller.location}
                    </span>
                  </div>

                  <p className="sellers-top-bio">"{seller.bio}"</p>

                  <button 
                    type="button" 
                    className="sellers-visit-store-btn"
                    onClick={() => handleOpenStore(seller)}
                  >
                    <span>Visit Store</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Section: Discover New Stores (4 Cards Layout) */}
      <section className="sellers-section">
        <div className="sellers-section-header">
          <h2 className="sellers-section-title">Discover New Stores</h2>
          <button 
            type="button" 
            className="sellers-view-all"
            onClick={scrollToFeatured}
          >
            <span>View All</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="sellers-discover-grid">
          {DISCOVER_NEW_STORES_PAGE.map((store) => {
            const IconComp = ICON_MAP[store.iconName] || Store;
            return (
              <div key={store.id} className="sellers-featured-card">
                {/* Circle Icon */}
                <div 
                  className="sellers-avatar-circle"
                  style={{ backgroundColor: store.bg, color: store.iconColor }}
                >
                  <IconComp size={24} strokeWidth={1.9} color={store.iconColor} />
                </div>

                <h3 className="sellers-card-name">{store.name}</h3>
                <p className="sellers-card-category">{store.category}</p>

                <div className="sellers-card-stats">
                  <span className="sellers-stat-rating">
                    <Star size={13} fill="#d97706" color="#d97706" />
                    <strong>{store.ratingScore}</strong> ({store.reviewsCount})
                  </span>
                  <span className="sellers-stat-divider">|</span>
                  <span className="sellers-stat-products">{store.productsCount} Products</span>
                </div>

                <button 
                  type="button" 
                  className="sellers-view-store-btn"
                  onClick={() => handleOpenStore(store)}
                >
                  <span>View Store</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Promotional Banner: "Turn Your Passion Into a Thriving Store" */}
      <section className="sellers-promo-banner-wrap">
        <div className="sellers-promo-banner">
          {/* Left Decorative Botanical Leaves */}
          <div className="sellers-promo-leaves" aria-hidden="true">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 100C35 75 60 65 95 60M95 60C85 40 70 25 45 20M95 60C70 65 40 50 30 30M95 60C85 75 75 95 60 110" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>

          <div className="sellers-promo-content">
            <h2 className="sellers-promo-title">Turn Your Passion Into a Thriving Store</h2>
            <p className="sellers-promo-subtitle">
              Join ShopNest and share your creativity with thousands of customers.
            </p>
            <button 
              type="button"
              className="sellers-promo-btn"
              onClick={onOpenSellerModal}
            >
              <span>Become a Seller</span>
              <ArrowRight size={15} />
            </button>
          </div>

          {/* Right Gift Box */}
          <div className="sellers-promo-gift-wrap">
            <img 
              src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=500&q=80" 
              alt="Join ShopNest seller package" 
              className="sellers-promo-gift-img"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

