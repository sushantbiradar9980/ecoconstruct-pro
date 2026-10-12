import React from 'react';
import { Filter, Star, Check, X } from 'lucide-react';
import { CATEGORIES, CERTIFICATIONS } from '../data/defaultProducts';

export default function FilterBar({
  selectedCategory,
  setSelectedCategory,
  minRating,
  setMinRating,
  selectedCertifications,
  setSelectedCertifications,
  sortBy,
  setSortBy,
  totalResults,
  categories = CATEGORIES
}) {
  const toggleCert = (cert) => {
    if (selectedCertifications.includes(cert)) {
      setSelectedCertifications(selectedCertifications.filter(c => c !== cert));
    } else {
      setSelectedCertifications([...selectedCertifications, cert]);
    }
  };

  const clearAllFilters = () => {
    setSelectedCategory('All');
    setMinRating(0);
    setSelectedCertifications([]);
  };

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    minRating > 0 ||
    selectedCertifications.length > 0;

  return (
    <div className="bg-white/95 backdrop-blur-md border-b border-emerald-100 sticky top-16 sm:top-20 z-30 py-3 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
          <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 flex-shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5 text-emerald-600" />
            <span>Category:</span>
          </span>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all touch-target flex-shrink-0 border ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50 hover:border-emerald-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Rating, Certifications and Sorting */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">

            {/* Dynamic Eco-Rating Threshold Filters */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
              <span className="text-slate-600 font-semibold flex items-center gap-1 mr-0.5">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                <span>Rating:</span>
              </span>

              <button
                onClick={() => setMinRating(0)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  minRating === 0
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                All
              </button>

              <button
                onClick={() => setMinRating(4.5)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-0.5 ${
                  minRating === 4.5
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <span>4.5+ ★</span>
              </button>

              <button
                onClick={() => setMinRating(4.0)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-0.5 ${
                  minRating === 4.0
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <span>4.0+ ★</span>
              </button>
            </div>

            {/* Certification Filters */}
            <div className="hidden lg:flex items-center gap-1.5">
              {CERTIFICATIONS.slice(0, 3).map((cert) => {
                const active = selectedCertifications.includes(cert);

                return (
                  <button
                    key={cert}
                    onClick={() => toggleCert(cert)}
                    className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1 ${
                      active
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-emerald-50'
                    }`}
                  >
                    {active && <Check className="w-3 h-3 text-emerald-600" />}
                    <span>{cert}</span>
                  </button>
                );
              })}
            </div>

            {/* Reset Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1 text-slate-600 hover:text-rose-600 transition-colors ml-1 font-semibold"
                title="Clear Filters"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Results Count and Sorting */}
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-slate-600">
              Showing <strong className="text-slate-900 font-bold">{totalResults}</strong> eco materials
            </span>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

        </div>

      </div>
    </div>
  );
}