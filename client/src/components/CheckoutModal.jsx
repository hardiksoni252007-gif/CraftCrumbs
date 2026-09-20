import React, { useState } from 'react';
import { X, ShieldCheck, CreditCard, Sparkles, CheckCircle, PackageCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const CheckoutModal = ({ isOpen, onClose, onOrderPlaced, onShowToast }) => {
  const { user, token } = useAuth();
  const {
    cartItems,
    subtotal,
    discount,
    shipping,
    tax,
    total,
    clearCart,
  } = useCart();

  const [shippingData, setShippingData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '+91 98765 43210',
    street: user?.address?.street || '42 Baker Street, artisan quarter',
    city: user?.address?.city || 'Mumbai',
    state: user?.address?.state || 'Maharashtra',
    postalCode: user?.address?.postalCode || '400050',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successOrder, setSuccessOrder] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setShippingData({ ...shippingData, [e.target.name]: e.target.value });
  };

  const handleVerify = async (paymentResponse, orderId) => {
    try {
      const verifyRes = await fetch('/api/payment/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          razorpay_order_id: paymentResponse.razorpay_order_id || orderId,
          razorpay_payment_id: paymentResponse.razorpay_payment_id || `pay_${Date.now()}`,
          razorpay_signature: paymentResponse.razorpay_signature || 'simulated_test_signature',
          items: cartItems.map((item) => ({
            productId: item._id,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: item.quantity,
          })),
          shippingAddress: shippingData,
          subtotal,
          tax,
          discount,
          shipping,
          totalAmount: total,
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) {
        throw new Error(verifyData.message || 'Payment verification failed');
      }

      // Order created successfully
      clearCart();
      setSuccessOrder(verifyData.order);
      if (onOrderPlaced) onOrderPlaced(verifyData.order);
      if (onShowToast) onShowToast('Order placed successfully! Baking begins soon. 🥖');
    } catch (err) {
      console.error('Verify error:', err);
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInitiatePayment = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      // 1. Create order on backend
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: total,
          currency: 'INR',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to initialize Razorpay checkout');
      }

      const { order, isSandbox } = data;

      // 2. Open Razorpay Checkout modal if loaded and not restricted
      if (window.Razorpay && !isSandbox) {
        const options = {
          key: order.key,
          amount: order.amount,
          currency: order.currency,
          name: 'Craft Crumbs Bakery',
          description: 'Handcrafted Artisanal Bakes',
          image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=200&q=80',
          order_id: order.id,
          handler: function (response) {
            handleVerify(response, order.id);
          },
          prefill: {
            name: shippingData.fullName,
            email: user?.email,
            contact: shippingData.phone,
          },
          notes: {
            address: `${shippingData.street}, ${shippingData.city}`,
          },
          theme: {
            color: '#C26328',
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          setErrorMessage(response.error.description || 'Payment was unsuccessful.');
          setLoading(false);
        });
        rzp.open();
      } else {
        // Simulated / Sandbox Razorpay Flow
        setTimeout(() => {
          handleVerify(
            {
              razorpay_order_id: order.id,
              razorpay_payment_id: `pay_rzp_mock_${Date.now()}`,
              razorpay_signature: 'rzp_valid_mock_signature',
            },
            order.id
          );
        }, 1000);
      }
    } catch (err) {
      console.error('Payment checkout error:', err);
      setErrorMessage(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content checkout-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close checkout modal"
        >
          <X size={20} />
        </button>

        {successOrder ? (
          /* Order Success Receipt */
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: '#E8F5E9',
                color: '#2E7D32',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <PackageCheck size={38} />
            </div>

            <h2 style={{ fontSize: '1.9rem', marginBottom: '0.4rem' }}>
              Order Confirmed & Paid!
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              Thank you, <strong>{shippingData.fullName}</strong>. Your artisanal order has been dispatched to our bakers.
            </p>

            <div
              style={{
                background: 'var(--bg-primary)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                textAlign: 'left',
                border: '1px solid var(--border-light)',
                marginBottom: '1.75rem',
              }}
            >
              <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>Order ID:</span>
                <span style={{ fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                  #{successOrder._id.slice(-8).toUpperCase()}
                </span>
              </div>
              <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>Razorpay Payment ID:</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-amber-primary)' }}>
                  {successOrder.paymentInfo.razorpayPaymentId}
                </span>
              </div>
              <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>Amount Paid:</span>
                <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>₹{successOrder.totalAmount}</span>
              </div>
              <div className="flex-between">
                <span style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>Delivery To:</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>
                  {successOrder.shippingAddress.street}, {successOrder.shippingAddress.city}
                </span>
              </div>
            </div>

            <button
              id="view-orders-btn-after-purchase"
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={onClose}
            >
              Back to Bakehouse Catalog
            </button>
          </div>
        ) : (
          /* Checkout Form */
          <>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <CreditCard size={20} color="var(--color-amber-primary)" />
                <h2 style={{ fontSize: '1.6rem' }}>Checkout & Razorpay Payment</h2>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Review delivery details and pay securely via Razorpay gateway.
              </p>
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
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleInitiatePayment}>
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    className="form-input"
                    value={shippingData.fullName}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    className="form-input"
                    value={shippingData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Delivery Street Address *</label>
                <input
                  type="text"
                  name="street"
                  required
                  placeholder="Street, Landmark, Apartment"
                  className="form-input"
                  value={shippingData.street}
                  onChange={handleChange}
                />
              </div>

              <div className="form-row-3">
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    className="form-input"
                    value={shippingData.city}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">State *</label>
                  <input
                    type="text"
                    name="state"
                    required
                    className="form-input"
                    value={shippingData.state}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">PIN Code *</label>
                  <input
                    type="text"
                    name="postalCode"
                    required
                    className="form-input"
                    value={shippingData.postalCode}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Order Summary Snapshot */}
              <div
                style={{
                  background: 'var(--bg-secondary)',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-lg)',
                  margin: '1.25rem 0 1.5rem',
                  border: '1px solid var(--border-light)',
                }}
              >
                <div
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    color: 'var(--color-amber-primary)',
                    marginBottom: '0.75rem',
                  }}
                >
                  Order Summary ({cartItems.length} items)
                </div>

                <div className="flex-between" style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  <span>Items Subtotal:</span>
                  <span>₹{subtotal}</span>
                </div>

                {discount > 0 && (
                  <div className="flex-between" style={{ fontSize: '0.88rem', color: '#2E7D32', marginBottom: '0.35rem' }}>
                    <span>Artisanal Discount:</span>
                    <span>-₹{discount}</span>
                  </div>
                )}

                <div className="flex-between" style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  <span>Delivery & Handling:</span>
                  <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>

                <div className="flex-between" style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
                  <span>Estimated 5% GST:</span>
                  <span>₹{tax}</span>
                </div>

                <div
                  className="flex-between"
                  style={{
                    paddingTop: '0.65rem',
                    borderTop: '1px dashed var(--border-light)',
                    fontSize: '1.15rem',
                    fontWeight: 700,
                  }}
                >
                  <span>Payable Amount:</span>
                  <span style={{ color: 'var(--color-amber-primary)', fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}>
                    ₹{total}
                  </span>
                </div>
              </div>

              {/* Secure Payment Guarantee */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.8rem',
                  color: 'var(--text-subtle)',
                  marginBottom: '1.25rem',
                }}
              >
                <ShieldCheck size={18} color="#2E7D32" />
                <span>256-bit encrypted transaction processed securely via Razorpay</span>
              </div>

              <button
                type="submit"
                id="pay-with-razorpay-btn"
                disabled={loading}
                className="btn-primary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '1rem',
                  fontSize: '1.05rem',
                }}
              >
                <Sparkles size={18} />
                <span>{loading ? 'Connecting to Razorpay...' : `Pay ₹${total} via Razorpay`}</span>
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
