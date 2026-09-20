import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal = ({ isOpen, onClose, onShowToast }) => {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const { login, register, loading } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
  });

  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (mode === 'login') {
      const res = await login(formData.email, formData.password);
      if (res.success) {
        if (onShowToast) onShowToast(`Welcome back, ${res.user.name}! 🥐`);
        onClose();
      } else {
        setErrorMessage(res.error || 'Failed to sign in.');
      }
    } else {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
        },
      };

      const res = await register(payload);
      if (res.success) {
        if (onShowToast) onShowToast(`Welcome to the Craft Crumbs family, ${res.user.name}! 🎉`);
        onClose();
      } else {
        setErrorMessage(res.error || 'Failed to create customer account.');
      }
    }
  };

  const handleDemoFill = () => {
    setFormData({
      ...formData,
      email: 'customer@craftcrumbs.com',
      password: 'password123',
    });
    setMode('login');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: mode === 'login' ? '420px' : '520px', padding: '2.25rem' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close authentication modal"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '14px',
              background: 'linear-gradient(135deg, var(--color-amber-primary) 0%, var(--color-golden) 100%)',
              color: '#FFFFFF',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.75rem',
            }}
          >
            <Sparkles size={24} />
          </div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '0.35rem' }}>
            {mode === 'login' ? 'Customer Sign In' : 'Create Your Customer ID'}
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            {mode === 'login'
              ? 'Access your artisanal orders and saved bake baskets'
              : 'Join Craft Crumbs for artisanal treats delivered fresh'}
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            background: 'var(--bg-secondary)',
            padding: '4px',
            borderRadius: 'var(--radius-pill)',
            marginBottom: '1.5rem',
          }}
        >
          <button
            type="button"
            id="auth-tab-login"
            style={{
              padding: '0.5rem',
              borderRadius: 'var(--radius-pill)',
              fontWeight: 600,
              fontSize: '0.875rem',
              background: mode === 'login' ? '#FFFFFF' : 'transparent',
              color: mode === 'login' ? 'var(--text-main)' : 'var(--text-muted)',
              boxShadow: mode === 'login' ? 'var(--shadow-sm)' : 'none',
            }}
            onClick={() => setMode('login')}
          >
            Sign In
          </button>
          <button
            type="button"
            id="auth-tab-register"
            style={{
              padding: '0.5rem',
              borderRadius: 'var(--radius-pill)',
              fontWeight: 600,
              fontSize: '0.875rem',
              background: mode === 'register' ? '#FFFFFF' : 'transparent',
              color: mode === 'register' ? 'var(--text-main)' : 'var(--text-muted)',
              boxShadow: mode === 'register' ? 'var(--shadow-sm)' : 'none',
            }}
            onClick={() => setMode('register')}
          >
            Create Customer ID
          </button>
        </div>

        {errorMessage && (
          <div
            style={{
              background: '#FFEBEE',
              color: '#C62828',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
              border: '1px solid rgba(198, 40, 40, 0.2)',
            }}
          >
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="name"
                  id="register-name-input"
                  required
                  placeholder="e.g. Aria Montgomery"
                  className="form-input"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              name="email"
              id="auth-email-input"
              required
              placeholder="aria@example.com"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <input
              type="password"
              name="password"
              id="auth-password-input"
              required
              placeholder="••••••••"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {mode === 'register' && (
            <>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+91 98765 43210"
                  className="form-input"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Street Address</label>
                <input
                  type="text"
                  name="street"
                  placeholder="Apartment, Street Name"
                  className="form-input"
                  value={formData.street}
                  onChange={handleChange}
                />
              </div>

              <div className="form-row-3">
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    className="form-input"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    className="form-input"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    placeholder="PIN Code"
                    className="form-input"
                    value={formData.postalCode}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            id="auth-submit-btn"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '0.75rem', padding: '0.85rem' }}
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Complete Registration'}
          </button>
        </form>

        {/* Quick Demo Credentials */}
        <div
          style={{
            marginTop: '1.5rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border-light)',
            textAlign: 'center',
          }}
        >
          <button
            type="button"
            className="btn-secondary btn-sm"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={handleDemoFill}
          >
            <CheckCircle2 size={14} color="var(--color-amber-primary)" />
            <span>Use Demo Customer Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};
