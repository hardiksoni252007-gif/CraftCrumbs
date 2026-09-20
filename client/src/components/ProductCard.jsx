import React from 'react';
import { Plus, Star, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const ProductCard = ({ product, onQuickView, onShowToast }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    if (onShowToast) {
      onShowToast(`Added "${product.name}" to your cart! 🥐`);
    }
  };

  const getDietaryClass = (tag) => {
    if (tag === 'Organic') return 'badge-organic';
    if (tag === 'Vegan') return 'badge-vegan';
    if (tag === 'Gluten-Free') return 'badge-gf';
    if (tag === 'Eggless') return 'badge-eggless';
    return 'badge-tag';
  };

  return (
    <div
      id={`product-card-${product._id}`}
      className="product-card"
      onClick={() => onQuickView(product)}
    >
      <div className="card-image-wrap">
        <img
          src={product.image}
          alt={product.name}
          className="card-image"
          loading="lazy"
        />

        <div className="card-badge-container">
          {product.featured && <span className="featured-pill">Signature Bake</span>}
          {product.dietaryTags && product.dietaryTags.slice(0, 2).map((tag) => (
            <span key={tag} className={`badge ${getDietaryClass(tag)}`}>
              {tag}
            </span>
          ))}
        </div>

        <div className="card-rating">
          <Star size={13} fill="#E5A84B" color="#E5A84B" />
          <span>{product.rating}</span>
          <span style={{ color: 'var(--text-subtle)', fontSize: '0.72rem' }}>
            ({product.reviewCount})
          </span>
        </div>
      </div>

      <div className="card-content">
        <div className="card-category">{product.category}</div>
        <h3 className="card-title">{product.name}</h3>
        <p className="card-desc">{product.description}</p>

        <div className="card-footer">
          <div>
            <span className="card-price">₹{product.price}</span>
            <span className="card-weight">/ {product.weight}</span>
          </div>

          <button
            id={`add-to-cart-btn-${product._id}`}
            className="add-cart-btn"
            onClick={handleAddToCart}
            aria-label={`Add ${product.name} to cart`}
          >
            <Plus size={16} />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
