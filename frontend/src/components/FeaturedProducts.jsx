
import ProductCard from './ProductCard';
import { ArrowRight } from 'lucide-react';

export default function FeaturedProducts({
  products = [],
  wishlistIds = [],
  onToggleWishlist,
  onAddToCart,
  onQuickView,
  onViewAll,
  isLoading = false,
  title = 'Featured Products',
}) {
  return (
    <section
      className="section-container"
      id="featured-products-section"
    >
      <div className="section-header-row">
        <h2 className="section-title">{title}</h2>

        <button
          className="section-view-all-btn"
          onClick={onViewAll}
        >
          <span>View All</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {isLoading ? (
        <p className="empty-state">
          Loading products...
        </p>
      ) : products.length === 0 ? (
        <p className="empty-state">
          No products available at the moment.
        </p>
      ) : (
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
