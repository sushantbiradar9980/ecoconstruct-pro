import React from 'react';
import { X, Smartphone, Download, Share2, PlusSquare, CheckCircle2, WifiOff, Laptop } from 'lucide-react';

export default function InstallPwaModal({
  isOpen,
  onClose,
  installPrompt,
  onInstallClick
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white border border-emerald-100 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-emerald-100 bg-emerald-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/10 text-emerald-700 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Install EcoConstruct Pro
              </h2>
              <p className="text-xs text-slate-500">
                Standalone Progressive Web App (PWA)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors touch-target"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm text-slate-800">
          
          {/* Main App Preview Banner */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-2 shadow-lg flex items-center justify-center flex-shrink-0">
              <img src="/icons/favicon.svg" alt="App Icon" className="w-full h-full" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">EcoConstruct Pro</h3>
              <p className="text-xs text-slate-600">Fast, offline-ready & mobile-optimized.</p>
              <div className="flex items-center gap-2 mt-1 text-[11px] text-emerald-800 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero app-store download needed</span>
              </div>
            </div>
          </div>

          {/* Native Install Button if supported */}
          {installPrompt && (
            <div>
              <button
                onClick={onInstallClick}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.01] touch-target"
              >
                <Download className="w-5 h-5" />
                <span>Install Standalone App Now</span>
              </button>
            </div>
          )}

          {/* Benefits Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-emerald-700 font-bold flex items-center gap-1.5">
                <WifiOff className="w-3.5 h-3.5" />
                Offline Caching
              </div>
              <p className="text-slate-600 text-[11px]">
                Access technical specs and materials even on remote job sites without internet.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-emerald-700 font-bold flex items-center gap-1.5">
                <Laptop className="w-3.5 h-3.5" />
                Multi-Platform
              </div>
              <p className="text-slate-600 text-[11px]">
                Runs natively on Android, iOS Safari, macOS, Windows, and ChromeOS.
              </p>
            </div>
          </div>

          {/* iOS Manual Instructions */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
              <Share2 className="w-4 h-4 text-emerald-600" />
              How to Install on iOS (Safari):
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-slate-600 text-xs">
              <li>Tap the <strong className="text-slate-800">Share</strong> button at bottom of Safari screen</li>
              <li>Scroll down and tap <strong className="text-slate-800">"Add to Home Screen"</strong></li>
              <li>Tap <strong className="text-slate-800">Add</strong> in top-right corner to launch fullscreen</li>
            </ol>
          </div>

          {/* Android Manual Instructions */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
              <PlusSquare className="w-4 h-4 text-emerald-600" />
              How to Install on Android (Chrome):
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-slate-600 text-xs">
              <li>Tap the <strong className="text-slate-800">three dots (⋮)</strong> menu in Chrome</li>
              <li>Select <strong className="text-slate-800">"Install app"</strong> or <strong className="text-slate-800">"Add to Home screen"</strong></li>
              <li>Confirm prompt to install directly to app drawer</li>
            </ol>
          </div>

        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/80 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold border border-slate-200 transition-colors touch-target"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
