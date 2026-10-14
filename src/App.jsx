import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import MobileBottomNav from './components/MobileBottomNav';
import HeroBanner from './components/HeroBanner';
import FlashSaleBanner from './components/FlashSaleBanner';
import FilterBar from './components/FilterBar';
import ProductCard from './components/ProductCard';
import ProductSpecsModal from './components/ProductSpecsModal';
import AddProductModal from './components/AddProductModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderConfirmationModal from './components/OrderConfirmationModal';
import OrderHistoryModal from './components/OrderHistoryModal';
import InstallPwaModal from './components/InstallPwaModal';
import FeedbackModal from './components/FeedbackModal';
import UserProfileModal from './components/UserProfileModal';
import IntroSplashOverlay from './components/IntroSplashOverlay';
import { getTimeOfDay, THEMES } from './utils/theme';
import { CATEGORIES } from './data/defaultProducts';
import { 
  loadStoredProducts, 
  saveStoredProducts, 
  loadStoredCart, 
  saveStoredCart, 
  loadStoredOrders, 
  saveStoredOrders,
  loadStoredCurrency, 
  saveStoredCurrency,
  loadStoredUserProfile,
  saveStoredUserProfile
} from './utils/storage';
import { 
  Leaf, 
  ShieldCheck, 
  CheckCircle2,
  Zap
} from 'lucide-react';

export default function App() {
  // Time-of-day Dynamic Theme State (Auto-detects from client local time on load)
  const [timePeriod, setTimePeriod] = useState(getTimeOfDay);
  const currentTheme = THEMES[timePeriod] || THEMES.evening;

  const handleCycleTheme = () => {
    setTimePeriod(prev => {
      if (prev === 'morning') return 'afternoon';
      if (prev === 'afternoon') return 'evening';
      return 'morning';
    });
  };

  // Products, Cart, Orders, Currency & User Profile States initialized from localStorage
  const [products, setProducts] = useState(loadStoredProducts);
  const [cart, setCart] = useState(loadStoredCart);
  const [orders, setOrders] = useState(loadStoredOrders);
  const [currency, setCurrency] = useState(loadStoredCurrency);
  const [userProfile, setUserProfile] = useState(loadStoredUserProfile);

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minRating, setMinRating] = useState(0);
  const [selectedCertifications, setSelectedCertifications] = useState([]);
  const [sortBy, setSortBy] = useState('featured');
  const [mobileActiveTab, setMobileActiveTab] = useState('catalog');
  const [only30MinFilter, setOnly30MinFilter] = useState(false);

  // Dynamically compute all unique categories from default list + products
  const allCategories = useMemo(() => {
    const set = new Set(['All']);
    CATEGORIES.forEach(c => set.add(c));
    products.forEach(p => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  // Modal Open / Close States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [specsProduct, setSpecsProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Dedicated Feedback Modal State (Triggered 1s after order placement)
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackOrder, setFeedbackOrder] = useState(null);

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState(null);

  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [canInstall, setCanInstall] = useState(false);

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveStoredProducts(products);
  }, [products]);

  useEffect(() => {
    saveStoredCart(cart);
  }, [cart]);

  useEffect(() => {
    saveStoredOrders(orders);
  }, [orders]);

  useEffect(() => {
    saveStoredCurrency(currency);
  }, [currency]);

  useEffect(() => {
    saveStoredUserProfile(userProfile);
  }, [userProfile]);

  // Listen for PWA beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setDeferredPrompt(null);
      setCanInstall(false);
      showToast('EcoConstruct Pro app installed successfully! 🎉');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      setIsInstallModalOpen(true);
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setCanInstall(false);
      setIsInstallModalOpen(false);
    }
    setDeferredPrompt(null);
  };

  // Add to Cart handler - Fast and distraction-free
  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    showToast(`Added "${product.title}" to cart`);
  };

  // Update Cart Quantity
  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Remove Item from Cart
  const handleRemoveFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    showToast('Item removed from cart');
  };

  // Add New Product dynamically from Admin Modal
  // Immediately prepend, save, and auto-reset filters so new product is immediately visible
  const handleAddProduct = (newProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
    setSelectedCategory('All');
    setSearchQuery('');
    setMinRating(0);
    setSelectedCertifications([]);
    showToast(`New material "${newProduct.title}" added to catalog! 🌱`);
  };

  // Selective Product Deletion: Only removes custom items (isCustom: true)
  const handleDeleteProduct = (productId) => {
    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== productId);
      saveStoredProducts(updated);
      return updated;
    });
    showToast('Custom material removed from catalog');
  };

  // Order Success handler - Clears cart, shows confirmation, and triggers dedicated feedback modal
  const handleOrderSuccess = (newOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]); // Clear cart as specified
    setConfirmedOrder(newOrder);
    showToast('Order Placed Successfully! 🎉');

    // Trigger dedicated, separate Feedback & Rating Modal after a 1-second delay
    setTimeout(() => {
      setFeedbackOrder(newOrder);
      setIsFeedbackOpen(true);
    }, 1000);
  };

  // Filtered and Sorted Products List
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // 1. Text Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    // 2. Category Filter
    if (selectedCategory !== 'All') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // 3. Min Eco-Rating Filter (Dynamic threshold)
    if (minRating > 0) {
      list = list.filter((p) => (Number(p.ecoRating || p.rating || 0)) >= minRating);
    }

    // 4. Certifications Filter
    if (selectedCertifications.length > 0) {
      list = list.filter((p) =>
        selectedCertifications.every((cert) =>
          p.certifications?.includes(cert)
        )
      );
    }

    // 5. 30-Min Green Express Quick Filter
    if (only30MinFilter) {
      list = list.filter((p) => p.isExpressDelivery);
    }

    // 6. Sorting
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => Number(b.ecoRating || b.rating || 0) - Number(a.ecoRating || a.rating || 0));
    }

    return list;
  }, [products, searchQuery, selectedCategory, minRating, selectedCertifications, sortBy, only30MinFilter]);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalCartUSD = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className={`min-h-screen flex flex-col ${currentTheme.bgPage} text-slate-800 selection:bg-emerald-600 selection:text-white pb-20 md:pb-0 transition-colors duration-700`}>
      
      {/* 1–2 Second Intro Video / Splash Animation (Auto-dismisses & cached in sessionStorage) */}
      <IntroSplashOverlay />

      {/* Toast Notification Alert Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 max-w-sm p-3.5 rounded-2xl bg-slate-900/95 text-white border border-emerald-500/50 text-xs font-semibold shadow-2xl flex items-center gap-2.5 animate-slideInRight backdrop-blur-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        cartCount={totalCartCount}
        cartTotalUSD={totalCartUSD}
        ordersCount={orders.length}
        userProfile={userProfile}
        onOpenProfileModal={() => setIsProfileOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAddModal={() => setIsAddProductOpen(true)}
        onOpenOrdersModal={() => setIsOrderHistoryOpen(true)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currency={currency}
        setCurrency={setCurrency}
        canInstall={canInstall}
        theme={currentTheme}
        currentTimePeriod={timePeriod}
        onCycleTheme={handleCycleTheme}
      />

      {/* Clean, Modern Hero Banner */}
      <HeroBanner
        onOpenAddModal={() => setIsAddProductOpen(true)}
        theme={currentTheme}
        currentTimePeriod={timePeriod}
      />

      {/* Dedicated Flash Sale & 30-Minute Instant Delivery Hub */}
      <FlashSaleBanner
        is30MinOnly={only30MinFilter}
        onToggle30MinOnly={() => setOnly30MinFilter(prev => !prev)}
      />

      {/* Filter and Category Bar */}
      <div id="catalog">
        <FilterBar
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          minRating={minRating}
          setMinRating={setMinRating}
          selectedCertifications={selectedCertifications}
          setSelectedCertifications={setSelectedCertifications}
          sortBy={sortBy}
          setSortBy={setSortBy}
          totalResults={filteredProducts.length}
          categories={allCategories}
          is30MinOnly={only30MinFilter}
          setIs30MinOnly={setOnly30MinFilter}
        />
      </div>

      {/* Main Product Catalog Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Active Search Status Banner */}
        {searchQuery && (
          <div className="mb-6 flex items-center justify-between p-3 rounded-xl bg-white border border-emerald-200 text-xs text-slate-700 shadow-xs">
            <span>
              Searching for: <strong className="text-slate-900 font-bold">"{searchQuery}"</strong>
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-emerald-700 font-bold hover:underline"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Product Cards Grid: Multi-Column on Desktop, Single/Double on Mobile */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                currency={currency}
                onAddToCart={handleAddToCart}
                onOpenSpecs={(p) => setSpecsProduct(p)}
                onDeleteProduct={handleDeleteProduct}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
              <Leaf className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No eco-materials found</h3>
            <p className="text-xs sm:text-sm text-slate-600">
              No materials match your current category, rating threshold, or search filter.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setMinRating(0);
                  setSelectedCertifications([]);
                }}
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors shadow-xs"
              >
                Reset All Filters
              </button>
              <button
                onClick={() => setIsAddProductOpen(true)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-colors"
              >
                + Add Custom Material
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Clean Light-Themed Footer */}
      <footer className="mt-16 bg-white/80 border-t border-emerald-100 text-xs text-slate-600 py-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                  <Leaf className="w-5 h-5" />
                </div>
                <span className="font-extrabold text-base text-slate-900">EcoConstruct Pro</span>
              </div>
              <p className="text-slate-600 max-w-md text-xs leading-relaxed">
                The leading marketplace for carbon-neutral, circular, and certified green construction materials. Empowering commercial contractors, green architects, and homebuilders to build a sustainable planet.
              </p>
              <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>USGBC Member • FSC Chain of Custody Verified</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-3">Categories</h4>
              <ul className="space-y-1.5 text-slate-600">
                <li><button onClick={() => { setSelectedCategory('Bamboo'); window.scrollTo({ top: 350, behavior: 'smooth' }); }} className="hover:text-emerald-700">Strand Bamboo Flooring</button></li>
                <li><button onClick={() => { setSelectedCategory('Roofing'); window.scrollTo({ top: 350, behavior: 'smooth' }); }} className="hover:text-emerald-700">Recycled Steel & Sedum Roofs</button></li>
                <li><button onClick={() => { setSelectedCategory('Insulation'); window.scrollTo({ top: 350, behavior: 'smooth' }); }} className="hover:text-emerald-700">Hemp & Bio-Insulation</button></li>
                <li><button onClick={() => { setSelectedCategory('Composites'); window.scrollTo({ top: 350, behavior: 'smooth' }); }} className="hover:text-emerald-700">Ocean-Plastic Decking</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-3">PWA Platform</h4>
              <ul className="space-y-1.5 text-slate-600">
                <li><button onClick={() => setIsInstallModalOpen(true)} className="hover:text-emerald-700">Install Mobile App</button></li>
                <li><button onClick={() => setIsOrderHistoryOpen(true)} className="hover:text-emerald-700">Track Order Status</button></li>
                <li><button onClick={() => setIsAddProductOpen(true)} className="hover:text-emerald-700">List Architectural Material</button></li>
                <li><span className="text-emerald-700 font-medium">Offline Local Storage Ready</span></li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
            <div>
              © {new Date().getFullYear()} EcoConstruct Pro Inc. All environmental metrics certified.
            </div>
            <div className="flex items-center gap-4">
              <span>Zero-Emission Logistics</span>
              <span>•</span>
              <span>Circular Economy Standards</span>
            </div>
          </div>

        </div>
      </footer>

      {/* Mobile-First Bottom Navigation Bar (Minimum 48dp touch targets) */}
      <MobileBottomNav
        activeTab={mobileActiveTab}
        setActiveTab={setMobileActiveTab}
        cartCount={totalCartCount}
        ordersCount={orders.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAddModal={() => setIsAddProductOpen(true)}
        onOpenOrdersModal={() => setIsOrderHistoryOpen(true)}
      />

      {/* Cart Drawer / Bottom Sheet */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        currency={currency}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Add Product Modal (Admin / Dynamic Form) */}
      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onAddProduct={handleAddProduct}
        currentCurrency={currency}
      />

      {/* Product Specs Modal */}
      <ProductSpecsModal
        product={specsProduct}
        currency={currency}
        isOpen={!!specsProduct}
        onClose={() => setSpecsProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Multi-Step Checkout Modal (Standard Order Details Only) */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        currency={currency}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Order Confirmed Modal */}
      <OrderConfirmationModal
        order={confirmedOrder}
        isOpen={!!confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
        onTrackOrder={() => setIsOrderHistoryOpen(true)}
        currency={currency}
      />

      {/* Order History Modal */}
      <OrderHistoryModal
        isOpen={isOrderHistoryOpen}
        onClose={() => setIsOrderHistoryOpen(false)}
        orders={orders}
        currency={currency}
        onSelectOrder={(order) => {
          setIsOrderHistoryOpen(false);
          setConfirmedOrder(order);
        }}
      />

      {/* PWA Install Modal */}
      <InstallPwaModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        installPrompt={deferredPrompt}
        onInstallClick={handleInstallClick}
      />

      {/* Dedicated Feedback Modal (Triggered 1s after Order Placement) */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        recentOrder={feedbackOrder}
      />

      {/* User Profile / Sign-In Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={userProfile}
        onSaveProfile={(updated) => {
          setUserProfile(updated);
          showToast(`Welcome back, ${updated.name}! 🌿`);
        }}
        onOpenOrders={() => setIsOrderHistoryOpen(true)}
        ordersCount={orders.length}
      />

    </div>
  );
}
