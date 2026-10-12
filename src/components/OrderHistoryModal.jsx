import React from 'react';
import { X, Package, Calendar, MapPin, Truck, ExternalLink, Leaf } from 'lucide-react';
import { formatPrice } from '../utils/formatters';

export default function OrderHistoryModal({
  isOpen,
  onClose,
  orders,
  currency,
  onSelectOrder
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-white border border-emerald-100 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-emerald-100 bg-emerald-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/10 text-emerald-700 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Order History & Logistics Status
              </h2>
              <p className="text-xs text-slate-500">
                Persistent local records ({orders.length} orders found)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors touch-target"
            aria-label="Close orders"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Orders List */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 text-slate-800">
          {orders.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 mx-auto flex items-center justify-center text-slate-400">
                <Package className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No orders placed yet</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Once you place an order with zero-emission delivery, its tracking ID and details will appear here.
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 hover:border-emerald-200 transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-emerald-700 text-sm">
                      {order.id}
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold">
                      {order.status || 'Confirmed'}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(order.date).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                  <div>
                    <div className="text-slate-500 font-medium">Delivery Destination:</div>
                    <div className="font-bold text-slate-900">
                      {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                    </div>
                    <div className="truncate text-slate-600">
                      {order.shippingAddress?.streetAddress}, {order.shippingAddress?.city}
                    </div>
                  </div>

                  <div>
                    <div className="text-slate-500 font-medium">Logistics Method:</div>
                    <div className="text-slate-900 font-semibold flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{order.shippingMethod}</span>
                    </div>
                    <div className="text-slate-500 text-[11px] mt-0.5">
                      ETA: {order.estimatedDelivery}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-slate-500">Total: </span>
                    <span className="font-extrabold text-emerald-700">
                      {formatPrice(order.totalUSD, currency)}
                    </span>
                    <span className="text-slate-500 text-[11px] ml-1">
                      ({order.items?.length || 0} items)
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectOrder(order)}
                    className="inline-flex items-center gap-1 text-xs text-emerald-700 font-bold hover:underline"
                  >
                    <span>View Receipt</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/80 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold border border-slate-200 transition-colors touch-target"
          >
            Close History
          </button>
        </div>

      </div>
    </div>
  );
}
