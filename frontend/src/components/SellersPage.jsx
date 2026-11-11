import React, { useEffect, useRef, useState } from 'react';
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
import { getPublicSellers } from '../api/publicMarketplace';

const CATEGORY_STYLE_BY_KEYWORD = [
  { match: 'fashion', icon: Shirt, bg: '#f6ebe4', color: '#8f472d' },
  { match: 'home', icon: Home, bg: '#ebe7de', color: '#475946' },
  { match: 'beauty', icon: Flower2, bg: '#fae6e6', color: '#a24a4a' },
  { match: 'tech', icon: Laptop, bg: '#e3ecf5', color: '#395f85' },
  { match: 'electron', icon: Laptop, bg: '#e3ecf5', color: '#395f85' },
  { match: 'eco', icon: Sprout, bg: '#e3f1ea', color: '#2e674d' },
  { match: 'hand', icon: Sparkles, bg: '#f5eadf', color: '#8b5b34' },
  { match: 'gift', icon: Gift, bg: '#f5e7f3', color: '#794673' },
];

const getSellerVisual = (category = '') => {
  const lower = String(category).toLowerCase();
  const found = CATEGORY_STYLE_BY_KEYWORD.find((item) => lower.includes(item.match));
  return found || { icon: Store, bg: '#ebe7de', color: '#233123' };
};

export default function SellersPage({
  sellers: propSellers = [],
  isLoading: propLoading = false,
  onSelectSeller,
  onOpenSellerModal,
  onNavigateHome,
  onShowToast
}) {
  const featuredSectionRef = useRef(null);
  const [sellers, setSellers] = useState(propSellers);
  const [loading, setLoading] = useState(propLoading && propSellers.length === 0);

  useEffect(() => {
    if (propSellers.length > 0) {
      setSellers(propSellers);
      setLoading(false);
    }
  }, [propSellers]);

  useEffect(() => {
    if (propSellers.length > 0) return;

    let active = true;
    const loadSellers = async () => {
      try {
        setLoading(true);
        const list = await getPublicSellers();
        if (active) setSellers(list || []);
      } catch (err) {
        console.error('Failed to load sellers:', err);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadSellers();
    return () => {
      active = false;
    };
  }, [propSellers.length]);

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

  const topShowcaseSellers = [...sellers]
    .sort((a, b) => (b.productsCount || 0) - (a.productsCount || 0))
    .slice(0, 3);

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

      {/* 3. Section: Verified Sellers */}
      <section className="sellers-section" ref={featuredSectionRef}>
        <div className="sellers-section-header">
          <h2 className="sellers-section-title">Featured Sellers</h2>
          <span style={{ fontSize: '0.9rem', color: '#64748b' }}>
            {sellers.length} Verified {sellers.length === 1 ? 'Store' : 'Stores'}
          </span>
        </div>

        {loading && sellers.length === 0 ? (
          <p className="empty-state">Loading approved sellers...</p>
        ) : (
          <div className="sellers-featured-grid">
            {sellers.map((seller) => {
              const visual = getSellerVisual(seller.category);
              const IconComp = visual.icon;
              return (
                <div key={seller.id} className="sellers-featured-card">
                  <div
                    className="sellers-avatar-circle"
                    style={{ backgroundColor: visual.bg, color: visual.color }}
                  >
                    {seller.avatar ? (
                      <img
                        src={seller.avatar}
                        alt={seller.name}
                        style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                      />
                    ) : (
                      <IconComp size={24} strokeWidth={1.9} color={visual.color} />
                    )}
                  </div>

                  <h3 className="sellers-card-name">{seller.name}</h3>
                  <p className="sellers-card-category">{seller.category}</p>

                  <div className="sellers-card-stats">
                    <span className="sellers-stat-rating">
                      <Star size={13} fill="#d97706" color="#d97706" />
                      <strong>{seller.ratingScore || 'Verified'}</strong>
                      {seller.reviewsCount ? ` (${seller.reviewsCount})` : ''}
                    </span>
                    <span className="sellers-stat-divider">|</span>
                    <span className="sellers-stat-products">{seller.productsCount || 0} Products</span>
                  </div>

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

            {/* CTA Card */}
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
        )}
      </section>

      {/* 4. Section: Store Spotlights (Real Sellers from DB) */}
      {topShowcaseSellers.length > 0 && (
        <section className="sellers-section">
          <div className="sellers-section-header">
            <h2 className="sellers-section-title">Top Independent Stores</h2>
          </div>

          <div className="sellers-top-rated-grid">
            {topShowcaseSellers.map((seller) => {
              const visual = getSellerVisual(seller.category);
              const IconComp = visual.icon;
              const coverImg =
                seller.thumbnails?.[0]?.image ||
                'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80';

              return (
                <div key={seller.id} className="sellers-top-card">
                  <div className="sellers-top-cover-wrap">
                    <img
                      src={coverImg}
                      alt={seller.name}
                      className="sellers-top-cover"
                      loading="lazy"
                    />
                    <div
                      className="sellers-top-avatar"
                      style={{ backgroundColor: visual.bg, color: visual.color }}
                    >
                      <IconComp size={24} strokeWidth={1.9} color={visual.color} />
                    </div>
                  </div>

                  <div className="sellers-top-content">
                    <h3 className="sellers-top-name">{seller.name}</h3>
                    <p className="sellers-top-cat">{seller.category}</p>

                    <div className="sellers-top-meta">
                      <span className="sellers-stat-rating">
                        <Store size={13} />
                        <strong>{seller.productsCount || 0}</strong> Products
                      </span>
                      <span className="sellers-stat-divider">|</span>
                      <span className="sellers-stat-location">
                        <MapPin size={12} />
                        {seller.location || 'India'}
                      </span>
                    </div>

                    <p className="sellers-top-bio">
                      "{seller.bio || `Curated ${seller.category || 'artisan'} collection from ${seller.name}.`}"
                    </p>

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
      )}

      {/* 5. Promotional Banner */}
      <section className="sellers-promo-banner-wrap">
        <div className="sellers-promo-banner">
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
