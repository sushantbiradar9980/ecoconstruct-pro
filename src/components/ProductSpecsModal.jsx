import React from 'react';
import { X, ShieldCheck, Star, Leaf, Check, ShoppingCart, Award, Layers, Ruler, Clock } from 'lucide-react';
import { formatPrice } from '../utils/formatters';

export default function ProductSpecsModal({
  product,
  currency,
  isOpen,
  onClose,
  onAddToCart
}) {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white border border-emerald-100 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
        
        {/* Header with Close Button */}
        <div className="p-4 sm:p-5 border-b border-emerald-100 flex items-center justify-between bg-emerald-50/50">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold">
              {product.category}
            </span>
            {product.ecoScore && (
              <span className="px-2 py-0.5 rounded-lg bg-emerald-600 text-white text-xs font-bold shadow-xs">
                Eco-Score: {product.ecoScore}/100
              </span>
            )}
            <div className="flex items-center gap-1 text-amber-600 text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>★ {(product.ecoRating || product.rating || 4.8).toFixed(1)} Eco-Rating</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors touch-target"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-slate-800">
          
          {/* Top Info Section: Image + Title */}
          <div className="flex flex-col sm:flex-row gap-5">
            <div className="w-full sm:w-48 h-40 rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 flex-shrink-0">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1 space-y-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {product.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>
              
              <div className="pt-2">
                <span className="text-2xl font-extrabold text-emerald-700">
                  {formatPrice(product.price, currency)}
                </span>
                <span className="text-xs text-slate-500 ml-1">
                  /{product.unit || 'unit'}
                </span>
              </div>
            </div>
          </div>

          {/* Sustainability Certifications */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Sustainability Certifications
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {product.certifications?.map((cert, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold">{cert}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Specifications Grid */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-600" />
              Technical Specifications
            </h4>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden divide-y divide-slate-200 text-xs">
              {product.specs?.dimensions && (
                <div className="flex flex-col sm:flex-row p-3 gap-1 sm:gap-4">
                  <span className="font-semibold text-slate-600 sm:w-40 flex items-center gap-1">
                    <Ruler className="w-3.5 h-3.5 text-slate-500" />
                    Dimensions
                  </span>
                  <span className="text-slate-900 font-medium">{product.specs.dimensions}</span>
                </div>
              )}

              {product.specs?.embodiedCarbon && (
                <div className="flex flex-col sm:flex-row p-3 gap-1 sm:gap-4 bg-emerald-50/50">
                  <span className="font-semibold text-emerald-800 sm:w-40 flex items-center gap-1">
                    <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                    Embodied Carbon
                  </span>
                  <span className="text-emerald-900 font-bold">{product.specs.embodiedCarbon}</span>
                </div>
              )}

              {product.specs?.durability && (
                <div className="flex flex-col sm:flex-row p-3 gap-1 sm:gap-4">
                  <span className="font-semibold text-slate-600 sm:w-40 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-slate-500" />
                    Rating / Strength
                  </span>
                  <span className="text-slate-900 font-medium">{product.specs.durability}</span>
                </div>
              )}

              {product.specs?.finish && (
                <div className="flex flex-col sm:flex-row p-3 gap-1 sm:gap-4">
                  <span className="font-semibold text-slate-600 sm:w-40 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-slate-500" />
                    Finish & Sealing
                  </span>
                  <span className="text-slate-900 font-medium">{product.specs.finish}</span>
                </div>
              )}

              {product.specs?.leedContribution && (
                <div className="flex flex-col sm:flex-row p-3 gap-1 sm:gap-4">
                  <span className="font-semibold text-slate-600 sm:w-40 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                    LEED v4.1 Credits
                  </span>
                  <span className="text-slate-900 font-medium">{product.specs.leedContribution}</span>
                </div>
              )}

              {product.specs?.warranty && (
                <div className="flex flex-col sm:flex-row p-3 gap-1 sm:gap-4">
                  <span className="font-semibold text-slate-600 sm:w-40 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    Warranty Period
                  </span>
                  <span className="text-slate-900 font-medium">{product.specs.warranty}</span>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold border border-slate-200 transition-colors touch-target"
          >
            Close Specs
          </button>

          <button
            onClick={() => {
              onAddToCart(product);
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] touch-target"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add to Cart ({formatPrice(product.price, currency)})</span>
          </button>
        </div>

      </div>
    </div>
  );
}
