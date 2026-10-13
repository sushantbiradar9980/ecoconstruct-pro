import React, { useState } from 'react';
import { 
  X, 
  Package, 
  Calendar, 
  MapPin, 
  Truck, 
  ExternalLink, 
  Leaf, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  CreditCard, 
  Banknote, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Copy, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { formatPrice } from '../utils/formatters';

const STAGE_DEFINITIONS = [
  { key: 'placed', label: 'Order Placed (Confirmed)', icon: Package },
  { key: 'processing', label: 'Processing & Quality Check (Eco-certified inspection)', icon: ShieldCheck },
  { key: 'shipped', label: 'Shipped & In Transit (Carrier assigned with dispatch location)', icon: Truck },
  { key: 'out_for_delivery', label: 'Out for Delivery (Estimated delivery window/time)', icon: Clock },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle2 }
];

export default function OrderHistoryModal({
  isOpen,
  onClose,
  orders = [],
  currency,
  onSelectOrder
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState({});

  if (!isOpen) return null;

  const toggleExpand = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const handleCopyId = (id, e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText?.(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper to ensure every order has full 5-stage tracking timeline with dynamic timestamps
  const getFullTimeline = (order) => {
    if (order.timeline && Array.isArray(order.timeline) && order.timeline.length === 5) {
      return order.timeline;
    }

    const orderTime = new Date(order.date || Date.now()).getTime();
    const isDelivered = order.status?.toLowerCase().includes('delivered');
    const isShipped = isDelivered || order.status?.toLowerCase().includes('shipped') || order.status?.toLowerCase().includes('transit');
    const isProcessing = isShipped || order.status?.toLowerCase().includes('processing');

    return [
      {
        stage: 'Order Placed (Confirmed)',
        timestamp: new Date(orderTime).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        completed: true,
        current: !isProcessing,
        detail: 'Payment verified & eco-materials reserved'
      },
      {
        stage: 'Processing & Quality Check (Eco-certified inspection)',
        timestamp: new Date(orderTime + 6 * 3600 * 1000).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        completed: isProcessing,
        current: isProcessing && !isShipped,
        detail: 'Batch inspection & carbon offset certification'
      },
      {
        stage: 'Shipped & In Transit (Carrier assigned with dispatch location)',
        timestamp: isShipped 
          ? new Date(orderTime + 24 * 3600 * 1000).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
          : 'Carrier Dispatch Pending',
        completed: isShipped,
        current: isShipped && !isDelivered,
        detail: order.carrier ? `${order.carrier} • In Transit` : 'Zero-Emission Freight Carrier Assigned'
      },
      {
        stage: 'Out for Delivery (Estimated delivery window/time)',
        timestamp: isDelivered 
          ? new Date(orderTime + 40 * 3600 * 1000).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
          : (order.estimatedDelivery || 'Estimated Tomorrow, 11:00 AM - 3:00 PM'),
        completed: isDelivered,
        current: false,
        detail: 'Electric van dispatch to job site address'
      },
      {
        stage: 'Delivered',
        timestamp: isDelivered 
          ? new Date(orderTime + 48 * 3600 * 1000).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
          : 'Pending Final Delivery',
        completed: isDelivered,
        current: isDelivered,
        detail: isDelivered ? 'Delivered & verified by site contact' : 'Digital bill of lading upon drop-off'
      }
    ];
  };

  const filteredOrders = orders.filter((order) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const idMatch = order.id?.toLowerCase().includes(q);
    const statusMatch = order.status?.toLowerCase().includes(q);
    const itemMatch = order.items?.some(it => it.title?.toLowerCase().includes(q));
    const recipientMatch = `${order.shippingAddress?.firstName} ${order.shippingAddress?.lastName}`.toLowerCase().includes(q);
    return idMatch || statusMatch || itemMatch || recipientMatch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Surface */}
      <div className="relative w-full max-w-4xl bg-white border border-emerald-100 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-emerald-100 bg-emerald-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600/10 text-emerald-700 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Package className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                  Order Tracking & History
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200">
                  {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time zero-emission dispatch timelines, carrier assignments & verified LEED receipts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 justify-end">
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors touch-target"
              aria-label="Close orders modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter / Search Bar */}
        <div className="px-4 sm:px-6 py-3 bg-white border-b border-slate-100 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by Order ID (e.g. #ECO-84920), material name, status..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                aria-label="Clear filter"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Orders Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 bg-slate-50/40">
          {filteredOrders.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-white rounded-3xl border border-slate-200 p-6">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 mx-auto flex items-center justify-center text-emerald-600">
                <Package className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {searchQuery ? 'No matching orders found' : 'No orders recorded yet'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {searchQuery 
                  ? 'Try searching by a different order number or material title.' 
                  : 'Place an order in the catalog with zero-emission electric delivery to start tracking live progress here.'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            filteredOrders.map((order) => {
              const timeline = getFullTimeline(order);
              const isExpanded = expandedOrders[order.id] !== false; // expanded by default for quick inspection
              const activeStage = timeline.find(s => s.current) || timeline[timeline.length - 1];

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-emerald-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all overflow-hidden"
                >
                  {/* Top Header Card */}
                  <div className="p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-r from-emerald-50/40 via-white to-slate-50/30">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      
                      {/* Left: Order ID, Copy Button & Date */}
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <div className="flex items-center gap-1.5 bg-emerald-100/70 border border-emerald-200 px-3 py-1 rounded-xl">
                          <span className="font-mono font-extrabold text-emerald-900 text-sm">
                            {order.id}
                          </span>
                          <button
                            onClick={(e) => handleCopyId(order.id, e)}
                            className="p-1 text-emerald-700 hover:text-emerald-900 rounded-md transition-colors"
                            title="Copy Order ID"
                          >
                            {copiedId === order.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>

                        {/* Order Placement Timestamp */}
                        <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            {new Date(order.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })} at {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>

                      {/* Right: Active Status Badge Styled in Light-Green / Emerald Theme */}
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 shadow-xs">
                          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                          <span>{order.status || 'In Transit'}</span>
                        </span>

                        <button
                          onClick={() => toggleExpand(order.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          title={isExpanded ? 'Collapse order' : 'Expand order'}
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>

                    </div>

                    {/* Quick Metadata Bar */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-3 pt-3 border-t border-slate-100 text-xs">
                      
                      {/* Carrier / Transit Info */}
                      <div className="flex items-start gap-2 text-slate-600">
                        <Truck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <div className="text-[11px] text-slate-600 font-medium">Carrier & Route</div>
                          <div className="font-semibold text-slate-800 truncate">
                            {order.carrier || 'Pacific Green EV Logistics'}
                          </div>
                          <div className="text-[10px] text-emerald-700 truncate font-medium">
                            Hub: {order.dispatchLocation || 'Cascadia Eco-Distribution Center'}
                          </div>
                        </div>
                      </div>

                      {/* Shipping Destination */}
                      <div className="flex items-start gap-2 text-slate-600">
                        <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <div className="text-[11px] text-slate-600 font-medium">Destination</div>
                          <div className="font-semibold text-slate-800 truncate">
                            {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                          </div>
                          <div className="text-[10px] text-slate-600 truncate">
                            {order.shippingAddress?.streetAddress}, {order.shippingAddress?.city} {order.shippingAddress?.state}
                          </div>
                        </div>
                      </div>

                      {/* Payment Method */}
                      <div className="flex items-start gap-2 text-slate-600">
                        <CreditCard className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <div className="text-[11px] text-slate-600 font-medium">Payment Method</div>
                          <div className="font-semibold text-slate-800 truncate">
                            {order.paymentMethod || 'Credit Card'}
                          </div>
                          <div className="text-[10px] text-emerald-700 font-medium truncate">
                            Estimated: {order.estimatedDelivery || '1 - 2 Business Days'}
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Expandable Details: 5-Stage Visual Tracking Stepper & Item Breakdown */}
                  {isExpanded && (
                    <div className="p-4 sm:p-5 space-y-6">
                      
                      {/* =========================================================
                          MULTI-STAGE TRACKING TIMELINE (5 STAGES)
                          Styled with Emerald / Light-Green Theme
                         ========================================================= */}
                      <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 sm:p-5 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Truck className="w-4 h-4 text-emerald-700" />
                            <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight">
                              Live Logistics & Delivery Tracking
                            </h4>
                          </div>
                          <span className="text-[11px] text-emerald-800 font-semibold bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-200">
                            Zero-Emission Fleet Monitored
                          </span>
                        </div>

                        {/* Desktop & Tablet Multi-Stage Progress Stepper */}
                        <div className="relative pt-2 pb-1">
                          
                          {/* Progress Line */}
                          <div className="hidden md:block absolute top-6 left-6 right-6 h-1 bg-slate-200 -z-0 rounded-full">
                            <div 
                              className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                              style={{
                                width: `${Math.min(
                                  100,
                                  (timeline.filter(t => t.completed).length - 0.5) * 25
                                )}%`
                              }}
                            />
                          </div>

                          {/* Stepper Nodes */}
                          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-2 relative z-10">
                            {timeline.map((step, idx) => {
                              const isCompleted = step.completed;
                              const isCurrent = step.current;

                              return (
                                <div 
                                  key={idx}
                                  className={`flex md:flex-col items-start md:items-center text-left md:text-center p-2.5 md:p-1 rounded-xl transition-colors ${
                                    isCurrent ? 'bg-emerald-100/60 md:bg-transparent border md:border-none border-emerald-200' : ''
                                  }`}
                                >
                                  {/* Node Circle */}
                                  <div className="flex items-center justify-center flex-shrink-0 mr-3 md:mr-0 md:mb-2">
                                    {isCompleted ? (
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm transition-transform ${
                                        isCurrent 
                                          ? 'bg-emerald-600 ring-4 ring-emerald-200 scale-105' 
                                          : 'bg-emerald-600'
                                      }`}>
                                        <Check className="w-4 h-4 stroke-[3]" />
                                      </div>
                                    ) : isCurrent ? (
                                      <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center ring-4 ring-emerald-200 scale-105 shadow-sm">
                                        <div className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                                      </div>
                                    ) : (
                                      <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-300 text-slate-400 flex items-center justify-center text-xs font-bold">
                                        {idx + 1}
                                      </div>
                                    )}
                                  </div>

                                  {/* Step Details */}
                                  <div className="min-w-0 flex-1">
                                    <div className={`text-xs font-bold leading-tight ${
                                      isCurrent 
                                        ? 'text-emerald-900 font-extrabold' 
                                        : isCompleted 
                                          ? 'text-slate-800' 
                                          : 'text-slate-400'
                                    }`}>
                                      {step.stage}
                                    </div>

                                    {/* Dynamic Timestamp */}
                                    <div className={`text-[11px] mt-0.5 font-medium ${
                                      isCurrent 
                                        ? 'text-emerald-700 font-bold' 
                                        : isCompleted 
                                          ? 'text-slate-500' 
                                          : 'text-slate-400'
                                    }`}>
                                      {step.timestamp}
                                    </div>

                                    {/* Stage Micro-Detail */}
                                    {step.detail && (
                                      <div className="text-[10px] text-slate-500 mt-0.5 leading-snug line-clamp-2 hidden sm:block">
                                        {step.detail}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                      </div>

                      {/* =========================================================
                          COMPLETE ITEM BREAKDOWN WITH ECO-SCORE
                         ========================================================= */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                            <span>Materials Breakdown</span>
                            <span className="text-slate-400 font-normal">
                              ({order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'items'})
                            </span>
                          </h4>
                          <span className="text-xs text-slate-500">
                            LEED v4.1 MR Credit Eligible
                          </span>
                        </div>

                        <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-xs">
                          {order.items?.map((item, idx) => (
                            <div 
                              key={`${item.id}-${idx}`}
                              className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                {item.imageUrl ? (
                                  <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                                    loading="lazy"
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center flex-shrink-0">
                                    <Leaf className="w-6 h-6" />
                                  </div>
                                )}
                                
                                <div className="min-w-0">
                                  <div className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                                    {item.title}
                                  </div>
                                  
                                  <div className="flex flex-wrap items-center gap-2 mt-1">
                                    {/* Eco-Score Badge */}
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                                      <Leaf className="w-2.5 h-2.5 text-emerald-600" />
                                      <span>Eco {item.ecoScore || 90}</span>
                                    </span>

                                    {/* Quantity and unit price */}
                                    <span className="text-xs text-slate-500">
                                      Qty: <strong className="text-slate-700">{item.quantity}</strong> {item.unit || 'units'}
                                    </span>

                                    <span className="text-xs text-slate-400">•</span>

                                    <span className="text-xs text-slate-500">
                                      {formatPrice(item.price, currency)} / {item.unit || 'unit'}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Line Total */}
                              <div className="text-right flex-shrink-0">
                                <div className="font-extrabold text-xs sm:text-sm text-slate-900">
                                  {formatPrice(item.price * item.quantity, currency)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* =========================================================
                          ORDER FOOTER: TOTAL & RECEIPT ACTIONS
                         ========================================================= */}
                      <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500 font-medium">Grand Total:</span>
                          <span className="font-extrabold text-base sm:text-lg text-emerald-700">
                            {formatPrice(order.totalUSD, currency)}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            ({order.shippingMethod || 'Standard Green Shipping'})
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onSelectOrder(order)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 transition-colors touch-target"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
                            <span>View Full Receipt</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/90 flex items-center justify-between">
          <div className="text-xs text-slate-500 hidden sm:block">
            Tracking records persist locally in browser storage (<code className="text-emerald-700 font-mono">ecoconstruct_orders</code>)
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold transition-colors touch-target ml-auto"
          >
            Close Order History
          </button>
        </div>

      </div>
    </div>
  );
}
