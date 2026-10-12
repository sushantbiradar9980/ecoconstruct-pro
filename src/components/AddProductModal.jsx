import React, { useState } from 'react';
import { 
  X, 
  PlusCircle, 
  Star, 
  Image as ImageIcon, 
  Camera, 
  Upload, 
  Check, 
  Sparkles, 
  AlertCircle,
  Leaf,
  ShieldCheck
} from 'lucide-react';
import { CATEGORIES, CERTIFICATIONS, DEFAULT_FALLBACK_IMAGE } from '../data/defaultProducts';

export default function AddProductModal({
  isOpen,
  onClose,
  onAddProduct,
  currentCurrency
}) {
  const availableCategories = CATEGORIES.filter(c => c !== 'All');

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Timber & Wood');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('sq.m');
  const [ecoRating, setEcoRating] = useState(5);
  const [selectedCerts, setSelectedCerts] = useState(['FSC Certified', 'Carbon Neutral']);
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  
  // Technical Specifications State
  const [dimensions, setDimensions] = useState('');
  const [embodiedCarbon, setEmbodiedCarbon] = useState('');
  const [durability, setDurability] = useState('');
  const [leedContribution, setLeedContribution] = useState('');
  const [warranty, setWarranty] = useState('20-Year Manufacturer Warranty');

  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const handleToggleCert = (cert) => {
    if (selectedCerts.includes(cert)) {
      setSelectedCerts(selectedCerts.filter(c => c !== cert));
    } else {
      setSelectedCerts([...selectedCerts, cert]);
    }
  };

  // Native camera / photo gallery upload handler
  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormError('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = event.target?.result;
      if (base64Data) {
        setImageUrl(base64Data);
        setFormError('');
      }
    };
    reader.onerror = () => {
      setFormError('Failed to read image file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleAutoFillSample = () => {
    setTitle('Bio-Based Hempcrete Wall Blocks');
    setCategory('Insulation');
    setPrice('38.00');
    setUnit('block');
    setEcoRating(5);
    setSelectedCerts(['Carbon Neutral', 'VOC-Free', 'LEED Compliant']);
    setImageUrl('https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80');
    setDescription('Ultra-insulating, vapor-permeable lightweight hemp-lime modular masonry blocks offering net-negative embodied carbon for exterior building envelopes.');
    setDimensions('300mm x 200mm x 150mm');
    setEmbodiedCarbon('-36 kg CO₂e / m² net carbon sink');
    setDurability('Compressive Strength 1.5 MPa / 2-Hour Fire Rating');
    setLeedContribution('MR Credit 6 & EA Credit 1 Energy Optimization');
    setWarranty('50-Year Structural Durability');
    setFormError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setFormError('Please enter a product title.');
      return;
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setFormError('Please enter a valid unit price greater than 0.');
      return;
    }

    // Convert price to base USD if user entered in INR
    const finalPriceUsd = currentCurrency === 'INR' ? (parsedPrice / 83.0) : parsedPrice;

    const newProduct = {
      id: `prod-custom-${Date.now()}`,
      title: title.trim(),
      category,
      price: parseFloat(finalPriceUsd.toFixed(2)),
      unit: unit || 'unit',
      ecoRating: Number(ecoRating) || 5.0,
      rating: Number(ecoRating) || 5.0,
      reviewsCount: 1,
      carbonSavedPerUnit: 15.0,
      certifications: selectedCerts,
      imageUrl: imageUrl.trim() || DEFAULT_FALLBACK_IMAGE,
      description: description.trim() || 'High-performance eco-friendly architectural building material.',
      specs: {
        dimensions: dimensions.trim() || 'Standard Commercial Dimensions',
        embodiedCarbon: embodiedCarbon.trim() || 'Verified Low-Embodied Carbon',
        durability: durability.trim() || 'Commercial Grade Heavy Duty',
        finish: 'Eco-Certified Non-Toxic Surface',
        leedContribution: leedContribution.trim() || 'Contributes to LEED v4.1 Materials Credits',
        warranty: warranty.trim() || '15-Year Standard Commercial Warranty'
      },
      stock: 100,
      isCustom: true,
      createdAt: new Date().toISOString()
    };

    onAddProduct(newProduct);
    onClose();

    // Reset Form
    setTitle('');
    setPrice('');
    setDescription('');
    setImageUrl('');
    setDimensions('');
    setEmbodiedCarbon('');
    setDurability('');
    setLeedContribution('');
    setFormError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white border border-emerald-100 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-emerald-100 bg-emerald-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/10 text-emerald-700 flex items-center justify-center">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                Add New Eco Product
              </h2>
              <p className="text-xs text-slate-500">
                Register sustainable building materials into the live catalog
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAutoFillSample}
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-100/80 text-emerald-800 border border-emerald-200 text-xs font-semibold hover:bg-emerald-200/80 transition-colors"
              title="Populate with sample data"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sample Demo Data</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors touch-target"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 text-slate-800">
          
          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
              <span>{formError}</span>
            </div>
          )}

          {/* Product Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Product Title <span className="text-emerald-600">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Compressed Straw Acoustic Wall Panel"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Category, Price and Unit Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Category Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Category <span className="text-emerald-600">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Unit Price */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Unit Price ({currentCurrency === 'USD' ? '$ USD' : '₹ INR'}) <span className="text-emerald-600">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">
                  {currentCurrency === 'USD' ? '$' : '₹'}
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0.1"
                  required
                  placeholder="45.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Unit of Measure */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Unit Metric
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="sq.m">sq.m (Square Meter)</option>
                <option value="sq.ft">sq.ft (Square Foot)</option>
                <option value="panel">panel</option>
                <option value="bundle">bundle</option>
                <option value="block">block</option>
                <option value="linear ft">linear ft</option>
                <option value="ton">ton</option>
              </select>
            </div>

          </div>

          {/* Eco-Rating Picker (1 to 5 Stars) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Eco-Rating ({ecoRating} / 5 Stars) <span className="text-emerald-600">*</span>
            </label>
            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setEcoRating(star)}
                  className="p-1.5 rounded-lg hover:scale-110 transition-transform touch-target"
                  title={`${star} Star Eco-Rating`}
                >
                  <Star
                    className={`w-6 h-6 transition-colors ${
                      star <= ecoRating
                        ? 'text-amber-500 fill-amber-400'
                        : 'text-slate-300 hover:text-slate-400'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs text-slate-600 ml-2 font-medium">
                {ecoRating === 5 && '🌟 Maximum Circular & Low-Carbon Performance'}
                {ecoRating === 4 && '🌿 High Sustainability Standard'}
                {ecoRating <= 3 && '🍃 Eco-Compliant'}
              </span>
            </div>
          </div>

          {/* Sustainability Certifications (Checkboxes) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Sustainability Certifications
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CERTIFICATIONS.map((cert) => {
                const checked = selectedCerts.includes(cert);

                return (
                  <label
                    key={cert}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer select-none transition-colors ${
                      checked
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-emerald-50/50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleToggleCert(cert)}
                      className="sr-only"
                    />
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                        checked
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-400 bg-white'
                      }`}
                    >
                      {checked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="text-xs">{cert}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Native Image Upload & URL input with Preview */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Product Image (Upload Photo or URL)
              </label>
              <button
                type="button"
                onClick={() => setImageUrl(DEFAULT_FALLBACK_IMAGE)}
                className="text-xs text-emerald-700 font-semibold hover:underline flex items-center gap-1"
              >
                <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                Use Eco Stock Image
              </button>
            </div>

            {/* Hidden native input for camera/photos */}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              id="product-image-upload"
              onChange={handleImageFileChange}
              className="hidden"
            />

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <label
                  htmlFor="product-image-upload"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer shadow-xs transition-colors touch-target"
                >
                  <Camera className="w-4 h-4" />
                  <span>📷 Take Photo / Upload File</span>
                </label>
                <span className="text-xs text-slate-400">or enter an image URL below:</span>
              </div>

              <div className="flex gap-3">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <div className="w-12 h-11 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Preview"
                      onError={(e) => {
                        e.target.src = DEFAULT_FALLBACK_IMAGE;
                      }}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Short Description
            </label>
            <textarea
              rows={2}
              placeholder="Highlight circular lifecycle, thermal insulation, or structural benefits..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Technical Specifications Section */}
          <div className="pt-2 border-t border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Technical Specifications (Optional)
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Dimensions / Sizing</label>
                <input
                  type="text"
                  placeholder="e.g. 1200mm x 600mm x 25mm"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Embodied Carbon Metric</label>
                <input
                  type="text"
                  placeholder="e.g. -12 kg CO₂e / unit"
                  value={embodiedCarbon}
                  onChange={(e) => setEmbodiedCarbon(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Durability / Strength</label>
                <input
                  type="text"
                  placeholder="e.g. Heavy Commercial Rating"
                  value={durability}
                  onChange={(e) => setDurability(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">LEED v4.1 Contribution</label>
                <input
                  type="text"
                  placeholder="e.g. MR Credit 2 & EQ Credit 2"
                  value={leedContribution}
                  onChange={(e) => setLeedContribution(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold transition-colors touch-target"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/30 flex items-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98] touch-target"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publish to Catalog</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
