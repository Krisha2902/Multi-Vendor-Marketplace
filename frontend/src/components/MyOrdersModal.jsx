import { useState, useEffect, useCallback } from 'react';
import { X, Package, Calendar, MapPin, CreditCard, Loader2, ShoppingBag, ArrowRight, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function MyOrdersModal({ isOpen, onClose, onShowToast, onNavigateShop }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [orderDetailsMap, setOrderDetailsMap] = useState({});
  const [detailLoadingId, setDetailLoadingId] = useState(null);

  const fetchMyOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/orders/my');
      setOrders(res.data?.orders || []);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load your orders';
      setError(msg);
      if (onShowToast) {
        onShowToast(msg);
      }
    } finally {
      setLoading(false);
    }
  }, [onShowToast]);

  useEffect(() => {
    if (isOpen && user) {
      const timer = setTimeout(() => {
        fetchMyOrders();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, user, fetchMyOrders]);

  const handleToggleOrderDetail = async (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
      return;
    }

    setExpandedOrderId(orderId);
    if (orderDetailsMap[orderId]) return;

    setDetailLoadingId(orderId);
    try {
      const res = await api.get(`/orders/${orderId}`);
      if (res.data?.order) {
        setOrderDetailsMap((prev) => ({ ...prev, [orderId]: res.data.order }));
      }
    } catch (err) {
      if (onShowToast) {
        onShowToast(err.response?.data?.message || 'Could not load full order details');
      }
    } finally {
      setDetailLoadingId(null);
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

          {!user ? (
            <div style={{ textAlign: 'center', padding: '3rem 1.5rem', background: '#fafaf9', borderRadius: '12px' }}>
              <Package size={48} style={{ color: '#94a3b8', margin: '0 auto 1rem auto' }} />
              <h3 style={{ fontSize: '1.15rem', color: '#1e293b', marginBottom: '0.5rem' }}>Sign in to view your orders</h3>
              <p style={{ color: '#64748b' }}>Please sign in to inspect your order history and tracking status.</p>
            </div>
          ) : loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <Loader2 size={36} className="spinning-loader" style={{ margin: '0 auto 1rem auto' }} />
              <p style={{ color: '#64748b' }}>Loading your orders from database...</p>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '3rem 1.5rem', background: '#fef2f2', borderRadius: '12px', border: '1px solid #fecaca' }}>
              <AlertCircle size={44} style={{ color: '#b91c1c', margin: '0 auto 0.75rem auto' }} />
              <h3 style={{ fontSize: '1.1rem', color: '#991b1b', marginBottom: '0.4rem' }}>Could not load orders</h3>
              <p style={{ color: '#b91c1c', marginBottom: '1.25rem' }}>{error}</p>
              <button className="btn-add-product" onClick={fetchMyOrders}>
                Retry
              </button>
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
              {orders.map((ord) => {
                const detail = orderDetailsMap[ord._id] || ord;
                const isExpanded = expandedOrderId === ord._id;

                return (
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
                      <button
                        type="button"
                        onClick={() => handleToggleOrderDetail(ord._id)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          color: '#233123',
                          background: '#f1f5f9',
                          border: '1px solid #cbd5e1',
                          borderRadius: '6px',
                          padding: '0.25rem 0.55rem',
                          cursor: 'pointer',
                        }}
                      >
                        <span>{isExpanded ? 'Hide' : 'Details'}</span>
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div style={{ margin: '1rem 0' }}>
                    {detail.items?.map((item, idx) => (
                      <div
                        key={item._id || idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.85rem',
                          padding: '0.5rem 0',
                          borderBottom: idx < detail.items.length - 1 ? '1px dashed #f1f5f9' : 'none',
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
                            {item.vendor?.shopName ? ` • by ${item.vendor.shopName}` : ''}
                            {item.itemStatus && ` • ${item.itemStatus}`}
                          </span>
                        </div>

                        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
                          ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Expandable Breakdown */}
                  {isExpanded && (
                    <div
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '0.85rem 1rem',
                        marginBottom: '0.85rem',
                        fontSize: '0.83rem',
                        color: '#334155',
                      }}
                    >
                      {detailLoadingId === ord._id ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b' }}>
                          <Loader2 size={15} className="spinning-loader" />
                          <span>Loading full order summary...</span>
                        </div>
                      ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.6rem' }}>
                          <div>
                            <strong style={{ color: '#0f172a' }}>Recipient:</strong>{' '}
                            {detail.shippingAddress?.fullName || '—'}
                            {detail.shippingAddress?.phone ? ` (${detail.shippingAddress.phone})` : ''}
                          </div>
                          <div>
                            <strong style={{ color: '#0f172a' }}>Subtotal:</strong>{' '}
                            ₹{(detail.subtotal ?? detail.totalAmount ?? 0).toLocaleString('en-IN')}
                          </div>
                          <div>
                            <strong style={{ color: '#0f172a' }}>Shipping:</strong>{' '}
                            {detail.shippingFee ? `₹${detail.shippingFee.toLocaleString('en-IN')}` : 'FREE'}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

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
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

