import React, { useState, useEffect } from 'react';
import { X, CheckCircle, ShieldCheck, CreditCard, AlertCircle, Loader2, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function CheckoutModal({ isOpen, onClose, cartItems, onOrderComplete, onOpenAuthModal }) {
  const { user } = useAuth();
  const [step, setStep] = useState('form');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [address, setAddress] = useState({
    fullName: 'Arjun Sharma',
    street: '42 Heritage Lane, Indiranagar',
    city: 'Bangalore',
    postalCode: '560038',
    phone: '9876543210',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [placedOrder, setPlacedOrder] = useState(null);

  // Sync user name if available
  useEffect(() => {
    if (user && user.name) {
      setAddress((prev) => ({
        ...prev,
        fullName: prev.fullName === 'Arjun Sharma' ? user.name : prev.fullName,
      }));
    }
  }, [user]);

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setStep('form');
      setError(null);
      setIsSubmitting(false);
      setPlacedOrder(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!user) {
      setError('Please log in or create an account to complete your checkout.');
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      setError('Your cart is empty. Please add items before checking out.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        items: cartItems.map((item) => ({
          product: item._id || item.id,
          productId: item._id || item.id,
          name: item.name || item.title,
          price: item.price,
          quantity: item.quantity || 1,
          image: item.image,
        })),
        shippingAddress: address,
        paymentMethod,
      };

      const res = await api.post('/orders', payload);
      const order = res.data.order;
      setPlacedOrder(order);
      setStep('confirmed');
      if (onOrderComplete) onOrderComplete(order);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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

            {!user && (
              <div
                style={{
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '8px',
                  padding: '0.85rem 1rem',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e40af', fontSize: '0.9rem' }}>
                  <LogIn size={18} />
                  <span>Sign in to link this order to your account.</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenAuthModal) onOpenAuthModal();
                  }}
                  style={{
                    background: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0.4rem 0.85rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Sign In
                </button>
              </div>
            )}

            {error && (
              <div
                style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  padding: '0.75rem 1rem',
                  marginBottom: '1rem',
                  color: '#b91c1c',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handlePlaceOrder} className="checkout-form">
              <div className="checkout-form-grid">
                <div className="checkout-left-col">
                  <h3 className="checkout-section-sub">1. Delivery Address</h3>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      required
                      value={address.fullName}
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Street Address</label>
                    <input
                      type="text"
                      required
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">City</label>
                      <input
                        type="text"
                        required
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Postal Code</label>
                      <input
                        type="text"
                        required
                        value={address.postalCode}
                        onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <h3 className="checkout-section-sub" style={{ marginTop: '1.25rem' }}>
                    2. Payment Method
                  </h3>
                  <div className="payment-options">
                    <label className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="pay"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                      />
                      <span>Credit / Debit Card (Simulated Instant Confirmation)</span>
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
                      <span>Cash on Delivery (Pay at Doorstep)</span>
                    </label>
                  </div>
                </div>

                <div className="checkout-right-col">
                  <div className="order-summary-card">
                    <h3 className="checkout-section-sub">Order Summary</h3>

                    <div className="summary-items-list">
                      {cartItems.map((item) => (
                        <div key={item._id || item.id} className="summary-item-row">
                          <span className="summary-item-title">
                            {item.name || item.title} × {item.quantity}
                          </span>
                          <span className="summary-item-price">
                            ₹{((item.price || 0) * item.quantity).toLocaleString('en-IN')}
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

                    <button type="submit" className="place-order-btn" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 size={18} className="spinner" />
                          <span>Processing Order...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck size={18} />
                          <span>Place Order & Pay</span>
                        </>
                      )}
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
            <p className="order-conf-num">Order ID: #{placedOrder?.orderNumber || 'SN-2024-8921'}</p>

            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '1rem',
                maxWidth: '420px',
                margin: '1.25rem auto',
                textAlign: 'left',
                fontSize: '0.9rem',
                color: '#334155',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#64748b' }}>Total Paid:</span>
                <strong style={{ color: '#0f172a' }}>
                  ₹{(placedOrder?.totalAmount || total).toLocaleString('en-IN')}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#64748b' }}>Payment Mode:</span>
                <span style={{ fontWeight: 600, textTransform: 'uppercase' }}>
                  {placedOrder?.paymentMethod || paymentMethod} ({placedOrder?.paymentStatus || 'paid'})
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Delivery Address:</span>
                <span>
                  {placedOrder?.shippingAddress?.street || address.street}, {placedOrder?.shippingAddress?.city || address.city}
                </span>
              </div>
            </div>

            <p className="order-conf-desc">
              Thank you for shopping with <strong>ShopNest</strong>! Your order has been saved to the database and sent to the artisan vendors.
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
