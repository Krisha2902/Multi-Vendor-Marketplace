import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, CreditCard, ShoppingBag } from 'lucide-react';

export default function CheckoutModal({ isOpen, onClose, cartItems, onOrderComplete }) {
  const [step, setStep] = useState('form');
  const [paymentMethod, setPaymentMethod] = useState('card');

  if (!isOpen) return null;

  const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setStep('confirmed');
    if (onOrderComplete) onOrderComplete();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog checkout-dialog" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {step === 'form' ? (
          <div className="checkout-content">
            <div className="checkout-header">
              <h2>Secure Checkout</h2>
              <p>Complete your order from verified independent makers.</p>
            </div>

            <form onSubmit={handlePlaceOrder} className="checkout-form">
              <div className="checkout-form-grid">
                <div className="checkout-left-col">
                  <h3 className="checkout-section-sub">1. Delivery Address</h3>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input type="text" required defaultValue="Arjun Sharma" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Street Address</label>
                    <input type="text" required defaultValue="42 Heritage Lane, Indiranagar" className="form-input" />
                  </div>
                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">City</label>
                      <input type="text" required defaultValue="Bangalore" className="form-input" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Postal Code</label>
                      <input type="text" required defaultValue="560038" className="form-input" />
                    </div>
                  </div>

                  <h3 className="checkout-section-sub" style={{ marginTop: '1.25rem' }}>2. Payment Method</h3>
                  <div className="payment-options">
                    <label className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
                      <input 
                        type="radio" 
                        name="pay" 
                        checked={paymentMethod === 'card'} 
                        onChange={() => setPaymentMethod('card')} 
                      />
                      <span>Credit / Debit Card (Visa, MC, Amex)</span>
                    </label>
                    <label className={`payment-option ${paymentMethod === 'upi' ? 'selected' : ''}`}>
                      <input 
                        type="radio" 
                        name="pay" 
                        checked={paymentMethod === 'upi'} 
                        onChange={() => setPaymentMethod('upi')} 
                      />
                      <span>UPI (GPay / PhonePe / Paytm)</span>
                    </label>
                    <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                      <input 
                        type="radio" 
                        name="pay" 
                        checked={paymentMethod === 'cod'} 
                        onChange={() => setPaymentMethod('cod')} 
                      />
                      <span>Cash on Delivery</span>
                    </label>
                  </div>
                </div>

                <div className="checkout-right-col">
                  <div className="order-summary-card">
                    <h3 className="checkout-section-sub">Order Summary</h3>
                    
                    <div className="summary-items-list">
                      {cartItems.map((item) => (
                        <div key={item.id} className="summary-item-row">
                          <span className="summary-item-title">
                            {item.name} × {item.quantity}
                          </span>
                          <span className="summary-item-price">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="summary-totals">
                      <div className="total-line">
                        <span>Items Total:</span>
                        <span>₹{total.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="total-line">
                        <span>Standard Delivery:</span>
                        <span className="free-tag">FREE</span>
                      </div>
                      <div className="total-line grand-total">
                        <span>Total to Pay:</span>
                        <span className="grand-amount">₹{total.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <button type="submit" className="place-order-btn">
                      <ShieldCheck size={18} />
                      <span>Place Order & Pay</span>
                    </button>

                    <div className="checkout-security-notice">
                      <CreditCard size={14} />
                      <span>256-bit encrypted secure checkout</span>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <div className="order-confirmed-state">
            <CheckCircle size={64} className="order-success-icon" />
            <h2>Order Placed Successfully!</h2>
            <p className="order-conf-num">Order ID: #SN-2024-8921</p>
            <p className="order-conf-desc">
              Thank you for shopping with <strong>ShopNest</strong>! Your order has been shared with the artisan vendors. You'll receive tracking details via email shortly.
            </p>
            <button className="empty-action-btn" onClick={onClose}>
              Continue Exploring ShopNest
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
