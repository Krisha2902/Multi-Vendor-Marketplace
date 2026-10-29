import React, { useState, useRef, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Heart, 
  ShoppingCart, 
  Menu, 
  X,
  User as UserIcon,
  LogOut,
  Shield,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ 
  cartCount, 
  wishlistCount, 
  onOpenCart, 
  onOpenWishlist, 
  searchQuery, 
  setSearchQuery,
  activeTab,
  setActiveTab,
  onOpenSellerModal,
  onOpenAuthModal
}) {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'Shop', id: 'shop' },
    { name: 'Categories', id: 'categories' },
    { name: 'Sellers', id: 'sellers' },
    { name: 'About', id: 'about' }
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    
    if (id === 'sellers') {
      const el = document.getElementById('featured-sellers-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (id === 'categories') {
      const el = document.getElementById('categories-bar-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (id === 'shop') {
      const el = document.getElementById('featured-products-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <div className="brand-logo" onClick={() => handleNavClick('home')}>
          <div className="logo-icon-wrap">
            <ShoppingBag className="logo-icon" size={20} />
          </div>
          <span className="brand-name">ShopNest</span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`nav-link ${activeTab === link.id ? 'active' : ''}`}
            >
              {link.name}
            </button>
          ))}
        </nav>

        {/* Global Search Bar */}
        <div className="navbar-search">
          <input
            type="text"
            placeholder="Search for products, brands and more..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="navbar-search-input"
          />
          <Search className="navbar-search-icon" size={17} />
        </div>

        {/* Action Icons */}
        <div className="navbar-actions">
          {/* Wishlist */}
          <button 
            className="action-icon-btn" 
            title="Wishlist" 
            onClick={onOpenWishlist}
            aria-label="Wishlist"
          >
            <Heart size={21} className={wishlistCount > 0 ? 'heart-has-items' : ''} />
            {wishlistCount > 0 && (
              <span className="badge-count wishlist-badge">{wishlistCount}</span>
            )}
          </button>

          {/* Cart */}
          <button 
            className="action-icon-btn" 
            title="Cart" 
            onClick={onOpenCart}
            aria-label="Shopping Cart"
          >
            <ShoppingCart size={21} />
            {cartCount > 0 && (
              <span className="badge-count cart-badge">{cartCount}</span>
            )}
          </button>

          {/* User Profile or Sign In Button */}
          {user ? (
            <div className="user-profile-menu-container" ref={dropdownRef}>
              <button 
                className="user-profile-trigger-btn"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                aria-label="User Account Menu"
              >
                <div className="user-avatar-wrap">
                  <div className="user-initial-badge">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                </div>
                <span className="user-firstname-text">{user.name.split(' ')[0]}</span>
                <ChevronDown size={14} className={`dropdown-chevron ${userDropdownOpen ? 'open' : ''}`} />
              </button>

              {userDropdownOpen && (
                <div className="user-dropdown-menu">
                  <div className="user-dropdown-header">
                    <p className="dropdown-user-name">{user.name}</p>
                    <p className="dropdown-user-email">{user.email}</p>
                    <div className="dropdown-role-badge">
                      <Shield size={12} />
                      <span>{user.role}</span>
                    </div>
                  </div>
                  <div className="dropdown-divider" />
                  <button
                    className="dropdown-item-btn logout-btn"
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                  >
                    <LogOut size={16} />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="navbar-signin-btn"
              onClick={onOpenAuthModal}
              title="Sign in or create account"
            >
              <UserIcon size={17} />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-dropdown-menu">
          <div className="mobile-search-wrap">
            <input
              type="text"
              placeholder="Search products, sellers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mobile-search-input"
            />
            <Search className="mobile-search-icon" size={18} />
          </div>
          <div className="mobile-nav-links">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`mobile-link ${activeTab === link.id ? 'active' : ''}`}
              >
                {link.name}
              </button>
            ))}

            <div className="mobile-nav-divider" />

            {user ? (
              <div className="mobile-user-card">
                <div className="mobile-user-info">
                  <div className="user-initial-badge sm">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <p className="mobile-user-name">{user.name}</p>
                    <p className="mobile-user-role">{user.role}</p>
                  </div>
                </div>
                <button
                  className="mobile-logout-btn"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut size={16} />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <button
                className="mobile-signin-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuthModal();
                }}
              >
                <UserIcon size={18} />
                <span>Sign In / Register</span>
              </button>
            )}

            <button 
              className="mobile-seller-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSellerModal();
              }}
            >
              Become a Seller
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
