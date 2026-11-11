import React, { useState, useMemo, useEffect } from 'react';
import {
  Heart,
  ShoppingCart,
  Star,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import {
  getPublicProducts,
  getPublicCategories,
  getPublicSellers,
} from '../api/publicMarketplace';

const SORT_TO_API = {
  popularity: 'popular',
  'price-low': 'price_asc',
  'price-high': 'price_desc',
  rating: 'rating_desc',
  newest: 'newest',
};

const PRICE_RANGE_OPTIONS = [
  { id: '0-500', label: '₹0 – ₹500', min: 0, max: 500 },
  { id: '500-1000', label: '₹500 – ₹1,000', min: 500, max: 1000 },
  { id: '1000-2000', label: '₹1,000 – ₹2,000', min: 1000, max: 2000 },
  { id: '2000+', label: '₹2,000+', min: 2000, max: Infinity }
];

export default function ShopPage({
  wishlistIds = [],
  onToggleWishlist,
  onAddToCart,
  onQuickView,
  onNavigateHome,
  onShowToast,
  selectedCategory = null,
  searchQuery = '',
  categories: propCategories = [],
  sellers: propSellers = [],
}) {
  const [categories, setCategories] = useState(propCategories);
  const [sellers, setSellers] = useState(propSellers);

  // Filters State
  const [heroSearch, setHeroSearch] = useState(searchQuery || '');
  const [appliedSearch, setAppliedSearch] = useState((searchQuery || '').trim());
  const [selectedPill, setSelectedPill] = useState(selectedCategory || 'all');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [minRating, setMinRating] = useState(null);
  const [selectedAvailability, setSelectedAvailability] = useState(null);
  const [selectedSeller, setSelectedSeller] = useState('All Sellers');
  const [sortBy, setSortBy] = useState('popularity');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Products & API State
  const [apiProducts, setApiProducts] = useState([]);
  const [serverPagination, setServerPagination] = useState({ totalProducts: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState('');

  // Keep categories & sellers synced with App or fetch standalone
  useEffect(() => {
    if (propCategories.length > 0) setCategories(propCategories);
  }, [propCategories]);

  useEffect(() => {
    if (propSellers.length > 0) setSellers(propSellers);
  }, [propSellers]);

  useEffect(() => {
    let active = true;
    const loadFilterMetadata = async () => {
      try {
        const [catData, sellerData] = await Promise.all([
          propCategories.length > 0 ? Promise.resolve(propCategories) : getPublicCategories(),
          propSellers.length > 0 ? Promise.resolve(propSellers) : getPublicSellers(),
        ]);
        if (!active) return;
        setCategories(catData || []);
        setSellers(sellerData || []);
      } catch (err) {
        console.warn('Could not load shop filter options:', err.message);
      }
    };

    if (propCategories.length === 0 || propSellers.length === 0) {
      loadFilterMetadata();
    }
    return () => {
      active = false;
    };
  }, []);

  // Sync external category/search navigation into ShopPage
  useEffect(() => {
    setSelectedPill(selectedCategory || 'all');
    setSelectedCategories([]);
    setCurrentPage(1);
  }, [selectedCategory]);

  useEffect(() => {
    setHeroSearch(searchQuery || '');
    setAppliedSearch((searchQuery || '').trim());
    setCurrentPage(1);
  }, [searchQuery]);

  // Determine single category parameter supported by GET /api/products
  const effectiveCategoryIds = useMemo(() => {
    if (selectedCategories.length > 0) return selectedCategories;
    if (selectedPill && selectedPill !== 'all') return [selectedPill];
    return [];
  }, [selectedPill, selectedCategories]);

  const hasClientOnlyFilters =
    selectedCategories.length > 1 ||
    (selectedPill !== 'all' && selectedCategories.length > 0 && !selectedCategories.includes(selectedPill)) ||
    selectedPriceRanges.length > 0 ||
    minRating !== null ||
    selectedAvailability !== null ||
    selectedSeller !== 'All Sellers';

  // Fetch products from GET /api/products
  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      try {
        setLoading(true);
        setError('');

        const params = {
          sort: SORT_TO_API[sortBy] || 'newest',
          page: hasClientOnlyFilters ? 1 : currentPage,
          limit: hasClientOnlyFilters ? 50 : pageSize,
        };

        if (appliedSearch) {
          params.search = appliedSearch;
        }

        if (effectiveCategoryIds.length === 1 && !(selectedPill !== 'all' && selectedCategories.length > 0)) {
          params.category = effectiveCategoryIds[0];
        }

        const data = await getPublicProducts(params);
        if (!active) return;

        setApiProducts(data.products || []);
        setServerPagination({
          totalProducts: data.pagination?.totalProducts ?? (data.products?.length || 0),
          totalPages: Math.max(1, data.pagination?.totalPages ?? 1),
        });
      } catch (err) {
        console.error('Error loading shop products:', err);
        if (active) {
          setApiProducts([]);
          setServerPagination({ totalProducts: 0, totalPages: 1 });
          setError(err.response?.data?.message || 'Unable to load products. Please try again.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProducts();
    return () => {
      active = false;
    };
  }, [
    appliedSearch,
    selectedPill,
    selectedCategories,
    sortBy,
    currentPage,
    hasClientOnlyFilters,
    effectiveCategoryIds,
  ]);

  const categoryPills = useMemo(
    () => [
      { id: 'all', label: 'All' },
      ...categories.map((cat) => ({ id: String(cat._id || cat.id), label: cat.name })),
    ],
    [categories]
  );

  const sellerOptions = useMemo(
    () => ['All Sellers', ...sellers.map((s) => s.name).filter(Boolean)],
    [sellers]
  );

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setAppliedSearch(heroSearch.trim());
    setCurrentPage(1);
  };

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

  const handleResetFilters = () => {
    setHeroSearch('');
    setAppliedSearch('');
    setSelectedPill('all');
    setSelectedCategories([]);
    setSelectedPriceRanges([]);
    setMinRating(null);
    setSelectedAvailability(null);
    setSelectedSeller('All Sellers');
    setSortBy('popularity');
    setCurrentPage(1);
    if (onShowToast) onShowToast('All catalog filters reset');
  };

  // Client-side refinements when multi-filters are active
  const filteredProducts = useMemo(() => {
    if (!hasClientOnlyFilters) return apiProducts;

    return apiProducts.filter((prod) => {
      const prodCatId = String(prod.category || '');

      if (selectedPill !== 'all' && prodCatId !== String(selectedPill)) {
        return false;
      }

      if (selectedCategories.length > 0 && !selectedCategories.includes(prodCatId)) {
        return false;
      }

      if (selectedPriceRanges.length > 0) {
        const matchesAnyPrice = selectedPriceRanges.some((rangeId) => {
          const opt = PRICE_RANGE_OPTIONS.find((p) => p.id === rangeId);
          if (!opt) return false;
          return prod.price >= opt.min && prod.price <= opt.max;
        });
        if (!matchesAnyPrice) return false;
      }

      if (minRating !== null && prod.rating < minRating) {
        return false;
      }

      if (selectedAvailability === 'in-stock' && !prod.inStock) return false;
      if (selectedAvailability === 'out-of-stock' && prod.inStock) return false;

      if (selectedSeller !== 'All Sellers' && prod.seller !== selectedSeller) {
        return false;
      }

      return true;
    });
  }, [
    apiProducts,
    hasClientOnlyFilters,
    selectedPill,
    selectedCategories,
    selectedPriceRanges,
    minRating,
    selectedAvailability,
    selectedSeller,
  ]);

  const totalProducts = hasClientOnlyFilters
    ? filteredProducts.length
    : serverPagination.totalProducts;

  const totalPages = hasClientOnlyFilters
    ? Math.max(1, Math.ceil(totalProducts / pageSize))
    : serverPagination.totalPages;

  const displayedProducts = useMemo(() => {
    if (!hasClientOnlyFilters) return filteredProducts;
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, hasClientOnlyFilters, currentPage, pageSize]);

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
    (minRating ? 1 : 0) +
    (selectedAvailability ? 1 : 0) +
    (selectedSeller !== 'All Sellers' ? 1 : 0);

  const pageNumbers = useMemo(() => {
    const pages = [];
    for (let i = 1; i <= Math.min(totalPages, 5); i += 1) {
      pages.push(i);
    }
    return pages;
  }, [totalPages]);

  return (
    <div className="shop-page-container">
      {/* 1. Breadcrumbs */}
      <div className="shop-breadcrumbs-bar">
        <button className="breadcrumb-link" onClick={onNavigateHome}>
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
            Explore authentic products directly from independent sellers.
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

      <div id="shop-product-grid-anchor" />

      {/* 4. Main 2-Column Section */}
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
              {categories.map((cat) => {
                const catId = String(cat._id || cat.id);
                return (
                  <label key={catId} className="filter-checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(catId)}
                      onChange={() => toggleCategory(catId)}
                      className="filter-checkbox"
                    />
                    <span>{cat.name}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Price Range */}
          <div className="filter-group">
            <h4 className="group-title">Price Range</h4>
            <div className="filter-options-list">
              {PRICE_RANGE_OPTIONS.map((opt) => (
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
                    onClick={() => {
                      if (minRating === stars) {
                        setMinRating(null);
                        setCurrentPage(1);
                      }
                    }}
                    onChange={() => {
                      setMinRating(stars);
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
                    <span className="rating-up-text">&amp; Up</span>
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
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
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

          {error && (
            <p role="alert" style={{ color: '#c0392b', marginBottom: '1rem' }}>
              {error}
            </p>
          )}

          {loading ? (
            <div className="shop-no-results">
              <h3>Loading products...</h3>
              <p>Fetching latest catalog items from verified sellers.</p>
            </div>
          ) : displayedProducts.length === 0 ? (
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
                const prodId = String(product._id || product.id);
                const isWishlisted = wishlistIds.includes(prodId);
                return (
                  <div key={prodId} className="shop-product-card">
                    <div className="card-image-wrap" onClick={() => onQuickView && onQuickView(product)}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="card-product-img"
                        loading="lazy"
                      />
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
                        <span className="card-rating-score">{product.rating || 4.8}</span>
                        <span className="card-reviews-count">
                          ({product.reviews >= 1000 ? `${(product.reviews / 1000).toFixed(1)}k` : (product.reviews || 0)})
                        </span>
                      </div>

                      <div className="card-price-row">
                        <span className="card-price-current">₹{Number(product.price || 0).toLocaleString('en-IN')}</span>
                        {product.originalPrice && (
                          <span className="card-price-original">₹{Number(product.originalPrice).toLocaleString('en-IN')}</span>
                        )}
                        {Number(product.discount) > 0 && (
                          <span className="card-discount-badge">{product.discount}% OFF</span>
                        )}
                      </div>

                      <button
                        className="card-add-cart-btn"
                        disabled={product.stock === 0}
                        onClick={() => {
                          if (onAddToCart) onAddToCart(product);
                        }}
                      >
                        <ShoppingCart size={15} />
                        <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination Bar */}
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

              {pageNumbers.map((page) => (
                <button
                  key={page}
                  className={`pagination-number-btn ${currentPage === page ? 'active' : ''}`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}

              {totalPages > 5 && <span className="pagination-ellipsis">...</span>}

              {totalPages > 5 && (
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

      {/* Newsletter Banner */}
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
