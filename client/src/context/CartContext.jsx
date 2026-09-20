import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('craft_crumbs_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState(null);

  useEffect(() => {
    localStorage.setItem('craft_crumbs_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, qty = 1) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item._id === product._id);
      if (existing) {
        return prevItems.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      } else {
        return [
          ...prevItems,
          {
            _id: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            weight: product.weight,
            quantity: qty,
          },
        ];
      }
    });
  };

  const updateQuantity = (productId, qty) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === productId ? { ...item, quantity: qty } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedPromo(null);
  };

  const applyPromoCode = (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'CRUMB10') {
      setAppliedPromo({ code: 'CRUMB10', rate: 0.10, label: '10% Artisanal Welcome Discount' });
      return { success: true, message: 'Promo code CRUMB10 applied (10% off)!' };
    } else if (clean === 'FREESHIP') {
      setAppliedPromo({ code: 'FREESHIP', rate: 0, freeShipping: true, label: 'Complimentary Free Delivery' });
      return { success: true, message: 'Free shipping promo applied!' };
    } else {
      return { success: false, message: 'Invalid promo code. Try "CRUMB10" or "FREESHIP".' };
    }
  };

  // Calculations
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cartItems]);

  const discount = useMemo(() => {
    if (!appliedPromo) return 0;
    if (appliedPromo.rate) return Math.round(subtotal * appliedPromo.rate);
    return 0;
  }, [subtotal, appliedPromo]);

  const baseShipping = subtotal > 600 || (appliedPromo && appliedPromo.freeShipping) || cartItems.length === 0 ? 0 : 60;

  const tax = useMemo(() => {
    return Math.round((subtotal - discount) * 0.05); // 5% GST
  }, [subtotal, discount]);

  const total = useMemo(() => {
    if (cartItems.length === 0) return 0;
    return Math.max(0, subtotal - discount + tax + baseShipping);
  }, [subtotal, discount, tax, baseShipping, cartItems]);

  const totalItems = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        appliedPromo,
        applyPromoCode,
        subtotal,
        discount,
        shipping: baseShipping,
        tax,
        total,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
