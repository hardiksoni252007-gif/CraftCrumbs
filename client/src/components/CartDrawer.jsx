import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, Tag, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartDrawer = ({ onProceedToCheckout }) => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    discount,
    shipping,
    tax,
    total,
    appliedPromo,
    applyPromoCode,
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const [promoMessage, setPromoMessage] = useState('');

  if (!isCartOpen) return null;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!inputCode) return;
    const res = applyPromoCode(inputCode);
    setPromoMessage(res.message);
  };

  return (
    <div
      className="cart-drawer-overlay"
      onClick={() => setIsCartOpen(false)}
    >
      <div
        className="cart-drawer"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="cart-drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShoppingBag size={20} color="var(--color-amber-primary)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              Your Bake Basket ({cartItems.length})
            </h2>
          </div>
          <button
            id="close-cart-btn"
            className="btn-icon"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Cart Item List */}
        {cartItems.length === 0 ? (
          <div
            style={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: 'var(--color-amber-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-amber-primary)',
                marginBottom: '1rem',
              }}
            >
              <ShoppingBag size={32} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
              Your basket is empty
            </h3>
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.9rem',
                marginBottom: '1.5rem',
                maxWidth: '240px',
              }}
            >
              The ovens are warm! Fill your cart with fresh rustic loaves and flaky pastries.
            </p>
            <button
              className="btn-primary"
              onClick={() => setIsCartOpen(false)}
            >
              Explore Bakery
            </button>
          </div>
        ) : (
          <>
            <div className="cart-drawer-items">
              {cartItems.map((item) => (
                <div key={item._id} className="cart-item-card">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-img"
                  />
                  <div className="cart-item-info">
                    <div className="flex-between">
                      <div className="cart-item-title">{item.name}</div>
                      <button
                        className="btn-icon"
                        style={{ width: 28, height: 28, border: 'none' }}
                        onClick={() => removeFromCart(item._id)}
                        title="Remove item"
                      >
                        <Trash2 size={15} color="var(--text-subtle)" />
                      </button>
                    </div>

                    <div className="cart-item-price">₹{item.price}</div>

                    <div className="flex-between" style={{ marginTop: '0.4rem' }}>
                      <div className="cart-qty-ctrl">
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="qty-val">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer / Summary */}
            <div className="cart-drawer-footer">
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="promo-row">
                <input
                  type="text"
                  placeholder="Promo (e.g. CRUMB10)"
                  className="promo-input"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                />
                <button type="submit" className="btn-secondary btn-sm">
                  Apply
                </button>
              </form>

              {promoMessage && (
                <div
                  style={{
                    fontSize: '0.78rem',
                    color: appliedPromo ? '#2E7D32' : '#C62828',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}
                >
                  <Tag size={12} />
                  <span>{promoMessage}</span>
                </div>
              )}

              {/* Cost Breakdown */}
              <div className="cart-summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>

              {discount > 0 && (
                <div
                  className="cart-summary-row"
                  style={{ color: '#2E7D32', fontWeight: 600 }}
                >
                  <span>Discount ({appliedPromo?.code})</span>
                  <span>-₹{discount}</span>
                </div>
              )}

              <div className="cart-summary-row">
                <span>Delivery Charges</span>
                <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>

              <div className="cart-summary-row">
                <span>Estimated GST (5%)</span>
                <span>₹{tax}</span>
              </div>

              <div className="cart-summary-row total">
                <span>Total Amount</span>
                <span
                  style={{
                    color: 'var(--color-amber-primary)',
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.4rem',
                  }}
                >
                  ₹{total}
                </span>
              </div>

              <button
                id="checkout-drawer-btn"
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '0.9rem' }}
                onClick={() => {
                  setIsCartOpen(false);
                  onProceedToCheckout();
                }}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
