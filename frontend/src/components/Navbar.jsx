import React from 'react';
import { 
  ShoppingBag, 
  Search, 
  Heart, 
  ShoppingCart, 
  Menu, 
  X 
} from 'lucide-react';

export default function Navbar({ 
  cartCount, 
  wishlistCount, 
  onOpenCart, 
  onOpenWishlist, 
  searchQuery, 
  setSearchQuery,
  activeTab,
  setActiveTab,
  onOpenSellerModal
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

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

          {/* User Profile Avatar */}
          <div className="user-avatar-wrap" title="Account / Profile">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"
              alt="User profile avatar"
              className="user-avatar-img"
            />
          </div>

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
