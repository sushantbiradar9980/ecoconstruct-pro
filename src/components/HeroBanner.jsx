import React from 'react';
import { ArrowRight, PlusCircle, Sparkles, Sun, Sunrise, Moon } from 'lucide-react';

export default function HeroBanner({ onOpenAddModal, theme, currentTimePeriod }) {
  const getPeriodIcon = () => {
    if (currentTimePeriod === 'morning') return <Sunrise className="w-3.5 h-3.5 text-emerald-600" />;
    if (currentTimePeriod === 'afternoon') return <Sun className="w-3.5 h-3.5 text-amber-600" />;
    return <Moon className="w-3.5 h-3.5 text-teal-600" />;
  };

  return (
    <div className={`relative overflow-hidden ${theme.heroBg} border-b border-emerald-100 py-8 sm:py-12 transition-colors duration-700`}>
      {/* Subtle ambient glow circles */}
      <div className="absolute top-0 left-1/3 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Dynamic Time-of-Day Ambient Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-emerald-200 text-xs font-semibold text-emerald-800 shadow-xs mb-3">
          {getPeriodIcon()}
          <span>{theme.name} • {theme.tagline}</span>
        </div>

        {/* Clean, Modern Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-none">
          <span className={`text-transparent bg-clip-text bg-gradient-to-r ${theme.accentGradientText}`}>
            EcoConstruct Pro
          </span>
        </h1>

        {/* Clean Subtitle as specified */}
        <p className="mt-3 text-lg sm:text-xl font-bold text-slate-800 max-w-2xl mx-auto tracking-wide">
          Sustainable Building Materials & Circular Solutions
        </p>

        {/* Concise helper description */}
        <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          Direct verified catalog for zero-carbon architecture, low-VOC insulation, and circular composites.
        </p>

        {/* Action buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#catalog"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] touch-target"
          >
            <span>Browse Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-slate-800 font-semibold text-xs sm:text-sm border border-emerald-200 shadow-xs transition-colors touch-target"
          >
            <PlusCircle className="w-4 h-4 text-emerald-600" />
            <span>+ Add Material</span>
          </button>
        </div>

      </div>
    </div>
  );
}
