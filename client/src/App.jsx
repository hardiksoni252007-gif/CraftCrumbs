import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { CheckoutModal } from './components/CheckoutModal';
import { OrdersView } from './components/OrdersView';
import { Toast } from './components/Toast';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';
import { Sparkles, Heart, ShieldCheck, Truck, PackageCheck, Scissors } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Crochet Flowers & Bouquets',
  'Handmade Keychains',
  'Hairbands & Accessories',
  'Crochet Scrunchies',
  'Custom Gift Sets',
];

const CRAFT_TAGS = ['All', 'Handmade', '100% Cotton Yarn', 'Everlasting', 'Amigurumi', 'Customizable'];

export function App() {
  const { isAuthenticated } = useAuth();
  const { cartItems } = useCart();

  // State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState('catalog'); // 'catalog' | 'orders'

  // Modals & UI
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const catalogRef = useRef(null);

  // Trigger Toast Notification
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Fetch Products
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (selectedCategory !== 'All') params.append('category', selectedCategory);
        if (selectedTag !== 'All') params.append('dietary', selectedTag);
        if (searchQuery) params.append('search', searchQuery);
        if (sortBy) params.append('sort', sortBy);

        const res = await fetch(`/api/products?${params.toString()}`);
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error('Error fetching catalog:', err);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchCatalog, 200);
    return () => clearTimeout(timeoutId);
  }, [selectedCategory, selectedTag, searchQuery, sortBy]);

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      showToast('Please sign in or create an account to proceed to payment.');
      setIsAuthModalOpen(true);
    } else {
      setIsCheckoutModalOpen(true);
    }
  };

  const handleScrollToCatalog = () => {
    setCurrentView('catalog');
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="app-root">
      {/* Navigation */}
      <Navbar
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenOrders={() => setCurrentView('orders')}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      {/* Main View Router */}
      {currentView === 'orders' ? (
        <OrdersView onBackToCatalog={() => setCurrentView('catalog')} />
      ) : (
        <main>
          {/* Hero Presentation */}
          <HeroBanner onExploreClick={handleScrollToCatalog} />

          {/* Catalog Section */}
          <section ref={catalogRef} className="container catalog-section">
            {/* Filter Bar */}
            <div className="filter-bar">
              {/* Category Tabs */}
              <div className="category-tabs">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    id={`category-tab-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                    className={`category-tab ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Secondary Filter Controls */}
              <div className="filter-controls">
                <div className="dietary-pills">
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-subtle)', marginRight: '4px' }}>
                    Filter by:
                  </span>
                  {CRAFT_TAGS.map((tag) => (
                    <button
                      key={tag}
                      className={`diet-pill ${selectedTag === tag ? 'active' : ''}`}
                      onClick={() => setSelectedTag(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontSize: '0.825rem', color: 'var(--text-subtle)' }}>Sort by:</span>
                  <select
                    id="sort-products-select"
                    className="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">Latest Creations</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Catalog Grid */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: '1.1rem' }}>Knitting the crochet catalog...</p>
              </div>
            ) : products.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '4rem 2rem',
                  background: '#FFFFFF',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--border-light)',
                }}
              >
                <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>
                  No crochet items found
                </h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  Try resetting your category or tag filters.
                </p>
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedTag('All');
                    setSearchQuery('');
                  }}
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="product-grid">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onQuickView={(p) => setQuickViewProduct(p)}
                    onShowToast={showToast}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Handcrafted Promise Strip */}
          <section
            style={{
              background: 'linear-gradient(135deg, #241A15 0%, #3B2A22 100%)',
              color: '#FFFFFF',
              padding: '4rem 0',
              marginTop: '3rem',
            }}
          >
            <div className="container">
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '2.5rem',
                  textAlign: 'center',
                }}
              >
                <div>
                  <Scissors size={32} color="var(--color-honey)" style={{ margin: '0 auto 0.75rem' }} />
                  <h4 style={{ color: '#FFFFFF', fontSize: '1.1rem', marginBottom: '0.35rem' }}>
                    100% Handcrafted
                  </h4>
                  <p style={{ color: '#D2C4BC', fontSize: '0.875rem' }}>
                    Each flower, keychain, and scrunchy is hand-stitched with love and dedication.
                  </p>
                </div>

                <div>
                  <Truck size={32} color="var(--color-honey)" style={{ margin: '0 auto 0.75rem' }} />
                  <h4 style={{ color: '#FFFFFF', fontSize: '1.1rem', marginBottom: '0.35rem' }}>
                    Pan-India Safe Delivery
                  </h4>
                  <p style={{ color: '#D2C4BC', fontSize: '0.875rem' }}>
                    Packed securely in crush-proof gift boxes so your flowers arrive pristine.
                  </p>
                </div>

                <div>
                  <ShieldCheck size={32} color="var(--color-honey)" style={{ margin: '0 auto 0.75rem' }} />
                  <h4 style={{ color: '#FFFFFF', fontSize: '1.1rem', marginBottom: '0.35rem' }}>
                    Razorpay Verified Payments
                  </h4>
                  <p style={{ color: '#D2C4BC', fontSize: '0.875rem' }}>
                    Seamless UPI, Cards, Netbanking, and Wallets with bank-grade encryption.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* Footer */}
      <footer
        style={{
          background: '#1A110D',
          color: '#A6968C',
          padding: '3.5rem 0 2rem',
          fontSize: '0.875rem',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1.5rem',
              paddingBottom: '2rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img
                src="/craft_crumbs_logo.jpeg"
                alt="Craft Crumbs"
                style={{ width: 48, height: 48, borderRadius: '12px', objectFit: 'cover' }}
              />
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    marginBottom: '0.25rem',
                  }}
                >
                  Craft Crumbs Crochet Corner
                </div>
                <div>Handmade crochet flowers, keychains, scrunchies & bespoke yarn gifts.</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '2rem' }}>
              <span style={{ cursor: 'pointer' }} onClick={() => setCurrentView('catalog')}>Catalog</span>
              <span style={{ cursor: 'pointer' }} onClick={() => setCurrentView('orders')}>My Orders</span>
              <span style={{ cursor: 'pointer' }} onClick={() => setIsAuthModalOpen(true)}>Customer Portal</span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '1.5rem',
              fontSize: '0.78rem',
            }}
          >
            <div>© 2025 Craft Crumbs Crochet Corner. Razorpay Integrated E-Commerce.</div>
            <div>Built with MERN Stack • React 19 • Express • MongoDB</div>
          </div>
        </div>
      </footer>

      {/* Modals and Drawers */}
      <ProductModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onShowToast={showToast}
      />

      <CartDrawer
        onProceedToCheckout={handleProceedToCheckout}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onShowToast={showToast}
      />

      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        onOrderPlaced={() => setCurrentView('orders')}
        onShowToast={showToast}
      />

      {/* Floating Toast Notification */}
      <Toast message={toastMessage} />
    </div>
  );
}

export default App;
