import { useState, useEffect, useCallback } from 'react';
import {
  CheckCircle,
  XCircle,
  Clock,
  Store,
  User,
  Mail,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Tag,
  LayoutDashboard,
  ShoppingBag,
  Users,
  FolderTree,
  Plus,
  Edit3,
  Trash2,
  Search,
  PauseCircle,
  PlayCircle,
  Ban,
  Unlock,
  IndianRupee,
  Package,
  RefreshCw,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const CATEGORY_ICON_OPTIONS = [
  'Shirt',
  'Home',
  'Flower2',
  'Sparkles',
  'Laptop',
  'Smartphone',
  'Dumbbell',
  'Gamepad2',
  'BookOpen',
  'Scissors',
  'Watch',
  'Tag',
  'ShoppingBag',
  'Utensils',
];

const INITIAL_CATEGORY_FORM = {
  name: '',
  icon: 'Shirt',
  image: '',
  description: '',
  isActive: true,
};

const formatINR = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`;

export default function AdminVendors({ onBackToHome, onShowToast }) {
  const { user } = useAuth();
  const currentAdminId = user?.id || user?._id || '';

  const [activeTab, setActiveTab] = useState('overview');

  // Overview stats
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState('');

  // Vendors state
  const [vendors, setVendors] = useState([]);
  const [vendorsLoading, setVendorsLoading] = useState(true);
  const [vendorsError, setVendorsError] = useState('');
  const [vendorFilter, setVendorFilter] = useState('all');
  const [vendorSearch, setVendorSearch] = useState('');
  const [vendorActionId, setVendorActionId] = useState(null);
  const [vendorReasonModal, setVendorReasonModal] = useState(null); // { mode: 'reject'|'suspend', vendor }
  const [reasonInput, setReasonInput] = useState('');

  // Categories state
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState('');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState(INITIAL_CATEGORY_FORM);
  const [categoryFormError, setCategoryFormError] = useState('');
  const [categorySubmitting, setCategorySubmitting] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(false);

  // Orders monitor state
  const [orders, setOrders] = useState([]);
  const [ordersPagination, setOrdersPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderPaymentFilter, setOrderPaymentFilter] = useState('all');
  const [orderSearchInput, setOrderSearchInput] = useState('');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderPage, setOrderPage] = useState(1);

  // Users management state
  const [users, setUsers] = useState([]);
  const [usersPagination, setUsersPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userStatusFilter, setUserStatusFilter] = useState('all');
  const [userSearchInput, setUserSearchInput] = useState('');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userPage, setUserPage] = useState(1);
  const [userActionId, setUserActionId] = useState(null);
  const [userToBlock, setUserToBlock] = useState(null);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    setStatsError('');
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data?.stats || null);
    } catch (err) {
      setStatsError(err.response?.data?.message || 'Failed to load marketplace statistics');
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const fetchVendors = useCallback(async () => {
    setVendorsLoading(true);
    setVendorsError('');
    try {
      const res = await api.get('/admin/vendors');
      setVendors(res.data?.vendors || []);
    } catch (err) {
      setVendorsError(err.response?.data?.message || 'Failed to load vendor applications');
    } finally {
      setVendorsLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    setCategoriesLoading(true);
    setCategoriesError('');
    try {
      const res = await api.get('/admin/categories');
      setCategories(res.data?.categories || []);
    } catch (err) {
      setCategoriesError(err.response?.data?.message || 'Failed to load categories');
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    setOrdersError('');
    try {
      const params = new URLSearchParams();
      params.set('page', String(orderPage));
      params.set('limit', '12');
      if (orderStatusFilter !== 'all') params.set('status', orderStatusFilter);
      if (orderPaymentFilter !== 'all') params.set('paymentStatus', orderPaymentFilter);
      if (orderSearchQuery.trim()) params.set('search', orderSearchQuery.trim());

      const res = await api.get(`/admin/orders?${params.toString()}`);
      setOrders(res.data?.orders || []);
      setOrdersPagination(res.data?.pagination || { total: 0, page: 1, pages: 1 });
    } catch (err) {
      setOrdersError(err.response?.data?.message || 'Failed to load marketplace orders');
    } finally {
      setOrdersLoading(false);
    }
  }, [orderPage, orderStatusFilter, orderPaymentFilter, orderSearchQuery]);

  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    setUsersError('');
    try {
      const params = new URLSearchParams();
      params.set('page', String(userPage));
      params.set('limit', '15');
      if (userRoleFilter !== 'all') params.set('role', userRoleFilter);
      if (userStatusFilter === 'active') params.set('isActive', 'true');
      if (userStatusFilter === 'blocked') params.set('isActive', 'false');
      if (userSearchQuery.trim()) params.set('search', userSearchQuery.trim());

      const res = await api.get(`/admin/users?${params.toString()}`);
      setUsers(res.data?.users || []);
      setUsersPagination(res.data?.pagination || { total: 0, page: 1, pages: 1 });
    } catch (err) {
      setUsersError(err.response?.data?.message || 'Failed to load marketplace users');
    } finally {
      setUsersLoading(false);
    }
  }, [userPage, userRoleFilter, userStatusFilter, userSearchQuery]);

  useEffect(() => {
    if (!user || user.role !== 'admin') return undefined;
    const timer = setTimeout(() => {
      fetchStats();
      fetchVendors();
    }, 0);
    return () => clearTimeout(timer);
  }, [user, fetchStats, fetchVendors]);

  useEffect(() => {
    if (!user || user.role !== 'admin') return undefined;
    const timer = setTimeout(() => {
      if (activeTab === 'categories') fetchCategories();
      if (activeTab === 'orders') fetchOrders();
      if (activeTab === 'users') fetchUsers();
    }, 0);
    return () => clearTimeout(timer);
  }, [user, activeTab, fetchCategories, fetchOrders, fetchUsers]);

  const handleRefreshActive = () => {
    fetchStats();
    if (activeTab === 'vendors' || activeTab === 'overview') fetchVendors();
    if (activeTab === 'categories') fetchCategories();
    if (activeTab === 'orders') fetchOrders();
    if (activeTab === 'users') fetchUsers();
  };

  // Vendor moderation handlers
  const handleApproveVendor = async (vendor) => {
    setVendorActionId(vendor._id);
    try {
      await api.patch(`/admin/vendors/${vendor._id}/approve`);
      onShowToast?.(`Approved "${vendor.shopName}"!`);
      fetchVendors();
      fetchStats();
    } catch (err) {
      onShowToast?.(err.response?.data?.message || 'Failed to approve vendor');
    } finally {
      setVendorActionId(null);
    }
  };

  const handleActivateVendor = async (vendor) => {
    setVendorActionId(vendor._id);
    try {
      await api.patch(`/admin/vendors/${vendor._id}/activate`);
      onShowToast?.(`Reactivated "${vendor.shopName}"!`);
      fetchVendors();
      fetchStats();
    } catch (err) {
      onShowToast?.(err.response?.data?.message || 'Failed to reactivate vendor');
    } finally {
      setVendorActionId(null);
    }
  };

  const handleConfirmVendorReason = async () => {
    if (!vendorReasonModal) return;
    const { mode, vendor } = vendorReasonModal;
    setVendorActionId(vendor._id);
    try {
      const endpoint =
        mode === 'suspend'
          ? `/admin/vendors/${vendor._id}/suspend`
          : `/admin/vendors/${vendor._id}/reject`;
      await api.patch(endpoint, { reason: reasonInput.trim() });
      onShowToast?.(
        mode === 'suspend'
          ? `Suspended "${vendor.shopName}".`
          : `Rejected application for "${vendor.shopName}".`
      );
      setVendorReasonModal(null);
      setReasonInput('');
      fetchVendors();
      fetchStats();
    } catch (err) {
      onShowToast?.(err.response?.data?.message || `Failed to ${mode} vendor`);
    } finally {
      setVendorActionId(null);
    }
  };

  // Category handlers
  const openCreateCategoryModal = () => {
    setEditingCategory(null);
    setCategoryForm(INITIAL_CATEGORY_FORM);
    setCategoryFormError('');
    setCategoryModalOpen(true);
  };

  const openEditCategoryModal = (cat) => {
    setEditingCategory(cat);
    setCategoryForm({
      name: cat.name || '',
      icon: cat.icon || 'Shirt',
      image: cat.image || '',
      description: cat.description || '',
      isActive: cat.isActive !== false,
    });
    setCategoryFormError('');
    setCategoryModalOpen(true);
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setCategoryFormError('');

    const cleanName = categoryForm.name.trim();
    if (cleanName.length < 2) {
      setCategoryFormError('Category name must be at least 2 characters.');
      return;
    }

    setCategorySubmitting(true);
    try {
      const payload = {
        name: cleanName,
        icon: categoryForm.icon || 'Shirt',
        image: categoryForm.image.trim(),
        description: categoryForm.description.trim(),
        isActive: Boolean(categoryForm.isActive),
      };

      if (editingCategory) {
        await api.put(`/admin/categories/${editingCategory._id}`, payload);
        onShowToast?.(`Category "${cleanName}" updated!`);
      } else {
        await api.post('/admin/categories', payload);
        onShowToast?.(`Category "${cleanName}" created!`);
      }

      setCategoryModalOpen(false);
      setEditingCategory(null);
      fetchCategories();
      fetchStats();
    } catch (err) {
      setCategoryFormError(err.response?.data?.message || 'Failed to save category');
    } finally {
      setCategorySubmitting(false);
    }
  };

  const handleConfirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    setDeletingCategory(true);
    try {
      await api.delete(`/admin/categories/${categoryToDelete._id}`);
      onShowToast?.(`Category "${categoryToDelete.name}" deleted.`);
      setCategoryToDelete(null);
      fetchCategories();
      fetchStats();
    } catch (err) {
      onShowToast?.(err.response?.data?.message || 'Failed to delete category');
    } finally {
      setDeletingCategory(false);
    }
  };

  // User block/unblock handler
  const handleToggleUserStatus = async (targetUser, nextIsActive) => {
    setUserActionId(targetUser._id);
    try {
      await api.patch(`/admin/users/${targetUser._id}/status`, { isActive: nextIsActive });
      onShowToast?.(
        nextIsActive
          ? `Unblocked account for ${targetUser.name}.`
          : `Blocked account for ${targetUser.name}.`
      );
      setUserToBlock(null);
      fetchUsers();
      fetchStats();
    } catch (err) {
      onShowToast?.(err.response?.data?.message || 'Failed to update user status');
    } finally {
      setUserActionId(null);
    }
  };

  // Protected route fallback if accessed directly without admin role
  if (!user || user.role !== 'admin') {
    return (
      <section className="admin-portal-wrapper">
        <div className="admin-content-card">
          <div className="admin-empty-state">
            <AlertCircle size={44} className="empty-icon" />
            <h3>Administrator Access Required</h3>
            <p>Only authenticated admin accounts can access marketplace governance controls.</p>
            <button className="btn-approve" style={{ marginTop: '1rem' }} onClick={onBackToHome}>
              Return to Marketplace
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Vendor derived counts & filter
  const pendingVendors = vendors.filter((v) => v.status === 'pending');
  const approvedVendors = vendors.filter((v) => v.status === 'approved');
  const suspendedVendors = vendors.filter((v) => v.status === 'suspended');
  const rejectedVendors = vendors.filter((v) => v.status === 'rejected');

  const filteredVendors = vendors.filter((v) => {
    const matchesStatus = vendorFilter === 'all' || v.status === vendorFilter;
    const term = vendorSearch.trim().toLowerCase();
    const matchesSearch =
      !term ||
      v.shopName?.toLowerCase().includes(term) ||
      v.category?.toLowerCase().includes(term) ||
      v.user?.name?.toLowerCase().includes(term) ||
      v.user?.email?.toLowerCase().includes(term);
    return matchesStatus && matchesSearch;
  });

  return (
    <section className="admin-portal-wrapper">
      {/* Header Bar */}
      <div className="admin-header-bar">
        <div className="admin-header-left">
          <button className="admin-back-btn" onClick={onBackToHome}>
            <ArrowLeft size={18} />
            <span>Back to Marketplace</span>
          </button>
          <div>
            <span className="admin-badge">
              <ShieldCheck size={14} /> Admin Control Center
            </span>
            <h1 className="admin-heading">Marketplace Governance</h1>
          </div>
        </div>

        <button className="admin-refresh-btn" onClick={handleRefreshActive}>
          <RefreshCw size={15} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Primary Section Tabs */}
      <div className="admin-main-tabs" role="tablist" aria-label="Admin sections">
        <button
          className={`admin-main-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <LayoutDashboard size={16} />
          <span>Overview</span>
        </button>
        <button
          className={`admin-main-tab ${activeTab === 'vendors' ? 'active' : ''}`}
          onClick={() => setActiveTab('vendors')}
        >
          <Store size={16} />
          <span>Vendors</span>
          {pendingVendors.length > 0 && (
            <span className="admin-tab-pill">{pendingVendors.length}</span>
          )}
        </button>
        <button
          className={`admin-main-tab ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          <FolderTree size={16} />
          <span>Categories</span>
        </button>
        <button
          className={`admin-main-tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <ShoppingBag size={16} />
          <span>All Orders</span>
        </button>
        <button
          className={`admin-main-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={16} />
          <span>Users</span>
        </button>
      </div>

      {/* =========================================
          TAB 1: OVERVIEW STATS
         ========================================= */}
      {activeTab === 'overview' && (
        <div className="admin-tab-panel">
          {statsLoading ? (
            <div className="admin-content-card">
              <div className="admin-loading-state">
                <Loader2 className="spinning-loader" size={34} />
                <p>Loading live marketplace metrics...</p>
              </div>
            </div>
          ) : statsError ? (
            <div className="admin-content-card">
              <div className="admin-empty-state">
                <AlertCircle size={38} color="#b91c1c" />
                <h3>Could not load statistics</h3>
                <p>{statsError}</p>
                <button className="btn-approve" style={{ marginTop: '0.85rem' }} onClick={fetchStats}>
                  Retry
                </button>
              </div>
            </div>
          ) : (
            stats && (
              <>
                <div className="admin-kpi-grid">
                  <div className="admin-kpi-card revenue">
                    <div className="kpi-icon-box revenue">
                      <IndianRupee size={22} />
                    </div>
                    <div className="kpi-content">
                      <span className="kpi-label">Gross Marketplace Revenue</span>
                      <span className="kpi-value">{formatINR(stats.revenue?.totalRevenue)}</span>
                      <span className="kpi-subtext">
                        Paid: {formatINR(stats.revenue?.paidRevenue)} · COD Pending:{' '}
                        {formatINR(stats.revenue?.pendingCodRevenue)}
                      </span>
                    </div>
                  </div>

                  <div className="admin-kpi-card">
                    <div className="kpi-icon-box orders">
                      <ShoppingBag size={22} />
                    </div>
                    <div className="kpi-content">
                      <span className="kpi-label">Total Orders</span>
                      <span className="kpi-value">{stats.orders?.total || 0}</span>
                      <span className="kpi-subtext">
                        Delivered: {stats.orders?.delivered || 0} · Cancelled:{' '}
                        {stats.orders?.cancelled || 0}
                      </span>
                    </div>
                  </div>

                  <div className="admin-kpi-card">
                    <div className="kpi-icon-box vendors">
                      <Store size={22} />
                    </div>
                    <div className="kpi-content">
                      <span className="kpi-label">Seller Stores</span>
                      <span className="kpi-value">{stats.vendors?.approved || 0} Active</span>
                      <span className="kpi-subtext">
                        {stats.vendors?.pending || 0} pending · {stats.vendors?.suspended || 0}{' '}
                        suspended
                      </span>
                    </div>
                  </div>

                  <div className="admin-kpi-card">
                    <div className="kpi-icon-box users">
                      <Users size={22} />
                    </div>
                    <div className="kpi-content">
                      <span className="kpi-label">Users & Catalog</span>
                      <span className="kpi-value">{stats.users?.total || 0} Users</span>
                      <span className="kpi-subtext">
                        {stats.products?.active || 0} active products ·{' '}
                        {stats.categories?.active || 0} categories
                      </span>
                    </div>
                  </div>
                </div>

                <div className="admin-overview-panels">
                  <div className="admin-content-card">
                    <h3 className="admin-panel-title">Order Lifecycle Snapshot</h3>
                    <div className="admin-breakdown-grid">
                      {[
                        ['Confirmed', stats.orders?.confirmed || 0],
                        ['Pending', stats.orders?.pending || 0],
                        ['Processing', stats.orders?.processing || 0],
                        ['Shipped', stats.orders?.shipped || 0],
                        ['Delivered', stats.orders?.delivered || 0],
                        ['Cancelled', stats.orders?.cancelled || 0],
                      ].map(([label, count]) => (
                        <div key={label} className="breakdown-tile">
                          <span className="breakdown-label">{label}</span>
                          <strong className="breakdown-val">{count}</strong>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="admin-content-card">
                    <h3 className="admin-panel-title">Governance Shortcuts</h3>
                    <div className="admin-shortcut-list">
                      <button
                        className="admin-shortcut-btn"
                        onClick={() => {
                          setVendorFilter('pending');
                          setActiveTab('vendors');
                        }}
                      >
                        <Store size={17} />
                        <span>
                          Review Pending Vendors ({stats.vendors?.pending || 0})
                        </span>
                      </button>
                      <button
                        className="admin-shortcut-btn"
                        onClick={() => setActiveTab('categories')}
                      >
                        <FolderTree size={17} />
                        <span>
                          Manage Categories ({stats.categories?.total || 0})
                        </span>
                      </button>
                      <button
                        className="admin-shortcut-btn"
                        onClick={() => setActiveTab('orders')}
                      >
                        <Package size={17} />
                        <span>
                          Monitor All Orders ({stats.orders?.total || 0})
                        </span>
                      </button>
                      <button
                        className="admin-shortcut-btn"
                        onClick={() => setActiveTab('users')}
                      >
                        <Users size={17} />
                        <span>
                          User Directory ({stats.users?.blocked || 0} blocked)
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )
          )}
        </div>
      )}

      {/* =========================================
          TAB 2: VENDORS MANAGEMENT
         ========================================= */}
      {activeTab === 'vendors' && (
        <div className="admin-tab-panel">
          <div className="admin-stats-grid admin-stats-5col">
            <div
              className={`admin-stat-card ${vendorFilter === 'all' ? 'active-filter' : ''}`}
              onClick={() => setVendorFilter('all')}
            >
              <span className="stat-label">All Stores</span>
              <span className="stat-value">{vendors.length}</span>
            </div>
            <div
              className={`admin-stat-card pending ${vendorFilter === 'pending' ? 'active-filter' : ''}`}
              onClick={() => setVendorFilter('pending')}
            >
              <span className="stat-label">Pending Review</span>
              <span className="stat-value">{pendingVendors.length}</span>
            </div>
            <div
              className={`admin-stat-card approved ${vendorFilter === 'approved' ? 'active-filter' : ''}`}
              onClick={() => setVendorFilter('approved')}
            >
              <span className="stat-label">Approved</span>
              <span className="stat-value">{approvedVendors.length}</span>
            </div>
            <div
              className={`admin-stat-card suspended ${vendorFilter === 'suspended' ? 'active-filter' : ''}`}
              onClick={() => setVendorFilter('suspended')}
            >
              <span className="stat-label">Suspended</span>
              <span className="stat-value">{suspendedVendors.length}</span>
            </div>
            <div
              className={`admin-stat-card rejected ${vendorFilter === 'rejected' ? 'active-filter' : ''}`}
              onClick={() => setVendorFilter('rejected')}
            >
              <span className="stat-label">Rejected</span>
              <span className="stat-value">{rejectedVendors.length}</span>
            </div>
          </div>

          <div className="admin-toolbar-row">
            <div className="admin-filter-tabs" style={{ marginBottom: 0 }}>
              {[
                ['all', `All (${vendors.length})`],
                ['pending', `Pending (${pendingVendors.length})`],
                ['approved', `Approved (${approvedVendors.length})`],
                ['suspended', `Suspended (${suspendedVendors.length})`],
                ['rejected', `Rejected (${rejectedVendors.length})`],
              ].map(([key, label]) => (
                <button
                  key={key}
                  className={`filter-tab ${vendorFilter === key ? 'active' : ''}`}
                  onClick={() => setVendorFilter(key)}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="admin-search-box">
              <Search size={15} />
              <input
                type="text"
                placeholder="Search shop, owner, category..."
                value={vendorSearch}
                onChange={(e) => setVendorSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="admin-content-card">
            {vendorsLoading ? (
              <div className="admin-loading-state">
                <Loader2 className="spinning-loader" size={36} />
                <p>Loading vendor records...</p>
              </div>
            ) : vendorsError ? (
              <div className="admin-empty-state">
                <AlertCircle size={40} color="#b91c1c" />
                <h3>Failed to load vendors</h3>
                <p>{vendorsError}</p>
                <button className="btn-approve" style={{ marginTop: '0.85rem' }} onClick={fetchVendors}>
                  Retry
                </button>
              </div>
            ) : filteredVendors.length === 0 ? (
              <div className="admin-empty-state">
                <Store size={44} className="empty-icon" />
                <h3>No vendors found</h3>
                <p>No {vendorFilter !== 'all' ? vendorFilter : ''} vendor stores match your filter.</p>
              </div>
            ) : (
              <div className="admin-applications-list">
                {filteredVendors.map((vendor) => {
                  const isBusy = vendorActionId === vendor._id;
                  return (
                    <div key={vendor._id} className={`admin-app-card ${vendor.status}`}>
                      <div className="app-card-header">
                        <div className="app-card-shop">
                          <div className="shop-icon-avatar">
                            <Store size={22} />
                          </div>
                          <div>
                            <h3 className="app-shop-name">{vendor.shopName}</h3>
                            <div className="app-shop-meta">
                              <span className="app-category-badge">
                                <Tag size={13} />
                                {vendor.category}
                              </span>
                              <span className="app-date">
                                Applied: {new Date(vendor.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="app-status-badge-wrap">
                          <span className={`status-pill ${vendor.status}`}>
                            {vendor.status === 'pending' && <Clock size={14} />}
                            {vendor.status === 'approved' && <CheckCircle size={14} />}
                            {vendor.status === 'suspended' && <PauseCircle size={14} />}
                            {vendor.status === 'rejected' && <XCircle size={14} />}
                            {vendor.status.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div className="app-applicant-row">
                        <div className="applicant-item">
                          <User size={15} />
                          <span>{vendor.user?.name || 'Applicant'}</span>
                        </div>
                        <div className="applicant-item">
                          <Mail size={15} />
                          <span>{vendor.user?.email || 'No email'}</span>
                        </div>
                      </div>

                      {vendor.description && (
                        <div className="app-description-box">
                          <p className="app-description-text">&ldquo;{vendor.description}&rdquo;</p>
                        </div>
                      )}

                      {(vendor.status === 'rejected' || vendor.status === 'suspended') &&
                        vendor.rejectionReason && (
                          <div className="app-rejection-note">
                            <AlertCircle size={15} />
                            <span>
                              <strong>
                                {vendor.status === 'suspended' ? 'Suspension reason:' : 'Reason:'}
                              </strong>{' '}
                              {vendor.rejectionReason}
                            </span>
                          </div>
                        )}

                      <div className="app-card-actions">
                        {vendor.status === 'pending' && (
                          <>
                            <button
                              className="btn-reject"
                              disabled={isBusy}
                              onClick={() => {
                                setVendorReasonModal({ mode: 'reject', vendor });
                                setReasonInput('');
                              }}
                            >
                              <XCircle size={16} />
                              <span>Reject</span>
                            </button>
                            <button
                              className="btn-approve"
                              disabled={isBusy}
                              onClick={() => handleApproveVendor(vendor)}
                            >
                              {isBusy ? (
                                <Loader2 className="spinning-loader" size={16} />
                              ) : (
                                <CheckCircle size={16} />
                              )}
                              <span>{isBusy ? 'Approving...' : 'Approve Vendor'}</span>
                            </button>
                          </>
                        )}

                        {vendor.status === 'approved' && (
                          <button
                            className="btn-suspend"
                            disabled={isBusy}
                            onClick={() => {
                              setVendorReasonModal({ mode: 'suspend', vendor });
                              setReasonInput('');
                            }}
                          >
                            <PauseCircle size={16} />
                            <span>Suspend Store</span>
                          </button>
                        )}

                        {vendor.status === 'suspended' && (
                          <button
                            className="btn-approve"
                            disabled={isBusy}
                            onClick={() => handleActivateVendor(vendor)}
                          >
                            {isBusy ? (
                              <Loader2 className="spinning-loader" size={16} />
                            ) : (
                              <PlayCircle size={16} />
                            )}
                            <span>{isBusy ? 'Reactivating...' : 'Reactivate Store'}</span>
                          </button>
                        )}

                        {vendor.status === 'rejected' && (
                          <button
                            className="btn-approve"
                            disabled={isBusy}
                            onClick={() => handleApproveVendor(vendor)}
                          >
                            {isBusy ? (
                              <Loader2 className="spinning-loader" size={16} />
                            ) : (
                              <CheckCircle size={16} />
                            )}
                            <span>{isBusy ? 'Approving...' : 'Approve Application'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================
          TAB 3: CATEGORIES MANAGEMENT
         ========================================= */}
      {activeTab === 'categories' && (
        <div className="admin-tab-panel">
          <div className="admin-toolbar-row">
            <div>
              <h2 className="admin-section-title">Marketplace Categories ({categories.length})</h2>
              <p className="admin-section-sub">
                Create, organize, and toggle storefront visibility for product categories.
              </p>
            </div>
            <button className="btn-approve" onClick={openCreateCategoryModal}>
              <Plus size={16} />
              <span>Add Category</span>
            </button>
          </div>

          <div className="admin-content-card">
            {categoriesLoading ? (
              <div className="admin-loading-state">
                <Loader2 className="spinning-loader" size={34} />
                <p>Loading categories...</p>
              </div>
            ) : categoriesError ? (
              <div className="admin-empty-state">
                <AlertCircle size={38} color="#b91c1c" />
                <h3>Failed to load categories</h3>
                <p>{categoriesError}</p>
                <button className="btn-approve" style={{ marginTop: '0.85rem' }} onClick={fetchCategories}>
                  Retry
                </button>
              </div>
            ) : categories.length === 0 ? (
              <div className="admin-empty-state">
                <FolderTree size={44} className="empty-icon" />
                <h3>No categories yet</h3>
                <p>Add your first category so approved sellers can list products under it.</p>
              </div>
            ) : (
              <div className="admin-categories-grid">
                {categories.map((cat) => (
                  <div
                    key={cat._id}
                    className={`admin-category-item ${cat.isActive === false ? 'inactive' : ''}`}
                  >
                    <div className="admin-category-top">
                      <div className="admin-category-thumb">
                        {cat.image ? (
                          <img src={cat.image} alt={cat.name} />
                        ) : (
                          <FolderTree size={20} />
                        )}
                      </div>
                      <div className="admin-category-info">
                        <h4>{cat.name}</h4>
                        <span className="admin-cat-slug">/{cat.slug}</span>
                      </div>
                      <span
                        className={`status-pill ${cat.isActive === false ? 'suspended' : 'approved'}`}
                      >
                        {cat.isActive === false ? 'HIDDEN' : 'ACTIVE'}
                      </span>
                    </div>

                    {cat.description && (
                      <p className="admin-cat-desc">{cat.description}</p>
                    )}

                    <div className="admin-cat-actions">
                      <span className="admin-cat-icon-tag">Icon: {cat.icon || 'Shirt'}</span>
                      <div className="admin-cat-btns">
                        <button
                          className="admin-icon-action"
                          title="Edit category"
                          onClick={() => openEditCategoryModal(cat)}
                        >
                          <Edit3 size={15} />
                          <span>Edit</span>
                        </button>
                        <button
                          className="admin-icon-action danger"
                          title="Delete category"
                          onClick={() => setCategoryToDelete(cat)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================
          TAB 4: ALL ORDERS MONITOR
         ========================================= */}
      {activeTab === 'orders' && (
        <div className="admin-tab-panel">
          <div className="admin-toolbar-row">
            <div className="admin-filters-group">
              <select
                className="admin-select-input"
                value={orderStatusFilter}
                onChange={(e) => {
                  setOrderStatusFilter(e.target.value);
                  setOrderPage(1);
                }}
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select
                className="admin-select-input"
                value={orderPaymentFilter}
                onChange={(e) => {
                  setOrderPaymentFilter(e.target.value);
                  setOrderPage(1);
                }}
              >
                <option value="all">All Payments</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending (COD)</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <form
              className="admin-search-box"
              onSubmit={(e) => {
                e.preventDefault();
                setOrderPage(1);
                setOrderSearchQuery(orderSearchInput);
              }}
            >
              <Search size={15} />
              <input
                type="text"
                placeholder="Order #, customer name, city..."
                value={orderSearchInput}
                onChange={(e) => setOrderSearchInput(e.target.value)}
              />
              {orderSearchQuery && (
                <button
                  type="button"
                  className="admin-clear-search"
                  onClick={() => {
                    setOrderSearchInput('');
                    setOrderSearchQuery('');
                    setOrderPage(1);
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </form>
          </div>

          <div className="admin-content-card">
            {ordersLoading ? (
              <div className="admin-loading-state">
                <Loader2 className="spinning-loader" size={34} />
                <p>Loading marketplace orders...</p>
              </div>
            ) : ordersError ? (
              <div className="admin-empty-state">
                <AlertCircle size={38} color="#b91c1c" />
                <h3>Failed to load orders</h3>
                <p>{ordersError}</p>
                <button className="btn-approve" style={{ marginTop: '0.85rem' }} onClick={fetchOrders}>
                  Retry
                </button>
              </div>
            ) : orders.length === 0 ? (
              <div className="admin-empty-state">
                <ShoppingBag size={44} className="empty-icon" />
                <h3>No matching orders</h3>
                <p>Try adjusting the order status, payment filter, or search term.</p>
              </div>
            ) : (
              <>
                <div className="admin-orders-list">
                  {orders.map((order) => (
                    <div key={order._id} className="admin-order-card">
                      <div className="admin-order-top">
                        <div>
                          <div className="admin-order-id">#{order.orderNumber}</div>
                          <div className="admin-order-meta">
                            {new Date(order.createdAt).toLocaleString()} ·{' '}
                            {order.customer?.name || order.shippingAddress?.fullName || 'Customer'}{' '}
                            ({order.customer?.email || 'No email'})
                          </div>
                        </div>

                        <div className="admin-order-badges">
                          <span className={`order-status-pill ${order.status}`}>
                            {order.status.toUpperCase()}
                          </span>
                          <span
                            className={`status-pill ${
                              order.paymentStatus === 'paid'
                                ? 'approved'
                                : order.paymentStatus === 'failed'
                                  ? 'rejected'
                                  : 'pending'
                            }`}
                          >
                            {(order.paymentMethod || 'card').toUpperCase()} ·{' '}
                            {(order.paymentStatus || 'pending').toUpperCase()}
                          </span>
                          <strong className="admin-order-total">{formatINR(order.totalAmount)}</strong>
                        </div>
                      </div>

                      <div className="admin-order-items">
                        {(order.items || []).map((item, idx) => (
                          <div key={item._id || idx} className="admin-order-item-row">
                            <span className="item-title-qty">
                              {item.title} × {item.quantity}
                            </span>
                            <span className="item-vendor-tag">
                              {item.vendor?.shopName || 'Vendor'}
                            </span>
                            <span className="item-substatus">
                              {(item.itemStatus || 'pending').toUpperCase()}
                            </span>
                            <span className="item-price">
                              {formatINR((item.price || 0) * (item.quantity || 1))}
                            </span>
                          </div>
                        ))}
                      </div>

                      {order.shippingAddress && (
                        <div className="admin-order-shipping">
                          Ship to: {order.shippingAddress.fullName}, {order.shippingAddress.street},{' '}
                          {order.shippingAddress.city} – {order.shippingAddress.postalCode}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {ordersPagination.pages > 1 && (
                  <div className="admin-pagination">
                    <button
                      disabled={orderPage <= 1}
                      onClick={() => setOrderPage((p) => Math.max(1, p - 1))}
                    >
                      Previous
                    </button>
                    <span>
                      Page {ordersPagination.page} of {ordersPagination.pages} ({ordersPagination.total}{' '}
                      orders)
                    </span>
                    <button
                      disabled={orderPage >= ordersPagination.pages}
                      onClick={() => setOrderPage((p) => p + 1)}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* =========================================
          TAB 5: USERS MANAGEMENT
         ========================================= */}
      {activeTab === 'users' && (
        <div className="admin-tab-panel">
          <div className="admin-toolbar-row">
            <div className="admin-filters-group">
              <select
                className="admin-select-input"
                value={userRoleFilter}
                onChange={(e) => {
                  setUserRoleFilter(e.target.value);
                  setUserPage(1);
                }}
              >
                <option value="all">All Roles</option>
                <option value="customer">Customers</option>
                <option value="vendor">Vendors</option>
                <option value="admin">Admins</option>
              </select>

              <select
                className="admin-select-input"
                value={userStatusFilter}
                onChange={(e) => {
                  setUserStatusFilter(e.target.value);
                  setUserPage(1);
                }}
              >
                <option value="all">All Accounts</option>
                <option value="active">Active Only</option>
                <option value="blocked">Blocked Only</option>
              </select>
            </div>

            <form
              className="admin-search-box"
              onSubmit={(e) => {
                e.preventDefault();
                setUserPage(1);
                setUserSearchQuery(userSearchInput);
              }}
            >
              <Search size={15} />
              <input
                type="text"
                placeholder="Search name or email..."
                value={userSearchInput}
                onChange={(e) => setUserSearchInput(e.target.value)}
              />
              {userSearchQuery && (
                <button
                  type="button"
                  className="admin-clear-search"
                  onClick={() => {
                    setUserSearchInput('');
                    setUserSearchQuery('');
                    setUserPage(1);
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </form>
          </div>

          <div className="admin-content-card">
            {usersLoading ? (
              <div className="admin-loading-state">
                <Loader2 className="spinning-loader" size={34} />
                <p>Loading user accounts...</p>
              </div>
            ) : usersError ? (
              <div className="admin-empty-state">
                <AlertCircle size={38} color="#b91c1c" />
                <h3>Failed to load users</h3>
                <p>{usersError}</p>
                <button className="btn-approve" style={{ marginTop: '0.85rem' }} onClick={fetchUsers}>
                  Retry
                </button>
              </div>
            ) : users.length === 0 ? (
              <div className="admin-empty-state">
                <Users size={44} className="empty-icon" />
                <h3>No users matched</h3>
                <p>No user accounts match the current filter criteria.</p>
              </div>
            ) : (
              <>
                <div className="admin-users-list">
                  {users.map((u) => {
                    const isSelfOrAdmin = u.role === 'admin' || (u._id || u.id) === currentAdminId;
                    const isBusy = userActionId === u._id;
                    return (
                      <div key={u._id} className={`admin-user-row ${u.isActive ? '' : 'blocked'}`}>
                        <div className="admin-user-identity">
                          <div className="admin-user-avatar">
                            <User size={18} />
                          </div>
                          <div>
                            <div className="admin-user-name">
                              {u.name}
                              <span className={`admin-role-badge ${u.role}`}>
                                {u.role.toUpperCase()}
                              </span>
                            </div>
                            <div className="admin-user-email">
                              {u.email} · Joined {new Date(u.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        <div className="admin-user-controls">
                          <span className={`status-pill ${u.isActive ? 'approved' : 'rejected'}`}>
                            {u.isActive ? 'ACTIVE' : 'BLOCKED'}
                          </span>

                          {isSelfOrAdmin ? (
                            <span className="admin-protected-tag">Protected</span>
                          ) : u.isActive ? (
                            <button
                              className="btn-reject"
                              disabled={isBusy}
                              onClick={() => setUserToBlock(u)}
                            >
                              <Ban size={15} />
                              <span>Block</span>
                            </button>
                          ) : (
                            <button
                              className="btn-approve"
                              disabled={isBusy}
                              onClick={() => handleToggleUserStatus(u, true)}
                            >
                              {isBusy ? (
                                <Loader2 className="spinning-loader" size={15} />
                              ) : (
                                <Unlock size={15} />
                              )}
                              <span>Unblock</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {usersPagination.pages > 1 && (
                  <div className="admin-pagination">
                    <button
                      disabled={userPage <= 1}
                      onClick={() => setUserPage((p) => Math.max(1, p - 1))}
                    >
                      Previous
                    </button>
                    <span>
                      Page {usersPagination.page} of {usersPagination.pages} ({usersPagination.total}{' '}
                      users)
                    </span>
                    <button
                      disabled={userPage >= usersPagination.pages}
                      onClick={() => setUserPage((p) => p + 1)}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* =========================================
          MODALS
         ========================================= */}
      {/* Reject / Suspend Vendor Reason Dialog */}
      {vendorReasonModal && (
        <div className="modal-overlay" onClick={() => setVendorReasonModal(null)}>
          <div className="modal-content reject-dialog" onClick={(e) => e.stopPropagation()}>
            <h3 className="reject-dialog-title">
              {vendorReasonModal.mode === 'suspend'
                ? 'Suspend Vendor Store'
                : 'Reject Vendor Application'}
            </h3>
            <p className="reject-dialog-subtitle">
              {vendorReasonModal.mode === 'suspend' ? (
                <>
                  Temporarily hide products from <strong>{vendorReasonModal.vendor.shopName}</strong>{' '}
                  and disable seller dashboard actions until reactivated.
                </>
              ) : (
                <>
                  Providing a reason helps <strong>{vendorReasonModal.vendor.shopName}</strong>{' '}
                  understand what to update before re-applying.
                </>
              )}
            </p>

            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label>Reason (Optional)</label>
              <textarea
                rows="3"
                placeholder={
                  vendorReasonModal.mode === 'suspend'
                    ? 'e.g., Policy review, quality inspection, or fulfillment delay...'
                    : 'e.g., Incomplete shop details or mismatching product category...'
                }
                value={reasonInput}
                onChange={(e) => setReasonInput(e.target.value)}
                autoFocus
              />
            </div>

            <div className="reject-dialog-buttons">
              <button
                className="btn-modal-secondary"
                onClick={() => setVendorReasonModal(null)}
                disabled={vendorActionId === vendorReasonModal.vendor._id}
              >
                Cancel
              </button>
              <button
                className="btn-confirm-reject"
                onClick={handleConfirmVendorReason}
                disabled={vendorActionId === vendorReasonModal.vendor._id}
              >
                {vendorActionId === vendorReasonModal.vendor._id
                  ? 'Saving...'
                  : vendorReasonModal.mode === 'suspend'
                    ? 'Confirm Suspend'
                    : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Category Modal */}
      {categoryModalOpen && (
        <div className="modal-overlay" onClick={() => setCategoryModalOpen(false)}>
          <div className="modal-content reject-dialog" onClick={(e) => e.stopPropagation()}>
            <h3 className="reject-dialog-title" style={{ color: '#20392c' }}>
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h3>
            <p className="reject-dialog-subtitle">
              Configure marketplace category details and storefront visibility.
            </p>

            {categoryFormError && (
              <div className="form-error-alert" style={{ marginTop: '0.75rem' }}>
                <AlertCircle size={16} />
                <span>{categoryFormError}</span>
              </div>
            )}

            <form onSubmit={handleCategorySubmit} style={{ marginTop: '1rem' }}>
              <div className="form-group">
                <label>Category Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Handcrafted Pottery"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Icon Preset</label>
                <select
                  className="admin-select-input"
                  style={{ width: '100%' }}
                  value={categoryForm.icon}
                  onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                >
                  {CATEGORY_ICON_OPTIONS.map((iconName) => (
                    <option key={iconName} value={iconName}>
                      {iconName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Cover Image URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={categoryForm.image}
                  onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Description (Optional)</label>
                <textarea
                  rows="2"
                  placeholder="Short description for shoppers..."
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                />
              </div>

              <label className="admin-checkbox-row">
                <input
                  type="checkbox"
                  checked={categoryForm.isActive}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, isActive: e.target.checked })
                  }
                />
                <span>Visible to customers and sellers (Active)</span>
              </label>

              <div className="reject-dialog-buttons">
                <button
                  type="button"
                  className="btn-modal-secondary"
                  onClick={() => setCategoryModalOpen(false)}
                  disabled={categorySubmitting}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-approve" disabled={categorySubmitting}>
                  {categorySubmitting
                    ? 'Saving...'
                    : editingCategory
                      ? 'Save Changes'
                      : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Category Confirmation Modal */}
      {categoryToDelete && (
        <div className="modal-overlay" onClick={() => setCategoryToDelete(null)}>
          <div className="modal-content reject-dialog" onClick={(e) => e.stopPropagation()}>
            <h3 className="reject-dialog-title">Delete Category?</h3>
            <p className="reject-dialog-subtitle">
              Are you sure you want to delete <strong>{categoryToDelete.name}</strong>? Categories
              with existing products cannot be deleted.
            </p>
            <div className="reject-dialog-buttons">
              <button
                className="btn-modal-secondary"
                onClick={() => setCategoryToDelete(null)}
                disabled={deletingCategory}
              >
                Cancel
              </button>
              <button
                className="btn-confirm-reject"
                onClick={handleConfirmDeleteCategory}
                disabled={deletingCategory}
              >
                {deletingCategory ? 'Deleting...' : 'Delete Category'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Block User Confirmation Modal */}
      {userToBlock && (
        <div className="modal-overlay" onClick={() => setUserToBlock(null)}>
          <div className="modal-content reject-dialog" onClick={(e) => e.stopPropagation()}>
            <h3 className="reject-dialog-title">Block User Account?</h3>
            <p className="reject-dialog-subtitle">
              Blocking <strong>{userToBlock.name}</strong> ({userToBlock.email}) will immediately
              prevent them from logging in or placing orders until unblocked.
            </p>
            <div className="reject-dialog-buttons">
              <button
                className="btn-modal-secondary"
                onClick={() => setUserToBlock(null)}
                disabled={userActionId === userToBlock._id}
              >
                Cancel
              </button>
              <button
                className="btn-confirm-reject"
                onClick={() => handleToggleUserStatus(userToBlock, false)}
                disabled={userActionId === userToBlock._id}
              >
                {userActionId === userToBlock._id ? 'Blocking...' : 'Confirm Block'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
