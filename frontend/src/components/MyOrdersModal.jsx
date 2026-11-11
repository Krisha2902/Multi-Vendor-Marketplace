import React, { useState, useEffect } from 'react';
import { X, Package, Calendar, MapPin, CreditCard, Loader2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function MyOrdersModal({ isOpen, onClose, onShowToast, onNavigateShop }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && user) {
      fetchMyOrders();
    }
  }, [isOpen, user]);

  const fetchMyOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders/my');
      setOrders(res.data?.orders || []);
    } catch (err) {
      if (onShowToast) {
        onShowToast(err.response?.data?.message || 'Failed to load your orders');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const getStatusBadge = (status) => {
    const s = (status || 'confirmed').toLowerCase();
    let bg = '#eff6ff';
    let text = '#1d4ed8';
    let border = '#bfdbfe';

    if (s === 'delivered') {
      bg = '#ecfdf5';
      text = '#047857';
      border = '#a7f3d0';
    } else if (s === 'shipped') {
      bg = '#f5f3ff';
      text = '#6d28d9';
      border = '#ddd6fe';
    } else if (s === 'processing') {
      bg = '#fffbeb';
      text = '#b45309';
      border = '#fde68a';
    } else if (s === 'cancelled') {
      bg = '#fef2f2';
      text = '#b91c1c';
      border = '#fecaca';
    }

    return (
      <span
        style={{
          background: bg,
          color: text,
          border: `1px solid ${border}`,
          padding: '0.25rem 0.65rem',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        {s}
      </span>
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-dialog checkout-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '780px', maxHeight: '88vh', overflowY: 'auto' }}
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="checkout-content">
          <div className="checkout-header" style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Package className="text-brand" size={26} />
              <h2 style={{ margin: 0 }}>My Orders History</h2>
            </div>
            <p>Track your artisan orders and view real-time delivery status.</p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <Loader2 size={36} className="spinner" style={{ margin: '0 auto 1rem auto' }} />
              <p style={{ color: '#64748b' }}>Loading your orders from database...</p>
            </div>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', background: '#fafaf9', borderRadius: '12px' }}>
              <ShoppingBag size={56} style={{ color: '#cbd5e1', margin: '0 auto 1rem auto' }} />
              <h3 style={{ fontSize: '1.2rem', color: '#1e293b', marginBottom: '0.5rem' }}>No orders placed yet</h3>
              <p style={{ color: '#64748b', maxWidth: '380px', margin: '0 auto 1.5rem auto' }}>
                Explore handpicked collections from verified independent makers and place your first order!
              </p>
              <button
                className="btn-add-product"
                onClick={() => {
                  onClose();
                  if (onNavigateShop) onNavigateShop();
                }}
              >
                <span>Start Shopping</span>
                <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {orders.map((ord) => (
                <div
                  key={ord._id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  }}
                >
                  {/* Order Card Header */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '0.75rem',
                      paddingBottom: '0.85rem',
                      borderBottom: '1px solid #f1f5f9',
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Order Number</span>
                      <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>
                        #{ord.orderNumber || ord._id.slice(-8).toUpperCase()}
                      </h4>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#64748b', fontSize: '0.82rem' }}>
                        <Calendar size={14} />
                        {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      {getStatusBadge(ord.status)}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div style={{ margin: '1rem 0' }}>
                    {ord.items?.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.85rem',
                          padding: '0.5rem 0',
                          borderBottom: idx < ord.items.length - 1 ? '1px dashed #f1f5f9' : 'none',
                        }}
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            style={{
                              width: '48px',
                              height: '48px',
                              borderRadius: '8px',
                              objectFit: 'cover',
                              border: '1px solid #e2e8f0',
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: '48px',
                              height: '48px',
                              borderRadius: '8px',
                              background: '#f1f5f9',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#94a3b8',
                            }}
                          >
                            <Package size={20} />
                          </div>
                        )}

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ margin: 0, fontWeight: 600, fontSize: '0.92rem', color: '#1e293b' }}>
                            {item.title}
                          </p>
                          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                            Qty: {item.quantity} × ₹{item.price?.toLocaleString('en-IN')}
                          </span>
                        </div>

                        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
                          ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Order Card Footer */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '0.75rem',
                      paddingTop: '0.85rem',
                      borderTop: '1px solid #f1f5f9',
                      fontSize: '0.85rem',
                      color: '#475569',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <MapPin size={15} style={{ color: '#94a3b8' }} />
                      <span>
                        {ord.shippingAddress?.street}, {ord.shippingAddress?.city} ({ord.shippingAddress?.postalCode})
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <CreditCard size={14} style={{ color: '#94a3b8' }} />
                        <span style={{ textTransform: 'uppercase', fontWeight: 600 }}>{ord.paymentMethod}</span>
                        <span>({ord.paymentStatus})</span>
                      </span>

                      <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                        Total: ₹{(ord.totalAmount || 0).toLocaleString('en-IN')}
                      </span>
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

