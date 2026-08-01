'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { WorkerCard } from '@/components/worker-card';
import { BookingModal } from '@/components/booking-modal';
import { SmartSearchModal } from '@/components/smart-search-modal';
import { getCategories, getWorkers, initializeStore } from '@/lib/store';
import { Worker, Category, SmartSearchParsed } from '@/lib/types';
import {
  Search,
  Filter,
  SlidersHorizontal,
  CheckCircle2,
  Star,
  X,
  Sparkles,
  RefreshCcw,
  MapPin,
} from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();

  const [workers, setWorkers] = useState<Worker[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [minRating, setMinRating] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'newest'>('rating');

  // Mobile sidebar filter open/close
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Modals
  const [selectedWorkerForBooking, setSelectedWorkerForBooking] = useState<Worker | null>(null);
  const [isSmartSearchOpen, setIsSmartSearchOpen] = useState<boolean>(false);

  useEffect(() => {
    initializeStore();
    setWorkers(getWorkers());
    setCategories(getCategories());

    // Read initial query params
    const categoryParam = searchParams.get('category');
    const cityParam = searchParams.get('city');
    const areaParam = searchParams.get('area');

    if (categoryParam) {
      setSelectedCategories([categoryParam]);
    }
    if (cityParam) {
      setSelectedCity(cityParam);
    }
    if (areaParam) {
      setSelectedArea(areaParam);
    }
  }, [searchParams]);

  const handleCategoryToggle = (catName: string) => {
    if (selectedCategories.includes(catName)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== catName));
    } else {
      setSelectedCategories([...selectedCategories, catName]);
    }
  };

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setSelectedCity('');
    setSelectedArea('');
    setMinRating(0);
    setMaxPrice(10000);
    setVerifiedOnly(false);
    setSearchQuery('');
    setSortBy('rating');
  };

  const handleApplySmartSearch = (parsed: SmartSearchParsed) => {
    if (parsed.category) {
      setSelectedCategories([parsed.category]);
    }
    if (parsed.city) {
      setSelectedCity(parsed.city);
    }
    if (parsed.area) {
      setSelectedArea(parsed.area);
    }
  };

  // Filter and sort workers
  const filteredWorkers = useMemo(() => {
    return workers
      .filter((w) => {
        // Category filter
        if (selectedCategories.length > 0 && !selectedCategories.includes(w.category)) {
          return false;
        }
        // City filter
        if (selectedCity && w.city.toLowerCase() !== selectedCity.toLowerCase()) {
          return false;
        }
        // Area filter
        if (
          selectedArea &&
          !w.area.toLowerCase().includes(selectedArea.toLowerCase()) &&
          !w.city.toLowerCase().includes(selectedArea.toLowerCase())
        ) {
          return false;
        }
        // Minimum rating filter
        if (minRating > 0 && w.average_rating < minRating) {
          return false;
        }
        // Max price filter
        if (w.rate_amount > maxPrice) {
          return false;
        }
        // Verified only
        if (verifiedOnly && !w.is_verified) {
          return false;
        }
        // Search text query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = w.name.toLowerCase().includes(q);
          const matchCategory = w.category.toLowerCase().includes(q);
          const matchCity = w.city.toLowerCase().includes(q);
          const matchArea = w.area.toLowerCase().includes(q);
          const matchBio = w.bio.toLowerCase().includes(q);
          if (!matchName && !matchCategory && !matchCity && !matchArea && !matchBio) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') {
          return b.average_rating - a.average_rating;
        } else if (sortBy === 'price') {
          return a.rate_amount - b.rate_amount;
        } else {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
      });
  }, [workers, selectedCategories, selectedCity, selectedArea, minRating, maxPrice, verifiedOnly, searchQuery, sortBy]);

  const citiesList = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad'];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Navbar />

      {/* Top Banner & Quick Controls */}
      <div className="bg-white border-b border-gray-100 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1A1A1A]">
              Mahir Kaarigar Search (Skilled Workers)
            </h1>
            <p className="text-xs text-[#4A4A4A] mt-1">
              Showing {filteredWorkers.length} verified & rating-backed service providers
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsSmartSearchOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-[#1E5AA8]/10 text-[#1E5AA8] hover:bg-[#1E5AA8]/20 text-xs font-bold flex items-center gap-1.5 transition border border-[#1E5AA8]/20"
            >
              <Sparkles size={15} />
              <span>AI Smart Search</span>
            </button>

            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden px-3.5 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-semibold flex items-center gap-1.5"
            >
              <SlidersHorizontal size={15} />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout: Filters Sidebar + Results Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block space-y-6 bg-white p-5 rounded-2xl border border-gray-100 card-shadow h-fit sticky top-20">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <span className="font-bold text-sm text-[#1A1A1A] flex items-center gap-1.5">
                <Filter size={16} className="text-[#1E5AA8]" />
                Filter Search
              </span>
              <button
                onClick={handleResetFilters}
                className="text-[11px] text-[#1E5AA8] font-semibold hover:underline flex items-center gap-1"
              >
                <RefreshCcw size={12} /> Reset All
              </button>
            </div>

            {/* Keyword Search Input */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Search Keyword
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Tariq, UPS, Inverter AC..."
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#1E5AA8]"
                />
                <Search size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
              </div>
            </div>

            {/* CNIC Verified Toggle */}
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#1A1A1A] block">Verified Only</span>
                <span className="text-[10px] text-gray-400">CNIC verified workers</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1E5AA8]"></div>
              </label>
            </div>

            {/* Category Checkboxes */}
            <div className="pt-2 border-t border-gray-100">
              <label className="block text-xs font-bold text-gray-700 mb-2">
                Categories
              </label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {categories.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer hover:text-[#1E5AA8]">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.name)}
                      onChange={() => handleCategoryToggle(cat.name)}
                      className="rounded-xs text-[#1E5AA8] focus:ring-[#1E5AA8]"
                    />
                    <span>{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* City Dropdown */}
            <div className="pt-2 border-t border-gray-100">
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                City / Location
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full p-2 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#1E5AA8] bg-white"
              >
                <option value="">All Pakistan Cities</option>
                {citiesList.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Specific Area text input */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Area / Neighborhood
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  placeholder="e.g. Gulshan, DHA, F-8"
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#1E5AA8]"
                />
                <MapPin size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
              </div>
            </div>

            {/* Minimum Rating Selector */}
            <div className="pt-2 border-t border-gray-100">
              <label className="block text-xs font-bold text-gray-700 mb-2">
                Minimum Rating
              </label>
              <div className="flex items-center gap-1.5">
                {[0, 4.0, 4.5, 4.8].map((ratingVal) => (
                  <button
                    key={ratingVal}
                    onClick={() => setMinRating(ratingVal)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition ${
                      minRating === ratingVal
                        ? 'bg-[#1E5AA8] text-white border-[#1E5AA8]'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {ratingVal === 0 ? 'Any' : `${ratingVal}+ ★`}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Slider */}
            <div className="pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-gray-700">Max Starting Rate</label>
                <span className="text-xs font-bold text-[#1E5AA8]">Rs. {maxPrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={500}
                max={10000}
                step={500}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#1E5AA8]"
              />
            </div>
          </aside>

          {/* Main Area: Top controls + Worker Grid */}
          <main className="lg:col-span-3 space-y-6">
            {/* Top Sort Bar */}
            <div className="bg-white p-3.5 rounded-2xl border border-gray-100 card-shadow flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-gray-600 flex-wrap">
                <span className="font-semibold text-[#1A1A1A]">Active Filters:</span>
                {selectedCategories.map((c) => (
                  <span
                    key={c}
                    className="bg-blue-50 text-[#1E5AA8] px-2 py-0.5 rounded-md text-[11px] font-medium flex items-center gap-1"
                  >
                    {c}
                    <X size={12} className="cursor-pointer" onClick={() => handleCategoryToggle(c)} />
                  </span>
                ))}
                {selectedCity && (
                  <span className="bg-blue-50 text-[#1E5AA8] px-2 py-0.5 rounded-md text-[11px] font-medium flex items-center gap-1">
                    {selectedCity}
                    <X size={12} className="cursor-pointer" onClick={() => setSelectedCity('')} />
                  </span>
                )}
                {verifiedOnly && (
                  <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md text-[11px] font-medium flex items-center gap-1">
                    Verified
                    <X size={12} className="cursor-pointer" onClick={() => setVerifiedOnly(false)} />
                  </span>
                )}
                {!selectedCategories.length && !selectedCity && !verifiedOnly && (
                  <span className="text-gray-400">None (Showing all)</span>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-gray-500 font-medium hidden sm:inline">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="p-1.5 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#1E5AA8] bg-white font-semibold text-[#1A1A1A]"
                >
                  <option value="rating">Rating (High to Low)</option>
                  <option value="price">Price (Low to High)</option>
                  <option value="newest">Newest Workers</option>
                </select>
              </div>
            </div>

            {/* Worker Grid or Empty State */}
            {filteredWorkers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWorkers.map((worker) => (
                  <WorkerCard
                    key={worker.id}
                    worker={worker}
                    onBookClick={(w) => setSelectedWorkerForBooking(w)}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 card-shadow space-y-4 max-w-md mx-auto my-8">
                <div className="w-16 h-16 rounded-full bg-blue-50 text-[#1E5AA8] mx-auto flex items-center justify-center">
                  <Search size={32} />
                </div>
                <h3 className="text-lg font-bold text-[#1A1A1A]">
                  Koi Kaarigar Nahi Mila (No Workers Found)
                </h3>
                <p className="text-xs text-[#4A4A4A] leading-relaxed">
                  Aapke select kiye gaye filters ya city mein filhaal koi worker available nahi hai. Filter change kar k dobara search karein.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 rounded-xl bg-[#1E5AA8] hover:bg-[#174786] text-white font-bold text-xs transition shadow-xs"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-xs h-full p-5 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <span className="font-bold text-base text-[#1A1A1A]">Search Filters</span>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-gray-500">
                <X size={20} />
              </button>
            </div>

            {/* Keyword Search */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Keyword</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Name or service..."
                className="w-full p-2 text-xs rounded-xl border border-gray-200"
              />
            </div>

            {/* Verified toggle */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1A1A1A]">Verified Only</span>
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 text-[#1E5AA8]"
              />
            </div>

            {/* Categories */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Categories</label>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {categories.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.name)}
                      onChange={() => handleCategoryToggle(cat.name)}
                    />
                    <span>{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">City</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full p-2 text-xs rounded-xl border border-gray-200 bg-white"
              >
                <option value="">All Cities</option>
                {citiesList.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-4 flex gap-2">
              <button
                onClick={handleResetFilters}
                className="w-full py-2 rounded-xl border border-gray-300 text-xs font-semibold"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-2 rounded-xl bg-[#1E5AA8] text-white text-xs font-semibold"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />

      <SmartSearchModal
        isOpen={isSmartSearchOpen}
        onClose={() => setIsSmartSearchOpen(false)}
        onApplyParsed={handleApplySmartSearch}
      />

      <BookingModal
        worker={selectedWorkerForBooking}
        isOpen={!!selectedWorkerForBooking}
        onClose={() => setSelectedWorkerForBooking(null)}
      />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center text-sm font-medium text-gray-500">Loading Search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
