import React from 'react';

export default function JoinSellerBanner({ onOpenSellerModal }) {
  return (
    <section className="section-container">
      <div className="join-seller-banner">
        {/* Left Column Content */}
        <div className="join-seller-text-col">
          <h2 className="join-seller-heading">Join as a Seller</h2>
          <p className="join-seller-subtext">
            Encouraging vendors to start selling on our marketplace.
          </p>
          <button 
            className="join-seller-action-btn"
            onClick={onOpenSellerModal}
          >
            Join as a Seller
          </button>
        </div>

        {/* Right Column Illustration */}
        <div className="join-seller-illustration-col">
          <div className="seller-ill-wrap">
            <img 
              src="/seller-illustration.jpg" 
              alt="Friendly craftsman artisan waving" 
              className="seller-ill-img" 
            />
          </div>
        </div>
      </div>
    </section>
  );
}
