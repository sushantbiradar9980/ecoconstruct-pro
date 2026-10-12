import React, { useState } from 'react';
import { Star, X, CheckCircle2, Leaf, Send, Sparkles, MessageSquare } from 'lucide-react';

export default function FeedbackModal({
  isOpen,
  onClose,
  recentOrder
}) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  // 4-star field
  const [minorChange, setMinorChange] = useState('');

  // 3-star fields
  const [whatWasMissing, setWhatWasMissing] = useState('');
  const [catalogCheckoutImprovement, setCatalogCheckoutImprovement] = useState('');

  // 1-2 star fields
  const [whatWentWrong, setWhatWentWrong] = useState('');
  const [detailsUnclear, setDetailsUnclear] = useState('');
  const [bugsGlitches, setBugsGlitches] = useState('');
  const [suggestions, setSuggestions] = useState('');

  if (!isOpen) return null;

  const saveFeedbackToStorage = (feedbackPayload) => {
    try {
      const existing = JSON.parse(localStorage.getItem('ecoconstruct_feedback_records') || '[]');
      existing.unshift(feedbackPayload);
      localStorage.setItem('ecoconstruct_feedback_records', JSON.stringify(existing.slice(0, 50)));
    } catch (e) {
      console.warn('Could not save feedback to localStorage', e);
    }
  };

  const handle5StarSubmit = () => {
    saveFeedbackToStorage({
      rating: 5,
      orderId: recentOrder?.id || 'ECO-ORDER',
      timestamp: new Date().toISOString(),
      type: '5-star-experience'
    });
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      setSubmitted(false);
      setRating(0);
    }, 1200);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    const payload = {
      rating,
      orderId: recentOrder?.id || 'ECO-ORDER',
      timestamp: new Date().toISOString(),
      ...(rating === 4 && { minorChange }),
      ...(rating === 3 && { whatWasMissing, catalogCheckoutImprovement }),
      ...(rating <= 2 && { 
        whatWentWrong, 
        detailsUnclear, 
        bugsGlitches, 
        suggestions 
      })
    };

    saveFeedbackToStorage(payload);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      setSubmitted(false);
      setRating(0);
    }, 1200);
  };

  const getEmojiForRating = (star) => {
    switch (star) {
      case 1: return '😞 1 Star - Poor';
      case 2: return '😐 2 Stars - Fair';
      case 3: return '🙂 3 Stars - Average';
      case 4: return '😊 4 Stars - Good';
      case 5: return '🌟 5 Stars - Excellent!';
      default: return 'Tap a star to rate';
    }
  };

  const activeRating = hoverRating || rating;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white border border-emerald-100 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh] animate-slideUp">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-emerald-100 bg-emerald-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/10 text-emerald-700 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                How was your ordering experience?
              </h2>
              {recentOrder && (
                <p className="text-xs text-slate-500">
                  Order ID: <span className="font-mono text-emerald-700 font-semibold">{recentOrder.id}</span>
                </p>
              )}
            </div>
          </div>

          {/* Close (X) button */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors touch-target"
            aria-label="Close feedback"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-slate-800">
          
          {submitted ? (
            <div className="py-8 text-center space-y-3 animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Thank you for your feedback!</h3>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                Your ratings help us refine the circular building materials platform.
              </p>
            </div>
          ) : (
            <>
              {/* Rating Prompt & Star Selector */}
              <div className="text-center space-y-3">
                <p className="text-xs sm:text-sm font-semibold text-slate-700">
                  Please tap a star rating below:
                </p>

                {/* Stars Row */}
                <div className="flex items-center justify-center gap-2 py-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 sm:p-2 rounded-xl transition-all hover:scale-125 active:scale-95 touch-target"
                      title={`${star} Star Rating`}
                    >
                      <Star
                        className={`w-8 h-8 sm:w-9 sm:h-9 transition-colors ${
                          star <= activeRating
                            ? 'text-amber-500 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                            : 'text-slate-300 hover:text-slate-400'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <div className="text-xs font-semibold text-amber-700 h-4">
                  {activeRating > 0 ? getEmojiForRating(activeRating) : ''}
                </div>
              </div>

              {/* DYNAMIC BRANCH 1: ⭐⭐⭐⭐⭐ 5 STARS (Zero Extra Questions) */}
              {rating === 5 && (
                <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3 text-center animate-fadeIn">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>5-Star Perfect</span>
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-slate-900">
                    Thank you for the 5-star rating! 🌿
                  </h4>
                  <p className="text-xs text-emerald-800 max-w-sm mx-auto">
                    We appreciate your support.
                  </p>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handle5StarSubmit}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/30 transition-all hover:scale-[1.01] touch-target"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}

              {/* DYNAMIC BRANCH 2: ⭐⭐⭐⭐ 4 STARS (1 Quick Question) */}
              {rating === 4 && (
                <form onSubmit={handleCustomSubmit} className="space-y-3 animate-fadeIn">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <label className="block text-xs font-bold text-slate-700">
                      What minor change would make this a 5-star experience?
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Faster receipt downloads, more delivery updates..."
                      value={minorChange}
                      onChange={(e) => setMinorChange(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all touch-target flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Feedback</span>
                  </button>
                </form>
              )}

              {/* DYNAMIC BRANCH 3: ⭐⭐⭐ 3 STARS (2 Questions) */}
              {rating === 3 && (
                <form onSubmit={handleCustomSubmit} className="space-y-3 animate-fadeIn">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        1. What was missing from your experience?
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Bulk discount clarity, spec sheets download..."
                        value={whatWasMissing}
                        onChange={(e) => setWhatWasMissing(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        2. How can we improve our catalog/checkout?
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Simpler payment methods, clearer unit metrics..."
                        value={catalogCheckoutImprovement}
                        onChange={(e) => setCatalogCheckoutImprovement(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all touch-target flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Feedback</span>
                  </button>
                </form>
              )}

              {/* DYNAMIC BRANCH 4: ⭐ or ⭐⭐ 1-2 STARS (Detailed 4-Question Survey) */}
              {(rating === 1 || rating === 2) && (
                <form onSubmit={handleCustomSubmit} className="space-y-3 animate-fadeIn">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="text-[11px] text-amber-700 font-semibold">
                      💡 Please tell us what happened so we can resolve it immediately:
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        1. What went wrong during your order?
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Issues with selecting shipping or address..."
                        value={whatWentWrong}
                        onChange={(e) => setWhatWentWrong(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        2. Were prices, quantities, or product details unclear?
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Tax calculation, shipping rate, currency..."
                        value={detailsUnclear}
                        onChange={(e) => setDetailsUnclear(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        3. Did you face any bugs or layout glitches?
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Modal did not open properly, buttons clipped..."
                        value={bugsGlitches}
                        onChange={(e) => setBugsGlitches(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        4. Detailed suggestions for our team:
                      </label>
                      <textarea
                        rows={2}
                        required
                        placeholder="Write any additional feedback or feature requests..."
                        value={suggestions}
                        onChange={(e) => setSuggestions(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all touch-target flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Detailed Survey</span>
                  </button>
                </form>
              )}
            </>
          )}

        </div>

        {/* Footer: Subtle Skip for now button */}
        <div className="p-3 sm:p-4 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-medium">
            Helps improve EcoConstruct Pro
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-800 hover:underline px-2 py-1 touch-target font-semibold"
          >
            Skip for now
          </button>
        </div>

      </div>
    </div>
  );
}
