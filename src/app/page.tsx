'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { CategoryIcon } from '@/components/category-icon';
import { WorkerCard } from '@/components/worker-card';
import { SmartSearchModal } from '@/components/smart-search-modal';
import { BookingModal } from '@/components/booking-modal';
import { getCategories, getWorkers, initializeStore } from '@/lib/store';
import { Category, Worker, SmartSearchParsed } from '@/lib/types';
import {
  Search,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Star,
  Users,
  Briefcase,
  ArrowRight,
  MapPin,
  Clock,
  ThumbsUp,
} from 'lucide-react';

export default function HomePage() {
  const router = Router();
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredWorkers, setFeaturedWorkers] = useState<Worker[]>([]);
  const [searchCategory, setSearchCategory] = useState('');
  const [searchCity, setSearchCity] = useState('');

  const [isSmartSearchOpen, setIsSmartSearchOpen] = useState(false);
  const [selectedWorkerForBooking, setSelectedWorkerForBooking] = useState<Worker | null>(null);

  useEffect(() => {
    initializeStore();
    setCategories(getCategories());
    const workers = getWorkers();
    setFeaturedWorkers(workers.filter((w) => w.is_verified).slice(0, 6));
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (searchCategory) queryParams.set('category', searchCategory);
    if (searchCity) queryParams.set('city', searchCity);
    router.push(`/search?${queryParams.toString()}`);
  };

  const handleApplySmartSearch = (parsed: SmartSearchParsed) => {
    const queryParams = new URLSearchParams();
    if (parsed.category) queryParams.set('category', parsed.category);
    if (parsed.city) queryParams.set('city', parsed.city);
    if (parsed.area) queryParams.set('area', parsed.area);
    router.push(`/search?${queryParams.toString()}`);
  };

  const cities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad'];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#1E5AA8]/5 via-[#1E5AA8]/10 to-[#FAFAFA] pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1E5AA8]/10 text-[#1E5AA8] text-xs font-semibold mb-6 border border-[#1E5AA8]/20">
            <ShieldCheck size={16} className="text-[#1E5AA8]" />
            <span>Pakistan&apos;s 100% CNIC Verified Skilled Worker Marketplace</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#1A1A1A] tracking-tight leading-tight mb-4">
            Ghar baithe, <span className="text-[#1E5AA8]">mahir kaarigar</span> dhoondein
          </h1>

          <p className="text-base sm:text-lg text-[#4A4A4A] max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
            Electricians, plumbers, tailors, tutors, AC repair, drivers aur home cooks. CNIC verified ratings aur transparent rates k saath.
          </p>

          {/* Search Bar Card */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 card-shadow max-w-3xl mx-auto border border-gray-100">
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              {/* Category selector */}
              <div className="sm:col-span-5 relative">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider text-left mb-1 pl-1">
                  What Service? (Kaam)
                </label>
                <div className="relative">
                  <select
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                    className="w-full px-3.5 py-3 text-sm rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#1E5AA8] bg-gray-50/50 text-[#1A1A1A] font-medium appearance-none"
                  >
                    <option value="">All Services (Sab Categories)</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* City selector */}
              <div className="sm:col-span-4 relative">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider text-left mb-1 pl-1">
                  Which Area/City? (Shehar)
                </label>
                <div className="relative">
                  <select
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    className="w-full px-3.5 py-3 text-sm rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#1E5AA8] bg-gray-50/50 text-[#1A1A1A] font-medium appearance-none"
                  >
                    <option value="">All Cities (Tamam Shehar)</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Search CTA */}
              <div className="sm:col-span-3 flex flex-col justify-end">
                <span className="hidden sm:block text-[11px] opacity-0 mb-1">&nbsp;</span>
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-[#F5820D] hover:bg-[#D97109] text-white font-bold text-sm transition shadow-md flex items-center justify-center gap-2 group"
                >
                  <Search size={18} />
                  <span>Search</span>
                </button>
              </div>
            </form>

            {/* Smart Search Trigger Option */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-500">Urdu / English mein type karna chahte hain?</span>
              <button
                type="button"
                onClick={() => setIsSmartSearchOpen(true)}
                className="inline-flex items-center gap-1.5 text-[#1E5AA8] font-bold hover:underline bg-[#1E5AA8]/5 px-3 py-1 rounded-lg border border-[#1E5AA8]/20 transition"
              >
                <Sparkles size={14} className="text-[#1E5AA8]" />
                <span>AI Smart Search Try Karein</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Grid of Categories Section */}
      <section id="categories" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-[#1E5AA8] uppercase tracking-wider block">
              Service Categories
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
              Kyun Na Aaj Hi Koi Kaam Karwayen?
            </h2>
          </div>
          <button
            onClick={() => router.push('/search')}
            className="text-xs font-bold text-[#1E5AA8] hover:underline flex items-center gap-1"
          >
            Tamam Categories Dekhein <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.slice(0, 11).map((category) => (
            <button
              key={category.id}
              onClick={() => router.push(`/search?category=${encodeURIComponent(category.name)}`)}
              className="bg-white rounded-2xl p-4 border border-gray-100 card-shadow card-shadow-hover flex flex-col items-center text-center group transition"
            >
              <div className="w-12 h-12 rounded-xl bg-[#1E5AA8]/10 text-[#1E5AA8] flex items-center justify-center mb-3 group-hover:bg-[#1E5AA8] group-hover:text-white transition-colors">
                <CategoryIcon name={category.icon_name || category.name} size={24} />
              </div>
              <h3 className="font-bold text-sm text-[#1A1A1A] group-hover:text-[#1E5AA8] transition">
                {category.name}
              </h3>
              <p className="text-[11px] text-gray-400 mt-1 line-clamp-1">
                {category.description}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#1E5AA8] uppercase tracking-wider block mb-1">
              Simple 3 Steps
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
              Naya Kaam Kaise Kaam Karta Hai?
            </h2>
            <p className="text-sm text-[#4A4A4A] mt-2">
              Asaan aur safe process. Koi lambi call nahi, direct verified kaarigar connect karein.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-[#FAFAFA] rounded-2xl p-6 border border-gray-100 text-center relative">
              <div className="w-12 h-12 rounded-full bg-[#1E5AA8] text-white font-extrabold text-lg flex items-center justify-center mx-auto mb-4 shadow-sm">
                1
              </div>
              <h3 className="font-bold text-lg text-[#1A1A1A] mb-2">
                1. Search Karein
              </h3>
              <p className="text-xs text-[#4A4A4A] leading-relaxed">
                Apni zaroorat (Electrician, Plumber, Tailor, AC technician etc.) aur shehar select karein ya AI smart search istemal karein.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#FAFAFA] rounded-2xl p-6 border border-gray-100 text-center relative">
              <div className="w-12 h-12 rounded-full bg-[#1E5AA8] text-white font-extrabold text-lg flex items-center justify-center mx-auto mb-4 shadow-sm">
                2
              </div>
              <h3 className="font-bold text-lg text-[#1A1A1A] mb-2">
                2. Worker Choose Karein
              </h3>
              <p className="text-xs text-[#4A4A4A] leading-relaxed">
                CNIC verification status, customer ratings, reviews, aur starting rates dekh kar apni marzi ka kaarigar chunein.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#FAFAFA] rounded-2xl p-6 border border-gray-100 text-center relative">
              <div className="w-12 h-12 rounded-full bg-[#F5820D] text-white font-extrabold text-lg flex items-center justify-center mx-auto mb-4 shadow-sm">
                3
              </div>
              <h3 className="font-bold text-lg text-[#1A1A1A] mb-2">
                3. Booking Confirm Karein
              </h3>
              <p className="text-xs text-[#4A4A4A] leading-relaxed">
                Pata aur time specify kar ke request bhejein. Worker aap se rabta kar ke kaam mukammal karega.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Verified Workers Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-[#1E5AA8] uppercase tracking-wider block">
              Verified Providers
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
              Humare Top Rated Kaarigar
            </h2>
          </div>
          <button
            onClick={() => router.push('/search')}
            className="text-xs font-bold text-[#1E5AA8] hover:underline flex items-center gap-1"
          >
            Tamam Workers Dekhein <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredWorkers.map((worker) => (
            <WorkerCard
              key={worker.id}
              worker={worker}
              onBookClick={(w) => setSelectedWorkerForBooking(w)}
            />
          ))}
        </div>
      </section>

      {/* Why Naya Kaam Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#1E5AA8] to-[#102a52] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">
              Peace of Mind Guaranteed
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Kyun Aitemad Karein Naya Kaam Par?
            </h2>
            <p className="text-xs text-blue-200 mt-2">
              Humara maqsud aap ke ghar k kaam ko safe, transparent aur reliable banana hai.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Badge 1 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center">
              <div className="w-14 h-14 rounded-2xl bg-white/15 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="font-bold text-lg text-white mb-2">
                100% CNIC Verified Workers
              </h3>
              <p className="text-xs text-blue-100 leading-relaxed">
                Tamam workers ki NADRA CNIC verification ki jaati hai taakey aap apne ghar mein be-khauf service le sakein.
              </p>
            </div>

            {/* Badge 2 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center">
              <div className="w-14 h-14 rounded-2xl bg-white/15 text-amber-400 flex items-center justify-center mx-auto mb-4">
                <DollarSign size={28} />
              </div>
              <h3 className="font-bold text-lg text-white mb-2">
                Fair & Transparent Pricing
              </h3>
              <p className="text-xs text-blue-100 leading-relaxed">
                Ghar per aane se pehle hourly ya per-job rate maloom hota hai. Koi hidden charges ya extra fee nahi.
              </p>
            </div>

            {/* Badge 3 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center">
              <div className="w-14 h-14 rounded-2xl bg-white/15 text-blue-300 flex items-center justify-center mx-auto mb-4">
                <Star size={28} />
              </div>
              <h3 className="font-bold text-lg text-white mb-2">
                Rated by Real Customers
              </h3>
              <p className="text-xs text-blue-100 leading-relaxed">
                Asli customer reviews aur AI generated trust summary se best worker choose karein apni requirement k mutabiq.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Become a worker banner */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 card-shadow flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-xs font-bold text-[#F5820D] uppercase tracking-wider block">
              For Service Providers
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">
              Kya Aap Electrician, Plumber ya Tailor Hain?
            </h3>
            <p className="text-xs text-[#4A4A4A] max-w-xl">
              Naya Kaam par aaj hi register karein, CNIC verify karwayen aur apne area se rozana naye customers hasil karein.
            </p>
          </div>
          <button
            onClick={() => router.push('/worker-signup')}
            className="px-6 py-3 rounded-xl bg-[#1E5AA8] hover:bg-[#174786] text-white font-bold text-sm transition shadow-md whitespace-nowrap"
          >
            Worker Registration Karein
          </button>
        </div>
      </section>

      <Footer />

      {/* Modals */}
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

function Router() {
  return useRouter();
}
