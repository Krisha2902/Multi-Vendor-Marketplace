import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Heart, 
  ShoppingCart, 
  Star, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  SlidersHorizontal,
  Send,
  Check
} from 'lucide-react';
import { SHOP_CATALOG_PRODUCTS } from '../data/mockData';

export default function ShopPage({
  wishlistIds = [],
  onToggleWishlist,
  onAddToCart,
  onQuickView,
  onNavigateHome,
  onShowToast
}) {
  // Filters State
  const [heroSearch, setHeroSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [selectedPill, setSelectedPill] = useState('all');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [minRating, setMinRating] = useState(null);
  const [selectedAvailability, setSelectedAvailability] = useState(null);
  const [selectedSeller, setSelectedSeller] = useState('All Sellers');
  const [sortBy, setSortBy] = useState('popularity');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState('');

  // Pills definitions matching design
  const categoryPills = [
    { id: 'all', label: 'All' },
    { id: 'fashion', label: 'Fashion' },
    { id: 'home', label: 'Home & Living' },
    { id: 'beauty', label: 'Beauty' },
    { id: 'electronics', label: 'Electronics' },
    { id: 'sports', label: 'Sports' },
    { id: 'toys', label: 'Toys & Games' },
    { id: 'books', label: 'Books' }
  ];

  // Category filter options for sidebar
  const sidebarCategories = [
    { id: 'fashion', label: 'Fashion' },
    { id: 'home', label: 'Home & Living' },
    { id: 'beauty', label: 'Beauty' },
    { id: 'electronics', label: 'Electronics' },
    { id: 'sports', label: 'Sports' },
    { id: 'toys', label: 'Toys & Games' },
    { id: 'books', label: 'Books' }
  ];

  // Price range options
  const priceRangeOptions = [
    { id: '0-500', label: '₹0 – ₹500', min: 0, max: 500 },
    { id: '500-1000', label: '₹500 – ₹1,000', min: 500, max: 1000 },
    { id: '1000-2000', label: '₹1,000 – ₹2,000', min: 1000, max: 2000 },
    { id: '2000+', label: '₹2,000+', min: 2000, max: Infinity }
  ];

  // Brands list
  const brandOptions = ['Nike', 'Zara', 'H&M', 'Sony', 'Others'];

  // Sellers list
  const sellerOptions = [
    'All Sellers',
    'StyleStudio',
    'TechNest',
    'UrbanCraft',
    'BloomBeauty',
    'FitZone',
    'DreamToys',
    'BookHaven',
    'HomeAura',
    'CozyHome'
  ];

  // Handle Search Submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setAppliedSearch(heroSearch.trim());
    setCurrentPage(1);
  };

  // Toggle helpers
  const toggleCategory = (id) => {
    setSelectedCategories((prev) => 
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
    setCurrentPage(1);
  };

  const togglePriceRange = (id) => {
    setSelectedPriceRanges((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
    setCurrentPage(1);
  };

  const toggleBrand = (b) => {
    setSelectedBrands((prev) =>
      prev.includes(b) ? prev.filter((item) => item !== b) : [...prev, b]
    );
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setHeroSearch('');
    setAppliedSearch('');
    setSelectedPill('all');
    setSelectedCategories([]);
    setSelectedPriceRanges([]);
    setSelectedBrands([]);
    setMinRating(null);
    setSelectedAvailability(null);
    setSelectedSeller('All Sellers');
    setSortBy('popularity');
    setCurrentPage(1);
    if (onShowToast) onShowToast('All catalog filters reset');
  };

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    return SHOP_CATALOG_PRODUCTS.filter((prod) => {
      // 1. Hero / Applied Search
      if (appliedSearch) {
        const query = appliedSearch.toLowerCase();
        const matches = 
          prod.name.toLowerCase().includes(query) ||
          prod.seller.toLowerCase().includes(query) ||
          prod.categoryName.toLowerCase().includes(query) ||
          (prod.description && prod.description.toLowerCase().includes(query));
        if (!matches) return false;
      }

      // 2. Category Pill Filter
      if (selectedPill !== 'all' && prod.category !== selectedPill) {
        return false;
      }

      // 3. Sidebar Categories Filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(prod.category)) {
        return false;
      }

      // 4. Price Ranges Filter
      if (selectedPriceRanges.length > 0) {
        const matchesAnyPrice = selectedPriceRanges.some((rangeId) => {
          const opt = priceRangeOptions.find((p) => p.id === rangeId);
          if (!opt) return false;
          return prod.price >= opt.min && prod.price <= opt.max;
        });
        if (!matchesAnyPrice) return false;
      }

      // 5. Brands Filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(prod.brand)) {
        return false;
      }

      // 6. Rating Filter
      if (minRating !== null && prod.rating < minRating) {
        return false;
      }

      // 7. Availability Filter
      if (selectedAvailability === 'in-stock' && !prod.inStock) return false;
      if (selectedAvailability === 'out-of-stock' && prod.inStock) return false;

      // 8. Seller Filter
      if (selectedSeller !== 'All Sellers' && prod.seller !== selectedSeller) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return b.id.localeCompare(a.id);
      return b.reviews - a.reviews; // default 'popularity'
    });
  }, [
    appliedSearch,
    selectedPill,
    selectedCategories,
    selectedPriceRanges,
    selectedBrands,
    minRating,
    selectedAvailability,
    selectedSeller,
    sortBy
  ]);

  // Pagination calculation
  const totalProducts = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalProducts / pageSize));
  const displayedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    const gridEl = document.getElementById('shop-product-grid-anchor');
    if (gridEl) gridEl.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      if (onShowToast) onShowToast(`Subscribed successfully with ${newsletterEmail}!`);
      setNewsletterEmail('');
    }
  };

  const activeFiltersCount = 
    (appliedSearch ? 1 : 0) +
    (selectedPill !== 'all' ? 1 : 0) +
    selectedCategories.length +
    selectedPriceRanges.length +
    selectedBrands.length +
    (minRating ? 1 : 0) +
    (selectedAvailability ? 1 : 0) +
    (selectedSeller !== 'All Sellers' ? 1 : 0);

  return (
    <div className="shop-page-container">
      {/* 1. Breadcrumbs */}
      <div className="shop-breadcrumbs-bar">
        <button 
          className="breadcrumb-link" 
          onClick={onNavigateHome}
        >
          Home
        </button>
        <span className="breadcrumb-separator">›</span>
        <span className="breadcrumb-current">Shop</span>
      </div>

      {/* 2. Shop Hero Banner */}
      <section className="shop-hero-banner">
        <div className="shop-hero-content">
          <h1 className="shop-hero-title">Find Something You'll Love</h1>
          <p className="shop-hero-subtitle">
            Explore thousands of unique products from independent sellers.
          </p>

          <form onSubmit={handleSearchSubmit} className="shop-search-bar-form">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
              className="shop-search-input"
            />
            <button type="submit" className="shop-search-btn">
              Search
            </button>
          </form>
        </div>

        <div className="shop-hero-visual">
          <img 
            src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=900&q=80" 
            alt="Artisanal Lifestyle Collection" 
            className="shop-hero-img"
          />
        </div>
      </section>

      {/* 3. Category Horizontal Pills */}
      <div className="shop-category-pills-bar">
        {categoryPills.map((pill) => (
          <button
            key={pill.id}
            onClick={() => {
              setSelectedPill(pill.id);
              setCurrentPage(1);
            }}
            className={`shop-category-pill ${selectedPill === pill.id ? 'active' : ''}`}
          >
            {pill.label}
          </button>
        ))}
      </div>

      {/* Anchor for smooth scroll upon pagination */}
      <div id="shop-product-grid-anchor" />

      {/* 4. Main 2-Column Section (Sidebar Filter + Product Grid) */}
      <div className="shop-main-layout">
        {/* Left Sidebar Filter */}
        <aside className="shop-sidebar-filters">
          <div className="sidebar-filter-header">
            <h3 className="filter-title">Filter By</h3>
            {activeFiltersCount > 0 && (
              <button 
                className="reset-filters-btn" 
                onClick={handleResetFilters}
                title="Reset all filters"
              >
                <RotateCcw size={14} />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Categories */}
          <div className="filter-group">
            <h4 className="group-title">Categories</h4>
            <div className="filter-options-list">
              {sidebarCategories.map((cat) => (
                <label key={cat.id} className="filter-checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={selectedCategories.includes(cat.id)}
                    onChange={() => toggleCategory(cat.id)}
                    className="filter-checkbox"
                  />
                  <span>{cat.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="filter-group">
            <h4 className="group-title">Price Range</h4>
            <div className="filter-options-list">
              {priceRangeOptions.map((opt) => (
                <label key={opt.id} className="filter-checkbox-label">
                  <input 
                    type="checkbox"
                    checked={selectedPriceRanges.includes(opt.id)}
                    onChange={() => togglePriceRange(opt.id)}
                    className="filter-checkbox"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Brand */}
          <div className="filter-group">
            <h4 className="group-title">Brand</h4>
            <div className="filter-options-list">
              {brandOptions.map((brand) => (
                <label key={brand} className="filter-checkbox-label">
                  <input 
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                    className="filter-checkbox"
                  />
                  <span>{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="filter-group">
            <h4 className="group-title">Rating</h4>
            <div className="filter-options-list">
              {[4, 3, 2].map((stars) => (
                <label key={stars} className="filter-radio-label">
                  <input 
                    type="radio" 
                    name="rating-filter"
                    checked={minRating === stars}
                    onChange={() => {
                      setMinRating(minRating === stars ? null : stars);
                      setCurrentPage(1);
                    }}
                    className="filter-radio"
                  />
                  <div className="rating-stars-row">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star 
                        key={s} 
                        size={14} 
                        className={s <= stars ? 'star-filled' : 'star-muted'}
                      />
                    ))}
                    <span className="rating-up-text">& Up</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="filter-group">
            <h4 className="group-title">Availability</h4>
            <div className="filter-options-list">
              <label className="filter-checkbox-label">
                <input 
                  type="checkbox"
                  checked={selectedAvailability === 'in-stock'}
                  onChange={() => {
                    setSelectedAvailability(selectedAvailability === 'in-stock' ? null : 'in-stock');
                    setCurrentPage(1);
                  }}
                  className="filter-checkbox"
                />
                <span>In Stock</span>
              </label>
              <label className="filter-checkbox-label">
                <input 
                  type="checkbox"
                  checked={selectedAvailability === 'out-of-stock'}
                  onChange={() => {
                    setSelectedAvailability(selectedAvailability === 'out-of-stock' ? null : 'out-of-stock');
                    setCurrentPage(1);
                  }}
                  className="filter-checkbox"
                />
                <span>Out of Stock</span>
              </label>
            </div>
          </div>

          {/* Seller Dropdown */}
          <div className="filter-group">
            <h4 className="group-title">Seller</h4>
            <div className="seller-select-wrap">
              <select 
                value={selectedSeller} 
                onChange={(e) => {
                  setSelectedSeller(e.target.value);
                  setCurrentPage(1);
                }}
                className="seller-filter-select"
              >
                {sellerOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <ChevronDown size={14} className="select-chevron" />
            </div>
          </div>
        </aside>

        {/* Right Products Content */}
        <div className="shop-products-column">
          {/* Top Bar (Title, Count & Sort By) */}
          <div className="products-header-bar">
            <div>
              <h2 className="all-products-heading">
                {selectedPill !== 'all' 
                  ? categoryPills.find((p) => p.id === selectedPill)?.label || 'Products' 
                  : 'All Products'}
              </h2>
              <p className="products-count-text">
                Showing {totalProducts === 0 ? 0 : (currentPage - 1) * pageSize + 1}–
                {Math.min(currentPage * pageSize, totalProducts)} of {totalProducts} products
              </p>
            </div>

            <div className="sort-by-wrap">
              <span className="sort-label">Sort by:</span>
              <div className="sort-select-container">
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-by-select"
                >
                  <option value="popularity">Popularity</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
                <ChevronDown size={14} className="sort-chevron" />
              </div>
            </div>
          </div>

          {/* Product Cards Grid (4 Columns) */}
          {displayedProducts.length === 0 ? (
            <div className="shop-no-results">
              <h3>No products found</h3>
              <p>We couldn't find any products matching your active filters.</p>
              <button className="clear-filters-action-btn" onClick={handleResetFilters}>
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="shop-grid-4col">
              {displayedProducts.map((product) => {
                const isWishlisted = wishlistIds.includes(product.id);
                return (
                  <div key={product.id} className="shop-product-card">
                    {/* Image Box */}
                    <div className="card-image-wrap" onClick={() => onQuickView && onQuickView(product)}>
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="card-product-img" 
                        loading="lazy"
                      />
                      {/* Wishlist Button */}
                      <button 
                        className={`card-wishlist-btn ${isWishlisted ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onToggleWishlist) onToggleWishlist(product);
                        }}
                        aria-label="Save to Wishlist"
                      >
                        <Heart 
                          size={16} 
                          fill={isWishlisted ? '#cf633a' : 'none'} 
                          color={isWishlisted ? '#cf633a' : '#1e1d1a'} 
                        />
                      </button>
                    </div>

                    {/* Card Body */}
                    <div className="card-info-wrap">
                      <h3 
                        className="card-product-name" 
                        onClick={() => onQuickView && onQuickView(product)}
                      >
                        {product.name}
                      </h3>
                      <p className="card-seller-name">by {product.seller}</p>

                      <div className="card-rating-row">
                        <Star size={13} className="card-rating-star" />
                        <span className="card-rating-score">{product.rating}</span>
                        <span className="card-reviews-count">
                          ({product.reviews >= 1000 ? `${(product.reviews / 1000).toFixed(1)}k` : product.reviews})
                        </span>
                      </div>

                      <div className="card-price-row">
                        <span className="card-price-current">₹{product.price.toLocaleString()}</span>
                        {product.originalPrice && (
                          <span className="card-price-original">₹{product.originalPrice.toLocaleString()}</span>
                        )}
                        {product.discount && (
                          <span className="card-discount-badge">{product.discount}</span>
                        )}
                      </div>

                      <button 
                        className="card-add-cart-btn"
                        onClick={() => {
                          if (onAddToCart) onAddToCart(product);
                        }}
                      >
                        <ShoppingCart size={15} />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 5. Pagination Bar */}
          {totalPages > 1 && (
            <div className="shop-pagination-bar">
              <button 
                className="pagination-arrow-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous Page"
              >
                <ChevronLeft size={16} />
              </button>

              <button 
                className={`pagination-number-btn ${currentPage === 1 ? 'active' : ''}`}
                onClick={() => handlePageChange(1)}
              >
                1
              </button>

              {totalPages >= 2 && (
                <button 
                  className={`pagination-number-btn ${currentPage === 2 ? 'active' : ''}`}
                  onClick={() => handlePageChange(2)}
                >
                  2
                </button>
              )}

              {totalPages >= 3 && (
                <button 
                  className={`pagination-number-btn ${currentPage === 3 ? 'active' : ''}`}
                  onClick={() => handlePageChange(3)}
                >
                  3
                </button>
              )}

              {totalPages > 4 && <span className="pagination-ellipsis">...</span>}

              {totalPages > 3 && (
                <button 
                  className={`pagination-number-btn ${currentPage === totalPages ? 'active' : ''}`}
                  onClick={() => handlePageChange(totalPages)}
                >
                  {totalPages}
                </button>
              )}

              <button 
                className="pagination-arrow-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next Page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 6. Newsletter Banner */}
      <section className="shop-newsletter-banner">
        <div className="newsletter-card-inner">
          <div className="newsletter-text-col">
            <h3 className="newsletter-heading">Stay Updated!</h3>
            <p className="newsletter-sub">Get the latest deals, new arrivals and more.</p>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="newsletter-form-col">
            <input 
              type="email" 
              required
              placeholder="Enter your email address..." 
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="newsletter-email-input"
            />
            <button type="submit" className="newsletter-subscribe-btn">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

