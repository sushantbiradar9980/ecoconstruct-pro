// Time-of-day dynamic theme system for EcoConstruct Pro
// Normalized to clean, consistent light mint/green tints and high-contrast typography
export const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return 'morning';
  } else if (hour >= 12 && hour < 17) {
    return 'afternoon';
  } else {
    return 'evening';
  }
};

export const THEMES = {
  morning: {
    id: 'morning',
    name: 'Morning Fresh',
    tagline: 'Fresh Emerald & Teal Ambient',
    timeRange: '05:00 - 11:59',
    // Ambient clean light mint backgrounds
    bgPage: 'bg-emerald-50/40',
    bgGradient: 'from-emerald-50/70 via-slate-50 to-teal-50/50',
    headerBg: 'bg-white/95 border-emerald-100',
    heroBg: 'bg-gradient-to-b from-emerald-100/40 via-emerald-50/30 to-white',
    // Accents & typography
    accentPrimary: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    accentText: 'text-emerald-700',
    accentGradientText: 'from-emerald-700 via-teal-700 to-emerald-800',
    badgeBg: 'bg-emerald-100/80 text-emerald-800 border-emerald-200',
    glowColor: 'shadow-emerald-500/10',
    cardBorderHover: 'hover:border-emerald-400',
    navPill: 'bg-emerald-100/70 text-emerald-800 border-emerald-200',
    indicatorColor: 'bg-emerald-500',
  },
  afternoon: {
    id: 'afternoon',
    name: 'Solar Afternoon',
    tagline: 'Warm Solar-Amber & Golden Green',
    timeRange: '12:00 - 16:59',
    // Ambient clean light mint/warm backgrounds
    bgPage: 'bg-emerald-50/40',
    bgGradient: 'from-amber-50/50 via-emerald-50/40 to-slate-50',
    headerBg: 'bg-white/95 border-amber-100',
    heroBg: 'bg-gradient-to-b from-amber-100/35 via-emerald-50/30 to-white',
    // Accents & typography
    accentPrimary: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    accentText: 'text-emerald-700',
    accentGradientText: 'from-emerald-800 via-amber-700 to-emerald-700',
    badgeBg: 'bg-amber-100/80 text-amber-800 border-amber-200',
    glowColor: 'shadow-amber-500/10',
    cardBorderHover: 'hover:border-amber-400',
    navPill: 'bg-amber-100/70 text-amber-800 border-amber-200',
    indicatorColor: 'bg-amber-500',
  },
  evening: {
    id: 'evening',
    name: 'Evening Sage',
    tagline: 'Refined Sage & Mint Elegance',
    timeRange: '17:00 - 04:59',
    // Ambient clean light mint backgrounds
    bgPage: 'bg-emerald-50/40',
    bgGradient: 'from-slate-50 via-emerald-50/40 to-teal-50/30',
    headerBg: 'bg-white/95 border-emerald-100',
    heroBg: 'bg-gradient-to-b from-emerald-100/40 via-emerald-50/30 to-white',
    // Accents & typography
    accentPrimary: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    accentText: 'text-emerald-700',
    accentGradientText: 'from-emerald-800 via-teal-700 to-slate-800',
    badgeBg: 'bg-emerald-100/80 text-emerald-800 border-emerald-200',
    glowColor: 'shadow-emerald-900/10',
    cardBorderHover: 'hover:border-teal-400',
    navPill: 'bg-emerald-100/70 text-emerald-800 border-emerald-200',
    indicatorColor: 'bg-emerald-600',
  }
};
