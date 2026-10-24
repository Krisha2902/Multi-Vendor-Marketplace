import React, { useState } from 'react';
import { X, Star, Heart, ShoppingCart, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export default function QuickViewModal({ 
  product, 
  onClose, 
  isWishlisted, 
  onToggleWishlist, 
  onAddToCart 
}) {
  const [qty, setQty] = useState(1);
  if (!product) return null;

  const handleAdd = () => {
    onAddToCart({ ...product, quantity: qty });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog quickview-dialog" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="quickview-grid">
          {/* Left Column Image */}
          <div className="quickview-image-wrap">
            <img src={product.image} alt={product.name} className="quickview-img" />
            {product.badge && (
              <span className={`product-badge badge-${product.badgeType || 'default'} qv-badge`}>
                {product.badge}
              </span>
            )}
          </div>

          {/* Right Column Product Details */}
          <div className="quickview-details">
            <span className="qv-category-chip">Independent Artisan Goods</span>
            <h2 className="qv-title">{product.name}</h2>
            
            <p className="qv-seller-line">
              Sold by <strong>{product.seller}</strong> • <span className="verified-tag">Verified Independent Seller</span>
            </p>

            <div className="qv-rating-line">
              <div className="stars-row">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={15} 
                    fill={i < Math.floor(product.rating) ? '#f59e0b' : 'none'} 
                    color="#f59e0b" 
                  />
                ))}
              </div>
              <span className="qv-rating-score">{product.rating}</span>
              <span className="qv-rating-reviews">({product.reviews} customer reviews)</span>
            </div>

            <div className="qv-price-box">
              <span className="qv-current-price">₹{product.price.toLocaleString('en-IN')}</span>
              {product.originalPrice && (
                <>
                  <span className="qv-original-price">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                  <span className="qv-discount-pill">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            <p className="qv-desc">{product.description}</p>

            {product.tags && (
              <div className="qv-tags-row">
                {product.tags.map((tag) => (
                  <span key={tag} className="qv-tag-pill">#{tag}</span>
                ))}
              </div>
            )}

            {/* Quantity and Actions */}
            <div className="qv-actions-row">
              <div className="qv-qty-selector">
                <button 
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="qv-qty-btn"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="qv-qty-val">{qty}</span>
                <button 
                  onClick={() => setQty(qty + 1)}
                  className="qv-qty-btn"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button className="qv-add-cart-btn" onClick={handleAdd}>
                <ShoppingCart size={18} />
                <span>Add to Cart</span>
              </button>

              <button 
                className={`qv-wishlist-btn ${isWishlisted ? 'active' : ''}`}
                onClick={() => onToggleWishlist(product)}
                title="Save to wishlist"
              >
                <Heart size={20} fill={isWishlisted ? '#e07a5f' : 'none'} color={isWishlisted ? '#e07a5f' : '#6b665c'} />
              </button>
            </div>

            {/* Reassurance Features */}
            <div className="qv-features-list">
              <div className="qv-feature-item">
                <ShieldCheck size={18} className="feat-icon" />
                <span>100% Buyer Protection & Authentic Guarantee</span>
              </div>
              <div className="qv-feature-item">
                <Truck size={18} className="feat-icon" />
                <span>Dispatched within 24-48 hours via insured courier</span>
              </div>
              <div className="qv-feature-item">
                <RefreshCw size={18} className="feat-icon" />
                <span>7-Day easy returns & exchanges</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
