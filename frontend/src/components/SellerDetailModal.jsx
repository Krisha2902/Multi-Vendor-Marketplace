import React, { useEffect, useState } from 'react';
import { X, Star, MapPin, Store, CheckCircle, Heart, ShoppingCart } from 'lucide-react';
import { getPublicSellerById } from '../api/publicMarketplace';

export default function SellerDetailModal({
  seller,
  onClose,
  onAddToCart,
  onQuickView,
  onShowToast
}) {
  const [sellerDetail, setSellerDetail] = useState(seller);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    setSellerDetail(seller);
    if (!seller?.id) return;

    let active = true;
    const loadSellerDetail = async () => {
      try {
        setLoadingProducts(true);
        const fullSeller = await getPublicSellerById(seller.id);
        if (active && fullSeller) {
          setSellerDetail(fullSeller);
        }
      } catch (err) {
        console.warn('Could not load full seller showcase:', err.message);
      } finally {
        if (active) setLoadingProducts(false);
      }
    };

    loadSellerDetail();
    return () => {
      active = false;
    };
  }, [seller?.id]);

  if (!seller) return null;

  const activeSeller = sellerDetail || seller;
  const items = activeSeller.products?.length
    ? activeSeller.products
    : (activeSeller.thumbnails || []).map((thumb) => thumb.product || {
        id: thumb.id,
        name: thumb.title,
        image: thumb.image,
        price: thumb.price,
        seller: activeSeller.name,
      });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog seller-profile-dialog" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="seller-profile-banner">
          <div className="seller-profile-avatar-row">
            {activeSeller.avatar ? (
              <img src={activeSeller.avatar} alt={activeSeller.name} className="seller-lg-avatar" />
            ) : (
              <div
                className="seller-lg-avatar"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#efeae1',
                  color: '#233123',
                  fontWeight: 700,
                }}
              >
                <Store size={32} />
              </div>
            )}

            <div className="seller-lg-info">
              <div className="seller-name-badge">
                <h2>{activeSeller.name}</h2>
                <CheckCircle size={18} className="verified-check" />
              </div>
              <p className="seller-cat-text">{activeSeller.category}</p>
              {activeSeller.bio && (
                <p style={{ fontSize: '0.88rem', color: '#57534e', margin: '0.25rem 0 0.5rem' }}>
                  {activeSeller.bio}
                </p>
              )}
              <div className="seller-meta-row">
                {activeSeller.ratingScore ? (
                  <span className="seller-meta-item">
                    <Star size={14} fill="#f59e0b" color="#f59e0b" />
                    <strong>{activeSeller.ratingScore}</strong> ({activeSeller.reviewsCount || 0} reviews)
                  </span>
                ) : (
                  <span className="seller-meta-item">
                    <Star size={14} fill="#f59e0b" color="#f59e0b" />
                    <strong>Verified Maker</strong>
                  </span>
                )}
                <span className="seller-meta-item">
                  <MapPin size={14} /> {activeSeller.location || 'India'}
                </span>
                <span className="seller-meta-item">
                  <Store size={14} /> {activeSeller.productsCount ?? items.length} Products
                </span>
              </div>
            </div>

            <button
              className="follow-shop-btn"
              onClick={() => onShowToast && onShowToast(`Following ${activeSeller.name}!`)}
            >
              <Heart size={16} />
              <span>Follow Shop</span>
            </button>
          </div>
        </div>

        <div className="seller-showcase-section">
          <h3 className="seller-showcase-title">Artisan Collection</h3>
          <p className="seller-showcase-sub">Handpicked creations currently listed by {activeSeller.name}.</p>

          {loadingProducts && items.length === 0 ? (
            <p style={{ color: '#64748b', padding: '1rem 0' }}>Loading store products...</p>
          ) : items.length === 0 ? (
            <p style={{ color: '#64748b', padding: '1rem 0' }}>No active products listed in this store yet.</p>
          ) : (
            <div className="seller-items-grid">
              {items.map((item) => (
                <div key={item.id} className="seller-item-card">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name || item.title}
                      className="seller-item-card-img"
                      style={{ cursor: onQuickView ? 'pointer' : 'default' }}
                      onClick={() => {
                        if (onQuickView) {
                          onClose();
                          onQuickView(item);
                        }
                      }}
                    />
                  )}
                  <div className="seller-item-meta">
                    <h4
                      style={{ cursor: onQuickView ? 'pointer' : 'default' }}
                      onClick={() => {
                        if (onQuickView) {
                          onClose();
                          onQuickView(item);
                        }
                      }}
                    >
                      {item.name || item.title}
                    </h4>
                    <span className="seller-item-price">
                      {item.price !== undefined && item.price !== null
                        ? `₹${Number(item.price).toLocaleString('en-IN')}`
                        : 'Artisan Pick'}
                    </span>
                    {onAddToCart && (
                      <button
                        type="button"
                        className="card-add-cart-btn"
                        style={{ marginTop: '0.5rem', width: '100%', padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
                        disabled={item.stock === 0}
                        onClick={() => onAddToCart(item)}
                      >
                        <ShoppingCart size={13} />
                        <span>{item.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                      </button>
                    )}
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
