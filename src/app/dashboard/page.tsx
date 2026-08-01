'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { ReviewModal } from '@/components/review-modal';
import { VerifiedBadge } from '@/components/verified-badge';
import { StarRating } from '@/components/star-rating';
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
  ThumbsUp,
  Sparkles,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

export default function DashboardPage() {
  const [currentUser, setUserState] = useState<User | null>(null);
  const [activeViewRole, setActiveViewRole] = useState<'customer' | 'worker'>('customer');

  // Customer state
  const [customerBookings, setCustomerBookings] = useState<Booking[]>([]);
  const [customerTab, setCustomerTab] = useState<'active' | 'completed' | 'cancelled'>('active');
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<Booking | null>(null);

  // Worker state
  const [workerObj, setWorkerObj] = useState<Worker | null>(null);
  const [workerBookings, setWorkerBookings] = useState<Booking[]>([]);
  const [workerTab, setWorkerTab] = useState<'requests' | 'my-jobs' | 'earnings' | 'profile'>('requests');

  // Edit worker profile form state
  const [editBio, setEditBio] = useState('');
  const [editRate, setEditRate] = useState(1000);
  const [isAvailable, setIsAvailable] = useState(true);

  const refreshData = (role: 'customer' | 'worker') => {
    const user = getCurrentUser();
    if (role === 'customer') {
      const bks = getCustomerBookings(user?.id || 'u-c1');
      setCustomerBookings(bks);
    } else {
      const wId = user?.role === 'worker' ? 'w-1' : 'w-1'; // Default worker for demo
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
  };

  useEffect(() => {
    initializeStore();
    const user = getCurrentUser();
    setUserState(user);
    const role = user?.role === 'worker' ? 'worker' : 'customer';
    setActiveViewRole(role);

    refreshData(role);
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
  const totalCommissionOwed = Math.round(totalEarnings * 0.1);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Navbar />

      {/* Top Role Switcher Header */}
      <div className="bg-white border-b border-gray-100 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1A1A1A] flex items-center gap-2">
              Dashboard
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#1E5AA8]/10 text-[#1E5AA8] capitalize">
                {activeViewRole} View
              </span>
            </h1>
            <p className="text-xs text-[#4A4A4A] mt-1">
              Manage your bookings, service requests, and earnings seamlessly
            </p>
          </div>

          {/* Role Switcher Pill */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl border border-gray-200 text-xs font-bold w-fit">
            <button
              onClick={() => handleRoleToggle('customer')}
              className={`px-4 py-2 rounded-lg transition ${
                activeViewRole === 'customer'
                  ? 'bg-[#1E5AA8] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Customer View
            </button>
            <button
              onClick={() => handleRoleToggle('worker')}
              className={`px-4 py-2 rounded-lg transition ${
                activeViewRole === 'worker'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Worker View
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {/* ========================================================= */}
        {/* CUSTOMER DASHBOARD VIEW */}
        {/* ========================================================= */}
        {activeViewRole === 'customer' && (
          <div className="space-y-6">
            {/* Tabs Header */}
            <div className="flex border-b border-gray-200 space-x-6 text-sm font-bold">
              <button
                onClick={() => setCustomerTab('active')}
                className={`pb-3 border-b-2 transition ${
                  customerTab === 'active'
                    ? 'border-[#1E5AA8] text-[#1E5AA8]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Active Bookings ({customerBookings.filter((b) => b.status === 'pending' || b.status === 'accepted').length})
              </button>
              <button
                onClick={() => setCustomerTab('completed')}
                className={`pb-3 border-b-2 transition ${
                  customerTab === 'completed'
                    ? 'border-[#1E5AA8] text-[#1E5AA8]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Past / Completed ({customerBookings.filter((b) => b.status === 'completed').length})
              </button>
              <button
                onClick={() => setCustomerTab('cancelled')}
                className={`pb-3 border-b-2 transition ${
                  customerTab === 'cancelled'
                    ? 'border-[#1E5AA8] text-[#1E5AA8]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Cancelled ({customerBookings.filter((b) => b.status === 'cancelled').length})
              </button>
            </div>

            {/* Bookings List */}
            {(() => {
              const filtered = customerBookings.filter((b) => {
                if (customerTab === 'active') return b.status === 'pending' || b.status === 'accepted';
                if (customerTab === 'completed') return b.status === 'completed';
                return b.status === 'cancelled';
              });

              if (filtered.length === 0) {
                return (
                  <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 card-shadow space-y-3 max-w-md mx-auto my-6">
                    <Calendar size={36} className="text-gray-300 mx-auto" />
                    <h3 className="text-base font-bold text-[#1A1A1A]">No Bookings Here Yet</h3>
                    <p className="text-xs text-[#4A4A4A]">
                      {customerTab === 'active'
                        ? 'Aap ki koi active booking request nahi hai.'
                        : 'Iss section mein filhaal koi record nahi hai.'}
                    </p>
                    <Link
                      href="/search"
                      className="inline-block px-4 py-2 bg-[#F5820D] text-white rounded-xl text-xs font-bold transition hover:bg-[#D97109]"
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
                      className="bg-white rounded-2xl p-5 border border-gray-100 card-shadow space-y-4"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0 border">
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
                            <h4 className="font-bold text-sm text-[#1A1A1A]">
                              {booking.worker_name}
                            </h4>
                            <span className="text-xs text-[#1E5AA8] font-semibold">
                              {booking.category}
                            </span>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                            booking.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : booking.status === 'accepted'
                              ? 'bg-blue-100 text-[#1E5AA8]'
                              : booking.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>

                      <div className="space-y-2 text-xs text-[#4A4A4A]">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-gray-400" />
                          <span>Date Needed: </span>
                          <span className="font-bold text-[#1A1A1A]">{booking.date_needed}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-gray-400" />
                          <span>Time: </span>
                          <span className="font-semibold">{booking.time_preference}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-gray-400" />
                          <span>Address: </span>
                          <span className="font-medium truncate">{booking.address}</span>
                        </div>
                        {booking.worker_phone && (
                          <div className="flex items-center gap-2">
                            <Phone size={14} className="text-emerald-600" />
                            <span>Worker Phone: </span>
                            <span className="font-bold text-emerald-700">{booking.worker_phone}</span>
                          </div>
                        )}
                        <p className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 italic">
                          &ldquo;{booking.description}&rdquo;
                        </p>
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-[#1E5AA8]">
                          Estimated: Rs. {booking.booking_amount.toLocaleString()}
                        </span>

                        <div className="flex gap-2">
                          {booking.status === 'pending' && (
                            <button
                              onClick={() => handleStatusChange(booking.id, 'cancelled')}
                              className="px-3 py-1.5 rounded-xl text-xs font-bold text-red-600 border border-red-200 hover:bg-red-50 transition"
                            >
                              Cancel Booking
                            </button>
                          )}

                          {booking.status === 'completed' && !booking.has_review && (
                            <button
                              onClick={() => setSelectedBookingForReview(booking)}
                              className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-[#F5820D] hover:bg-[#D97109] transition flex items-center gap-1 shadow-xs"
                            >
                              <ThumbsUp size={13} />
                              <span>Leave Review</span>
                            </button>
                          )}

                          {booking.status === 'completed' && booking.has_review && (
                            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                              <CheckCircle2 size={14} /> Reviewed
                            </span>
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
              <div className="bg-white p-4 rounded-2xl border border-gray-100 card-shadow text-center">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                  Total Bookings
                </span>
                <span className="text-2xl font-bold text-[#1A1A1A] mt-1 block">
                  {totalBookings}
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-gray-100 card-shadow text-center">
                <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">
                  Pending Requests
                </span>
                <span className="text-2xl font-bold text-amber-600 mt-1 block">
                  {pendingRequests.length}
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-gray-100 card-shadow text-center">
                <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">
                  Completed Jobs
                </span>
                <span className="text-2xl font-bold text-emerald-600 mt-1 block">
                  {completedJobs.length}
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-gray-100 card-shadow text-center">
                <span className="text-[11px] font-bold text-[#1E5AA8] uppercase tracking-wider block">
                  Average Rating
                </span>
                <span className="text-2xl font-bold text-[#1E5AA8] mt-1 block">
                  {workerObj?.average_rating ? workerObj.average_rating.toFixed(1) : '5.0'} ★
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-gray-100 card-shadow text-center">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                  Total Earnings
                </span>
                <span className="text-lg font-bold text-[#1A1A1A] mt-1 block">
                  Rs. {totalEarnings.toLocaleString()}
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-gray-100 card-shadow text-center">
                <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider block">
                  Commission (10%)
                </span>
                <span className="text-lg font-bold text-red-600 mt-1 block">
                  Rs. {totalCommissionOwed.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Worker Tabs Header */}
            <div className="flex border-b border-gray-200 space-x-6 text-sm font-bold overflow-x-auto">
              <button
                onClick={() => setWorkerTab('requests')}
                className={`pb-3 border-b-2 transition whitespace-nowrap ${
                  workerTab === 'requests'
                    ? 'border-[#1E5AA8] text-[#1E5AA8]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Booking Requests ({pendingRequests.length})
              </button>
              <button
                onClick={() => setWorkerTab('my-jobs')}
                className={`pb-3 border-b-2 transition whitespace-nowrap ${
                  workerTab === 'my-jobs'
                    ? 'border-[#1E5AA8] text-[#1E5AA8]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                My Jobs in Progress ({acceptedJobs.length})
              </button>
              <button
                onClick={() => setWorkerTab('earnings')}
                className={`pb-3 border-b-2 transition whitespace-nowrap ${
                  workerTab === 'earnings'
                    ? 'border-[#1E5AA8] text-[#1E5AA8]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Earnings & Commission Report
              </button>
              <button
                onClick={() => setWorkerTab('profile')}
                className={`pb-3 border-b-2 transition whitespace-nowrap ${
                  workerTab === 'profile'
                    ? 'border-[#1E5AA8] text-[#1E5AA8]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
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
                        className="bg-white rounded-2xl p-5 border border-amber-200 card-shadow space-y-4"
                      >
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                          <div>
                            <span className="text-[11px] font-bold text-amber-700 uppercase block">
                              New Request
                            </span>
                            <h4 className="font-bold text-base text-[#1A1A1A]">
                              {req.customer_name}
                            </h4>
                          </div>
                          <span className="text-sm font-bold text-[#1E5AA8]">
                            Rs. {req.booking_amount.toLocaleString()}
                          </span>
                        </div>

                        <div className="space-y-2 text-xs text-[#4A4A4A]">
                          <div className="flex items-center gap-2">
                            <Phone size={14} className="text-gray-400" />
                            <span>Customer Phone: </span>
                            <span className="font-bold text-[#1A1A1A]">{req.customer_phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-gray-400" />
                            <span>Date & Time: </span>
                            <span className="font-semibold">{req.date_needed} ({req.time_preference})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-gray-400" />
                            <span>Address: </span>
                            <span className="font-medium">{req.address}</span>
                          </div>
                          <p className="bg-amber-50/60 p-2.5 rounded-xl border border-amber-100 italic">
                            &ldquo;{req.description}&rdquo;
                          </p>
                        </div>

                        <div className="pt-3 border-t border-gray-100 flex gap-3">
                          <button
                            onClick={() => handleStatusChange(req.id, 'cancelled')}
                            className="flex-1 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50 transition"
                          >
                            Decline Request
                          </button>
                          <button
                            onClick={() => handleStatusChange(req.id, 'accepted')}
                            className="flex-1 py-2 rounded-xl bg-[#F5820D] hover:bg-[#D97109] text-white text-xs font-bold transition shadow-xs"
                          >
                            Accept Request
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 card-shadow text-xs text-gray-500">
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
                        className="bg-white rounded-2xl p-5 border border-blue-200 card-shadow space-y-4"
                      >
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                          <div>
                            <span className="text-[11px] font-bold text-blue-700 uppercase block">
                              Accepted Job
                            </span>
                            <h4 className="font-bold text-base text-[#1A1A1A]">
                              {job.customer_name}
                            </h4>
                          </div>
                          <span className="text-sm font-bold text-emerald-700">
                            Rs. {job.booking_amount.toLocaleString()}
                          </span>
                        </div>

                        <div className="space-y-2 text-xs text-[#4A4A4A]">
                          <div className="flex items-center gap-2">
                            <Phone size={14} className="text-emerald-600" />
                            <span>Contact Customer: </span>
                            <span className="font-bold text-[#1A1A1A]">{job.customer_phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-gray-400" />
                            <span>Scheduled: </span>
                            <span className="font-semibold">{job.date_needed} ({job.time_preference})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-gray-400" />
                            <span>Address: </span>
                            <span className="font-medium">{job.address}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleStatusChange(job.id, 'completed')}
                          className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 size={16} />
                          <span>Mark as Completed</span>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 card-shadow text-xs text-gray-500">
                    Koi active in-progress job nahi hai.
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Earnings Table */}
            {workerTab === 'earnings' && (
              <div className="bg-white rounded-2xl border border-gray-100 card-shadow overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-base text-[#1A1A1A]">
                    Completed Jobs & Commission Ledger
                  </h3>
                  <span className="text-xs text-gray-500">Commission rate: 10% per booking</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold">
                      <tr>
                        <th className="p-3.5">Booking ID</th>
                        <th className="p-3.5">Customer</th>
                        <th className="p-3.5">Date</th>
                        <th className="p-3.5">Total Amount</th>
                        <th className="p-3.5">Commission (10%)</th>
                        <th className="p-3.5">Net Earning</th>
                        <th className="p-3.5">Commission Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {completedJobs.map((job) => {
                        const net = job.booking_amount - job.commission_amount;
                        return (
                          <tr key={job.id} className="hover:bg-gray-50/50">
                            <td className="p-3.5 font-semibold text-gray-700">{job.id}</td>
                            <td className="p-3.5 font-bold text-[#1A1A1A]">{job.customer_name}</td>
                            <td className="p-3.5 text-gray-500">{job.date_needed}</td>
                            <td className="p-3.5 font-bold text-[#1A1A1A]">Rs. {job.booking_amount.toLocaleString()}</td>
                            <td className="p-3.5 text-red-600 font-semibold">Rs. {job.commission_amount.toLocaleString()}</td>
                            <td className="p-3.5 font-bold text-emerald-700">Rs. {net.toLocaleString()}</td>
                            <td className="p-3.5">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                                  job.commission_status === 'paid'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-800'
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
                          <td colSpan={7} className="p-6 text-center text-gray-400">
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
              <div className="bg-white rounded-2xl p-6 border border-gray-100 card-shadow max-w-2xl mx-auto space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="font-bold text-lg text-[#1A1A1A]">Edit Worker Profile</h3>
                    <p className="text-xs text-gray-500">Update your rate, availability status, and bio</p>
                  </div>
                  {workerObj.is_verified && <VerifiedBadge size={18} showText={true} />}
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  {/* Availability Toggle */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <div>
                      <span className="text-xs font-bold text-[#1A1A1A] block">Availability Toggle</span>
                      <span className="text-[11px] text-gray-500">
                        {isAvailable ? 'Customers can book you right now' : 'Set to busy if taking a break'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAvailable(!isAvailable)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                        isAvailable
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-600 text-white'
                      }`}
                    >
                      {isAvailable ? 'Available Now' : 'Marked Busy'}
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                      Starting Rate (PKR)
                    </label>
                    <input
                      type="number"
                      value={editRate}
                      onChange={(e) => setEditRate(Number(e.target.value))}
                      className="w-full p-2.5 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#1E5AA8]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                      Professional Bio
                    </label>
                    <textarea
                      rows={4}
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      className="w-full p-2.5 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#1E5AA8]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#1E5AA8] hover:bg-[#174786] text-white font-bold text-xs transition shadow-md"
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
    </div>
  );
}
