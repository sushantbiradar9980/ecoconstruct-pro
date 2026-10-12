import React from 'react';
import { Home, Search, PlusCircle, ShoppingCart, Package } from 'lucide-react';

export default function MobileBottomNav({
  activeTab,
  setActiveTab,
  cartCount,
  onOpenCart,
  onOpenAddModal,
  onOpenOrdersModal
}) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-emerald-100 shadow-lg safe-area-pb">
      <div className="grid grid-cols-5 items-center h-16 px-1">
        
        {/* Catalog / Home */}
        <button
          onClick={() => {
            setActiveTab('catalog');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center h-full touch-target transition-colors ${
            activeTab === 'catalog' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-emerald-700'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Catalog</span>
        </button>

        {/* Search */}
        <button
          onClick={() => {
            const searchInput = document.querySelector('input[type="text"]');
            if (searchInput) {
              searchInput.focus();
              searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }}
          className="flex flex-col items-center justify-center h-full touch-target text-slate-500 hover:text-emerald-700 transition-colors"
        >
          <Search className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Search</span>
        </button>

        {/* Central Prominent Add Product Action */}
        <button
          onClick={onOpenAddModal}
          className="flex flex-col items-center justify-center h-full -mt-3 touch-target group"
        >
          <div className="w-12 h-12 rounded-full bg-emerald-600 group-hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 ring-4 ring-white transition-transform group-active:scale-90">
            <PlusCircle className="w-6 h-6 stroke-[2.3]" />
          </div>
          <span className="text-[10px] text-emerald-700 font-bold mt-0.5">Add</span>
        </button>

        {/* Cart with badge */}
        <button
          onClick={onOpenCart}
          className="relative flex flex-col items-center justify-center h-full touch-target text-slate-500 hover:text-emerald-700 transition-colors"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5 mb-0.5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-emerald-600 text-white font-bold text-[10px] min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center shadow">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px]">Cart</span>
        </button>

        {/* Orders */}
        <button
          onClick={onOpenOrdersModal}
          className="flex flex-col items-center justify-center h-full touch-target text-slate-500 hover:text-emerald-700 transition-colors"
        >
          <Package className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Orders</span>
        </button>

      </div>
    </nav>
  );
}
