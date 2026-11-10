
import React from 'react';
import ProductCard from './ProductCard';
import { ArrowRight } from 'lucide-react';

export default function NewArrivals({
  products = [],
  wishlistIds = [],
  isLoading = false,
  onToggleWishlist,
  onAddToCart,
  onQuickView,
  onViewAll
}) {
  return (
    <section
      className="section-container"
      id="new-arrivals-section"
    >
      <div className="section-header-row">
        <h2 className="section-title">New Arrivals</h2>

        <button
          className="section-view-all-btn"
          onClick={onViewAll}
          type="button"
        >
          <span>View All</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="products-grid">
          <p>Loading new arrivals...</p>
        </div>
      ) : products.length === 0 ? (

        /* Empty State */
        <div className="products-grid">
          <p>No new arrivals available at the moment.</p>
        </div>

      ) : (

        /* Display Products from Backend */
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isWishlisted={wishlistIds.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
              onAddToCart={onAddToCart}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      )}
    </section>
  );
}
