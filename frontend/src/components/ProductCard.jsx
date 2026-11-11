import { Heart, Star, ShoppingCart, Eye } from 'lucide-react';

export default function ProductCard({ 
  product, 
  isWishlisted, 
  onToggleWishlist, 
  onAddToCart, 
  onQuickView 
}) {
  const {
    name,
    seller,
    price,
    originalPrice,
    discount,
    stock,
    rating,
    reviews,
    badge,
    badgeType,
    image
  } = product;

  const isOutOfStock = Number(stock) === 0;

  return (
    <div className="product-card">
      {/* Image Wrap */}
      <div className="product-image-container">
        <img 
          src={image} 
          alt={name} 
          className="product-main-img" 
          loading="lazy" 
        />

        {/* Top-Left Badge if available */}
        {isOutOfStock ? (
          <span className="product-badge badge-out">Out of Stock</span>
        ) : badge ? (
          <span className={`product-badge badge-${badgeType || 'default'}`}>
            {badge}
          </span>
        ) : null}

        {/* Top-Right Wishlist Heart Button */}
        <button
          className={`product-heart-btn ${isWishlisted ? 'wishlisted' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-label="Wishlist"
        >
          <Heart 
            size={18} 
            className={isWishlisted ? 'heart-filled' : 'heart-outline'} 
          />
        </button>

        {/* Quick View Hover Action Overlay */}
        <div className="product-hover-actions">
          <button 
            className="hover-action-pill"
            onClick={() => onQuickView(product)}
            title="Quick preview"
          >
            <Eye size={15} />
            <span>Quick View</span>
          </button>
          <button 
            className="hover-action-pill primary"
            disabled={isOutOfStock}
            onClick={() => onAddToCart(product)}
            title={isOutOfStock ? 'Out of stock' : 'Add to basket'}
          >
            <ShoppingCart size={15} />
            <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="product-details" onClick={() => onQuickView(product)}>
        <div className="product-title-row">
          <h3 className="product-name" title={name}>{name}</h3>
          <button 
            className="card-mini-heart"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product);
            }}
            title="Save item"
          >
            <Heart size={16} className={isWishlisted ? 'heart-filled' : ''} />
          </button>
        </div>

        <p className="product-seller">
          by <span>{seller}</span>
        </p>

        <div className="product-price-row">
          <span className="product-price">₹{Number(price || 0).toLocaleString('en-IN')}</span>
          {originalPrice && (
            <span className="card-price-original">₹{Number(originalPrice).toLocaleString('en-IN')}</span>
          )}
          {Number(discount) > 0 && (
            <span className="card-discount-badge">{discount}% OFF</span>
          )}
        </div>

        <div className="product-rating-row">
          <Star size={14} className="star-icon" fill="#f59e0b" color="#f59e0b" />
          <span className="rating-score">{rating}</span>
          <span className="rating-count">({reviews})</span>
        </div>
      </div>
    </div>
  );
}
