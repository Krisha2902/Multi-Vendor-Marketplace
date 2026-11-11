
import { useState, useEffect } from 'react';
import { getPublicProductById } from '../api/publicMarketplace';
import {
  X,
  Star,
  Heart,
  ShoppingCart,
  ShieldCheck,
  Truck,
  RefreshCw,
} from 'lucide-react';

export default function QuickViewModal({
  product,
  onClose,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
}) {
  const [qty, setQty] = useState(1);

  const [fullProduct, setFullProduct] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');

  // Fetch complete product details from MongoDB
  useEffect(() => {
    let active = true;

    const fetchProductDetails = async () => {
      if (!product?.id) return;

      try {
        setLoading(true);
        setError('');
        setFullProduct(null);
        setQty(1);

        const result = await getPublicProductById(
          product.id
        );

        if (active) {
          setFullProduct(result);
        }
      } catch (err) {
        console.error(
          'Error fetching product details:',
          err
        );

        if (active) {
          setError(
            err.response?.data?.message ||
            'Unable to load product details. Please try again.'
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchProductDetails();

    return () => {
      active = false;
    };
  }, [product?.id]);

  // Use complete API data when available.
  // Otherwise display the product card preview.
  if (!product) return null;

  const currentProduct = fullProduct || product;

  const availableStock = Number(
    currentProduct.stock || 0
  );

  const hasStock = availableStock > 0;

  // Add product to cart
  const handleAdd = () => {
    if (!hasStock || loading) return;

    onAddToCart({
      ...currentProduct,
      quantity: qty,
    });

    onClose();
  };

  // Increase quantity without exceeding stock
  const handleIncreaseQty = () => {
    setQty((previousQty) =>
      Math.min(availableStock, previousQty + 1)
    );
  };

  // Decrease quantity
  const handleDecreaseQty = () => {
    setQty((previousQty) =>
      Math.max(1, previousQty - 1)
    );
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
    >
      <div
        className="modal-dialog quickview-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="quickview-grid">

          {/* Left Column - Product Image */}
          <div className="quickview-image-wrap">

            {currentProduct.image ? (
              <img
                src={currentProduct.image}
                alt={currentProduct.name}
                className="quickview-img"
              />
            ) : (
              <div className="quickview-img">
                Product image unavailable
              </div>
            )}

            {currentProduct.badge && (
              <span
                className={`product-badge badge-${
                  currentProduct.badgeType || 'default'
                } qv-badge`}
              >
                {currentProduct.badge}
              </span>
            )}

          </div>

          {/* Right Column - Product Details */}
          <div className="quickview-details">

            <span className="qv-category-chip">
              {currentProduct.categoryName ||
                'Independent Artisan Goods'}
            </span>

            <h2 className="qv-title">
              {currentProduct.name}
            </h2>

            <p className="qv-seller-line">
              Sold by{' '}
              <strong>
                {currentProduct.seller}
              </strong>

              {' '}•{' '}

              <span className="verified-tag">
                Verified Independent Seller
              </span>
            </p>

            {/* Loading State */}
            {loading && (
              <p>
                Loading latest product details...
              </p>
            )}

            {/* API Error */}
            {error && (
              <p
                className="error-message"
                role="alert"
              >
                {error}
              </p>
            )}

            {/* Product Rating */}
            <div className="qv-rating-line">

              <div className="stars-row">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={15}
                    fill={
                      i < Math.floor(
                        currentProduct.rating || 0
                      )
                        ? '#f59e0b'
                        : 'none'
                    }
                    color="#f59e0b"
                  />
                ))}
              </div>

              <span className="qv-rating-score">
                {currentProduct.rating || 0}
              </span>

              <span className="qv-rating-reviews">
                ({currentProduct.reviews || 0} customer reviews)
              </span>

            </div>

            {/* Product Price */}
            <div className="qv-price-box">

              <span className="qv-current-price">
                ₹{Number(
                  currentProduct.price || 0
                ).toLocaleString('en-IN')}
              </span>

              {currentProduct.originalPrice && Number(currentProduct.originalPrice) > Number(currentProduct.price || 0) && (
                <>
                  <span className="qv-original-price">
                    ₹{Number(
                      currentProduct.originalPrice
                    ).toLocaleString('en-IN')}
                  </span>

                  <span className="qv-discount-pill">
                    {Math.round(
                      (
                        (
                          currentProduct.originalPrice -
                          currentProduct.price
                        ) /
                        currentProduct.originalPrice
                      ) * 100
                    )}% OFF
                  </span>
                </>
              )}

            </div>

            {/* Product Description */}
            <p className="qv-desc">
              {currentProduct.description}
            </p>

            {/* Product Tags */}
            {currentProduct.tags?.length > 0 && (
              <div className="qv-tags-row">
                {currentProduct.tags.map((tag) => (
                  <span
                    key={tag}
                    className="qv-tag-pill"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Stock Information */}
            <p className="qv-stock-info">
              {loading
                ? 'Checking availability...'
                : hasStock
                  ? `${availableStock} items available`
                  : 'Out of Stock'}
            </p>

            {/* Quantity and Actions */}
            <div className="qv-actions-row">

              {/* Quantity Selector */}
              <div className="qv-qty-selector">

                <button
                  onClick={handleDecreaseQty}
                  className="qv-qty-btn"
                  aria-label="Decrease quantity"
                  disabled={qty <= 1}
                >
                  -
                </button>

                <span className="qv-qty-val">
                  {qty}
                </span>

                <button
                  onClick={handleIncreaseQty}
                  className="qv-qty-btn"
                  aria-label="Increase quantity"
                  disabled={
                    qty >= availableStock ||
                    loading ||
                    !hasStock
                  }
                >
                  +
                </button>

              </div>

              {/* Add to Cart */}
              <button
                className="qv-add-cart-btn"
                onClick={handleAdd}
                disabled={
                  loading ||
                  !hasStock ||
                  !!error
                }
              >
                <ShoppingCart size={18} />

                <span>
                  {!hasStock
                    ? 'Out of Stock'
                    : 'Add to Cart'}
                </span>
              </button>

              {/* Wishlist */}
              <button
                className={`qv-wishlist-btn ${
                  isWishlisted ? 'active' : ''
                }`}
                onClick={() =>
                  onToggleWishlist(currentProduct)
                }
                title="Save to wishlist"
              >
                <Heart
                  size={20}
                  fill={
                    isWishlisted
                      ? '#e07a5f'
                      : 'none'
                  }
                  color={
                    isWishlisted
                      ? '#e07a5f'
                      : '#6b665c'
                  }
                />
              </button>

            </div>

            {/* Reassurance Features */}
            <div className="qv-features-list">

              <div className="qv-feature-item">
                <ShieldCheck
                  size={18}
                  className="feat-icon"
                />
                <span>
                  100% Buyer Protection & Authentic Guarantee
                </span>
              </div>

              <div className="qv-feature-item">
                <Truck
                  size={18}
                  className="feat-icon"
                />
                <span>
                  Dispatched within 24-48 hours via insured courier
                </span>
              </div>

              <div className="qv-feature-item">
                <RefreshCw
                  size={18}
                  className="feat-icon"
                />
                <span>
                  7-Day easy returns & exchanges
                </span>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
