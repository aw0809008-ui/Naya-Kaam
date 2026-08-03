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
      <div className="min-h-screen flex flex-col bg-[#F7F8F5] text-[#0B0E12] font-body">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
          <h2 className="text-2xl font-extrabold font-heading text-[#0B0E12]">Worker Profile Not Found</h2>
          <p className="text-xs text-[#666E7A]">The profile you are looking for does not exist or has been removed.</p>
          <Link
            href="/search"
            className="btn btn-primary px-5 py-2.5 text-xs font-bold"
          >
            Back to Worker Search
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8F5] text-[#0B0E12] font-body pb-20 md:pb-0">
      <Navbar />

      {/* Back Button Header */}
      <div className="bg-white border-b border-[#EAECE7] py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="text-xs font-bold text-[#666E7A] hover:text-[#0B0E12] flex items-center gap-1.5 transition"
          >
            <ArrowLeft size={16} />
            Back to Search Results
          </button>
          <span className="text-xs text-[#666E7A] font-mono">Worker ID: {worker.id}</span>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Left Area: Cover Header, AI Bio, Trust Summary, Reviews */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Cover Card */}
            <div className="bg-white rounded-[26px] border border-[#EAECE7] overflow-hidden shadow-xs">
              <div className="h-32 sm:h-40 bg-[#0B0E12] relative p-4 flex items-end">
                <span className="absolute top-4 right-4 bg-white/10 backdrop-blur-md text-[#39E07A] text-xs px-3.5 py-1 rounded-full font-bold border border-white/10">
                  {worker.city} • {worker.area}
                </span>
              </div>

              <div className="px-6 pb-6 relative pt-0">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 sm:-mt-14 mb-4 gap-4">
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-white overflow-hidden bg-[#0B0E12] shadow-md shrink-0">
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
                          ? 'bg-[#D6F5E3] text-[#1FB863] border border-[#1FB863]/20'
                          : 'bg-[#FFF3D6] text-[#B8860B] border border-[#FFC93C]/20'
                      }`}
                    >
                      {worker.is_available ? '• Available for Booking' : '• Currently Busy'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#0B0E12]">{worker.name}</h1>
                    {worker.is_verified && <VerifiedBadge size={18} showText={true} />}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-[#666E7A] flex-wrap font-medium">
                    <span className="flex items-center gap-1.5 font-bold text-[#0B0E12] bg-[#F7F8F5] px-2.5 py-1 rounded-lg border border-[#EAECE7]">
                      <CategoryIcon name={worker.category} size={15} />
                      {worker.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={14} className="text-[#666E7A]" />
                      {worker.area}, {worker.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase size={14} className="text-[#666E7A]" />
                      {worker.years_experience} Years Experience
                    </span>
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <StarRating rating={worker.average_rating} totalReviews={worker.total_reviews} size={18} />
                    <span className="text-xs text-[#EAECE7]">|</span>
                    <span className="text-xs text-[#1FB863] font-bold flex items-center gap-1">
                      <ShieldCheck size={14} /> CNIC Verified Provider
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Generated Bio Box */}
            <div className="bg-white rounded-[26px] p-6 sm:p-8 border border-[#EAECE7] space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-extrabold text-base text-[#0B0E12] flex items-center gap-2">
                  <Award size={18} className="text-[#1FB863]" />
                  About & Experience
                </h3>
                <span className="text-[10px] font-bold bg-[#F7F8F5] text-[#0B0E12] px-3 py-1 rounded-full border border-[#EAECE7]">
                  Verified Bio
                </span>
              </div>
              <p className="text-sm text-[#666E7A] font-medium leading-relaxed">
                {worker.bio}
              </p>
            </div>

            {/* AI Trust Summary Box */}
            <div className="bg-[#0B0E12] text-white rounded-[26px] p-6 sm:p-8 border border-[#0B0E12] space-y-3 relative shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#39E07A] uppercase tracking-wider flex items-center gap-1.5 font-heading">
                  <Sparkles size={16} className="text-[#39E07A]" />
                  AI Trust Summary (Customer Feedback Synthesis)
                </span>
                <span className="text-[10px] bg-white/10 text-white font-bold px-2.5 py-0.5 rounded-full border border-white/10">
                  Gemini Generated
                </span>
              </div>

              {isLoadingSummary ? (
                <div className="flex items-center gap-2 text-xs text-[#666E7A] py-2">
                  <Loader2 size={16} className="animate-spin text-[#39E07A]" />
                  <span>Synthesizing customer reviews into trust summary...</span>
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-[#F7F8F5] font-medium leading-relaxed italic bg-white/5 p-4 rounded-xl border border-white/10">
                  &ldquo;{aiTrustSummary || 'Customers consistently highlight punctuality, reasonable pricing, and clean work habits.'}&rdquo;
                </p>
              )}
            </div>

            {/* Customer Reviews Section */}
            <div className="bg-white rounded-[26px] p-6 sm:p-8 border border-[#EAECE7] space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-[#EAECE7]">
                <div>
                  <h3 className="font-heading font-extrabold text-base text-[#0B0E12] flex items-center gap-2">
                    <MessageSquare size={18} className="text-[#1FB863]" />
                    Customer Reviews & Feedback
                  </h3>
                  <p className="text-xs text-[#666E7A] font-medium mt-0.5">
                    {reviews.length} authentic ratings from verified completed bookings
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-heading font-extrabold text-[#0B0E12]">
                    {worker.average_rating.toFixed(1)}
                  </span>
                  <span className="text-xs text-[#666E7A] block font-medium">out of 5.0</span>
                </div>
              </div>

              {reviews.length > 0 ? (
                <div className="space-y-4 divide-y divide-[#EAECE7]">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="pt-4 first:pt-0 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-heading font-bold text-xs text-[#0B0E12]">
                          {rev.customer_name}
                        </span>
                        <span className="text-[11px] text-[#666E7A] font-medium">
                          {new Date(rev.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <StarRating rating={rev.rating} size={14} showText={false} />
                      <p className="text-xs text-[#666E7A] font-medium leading-relaxed">
                        {rev.comment}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-[#666E7A]">
                  Abhi tak koi review nahi aaya. Kaam completed hone k baad customers review dete hain.
                </div>
              )}
            </div>
          </div>

          {/* Desktop Right Sidebar: Pricing & Book Sticky Box */}
          <div className="space-y-6">
            <div className="bg-white rounded-[26px] p-6 sm:p-8 border border-[#EAECE7] sticky top-24 space-y-6 shadow-xs">
              <div className="pb-4 border-b border-[#EAECE7]">
                <span className="text-xs font-bold text-[#666E7A] uppercase tracking-wider block mb-1 font-heading">
                  Service Rate / Pricing
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-heading font-extrabold text-[#0B0E12]">
                    Rs. {worker.rate_amount.toLocaleString()}
                  </span>
                  <span className="text-xs font-medium text-[#666E7A]">
                    / {worker.rate_type === 'hourly' ? 'Per Hour (ghanta)' : 'Per Job (kaam)'}
                  </span>
                </div>
              </div>

              {/* Service Highlights */}
              <div className="space-y-3 text-xs text-[#0B0E12] font-medium">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-[#1FB863] shrink-0" />
                  <span>CNIC Identity Verified Provider</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-[#1FB863] shrink-0" />
                  <span>Direct In-App Voice Calling & Chat after Booking</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-[#1FB863] shrink-0" />
                  <span>Transparent Rates - No Hidden Charges</span>
                </div>
              </div>

              {/* Book Now Button */}
              <button
                onClick={() => setIsBookingOpen(true)}
                className="btn btn-lime w-full py-4 text-xs font-extrabold"
              >
                <span>Book Now (Kaam Book Karein)</span>
              </button>

              <p className="text-[11px] text-[#666E7A] text-center font-medium">
                Booking request worker ko pohnch jayegi. Aap app me direct voice call karsakte hain.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#EAECE7] p-3.5 shadow-lg z-40 flex items-center justify-between px-5">
        <div>
          <span className="text-[10px] text-[#666E7A] font-bold block uppercase">Starting Rate</span>
          <span className="text-base font-extrabold font-heading text-[#0B0E12]">
            Rs. {worker.rate_amount.toLocaleString()}
            <span className="text-xs font-normal text-[#666E7A]">
              /{worker.rate_type === 'hourly' ? 'hr' : 'job'}
            </span>
          </span>
        </div>

        <button
          onClick={() => setIsBookingOpen(true)}
          className="btn btn-lime px-6 py-2.5 text-xs font-bold"
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
