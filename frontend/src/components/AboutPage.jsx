import React from 'react';
import { 
  ArrowRight, 
  Gem, 
  Sprout, 
  ShieldCheck, 
  Lock, 
  Smile, 
  Store, 
  Heart, 
  ShoppingBag, 
  Package
} from 'lucide-react';

export default function AboutPage({
  onNavigateHome,
  onNavigateShop,
  onOpenSellerModal,
  onShowToast
}) {
  return (
    <div className="about-page-container">
      {/* 1. Breadcrumbs */}
      <div className="about-breadcrumb-wrap">
        <div className="about-breadcrumb">
          <span className="crumb-link" onClick={onNavigateHome}>Home</span>
          <span className="crumb-sep">&gt;</span>
          <span className="crumb-current">About</span>
        </div>
      </div>

      {/* 2. Hero Header Section */}
      <section className="about-hero-section">
        <div className="about-hero-left">
          <h1 className="about-hero-title">Shopping That Supports Dreams.</h1>
          <p className="about-hero-subtitle">
            ShopNest brings together independent sellers and curious shoppers, creating a marketplace where every purchase tells a story.
          </p>
        </div>

        <div className="about-hero-right">
          <div className="about-hero-visual">
            <div className="about-hero-img-wrap">
              <img 
                src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80" 
                alt="ShopNest aesthetic workspace setup" 
                className="about-hero-img"
              />
              {/* Laptop screen branding badge overlay */}
              <div className="about-laptop-mockup">
                <div className="about-laptop-screen">
                  <div className="about-laptop-logo">
                    <Heart size={20} fill="#cf633a" color="#cf633a" />
                    <span>ShopNest</span>
                  </div>
                </div>
                <div className="about-laptop-base"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Section: "Why ShopNest?" + Mission & Vision */}
      <section className="about-mission-section">
        <div className="about-mission-grid">
          {/* Left Text */}
          <div className="about-mission-prose">
            <h2 className="about-prose-title">Why ShopNest?</h2>
            <p className="about-prose-lead">
              We started ShopNest with a simple idea — to create a marketplace that empowers small businesses and helps you find unique, high-quality products, all in one place.
            </p>
            <p className="about-prose-sub">
              Because we believe every purchase can support a dream.
            </p>
          </div>

          {/* Middle Card: Our Mission */}
          <div className="about-pillar-card">
            <div className="about-pillar-icon-wrap">
              <Gem size={28} strokeWidth={1.8} color="#233123" />
            </div>
            <h3 className="about-pillar-title">Our Mission</h3>
            <p className="about-pillar-desc">
              Empower independent sellers by providing them a platform to showcase their products.
            </p>
          </div>

          {/* Right Card: Our Vision */}
          <div className="about-pillar-card">
            <div className="about-pillar-icon-wrap">
              <Sprout size={28} strokeWidth={1.8} color="#233123" />
            </div>
            <h3 className="about-pillar-title">Our Vision</h3>
            <p className="about-pillar-desc">
              Build a marketplace where discovering unique products and supporting small businesses go hand in hand.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Section: "Why Choose ShopNest?" */}
      <section className="about-choose-section">
        <div className="about-section-divider">
          <span className="divider-line"></span>
          <h2 className="about-divider-title">Why Choose ShopNest?</h2>
          <span className="divider-line"></span>
        </div>

        <div className="about-features-row">
          <div className="about-feature-item">
            <div className="about-feature-circle">
              <Gem size={22} color="#233123" strokeWidth={1.8} />
            </div>
            <h4 className="about-feature-heading">Unique Products</h4>
            <p className="about-feature-sub">Discover something different.</p>
          </div>

          <div className="about-feature-item">
            <div className="about-feature-circle">
              <ShieldCheck size={22} color="#233123" strokeWidth={1.8} />
            </div>
            <h4 className="about-feature-heading">Trusted Sellers</h4>
            <p className="about-feature-sub">Shop with confidence.</p>
          </div>

          <div className="about-feature-item">
            <div className="about-feature-circle">
              <Lock size={22} color="#233123" strokeWidth={1.8} />
            </div>
            <h4 className="about-feature-heading">Secure Shopping</h4>
            <p className="about-feature-sub">Safe and reliable.</p>
          </div>

          <div className="about-feature-item">
            <div className="about-feature-circle">
              <Smile size={22} color="#233123" strokeWidth={1.8} />
            </div>
            <h4 className="about-feature-heading">Easy Experience</h4>
            <p className="about-feature-sub">Shop with ease.</p>
          </div>
        </div>
      </section>

      {/* 5. Section: "Our Story" */}
      <section className="about-story-section">
        <div className="about-story-grid">
          {/* Left Visual Bag Photo */}
          <div className="about-story-visual">
            <div className="about-story-bag-card">
              <img 
                src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=700&q=80" 
                alt="ShopNest curated handmade crafts and bag" 
                className="about-story-img"
              />
              <div className="about-bag-overlay">
                <div className="about-bag-badge">
                  <Heart size={20} fill="#cf633a" color="#cf633a" />
                  <span className="about-bag-brand">ShopNest</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Narrative */}
          <div className="about-story-text">
            <h2 className="about-story-title">Our Story</h2>
            <p className="about-story-p1">
              ShopNest was born from a simple belief — that great products and talented creators deserve a bigger stage.
            </p>
            <p className="about-story-p2">
              We're here to connect independent sellers with shoppers who value creativity, quality and small businesses. Together, we're building a marketplace that celebrates individuality and supports dreams.
            </p>
            <button 
              type="button" 
              className="about-journey-btn"
              onClick={() => {
                if (onNavigateShop) onNavigateShop();
                if (onShowToast) onShowToast('Welcome to our journey! Explore the Shop.');
              }}
            >
              <span>Join Our Journey</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* 6. Section: "What Makes Us Different" */}
      <section className="about-different-section">
        <div className="about-section-divider">
          <span className="divider-line"></span>
          <h2 className="about-divider-title">What Makes Us Different</h2>
          <span className="divider-line"></span>
        </div>

        <div className="about-different-grid">
          <div className="about-different-card">
            <div className="about-different-icon-wrap">
              <Store size={26} color="#233123" strokeWidth={1.8} />
            </div>
            <h3 className="about-different-title">Support Small Business</h3>
            <p className="about-different-desc">
              Help independent creators and small businesses grow.
            </p>
          </div>

          <div className="about-different-card">
            <div className="about-different-icon-wrap">
              <Heart size={26} color="#233123" strokeWidth={1.8} />
            </div>
            <h3 className="about-different-title">Unique & Curated Finds</h3>
            <p className="about-different-desc">
              Discover products you won't find anywhere else.
            </p>
          </div>

          <div className="about-different-card">
            <div className="about-different-icon-wrap">
              <ShieldCheck size={26} color="#233123" strokeWidth={1.8} />
            </div>
            <h3 className="about-different-title">A Trusted Marketplace</h3>
            <p className="about-different-desc">
              Shop safely with secure payments and reliable sellers.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Section: "ShopNest By The Numbers" */}
      <section className="about-numbers-section">
        <div className="about-section-divider">
          <span className="divider-line"></span>
          <h2 className="about-divider-title">ShopNest By The Numbers</h2>
          <span className="divider-line"></span>
        </div>

        <div className="about-numbers-row">
          <div className="about-stat-col">
            <ShoppingBag size={24} color="#233123" strokeWidth={1.8} />
            <span className="about-stat-number">50K+</span>
            <span className="about-stat-label">Happy Customers</span>
          </div>

          <div className="about-stat-divider"></div>

          <div className="about-stat-col">
            <Store size={24} color="#233123" strokeWidth={1.8} />
            <span className="about-stat-number">5K+</span>
            <span className="about-stat-label">Independent Sellers</span>
          </div>

          <div className="about-stat-divider"></div>

          <div className="about-stat-col">
            <Package size={24} color="#233123" strokeWidth={1.8} />
            <span className="about-stat-number">1M+</span>
            <span className="about-stat-label">Products Listed</span>
          </div>

          <div className="about-stat-divider"></div>

          <div className="about-stat-col">
            <Heart size={24} color="#233123" strokeWidth={1.8} />
            <span className="about-stat-number">98%</span>
            <span className="about-stat-label">Customer Satisfaction</span>
          </div>
        </div>
      </section>

      {/* 8. Promotional Banner: "Be Part of Our Community" */}
      <section className="about-promo-banner-wrap">
        <div className="about-promo-banner">
          {/* Left Botanical Leaves Deco */}
          <div className="about-promo-leaves" aria-hidden="true">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 100C35 75 60 65 95 60M95 60C85 40 70 25 45 20M95 60C70 65 40 50 30 30M95 60C85 75 75 95 60 110" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>

          <div className="about-promo-content">
            <h2 className="about-promo-title">Be Part of Our Community</h2>
            <p className="about-promo-subtitle">
              Shop, sell, and grow with ShopNest.
            </p>
            <div className="about-promo-actions">
              <button 
                type="button" 
                className="about-promo-shop-btn"
                onClick={() => {
                  if (onNavigateShop) onNavigateShop();
                  if (onShowToast) onShowToast('Browsing products in Shop');
                }}
              >
                <span>Start Shopping</span>
                <ArrowRight size={15} />
              </button>
              <button 
                type="button" 
                className="about-promo-seller-btn"
                onClick={onOpenSellerModal}
              >
                <span>Become a Seller</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          {/* Right Gift Box Illustration */}
          <div className="about-promo-gift-wrap">
            <img 
              src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=500&q=80" 
              alt="Join ShopNest community gift box" 
              className="about-promo-gift-img"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

