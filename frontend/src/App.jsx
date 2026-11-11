
import {
  useState,
  useMemo,
  useEffect,
  useRef
} from 'react';
import { useAuth } from './context/AuthContext';

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
import MyOrdersModal from './components/MyOrdersModal';
import Toast from './components/Toast';

// Real Backend API Services
import {
  getPublicProducts,
  getFeaturedProducts,
  getNewArrivals,
  getPublicCategories,
  getPublicSellers
} from './api/publicMarketplace';

import './App.css';

export default function App() {
  const { user } = useAuth();

  // ==========================================
  // 1. NAVIGATION & FILTER STATES
  // ==========================================

  const [activeTab, setActiveTab] = useState('home');

  const [searchQuery, setSearchQuery] = useState('');

  const [selectedCategory, setSelectedCategory] = useState(null);


  // ==========================================
  // 2. REAL MARKETPLACE DATA STATES
  // ==========================================

  const [categories, setCategories] = useState([]);

  const [featuredProducts, setFeaturedProducts] = useState([]);

  const [newArrivalProducts, setNewArrivalProducts] = useState([]);

  const [featuredSellers, setFeaturedSellers] = useState([]);

  const [dataLoading, setDataLoading] = useState(true);

  const [marketplaceLoading, setMarketplaceLoading] = useState(true);

  const [apiError, setApiError] = useState('');

  const [marketplaceError, setMarketplaceError] = useState('');


  // ==========================================
  // 3. CART & WISHLIST STATES (Persisted in localStorage)
  // ==========================================

  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('shopnest_cart');
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore localStorage parse error
    }
    return [];
  });

  // Wishlist stores actual MongoDB product IDs
  const [wishlistIds, setWishlistIds] = useState(() => {
    try {
      const saved = localStorage.getItem('shopnest_wishlist');
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore localStorage parse error
    }
    return [];
  });

  // Keep actual product objects for the wishlist drawer,
  // including products opened from other pages.
  const [wishlistProductMap, setWishlistProductMap] = useState(() => {
    try {
      const saved = localStorage.getItem('shopnest_wishlist_map');
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore localStorage parse error
    }
    return {};
  });

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

  useEffect(() => {
    try {
      localStorage.setItem('shopnest_wishlist_map', JSON.stringify(wishlistProductMap));
    } catch {
      // Ignore storage write error
    }
  }, [wishlistProductMap]);


  // ==========================================
  // 4. MODALS & DRAWERS STATES
  // ==========================================

  const [isCartOpen, setIsCartOpen] = useState(false);

  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [isMyOrdersOpen, setIsMyOrdersOpen] = useState(false);

  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const [selectedSeller, setSelectedSeller] = useState(null);


  // ==========================================
  // 5. TOAST NOTIFICATION
  // ==========================================

  const [toastMessage, setToastMessage] = useState(null);
  const toastTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const showToast = (msg) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(msg);

    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };


  // ==========================================
  // 6. FETCH CATEGORIES & SELLERS FROM BACKEND
  // ==========================================

  useEffect(() => {

    let active = true;

    const loadMarketplaceData = async () => {

      try {

        setMarketplaceLoading(true);
        setMarketplaceError('');

        const [
          categoryData,
          sellerData
        ] = await Promise.all([

          getPublicCategories(),

          getPublicSellers()

        ]);

        if (!active) return;

        setCategories(categoryData);

        setFeaturedSellers(sellerData);

      } catch (error) {

        console.error(
          'Marketplace data loading error:',
          error
        );

        if (active) {

          setMarketplaceError(
            error.response?.data?.message ||
            'Unable to load categories and sellers.'
          );

        }

      } finally {

        if (active) {
          setMarketplaceLoading(false);
        }

      }

    };

    loadMarketplaceData();

    return () => {
      active = false;
    };

  }, []);


  // ==========================================
  // 7. FETCH PRODUCTS FROM BACKEND
  // ==========================================

  useEffect(() => {

    let active = true;

    const loadProducts = async () => {

      try {

        setDataLoading(true);

        setApiError('');

        let featured = [];

        let arrivals = [];

        // Search or category selected
        if (
          searchQuery.trim() ||
          selectedCategory
        ) {

          const params = {
            page: 1,
            limit: 50,
            sort: 'newest'
          };

          if (searchQuery.trim()) {
            params.search = searchQuery.trim();
          }

          if (selectedCategory) {
            params.category = selectedCategory;
          }

          const [
            searchResult,
            latestResult
          ] = await Promise.all([

            getPublicProducts(params),

            getNewArrivals({
              ...params,
              limit: 8
            })

          ]);

          featured = searchResult.products || [];

          arrivals = latestResult || [];

        } else {

          // Default homepage products

          const [
            featuredResult,
            latestResult
          ] = await Promise.all([

            getFeaturedProducts({
              limit: 8
            }),

            getNewArrivals({
              limit: 8
            })

          ]);

          featured = featuredResult && featuredResult.length > 0
            ? featuredResult
            : (latestResult || []);

          arrivals = latestResult || [];

        }

        if (!active) return;

        setFeaturedProducts(featured);

        setNewArrivalProducts(arrivals);

      } catch (error) {

        console.error(
          'Product fetching error:',
          error
        );

        if (active) {

          setFeaturedProducts([]);

          setNewArrivalProducts([]);

          setApiError(
            error.response?.data?.message ||
            'Unable to load products. Please try again.'
          );

        }

      } finally {

        if (active) {
          setDataLoading(false);
        }

      }

    };

    // Debounce search requests
    const timer = setTimeout(() => {
      loadProducts();
    }, 300);

    return () => {

      active = false;

      clearTimeout(timer);

    };

  }, [searchQuery, selectedCategory]);


  // ==========================================
  // 8. CART ACTIONS
  // ==========================================

  const handleAddToCart = (product) => {
    const productId = String(product._id || product.id);
    const productName = product.name || product.title;
    const addQty = Number(product.quantity || 1);
    const availableStock =
      product.stock !== undefined && product.stock !== null ? Number(product.stock) : null;

    if (availableStock !== null && availableStock <= 0) {
      showToast(`"${productName}" is currently out of stock.`);
      return;
    }

    const existingItem = cartItems.find((item) => String(item._id || item.id) === productId);
    const currentQty = existingItem ? Number(existingItem.quantity || 0) : 0;

    if (availableStock !== null && currentQty + addQty > availableStock) {
      showToast(`Only ${availableStock} unit(s) of "${productName}" available in stock.`);
      return;
    }

    setCartItems((prev) => {
      const existing = prev.find((item) => String(item._id || item.id) === productId);
      if (existing) {
        return prev.map((item) =>
          String(item._id || item.id) === productId
            ? {
                ...item,
                stock: availableStock ?? item.stock,
                quantity: item.quantity + addQty,
              }
            : item
        );
      }

      return [
        ...prev,
        {
          ...product,
          id: productId,
          name: productName,
          quantity: addQty,
        },
      ];
    });
    showToast(`"${productName}" added to cart!`);
  };


  const handleUpdateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      handleRemoveFromCart(productId);
      return;
    }

    const targetItem = cartItems.find((item) => String(item._id || item.id) === String(productId));
    const availableStock =
      targetItem?.stock !== undefined && targetItem?.stock !== null ? Number(targetItem.stock) : null;

    if (availableStock !== null && newQty > availableStock) {
      showToast(`Maximum ${availableStock} unit(s) available for "${targetItem?.name || 'this item'}".`);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        String(item._id || item.id) === String(productId) ? { ...item, quantity: newQty } : item
      )
    );
  };


  const handleRemoveFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => String(item._id || item.id) !== String(productId)));
    showToast('Item removed from cart.');
  };


  // ==========================================
  // 9. WISHLIST ACTIONS
  // ==========================================

  const handleToggleWishlist = (product) => {
    if (!product) return;
    const productId = String(product._id || product.id);
    const productName = product.name || product.title || 'Item';
    const normalizedItem = { ...product, id: productId, name: productName };

    if (wishlistIds.includes(productId)) {
      setWishlistIds((prev) =>
        prev.filter((id) => id !== productId)
      );

      setWishlistProductMap((prev) => {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      });

      showToast(
        `Removed "${productName}" from wishlist.`
      );
    } else {
      setWishlistIds((prev) => [
        ...prev,
        productId
      ]);

      setWishlistProductMap((prev) => ({
        ...prev,
        [productId]: normalizedItem
      }));

      showToast(
        `Saved "${productName}" to wishlist!`
      );
    }
  };


  const handleMoveToCart = (product) => {
    handleAddToCart(product);
    const productId = String(product._id || product.id);
    setWishlistIds((prev) =>
      prev.filter((id) => id !== productId)
    );

    setWishlistProductMap((prev) => {
      const updated = { ...prev };
      delete updated[productId];
      return updated;
    });
  };


  // Wishlist products from actual API records

  const wishlistProducts = useMemo(() => {

    return Object.values(wishlistProductMap);

  }, [wishlistProductMap]);

  // Role-protected view resolution
  const effectiveTab =
    (activeTab === 'admin' && user?.role !== 'admin') ||
    (activeTab === 'vendor-dashboard' && user?.role !== 'vendor')
      ? 'home'
      : activeTab;


  // ==========================================
  // 11. TOTAL CART COUNT
  // ==========================================

  const totalCartCount = useMemo(() => {

    return cartItems.reduce(
      (acc, item) => acc + item.quantity,
      0
    );

  }, [cartItems]);


  // ==========================================
  // 12. CHECKOUT ACTIONS
  // ==========================================

  const handleCheckoutStart = () => {

    setIsCartOpen(false);

    setIsCheckoutOpen(true);

  };

  const handleOrderComplete = (order) => {
    setCartItems([]);
    showToast(`Order #${order?.orderNumber || 'confirmed'} placed successfully! Check your email for delivery updates.`);
  };


  // ==========================================
  // 13. NEWSLETTER
  // ==========================================

  const handleNewsletterSubscribe = (email) => {

    showToast(
      `Thank you for subscribing with ${email}!`
    );

  };


  // ==========================================
  // 14. SCROLL TO SECTION
  // ==========================================

  const scrollToSection = (id) => {

    const el = document.getElementById(id);

    if (el) {

      el.scrollIntoView({
        behavior: 'smooth'
      });

    }

  };


  // ==========================================
  // 15. RETURN JSX
  // ==========================================

  return (

    <div className="app-root">

      {/* ===================================
          TOP NAVBAR
      =================================== */}

      <Navbar

        cartCount={totalCartCount}

        wishlistCount={wishlistIds.length}

        onOpenCart={() => setIsCartOpen(true)}

        onOpenWishlist={() => setIsWishlistOpen(true)}

        searchQuery={searchQuery}

        setSearchQuery={setSearchQuery}

        activeTab={effectiveTab}

        setActiveTab={setActiveTab}

        onOpenSellerModal={() =>
          setIsSellerModalOpen(true)
        }

        onOpenAuthModal={() =>
          setIsAuthModalOpen(true)
        }

        onOpenMyOrders={() =>
          setIsMyOrdersOpen(true)
        }

      />


      {/* ===================================
          MAIN PAGE CONTENT
      =================================== */}

      <main className="main-content">

        {/* ADMIN */}

        {effectiveTab === 'admin' ? (

          <AdminVendors

            onBackToHome={() =>
              setActiveTab('home')
            }

            onShowToast={showToast}

          />

        ) : effectiveTab === 'vendor-dashboard' ? (

          /* VENDOR DASHBOARD */

          <VendorDashboard

            onBackToHome={() =>
              setActiveTab('home')
            }

            onShowToast={showToast}

          />

        ) : effectiveTab === 'shop' ? (

          /* SHOP PAGE */

          <ShopPage

            wishlistIds={wishlistIds}

            onToggleWishlist={handleToggleWishlist}

            onAddToCart={handleAddToCart}

            onQuickView={(p) =>
              setQuickViewProduct(p)
            }

            selectedCategory={selectedCategory}

            searchQuery={searchQuery}

            categories={categories}

            sellers={featuredSellers}

            onNavigateHome={() => {

              setActiveTab('home');

              window.scrollTo({
                top: 0,
                behavior: 'smooth'
              });

            }}

            onShowToast={showToast}

          />

        ) : effectiveTab === 'categories' ? (

          /* CATEGORIES PAGE */

          <CategoriesPage

            categories={categories}

            wishlistIds={wishlistIds}

            onToggleWishlist={handleToggleWishlist}

            onAddToCart={handleAddToCart}

            onQuickView={(p) =>
              setQuickViewProduct(p)
            }

            onNavigateShop={(catId) => {

              setSelectedCategory(catId || null);

              setActiveTab('shop');

              window.scrollTo({
                top: 0,
                behavior: 'smooth'
              });

            }}

            onNavigateHome={() => {

              setActiveTab('home');

              window.scrollTo({
                top: 0,
                behavior: 'smooth'
              });

            }}

            onShowToast={showToast}

          />

        ) : effectiveTab === 'sellers' ? (

          /* SELLERS PAGE */

          <SellersPage

            sellers={featuredSellers}

            isLoading={marketplaceLoading}

            onSelectSeller={(seller) =>
              setSelectedSeller(seller)
            }

            onOpenSellerModal={() =>
              setIsSellerModalOpen(true)
            }

            onNavigateHome={() => {

              setActiveTab('home');

              window.scrollTo({
                top: 0,
                behavior: 'smooth'
              });

            }}

            onShowToast={showToast}

          />

        ) : effectiveTab === 'about' ? (

          /* ABOUT PAGE */

          <AboutPage

            onNavigateHome={() => {

              setActiveTab('home');

              window.scrollTo({
                top: 0,
                behavior: 'smooth'
              });

            }}

            onNavigateShop={() => {

              setActiveTab('shop');

              window.scrollTo({
                top: 0,
                behavior: 'smooth'
              });

            }}

            onOpenSellerModal={() =>
              setIsSellerModalOpen(true)
            }

            onShowToast={showToast}

          />

        ) : (

          /* ===================================
             HOMEPAGE
          =================================== */

          <>

            {/* 1. HERO SECTION */}

            <HeroSection

              searchQuery={searchQuery}

              setSearchQuery={setSearchQuery}

              onSearchSubmit={() =>
                scrollToSection(
                  'featured-products-section'
                )
              }

            />


            {/* API ERROR */}

            {(marketplaceError || apiError) && (

              <p
                role="alert"
                style={{
                  color: '#c0392b',
                  padding: '12px 20px'
                }}
              >
                {marketplaceError || apiError}
              </p>

            )}


            {/* 2. CATEGORIES BAR */}

            <CategoriesBar

              categories={categories}

              selectedCategory={selectedCategory}

              onSelectCategory={(catId) => {

                setSelectedCategory(catId);

                if (catId) {

                  scrollToSection(
                    'featured-products-section'
                  );

                  const catObj = categories.find(
                    (c) => c.id === catId
                  );

                  showToast(
                    `Showing ${catObj?.name || ''} products`
                  );

                } else {

                  showToast(
                    'Showing all products'
                  );

                }

              }}

            />


            {/* 3. ACTIVE FILTER NOTICE */}

            {(searchQuery || selectedCategory) && (

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1.25rem',
                  marginBottom: '1.5rem',
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #ebe5da',
                  fontSize: '0.88rem'
                }}
              >

                <span>

                  Filtering by:

                  {searchQuery && (
                    <strong>
                      {' '}"{searchQuery}"
                    </strong>
                  )}

                  {selectedCategory && (

                    <span
                      className="qv-tag-pill"
                      style={{
                        marginLeft: '6px'
                      }}
                    >
                      Category:{' '}

                      {
                        categories.find(
                          (c) => c.id === selectedCategory
                        )?.name
                      }

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


            {/* 4. FEATURED PRODUCTS / SEARCH RESULTS */}

            <FeaturedProducts

              products={featuredProducts}

              isLoading={dataLoading}

              title={
                searchQuery.trim() || selectedCategory
                  ? 'Search Results'
                  : 'Featured Products'
              }

              wishlistIds={wishlistIds}

              onToggleWishlist={handleToggleWishlist}

              onAddToCart={handleAddToCart}

              onQuickView={(p) =>
                setQuickViewProduct(p)
              }

              onViewAll={() => {

                setActiveTab('shop');

                window.scrollTo({
                  top: 0,
                  behavior: 'smooth'
                });

                showToast(
                  'Browsing all products in Shop'
                );

              }}

            />


            {/* 5. FEATURED SELLERS */}

            <FeaturedSellers

              sellers={featuredSellers}

              isLoading={marketplaceLoading}

              onSelectSeller={(seller) =>
                setSelectedSeller(seller)
              }

            />


            {/* 6. NEW ARRIVALS */}

            <NewArrivals

              products={newArrivalProducts}

              isLoading={dataLoading}

              wishlistIds={wishlistIds}

              onToggleWishlist={handleToggleWishlist}

              onAddToCart={handleAddToCart}

              onQuickView={(p) =>
                setQuickViewProduct(p)
              }

              onViewAll={() => {

                setActiveTab('shop');

                window.scrollTo({
                  top: 0,
                  behavior: 'smooth'
                });

                showToast(
                  'Browsing latest arrivals in Shop'
                );

              }}

            />


            {/* 7. JOIN AS SELLER BANNER */}

            <JoinSellerBanner

              onOpenSellerModal={() =>
                setIsSellerModalOpen(true)
              }

            />


            {/* 8. TRUST SECTION */}

            <TrustSection />

          </>

        )}

      </main>


      {/* ===================================
          FOOTER
      =================================== */}

      <Footer

        onSubscribe={handleNewsletterSubscribe}

        onShowToast={showToast}

        onNavClick={(tab) => {

          setActiveTab(tab);

          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });

        }}

      />


      {/* ===================================
          CART DRAWER
      =================================== */}

      <CartDrawer

        isOpen={isCartOpen}

        onClose={() =>
          setIsCartOpen(false)
        }

        cartItems={cartItems}

        onUpdateQuantity={handleUpdateQuantity}

        onRemoveItem={handleRemoveFromCart}

        onCheckout={handleCheckoutStart}

      />


      {/* ===================================
          WISHLIST DRAWER
      =================================== */}

      <WishlistDrawer

        isOpen={isWishlistOpen}

        onClose={() =>
          setIsWishlistOpen(false)
        }

        wishlistItems={wishlistProducts}

        onRemoveFromWishlist={(id) => {

          setWishlistIds((prev) =>
            prev.filter((item) => item !== id)
          );

          setWishlistProductMap((prev) => {

            const updated = { ...prev };

            delete updated[id];

            return updated;

          });

          showToast(
            'Removed from wishlist'
          );

        }}

        onMoveToCart={handleMoveToCart}

      />


      {/* ===================================
          QUICK VIEW MODAL
      =================================== */}

      {quickViewProduct && (

        <QuickViewModal

          product={quickViewProduct}

          onClose={() =>
            setQuickViewProduct(null)
          }

          isWishlisted={wishlistIds.includes(
            String(quickViewProduct._id || quickViewProduct.id)
          )}

          onToggleWishlist={handleToggleWishlist}

          onAddToCart={handleAddToCart}

        />

      )}


      {/* ===================================
          SELLER APPLICATION MODAL
      =================================== */}

      <SellerModal

        isOpen={isSellerModalOpen}

        onClose={() =>
          setIsSellerModalOpen(false)
        }

        onShowToast={showToast}

        onOpenAuthModal={() =>
          setIsAuthModalOpen(true)
        }

        onGoToVendorDashboard={() => {

          setIsSellerModalOpen(false);

          setActiveTab('vendor-dashboard');

        }}

      />


      {/* ===================================
          SELLER DETAIL MODAL
      =================================== */}

      {selectedSeller && (

        <SellerDetailModal

          seller={selectedSeller}

          onClose={() =>
            setSelectedSeller(null)
          }

          onAddToCart={handleAddToCart}

          onQuickView={(p) =>
            setQuickViewProduct(p)
          }

          onShowToast={showToast}

        />

      )}


      {/* ===================================
          CHECKOUT MODAL
      =================================== */}

      <CheckoutModal


        isOpen={isCheckoutOpen}

        onClose={() =>
          setIsCheckoutOpen(false)
        }

        cartItems={cartItems}

        onOrderComplete={handleOrderComplete}

        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />


      {/* ===================================
          MY ORDERS HISTORY MODAL (Day 6)
      =================================== */}

      <MyOrdersModal

        isOpen={isMyOrdersOpen}

        onClose={() =>
          setIsMyOrdersOpen(false)
        }

        onShowToast={showToast}

        onNavigateShop={() => {

          setActiveTab('shop');

          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });

        }}

      />


      {/* ===================================
          AUTH MODAL
      =================================== */}

      <AuthModal

        isOpen={isAuthModalOpen}

        onClose={() =>
          setIsAuthModalOpen(false)
        }

        onShowToast={showToast}

      />


      {/* ===================================
          TOAST NOTIFICATION
      =================================== */}

      <Toast

        message={toastMessage}

        onClose={() =>
          setToastMessage(null)
        }

      />

    </div>

  );

}
