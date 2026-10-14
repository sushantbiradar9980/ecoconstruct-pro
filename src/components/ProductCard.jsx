import React, { useState } from 'react';
import { Star, ShieldCheck, ShoppingCart, Eye, Check, Leaf, Trash2, Zap } from 'lucide-react';
import { formatPrice } from '../utils/formatters';
import { DEFAULT_FALLBACK_IMAGE } from '../data/defaultProducts';

export default function ProductCard({
  product,
  currency,
  onAddToCart,
  onOpenSpecs,
  onDeleteProduct
}) {
  const [imgSrc, setImgSrc] = useState(product.imageUrl || DEFAULT_FALLBACK_IMAGE);
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  };

  const ratingScore = Number(product.ecoRating || product.rating || 4.8).toFixed(1);
  const reviewCount = product.reviewsCount || 28;

  return (
    <div className="group bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden flex flex-col hover:border-emerald-300 hover:shadow-lg transition-all duration-300">
      
      {/* Product Image Area */}
      <div 
        className="relative aspect-[4/3] w-full overflow-hidden bg-emerald-50/50 cursor-pointer" 
        onClick={() => onOpenSpecs(product)}
      >
        <img
          src={imgSrc}
          alt={product.title}
          onError={() => setImgSrc(DEFAULT_FALLBACK_IMAGE)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Soft Gradient Overlay for Tag Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none" />

        {/* Category & Eco-Score Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
          <span className="px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-md text-emerald-800 border border-emerald-200 text-xs font-semibold shadow-sm">
            {product.category}
          </span>
          {product.ecoScore && (
            <span 
              className="px-2 py-0.5 rounded-lg bg-emerald-600/95 backdrop-blur-md text-white text-[11px] font-bold shadow-sm"
              title={`Eco-Score: ${product.ecoScore} / 100`}
            >
              Eco {product.ecoScore}
            </span>
          )}
          {product.isCustom && (
            <span className="px-2 py-0.5 rounded-lg bg-amber-500/95 backdrop-blur-md text-white text-[10px] font-extrabold shadow-sm">
              Custom Material
            </span>
          )}
        </div>

        {/* Eco Rating Badge with Star Score & Review Tally */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-md border border-amber-200 text-amber-700 text-xs font-bold shadow-sm">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
          <span>★ {ratingScore} ({reviewCount})</span>
        </div>

        {/* 30-Min Green Express & Flash Deal Ribbon */}
        {(product.isExpressDelivery || product.isFlashSale) && (
          <div className="absolute bottom-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
            {product.isExpressDelivery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-emerald-600 text-white text-[10px] font-black tracking-wide shadow-md">
                <Zap className="w-3 h-3 fill-white" />
                <span>⚡ 30-Min Green Express</span>
              </span>
            )}
            {product.discountPercent && (
              <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-black shadow-sm">
                -{product.discountPercent}% OFF
              </span>
            )}
          </div>
        )}

        {/* Quick Specs Hover Trigger on desktop */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/25 backdrop-blur-[2px] pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/95 text-slate-800 text-xs font-semibold border border-emerald-200 shadow-lg">
            <Eye className="w-3.5 h-3.5 text-emerald-600" />
            Quick View Specs
          </span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Certifications Row */}
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {product.certifications?.slice(0, 3).map((cert, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200"
              >
                <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
                {cert}
              </span>
            ))}
            {product.certifications && product.certifications.length > 3 && (
              <span className="text-[10px] text-slate-500 self-center font-medium">
                +{product.certifications.length - 3} more
              </span>
            )}
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onOpenSpecs(product)}
            className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors cursor-pointer line-clamp-2"
          >
            {product.title}
          </h3>

          {/* Short Description */}
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Embodied Carbon snippet if available */}
          {product.specs?.embodiedCarbon && (
            <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
              <Leaf className="w-3 h-3 flex-shrink-0 text-emerald-600" />
              <span className="truncate">{product.specs.embodiedCarbon}</span>
            </div>
          )}
        </div>

        {/* Pricing & Actions Footer */}
        <div className="pt-3 border-t border-emerald-100 flex flex-wrap items-center justify-between gap-2">
          
          <div>
            <div className="text-xs text-slate-500 font-medium">Unit Price</div>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-lg sm:text-xl font-extrabold text-slate-900">
                {formatPrice(product.price, currency)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  {formatPrice(product.originalPrice, currency)}
                </span>
              )}
              <span className="text-xs font-normal text-slate-500">
                /{product.unit || 'unit'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Selective Deletion: ONLY on custom items (isCustom: true) */}
            {product.isCustom && onDeleteProduct && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteProduct(product.id);
                }}
                className="p-2 sm:px-2.5 sm:py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 border border-rose-200 transition-colors touch-target shadow-xs flex items-center gap-1"
                title="Delete Custom Material"
                aria-label="Delete material"
              >
                <Trash2 className="w-4 h-4 text-rose-600" />
                <span className="hidden sm:inline text-xs font-bold">Delete</span>
              </button>
            )}

            {/* Specs Preview Modal Button */}
            <button
              onClick={() => onOpenSpecs(product)}
              className="p-2.5 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold border border-slate-200 transition-colors touch-target flex items-center gap-1"
              title="View Technical Specs"
            >
              <Eye className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">Specs</span>
            </button>

            {/* Quick + Add to Cart Button */}
            <button
              onClick={handleAdd}
              disabled={isAdded}
              className={`px-3.5 py-2.5 sm:px-4 sm:py-2 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition-all touch-target ${
                isAdded
                  ? 'bg-emerald-600 text-white shadow-emerald-600/40 scale-95'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30 active:scale-95'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>+ Cart</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
