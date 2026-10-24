import React from 'react';
import { X, Heart, ShoppingCart, Trash2 } from 'lucide-react';

export default function WishlistDrawer({ 
  isOpen, 
  onClose, 
  wishlistItems, 
  onRemoveFromWishlist, 
  onMoveToCart 
}) {
  if (!isOpen) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-title-row">
            <Heart size={20} fill="#e07a5f" color="#e07a5f" />
            <h2 className="drawer-title">Saved Wishlist ({wishlistItems.length})</h2>
          </div>
          <button className="drawer-close-btn" onClick={onClose} aria-label="Close wishlist">
            <X size={20} />
          </button>
        </div>

        <div className="drawer-body">
          {wishlistItems.length === 0 ? (
            <div className="empty-state">
              <Heart size={48} className="empty-icon" />
              <h3>Your wishlist is empty</h3>
              <p>Click the heart icon on any product to save your favorite finds.</p>
              <button className="empty-action-btn" onClick={onClose}>
                Explore Marketplace
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {wishlistItems.map((item) => (
                <div key={item.id} className="cart-item-card">
                  <img src={item.image} alt={item.name} className="cart-item-img" />
                  
                  <div className="cart-item-info">
                    <div className="cart-item-title-row">
                      <h4 className="cart-item-name">{item.name}</h4>
                      <button 
                        className="cart-item-remove-btn"
                        onClick={() => onRemoveFromWishlist(item.id)}
                        title="Remove from wishlist"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <p className="cart-item-seller">by {item.seller}</p>

                    <div className="cart-item-bottom-row">
                      <span className="cart-item-price">₹{item.price.toLocaleString('en-IN')}</span>

                      <button 
                        className="move-to-cart-btn"
                        onClick={() => onMoveToCart(item)}
                      >
                        <ShoppingCart size={14} />
                        <span>Move to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
