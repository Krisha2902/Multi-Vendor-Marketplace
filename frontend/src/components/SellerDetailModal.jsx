import React from 'react';
import { X, Star, MapPin, Store, CheckCircle, Heart } from 'lucide-react';

export default function SellerDetailModal({ 
  seller, 
  onClose, 
  onAddToCart, 
  onQuickView, 
  onShowToast 
}) {
  if (!seller) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog seller-profile-dialog" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="seller-profile-banner">
          <div className="seller-profile-avatar-row">
            <img src={seller.avatar} alt={seller.name} className="seller-lg-avatar" />
            <div className="seller-lg-info">
              <div className="seller-name-badge">
                <h2>{seller.name}</h2>
                <CheckCircle size={18} className="verified-check" />
              </div>
              <p className="seller-cat-text">{seller.category}</p>
              <div className="seller-meta-row">
                <span className="seller-meta-item">
                  <Star size={14} fill="#f59e0b" color="#f59e0b" />
                  <strong>{seller.ratingScore || 4.9}</strong> ({seller.reviewsCount || 120}+ reviews)
                </span>
                <span className="seller-meta-item">
                  <MapPin size={14} /> {seller.location || 'India'}
                </span>
                <span className="seller-meta-item">
                  <Store size={14} /> {seller.productsCount || 35} Products
                </span>
              </div>
            </div>
            
            <button 
              className="follow-shop-btn"
              onClick={() => onShowToast && onShowToast(`Following ${seller.name}!`)}
            >
              <Heart size={16} />
              <span>Follow Shop</span>
            </button>
          </div>
        </div>

        <div className="seller-showcase-section">
          <h3 className="seller-showcase-title">Artisan Collection</h3>
          <p className="seller-showcase-sub">Handpicked creations currently in stock.</p>

          <div className="seller-items-grid">
            {seller.thumbnails.map((item) => (
              <div key={item.id} className="seller-item-card">
                <img src={item.image} alt={item.title} className="seller-item-card-img" />
                <div className="seller-item-meta">
                  <h4>{item.title}</h4>
                  <span className="seller-item-price">Handmade Craft</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
