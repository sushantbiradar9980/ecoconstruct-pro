import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  CheckCircle2,
  AlertTriangle,
  Leaf
} from 'lucide-react';
import { formatPrice, calculateCartTotals, calculateCarbonSaved } from '../utils/formatters';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  currency,
  onProceedToCheckout
}) {
  const [itemToDelete, setItemToDelete] = useState(null);

  if (!isOpen) return null;

  const totals = calculateCartTotals(cartItems, currency);
  const carbonSavedKg = calculateCarbonSaved(cartItems);

  const confirmDelete = (item) => {
    setItemToDelete(item);
  };

  const handleConfirmRemoval = () => {
    if (itemToDelete) {
      onRemoveItem(itemToDelete.id);
      setItemToDelete(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Delete Item Confirmation Dialog Overlay */}
      {itemToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 max-w-sm w-full shadow-2xl animate-fadeIn space-y-4">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Remove Item?</h3>
            </div>
            
            <p className="text-xs text-slate-600">
              Are you sure you want to remove <span className="font-semibold text-slate-900">"{itemToDelete.title}"</span> from your eco cart?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 touch-target"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRemoval}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md touch-target"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Drawer Wrapper: Slide-in from right on desktop, Bottom-sheet on mobile */}
      <div className="fixed inset-x-0 bottom-0 md:inset-y-0 md:left-auto md:right-0 md:w-full md:max-w-md flex flex-col bg-white border-t md:border-t-0 md:border-l border-emerald-100 shadow-2xl max-h-[90vh] md:max-h-full rounded-t-3xl md:rounded-none animate-slideUp md:animate-slideInRight">
        
        {/* Mobile Drag Indicator Bar */}
        <div className="md:hidden w-12 h-1.5 bg-slate-300 rounded-full mx-auto mt-3 mb-1" />

        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-emerald-100 flex items-center justify-between bg-emerald-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/10 border border-emerald-600/20 text-emerald-700 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                Shopping Cart
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {cartItems.reduce((acc, i) => acc + i.quantity, 0)} items
                </span>
              </h2>
              <p className="text-[11px] text-slate-500">
                Direct-from-producer sustainable materials
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors touch-target"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 text-xs">
          <div className="flex items-center justify-between text-slate-700 mb-1.5 font-medium">
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-emerald-600" />
              {totals.isFreeShipping ? (
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> FREE Zero-Emission Shipping Unlocked!
                </span>
              ) : (
                <span>
                  Add <strong className="text-emerald-700">{formatPrice(totals.amountNeededForFreeShippingUSD, currency)}</strong> more for FREE Shipping!
                </span>
              )}
            </span>
          </div>

          {/* Progress bar line */}
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (totals.subtotalUSD / 100) * 100)}%` }}
            />
          </div>
        </div>

        {/* Dynamic Carbon Savings Impact Metric Banner */}
        {cartItems.length > 0 && (
          <div className="px-5 py-2.5 bg-emerald-50/70 border-b border-emerald-100 flex items-center gap-2 text-xs text-emerald-800 font-semibold">
            <Leaf className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>🌱 Diverted ~{carbonSavedKg.toFixed(1)} kg CO₂e from industrial emissions</span>
          </div>
        )}

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {cartItems.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 mx-auto flex items-center justify-center text-slate-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Your cart is currently empty</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Explore our certified sustainable timber, living roof mats, and circular construction materials.
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-all touch-target"
              >
                Start Browsing Materials
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex gap-3 items-center group transition-colors hover:border-emerald-200"
              >
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-xl bg-white overflow-hidden flex-shrink-0 border border-slate-200">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                    {item.title}
                  </h4>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <span>{item.category}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-semibold">
                      {formatPrice(item.price, currency)}/{item.unit || 'unit'}
                    </span>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors touch-target"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <span className="w-7 text-center text-xs font-bold text-slate-900 select-none">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors touch-target"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="text-xs font-bold text-slate-900 ml-auto">
                      {formatPrice(item.price * item.quantity, currency)}
                    </span>
                  </div>
                </div>

                {/* Delete button with confirmation trigger */}
                <button
                  onClick={() => confirmDelete(item)}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-lg transition-colors touch-target"
                  title="Remove item"
                  aria-label={`Remove ${item.title}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Pricing Summary & Checkout Button */}
        {cartItems.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/90 space-y-3">
            
            {/* Calculation rows */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
                <span className="font-semibold text-slate-900">{formatPrice(totals.subtotalUSD, currency)}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span className="flex items-center gap-1">
                  <span>Shipping (Zero-Emission)</span>
                  {totals.isFreeShipping && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold border border-emerald-200">
                      FREE over $100
                    </span>
                  )}
                </span>
                <span className={totals.isFreeShipping ? 'text-emerald-700 font-semibold' : 'text-slate-800'}>
                  {totals.isFreeShipping ? 'FREE' : formatPrice(totals.shippingUSD, currency)}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Estimated Tax (8.75%)</span>
                <span className="text-slate-800">{formatPrice(totals.taxUSD, currency)}</span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm sm:text-base font-extrabold text-slate-900">
                <span>Total Amount</span>
                <span className="text-emerald-700">{formatPrice(totals.totalUSD, currency)}</span>
              </div>
            </div>

            {/* Environmental pledge */}
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Includes Carbon-Offset verification & Eco Freight Certificate</span>
            </div>

            {/* Proceed to Checkout Button */}
            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] touch-target"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>
        )}

      </div>
    </div>
  );
}
