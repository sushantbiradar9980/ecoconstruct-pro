import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Truck, 
  CreditCard, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  QrCode, 
  Smartphone, 
  Building2, 
  Loader2, 
  Check, 
  Lock,
  Banknote,
  Clock
} from 'lucide-react';
import { formatPrice, calculateCartTotals, generateOrderId } from '../utils/formatters';

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  currency,
  onOrderSuccess
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Step 1: Shipping Address State
  const [shippingAddress, setShippingAddress] = useState({
    firstName: 'Marcus',
    lastName: 'Vance',
    streetAddress: '742 Evergreen Eco-Way, Suite 400',
    city: 'Seattle',
    state: 'WA',
    zipCode: '98101',
    phone: '+1 (555) 234-8900',
    email: 'marcus.vance@greenbuilders.org'
  });

  // Step 2: Shipping Method State
  // standard: Free if >$100, otherwise $15.99
  // express: +$14.99 premium for Zero-Emission Electric Courier
  const [shippingMethod, setShippingMethod] = useState('standard');

  // Step 3: Payment Method State ('card', 'upi', 'trade_credit')
  const [paymentMethod, setPaymentMethod] = useState('card');

  // Card details
  const [cardData, setCardData] = useState({
    cardNumber: '4532 8920 1823 4921',
    cardHolder: 'MARCUS VANCE',
    expiry: '08/28',
    cvv: '849'
  });

  // UPI details
  const [upiId, setUpiId] = useState('ecobuilder@okaxis');

  // Trade credit organization
  const [tradeLicense, setTradeLicense] = useState('USGBC-LEED-CON-9021');

  if (!isOpen) return null;

  const totals = calculateCartTotals(cartItems, currency);

  // Additional express shipping surcharge if selected
  const expressSurchargeUSD = shippingMethod === 'express' ? 14.99 : 0;
  const expressSurcharge = currency === 'INR' ? Math.round(expressSurchargeUSD * 83.0) : expressSurchargeUSD;
  const finalTotalUSD = totals.totalUSD + expressSurchargeUSD;

  // Real-time card formatting handlers
  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 16);
    const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardData({ ...cardData, cardNumber: formatted });
  };

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (val.length >= 3) {
      val = `${val.substring(0, 2)}/${val.substring(2)}`;
    }
    setCardData({ ...cardData, expiry: val });
  };

  const handleCvvChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').substring(0, 4);
    setCardData({ ...cardData, cvv: val });
  };

  const handleAddressChange = (field, val) => {
    setShippingAddress({ ...shippingAddress, [field]: val });
  };

  const validateStep1 = () => {
    const { firstName, lastName, streetAddress, city, state, zipCode } = shippingAddress;
    return firstName && lastName && streetAddress && city && state && zipCode;
  };

  const handlePlaceOrder = () => {
    setIsProcessing(true);

    // Simulate 1-second processing state as required
    setTimeout(() => {
      const orderId = generateOrderId();
      let formattedPaymentMethod = 'Credit Card (ending 4921)';
      if (paymentMethod === 'upi') {
        formattedPaymentMethod = `UPI (${upiId})`;
      } else if (paymentMethod === 'cod') {
        formattedPaymentMethod = 'Cash on Delivery (Site Inspection Delivery)';
      } else if (paymentMethod === 'trade_credit') {
        formattedPaymentMethod = 'Pay Later / 30-Day Green Trade Credit';
      }

      const now = new Date();
      const formattedDate = now.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

      const timeline = [
        {
          stage: 'Order Placed (Confirmed)',
          timestamp: formattedDate,
          completed: true,
          current: false,
          detail: 'Order payment confirmed. Eco-materials allocated in warehouse inventory.'
        },
        {
          stage: 'Processing & Quality Check (Eco-certified inspection)',
          timestamp: 'In Progress (Active Inspection)',
          completed: true,
          current: true,
          detail: 'Eco-certified quality inspection & zero-waste palletizing underway.'
        },
        {
          stage: 'Shipped & In Transit (Carrier assigned with dispatch location)',
          timestamp: 'Scheduled EV Carrier Dispatch',
          completed: false,
          current: false,
          detail: 'Carrier: Pacific Green EV Logistics (Fleet #EV-721) • Cascadia Depot.'
        },
        {
          stage: 'Out for Delivery (Estimated delivery window/time)',
          timestamp: shippingMethod === 'express' ? 'Estimated within 24-48 hrs' : 'Estimated within 3-5 days',
          completed: false,
          current: false,
          detail: 'Zero-emission electric heavy van dispatch to job site.'
        },
        {
          stage: 'Delivered',
          timestamp: 'Pending Delivery',
          completed: false,
          current: false,
          detail: 'Signature upon loading dock delivery & LEED credit certificate handover.'
        }
      ];

      const newOrder = {
        id: orderId,
        date: now.toISOString(),
        items: cartItems.map(item => ({
          ...item,
          ecoScore: item.ecoScore || 90
        })),
        totalUSD: finalTotalUSD,
        shippingMethod: shippingMethod === 'express' ? 'Express Zero-Emission Electric Freight' : 'Standard Green Shipping',
        shippingAddress: { ...shippingAddress },
        destination: `${shippingAddress.streetAddress}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}`,
        paymentMethod: formattedPaymentMethod,
        currency,
        status: 'Processing & Quality Check',
        currentStageIndex: 1,
        carrier: 'Pacific Green EV Logistics (Fleet #EV-721)',
        dispatchLocation: 'Pacific Northwest Eco-Fulfillment Hub',
        estimatedDelivery: shippingMethod === 'express' ? '1 - 2 Business Days' : '3 - 5 Business Days',
        timeline
      };

      setIsProcessing(false);
      onOrderSuccess(newOrder);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={!isProcessing ? onClose : undefined}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-white border border-emerald-100 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh]">
        
        {/* Processing Spinner Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
            <div className="w-16 h-16 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin flex items-center justify-center mb-4">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-pulse" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">
              Processing Sustainable Order...
            </h3>
            <p className="text-xs text-slate-600 max-w-sm mt-2">
              Validating carbon-neutral trade route, locking inventory batches, and executing payment gateway transaction.
            </p>
            <div className="mt-4 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>256-Bit Encrypted Green Transaction</span>
            </div>
          </div>
        )}

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-emerald-100 bg-emerald-50/50 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              Secure Green Checkout
              <Lock className="w-4 h-4 text-emerald-600" />
            </h2>
            <p className="text-xs text-slate-500">
              Step {currentStep} of 4: {
                currentStep === 1 ? 'Shipping Address' :
                currentStep === 2 ? 'Zero-Emission Delivery Method' :
                currentStep === 3 ? 'Payment Method' : 'Final Order Review'
              }
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors touch-target"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-Step Progress Tracker */}
        <div className="px-5 py-3 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between text-xs">
          {[
            { step: 1, label: 'Address', icon: MapPin },
            { step: 2, label: 'Shipping', icon: Truck },
            { step: 3, label: 'Payment', icon: CreditCard },
            { step: 4, label: 'Review', icon: CheckCircle2 }
          ].map(({ step, label, icon: Icon }) => {
            const isCompleted = currentStep > step;
            const isCurrent = currentStep === step;

            return (
              <div
                key={step}
                onClick={() => {
                  if (step < currentStep || (step === 2 && validateStep1())) {
                    setCurrentStep(step);
                  }
                }}
                className={`flex items-center gap-1.5 cursor-pointer transition-colors ${
                  isCurrent 
                    ? 'text-emerald-700 font-bold' 
                    : isCompleted 
                    ? 'text-slate-800 hover:text-emerald-700' 
                    : 'text-slate-400'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                    isCurrent
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : isCompleted
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : step}
                </div>
                <span className="hidden sm:inline">{label}</span>
              </div>
            );
          })}
        </div>

        {/* Scrollable Form Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-slate-800">
          
          {/* STEP 1: Shipping Address Form */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                Delivery Site & Recipient Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.firstName}
                    onChange={(e) => handleAddressChange('firstName', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.lastName}
                    onChange={(e) => handleAddressChange('lastName', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Street Address / Jobsite *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 742 Evergreen Eco-Way"
                    value={shippingAddress.streetAddress}
                    onChange={(e) => handleAddressChange('streetAddress', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.city}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">State *</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.state}
                      onChange={(e) => handleAddressChange('state', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Zip Code *</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.zipCode}
                      onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={shippingAddress.phone}
                    onChange={(e) => handleAddressChange('phone', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email (For Carbon Certificate)</label>
                  <input
                    type="email"
                    value={shippingAddress.email}
                    onChange={(e) => handleAddressChange('email', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Shipping Method Form */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600" />
                Select Zero-Emission Transport Method
              </h3>

              <div className="space-y-3">
                {/* Standard Shipping Card */}
                <label
                  onClick={() => setShippingMethod('standard')}
                  className={`block p-4 rounded-2xl border cursor-pointer transition-all ${
                    shippingMethod === 'standard'
                      ? 'border-emerald-500 bg-emerald-50/70 shadow-sm'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        shippingMethod === 'standard' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-400 bg-white'
                      }`}>
                        {shippingMethod === 'standard' && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">
                          Standard Green Logistics
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Consolidated freight rail + electric delivery van (3 - 5 business days)
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-emerald-700 text-sm">
                        {totals.isFreeShipping ? 'FREE' : formatPrice(totals.shippingUSD, currency)}
                      </span>
                      {totals.isFreeShipping && (
                        <div className="text-[10px] text-emerald-600 font-semibold">Over $100 Order</div>
                      )}
                    </div>
                  </div>
                </label>

                {/* Express Zero-Emission Surcharge Card */}
                <label
                  onClick={() => setShippingMethod('express')}
                  className={`block p-4 rounded-2xl border cursor-pointer transition-all ${
                    shippingMethod === 'express'
                      ? 'border-emerald-500 bg-emerald-50/70 shadow-sm'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        shippingMethod === 'express' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-400 bg-white'
                      }`}>
                        {shippingMethod === 'express' && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                          <span>Express EV Direct Dispatch</span>
                          <span className="px-2 py-0.5 text-[10px] rounded-full bg-amber-100 text-amber-800 font-semibold border border-amber-200">
                            Fastest
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Dedicated Electric Freight direct from regional facility (1 - 2 business days)
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-slate-900 text-sm">
                        +{formatPrice(expressSurchargeUSD, currency)}
                      </span>
                      <div className="text-[10px] text-slate-500">Expedited surcharge</div>
                    </div>
                  </div>
                </label>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>All deliveries verified 100% carbon-neutral with Scope 3 freight telemetry.</span>
              </div>
            </div>
          )}

          {/* STEP 3: Payment Method Form */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                Payment Method Selection
              </h3>

              {/* Payment Type Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-semibold transition-all ${
                    paymentMethod === 'card'
                      ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900 shadow-xs ring-1 ring-emerald-500 font-bold'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                  <span>Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-semibold transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900 shadow-xs ring-1 ring-emerald-500 font-bold'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-emerald-600" />
                  <span>UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-semibold transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900 shadow-xs ring-1 ring-emerald-500 font-bold'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-emerald-600" />
                  <span className="text-center">Cash on Delivery</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('trade_credit')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-semibold transition-all ${
                    paymentMethod === 'trade_credit'
                      ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900 shadow-xs ring-1 ring-emerald-500 font-bold'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Clock className="w-5 h-5 text-emerald-600" />
                  <span className="text-center">Pay Later (30d)</span>
                </button>
              </div>

              {/* Option 1: Credit / Debit Card Form */}
              {paymentMethod === 'card' && (
                <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200 space-y-3 animate-fadeIn">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Card Number</label>
                    <input
                      type="text"
                      placeholder="4532 8920 1823 4921"
                      value={cardData.cardNumber}
                      onChange={handleCardNumberChange}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Cardholder Name</label>
                      <input
                        type="text"
                        value={cardData.cardHolder}
                        onChange={(e) => setCardData({ ...cardData, cardHolder: e.target.value.toUpperCase() })}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Expiry</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={cardData.expiry}
                          onChange={handleExpiryChange}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 font-mono text-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">CVV</label>
                        <input
                          type="password"
                          maxLength={4}
                          placeholder="•••"
                          value={cardData.cvv}
                          onChange={handleCvvChange}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 font-mono text-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Option 2: UPI / QR Payment */}
              {paymentMethod === 'upi' && (
                <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200 space-y-3 animate-fadeIn">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-xl bg-white border border-emerald-200 flex items-center justify-center p-1.5 flex-shrink-0">
                      <QrCode className="w-full h-full text-slate-800" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Instant UPI Payment</div>
                      <p className="text-[11px] text-slate-600">
                        Scan with Google Pay, PhonePe, Paytm, or BHIM, or enter your VPA ID below.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Virtual Payment Address (UPI ID)</label>
                    <input
                      type="text"
                      placeholder="username@bank"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              )}

              {/* Option 3: Cash on Delivery (Site Inspection Delivery) */}
              {paymentMethod === 'cod' && (
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-300 space-y-3 animate-fadeIn">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 border border-emerald-200 mt-0.5">
                      <Banknote className="w-6 h-6 text-emerald-700" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">
                        Cash on Delivery (Site Inspection Delivery)
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Allows pay-on-arrival with no immediate online transaction. Inspect material batches and verified certificates at your jobsite before paying.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-emerald-200 text-xs text-emerald-900 font-semibold flex items-center gap-2 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Pay with cash or UPI upon material drop-off and quality verification.</span>
                  </div>

                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Our EV logistics driver carries an official digital receipt & UPI scanner.</span>
                  </div>
                </div>
              )}

              {/* Option 4: Pay Later / 30-Day Green Trade Credit */}
              {paymentMethod === 'trade_credit' && (
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-300 space-y-3 animate-fadeIn">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 border border-emerald-200 mt-0.5">
                      <Building2 className="w-6 h-6 text-emerald-700" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">
                        Pay Later / 30-Day Green Trade Credit
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Allows eligible contractors, architects, and builders to defer payment by 30 days with zero interest.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Contractor / Trade License Number</label>
                    <input
                      type="text"
                      placeholder="e.g. USGBC-LEED-CON-9021"
                      value={tradeLicense}
                      onChange={(e) => setTradeLicense(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-emerald-200 text-xs text-emerald-900 font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Net-30 invoice will be generated and dispatched with delivery manifest.</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Final Order Review */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Review & Confirm Order
              </h3>

              {/* Order Items Preview */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden divide-y divide-slate-200">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <img src={item.imageUrl} alt={item.title} className="w-10 h-10 rounded-lg object-cover bg-white" />
                      <div>
                        <div className="font-bold text-slate-900">{item.title}</div>
                        <div className="text-slate-500">{item.quantity} × {formatPrice(item.price, currency)}</div>
                      </div>
                    </div>
                    <div className="font-extrabold text-slate-900">
                      {formatPrice(item.price * item.quantity, currency)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery and Payment Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 font-semibold block mb-1">Shipping Destination</span>
                  <div className="font-bold text-slate-900">
                    {shippingAddress.firstName} {shippingAddress.lastName}
                  </div>
                  <div className="text-slate-600 truncate">{shippingAddress.streetAddress}</div>
                  <div className="text-slate-600">{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 font-semibold block mb-1">Payment & Dispatch</span>
                  <div className="font-bold text-slate-900">
                    {paymentMethod === 'card' 
                      ? 'Credit Card (ending 4921)' 
                      : paymentMethod === 'upi' 
                      ? `UPI (${upiId})` 
                      : paymentMethod === 'cod'
                      ? 'Cash on Delivery (Site Inspection Delivery)'
                      : 'Pay Later / 30-Day Green Trade Credit'}
                  </div>
                  <div className="text-emerald-700 font-medium mt-1">
                    {shippingMethod === 'express' ? '⚡ Express EV Dispatch' : '🌱 Standard Green Logistics'}
                  </div>
                </div>
              </div>

              {/* Order Cost Breakdown */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-700">
                  <span>Subtotal</span>
                  <span className="font-medium">{formatPrice(totals.subtotalUSD, currency)}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Logistics</span>
                  <span className="font-medium">
                    {shippingMethod === 'express' 
                      ? formatPrice(expressSurchargeUSD, currency) 
                      : (totals.isFreeShipping ? 'FREE' : formatPrice(totals.shippingUSD, currency))}
                  </span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Tax (8.75%)</span>
                  <span className="font-medium">{formatPrice(totals.taxUSD, currency)}</span>
                </div>
                <div className="pt-2 border-t border-emerald-200 flex justify-between text-base font-extrabold text-slate-900">
                  <span>Final Total</span>
                  <span className="text-emerald-700">{formatPrice(finalTotalUSD, currency)}</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between gap-3">
          {currentStep > 1 ? (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              disabled={isProcessing}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold border border-slate-200 flex items-center gap-1.5 touch-target"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold border border-slate-200 touch-target"
            >
              Cancel
            </button>
          )}

          {currentStep < 4 ? (
            <button
              onClick={() => {
                if (currentStep === 1 && !validateStep1()) {
                  alert('Please fill all required address fields.');
                  return;
                }
                setCurrentStep(currentStep + 1);
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/30 flex items-center gap-1.5 touch-target"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 flex items-center gap-2 touch-target transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Place Order ({formatPrice(finalTotalUSD, currency)})</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
