import React from 'react';
import { 
  Leaf, 
  ShoppingCart, 
  PlusCircle, 
  Search, 
  Smartphone, 
  Package, 
  ArrowUpDown,
  Sun,
  Sunrise,
  Moon,
  X,
  User,
  Zap
} from 'lucide-react';
import { formatPrice } from '../utils/formatters';

export default function Navbar({
  cartCount,
  cartTotalUSD = 0,
  ordersCount = 0,
  userProfile,
  onOpenProfileModal,
  onOpenCart,
  onOpenAddModal,
  onOpenOrdersModal,
  onOpenInstallModal,
  searchQuery,
  setSearchQuery,
  currency,
  setCurrency,
  canInstall,
  theme,
  currentTimePeriod,
  onCycleTheme
}) {
  const getPeriodIcon = () => {
    if (currentTimePeriod === 'morning') return <Sunrise className="w-3.5 h-3.5 text-emerald-600" />;
    if (currentTimePeriod === 'afternoon') return <Sun className="w-3.5 h-3.5 text-amber-600" />;
    return <Moon className="w-3.5 h-3.5 text-teal-600" />;
  };

  return (
    <header className={`sticky top-0 z-40 ${theme.headerBg} backdrop-blur-md border-b transition-colors duration-500`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* =========================================================================
            DESKTOP / TABLET HEADER (Hidden on mobile < 640px)
           ========================================================================= */}
        <div className="hidden sm:flex items-center justify-between h-16 sm:h-20 gap-3">
          
          {/* Brand Logo */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer select-none flex-shrink-0"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-500/20 text-white flex-shrink-0">
              <Leaf className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="font-extrabold text-lg tracking-tight text-slate-900 flex items-center gap-1">
                <span>EcoConstruct</span>
                <span className={theme.accentText}>Pro</span>
              </div>
              <p className="text-[10px] text-slate-500 tracking-wide font-medium">
                Sustainable Building Materials
              </p>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="flex-1 max-w-md mx-2">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search eco materials, bamboo, recycled steel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-slate-100/90 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-0.5"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            
            {/* Dynamic Time-of-Day Theme Pill */}
            <button
              onClick={onCycleTheme}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs text-slate-700 hover:text-slate-900 transition-colors font-medium"
              title={`Active Palette: ${theme.name} (${theme.timeRange}). Click to cycle.`}
            >
              {getPeriodIcon()}
              <span className="hidden lg:inline text-[11px]">{theme.name}</span>
            </button>

            {/* Currency Switcher */}
            <button
              onClick={() => setCurrency(prev => prev === 'USD' ? 'INR' : 'USD')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-800 transition-colors"
              title="Toggle Currency ($ USD / ₹ INR)"
            >
              <ArrowUpDown className="w-3 h-3 text-emerald-600" />
              <span>{currency === 'USD' ? '$ USD' : '₹ INR'}</span>
            </button>

            {/* Install PWA Button */}
            <button
              onClick={onOpenInstallModal}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
              title="Install EcoConstruct Pro App"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
              <span>{canInstall ? 'Install App' : 'PWA App'}</span>
            </button>

            {/* + Add Material Button */}
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Add Material</span>
            </button>

            {/* My Orders Button with Badge - Positioned right next to Cart button */}
            <button
              onClick={onOpenOrdersModal}
              className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-800 hover:text-slate-900 transition-colors touch-target"
              title="My Orders & Live Tracking"
              aria-label="My Orders"
            >
              <Package className="w-4 h-4 text-emerald-600" />
              <span className="hidden md:inline font-bold">My Orders</span>
              {ordersCount > 0 && (
                <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold text-[10px] min-w-[18px] h-4 px-1 rounded-full flex items-center justify-center">
                  {ordersCount}
                </span>
              )}
            </button>

            {/* Shopping Cart Button with Badge */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 transition-all touch-target"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5 text-emerald-600" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white font-bold text-[11px] min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Profile / Sign-In Avatar Button (Top-Right Corner) */}
            <button
              onClick={onOpenProfileModal}
              className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 transition-all touch-target"
              title={userProfile?.isSignedIn ? `Signed in as ${userProfile.name}` : "Sign In / Profile"}
              aria-label="User Profile"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                  {userProfile?.isSignedIn ? (
                    <span>{userProfile.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'}</span>
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>
                {userProfile?.isSignedIn && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                )}
              </div>
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[85px]">
                  {userProfile?.isSignedIn ? userProfile.name.split(' ')[0] : 'Sign In'}
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold leading-tight">
                  {userProfile?.isSignedIn ? `${userProfile.ecoPoints || 480} pts` : 'Account'}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* =========================================================================
            MOBILE RESPONSIVE HEADER (< 640px)
            Clean 2-row layout with zero overlapping
           ========================================================================= */}
        <div className="sm:hidden py-2.5 space-y-2">
          
          {/* Row 1: Brand Title on Left + Controls on Right */}
          <div className="flex items-center justify-between gap-2">
            
            {/* Logo + Title */}
            <div 
              className="flex items-center gap-2 cursor-pointer min-w-0"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                <Leaf className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 truncate">
                EcoConstruct<span className={theme.accentText}>Pro</span>
              </span>
            </div>

            {/* Controls Row on Right: Theme, Currency, My Orders, Cart, Profile */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              
              {/* Theme Cycle Button */}
              <button
                onClick={onCycleTheme}
                className="p-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 touch-target min-w-[34px] min-h-[34px]"
                title={`Current palette: ${theme.name}. Tap to change.`}
              >
                {getPeriodIcon()}
              </button>

              {/* Currency Toggle */}
              <button
                onClick={() => setCurrency(prev => prev === 'USD' ? 'INR' : 'USD')}
                className="px-2 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 touch-target min-h-[34px]"
                title="Toggle Currency"
              >
                {currency === 'USD' ? '$' : '₹'}
              </button>

              {/* My Orders Button with Badge */}
              <button
                onClick={onOpenOrdersModal}
                className="relative p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 hover:text-slate-900 touch-target min-w-[34px] min-h-[34px]"
                title="My Orders & Live Tracking"
                aria-label="My Orders"
              >
                <Package className="w-4 h-4 text-emerald-600" />
                {ordersCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-700 text-white font-bold text-[10px] min-w-[17px] h-4 px-1 rounded-full flex items-center justify-center shadow">
                    {ordersCount}
                  </span>
                )}
              </button>

              {/* Cart Button */}
              <button
                onClick={onOpenCart}
                className="relative p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 hover:text-slate-900 touch-target min-w-[34px] min-h-[34px]"
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="w-4 h-4 text-emerald-600" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-600 text-white font-bold text-[10px] min-w-[17px] h-4 px-1 rounded-full flex items-center justify-center shadow">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User Profile Avatar Button - Mobile Top-Right Corner */}
              <button
                onClick={onOpenProfileModal}
                className="relative p-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 hover:text-slate-900 touch-target min-w-[34px] min-h-[34px] flex items-center justify-center"
                title="User Profile & Sign In"
                aria-label="User Profile"
              >
                <div className="relative w-6 h-6 rounded-md bg-emerald-600 text-white font-black text-[10px] flex items-center justify-center">
                  {userProfile?.isSignedIn ? (
                    userProfile.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'
                  ) : (
                    <User className="w-3.5 h-3.5" />
                  )}
                  {userProfile?.isSignedIn && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white" />
                  )}
                </div>
              </button>
            </div>

          </div>

          {/* Row 2: Quick Action Row with "+ Add Material", Search Input, and Live Cart Total */}
          <div className="flex items-center gap-2 pt-0.5">
            
            {/* + Add Material Button */}
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs whitespace-nowrap shadow-sm active:scale-95 flex-shrink-0 touch-target min-h-[36px]"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Add Material</span>
            </button>

            {/* Mobile Search Bar */}
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500 min-h-[36px]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 p-0.5"
                  aria-label="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Total Cart Price Badge */}
            <div 
              onClick={onOpenCart}
              className="px-2 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs whitespace-nowrap cursor-pointer hover:bg-emerald-100 flex-shrink-0 touch-target min-h-[36px]"
              title="Cart Total"
            >
              {formatPrice(cartTotalUSD, currency)}
            </div>

          </div>

        </div>

      </div>
    </header>
  );
}
