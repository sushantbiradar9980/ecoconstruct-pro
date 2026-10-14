import React, { useState, useEffect } from 'react';
import { Zap, Clock, Truck, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export default function FlashSaleBanner({
  is30MinOnly,
  onToggle30MinOnly
}) {
  // Live ticking countdown timer: calculates countdown to next 3-hour flash cycle
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 18 });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      // Cycle every 4 hours based on system clock
      const currentMinutes = now.getMinutes();
      const currentSeconds = now.getSeconds();
      const hoursRemaining = 3 - (now.getHours() % 4);
      const minutesRemaining = 59 - currentMinutes;
      const secondsRemaining = 59 - currentSeconds;

      setTimeLeft({
        hours: Math.max(0, hoursRemaining),
        minutes: Math.max(0, minutesRemaining),
        seconds: Math.max(0, secondsRemaining)
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDigit = (num) => String(num).padStart(2, '0');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 text-white shadow-xl border border-emerald-500/30 p-4 sm:p-6">
        
        {/* Ambient background glows */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          
          {/* Left Title & Value Proposition */}
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold tracking-wide">
              <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-bounce" />
              <span>Flash Sale & 30-Min Delivery Hub</span>
            </div>

            <h2 className="text-lg sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>⚡ 30-Min Green Express</span>
              <span className="text-amber-400 font-extrabold text-sm sm:text-base px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-400/30">
                15% OFF
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Modeled after Amazon Fresh / Prime quick delivery — guaranteed 30-minute electric van drop-off on high-demand, local warehouse materials.
            </p>
          </div>

          {/* Center / Right: Live Countdown Clock & Instant Filter Button */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
            
            {/* Live Countdown Box */}
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 shadow-inner">
              <Clock className="w-4 h-4 text-amber-400 flex-shrink-0 animate-spin" style={{ animationDuration: '8s' }} />
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                  Deals End In:
                </span>
                <div className="font-mono font-black text-sm sm:text-base text-amber-300 tracking-wider">
                  <span>{formatDigit(timeLeft.hours)}h </span>
                  <span>{formatDigit(timeLeft.minutes)}m </span>
                  <span className="text-amber-400 animate-pulse">{formatDigit(timeLeft.seconds)}s</span>
                </div>
              </div>
            </div>

            {/* Quick Filter Toggle Button */}
            <button
              onClick={onToggle30MinOnly}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-lg touch-target flex-shrink-0 ${
                is30MinOnly
                  ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/30 shadow-amber-400/20 scale-102'
                  : 'bg-white text-slate-900 hover:bg-emerald-50 hover:text-emerald-950'
              }`}
            >
              <Zap className={`w-4 h-4 ${is30MinOnly ? 'fill-slate-950 text-slate-950' : 'text-amber-500 fill-amber-400'}`} />
              <span>{is30MinOnly ? '✓ 30-Min Delivery Active' : '⚡ 30-Min Delivery Only'}</span>
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}
