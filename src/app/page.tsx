'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
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
  ArrowRight,
  Star,
  MapPin,
  Clock,
  Briefcase,
  ChevronRight,
  Zap,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredWorkers, setFeaturedWorkers] = useState<Worker[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCity, setSearchCity] = useState('');

  const [isSmartSearchOpen, setIsSmartSearchOpen] = useState(false);
  const [selectedWorkerForBooking, setSelectedWorkerForBooking] = useState<Worker | null>(null);

  useEffect(() => {
    initializeStore();
    const loadedCats = getCategories();
    const loadedWorkers = getWorkers().filter((w) => w.is_verified).slice(0, 6);
    
    Promise.resolve().then(() => {
      setCategories(loadedCats);
      setFeaturedWorkers(loadedWorkers);
    });
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (searchQuery) queryParams.set('q', searchQuery);
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

  // Preset Pastel colors matching the design system snippet
  const categoryBgColors = [
    { bg: '#D6F5E3', text: '#1FB863' },
    { bg: '#DCE4FF', text: '#3D5AFE' },
    { bg: '#FFE3EC', text: '#FF5F82' },
    { bg: '#FFF3D1', text: '#C99A00' },
    { bg: '#E4E1FF', text: '#6C4CF0' },
    { bg: '#FFE0D6', text: '#E0631F' },
    { bg: '#D1F0F5', text: '#1FA5B8' },
    { bg: '#F0E4FF', text: '#8B4CF0' },
    { bg: '#E0FFEA', text: '#1FB863' },
    { bg: '#FFEBD1', text: '#E0951F' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8F5] text-[#0B0E12] font-body selection:bg-[#39E07A] selection:text-[#0B0E12]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        {/* Decorative Background Blobs */}
        <div className="absolute top-10 right-10 w-96 h-96 rounded-full bg-[#39E07A] opacity-20 blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-[#FF5F82] opacity-15 blur-3xl pointer-events-none -z-10" />

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Content Left */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-block bg-[#FFC93C] text-[#0B0E12] font-bold text-xs px-3.5 py-1.5 rounded-full">
              🔥 2,400+ online right now
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-heading font-extrabold text-[#0B0E12] leading-[1.1] tracking-tight">
              Ghar ka kaam?<br />
              Ab <span className="hl-highlight">2 minute</span> mein book.
            </h1>

            <p className="text-base sm:text-lg text-[#666E7A] font-medium leading-relaxed max-w-xl">
              Electrician, plumber, tailor, tutor — jo bhi chahiye, verified kaarigar dhoondein aur seedha app se book karein.
            </p>

            {/* Search Pill */}
            <form onSubmit={handleSearchSubmit} className="search-pill max-w-xl">
              <div className="flex items-center gap-2 pl-3 flex-1">
                <Search size={20} className="text-[#666E7A] shrink-0" />
                <input
                  type="text"
                  placeholder="Kaam ya area likhein... e.g. Electrician Gulshan"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-sm font-medium focus:outline-none placeholder:text-[#666E7A]"
                />
              </div>
              <button type="submit" className="btn btn-lime shrink-0">
                Search →
              </button>
            </form>

            {/* AI Search Assistant Trigger */}
            <div className="pt-1 flex items-center gap-2 text-xs">
              <span className="text-[#666E7A] font-medium">Mushkil lag raha hai?</span>
              <button
                type="button"
                onClick={() => setIsSmartSearchOpen(true)}
                className="inline-flex items-center gap-1.5 text-[#0B0E12] font-bold hover:underline bg-[#D6F5E3] px-3 py-1 rounded-full text-xs transition"
              >
                <Sparkles size={13} className="text-[#1FB863]" />
                <span>AI Urdu Voice/Text Assistant</span>
              </button>
            </div>

            {/* Stat Row */}
            <div className="pt-6 grid grid-cols-3 gap-6 max-w-md border-t border-[#EAECE7]">
              <div>
                <div className="font-heading font-extrabold text-2xl text-[#0B0E12]">2,400+</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#666E7A] mt-0.5">VERIFIED WORKERS</div>
              </div>
              <div>
                <div className="font-heading font-extrabold text-2xl text-[#0B0E12]">15,000+</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#666E7A] mt-0.5">JOBS DONE</div>
              </div>
              <div>
                <div className="font-heading font-extrabold text-2xl text-[#0B0E12]">4.8 ★</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#666E7A] mt-0.5">AVG RATING</div>
              </div>
            </div>
          </div>

          {/* Hero Visual Right: Phone Mockup with Floating Badges */}
          <div className="lg:col-span-5 hidden lg:block relative py-6">
            {/* Float Badge 1 (Top Left) */}
            <div className="float-badge -top-2 -left-6 rotate-[-3deg]">
              <div className="w-9 h-9 rounded-xl bg-[#D6F5E3] flex items-center justify-center text-[#1FB863] font-bold text-base">
                ✓
              </div>
              <div>
                <div className="font-heading font-bold text-xs text-[#0B0E12]">Verified CNIC</div>
                <div className="text-[10px] text-[#666E7A] font-medium">100% Checked</div>
              </div>
            </div>

            {/* Float Badge 2 (Bottom Right) */}
            <div className="float-badge -bottom-2 -right-4 rotate-[2deg]">
              <div className="w-9 h-9 rounded-xl bg-[#FFF3D1] flex items-center justify-center text-[#C99A00] font-bold text-base">
                ★
              </div>
              <div>
                <div className="font-heading font-bold text-xs text-[#0B0E12]">4.9 Rating</div>
                <div className="text-[10px] text-[#666E7A] font-medium">120+ reviews</div>
              </div>
            </div>

            {/* Phone Shell */}
            <div className="w-[310px] mx-auto bg-[#0B0E12] rounded-[44px] p-3.5 shadow-2xl rotate-[3deg] hover:rotate-0 transition-transform duration-300 border-4 border-[#0B0E12]">
              {/* Phone Inner Screen */}
              <div className="bg-[#F7F8F5] rounded-[36px] p-4 space-y-3.5 overflow-hidden border border-gray-200">
                {/* Mock Header */}
                <div className="flex items-center justify-between pb-2 border-b border-[#EAECE7]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#39E07A] animate-pulse" />
                    <span className="font-heading font-bold text-xs text-[#0B0E12]">Available Near You</span>
                  </div>
                  <span className="text-[10px] text-[#666E7A] font-bold">Karachi</span>
                </div>

                {/* Card 1 */}
                <div className="bg-white rounded-2xl p-3 border border-[#EAECE7] shadow-xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-gray-200 overflow-hidden relative shrink-0">
                      <Image
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120"
                        alt="Worker"
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <div className="font-heading font-bold text-xs text-[#0B0E12] flex items-center gap-1">
                        Imran Khan <CheckCircle2 size={12} className="text-[#1FB863]" />
                      </div>
                      <div className="text-[10px] text-[#666E7A]">Electrician • Gulshan</div>
                      <div className="text-[10px] text-[#C99A00] font-bold">★ 4.9 (48)</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-heading font-bold text-xs text-[#0B0E12]">Rs. 500</div>
                    <span className="text-[9px] bg-[#D6F5E3] text-[#1FB863] font-bold px-1.5 py-0.5 rounded-full">Available</span>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="bg-white rounded-2xl p-3 border border-[#EAECE7] shadow-xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-gray-200 overflow-hidden relative shrink-0">
                      <Image
                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120"
                        alt="Worker"
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <div className="font-heading font-bold text-xs text-[#0B0E12] flex items-center gap-1">
                        Zubair Ahmed <CheckCircle2 size={12} className="text-[#1FB863]" />
                      </div>
                      <div className="text-[10px] text-[#666E7A]">Master Plumber • Johar</div>
                      <div className="text-[10px] text-[#C99A00] font-bold">★ 4.8 (32)</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-heading font-bold text-xs text-[#0B0E12]">Rs. 600</div>
                    <span className="text-[9px] bg-[#D6F5E3] text-[#1FB863] font-bold px-1.5 py-0.5 rounded-full">Available</span>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="bg-white rounded-2xl p-3 border border-[#EAECE7] shadow-xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-gray-200 overflow-hidden relative shrink-0">
                      <Image
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120"
                        alt="Worker"
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <div className="font-heading font-bold text-xs text-[#0B0E12] flex items-center gap-1">
                        Salman Raza <CheckCircle2 size={12} className="text-[#1FB863]" />
                      </div>
                      <div className="text-[10px] text-[#666E7A]">AC Technician • Clifton</div>
                      <div className="text-[10px] text-[#C99A00] font-bold">★ 5.0 (65)</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-heading font-bold text-xs text-[#0B0E12]">Rs. 1,000</div>
                    <span className="text-[9px] bg-[#D6F5E3] text-[#1FB863] font-bold px-1.5 py-0.5 rounded-full">Available</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Categories Grid */}
      <section id="categories" className="py-16 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto w-full">
        <div className="mb-8">
          <div className="tag-label">CATEGORIES</div>
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#0B0E12]">
            Har kaam ke liye, koi na koi mahir
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.slice(0, 10).map((category, idx) => {
            const theme = categoryBgColors[idx % categoryBgColors.length];
            return (
              <div
                key={category.id}
                onClick={() => router.push(`/search?category=${encodeURIComponent(category.name)}`)}
                style={{ backgroundColor: theme.bg }}
                className="cat-card group"
              >
                <div
                  style={{ color: theme.text }}
                  className="w-12 h-12 rounded-2xl bg-white/80 flex items-center justify-center mb-4 text-xl shadow-xs group-hover:scale-110 transition-transform"
                >
                  <CategoryIcon name={category.icon_name || category.name} size={22} />
                </div>
                <h3 className="font-heading font-bold text-base text-[#0B0E12] mb-1">
                  {category.name}
                </h3>
                <p className="text-xs text-[#666E7A] font-medium line-clamp-1">
                  {category.description || 'Verified Kaarigar'}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto w-full">
        <div className="mb-10">
          <div className="tag-label">HOW IT WORKS</div>
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#0B0E12]">
            3 steps, bas itna hi
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="how-card space-y-4">
            <div className="w-10 h-10 rounded-full bg-[#0B0E12] text-white font-heading font-extrabold text-base flex items-center justify-center">
              1
            </div>
            <h3 className="font-heading font-bold text-lg text-[#0B0E12]">
              Search karein
            </h3>
            <p className="text-sm text-[#666E7A] font-medium leading-relaxed">
              Apni zaroorat aur area batayein. Urdu ya English dono mein dhoond sakte hain.
            </p>
          </div>

          <div className="how-card space-y-4">
            <div className="w-10 h-10 rounded-full bg-[#0B0E12] text-white font-heading font-extrabold text-base flex items-center justify-center">
              2
            </div>
            <h3 className="font-heading font-bold text-lg text-[#0B0E12]">
              Compare & Select
            </h3>
            <p className="text-sm text-[#666E7A] font-medium leading-relaxed">
              Ratings, experience, rates aur verified badges dekh kar apna pasandida kaarigar chunein.
            </p>
          </div>

          <div className="how-card space-y-4">
            <div className="w-10 h-10 rounded-full bg-[#0B0E12] text-white font-heading font-extrabold text-base flex items-center justify-center">
              3
            </div>
            <h3 className="font-heading font-bold text-lg text-[#0B0E12]">
              Direct Contact & Book
            </h3>
            <p className="text-sm text-[#666E7A] font-medium leading-relaxed">
              Worker ko direct call ya message karein aur kaam ka time set karein. Simple!
            </p>
          </div>
        </div>
      </section>

      {/* Featured Verified Workers Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="tag-label">TOP RATED</div>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#0B0E12]">
              Kharay kaarigar, tayyar kaam ke liye
            </h2>
          </div>
          <button
            onClick={() => router.push('/search')}
            className="btn btn-secondary text-xs py-2 px-4 flex items-center gap-1 font-bold"
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

      {/* CTA Strip Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto w-full">
        <div className="bg-[#0B0E12] text-white rounded-[32px] p-8 sm:p-12 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-8">
          {/* Radial glow background */}
          <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#39E07A] opacity-20 blur-3xl pointer-events-none" />

          <div className="space-y-2 text-center sm:text-left relative z-10 max-w-xl">
            <span className="text-xs font-bold text-[#39E07A] uppercase tracking-wider block">
              FOR SKILLED WORKERS
            </span>
            <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
              Kaarigar hain? Apna kaam grow karein Naya Kaam ke saath.
            </h3>
            <p className="text-sm text-[#666E7A] font-medium leading-relaxed pt-1">
              CNIC verify karwayen, customer requests hasil karein aur apne mohalle mein mashhoor hon.
            </p>
          </div>

          <button
            onClick={() => router.push('/worker-signup')}
            className="btn btn-lime shrink-0 py-3.5 px-6 font-extrabold relative z-10"
          >
            Worker ban jayein →
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
