import React from 'react';
import ProductCard from './ProductCard';
import { ArrowRight } from 'lucide-react';

export default function NewArrivals({ 
  products, 
  wishlistIds, 
  onToggleWishlist, 
  onAddToCart, 
  onQuickView,
  onViewAll 
}) {
  return (
    <section className="section-container" id="new-arrivals-section">
      <div className="section-header-row">
        <h2 className="section-title">New Arrivals</h2>
        <button 
          className="section-view-all-btn"
          onClick={onViewAll}
        >
          <span>View All</span>
          <ArrowRight size={16} />
        </button>
      </div>

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
    </section>
  );
}
