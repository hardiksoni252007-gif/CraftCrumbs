import React from 'react';
import { ShoppingBag, User, LogOut, Package, Search, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const Navbar = ({
  onOpenAuth,
  onOpenOrders,
  searchQuery,
  setSearchQuery,
  currentView,
  setCurrentView,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems, setIsCartOpen } = useCart();

  return (
    <header className="navbar">
      <div className="container nav-inner">
        {/* Brand Logo with actual GitHub repo image */}
        <div
          className="brand-logo"
          style={{ cursor: 'pointer' }}
          onClick={() => setCurrentView('catalog')}
        >
          <img
            src="/craft_crumbs_logo.jpeg"
            alt="Craft Crumbs Crochet Corner Logo"
            style={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              objectFit: 'cover',
              boxShadow: '0 4px 12px rgba(194, 99, 40, 0.25)',
              border: '2px solid #FFFFFF',
            }}
          />
          <div>
            <span>Craft Crumbs</span>
            <span className="brand-subtitle">Crochet Corner & Crafts</span>
          </div>
        </div>

        {/* Search Bar */}
        {currentView === 'catalog' && (
          <div className="search-bar-wrap">
            <Search className="search-icon-pos" size={18} />
            <input
              type="text"
              id="search-products-input"
              className="search-input"
              placeholder="Search flowers, keychains, scrunchies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}

        {/* Action Controls */}
        <div className="nav-actions">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                id="my-orders-nav-btn"
                className={`btn-secondary btn-sm ${currentView === 'orders' ? 'active' : ''}`}
                onClick={() => setCurrentView(currentView === 'orders' ? 'catalog' : 'orders')}
                title="View My Orders"
              >
                <Package size={16} />
                <span>{currentView === 'orders' ? 'Craft Catalog' : 'My Orders'}</span>
              </button>

              <div className="user-chip" title={user.email}>
                <div className="user-avatar">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'C'}
                </div>
                <span>{user.name.split(' ')[0]}</span>
              </div>

              <button
                id="logout-btn"
                className="btn-icon"
                onClick={logout}
                title="Log Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              id="open-auth-btn"
              className="btn-secondary"
              onClick={onOpenAuth}
            >
              <User size={18} />
              <span>Sign In / Register</span>
            </button>
          )}

          {/* Cart Button with Count Badge */}
          <button
            id="cart-drawer-toggle"
            className="btn-primary cart-btn-badge"
            onClick={() => setIsCartOpen(true)}
            aria-label="Shopping Cart"
          >
            <ShoppingBag size={19} />
            <span style={{ fontWeight: 600 }}>Cart</span>
            {totalItems > 0 && <span className="cart-counter">{totalItems}</span>}
          </button>
        </div>
      </div>
    </header>
  );
};
