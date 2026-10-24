import React from 'react';

export default function HeroSection({ searchQuery, setSearchQuery, onSearchSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearchSubmit) onSearchSubmit();
    const target = document.getElementById('featured-products-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const trendingTags = ['Ceramic Pots', 'Floral Dresses', 'Leather Journal', 'Wireless Audio', 'Handmade'];

  return (
    <section className="hero-section">
      <div className="hero-banner-card">
        {/* Background Image Container */}
        <div className="hero-image-overlay">
          <img 
            src="/hero-banner.jpg" 
            alt="Warm aesthetic interior with ceramic vase and candle" 
            className="hero-bg-img"
          />
          <div className="hero-gradient-scrim"></div>
        </div>

        {/* Content Box */}
        <div className="hero-content">
          <h1 className="hero-heading">
            Discover Unique Finds<br />
            from Independent Sellers
          </h1>
          <p className="hero-subtitle">
            Shop from thousands of products, support small businesses, and find something special.
          </p>

          {/* Prominent Search Bar */}
          <form className="hero-search-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Search for products, brands and more..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="hero-search-input"
            />
            <button type="submit" className="hero-search-btn">
              Search
            </button>
          </form>

          {/* Quick Trending Tags */}
          <div className="hero-quick-tags">
            <span className="tags-label">Popular:</span>
            {trendingTags.map((tag) => (
              <button
                key={tag}
                type="button"
                className="trending-tag-pill"
                onClick={() => {
                  setSearchQuery(tag);
                  const target = document.getElementById('featured-products-section');
                  if (target) target.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
