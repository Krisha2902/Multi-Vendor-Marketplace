import React, { useState } from 'react';
import { ShoppingBag, Send } from 'lucide-react';

export default function Footer({ onSubscribe, onNavClick }) {
  const [email, setEmail] = useState('');

  const handleSubscribeSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }
    if (onSubscribe) onSubscribe(email);
    setEmail('');
  };

  return (
    <footer className="footer-root">
      <div className="footer-top-container">
        {/* Brand & Newsletter Column */}
        <div className="footer-col brand-col">
          <div className="footer-logo-row">
            <div className="footer-logo-icon">
              <ShoppingBag size={19} color="#ffffff" />
            </div>
            <span className="footer-brand-title">ShopNest</span>
          </div>

          <p className="footer-subscribe-desc">
            Email subscribe to our marketplace
          </p>

          <form className="footer-subscribe-form" onSubmit={handleSubscribeSubmit}>
            <input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="footer-email-input"
              required
            />
            <button type="submit" className="footer-submit-btn" aria-label="Subscribe">
              <Send size={15} />
            </button>
          </form>
        </div>

        {/* Links Column 1 */}
        <div className="footer-col links-col">
          <ul className="footer-link-list">
            <li><button onClick={() => onNavClick && onNavClick('home')}>Home</button></li>
            <li><button onClick={() => onNavClick && onNavClick('shop')}>Shop</button></li>
            <li><button onClick={() => onNavClick && onNavClick('categories')}>Categories</button></li>
            <li><button onClick={() => onNavClick && onNavClick('sellers')}>Sellers</button></li>
          </ul>
        </div>

        {/* Links Column 2 */}
        <div className="footer-col links-col">
          <ul className="footer-link-list">
            <li><button onClick={() => onNavClick && onNavClick('categories')}>Categories</button></li>
            <li><button onClick={() => onNavClick && onNavClick('sellers')}>Sellers</button></li>
            <li><button onClick={() => onNavClick && onNavClick('about')}>About</button></li>
          </ul>
        </div>

        {/* Payment & Social Column */}
        <div className="footer-col payment-social-col">
          {/* Payment Method Badges */}
          <div className="payment-badges-row">
            <span className="payment-chip visa">VISA</span>
            <span className="payment-chip mastercard">
              <span className="mc-circle-red"></span>
              <span className="mc-circle-orange"></span>
            </span>
            <span className="payment-chip amex">AMEX</span>
            <span className="payment-chip discover">DISCOVER</span>
          </div>

          {/* Social Icons */}
          <div className="social-icons-row">
            {/* Facebook */}
            <a href="#facebook" className="social-circle-link" aria-label="Facebook">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            {/* X (Twitter) */}
            <a href="#x" className="social-circle-link" aria-label="X (Twitter)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            {/* LinkedIn */}
            <a href="#linkedin" className="social-circle-link" aria-label="LinkedIn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
            {/* YouTube */}
            <a href="#youtube" className="social-circle-link" aria-label="YouTube">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#28271e"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom-bar">
        <div className="footer-bottom-inner">
          <p className="copyright-text">Copyright © 2024. All rights reserved.</p>
          <p className="powered-by-text">Powered by : <span>ShopNest</span></p>
        </div>
      </div>
    </footer>
  );
}
