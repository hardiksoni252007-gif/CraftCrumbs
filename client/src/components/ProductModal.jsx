import React, { useState } from 'react';
import { X, Star, Plus, Minus, CheckCircle, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const ProductModal = ({ product, onClose, onShowToast }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    if (onShowToast) {
      onShowToast(`Added ${quantity}x "${product.name}" to your cart! 🥐`);
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content product-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close product modal"
        >
          <X size={20} />
        </button>

        {/* Product Image */}
        <div style={{ position: 'relative' }}>
          <img
            src={product.image}
            alt={product.name}
            className="product-modal-img"
          />
        </div>

        {/* Product Details */}
        <div className="product-modal-body">
          <div className="card-category">{product.category}</div>
          <h2 style={{ fontSize: '1.85rem', marginBottom: '0.5rem' }}>
            {product.name}
          </h2>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.9rem',
                fontWeight: 700,
              }}
            >
              <Star size={16} fill="#E5A84B" color="#E5A84B" />
              <span>{product.rating}</span>
            </div>
            <span style={{ color: 'var(--text-subtle)' }}>•</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              {product.reviewCount} customer reviews
            </span>
            <span style={{ color: 'var(--text-subtle)' }}>•</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Weight: {product.weight}
            </span>
          </div>

          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.95rem',
              lineHeight: 1.6,
              marginBottom: '1.25rem',
            }}
          >
            {product.description}
          </p>

          {/* Ingredients */}
          {product.ingredients && product.ingredients.length > 0 && (
            <div style={{ marginBottom: '1.25rem' }}>
              <div
                style={{
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: 'var(--text-subtle)',
                  marginBottom: '0.5rem',
                }}
              >
                Artisanal Ingredients
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {product.ingredients.map((ing) => (
                  <span
                    key={ing}
                    style={{
                      background: 'var(--bg-secondary)',
                      padding: '0.25rem 0.6rem',
                      borderRadius: 'var(--radius-pill)',
                      fontSize: '0.78rem',
                      color: 'var(--text-muted)',
                      border: '1px solid var(--border-light)',
                    }}
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Dietary Tags */}
          {product.dietaryTags && (
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {product.dietaryTags.map((tag) => (
                <span key={tag} className="badge badge-tag">
                  <CheckCircle size={12} color="#C26328" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Price & Quantity Controls */}
          <div
            style={{
              marginTop: 'auto',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--border-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
            }}
          >
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>Total Price</div>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.6rem',
                  fontWeight: 700,
                  color: 'var(--text-main)',
                }}
              >
                ₹{product.price * quantity}
              </div>
            </div>

            {/* Stepper */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'var(--bg-secondary)',
                padding: '0.35rem 0.6rem',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--border-light)',
              }}
            >
              <button
                className="qty-btn"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="qty-val">{quantity}</span>
              <button
                className="qty-btn"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>

            <button
              id="modal-add-cart-btn"
              className="btn-primary"
              onClick={handleAddToCart}
            >
              <ShoppingBag size={18} />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
