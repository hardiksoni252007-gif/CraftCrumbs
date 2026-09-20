import React, { useState, useEffect } from 'react';
import { Package, Clock, Calendar, CheckCircle2, ChevronRight, ShoppingBag, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const OrdersView = ({ onBackToCatalog }) => {
  const { token, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/orders/my-orders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch orders');
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2>Please Sign In</h2>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0 1.5rem' }}>
          You must be logged in to view your past orders and receipts.
        </p>
        <button className="btn-primary" onClick={onBackToCatalog}>
          Return to Store
        </button>
      </div>
    );
  }

  return (
    <div className="container orders-page">
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '0.25rem' }}>My Orders</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Track your artisanal baked goods delivery and view official Razorpay payment receipts.
          </p>
        </div>
        <button className="btn-secondary" onClick={onBackToCatalog}>
          <ShoppingBag size={18} />
          <span>Back to Catalog</span>
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          <p>Loading your orders...</p>
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: '#C62828' }}>
          <p>{error}</p>
        </div>
      ) : orders.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            background: '#FFFFFF',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-light)',
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'var(--color-amber-light)',
              color: 'var(--color-amber-primary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <Package size={34} />
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No orders placed yet</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '360px', margin: '0 auto 1.5rem' }}>
            You haven't ordered any fresh bakes yet. Treat yourself to our sourdough and pastry selections!
          </p>
          <button className="btn-primary" onClick={onBackToCatalog}>
            Browse Artisanal Catalog
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map((order) => {
            const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div>
                    <div className="order-id">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.8rem',
                        color: 'var(--text-subtle)',
                        marginTop: '0.2rem',
                      }}
                    >
                      <Calendar size={13} />
                      <span>{formattedDate}</span>
                      <span>•</span>
                      <span>Razorpay: {order.paymentInfo?.razorpayPaymentId || 'Paid'}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span className="order-status-badge">
                      <CheckCircle2 size={13} style={{ display: 'inline', marginRight: '4px' }} />
                      {order.orderStatus}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.35rem',
                        fontWeight: 700,
                        color: 'var(--text-main)',
                      }}
                    >
                      ₹{order.totalAmount}
                    </span>
                  </div>
                </div>

                {/* Items List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem' }}>
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '0.5rem 0',
                        borderBottom: idx !== order.items.length - 1 ? '1px dashed var(--border-light)' : 'none',
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: '10px',
                          objectFit: 'cover',
                          border: '1px solid var(--border-light)',
                        }}
                      />
                      <div style={{ flexGrow: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-main)' }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Qty: {item.quantity} × ₹{item.price}
                        </div>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                        ₹{item.quantity * item.price}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery Info */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    background: 'var(--bg-primary)',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.825rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  <MapPin size={15} color="var(--color-amber-primary)" />
                  <span>
                    Delivering to: <strong>{order.shippingAddress.fullName}</strong> — {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
