import React, { useState } from 'react';
import { X, Lock, Mail, User, Eye, EyeOff, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose, onShowToast }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    setError('');
  };

  const handleClose = () => {
    setError('');
    setName('');
    setEmail('');
    setPassword('');
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const user = await login(email, password);
        if (onShowToast) onShowToast(`Welcome back, ${user.name || 'User'}!`);
      } else {
        if (!name.trim()) throw new Error('Please enter your full name');
        if (password.length < 6) throw new Error('Password must be at least 6 characters');
        const user = await register(name, email, password);
        if (onShowToast) onShowToast(`Account created! Welcome to ShopNest, ${user.name}!`);
      }
      handleClose();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Authentication failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Demo auto-fill for testing admin
  const fillAdminCredentials = () => {
    setMode('login');
    setEmail('admin@vendora.com');
    setPassword('Admin@12345');
    setError('');
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-dialog auth-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={handleClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="auth-modal-content">
          {/* Header */}
          <div className="auth-modal-header">
            <div className="auth-badge">
              <Sparkles size={14} />
              <span>ShopNest Account</span>
            </div>
            <h2 className="auth-title">
              {mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
            </h2>
            <p className="auth-subtitle">
              {mode === 'login'
                ? 'Sign in to access your orders, wishlist, and profile.'
                : 'Join our marketplace to discover unique artisanal products.'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
              onClick={() => handleModeSwitch('login')}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
              onClick={() => handleModeSwitch('register')}
            >
              Register
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="auth-error-box">
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            {mode === 'register' && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="input-with-icon">
                  <User size={18} className="input-icon" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder={mode === 'register' ? 'At least 6 characters' : 'Enter your password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="auth-submit-btn"
            >
              {loading ? (
                <span>Please wait...</span>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          {/* Demo Admin Auto-fill Button */}
          <div className="auth-demo-section">
            <button
              type="button"
              className="demo-autofill-btn"
              onClick={fillAdminCredentials}
              title="Click to quickly fill admin credentials"
            >
              <ShieldCheck size={15} />
              <span>Quick Demo: Fill Admin Account</span>
            </button>
          </div>

          {/* Footer toggle prompt */}
          <div className="auth-modal-footer">
            {mode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  className="auth-link-btn"
                  onClick={() => handleModeSwitch('register')}
                >
                  Register now
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  className="auth-link-btn"
                  onClick={() => handleModeSwitch('login')}
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
