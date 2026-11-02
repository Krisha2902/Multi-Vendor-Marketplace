import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCw, 
  Store, 
  User, 
  Mail, 
  Tag, 
  ArrowLeft,
  AlertCircle,
  Loader2
} from 'lucide-react';
import api from '../api/axios';

export default function AdminVendors({ onBackToHome, onShowToast }) {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [processingId, setProcessingId] = useState(null);
  const [rejectModalVendor, setRejectModalVendor] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/vendors');
      setVendors(res.data?.vendors || []);
    } catch (err) {
      if (onShowToast) {
        onShowToast(err.response?.data?.message || 'Failed to fetch vendor applications');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleApprove = async (id, shopName) => {
    setProcessingId(id);
    try {
      const res = await api.patch(`/admin/vendors/${id}/approve`);
      setVendors((prev) =>
        prev.map((v) => (v._id === id ? res.data.vendor : v))
      );
      if (onShowToast) {
        onShowToast(`Store "${shopName}" approved! User promoted to Vendor.`);
      }
    } catch (err) {
      if (onShowToast) {
        onShowToast(err.response?.data?.message || 'Failed to approve vendor');
      }
    } finally {
      setProcessingId(null);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectModalVendor) return;
    const id = rejectModalVendor._id;
    setProcessingId(id);
    try {
      const res = await api.patch(`/admin/vendors/${id}/reject`, {
        reason: rejectReason || 'Store does not meet quality requirements',
      });
      setVendors((prev) =>
        prev.map((v) => (v._id === id ? res.data.vendor : v))
      );
      if (onShowToast) {
        onShowToast(`Store "${rejectModalVendor.shopName}" application rejected.`);
      }
      setRejectModalVendor(null);
      setRejectReason('');
    } catch (err) {
      if (onShowToast) {
        onShowToast(err.response?.data?.message || 'Failed to reject vendor');
      }
    } finally {
      setProcessingId(null);
    }
  };

  const filteredVendors = vendors.filter((v) => {
    if (filter === 'all') return true;
    return v.status === filter;
  });

  const pendingCount = vendors.filter((v) => v.status === 'pending').length;
  const approvedCount = vendors.filter((v) => v.status === 'approved').length;
  const rejectedCount = vendors.filter((v) => v.status === 'rejected').length;

  return (
    <div className="admin-portal-wrapper">
      {/* Admin Top Header */}
      <div className="admin-header-bar">
        <div className="admin-header-left">
          <button className="admin-back-btn" onClick={onBackToHome}>
            <ArrowLeft size={18} />
            <span>Marketplace</span>
          </button>
          <div className="admin-title-wrap">
            <div className="admin-badge">
              <ShieldCheck size={16} />
              <span>Admin Portal</span>
            </div>
            <h1 className="admin-heading">Vendor Application Review</h1>
          </div>
        </div>

        <div className="admin-header-right">
          <button 
            className="admin-refresh-btn" 
            onClick={fetchVendors} 
            disabled={loading}
            title="Refresh applications"
          >
            <RefreshCw size={16} className={loading ? 'spinning-loader' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Counter Bar */}
      <div className="admin-stats-grid">
        <div 
          className={`admin-stat-card ${filter === 'all' ? 'active-filter' : ''}`}
          onClick={() => setFilter('all')}
        >
          <span className="stat-label">Total Applications</span>
          <span className="stat-value">{vendors.length}</span>
        </div>
        <div 
          className={`admin-stat-card pending ${filter === 'pending' ? 'active-filter' : ''}`}
          onClick={() => setFilter('pending')}
        >
          <span className="stat-label">Pending Review</span>
          <span className="stat-value">{pendingCount}</span>
        </div>
        <div 
          className={`admin-stat-card approved ${filter === 'approved' ? 'active-filter' : ''}`}
          onClick={() => setFilter('approved')}
        >
          <span className="stat-label">Approved Vendors</span>
          <span className="stat-value">{approvedCount}</span>
        </div>
        <div 
          className={`admin-stat-card rejected ${filter === 'rejected' ? 'active-filter' : ''}`}
          onClick={() => setFilter('rejected')}
        >
          <span className="stat-label">Rejected</span>
          <span className="stat-value">{rejectedCount}</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="admin-filter-tabs">
        <button 
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({vendors.length})
        </button>
        <button 
          className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending ({pendingCount})
        </button>
        <button 
          className={`filter-tab ${filter === 'approved' ? 'active' : ''}`}
          onClick={() => setFilter('approved')}
        >
          Approved ({approvedCount})
        </button>
        <button 
          className={`filter-tab ${filter === 'rejected' ? 'active' : ''}`}
          onClick={() => setFilter('rejected')}
        >
          Rejected ({rejectedCount})
        </button>
      </div>

      {/* Applications List */}
      <div className="admin-content-card">
        {loading ? (
          <div className="admin-loading-state">
            <Loader2 className="spinning-loader" size={36} />
            <p>Loading vendor applications...</p>
          </div>
        ) : filteredVendors.length === 0 ? (
          <div className="admin-empty-state">
            <Store size={44} className="empty-icon" />
            <h3>No applications found</h3>
            <p>There are no {filter !== 'all' ? filter : ''} vendor applications to display.</p>
          </div>
        ) : (
          <div className="admin-applications-list">
            {filteredVendors.map((vendor) => (
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
                      {vendor.status === 'rejected' && <XCircle size={14} />}
                      {vendor.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Applicant Profile */}
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

                {/* Description / Bio */}
                {vendor.description && (
                  <div className="app-description-box">
                    <p className="app-description-text">"{vendor.description}"</p>
                  </div>
                )}

                {/* If rejected, show reason */}
                {vendor.status === 'rejected' && vendor.rejectionReason && (
                  <div className="app-rejection-note">
                    <AlertCircle size={15} />
                    <span><strong>Reason:</strong> {vendor.rejectionReason}</span>
                  </div>
                )}

                {/* Action Controls for Pending status */}
                {vendor.status === 'pending' && (
                  <div className="app-card-actions">
                    <button
                      className="btn-approve"
                      onClick={() => handleApprove(vendor._id, vendor.shopName)}
                      disabled={processingId === vendor._id}
                    >
                      {processingId === vendor._id ? (
                        <Loader2 className="spinning-loader" size={16} />
                      ) : (
                        <CheckCircle size={16} />
                      )}
                      <span>Approve Vendor</span>
                    </button>
                    <button
                      className="btn-reject"
                      onClick={() => {
                        setRejectModalVendor(vendor);
                        setRejectReason('');
                      }}
                      disabled={processingId === vendor._id}
                    >
                      <XCircle size={16} />
                      <span>Reject</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reject Reason Confirmation Modal */}
      {rejectModalVendor && (
        <div className="modal-overlay" onClick={() => setRejectModalVendor(null)}>
          <div className="modal-dialog reject-dialog" onClick={(e) => e.stopPropagation()}>
            <h3 className="reject-dialog-title">Reject Application</h3>
            <p className="reject-dialog-subtitle">
              Are you sure you want to reject the application for <strong>"{rejectModalVendor.shopName}"</strong>?
            </p>
            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label className="form-label">Reason for rejection (sent to applicant):</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="e.g. Products do not fit catalog guidelines or invalid shop details."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
            <div className="reject-dialog-buttons">
              <button 
                className="empty-action-btn" 
                onClick={() => setRejectModalVendor(null)}
              >
                Cancel
              </button>
              <button 
                className="btn-confirm-reject" 
                onClick={handleConfirmReject}
                disabled={processingId === rejectModalVendor._id}
              >
                {processingId === rejectModalVendor._id ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
