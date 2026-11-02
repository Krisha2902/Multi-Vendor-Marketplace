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
  Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function VendorDashboard({ onBackToHome, onShowToast }) {
  const { user } = useAuth();
  const [vendorData, setVendorData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendorData = async () => {
      setLoading(true);
      try {
        const res = await api.get('/vendors/me');
        setVendorData(res.data?.vendor || null);
      } catch (err) {
        if (onShowToast) {
          onShowToast(err.response?.data?.message || 'Failed to load vendor details');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVendorData();
  }, []);

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
                Your store has been approved by the ShopNest Admin team. You are now authorized to manage inventory, catalog listings, and order fulfillment.
              </p>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="vendor-metrics-grid">
            <div className="vendor-metric-card">
              <div className="metric-icon-wrap products">
                <Package size={24} />
              </div>
              <div className="metric-info">
                <span className="metric-title">Catalog Products</span>
                <span className="metric-value">0</span>
                <span className="metric-subtext">Product CRUD unlocks in Day 3</span>
              </div>
            </div>

            <div className="vendor-metric-card">
              <div className="metric-icon-wrap orders">
                <ShoppingBag size={24} />
              </div>
              <div className="metric-info">
                <span className="metric-title">Orders Received</span>
                <span className="metric-value">0</span>
                <span className="metric-subtext">Order fulfillment in Day 6</span>
              </div>
            </div>

            <div className="vendor-metric-card">
              <div className="metric-icon-wrap revenue">
                <IndianRupee size={24} />
              </div>
              <div className="metric-info">
                <span className="metric-title">Total Revenue</span>
                <span className="metric-value">₹0</span>
                <span className="metric-subtext">Lifetime net earnings</span>
              </div>
            </div>

            <div className="vendor-metric-card">
              <div className="metric-icon-wrap store">
                <Store size={24} />
              </div>
              <div className="metric-info">
                <span className="metric-title">Store Status</span>
                <span className="metric-value status-active">Active</span>
                <span className="metric-subtext">Approved in {vendorData?.category || 'Retail'}</span>
              </div>
            </div>
          </div>

          {/* Next Steps / Day 3 Roadmap Card */}
          <div className="vendor-next-steps-card">
            <div className="next-steps-header">
              <div className="next-steps-badge">
                <Tag size={15} />
                <span>Next Milestone</span>
              </div>
              <h3>Day 3: Product Inventory & Management</h3>
            </div>
            <p className="next-steps-desc">
              In Day 3 of the implementation plan, this dashboard will receive the complete Product Management system:
            </p>
            <div className="next-steps-list">
              <div className="next-step-item">
                <CheckCircle2 size={16} className="item-icon" />
                <span>Add new products with Title, Price, Discount, and Stock quantity</span>
              </div>
              <div className="next-step-item">
                <CheckCircle2 size={16} className="item-icon" />
                <span>Upload product photos and assign categories</span>
              </div>
              <div className="next-step-item">
                <CheckCircle2 size={16} className="item-icon" />
                <span>Edit pricing, update stock numbers, and manage catalog status</span>
              </div>
            </div>
            <div className="next-steps-action">
              <button 
                className="btn-add-preview" 
                onClick={() => {
                  if (onShowToast) {
                    onShowToast('Product creation module is scheduled for Day 3!');
                  }
                }}
              >
                <PlusCircle size={17} />
                <span>Add Product (Coming in Day 3)</span>
              </button>
            </div>
          </div>

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
    </div>
  );
}
