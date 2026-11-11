
import { Store, ArrowRight } from 'lucide-react';

export default function FeaturedSellers({
  sellers = [],
  onSelectSeller,
  isLoading = false,
}) {
  return (
    <section
      className="section-container"
      id="featured-sellers-section"
    >
      <div className="section-header-row">
        <h2 className="section-title">
          Featured Sellers
        </h2>
      </div>

      {isLoading ? (
        <p>Loading sellers...</p>
      ) : sellers.length === 0 ? (
        <p>No approved sellers available yet.</p>
      ) : (
        <div className="sellers-grid">
          {sellers.map((seller) => (
            <div
              key={seller.id}
              className="seller-card"
              role="button"
              tabIndex={0}
              onClick={() =>
                onSelectSeller?.(seller)
              }
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  onSelectSeller?.(seller);
                }
              }}
            >
              <div className="seller-card-header">
                <div
                  className="seller-avatar-wrap"
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {seller.avatar ? (
                    <img
                      src={seller.avatar}
                      alt={seller.name}
                      className="seller-avatar-img"
                    />
                  ) : (
                    <Store size={28} />
                  )}
                </div>

                <div className="seller-header-text">
                  <h3 className="seller-name">
                    {seller.name}
                  </h3>

                  <span className="seller-rating-val">
                    {seller.category}
                  </span>
                </div>
              </div>

              <div className="seller-thumbnails-row">
                {seller.thumbnails.map((thumb) => (
                  <div
                    key={thumb.id}
                    className="seller-thumbnail-wrap"
                  >
                    {thumb.image && (
                      <img
                        src={thumb.image}
                        alt={thumb.title}
                        className="seller-thumb-img"
                        loading="lazy"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '12px',
                }}
              >
                <span>
                  {seller.productsCount} products
                </span>

                <ArrowRight size={16} />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
