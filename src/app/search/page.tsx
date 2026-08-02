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

  const [workers, setWorkers] = useState<Worker[]>(() => {
    initializeStore();
    return getWorkers();
  });
  const [categories, setCategories] = useState<Category[]>(() => getCategories());

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    const categoryParam = searchParams.get('category');
    return categoryParam ? [categoryParam] : [];
  });
  const [selectedCity, setSelectedCity] = useState<string>(() => searchParams.get('city') || '');
  const [selectedArea, setSelectedArea] = useState<string>(() => searchParams.get('area') || '');
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
    <div className="min-h-screen flex flex-col bg-[#F7F8F5] text-[#0B0E12] font-body">
      <Navbar />

      {/* Top Banner & Quick Controls */}
      <div className="bg-white border-b border-[#EAECE7] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#0B0E12]">
              Mahir Kaarigar Search (Skilled Workers)
            </h1>
            <p className="text-xs text-[#666E7A] mt-1 font-medium">
              Showing {filteredWorkers.length} verified & rating-backed service providers across Pakistan
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSmartSearchOpen(true)}
              className="btn btn-lime text-xs py-2 px-3.5 font-bold"
            >
              <Sparkles size={15} />
              <span>AI Smart Search</span>
            </button>

            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden btn btn-secondary text-xs py-2 px-3.5 font-bold"
            >
              <SlidersHorizontal size={15} />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout: Filters Sidebar + Results Grid */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block space-y-6 bg-white p-6 rounded-[26px] border border-[#EAECE7] h-fit sticky top-24 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-[#EAECE7]">
              <span className="font-heading font-extrabold text-sm text-[#0B0E12] flex items-center gap-2">
                <Filter size={16} className="text-[#1FB863]" />
                Filter Search
              </span>
              <button
                onClick={handleResetFilters}
                className="text-xs text-[#1FB863] font-bold hover:underline flex items-center gap-1"
              >
                <RefreshCcw size={12} /> Reset All
              </button>
            </div>

            {/* Keyword Search Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#0B0E12] font-heading">
                Search Keyword
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Tariq, UPS, Inverter AC..."
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-[#EAECE7] focus:outline-none focus:border-[#0B0E12] text-[#0B0E12] bg-[#F7F8F5] font-medium"
                />
                <Search size={14} className="absolute left-3 top-3 text-[#666E7A]" />
              </div>
            </div>

            {/* CNIC Verified Toggle */}
            <div className="pt-3 border-t border-[#EAECE7] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#0B0E12] block font-heading">Verified Only</span>
                <span className="text-[11px] text-[#666E7A] font-medium">CNIC verified workers</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1FB863]"></div>
              </label>
            </div>

            {/* Category Checkboxes */}
            <div className="pt-3 border-t border-[#EAECE7]">
              <label className="block text-xs font-bold text-[#0B0E12] font-heading mb-2.5">
                Categories
              </label>
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {categories.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-2.5 text-xs text-[#0B0E12] cursor-pointer hover:text-[#1FB863] font-medium">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.name)}
                      onChange={() => handleCategoryToggle(cat.name)}
                      className="rounded border-[#EAECE7] text-[#1FB863] focus:ring-[#1FB863] w-4 h-4"
                    />
                    <span>{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* City Dropdown */}
            <div className="pt-3 border-t border-[#EAECE7] space-y-1.5">
              <label className="block text-xs font-bold text-[#0B0E12] font-heading">
                City / Location
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-[#EAECE7] focus:outline-none focus:border-[#0B0E12] bg-[#F7F8F5] font-medium text-[#0B0E12]"
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
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#0B0E12] font-heading">
                Area / Neighborhood
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  placeholder="e.g. Gulshan, DHA, F-8"
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-[#EAECE7] focus:outline-none focus:border-[#0B0E12] text-[#0B0E12] bg-[#F7F8F5] font-medium"
                />
                <MapPin size={14} className="absolute left-3 top-3 text-[#666E7A]" />
              </div>
            </div>

            {/* Minimum Rating Selector */}
            <div className="pt-3 border-t border-[#EAECE7]">
              <label className="block text-xs font-bold text-[#0B0E12] font-heading mb-2">
                Minimum Rating
              </label>
              <div className="flex items-center gap-1.5">
                {[0, 4.0, 4.5, 4.8].map((ratingVal) => (
                  <button
                    key={ratingVal}
                    onClick={() => setMinRating(ratingVal)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${
                      minRating === ratingVal
                        ? 'bg-[#0B0E12] text-[#39E07A] border-[#0B0E12]'
                        : 'bg-[#F7F8F5] text-[#0B0E12] border-[#EAECE7] hover:bg-gray-100'
                    }`}
                  >
                    {ratingVal === 0 ? 'Any' : `${ratingVal}+ ★`}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Slider */}
            <div className="pt-3 border-t border-[#EAECE7]">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-[#0B0E12] font-heading">Max Rate</label>
                <span className="text-xs font-extrabold text-[#0B0E12]">Rs. {maxPrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={500}
                max={10000}
                step={500}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#0B0E12]"
              />
            </div>
          </aside>

          {/* Main Area: Top controls + Worker Grid */}
          <main className="lg:col-span-3 space-y-6">
            {/* Top Sort Bar */}
            <div className="bg-white p-4 rounded-[20px] border border-[#EAECE7] flex items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-2 text-xs text-[#666E7A] flex-wrap font-body">
                <span className="font-bold text-[#0B0E12] font-heading">Active Filters:</span>
                {selectedCategories.map((c) => (
                  <span
                    key={c}
                    className="bg-[#D6F5E3] text-[#1FB863] px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 border border-[#1FB863]/20"
                  >
                    {c}
                    <X size={12} className="cursor-pointer hover:text-[#0B0E12]" onClick={() => handleCategoryToggle(c)} />
                  </span>
                ))}
                {selectedCity && (
                  <span className="bg-[#D6F5E3] text-[#1FB863] px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 border border-[#1FB863]/20">
                    {selectedCity}
                    <X size={12} className="cursor-pointer hover:text-[#0B0E12]" onClick={() => setSelectedCity('')} />
                  </span>
                )}
                {verifiedOnly && (
                  <span className="bg-[#D6F5E3] text-[#1FB863] px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 border border-[#1FB863]/20">
                    Verified
                    <X size={12} className="cursor-pointer hover:text-[#0B0E12]" onClick={() => setVerifiedOnly(false)} />
                  </span>
                )}
                {!selectedCategories.length && !selectedCity && !verifiedOnly && (
                  <span className="text-[#666E7A]">None (Showing all)</span>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-[#666E7A] font-medium hidden sm:inline">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="p-2 text-xs rounded-xl border border-[#EAECE7] focus:outline-none focus:border-[#0B0E12] bg-[#F7F8F5] font-bold text-[#0B0E12]"
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
              <div className="bg-white rounded-[26px] p-12 text-center border border-[#EAECE7] space-y-4 max-w-md mx-auto my-8 shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-[#0B0E12] text-[#39E07A] mx-auto flex items-center justify-center -rotate-6">
                  <Search size={28} />
                </div>
                <h3 className="text-lg font-heading font-extrabold text-[#0B0E12]">
                  Koi Kaarigar Nahi Mila
                </h3>
                <p className="text-xs text-[#666E7A] font-medium leading-relaxed">
                  Aapke select kiye gaye filters ya city mein filhaal koi worker available nahi hai. Filter change kar k dobara search karein.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="btn btn-primary text-xs py-2.5 px-5 font-bold"
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
