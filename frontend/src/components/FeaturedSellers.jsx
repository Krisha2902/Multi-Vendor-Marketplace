import React from 'react';
import { Star, Store, MapPin } from 'lucide-react';
import { FEATURED_SELLERS } from '../data/mockData';

export default function FeaturedSellers({ onSelectSeller }) {
  return (
    <section className="section-container" id="featured-sellers-section">
      <div className="section-header-row">
        <h2 className="section-title">Featured Sellers</h2>
      </div>

      <div className="sellers-grid">
        {FEATURED_SELLERS.map((seller) => (
          <div 
            key={seller.id} 
            className="seller-card"
            onClick={() => onSelectSeller && onSelectSeller(seller)}
          >
            {/* Seller Header Info */}
            <div className="seller-card-header">
              <div className="seller-avatar-wrap">
                <img 
                  src={seller.avatar} 
                  alt={seller.name} 
                  className="seller-avatar-img" 
                />
              </div>
              <div className="seller-header-text">
                <h3 className="seller-name">{seller.name}</h3>
                <div className="seller-rating-line">
                  <Star size={14} className="star-icon" fill="#f59e0b" color="#f59e0b" />
                  <span className="seller-rating-val">{seller.rating}</span>
                </div>
              </div>
            </div>

            {/* Seller 3 Preview Thumbnails */}
            <div className="seller-thumbnails-row">
              {seller.thumbnails.map((thumb) => (
                <div key={thumb.id} className="seller-thumbnail-wrap">
                  <img 
                    src={thumb.image} 
                    alt={thumb.title} 
                    className="seller-thumb-img" 
                    loading="lazy" 
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
