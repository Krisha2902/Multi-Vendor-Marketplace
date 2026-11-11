import React, { useState, useEffect } from 'react';
import { 
  Store, 
  Package, 
  ShoppingBag, 
  IndianRupee, 
  ArrowLeft, 
  Sparkles, 
  PlusCircle, 
  CheckCircle2, 
  Tag, 
  Calendar,
  AlertCircle,
  Loader2,
  Edit3,
  Trash2,
  X,
  Search,
  Image as ImageIcon,
  Layers,
  Percent,
  Plus,
  Truck,
  Clock,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const INITIAL_FORM = {
  title: '',
  description: '',
  price: '',
  discount: '0',
  stock: '10',
  category: '',
  images: ['']
};

export default function VendorDashboard({ onBackToHome, onShowToast }) {
  const { user } = useAuth();
  const [vendorData, setVendorData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Tab State: 'products' | 'orders'
  const [dashboardTab, setDashboardTab] = useState('products');

  // Stats State (Day 6)
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });

  // Orders State (Day 6)
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // Products & Categories states
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Add / Edit Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete modal state
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 1. Fetch vendor data and categories
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [vendorRes, catRes] = await Promise.all([
          api.get('/vendors/me').catch(() => ({ data: { vendor: null } })),
          api.get('/categories').catch(() => ({ data: { categories: [] } }))
        ]);

        setVendorData(vendorRes.data?.vendor || null);
        setCategories(catRes.data?.categories || []);
      } catch (err) {
        if (onShowToast) {
          onShowToast(err.response?.data?.message || 'Failed to load initial vendor data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // 2. Fetch vendor products & stats once vendor is approved
  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const res = await api.get('/vendor/products');
      setProducts(res.data?.products || []);
    } catch (err) {
      console.warn('Could not fetch vendor products:', err.message);
    } finally {
      setProductsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get('/vendor/stats');
      if (res.data?.stats) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.warn('Could not fetch vendor stats:', err.message);
    }
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await api.get('/vendor/orders');
      setOrders(res.data?.orders || []);
    } catch (err) {
      console.warn('Could not fetch vendor orders:', err.message);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (vendorData && vendorData.status === 'approved') {
      fetchProducts();
      fetchStats();
      fetchOrders();
    }
  }, [vendorData]);

  // Order status updater (Day 6)
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      await api.patch(`/vendor/orders/${orderId}/status`, { status: newStatus });
      if (onShowToast) {
        onShowToast(`Order fulfillment status updated to "${newStatus.toUpperCase()}"!`);
      }
      // Refresh list & metrics
      fetchOrders();
      fetchStats();
    } catch (err) {
      if (onShowToast) {
        onShowToast(err.response?.data?.message || 'Failed to update order status');
      }
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Modal handlers
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      ...INITIAL_FORM,
      category: categories.length > 0 ? categories[0]._id : ''
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setFormData({
      title: prod.title || '',
      description: prod.description || '',
      price: prod.price ? String(prod.price) : '',
      discount: prod.discount !== undefined ? String(prod.discount) : '0',
      stock: prod.stock !== undefined ? String(prod.stock) : '1',
      category: prod.category?._id || prod.category || (categories[0]?._id || ''),
      images: prod.images && prod.images.length > 0 ? [...prod.images] : ['']
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleImageChange = (index, value) => {
    const updated = [...formData.images];
    updated[index] = value;
    setFormData({ ...formData, images: updated });
  };

  const handleAddImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const handleRemoveImageField = (index) => {
    if (formData.images.length <= 1) return;
    const updated = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updated });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title.trim()) {
      setFormError('Please enter a product title.');
      return;
    }
    if (!formData.category) {
      setFormError('Please select a product category.');
      return;
    }
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      setFormError('Please enter a valid positive price.');
      return;
    }

    const validImages = formData.images.map(img => img.trim()).filter(Boolean);
    if (validImages.length === 0) {
      setFormError('Please provide at least one product image URL.');
      return;
    }

    setFormSubmitting(true);
    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim() || formData.title.trim(),
        price: Number(formData.price),
        discount: Number(formData.discount || 0),
        stock: parseInt(formData.stock || 0, 10),
        category: formData.category,
        images: validImages
      };

      if (editingProduct) {
        const res = await api.put(`/vendor/products/${editingProduct._id}`, payload);
        if (onShowToast) onShowToast('Product updated successfully!');
        setProducts(prev => prev.map(p => p._id === editingProduct._id ? res.data.product : p));
      } else {
        const res = await api.post('/vendor/products', payload);
        if (onShowToast) onShowToast('Product added to catalog successfully!');
        setProducts(prev => [res.data.product, ...prev]);
      }

      fetchStats();
      setIsModalOpen(false);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await api.delete(`/vendor/products/${productToDelete._id}`);
      setProducts(prev => prev.filter(p => p._id !== productToDelete._id));
      if (onShowToast) onShowToast(`"${productToDelete.title}" deleted successfully`);
      setProductToDelete(null);
      fetchStats();
    } catch (err) {
      if (onShowToast) {
        onShowToast(err.response?.data?.message || 'Failed to delete product');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="vendor-dashboard-wrapper">
      {/* Top Navigation Bar */}
      <div className="vendor-header-bar">
        <div className="vendor-header-left">
          <button className="vendor-back-btn" onClick={onBackToHome}>
            <ArrowLeft size={18} />
            <span>Marketplace</span>
          </button>
          <div className="vendor-title-wrap">
            <div className="vendor-approved-badge">
              <CheckCircle2 size={16} />
              <span>Verified Seller</span>
            </div>
            <h1 className="vendor-heading">
              {vendorData ? vendorData.shopName : 'Vendor Dashboard'}
            </h1>
          </div>
        </div>

        <div className="vendor-header-right">
          <span className="vendor-user-tag">
            Seller: <strong>{user?.name || 'Partner'}</strong>
          </span>
        </div>
      </div>

      {loading ? (
        <div className="vendor-loading-state">
          <Loader2 className="spinning-loader" size={36} />
          <p>Loading your vendor dashboard...</p>
        </div>
      ) : (
        <div className="vendor-dashboard-body">
          {/* Welcome Banner */}
          <div className="vendor-welcome-banner">
            <div className="banner-content">
              <div className="banner-sparkle">
                <Sparkles size={20} />
                <span>Seller Hub Active</span>
              </div>
              <h2>Welcome to your Seller Portal, {vendorData?.shopName || user?.name}!</h2>
              <p>
                Manage your artisan catalog, track live incoming orders, and update shipping fulfillment for your customers.
              </p>
            </div>
          </div>

          {/* Key Metrics Grid (Day 6 Live Data) */}
          <div className="vendor-metrics-grid">
            <div className="vendor-metric-card">
              <div className="metric-icon-wrap products">
                <Package size={24} />
              </div>
              <div className="metric-info">
                <span className="metric-title">Catalog Products</span>
                <span className="metric-value">{stats.totalProducts || products.length}</span>
                <span className="metric-subtext">Active listings in database</span>
              </div>
            </div>

            <div className="vendor-metric-card">
              <div className="metric-icon-wrap orders">
                <ShoppingBag size={24} />
              </div>
              <div className="metric-info">
                <span className="metric-title">Orders Received</span>
                <span className="metric-value">{stats.totalOrders || orders.length}</span>
                <span className="metric-subtext">Customer purchases</span>
              </div>
            </div>

            <div className="vendor-metric-card">
              <div className="metric-icon-wrap revenue">
                <IndianRupee size={24} />
              </div>
              <div className="metric-info">
                <span className="metric-title">Total Revenue</span>
                <span className="metric-value">₹{(stats.totalRevenue || 0).toLocaleString('en-IN')}</span>
                <span className="metric-subtext">Lifetime net earnings</span>
              </div>
            </div>

            <div className="vendor-metric-card">
              <div className="metric-icon-wrap store">
                <Truck size={24} />
              </div>
              <div className="metric-info">
                <span className="metric-title">Pending Fulfillment</span>
                <span className="metric-value" style={{ color: stats.pendingOrders > 0 ? '#d97706' : '#15803d' }}>
                  {stats.pendingOrders || 0}
                </span>
                <span className="metric-subtext">Awaiting shipping dispatch</span>
              </div>
            </div>
          </div>

          {/* Day 6: Tab Switcher (Products vs Orders) */}
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            marginBottom: '1.5rem',
            borderBottom: '2px solid #e2e8f0',
            paddingBottom: '0.5rem'
          }}>
            <button
              onClick={() => setDashboardTab('products')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: dashboardTab === 'products' ? '#233123' : 'transparent',
                color: dashboardTab === 'products' ? '#ffffff' : '#475569',
                border: 'none',
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.92rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <Package size={17} />
              <span>Products Catalog ({products.length})</span>
            </button>

            <button
              onClick={() => setDashboardTab('orders')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: dashboardTab === 'orders' ? '#233123' : 'transparent',
                color: dashboardTab === 'orders' ? '#ffffff' : '#475569',
                border: 'none',
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.92rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <ShoppingBag size={17} />
              <span>Customer Orders ({orders.length})</span>
              {stats.pendingOrders > 0 && (
                <span style={{
                  background: '#ef4444',
                  color: '#fff',
                  borderRadius: '9999px',
                  padding: '0.15rem 0.5rem',
                  fontSize: '0.72rem',
                  fontWeight: 700
                }}>
                  {stats.pendingOrders}
                </span>
              )}
            </button>
          </div>

          {/* TAB 1: PRODUCTS CATALOG */}
          {dashboardTab === 'products' && (
            <div className="vendor-products-section">
              <div className="vendor-section-header">
                <div className="vendor-section-title-wrap">
                  <h3 className="section-title">My Product Catalog</h3>
                  <span className="product-count-badge">{products.length} Items</span>
                </div>

                <div className="vendor-section-actions">
                  <div className="vendor-search-wrap">
                    <Search size={16} className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search by product title or category..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="vendor-search-input"
                    />
                    {searchQuery && (
                      <button className="search-clear-btn" onClick={() => setSearchQuery('')}>
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  <button className="btn-add-product" onClick={handleOpenAddModal}>
                    <PlusCircle size={18} />
                    <span>Add New Product</span>
                  </button>
                </div>
              </div>

              {productsLoading ? (
                <div className="vendor-products-loading">
                  <Loader2 className="spinning-loader" size={28} />
                  <span>Loading your product catalog...</span>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="vendor-empty-products">
                  <div className="empty-icon-box">
                    <Package size={42} strokeWidth={1.5} />
                  </div>
                  <h4>{searchQuery ? 'No matching products found' : 'No products in your store catalog yet'}</h4>
                  <p>
                    {searchQuery 
                      ? `No product matched "${searchQuery}". Try a different keyword.` 
                      : 'Start adding items to your store catalog with title, price, category, and images.'}
                  </p>
                  {!searchQuery && (
                    <button className="btn-empty-add" onClick={handleOpenAddModal}>
                      <Plus size={16} />
                      <span>Add Your First Product</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="vendor-products-table-wrap">
                  <table className="vendor-products-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Discount</th>
                        <th>Stock</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((prod) => (
                        <tr key={prod._id}>
                          <td>
                            <div className="table-product-cell">
                              <div className="table-product-thumb">
                                <img 
                                  src={prod.images?.[0] || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=150&q=80'} 
                                  alt={prod.title} 
                                />
                              </div>
                              <div className="table-product-meta">
                                <span className="table-product-title">{prod.title}</span>
                                <span className="table-product-desc">
                                  {prod.description?.substring(0, 50)}...
                                </span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="table-cat-pill">
                              {prod.category?.name || 'General'}
                            </span>
                          </td>
                          <td>
                            <strong className="table-price">₹{prod.price?.toLocaleString('en-IN')}</strong>
                          </td>
                          <td>
                            {prod.discount > 0 ? (
                              <span className="table-discount-pill">{prod.discount}% OFF</span>
                            ) : (
                              <span className="table-nodiscount">—</span>
                            )}
                          </td>
                          <td>
                            <span className={`table-stock-badge ${prod.stock > 5 ? 'in-stock' : prod.stock > 0 ? 'low-stock' : 'out-stock'}`}>
                              {prod.stock > 0 ? `${prod.stock} in stock` : 'Out of Stock'}
                            </span>
                          </td>
                          <td>
                            <span className="table-status-pill active">Published</span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div className="table-actions-row">
                              <button 
                                className="action-btn edit" 
                                onClick={() => handleOpenEditModal(prod)}
                                title="Edit Product"
                              >
                                <Edit3 size={15} />
                                <span>Edit</span>
                              </button>
                              <button 
                                className="action-btn delete" 
                                onClick={() => setProductToDelete(prod)}
                                title="Delete Product"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DAY 6 VENDOR ORDER FULFILLMENT */}
          {dashboardTab === 'orders' && (
            <div className="vendor-products-section">
              <div className="vendor-section-header">
                <div className="vendor-section-title-wrap">
                  <h3 className="section-title">Customer Orders for Fulfillment</h3>
                  <span className="product-count-badge">{orders.length} Total Orders</span>
                </div>
              </div>

              {ordersLoading ? (
                <div className="vendor-products-loading">
                  <Loader2 className="spinning-loader" size={28} />
                  <span>Loading vendor incoming orders...</span>
                </div>
              ) : orders.length === 0 ? (
                <div className="vendor-empty-products">
                  <div className="empty-icon-box">
                    <ShoppingBag size={42} strokeWidth={1.5} />
                  </div>
                  <h4>No orders received yet</h4>
                  <p>
                    When customers purchase your listed artisan goods, their orders will automatically appear here for fulfillment and dispatch.
                  </p>
                </div>
              ) : (
                <div className="vendor-products-table-wrap">
                  <table className="vendor-products-table">
                    <thead>
                      <tr>
                        <th>Order # & Date</th>
                        <th>Customer & Shipping Address</th>
                        <th>Items Ordered</th>
                        <th>Your Total</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Fulfillment Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((ord) => (
                        <tr key={ord._id}>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <strong style={{ color: '#0f172a' }}>
                                #{ord.orderNumber || ord._id.slice(-8).toUpperCase()}
                              </strong>
                              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                          </td>

                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                              <strong style={{ fontSize: '0.9rem' }}>
                                {ord.customer?.name || ord.shippingAddress?.fullName || 'Customer'}
                              </strong>
                              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                {ord.shippingAddress?.street}, {ord.shippingAddress?.city} ({ord.shippingAddress?.postalCode})
                              </span>
                              {ord.shippingAddress?.phone && (
                                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                                  Ph: {ord.shippingAddress.phone}
                                </span>
                              )}
                            </div>
                          </td>

                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                              {ord.items?.map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  {item.image && (
                                    <img
                                      src={item.image}
                                      alt=""
                                      style={{ width: '28px', height: '28px', borderRadius: '4px', objectFit: 'cover' }}
                                    />
                                  )}
                                  <span style={{ fontSize: '0.86rem' }}>
                                    {item.title} × <strong>{item.quantity}</strong>
                                  </span>
                                </div>
                              ))}
                            </div>
                          </td>

                          <td>
                            <strong style={{ fontSize: '1rem', color: '#0f172a' }}>
                              ₹{(ord.vendorTotal || 0).toLocaleString('en-IN')}
                            </strong>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>
                              {ord.paymentMethod} ({ord.paymentStatus})
                            </div>
                          </td>

                          <td>
                            <span style={{
                              padding: '0.25rem 0.65rem',
                              borderRadius: '9999px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              background: ord.status === 'delivered' ? '#ecfdf5' : ord.status === 'shipped' ? '#f5f3ff' : '#fffbeb',
                              color: ord.status === 'delivered' ? '#047857' : ord.status === 'shipped' ? '#6d28d9' : '#b45309',
                              border: `1px solid ${ord.status === 'delivered' ? '#a7f3d0' : ord.status === 'shipped' ? '#ddd6fe' : '#fde68a'}`
                            }}>
                              {ord.status}
                            </span>
                          </td>

                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                              {updatingOrderId === ord._id ? (
                                <Loader2 size={18} className="spinner" />
                              ) : (
                                <select
                                  value={ord.status}
                                  onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value)}
                                  style={{
                                    padding: '0.35rem 0.65rem',
                                    borderRadius: '6px',
                                    border: '1px solid #cbd5e1',
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    background: '#ffffff'
                                  }}
                                >
                                  <option value="pending">Pending</option>
                                  <option value="processing">Processing</option>
                                  <option value="shipped">Shipped</option>
                                  <option value="delivered">Delivered</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Store Info Profile */}
          <div className="vendor-profile-summary">
            <h3 className="section-title">Store Profile Details</h3>
            <div className="profile-details-grid">
              <div className="profile-detail-item">
                <span className="detail-label">Store / Brand Name</span>
                <span className="detail-val">{vendorData?.shopName || '—'}</span>
              </div>
              <div className="profile-detail-item">
                <span className="detail-label">Primary Category</span>
                <span className="detail-val">{vendorData?.category || '—'}</span>
              </div>
              <div className="profile-detail-item">
                <span className="detail-label">Registered Owner</span>
                <span className="detail-val">{user?.name} ({user?.email})</span>
              </div>
              <div className="profile-detail-item">
                <span className="detail-label">Store Application Date</span>
                <span className="detail-val">
                  {vendorData?.createdAt ? new Date(vendorData.createdAt).toLocaleDateString() : 'Today'}
                </span>
              </div>
              <div className="profile-detail-item full-width">
                <span className="detail-label">About The Store</span>
                <p className="detail-val-bio">
                  {vendorData?.description || 'No store bio provided.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="vendor-modal-overlay" onClick={() => !formSubmitting && setIsModalOpen(false)}>
          <div className="vendor-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="vendor-modal-header">
              <div className="modal-title-wrap">
                <Package size={22} color="#233123" />
                <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              </div>
              <button 
                className="modal-close-icon" 
                onClick={() => !formSubmitting && setIsModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="vendor-product-form">
              {formError && (
                <div className="form-error-alert">
                  <AlertCircle size={16} />
                  <span>{formError}</span>
                </div>
              )}

              {/* Title */}
              <div className="form-group">
                <label>Product Title <span className="req">*</span></label>
                <input 
                  type="text" 
                  placeholder="e.g. Ceramic Plant Pot, Cotton T-Shirt"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              {/* Category & Price Row */}
              <div className="form-row">
                <div className="form-group">
                  <label>Category <span className="req">*</span></label>
                  <select 
                    value={formData.category} 
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Price (₹) <span className="req">*</span></label>
                  <input 
                    type="number" 
                    placeholder="e.g. 799"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    min="1"
                    required
                  />
                </div>
              </div>

              {/* Discount & Stock Row */}
              <div className="form-row">
                <div className="form-group">
                  <label>Discount (%)</label>
                  <input 
                    type="number" 
                    placeholder="0"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    min="0"
                    max="99"
                  />
                </div>

                <div className="form-group">
                  <label>Stock Quantity <span className="req">*</span></label>
                  <input 
                    type="number" 
                    placeholder="10"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    min="0"
                    required
                  />
                </div>
              </div>

              {/* Image URLs with Live Preview */}
              <div className="form-group">
                <div className="label-with-action">
                  <label>Image URL(s) <span className="req">*</span></label>
                  <button 
                    type="button" 
                    className="btn-add-img-link"
                    onClick={handleAddImageField}
                  >
                    + Add Another Image
                  </button>
                </div>
                
                {formData.images.map((imgUrl, idx) => (
                  <div key={idx} className="img-input-row">
                    <input 
                      type="url" 
                      placeholder="https://images.unsplash.com/photo-..."
                      value={imgUrl}
                      onChange={(e) => handleImageChange(idx, e.target.value)}
                      required={idx === 0}
                    />
                    {formData.images.length > 1 && (
                      <button 
                        type="button" 
                        className="btn-remove-img"
                        onClick={() => handleRemoveImageField(idx)}
                      >
                        <X size={15} />
                      </button>
                    )}
                  </div>
                ))}

                {formData.images[0]?.trim() && (
                  <div className="img-live-preview-box">
                    <span className="preview-label">Live Preview:</span>
                    <div className="preview-thumb">
                      <img 
                        src={formData.images[0].trim()} 
                        alt="Preview" 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=200&q=80';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="form-group">
                <label>Product Description <span className="req">*</span></label>
                <textarea 
                  rows="3" 
                  placeholder="Describe material, dimensions, craftsmanship, usage..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                ></textarea>
              </div>

              {/* Modal Actions */}
              <div className="vendor-modal-actions">
                <button 
                  type="button" 
                  className="btn-modal-cancel" 
                  onClick={() => setIsModalOpen(false)}
                  disabled={formSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-modal-submit"
                  disabled={formSubmitting}
                >
                  {formSubmitting ? (
                    <>
                      <Loader2 className="spinning-loader" size={16} />
                      <span>Saving Product...</span>
                    </>
                  ) : (
                    <span>{editingProduct ? 'Save Changes' : 'Create Product'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="vendor-modal-overlay" onClick={() => !isDeleting && setProductToDelete(null)}>
          <div className="vendor-delete-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="delete-icon-wrap">
              <Trash2 size={24} color="#dc2626" />
            </div>
            <h3>Delete Product?</h3>
            <p>
              Are you sure you want to delete <strong>"{productToDelete.title}"</strong> from your catalog? This action cannot be undone.
            </p>
            <div className="delete-modal-actions">
              <button 
                className="btn-delete-cancel" 
                onClick={() => setProductToDelete(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                className="btn-delete-confirm" 
                onClick={handleDeleteProduct}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
