'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { VerifiedBadge } from '@/components/verified-badge';
import { StarRating } from '@/components/star-rating';
import { CategoryIcon } from '@/components/category-icon';
import { BookingModal } from '@/components/booking-modal';
import { getWorkerById, getWorkerReviews, initializeStore } from '@/lib/store';
import { Worker, Review } from '@/lib/types';
import {
  MapPin,
  Calendar,
  Briefcase,
  Sparkles,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Loader2,
  Award,
  DollarSign,
  MessageSquare,
} from 'lucide-react';

interface WorkerProfileClientProps {
  id: string;
}

export function WorkerProfileClient({ id }: WorkerProfileClientProps) {
  const router = useRouter();

  const [worker, setWorker] = useState<Worker | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);

  const [aiTrustSummary, setAiTrustSummary] = useState<string>('');
  const [isLoadingSummary, setIsLoadingSummary] = useState<boolean>(false);

  useEffect(() => {
    initializeStore();
    const w = getWorkerById(id);
    if (w) {
      setWorker(w);
      const revs = getWorkerReviews(w.id);
      setReviews(revs);
      if (w.trust_summary) {
        setAiTrustSummary(w.trust_summary);
      } else {
        fetchTrustSummary(w, revs);
      }
    }
  }, [id]);

  const fetchTrustSummary = async (w: Worker, revs: Review[]) => {
    setIsLoadingSummary(true);
    try {
      const res = await fetch('/api/ai/review-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workerName: w.name,
          category: w.category,
          reviews: revs,
        }),
      });
      const data = await res.json();
      if (data.summary) {
        setAiTrustSummary(data.summary);
      }
    } catch (err) {
      console.error('Failed to load AI trust summary:', err);
    } finally {
      setIsLoadingSummary(false);
    }
  };

  if (!worker) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
          <h2 className="text-xl font-bold text-[#1A1A1A]">Worker Profile Not Found</h2>
          <p className="text-xs text-gray-500">The profile you are looking for does not exist or has been removed.</p>
          <Link
            href="/search"
            className="px-4 py-2 bg-[#1E5AA8] text-white rounded-xl text-xs font-bold"
          >
            Back to Worker Search
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] pb-20 md:pb-0">
      <Navbar />

      {/* Back Button Header */}
      <div className="bg-white border-b border-gray-100 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="text-xs font-semibold text-gray-600 hover:text-[#1E5AA8] flex items-center gap-1.5 transition"
          >
            <ArrowLeft size={16} />
            Back to Search Results
          </button>
          <span className="text-xs text-gray-400">Worker ID: {worker.id}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Left Area: Cover Header, AI Bio, Trust Summary, Reviews */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Cover Card */}
            <div className="bg-white rounded-2xl border border-gray-100 card-shadow overflow-hidden">
              <div className="h-32 sm:h-40 bg-gradient-to-r from-[#1E5AA8] to-[#102a52] relative p-4 flex items-end">
                <span className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full font-medium">
                  {worker.city} • {worker.area}
                </span>
              </div>

              <div className="px-6 pb-6 relative pt-0">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 sm:-mt-14 mb-4 gap-4">
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white overflow-hidden bg-gray-100 shadow-md shrink-0">
                    <Image
                      src={worker.profile_photo_url}
                      alt={worker.name}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        worker.is_available
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {worker.is_available ? '• Available for Booking' : '• Currently Busy'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl font-bold text-[#1A1A1A]">{worker.name}</h1>
                    {worker.is_verified && <VerifiedBadge size={18} showText={true} />}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-600 flex-wrap">
                    <span className="flex items-center gap-1 font-semibold text-[#1E5AA8]">
                      <CategoryIcon name={worker.category} size={15} />
                      {worker.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={14} className="text-gray-400" />
                      {worker.area}, {worker.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase size={14} className="text-gray-400" />
                      {worker.years_experience} Years Experience
                    </span>
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <StarRating rating={worker.average_rating} totalReviews={worker.total_reviews} size={18} />
                    <span className="text-xs text-gray-400">|</span>
                    <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                      <ShieldCheck size={14} /> CNIC Verified Provider
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Generated Bio Box */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 card-shadow space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-[#1A1A1A] flex items-center gap-2">
                  <Award size={18} className="text-[#1E5AA8]" />
                  About & Experience
                </h3>
                <span className="text-[10px] font-semibold bg-[#1E5AA8]/10 text-[#1E5AA8] px-2.5 py-0.5 rounded-full">
                  Verified Bio
                </span>
              </div>
              <p className="text-sm text-[#4A4A4A] leading-relaxed">
                {worker.bio}
              </p>
            </div>

            {/* AI Trust Summary Box */}
            <div className="bg-gradient-to-br from-blue-50/90 via-indigo-50/50 to-white rounded-2xl p-6 border border-blue-100 card-shadow space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1E5AA8] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={16} className="text-[#1E5AA8]" />
                  AI Trust Summary (Customer Feedback Synthesis)
                </span>
                <span className="text-[10px] bg-blue-100 text-[#1E5AA8] font-bold px-2 py-0.5 rounded-full">
                  Gemini Generated
                </span>
              </div>

              {isLoadingSummary ? (
                <div className="flex items-center gap-2 text-xs text-gray-500 py-2">
                  <Loader2 size={16} className="animate-spin text-[#1E5AA8]" />
                  <span>Synthesizing customer reviews into trust summary...</span>
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-[#1A1A1A] font-medium leading-relaxed italic bg-white/70 p-3.5 rounded-xl border border-blue-100/60">
                  &ldquo;{aiTrustSummary || 'Customers consistently highlight punctuality, reasonable pricing, and clean work habits.'}&rdquo;
                </p>
              )}
            </div>

            {/* Customer Reviews Section */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 card-shadow space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h3 className="font-bold text-base text-[#1A1A1A] flex items-center gap-2">
                    <MessageSquare size={18} className="text-[#1E5AA8]" />
                    Customer Reviews & Feedback
                  </h3>
                  <p className="text-xs text-gray-500">
                    {reviews.length} authentic ratings from verified completed bookings
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-[#1A1A1A]">
                    {worker.average_rating.toFixed(1)}
                  </span>
                  <span className="text-xs text-gray-400 block">out of 5.0</span>
                </div>
              </div>

              {reviews.length > 0 ? (
                <div className="space-y-4 divide-y divide-gray-100">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="pt-4 first:pt-0 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#1A1A1A]">
                          {rev.customer_name}
                        </span>
                        <span className="text-[11px] text-gray-400">
                          {new Date(rev.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <StarRating rating={rev.rating} size={14} showText={false} />
                      <p className="text-xs text-[#4A4A4A] leading-relaxed">
                        {rev.comment}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-gray-500">
                  Abhi tak koi review nahi aaya. Kaam completed hone k baad customers review dete hain.
                </div>
              )}
            </div>
          </div>

          {/* Desktop Right Sidebar: Pricing & Book Sticky Box */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 card-shadow sticky top-20 space-y-5">
              <div className="pb-4 border-b border-gray-100">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                  Service Rate / Pricing
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-[#1E5AA8]">
                    Rs. {worker.rate_amount.toLocaleString()}
                  </span>
                  <span className="text-xs font-medium text-gray-500">
                    / {worker.rate_type === 'hourly' ? 'Per Hour (ghanta)' : 'Per Job (kaam)'}
                  </span>
                </div>
              </div>

              {/* Service Highlights */}
              <div className="space-y-2.5 text-xs text-gray-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>CNIC Identity Verified Provider</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>Direct Customer Contact after Booking</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>Transparent Rates - No Hidden Charges</span>
                </div>
              </div>

              {/* Book Now Button */}
              <button
                onClick={() => setIsBookingOpen(true)}
                className="w-full py-3.5 rounded-xl bg-[#F5820D] hover:bg-[#D97109] text-white font-bold text-sm transition shadow-md flex items-center justify-center gap-2"
              >
                <span>Book Now (Kaam Book Karein)</span>
              </button>

              <p className="text-[11px] text-gray-400 text-center">
                Booking request worker ko pohnch jayegi aur wo aap se phone per rabta karenge.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 shadow-lg z-40 flex items-center justify-between px-4">
        <div>
          <span className="text-[10px] text-gray-400 font-semibold block uppercase">Starting Rate</span>
          <span className="text-base font-bold text-[#1E5AA8]">
            Rs. {worker.rate_amount.toLocaleString()}
            <span className="text-xs font-normal text-gray-500">
              /{worker.rate_type === 'hourly' ? 'hr' : 'job'}
            </span>
          </span>
        </div>

        <button
          onClick={() => setIsBookingOpen(true)}
          className="px-6 py-2.5 rounded-xl bg-[#F5820D] hover:bg-[#D97109] text-white font-bold text-xs transition shadow-sm"
        >
          Book Now
        </button>
      </div>

      <Footer />

      <BookingModal
        worker={worker}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
}
