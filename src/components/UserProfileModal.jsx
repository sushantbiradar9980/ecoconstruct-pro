import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Award, 
  Package, 
  CheckCircle2, 
  LogOut, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  Edit3,
  Leaf
} from 'lucide-react';

export default function UserProfileModal({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  onOpenOrders,
  ordersCount = 0
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    address: profile?.address || ''
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address || ''
      });
    }
    setIsEditing(!profile?.isSignedIn);
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = {
      ...profile,
      isSignedIn: true,
      name: formData.name.trim() || 'Marcus Vance',
      email: formData.email.trim() || 'marcus.vance@greenbuilders.org',
      phone: formData.phone.trim() || '+1 (555) 234-8900',
      address: formData.address.trim() || '742 Evergreen Eco-Way, Suite 400, Seattle, WA 98101',
      ecoPoints: profile?.ecoPoints || 480,
      ecoTier: profile?.ecoTier || 'Emerald Architect'
    };

    onSaveProfile(updated);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleSignOut = () => {
    const guestProfile = {
      ...profile,
      isSignedIn: false,
      name: 'Guest Builder',
      email: '',
      phone: '',
      address: ''
    };
    onSaveProfile(guestProfile);
    setIsEditing(true);
  };

  const getInitials = (name) => {
    if (!name) return 'GB';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Surface */}
      <div className="relative w-full max-w-lg bg-white border border-emerald-100 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 via-teal-50/40 to-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center shadow-md shadow-emerald-600/20">
              {profile?.isSignedIn ? getInitials(profile.name) : <User className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                  {profile?.isSignedIn ? profile.name : 'Sign In / Account'}
                </h2>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  profile?.isSignedIn
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border-amber-300'
                }`}>
                  {profile?.isSignedIn ? 'Active Builder' : 'Guest'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {profile?.isSignedIn ? 'Member since 2026 • Verified LEED Professional' : 'Sign in to sync your saved job sites & eco-points'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors touch-target"
            aria-label="Close profile modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-slate-800">
          
          {/* Eco Loyalty Points & Carbon Rewards Overview Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-700/20 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-emerald-100 font-semibold">
                <Award className="w-4 h-4 text-amber-300" />
                <span>Loyalty Eco-Credits</span>
              </div>
              <div className="text-2xl font-black tracking-tight">
                {profile?.ecoPoints || 480} <span className="text-xs font-normal text-emerald-200">Green Points</span>
              </div>
              <div className="text-[11px] text-emerald-100/90 font-medium">
                Tier: <strong>{profile?.ecoTier || 'Emerald Architect'}</strong> (5% Auto-Rebate on Checkout)
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-bold border border-white/20">
                ${((profile?.ecoPoints || 480) * 0.05).toFixed(2)} Credit
              </span>
            </div>
          </div>

          {/* Quick Shortcut to 'My Orders' */}
          <button
            onClick={() => {
              onClose();
              if (onOpenOrders) onOpenOrders();
            }}
            className="w-full p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 flex items-center justify-between text-left transition-all group touch-target"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-800 flex items-center gap-1.5">
                  <span>My Orders & Live Logistics Tracking</span>
                  <span className="bg-emerald-200 text-emerald-900 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                    {ordersCount}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Track 5-stage zero-emission dispatch & verified LEED invoices
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Profile Details or Sign-In Form */}
          {!isEditing && profile?.isSignedIn ? (
            <div className="space-y-3.5 border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Contact & Delivery Details
                </h3>
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-1 text-xs text-emerald-700 font-bold hover:underline"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center gap-2.5 text-slate-700">
                  <User className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="font-semibold text-slate-900">{profile.name}</span>
                </div>

                <div className="flex items-center gap-2.5 text-slate-700">
                  <Mail className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="truncate">{profile.email}</span>
                </div>

                <div className="flex items-center gap-2.5 text-slate-700">
                  <Phone className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{profile.phone}</span>
                </div>

                <div className="flex items-start gap-2.5 text-slate-700 pt-1 border-t border-slate-200/70">
                  <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 block">Saved Job Site / Delivery Address:</span>
                    <span className="text-slate-600">{profile.address}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5 border border-emerald-100 rounded-2xl p-4 bg-white">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-xs font-bold text-slate-800">
                  {profile?.isSignedIn ? 'Update Builder Profile' : 'Sign In with Builder Credentials'}
                </h3>
                {profile?.isSignedIn && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="text-xs text-slate-500 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Full Name / Company Representative
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Marcus Vance"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="marcus.vance@greenbuilders.org"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 234-8900"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Saved Delivery Address (Job Site)
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <textarea
                    rows={2}
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="742 Evergreen Eco-Way, Suite 400, Seattle, WA 98101"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/30 transition-all touch-target"
              >
                {profile?.isSignedIn ? 'Save Changes' : 'Sign In & Save Credentials'}
              </button>
            </form>
          )}

          {saveSuccess && (
            <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Profile credentials saved to localStorage!</span>
            </div>
          )}

          {/* Environmental LEED Compliance Badge */}
          <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center gap-2.5 text-xs text-emerald-900">
            <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <span className="font-bold">Zero-Knowledge Local Storage</span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Credentials persist locally in your browser so you are recognized automatically.
              </p>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/90 flex items-center justify-between">
          {profile?.isSignedIn ? (
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-semibold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          ) : (
            <span className="text-xs text-slate-400">Guest Session Active</span>
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors touch-target ml-auto"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
