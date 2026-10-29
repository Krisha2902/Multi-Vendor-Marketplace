import React, { useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import CategoriesBar from './components/CategoriesBar';
import FeaturedProducts from './components/FeaturedProducts';
import FeaturedSellers from './components/FeaturedSellers';
import NewArrivals from './components/NewArrivals';
import JoinSellerBanner from './components/JoinSellerBanner';
import TrustSection from './components/TrustSection';
import Footer from './components/Footer';

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

  // Cart & Wishlist States
  const [cartItems, setCartItems] = useState([
    {
      id: 'prod-1',
      name: 'Floral Midi Dress',
      seller: 'StyleHaven',
      price: 1499,
      image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=700&q=80',
      quantity: 1
    }
  ]);
  const [wishlistIds, setWishlistIds] = useState(['prod-2']);

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
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });
    showToast(`"${product.name}" added to cart!`);
  };

  const handleUpdateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
    showToast('Item removed from cart.');
  };

  // Wishlist Actions
  const handleToggleWishlist = (product) => {
    if (wishlistIds.includes(product.id)) {
      setWishlistIds((prev) => prev.filter((id) => id !== product.id));
      showToast(`Removed "${product.name}" from wishlist.`);
    } else {
      setWishlistIds((prev) => [...prev, product.id]);
      showToast(`Saved "${product.name}" to wishlist!`);
    }
  };

  const handleMoveToCart = (product) => {
    handleAddToCart(product);
    setWishlistIds((prev) => prev.filter((id) => id !== product.id));
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

  const handleOrderComplete = () => {
    setCartItems([]);
    showToast('Order confirmed! Check your email for delivery updates.');
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
            setSelectedCategory(null);
            setSearchQuery('');
            showToast('Browsing all featured marketplace items');
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
            setSelectedCategory(null);
            setSearchQuery('');
            showToast('Browsing latest arrivals from independent sellers');
          }}
        />

        {/* 7. Join as a Seller Banner */}
        <JoinSellerBanner
          onOpenSellerModal={() => setIsSellerModalOpen(true)}
        />

        {/* 8. Why Choose ShopNest? Section */}
        <TrustSection />
      </main>

      {/* 9. Footer */}
      <Footer
        onSubscribe={handleNewsletterSubscribe}
        onNavClick={(tab) => {
          setActiveTab(tab);
          if (tab === 'sellers') scrollToSection('featured-sellers-section');
          else if (tab === 'categories') scrollToSection('categories-bar-section');
          else if (tab === 'shop') scrollToSection('featured-products-section');
          else if (tab === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
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
