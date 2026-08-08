'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { ReviewModal } from '@/components/review-modal';
import { BookingChatModal } from '@/components/booking-chat-modal';
import { DisputeModal } from '@/components/dispute-modal';
import { BookingModal } from '@/components/booking-modal';
import { useCall } from '@/components/call/call-provider';
import { VerifiedBadge } from '@/components/verified-badge';
import { StarRating } from '@/components/star-rating';
import { WorkerCard } from '@/components/worker-card';
import {
  getCurrentUser,
  setCurrentUser,
  getBookings,
  getCustomerBookings,
  getWorkerBookings,
  getWorkerById,
  saveWorker,
  updateBookingStatus,
  initializeStore,
  getWorkers,
  getFavoriteWorkerIds,
} from '@/lib/store';
import { User, Booking, Worker, BookingStatus } from '@/lib/types';
import {
  User as UserIcon,
  Briefcase,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Star,
  DollarSign,
  Edit3,
  TrendingUp,
  Phone,
  PhoneCall,
  MessageSquare,
  ShieldCheck,
  ThumbsUp,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

export default function DashboardPage() {
  const { initiateCall } = useCall();
  const [selectedChatBooking, setSelectedChatBooking] = useState<Booking | null>(null);

  const [currentUser, setUserState] = useState<User | null>(() => {
    initializeStore();
    return getCurrentUser();
  });
  const [activeViewRole, setActiveViewRole] = useState<'customer' | 'worker'>(() => {
    const user = getCurrentUser();
    return user?.role === 'worker' ? 'worker' : 'customer';
  });

  // Customer state
  const [customerBookings, setCustomerBookings] = useState<Booking[]>(() => {
    const user = getCurrentUser();
    return getCustomerBookings(user?.id || 'u-c1');
  });
  const [customerTab, setCustomerTab] = useState<'active' | 'completed' | 'cancelled' | 'favorites'>('active');
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<Booking | null>(null);
  const [selectedBookingForDispute, setSelectedBookingForDispute] = useState<Booking | null>(null);
  const [selectedWorkerForRepeat, setSelectedWorkerForRepeat] = useState<Worker | null>(null);

  const getActiveWorkerId = (user: User | null) => {
    if (!user) return 'w-1';
    if (user.role === 'worker') {
      const rawId = user.id.startsWith('u-') ? user.id.substring(2) : user.id;
      return getWorkerById(rawId) ? rawId : 'w-1';
    }
    return 'w-1';
  };

  // Worker state
  const [workerObj, setWorkerObj] = useState<Worker | null>(() => {
    const user = getCurrentUser();
    const wId = getActiveWorkerId(user);
    return getWorkerById(wId) || null;
  });
  const [workerBookings, setWorkerBookings] = useState<Booking[]>(() => {
    const user = getCurrentUser();
    const wId = getActiveWorkerId(user);
    return getWorkerBookings(wId);
  });
  const [workerTab, setWorkerTab] = useState<'requests' | 'my-jobs' | 'earnings' | 'profile'>('requests');

  // Edit worker profile form state
  const [editBio, setEditBio] = useState('');
  const [editRate, setEditRate] = useState(1000);
  const [isAvailable, setIsAvailable] = useState(true);

  const refreshData = useCallback((role: 'customer' | 'worker') => {
    const user = getCurrentUser();
    if (role === 'customer') {
      const bks = getCustomerBookings(user?.id || 'u-c1');
      setCustomerBookings(bks);
    } else {
      const wId = getActiveWorkerId(user);
      const w = getWorkerById(wId);
      if (w) {
        setWorkerObj(w);
        setEditBio(w.bio);
        setEditRate(w.rate_amount);
        setIsAvailable(w.is_available);
      }
      const bks = getWorkerBookings(wId);
      setWorkerBookings(bks);
    }
  }, []);

  const handleRoleToggle = (newRole: 'customer' | 'worker') => {
    setActiveViewRole(newRole);
    refreshData(newRole);
  };

  const handleStatusChange = (bookingId: string, newStatus: BookingStatus) => {
    updateBookingStatus(bookingId, newStatus);
    refreshData(activeViewRole);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workerObj) return;

    const updated: Worker = {
      ...workerObj,
      bio: editBio,
      rate_amount: editRate,
      is_available: isAvailable,
    };
    saveWorker(updated);
    setWorkerObj(updated);
    alert('Worker profile successfully updated!');
  };

  // Helper stats for worker view
  const totalBookings = workerBookings.length;
  const pendingRequests = workerBookings.filter((b) => b.status === 'pending');
  const acceptedJobs = workerBookings.filter((b) => b.status === 'accepted');
  const completedJobs = workerBookings.filter((b) => b.status === 'completed');
  const totalEarnings = completedJobs.reduce((sum, b) => sum + b.booking_amount, 0);
  const totalCommissionOwed = Math.round(totalEarnings * 0.15);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FA] font-body">
      <Navbar />

      {/* Top Role Switcher Header */}
      <div className="bg-white border-b border-[#E5E7EB] py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#1A1A1A] flex items-center gap-2">
              Dashboard
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-[#1E5AA8] capitalize border border-blue-100">
                {activeViewRole} View
              </span>
            </h1>
            <p className="text-xs text-[#6B7280] font-body mt-1">
              Manage your bookings, service requests, and earnings seamlessly
            </p>
          </div>

          {/* Role Switcher Pill */}
          <div className="flex items-center gap-1 bg-[#F7F8FA] p-1.5 rounded-xl border border-[#E5E7EB] text-xs font-semibold w-fit">
            <button
              onClick={() => handleRoleToggle('customer')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeViewRole === 'customer'
                  ? 'bg-[#1E5AA8] text-white shadow-xs font-bold'
                  : 'text-[#6B7280] hover:text-[#1A1A1A]'
              }`}
            >
              Customer View
            </button>
            <button
              onClick={() => handleRoleToggle('worker')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeViewRole === 'worker'
                  ? 'bg-emerald-700 text-white shadow-xs font-bold'
                  : 'text-[#6B7280] hover:text-[#1A1A1A]'
              }`}
            >
              Worker View
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        {/* ========================================================= */}
        {/* CUSTOMER DASHBOARD VIEW */}
        {/* ========================================================= */}
        {activeViewRole === 'customer' && (
          <div className="space-y-6">
            {/* Tabs Header */}
            <div className="flex border-b border-[#E5E7EB] space-x-6 text-xs font-heading font-bold overflow-x-auto">
              <button
                onClick={() => setCustomerTab('active')}
                className={`pb-3 border-b-2 transition whitespace-nowrap ${
                  customerTab === 'active'
                    ? 'border-[#1E5AA8] text-[#1E5AA8]'
                    : 'border-transparent text-[#6B7280] hover:text-[#1A1A1A]'
                }`}
              >
                Active Bookings ({customerBookings.filter((b) => b.status === 'pending' || b.status === 'accepted').length})
              </button>
              <button
                onClick={() => setCustomerTab('completed')}
                className={`pb-3 border-b-2 transition whitespace-nowrap ${
                  customerTab === 'completed'
                    ? 'border-[#1E5AA8] text-[#1E5AA8]'
                    : 'border-transparent text-[#6B7280] hover:text-[#1A1A1A]'
                }`}
              >
                Past / Completed ({customerBookings.filter((b) => b.status === 'completed').length})
              </button>
              <button
                onClick={() => setCustomerTab('cancelled')}
                className={`pb-3 border-b-2 transition whitespace-nowrap ${
                  customerTab === 'cancelled'
                    ? 'border-[#1E5AA8] text-[#1E5AA8]'
                    : 'border-transparent text-[#6B7280] hover:text-[#1A1A1A]'
                }`}
              >
                Cancelled ({customerBookings.filter((b) => b.status === 'cancelled').length})
              </button>
              <button
                onClick={() => setCustomerTab('favorites')}
                className={`pb-3 border-b-2 transition whitespace-nowrap ${
                  customerTab === 'favorites'
                    ? 'border-[#1E5AA8] text-[#1E5AA8]'
                    : 'border-transparent text-[#6B7280] hover:text-[#1A1A1A]'
                }`}
              >
                Saved Kaarigars ({getFavoriteWorkerIds().length})
              </button>
            </div>

            {/* Bookings & Favorites List */}
            {(() => {
              if (customerTab === 'favorites') {
                const favIds = getFavoriteWorkerIds();
                const favWorkers = getWorkers().filter((w) => favIds.includes(w.id));

                if (favWorkers.length === 0) {
                  return (
                    <div className="bg-white rounded-2xl p-12 text-center border border-[#E5E7EB] shadow-xs space-y-3 max-w-md mx-auto my-8">
                      <Star size={36} className="text-gray-300 mx-auto" />
                      <h3 className="text-base font-heading font-bold text-[#1A1A1A]">No Saved Kaarigars Yet</h3>
                      <p className="text-xs text-[#6B7280] font-body">
                        Workers ke card par Heart ❤️ icon tap karke apne pasandida kaarigar save karein.
                      </p>
                      <Link
                        href="/search"
                        className="inline-block px-5 py-2.5 bg-[#1FB863] text-white rounded-[10px] text-xs font-bold transition hover:bg-[#189d53]"
                      >
                        Explore Kaarigars
                      </Link>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favWorkers.map((worker) => (
                      <WorkerCard
                        key={worker.id}
                        worker={worker}
                        onBookClick={(w) => setSelectedWorkerForRepeat(w)}
                      />
                    ))}
                  </div>
                );
              }

              const filtered = customerBookings.filter((b) => {
                if (customerTab === 'active') return b.status === 'pending' || b.status === 'accepted';
                if (customerTab === 'completed') return b.status === 'completed';
                return b.status === 'cancelled';
              });

              if (filtered.length === 0) {
                return (
                  <div className="bg-white rounded-2xl p-12 text-center border border-[#E5E7EB] shadow-xs space-y-3 max-w-md mx-auto my-8">
                    <Calendar size={36} className="text-gray-300 mx-auto" />
                    <h3 className="text-base font-heading font-bold text-[#1A1A1A]">No Bookings Here Yet</h3>
                    <p className="text-xs text-[#6B7280] font-body">
                      {customerTab === 'active'
                        ? 'Aap ki koi active booking request nahi hai.'
                        : 'Iss section mein filhaal koi record nahi hai.'}
                    </p>
                    <Link
                      href="/search"
                      className="inline-block px-5 py-2.5 bg-[#F5820D] text-white rounded-[10px] text-xs font-semibold transition hover:bg-[#D97109]"
                    >
                      Dhoondein Kaarigar (Book Now)
                    </Link>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filtered.map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs space-y-4"
                    >
                      <div className="flex items-center justify-between pb-3.5 border-b border-[#E5E7EB]">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                            <Image
                              src={
                                booking.worker_photo ||
                                'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=200'
                              }
                              alt={booking.worker_name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-heading font-bold text-sm text-[#1A1A1A]">
                              {booking.worker_name}
                            </h4>
                            <span className="text-xs text-[#1E5AA8] font-semibold">
                              {booking.category}
                            </span>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                            booking.status === 'pending'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : booking.status === 'accepted'
                              ? 'bg-blue-50 text-[#1E5AA8] border border-blue-200'
                              : booking.status === 'completed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>

                      <div className="space-y-2 text-xs text-[#6B7280] font-body">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-[#6B7280]" />
                          <span>Date Needed: </span>
                          <span className="font-bold text-[#1A1A1A]">{booking.date_needed}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-[#6B7280]" />
                          <span>Time: </span>
                          <span className="font-semibold text-[#1A1A1A]">{booking.time_preference}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-[#6B7280]" />
                          <span>Address: </span>
                          <span className="font-medium text-[#1A1A1A] truncate">{booking.address}</span>
                        </div>
                        <div className="flex items-center gap-1.5 pt-1">
                          <span className="text-[11px] text-[#1FB863] font-bold flex items-center gap-1 bg-[#D6F5E3] px-2.5 py-1 rounded-lg border border-[#1FB863]/20">
                            <ShieldCheck size={13} /> In-App Calling Enabled (No Phone Number Shared)
                          </span>
                        </div>
                        <p className="bg-[#F7F8FA] p-3 rounded-xl border border-[#E5E7EB] italic text-[#1A1A1A]">
                          &ldquo;{booking.description}&rdquo;
                        </p>
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-3 border-t border-[#E5E7EB] flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#1E5AA8]">
                          Estimated: Rs. {booking.booking_amount.toLocaleString()}
                        </span>

                        <div className="flex flex-wrap items-center gap-2">
                          {booking.status !== 'cancelled' && (
                            <>
                              <button
                                onClick={() =>
                                  initiateCall({
                                    bookingId: booking.id,
                                    calleeId: booking.worker_id,
                                    calleeName: booking.worker_name,
                                    calleePhoto: booking.worker_photo,
                                    calleeRole: 'worker',
                                    category: booking.category,
                                  })
                                }
                                className="px-3.5 py-1.5 rounded-[10px] text-xs font-bold text-white bg-[#1FB863] hover:bg-[#189d53] transition flex items-center gap-1.5 shadow-xs"
                                title="In-App Voice Call"
                              >
                                <PhoneCall size={14} />
                                <span>Call</span>
                              </button>

                              <button
                                onClick={() => setSelectedChatBooking(booking)}
                                className="px-3.5 py-1.5 rounded-[10px] text-xs font-bold text-white bg-[#0B0E12] hover:bg-gray-800 transition flex items-center gap-1.5 shadow-xs"
                                title="Chat Messages"
                              >
                                <MessageSquare size={14} />
                                <span>Chat</span>
                              </button>
                            </>
                          )}

                          {booking.status === 'pending' && (
                            <button
                              onClick={() => handleStatusChange(booking.id, 'cancelled')}
                              className="px-3 py-1.5 rounded-[10px] text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-50 transition"
                            >
                              Cancel
                            </button>
                          )}

                          {booking.status === 'completed' && (
                            <>
                              {!booking.has_review && (
                                <button
                                  onClick={() => setSelectedBookingForReview(booking)}
                                  className="px-3.5 py-1.5 rounded-[10px] text-xs font-semibold text-white bg-[#F5820D] hover:bg-[#D97109] transition flex items-center gap-1 shadow-xs"
                                >
                                  <ThumbsUp size={13} />
                                  <span>Review</span>
                                </button>
                              )}

                              <button
                                onClick={() => {
                                  const worker = getWorkerById(booking.worker_id);
                                  if (worker) setSelectedWorkerForRepeat(worker);
                                }}
                                className="px-3 py-1.5 rounded-[10px] text-xs font-bold text-white bg-[#1FB863] hover:bg-[#189d53] transition flex items-center gap-1 shadow-xs"
                              >
                                <RotateCcw size={13} />
                                <span>Book Again</span>
                              </button>
                            </>
                          )}

                          {booking.status !== 'pending' && (
                            <button
                              onClick={() => setSelectedBookingForDispute(booking)}
                              className="px-2.5 py-1.5 rounded-[10px] text-[11px] font-semibold text-gray-500 border border-gray-200 hover:bg-gray-100 hover:text-red-600 transition flex items-center gap-1"
                              title="Report Issue to Admin"
                            >
                              <AlertTriangle size={12} />
                              <span>Report</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}

        {/* ========================================================= */}
        {/* WORKER DASHBOARD VIEW */}
        {/* ========================================================= */}
        {activeViewRole === 'worker' && (
          <div className="space-y-8">
            {/* Top Stat Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs text-center">
                <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider block font-heading">
                  Total Bookings
                </span>
                <span className="text-2xl font-heading font-bold text-[#1A1A1A] mt-1 block">
                  {totalBookings}
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs text-center">
                <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block font-heading">
                  Pending Requests
                </span>
                <span className="text-2xl font-heading font-bold text-amber-700 mt-1 block">
                  {pendingRequests.length}
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs text-center">
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block font-heading">
                  Completed Jobs
                </span>
                <span className="text-2xl font-heading font-bold text-emerald-700 mt-1 block">
                  {completedJobs.length}
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs text-center">
                <span className="text-[11px] font-bold text-[#1E5AA8] uppercase tracking-wider block font-heading">
                  Average Rating
                </span>
                <span className="text-2xl font-heading font-bold text-[#1E5AA8] mt-1 block">
                  {workerObj?.average_rating ? workerObj.average_rating.toFixed(1) : '5.0'} ★
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs text-center">
                <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider block font-heading">
                  Total Earnings
                </span>
                <span className="text-lg font-heading font-bold text-[#1A1A1A] mt-1 block">
                  Rs. {totalEarnings.toLocaleString()}
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs text-center">
                <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider block font-heading">
                  Commission (15%)
                </span>
                <span className="text-lg font-heading font-bold text-red-600 mt-1 block">
                  Rs. {totalCommissionOwed.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Worker Tabs Header */}
            <div className="flex border-b border-[#E5E7EB] space-x-6 text-xs font-heading font-bold overflow-x-auto">
              <button
                onClick={() => setWorkerTab('requests')}
                className={`pb-3 border-b-2 transition whitespace-nowrap ${
                  workerTab === 'requests'
                    ? 'border-[#1E5AA8] text-[#1E5AA8]'
                    : 'border-transparent text-[#6B7280] hover:text-[#1A1A1A]'
                }`}
              >
                Booking Requests ({pendingRequests.length})
              </button>
              <button
                onClick={() => setWorkerTab('my-jobs')}
                className={`pb-3 border-b-2 transition whitespace-nowrap ${
                  workerTab === 'my-jobs'
                    ? 'border-[#1E5AA8] text-[#1E5AA8]'
                    : 'border-transparent text-[#6B7280] hover:text-[#1A1A1A]'
                }`}
              >
                My Jobs in Progress ({acceptedJobs.length})
              </button>
              <button
                onClick={() => setWorkerTab('earnings')}
                className={`pb-3 border-b-2 transition whitespace-nowrap ${
                  workerTab === 'earnings'
                    ? 'border-[#1E5AA8] text-[#1E5AA8]'
                    : 'border-transparent text-[#6B7280] hover:text-[#1A1A1A]'
                }`}
              >
                Earnings & Commission Report
              </button>
              <button
                onClick={() => setWorkerTab('profile')}
                className={`pb-3 border-b-2 transition whitespace-nowrap ${
                  workerTab === 'profile'
                    ? 'border-[#1E5AA8] text-[#1E5AA8]'
                    : 'border-transparent text-[#6B7280] hover:text-[#1A1A1A]'
                }`}
              >
                Edit My Profile
              </button>
            </div>

            {/* TAB 1: Booking Requests */}
            {workerTab === 'requests' && (
              <div className="space-y-4">
                {pendingRequests.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pendingRequests.map((req) => (
                      <div
                        key={req.id}
                        className="bg-white rounded-2xl p-6 border border-amber-200 shadow-xs space-y-4"
                      >
                        <div className="flex items-center justify-between pb-3.5 border-b border-[#E5E7EB]">
                          <div>
                            <span className="text-[11px] font-bold text-amber-700 uppercase block font-heading">
                              New Request
                            </span>
                            <h4 className="font-heading font-bold text-base text-[#1A1A1A]">
                              {req.customer_name}
                            </h4>
                          </div>
                          <span className="text-sm font-heading font-bold text-[#1E5AA8]">
                            Rs. {req.booking_amount.toLocaleString()}
                          </span>
                        </div>

                        <div className="space-y-2 text-xs text-[#6B7280] font-body">
                          <div className="flex items-center gap-1.5 pt-1">
                            <span className="text-[11px] text-[#1FB863] font-bold flex items-center gap-1 bg-[#D6F5E3] px-2.5 py-1 rounded-lg border border-[#1FB863]/20">
                              <ShieldCheck size={13} /> In-App Voice Call Enabled
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-[#6B7280]" />
                            <span>Date & Time: </span>
                            <span className="font-semibold text-[#1A1A1A]">{req.date_needed} ({req.time_preference})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-[#6B7280]" />
                            <span>Address: </span>
                            <span className="font-medium text-[#1A1A1A]">{req.address}</span>
                          </div>
                          <p className="bg-amber-50/60 p-3 rounded-xl border border-amber-100 italic text-[#1A1A1A]">
                            &ldquo;{req.description}&rdquo;
                          </p>
                        </div>

                        <div className="pt-3 border-t border-[#E5E7EB] space-y-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                initiateCall({
                                  bookingId: req.id,
                                  calleeId: req.customer_id,
                                  calleeName: req.customer_name,
                                  calleePhoto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
                                  calleeRole: 'customer',
                                  category: req.category,
                                })
                              }
                              className="flex-1 py-2 rounded-[10px] bg-[#1FB863] hover:bg-[#189d53] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                            >
                              <PhoneCall size={14} />
                              <span>Call Customer</span>
                            </button>
                            <button
                              onClick={() => setSelectedChatBooking(req)}
                              className="flex-1 py-2 rounded-[10px] bg-[#0B0E12] hover:bg-gray-800 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                            >
                              <MessageSquare size={14} />
                              <span>Chat</span>
                            </button>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleStatusChange(req.id, 'cancelled')}
                              className="flex-1 py-2 rounded-[10px] border border-[#E5E7EB] text-[#1A1A1A] text-xs font-semibold hover:bg-gray-50 transition"
                            >
                              Decline
                            </button>
                            <button
                              onClick={() => handleStatusChange(req.id, 'accepted')}
                              className="flex-1 py-2 rounded-[10px] bg-[#F5820D] hover:bg-[#D97109] text-white text-xs font-semibold transition shadow-xs"
                            >
                              Accept Job
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl p-10 text-center border border-[#E5E7EB] text-xs text-[#6B7280] font-body">
                    Koi pending booking request nahi hai.
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Jobs in Progress */}
            {workerTab === 'my-jobs' && (
              <div className="space-y-4">
                {acceptedJobs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {acceptedJobs.map((job) => (
                      <div
                        key={job.id}
                        className="bg-white rounded-2xl p-6 border border-blue-200 shadow-xs space-y-4"
                      >
                        <div className="flex items-center justify-between pb-3.5 border-b border-[#E5E7EB]">
                          <div>
                            <span className="text-[11px] font-bold text-[#1E5AA8] uppercase block font-heading">
                              Accepted Job
                            </span>
                            <h4 className="font-heading font-bold text-base text-[#1A1A1A]">
                              {job.customer_name}
                            </h4>
                          </div>
                          <span className="text-sm font-heading font-bold text-emerald-700">
                            Rs. {job.booking_amount.toLocaleString()}
                          </span>
                        </div>

                        <div className="space-y-2 text-xs text-[#6B7280] font-body">
                          <div className="flex items-center gap-1.5 pt-1">
                            <span className="text-[11px] text-[#1FB863] font-bold flex items-center gap-1 bg-[#D6F5E3] px-2.5 py-1 rounded-lg border border-[#1FB863]/20">
                              <ShieldCheck size={13} /> In-App Audio Call Enabled
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-[#6B7280]" />
                            <span>Scheduled: </span>
                            <span className="font-semibold text-[#1A1A1A]">{job.date_needed} ({job.time_preference})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-[#6B7280]" />
                            <span>Address: </span>
                            <span className="font-medium text-[#1A1A1A]">{job.address}</span>
                          </div>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-[#E5E7EB]">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                initiateCall({
                                  bookingId: job.id,
                                  calleeId: job.customer_id,
                                  calleeName: job.customer_name,
                                  calleePhoto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
                                  calleeRole: 'customer',
                                  category: job.category,
                                })
                              }
                              className="flex-1 py-2.5 rounded-[10px] bg-[#1FB863] hover:bg-[#189d53] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                            >
                              <PhoneCall size={14} />
                              <span>Call Customer</span>
                            </button>
                            <button
                              onClick={() => setSelectedChatBooking(job)}
                              className="flex-1 py-2.5 rounded-[10px] bg-[#0B0E12] hover:bg-gray-800 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                            >
                              <MessageSquare size={14} />
                              <span>Chat</span>
                            </button>
                          </div>

                          <button
                            onClick={() => handleStatusChange(job.id, 'completed')}
                            className="w-full py-2.5 rounded-[10px] bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition shadow-xs flex items-center justify-center gap-1.5"
                          >
                            <CheckCircle2 size={16} />
                            <span>Mark as Completed</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl p-10 text-center border border-[#E5E7EB] text-xs text-[#6B7280] font-body">
                    Koi active in-progress job nahi hai.
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Earnings Table */}
            {workerTab === 'earnings' && (
              <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
                <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between">
                  <h3 className="font-heading font-bold text-base text-[#1A1A1A]">
                    Completed Jobs & Commission Ledger
                  </h3>
                  <span className="text-xs text-[#6B7280] font-body">Commission rate: 15% per booking</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-body">
                    <thead className="bg-[#F7F8FA] text-[#6B7280] uppercase tracking-wider font-heading font-semibold">
                      <tr>
                        <th className="p-4">Booking ID</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Total Amount</th>
                        <th className="p-4">Commission (15%)</th>
                        <th className="p-4">Net Earning</th>
                        <th className="p-4">Commission Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB]">
                      {completedJobs.map((job) => {
                        const net = job.booking_amount - job.commission_amount;
                        return (
                          <tr key={job.id} className="hover:bg-gray-50/50">
                            <td className="p-4 font-semibold text-[#1A1A1A]">{job.id}</td>
                            <td className="p-4 font-heading font-bold text-[#1A1A1A]">{job.customer_name}</td>
                            <td className="p-4 text-[#6B7280]">{job.date_needed}</td>
                            <td className="p-4 font-heading font-bold text-[#1A1A1A]">Rs. {job.booking_amount.toLocaleString()}</td>
                            <td className="p-4 text-red-600 font-semibold">Rs. {job.commission_amount.toLocaleString()}</td>
                            <td className="p-4 font-heading font-bold text-emerald-700">Rs. {net.toLocaleString()}</td>
                            <td className="p-4">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                                  job.commission_status === 'paid'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}
                              >
                                {job.commission_status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                      {completedJobs.length === 0 && (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-[#6B7280]">
                            No completed jobs yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: Edit Profile */}
            {workerTab === 'profile' && workerObj && (
              <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs max-w-2xl mx-auto space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
                  <div>
                    <h3 className="font-heading font-bold text-lg text-[#1A1A1A]">Edit Worker Profile</h3>
                    <p className="text-xs text-[#6B7280] font-body">Update your rate, availability status, and bio</p>
                  </div>
                  {workerObj.is_verified && <VerifiedBadge size={18} showText={true} />}
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  {/* Availability Toggle */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB]">
                    <div>
                      <span className="text-xs font-heading font-bold text-[#1A1A1A] block">Availability Toggle</span>
                      <span className="text-[11px] text-[#6B7280] font-body">
                        {isAvailable ? 'Customers can book you right now' : 'Set to busy if taking a break'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAvailable(!isAvailable)}
                      className={`px-4 py-2 rounded-[10px] text-xs font-semibold transition ${
                        isAvailable
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-600 text-white'
                      }`}
                    >
                      {isAvailable ? 'Available Now' : 'Marked Busy'}
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-heading font-bold text-[#1A1A1A] mb-1.5">
                      Starting Rate (PKR)
                    </label>
                    <input
                      type="number"
                      value={editRate}
                      onChange={(e) => setEditRate(Number(e.target.value))}
                      className="w-full p-3 text-xs rounded-[10px] border-1.5 border-[#E5E7EB] focus:outline-none focus:border-[#1E5AA8] font-body"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-heading font-bold text-[#1A1A1A] mb-1.5">
                      Professional Bio
                    </label>
                    <textarea
                      rows={4}
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      className="w-full p-3 text-xs rounded-[10px] border-1.5 border-[#E5E7EB] focus:outline-none focus:border-[#1E5AA8] font-body leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-[10px] bg-[#1E5AA8] hover:bg-[#154277] text-white font-semibold text-xs transition shadow-md"
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />

      <ReviewModal
        booking={selectedBookingForReview}
        isOpen={!!selectedBookingForReview}
        onClose={() => setSelectedBookingForReview(null)}
        onReviewSubmitted={() => refreshData(activeViewRole)}
      />

      <DisputeModal
        booking={selectedBookingForDispute}
        isOpen={!!selectedBookingForDispute}
        onClose={() => setSelectedBookingForDispute(null)}
        onSubmitted={() => refreshData(activeViewRole)}
      />

      <BookingChatModal
        booking={selectedChatBooking}
        isOpen={!!selectedChatBooking}
        onClose={() => setSelectedChatBooking(null)}
      />

      <BookingModal
        worker={selectedWorkerForRepeat}
        isOpen={!!selectedWorkerForRepeat}
        onClose={() => setSelectedWorkerForRepeat(null)}
        onBookingCreated={() => refreshData('customer')}
      />
    </div>
  );
}
