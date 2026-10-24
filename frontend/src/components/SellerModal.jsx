import React, { useState } from 'react';
import { X, CheckCircle2, Store, Sparkles } from 'lucide-react';

export default function SellerModal({ isOpen, onClose, onShowToast }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    storeName: '',
    email: '',
    category: 'Home & Living',
    bio: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (onShowToast) {
      onShowToast(`Seller application for "${formData.storeName || 'Your Store'}" received!`);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      fullName: '',
      storeName: '',
      email: '',
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

        {!submitted ? (
          <div className="seller-form-wrapper">
            <div className="seller-modal-badge">
              <Sparkles size={16} />
              <span>Independent Maker Network</span>
            </div>
            
            <h2 className="seller-modal-title">Join as a Seller on ShopNest</h2>
            <p className="seller-modal-subtitle">
              Encouraging vendors to start selling on our marketplace. Connect with customers who appreciate unique craftsmanship and quality.
            </p>

            <form onSubmit={handleSubmit} className="seller-form">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Sharma"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Shop / Brand Name</label>
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
                  placeholder="vendor@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Primary Category</label>
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
                <label className="form-label">Tell us about your products</label>
                <textarea
                  rows="3"
                  placeholder="What makes your craft or products special?"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="form-textarea"
                ></textarea>
              </div>

              <button type="submit" className="submit-seller-btn">
                <Store size={18} />
                <span>Submit Seller Application</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="seller-success-state">
            <CheckCircle2 size={56} className="success-icon" />
            <h3>Application Received!</h3>
            <p>
              Thank you for applying to sell with <strong>ShopNest</strong>. Our vendor onboarding team will review your shop profile for <em>{formData.storeName}</em> and email you at <em>{formData.email}</em> within 24 hours.
            </p>
            <button className="empty-action-btn" onClick={handleReset}>
              Back to Marketplace
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
