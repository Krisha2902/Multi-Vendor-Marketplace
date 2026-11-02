import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Store, 
  Sparkles, 
  LogIn, 
  Loader2, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function SellerModal({ 
  isOpen, 
  onClose, 
  onShowToast, 
  onOpenAuthModal, 
  onGoToVendorDashboard 
}) {
  const { user, refreshUser } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    storeName: '',
    email: '',
    category: 'Home & Living',
    bio: ''
  });

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [existingVendor, setExistingVendor] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Sync user info and fetch existing vendor application status
  useEffect(() => {
    if (!isOpen) return;

    setErrorMsg('');
    setSubmittedSuccess(false);

    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.name || '',
        email: user.email || ''
      }));

      // Check if user already submitted application
      setLoadingProfile(true);
      api.get('/vendors/me')
        .then((res) => {
          if (res.data?.vendor) {
            setExistingVendor(res.data.vendor);
            setFormData((prev) => ({
              ...prev,
              storeName: res.data.vendor.shopName || '',
              category: res.data.vendor.category || 'Home & Living',
              bio: res.data.vendor.description || ''
            }));
          } else {
            setExistingVendor(null);
          }
        })
        .catch(() => {
          setExistingVendor(null);
        })
        .finally(() => {
          setLoadingProfile(false);
        });
    } else {
      setExistingVendor(null);
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      onClose();
      if (onOpenAuthModal) onOpenAuthModal();
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await api.post('/vendors/apply', {
        shopName: formData.storeName,
        category: formData.category,
        description: formData.bio
      });

      setSubmittedSuccess(true);
      setExistingVendor(res.data.vendor);
      if (refreshUser) await refreshUser();
      if (onShowToast) {
        onShowToast(`Seller application for "${formData.storeName}" submitted successfully!`);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit application. Please try again.';
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedSuccess(false);
    setExistingVendor(null);
    setFormData({
      fullName: user?.name || '',
      storeName: '',
      email: user?.email || '',
      category: 'Home & Living',
      bio: ''
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog seller-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {/* 1. Loading Profile State */}
        {loadingProfile ? (
          <div className="seller-loading-state">
            <Loader2 className="spinning-loader" size={36} />
            <p>Checking your vendor status...</p>
          </div>
        ) : !user ? (
          /* 2. User Not Logged In State */
          <div className="seller-auth-required">
            <div className="seller-modal-badge">
              <Sparkles size={16} />
              <span>Independent Maker Network</span>
            </div>
            <div className="seller-icon-avatar">
              <Store size={38} />
            </div>
            <h2 className="seller-modal-title">Sign in to become a Seller</h2>
            <p className="seller-modal-subtitle">
              Join thousands of creators selling handmade goods, vintage finds, and unique designs on ShopNest. Please sign in or register to submit your seller application.
            </p>
            <div className="seller-action-row">
              <button 
                type="button" 
                className="submit-seller-btn"
                onClick={() => {
                  onClose();
                  if (onOpenAuthModal) onOpenAuthModal();
                }}
              >
                <LogIn size={18} />
                <span>Sign In or Register</span>
              </button>
            </div>
          </div>
        ) : existingVendor && existingVendor.status === 'approved' ? (
          /* 3. Already Approved Vendor State */
          <div className="seller-success-state">
            <div className="status-icon-circle approved">
              <ShieldCheck size={48} />
            </div>
            <h3>You are an Approved Seller!</h3>
            <p>
              Your store <strong>"{existingVendor.shopName}"</strong> is active and approved in category <em>{existingVendor.category}</em>.
            </p>
            <div className="seller-action-row">
              <button 
                type="button" 
                className="submit-seller-btn"
                onClick={() => {
                  onClose();
                  if (onGoToVendorDashboard) onGoToVendorDashboard();
                }}
              >
                <Store size={18} />
                <span>Open Vendor Dashboard</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ) : existingVendor && existingVendor.status === 'pending' && !submittedSuccess ? (
          /* 4. Application Already Pending Review */
          <div className="seller-success-state">
            <div className="status-icon-circle pending">
              <Clock size={48} />
            </div>
            <h3>Application Under Review</h3>
            <p>
              We have received your application for <strong>"{existingVendor.shopName}"</strong> in category <em>{existingVendor.category}</em>.
            </p>
            <div className="pending-review-info-card">
              <p className="info-card-text">
                Our marketplace team is currently reviewing your store bio and details. Once approved, your account will be activated as a Vendor.
              </p>
              <div className="info-card-meta">
                <span>Applied on: {new Date(existingVendor.createdAt).toLocaleDateString()}</span>
                <span className="status-pill pending">Pending Admin Approval</span>
              </div>
            </div>
            <button className="empty-action-btn" onClick={onClose}>
              Back to Marketplace
            </button>
          </div>
        ) : submittedSuccess ? (
          /* 5. Just Submitted Success State */
          <div className="seller-success-state">
            <CheckCircle2 size={56} className="success-icon" />
            <h3>Application Submitted!</h3>
            <p>
              Thank you for applying to sell with <strong>ShopNest</strong>. Your store application for <strong>"{formData.storeName}"</strong> has been sent to the Admin team for approval.
            </p>
            <div className="pending-review-info-card">
              <p className="info-card-text">
                Your application status is <strong>Pending Approval</strong>. The admin can approve your request in the Admin Panel to activate your vendor dashboard.
              </p>
            </div>
            <button className="empty-action-btn" onClick={handleReset}>
              Back to Marketplace
            </button>
          </div>
        ) : (
          /* 6. Application Form */
          <div className="seller-form-wrapper">
            <div className="seller-modal-badge">
              <Sparkles size={16} />
              <span>Independent Maker Network</span>
            </div>
            
            <h2 className="seller-modal-title">Join as a Seller on ShopNest</h2>
            <p className="seller-modal-subtitle">
              Start selling your creations to thousands of verified shoppers. Applications are reviewed by our curation team within 24 hours.
            </p>

            {existingVendor && existingVendor.status === 'rejected' && (
              <div className="seller-rejection-banner">
                <AlertCircle size={18} />
                <div>
                  <strong>Previous Application Update:</strong>
                  <p>{existingVendor.rejectionReason || 'Please review your store bio and re-apply with updated details.'}</p>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="auth-error-box">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="seller-form">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  readOnly
                  value={formData.fullName}
                  className="form-input read-only-input"
                  title="Filled from your account"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Shop / Brand Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Earth & Thread Studio"
                  value={formData.storeName}
                  onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Business Email</label>
                <input
                  type="email"
                  required
                  readOnly
                  value={formData.email}
                  className="form-input read-only-input"
                  title="Filled from your account"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Primary Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="form-select"
                >
                  <option value="Home & Living">Home & Living</option>
                  <option value="Fashion">Fashion & Apparel</option>
                  <option value="Beauty">Beauty & Wellness</option>
                  <option value="Electronics">Electronics & Audio</option>
                  <option value="Sports">Sports & Activewear</option>
                  <option value="Toys & Games">Toys & Games</option>
                  <option value="Books">Books & Stationery</option>
                  <option value="Pottery & Art">Pottery & Art</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Tell us about your products *</label>
                <textarea
                  rows="3"
                  required
                  placeholder="What makes your craft or products special?"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="form-textarea"
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="submit-seller-btn"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="spinning-loader" size={18} />
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <>
                    <Store size={18} />
                    <span>Submit Seller Application</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
