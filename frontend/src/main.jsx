import React, { Component, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('App Crash Error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', maxWidth: '600px', margin: '3rem auto', fontFamily: 'sans-serif', background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '12px' }}>
          <h2 style={{ color: '#9f1239', marginBottom: '0.5rem' }}>An error occurred while loading the page</h2>
          <p style={{ color: '#4c0519', fontSize: '0.9rem', marginBottom: '1rem' }}>{this.state.error?.message || 'Unknown error'}</p>
          <button
            onClick={() => {
              try { localStorage.clear(); } catch {}
              window.location.reload();
            }}
            style={{ padding: '0.55rem 1.1rem', backgroundColor: '#e11d48', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Clear Cache & Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
);
