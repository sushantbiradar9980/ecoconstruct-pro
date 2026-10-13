import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Sparkles, 
  Truck, 
  Printer, 
  ArrowRight, 
  Leaf, 
  ShieldCheck, 
  Calendar, 
  MapPin,
  Star,
  Check,
  X
} from 'lucide-react';
import { formatPrice, calculateCarbonSaved } from '../utils/formatters';

export default function OrderConfirmationModal({
  order,
  isOpen,
  onClose,
  onTrackOrder,
  currency
}) {
  const [supplierRating, setSupplierRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Fire festive eco-colored confetti explosion
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#059669', '#10b981', '#34d399', '#6ee7b7', '#f59e0b']
      });
      setSupplierRating(0);
      setRatingSubmitted(false);
    }
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleRateSupplier = (stars) => {
    setSupplierRating(stars);
    setRatingSubmitted(true);
    try {
      const storedRatings = JSON.parse(localStorage.getItem('ecoconstruct_supplier_ratings') || '[]');
      storedRatings.push({
        orderId: order.id,
        rating: stars,
        date: new Date().toISOString()
      });
      localStorage.setItem('ecoconstruct_supplier_ratings', JSON.stringify(storedRatings));
    } catch (e) {
      console.warn('Could not save supplier rating', e);
    }
  };

  const carbonSavedKg = calculateCarbonSaved(order.items || []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-xl bg-white border border-emerald-100 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh] animate-slideUp">
        
        {/* Top Celebration Header */}
        <div className="p-6 bg-gradient-to-b from-emerald-100/60 via-emerald-50/40 to-white border-b border-emerald-100 text-center relative overflow-hidden">
          <div className="absolute top-3 right-3">
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 bg-white/80 hover:bg-slate-100 transition-colors touch-target"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-600 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-3 animate-bounce">
            <CheckCircle2 className="w-9 h-9 stroke-[2.4]" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-semibold mb-2 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Zero-Emission Logistics Reserved</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Order Confirmed!
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
            Thank you for choosing verified circular materials. Your building project is actively diverting carbon from the atmosphere.
          </p>

          <div className="mt-4 inline-block bg-white px-4 py-1.5 rounded-xl border border-emerald-200 shadow-xs">
            <span className="text-xs text-slate-500 mr-2">Order Reference ID:</span>
            <strong className="text-sm font-mono text-emerald-700 tracking-wider font-bold">
              {order.id}
            </strong>
          </div>
        </div>

        {/* Scrollable Order Details */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm flex-1 text-slate-800">
          
          {/* Carbon Saved Impact Metric Banner */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <Leaf className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-emerald-900 flex items-center gap-1">
                <span>🌱 Diverted ~{carbonSavedKg.toFixed(1)} kg CO₂e from industrial emissions</span>
              </div>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                Calculated based on embodied carbon savings compared to traditional virgin concrete & timber.
              </p>
            </div>
          </div>

          {/* Interactive 5-Star Supplier & Experience Rating Widget */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
            <div className="text-xs font-bold text-slate-800">
              Rate your Supplier & Ordering Experience
            </div>
            
            {ratingSubmitted ? (
              <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-700 font-semibold py-1">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Thank you! Your {supplierRating}-star supplier rating was recorded.</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 py-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRateSupplier(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 hover:scale-125 transition-transform touch-target"
                    title={`Rate ${star} Stars`}
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${
                        (hoverRating || supplierRating) >= star
                          ? 'text-amber-500 fill-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            )}
            
            <p className="text-[11px] text-slate-500">
              Your feedback ensures material suppliers maintain LEED chain-of-custody standards.
            </p>
          </div>

          {/* Timeline & Delivery Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-600" />
                Estimated Delivery Timeline
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                {order.shippingMethod}
              </span>
            </div>

            <div className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>{order.estimatedDelivery}</span>
            </div>
            
            <p className="text-xs text-slate-500">
              Dispatched from regional zero-emissions warehouse via EV freight rail and fleet.
            </p>
          </div>

          {/* Shipping Details */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
              Customer & Site Shipping Destination
            </span>
            <div className="font-bold text-slate-900 text-sm">
              {order.shippingAddress.firstName} {order.shippingAddress.lastName}
            </div>
            <div className="text-slate-600">
              {order.shippingAddress.streetAddress}
            </div>
            <div className="text-slate-600">
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
            </div>
            <div className="text-slate-500 text-xs pt-1 flex flex-wrap items-center gap-1.5">
              <span>Payment:</span>
              <strong className="text-slate-900">{order.paymentMethod}</strong>
              {order.paymentMethod?.includes('Cash on Delivery') && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                  Pay at Jobsite
                </span>
              )}
              {order.paymentMethod?.includes('Pay Later') && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                  Net-30 Invoice
                </span>
              )}
            </div>
          </div>

          {/* Purchased Items List */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Items Summary ({order.items.length})
            </div>
            <div className="rounded-xl border border-slate-200 divide-y divide-slate-200 overflow-hidden bg-slate-50">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <img src={item.imageUrl} alt={item.title} className="w-9 h-9 rounded-lg object-cover bg-white" />
                    <div>
                      <div className="font-semibold text-slate-900 truncate max-w-xs">{item.title}</div>
                      <div className="text-slate-500">{item.quantity} × {formatPrice(item.price, currency)}</div>
                    </div>
                  </div>
                  <div className="font-bold text-slate-900">
                    {formatPrice(item.price * item.quantity, currency)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-600 block">Total Amount Paid</span>
              <span className="text-xs text-emerald-700 font-medium">Taxes and freight included</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-700">
              {formatPrice(order.totalUSD, currency)}
            </div>
          </div>

          {/* Environmental Carbon Certificate Badge */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600/10 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-900">
                Carbon Offset Certificate Registered
              </div>
              <p className="text-[11px] text-emerald-700 mt-0.5 leading-relaxed">
                A verified digital certificate for LEED v4.1 MR Credit compliance will be delivered with your bill of lading.
              </p>
            </div>
          </div>

        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/80 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold border border-slate-200 flex items-center gap-1.5 touch-target"
            >
              <Printer className="w-4 h-4" />
              <span>Print Receipt</span>
            </button>

            {onTrackOrder && (
              <button
                onClick={() => {
                  onClose();
                  onTrackOrder(order);
                }}
                className="px-3.5 py-2 rounded-xl bg-emerald-100/70 hover:bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-bold border border-emerald-300 flex items-center gap-1.5 touch-target"
              >
                <Truck className="w-4 h-4 text-emerald-700" />
                <span>Track Order</span>
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 touch-target ml-auto"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
