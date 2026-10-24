import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem,
  onCheckout
}) {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const freeShippingThreshold = 2000;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-header">
          <div className="drawer-title-row">
            <ShoppingBag size={20} />
            <h2 className="drawer-title">Shopping Cart ({cartItems.reduce((s, i) => s + i.quantity, 0)})</h2>
          </div>
          <button className="drawer-close-btn" onClick={onClose} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="cart-shipping-meter">
          <div className="meter-label-row">
            {subtotal >= freeShippingThreshold ? (
              <span className="free-shipping-unlocked">🎉 You unlocked <strong>FREE Worldwide Shipping!</strong></span>
            ) : (
              <span>Add <strong>₹{(freeShippingThreshold - subtotal).toLocaleString('en-IN')}</strong> more for <strong>FREE Shipping</strong></span>
            )}
          </div>
          <div className="meter-track">
            <div className="meter-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>

        {/* Cart Item List */}
        <div className="drawer-body">
          {cartItems.length === 0 ? (
            <div className="empty-state">
              <ShoppingBag size={48} className="empty-icon" />
              <h3>Your cart is empty</h3>
              <p>Explore unique handcrafted items from our independent sellers.</p>
              <button className="empty-action-btn" onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item-card">
                  <img src={item.image} alt={item.name} className="cart-item-img" />
                  
                  <div className="cart-item-info">
                    <div className="cart-item-title-row">
                      <h4 className="cart-item-name">{item.name}</h4>
                      <button 
                        className="cart-item-remove-btn"
                        onClick={() => onRemoveItem(item.id)}
                        title="Remove"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <p className="cart-item-seller">by {item.seller}</p>

                    <div className="cart-item-bottom-row">
                      <span className="cart-item-price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>

                      <div className="qty-control-pill">
                        <button 
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="qty-btn"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="qty-number">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="qty-btn"
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Subtotal & Checkout */}
        {cartItems.length > 0 && (
          <div className="drawer-footer">
            <div className="subtotal-row">
              <span className="subtotal-label">Subtotal</span>
              <span className="subtotal-val">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <p className="subtotal-disclaimer">Taxes and shipping calculated at checkout.</p>
            <button className="checkout-btn" onClick={onCheckout}>
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
