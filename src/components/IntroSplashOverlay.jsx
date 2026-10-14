import React, { useState, useEffect } from 'react';
import { Leaf, Sparkles, ArrowRight, X } from 'lucide-react';

export default function IntroSplashOverlay() {
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Check if user has already seen intro during this browser session
    const hasSeen = sessionStorage.getItem('hasSeenIntro') || sessionStorage.getItem('ecoconstruct_has_seen_intro');
    if (!hasSeen) {
      setIsVisible(true);

      // Auto dismiss after 1.8 seconds (within the 1.5 - 2s requirement)
      const timer = setTimeout(() => {
        handleDismiss();
      }, 1800);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsFadingOut(true);
    sessionStorage.setItem('hasSeenIntro', 'true');
    sessionStorage.setItem('ecoconstruct_has_seen_intro', 'true');
    setTimeout(() => {
      setIsVisible(false);
    }, 450);
  };

  if (!isVisible) return null;

  return (
    <div 
      onClick={handleDismiss}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-between p-6 bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 text-white select-none transition-opacity duration-500 cursor-pointer overflow-hidden ${
        isFadingOut ? 'opacity-0 pointer-events-none scale-102' : 'opacity-100'
      }`}
    >
      {/* Ambient Radial Glow & Moving Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse" />
        
        {/* Floating eco leaves animation */}
        <div className="absolute top-1/4 left-10 text-emerald-400/40 animate-bounce" style={{ animationDuration: '3s' }}>
          <Leaf className="w-8 h-8 rotate-45" />
        </div>
        <div className="absolute top-1/3 right-12 text-teal-400/30 animate-bounce" style={{ animationDuration: '4s' }}>
          <Leaf className="w-6 h-6 -rotate-12" />
        </div>
        <div className="absolute bottom-1/4 left-1/4 text-emerald-400/30 animate-bounce" style={{ animationDuration: '3.5s' }}>
          <Leaf className="w-5 h-5 rotate-90" />
        </div>
      </div>

      {/* Top Header Row with Skip Button */}
      <div className="w-full max-w-4xl flex items-center justify-between z-10 pt-2">
        <div className="flex items-center gap-2 text-emerald-400/80 text-xs font-semibold tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Circular Building Platform</span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDismiss();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-white/90 font-medium backdrop-blur-md transition-all touch-target"
        >
          <span>Skip</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Centerpiece: Animated Character Walking with Shopping Basket / Carrying Eco Materials */}
      <div className="flex flex-col items-center justify-center my-auto z-10 space-y-6 text-center max-w-md w-full">
        
        {/* Animated SVG Scene */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
          
          {/* Subtle pulsating backdrop aura */}
          <div className="absolute inset-4 rounded-full bg-emerald-500/15 filter blur-xl animate-ping" style={{ animationDuration: '2s' }} />
          <div className="absolute inset-8 rounded-full border border-emerald-500/30 animate-spin" style={{ animationDuration: '12s' }} />

          {/* Person walking with basket & eco materials SVG */}
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full drop-shadow-[0_10px_25px_rgba(16,185,129,0.35)]"
          >
            <defs>
              <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F5D0A9" />
                <stop offset="100%" stopColor="#D8A070" />
              </linearGradient>
              <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
              <linearGradient id="basketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#92400E" />
              </linearGradient>
              <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34D399" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>

            {/* Ground Motion Lines */}
            <g opacity="0.6">
              <line x1="20" y1="172" x2="180" y2="172" stroke="#34D399" strokeWidth="2" strokeDasharray="16 10">
                <animate attributeName="stroke-dashoffset" from="0" to="-52" dur="0.8s" repeatCount="indefinite" />
              </line>
              <line x1="40" y1="178" x2="160" y2="178" stroke="#059669" strokeWidth="1.5" strokeDasharray="8 8">
                <animate attributeName="stroke-dashoffset" from="0" to="-32" dur="0.6s" repeatCount="indefinite" />
              </line>
            </g>

            {/* Walking Character Group with Natural Bobbing */}
            <g transform="translate(10, 0)">
              <animateTransform
                attributeName="transform"
                type="translate"
                values="10,0; 10,-5; 10,0"
                dur="0.6s"
                repeatCount="indefinite"
              />

              {/* Back Leg (Swings Back and Forth) */}
              <g>
                <line x1="95" y1="125" x2="82" y2="170" stroke="#334155" strokeWidth="8" strokeLinecap="round">
                  <animate attributeName="x2" values="82; 114; 82" dur="0.6s" repeatCount="indefinite" />
                </line>
                {/* Back Shoe */}
                <ellipse cx="80" cy="170" rx="9" ry="4" fill="#0F172A">
                  <animate attributeName="cx" values="80; 116; 80" dur="0.6s" repeatCount="indefinite" />
                </ellipse>
              </g>

              {/* Torso / Eco Jacket */}
              <rect x="85" y="75" width="28" height="52" rx="10" fill="url(#bodyGrad)" />
              {/* Belt & Tool Holster */}
              <line x1="85" y1="120" x2="113" y2="120" stroke="#064E3B" strokeWidth="4" />
              <rect x="94" y="117" width="10" height="7" rx="2" fill="#F59E0B" />

              {/* Front Leg (Swings in Opposition) */}
              <g>
                <line x1="102" y1="125" x2="118" y2="170" stroke="#1E293B" strokeWidth="8.5" strokeLinecap="round">
                  <animate attributeName="x2" values="118; 80; 118" dur="0.6s" repeatCount="indefinite" />
                </line>
                {/* Front Shoe */}
                <ellipse cx="120" cy="170" rx="9" ry="4" fill="#022C22">
                  <animate attributeName="cx" values="120; 78; 120" dur="0.6s" repeatCount="indefinite" />
                </ellipse>
              </g>

              {/* Head & Eco Hardhat / Cap */}
              <circle cx="98" cy="52" r="14" fill="url(#skinGrad)" />
              {/* Hardhat in Emerald / Amber */}
              <path d="M84 48 C84 34 114 34 114 48 Z" fill="#F59E0B" />
              <rect x="80" y="47" width="38" height="4" rx="2" fill="#D97706" />

              {/* Back Arm holding materials */}
              <path d="M90 85 Q75 105 85 118" stroke="url(#bodyGrad)" strokeWidth="6" strokeLinecap="round" fill="none" />

              {/* Shopping Basket & Sustainable Materials Carried */}
              <g transform="translate(108, 92)">
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values="108,92; 108,96; 108,92"
                  dur="0.6s"
                  repeatCount="indefinite"
                />

                {/* Basket Handle */}
                <path d="M-8 0 Q10 -22 28 0" stroke="#78350F" strokeWidth="3" fill="none" />

                {/* Bamboo / Timber Planks protruding from basket */}
                <rect x="-4" y="-28" width="7" height="32" rx="2" fill="#D97706" transform="rotate(-15)" />
                <rect x="8" y="-32" width="7" height="34" rx="2" fill="#B45309" transform="rotate(8)" />
                <rect x="18" y="-24" width="6" height="26" rx="2" fill="#FBBF24" transform="rotate(22)" />

                {/* Young Sapling / Green Plant growing out of basket */}
                <path d="M6 -18 Q-4 -30 -10 -28 Q-2 -20 6 -18 Z" fill="url(#leafGrad)" />
                <path d="M8 -22 Q18 -32 24 -28 Q16 -18 8 -22 Z" fill="url(#leafGrad)" />

                {/* Woven Basket Body */}
                <path d="M-10 0 L-6 26 L26 26 L30 0 Z" fill="url(#basketGrad)" />
                {/* Woven Cross-Hatch Pattern */}
                <line x1="-8" y1="8" x2="28" y2="8" stroke="#78350F" strokeWidth="1.5" />
                <line x1="-7" y1="16" x2="27" y2="16" stroke="#78350F" strokeWidth="1.5" />
                <line x1="2" y1="2" x2="0" y2="24" stroke="#78350F" strokeWidth="1.5" />
                <line x1="18" y1="2" x2="20" y2="24" stroke="#78350F" strokeWidth="1.5" />
              </g>

              {/* Front Arm grasping the basket handle */}
              <path d="M104 85 Q115 100 114 106" stroke="url(#bodyGrad)" strokeWidth="6" strokeLinecap="round" fill="none" />
              <circle cx="114" cy="106" r="3.5" fill="url(#skinGrad)" />
            </g>
          </svg>
        </div>

        {/* Brand Logo & Fade-in Typography */}
        <div className="space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-lg shadow-emerald-500/30 mb-1">
            <Leaf className="w-7 h-7 stroke-[2.3]" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center justify-center gap-1.5">
            <span>EcoConstruct</span>
            <span className="text-emerald-400 font-black">Pro</span>
          </h1>

          {/* Required Tagline */}
          <p className="text-sm sm:text-base font-semibold text-emerald-300/90 tracking-wide">
            EcoConstruct Pro: Sustainable Building
          </p>

          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Zero-emission logistics & certified low-carbon construction materials
          </p>
        </div>

      </div>

      {/* Bottom Progress Bar: 0% to 100% in 1.8s */}
      <div className="w-full max-w-xs z-10 pb-4 text-center space-y-2">
        <div className="w-full h-1 bg-white/15 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full transition-all ease-linear"
            style={{
              width: isFadingOut ? '100%' : '100%',
              transitionDuration: '1.8s'
            }}
          />
        </div>
        <div className="text-[11px] text-slate-400 font-medium">
          Tap anywhere to continue
        </div>
      </div>
    </div>
  );
}
