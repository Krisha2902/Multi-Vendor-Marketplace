import React, { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import CategoriesBar from './components/CategoriesBar';
import FeaturedProducts from './components/FeaturedProducts';
import FeaturedSellers from './components/FeaturedSellers';
import NewArrivals from './components/NewArrivals';
import JoinSellerBanner from './components/JoinSellerBanner';
import TrustSection from './components/TrustSection';
import Footer from './components/Footer';
import AdminVendors from './components/AdminVendors';
import VendorDashboard from './components/VendorDashboard';
import ShopPage from './components/ShopPage';
import CategoriesPage from './components/CategoriesPage';
import SellersPage from './components/SellersPage';
import AboutPage from './components/AboutPage';

// Drawers & Modals
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import QuickViewModal from './components/QuickViewModal';
import SellerModal from './components/SellerModal';
import SellerDetailModal from './components/SellerDetailModal';
import CheckoutModal from './components/CheckoutModal';
import AuthModal from './components/AuthModal';
import Toast from './components/Toast';

import { FEATURED_PRODUCTS, NEW_ARRIVALS, CATEGORIES } from './data/mockData';
import './App.css';

export default function App() {
  // Navigation & Filter States
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Cart & Wishlist States (Persisted in localStorage for Day 5)
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('shopnest_cart');
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore localStorage parse error
    }
    return [
      {
        id: 'prod-1',
        name: 'Floral Midi Dress',
        seller: 'StyleHaven',
        price: 1499,
        image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=700&q=80',
        quantity: 1,
      },
    ];
  });

  const [wishlistIds, setWishlistIds] = useState(() => {
    try {
      const saved = localStorage.getItem('shopnest_wishlist');
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore localStorage parse error
    }
    return ['prod-2'];
  });

  // Sync cart & wishlist changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('shopnest_cart', JSON.stringify(cartItems));
    } catch {
      // Ignore storage write error
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('shopnest_wishlist', JSON.stringify(wishlistIds));
    } catch {
      // Ignore storage write error
    }
  }, [wishlistIds]);

  // Modals & Drawers States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [selectedSeller, setSelectedSeller] = useState(null);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  // Cart Actions
  const handleAddToCart = (product) => {
    const qty = product.quantity || 1;
    setCartItems((prev) => {
      const existing = prev.find((item) => (item._id || item.id) === (product._id || product.id));
      if (existing) {
        return prev.map((item) =>
          (item._id || item.id) === (product._id || product.id)
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });
    showToast(`"${product.name || product.title}" added to cart!`);
  };

  const handleUpdateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => ((item._id || item.id) === productId ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => (item._id || item.id) !== productId));
    showToast('Item removed from cart.');
  };

  // Wishlist Actions
  const handleToggleWishlist = (product) => {
    const prodId = product._id || product.id;
    if (wishlistIds.includes(prodId)) {
      setWishlistIds((prev) => prev.filter((id) => id !== prodId));
      showToast(`Removed "${product.name || product.title}" from wishlist.`);
    } else {
      setWishlistIds((prev) => [...prev, prodId]);
      showToast(`Saved "${product.name || product.title}" to wishlist!`);
    }
  };

  const handleMoveToCart = (product) => {
    handleAddToCart(product);
    const prodId = product._id || product.id;
    setWishlistIds((prev) => prev.filter((id) => id !== prodId));
  };

  // Filter products based on search and category
  const allProducts = useMemo(() => [...FEATURED_PRODUCTS, ...NEW_ARRIVALS], []);

  const wishlistProducts = useMemo(() => {
    return allProducts.filter((p) => wishlistIds.includes(p.id));
  }, [allProducts, wishlistIds]);

  const filteredFeatured = useMemo(() => {
    return FEATURED_PRODUCTS.filter((prod) => {
      const matchesSearch =
        !searchQuery ||
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.seller.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        !selectedCategory || prod.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const filteredNewArrivals = useMemo(() => {
    return NEW_ARRIVALS.filter((prod) => {
      const matchesSearch =
        !searchQuery ||
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.seller.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        !selectedCategory || prod.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const totalCartCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  const handleCheckoutStart = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderComplete = (order) => {
    setCartItems([]);
    showToast(`Order #${order?.orderNumber || 'confirmed'} placed successfully! Check your email for delivery updates.`);
  };

  const handleNewsletterSubscribe = (email) => {
    showToast(`Thank you for subscribing with ${email}!`);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="app-root">
      {/* 1. Top Navbar */}
      <Navbar
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSellerModal={() => setIsSellerModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main Page Content */}
      <main className="main-content">
        {activeTab === 'admin' ? (
          <AdminVendors 
            onBackToHome={() => setActiveTab('home')} 
            onShowToast={showToast} 
          />
        ) : activeTab === 'vendor-dashboard' ? (
          <VendorDashboard 
            onBackToHome={() => setActiveTab('home')} 
            onShowToast={showToast} 
          />
        ) : activeTab === 'shop' ? (
          <ShopPage
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onQuickView={(p) => setQuickViewProduct(p)}
            onNavigateHome={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onShowToast={showToast}
          />
        ) : activeTab === 'categories' ? (
          <CategoriesPage
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onQuickView={(p) => setQuickViewProduct(p)}
            onNavigateShop={(catId) => {
              if (catId) {
                setSelectedCategory(catId);
              }
              setActiveTab('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateHome={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onShowToast={showToast}
          />
        ) : activeTab === 'sellers' ? (
          <SellersPage
            onSelectSeller={(seller) => setSelectedSeller(seller)}
            onOpenSellerModal={() => setIsSellerModalOpen(true)}
            onNavigateHome={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onShowToast={showToast}
          />
        ) : activeTab === 'about' ? (
          <AboutPage
            onNavigateHome={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateShop={() => {
              setActiveTab('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenSellerModal={() => setIsSellerModalOpen(true)}
            onShowToast={showToast}
          />
        ) : (
          <>
            {/* 2. Hero Section */}
            <HeroSection
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearchSubmit={() => scrollToSection('featured-products-section')}
            />

            {/* 3. Category Bar */}
            <CategoriesBar
              selectedCategory={selectedCategory}
              onSelectCategory={(catId) => {
                setSelectedCategory(catId);
                if (catId) {
                  scrollToSection('featured-products-section');
                  const catObj = CATEGORIES.find((c) => c.id === catId);
                  showToast(`Showing ${catObj ? catObj.name : ''} products`);
                } else {
                  showToast('Showing all products');
                }
              }}
            />

            {/* Active Filter Notice */}
            {(searchQuery || selectedCategory) && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1.25rem',
                marginBottom: '1.5rem',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #ebe5da',
                fontSize: '0.88rem'
              }}>
                <span>
                  Filtering by: {searchQuery && <strong>"{searchQuery}" </strong>}
                  {selectedCategory && (
                    <span className="qv-tag-pill" style={{ marginLeft: '6px' }}>
                      Category: {CATEGORIES.find((c) => c.id === selectedCategory)?.name}
                    </span>
                  )}
                </span>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory(null);
                  }}
                  style={{
                    fontSize: '0.82rem',
                    color: '#cf633a',
                    fontWeight: '600',
                    textDecoration: 'underline'
                  }}
                >
                  Clear filters
                </button>
              </div>
            )}

            {/* 4. Featured Products Section */}
            <FeaturedProducts
              products={filteredFeatured.length > 0 ? filteredFeatured : FEATURED_PRODUCTS}
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
              onAddToCart={handleAddToCart}
              onQuickView={(p) => setQuickViewProduct(p)}
              onViewAll={() => {
                setActiveTab('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                showToast('Browsing all featured catalog items in Shop');
              }}
            />

            {/* 5. Featured Sellers Section */}
            <FeaturedSellers
              onSelectSeller={(seller) => setSelectedSeller(seller)}
            />

            {/* 6. New Arrivals Section */}
            <NewArrivals
              products={filteredNewArrivals.length > 0 ? filteredNewArrivals : NEW_ARRIVALS}
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
              onAddToCart={handleAddToCart}
              onQuickView={(p) => setQuickViewProduct(p)}
              onViewAll={() => {
                setActiveTab('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                showToast('Browsing latest arrivals in Shop');
              }}
            />

            {/* 7. Join as a Seller Banner */}
            <JoinSellerBanner
              onOpenSellerModal={() => setIsSellerModalOpen(true)}
            />

            {/* 8. Why Choose ShopNest? Section */}
            <TrustSection />
          </>
        )}
      </main>

      {/* 9. Footer */}
      <Footer
        onSubscribe={handleNewsletterSubscribe}
        onNavClick={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckoutStart}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlistProducts}
        onRemoveFromWishlist={(id) => {
          setWishlistIds((prev) => prev.filter((item) => item !== id));
          showToast('Removed from wishlist');
        }}
        onMoveToCart={handleMoveToCart}
      />

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          isWishlisted={wishlistIds.includes(quickViewProduct.id)}
          onToggleWishlist={handleToggleWishlist}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Seller Application Modal */}
      <SellerModal
        isOpen={isSellerModalOpen}
        onClose={() => setIsSellerModalOpen(false)}
        onShowToast={showToast}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onGoToVendorDashboard={() => {
          setIsSellerModalOpen(false);
          setActiveTab('vendor-dashboard');
        }}
      />

      {/* Seller Detail Showcase Modal */}
      {selectedSeller && (
        <SellerDetailModal
          seller={selectedSeller}
          onClose={() => setSelectedSeller(null)}
          onAddToCart={handleAddToCart}
          onQuickView={(p) => setQuickViewProduct(p)}
          onShowToast={showToast}
        />
      )}

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onOrderComplete={handleOrderComplete}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Auth Modal (Login / Register) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onShowToast={showToast}
      />

      {/* Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
