'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { VerifiedBadge } from '@/components/verified-badge';
import { StarRating } from '@/components/star-rating';
import {
  getWorkers,
  getBookings,
  verifyWorkerCNIC,
  updateBookingStatus,
  initializeStore,
} from '@/lib/store';
import { Worker, Booking } from '@/lib/types';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  FileCheck,
  Search,
  Check,
  X,
  Eye,
  ArrowRight,
} from 'lucide-react';

export default function AdminPage() {
  const [workers, setWorkers] = useState<Worker[]>(() => {
    initializeStore();
    return getWorkers();
  });
  const [bookings, setBookings] = useState<Booking[]>(() => getBookings());

  const [activeTab, setActiveTab] = useState<'verifications' | 'workers' | 'bookings' | 'commission'>('verifications');
  const [selectedCnicWorker, setSelectedCnicWorker] = useState<Worker | null>(null);

  const refreshData = useCallback(() => {
    setWorkers(getWorkers());
    setBookings(getBookings());
  }, []);

  const handleApproveCNIC = (workerId: string) => {
    verifyWorkerCNIC(workerId, true);
    refreshData();
    setSelectedCnicWorker(null);
  };

  const handleRejectCNIC = (workerId: string) => {
    verifyWorkerCNIC(workerId, false);
    refreshData();
    setSelectedCnicWorker(null);
  };

  // Stats
  const pendingVerifications = workers.filter((w) => !w.is_verified);
  const totalVerified = workers.filter((w) => w.is_verified).length;
  const completedBookings = bookings.filter((b) => b.status === 'completed');
  const totalPlatformRevenue = completedBookings.reduce((sum, b) => sum + b.commission_amount, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FA] font-body">
      <Navbar />

      {/* Admin Header */}
      <div className="bg-gradient-to-r from-[#102a52] via-[#1E5AA8] to-[#154277] text-white py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-3 border border-amber-500/30">
              <ShieldAlert size={14} /> Administrator Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold tracking-tight">Naya Kaam Control Center</h1>
            <p className="text-xs text-blue-100 mt-1 font-body">
              NADRA CNIC verification, provider approval, and 10% commission revenue ledger
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => refreshData()}
              className="px-4 py-2.5 rounded-[10px] bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition border border-white/20 backdrop-blur-md"
            >
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-1">
            <div className="flex items-center justify-between text-[#6B7280]">
              <span className="text-xs font-bold font-heading uppercase tracking-wider">Pending CNIC</span>
              <FileCheck size={18} className="text-amber-500" />
            </div>
            <span className="text-2xl font-heading font-extrabold text-amber-600 block">
              {pendingVerifications.length}
            </span>
            <span className="text-[11px] text-[#6B7280] font-body">Awaiting approval</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-1">
            <div className="flex items-center justify-between text-[#6B7280]">
              <span className="text-xs font-bold font-heading uppercase tracking-wider">Verified Workers</span>
              <Users size={18} className="text-[#1E5AA8]" />
            </div>
            <span className="text-2xl font-heading font-extrabold text-[#1E5AA8] block">
              {totalVerified}
            </span>
            <span className="text-[11px] text-[#6B7280] font-body">Out of {workers.length} total</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-1">
            <div className="flex items-center justify-between text-[#6B7280]">
              <span className="text-xs font-bold font-heading uppercase tracking-wider">Total Bookings</span>
              <Calendar size={18} className="text-emerald-600" />
            </div>
            <span className="text-2xl font-heading font-extrabold text-emerald-600 block">
              {bookings.length}
            </span>
            <span className="text-[11px] text-[#6B7280] font-body">{completedBookings.length} completed</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-1">
            <div className="flex items-center justify-between text-[#6B7280]">
              <span className="text-xs font-bold font-heading uppercase tracking-wider">Platform Revenue</span>
              <TrendingUp size={18} className="text-purple-600" />
            </div>
            <span className="text-2xl font-heading font-extrabold text-purple-700 block">
              Rs. {totalPlatformRevenue.toLocaleString()}
            </span>
            <span className="text-[11px] text-[#6B7280] font-body">10% commission earnings</span>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex border-b border-[#E5E7EB] space-x-6 text-xs font-heading font-bold mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('verifications')}
            className={`pb-3 border-b-2 transition whitespace-nowrap ${
              activeTab === 'verifications'
                ? 'border-[#1E5AA8] text-[#1E5AA8]'
                : 'border-transparent text-[#6B7280] hover:text-[#1A1A1A]'
            }`}
          >
            CNIC Verification Queue ({pendingVerifications.length})
          </button>
          <button
            onClick={() => setActiveTab('workers')}
            className={`pb-3 border-b-2 transition whitespace-nowrap ${
              activeTab === 'workers'
                ? 'border-[#1E5AA8] text-[#1E5AA8]'
                : 'border-transparent text-[#6B7280] hover:text-[#1A1A1A]'
            }`}
          >
            All Workers ({workers.length})
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-3 border-b-2 transition whitespace-nowrap ${
              activeTab === 'bookings'
                ? 'border-[#1E5AA8] text-[#1E5AA8]'
                : 'border-transparent text-[#6B7280] hover:text-[#1A1A1A]'
            }`}
          >
            Master Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('commission')}
            className={`pb-3 border-b-2 transition whitespace-nowrap ${
              activeTab === 'commission'
                ? 'border-[#1E5AA8] text-[#1E5AA8]'
                : 'border-transparent text-[#6B7280] hover:text-[#1A1A1A]'
            }`}
          >
            Commission Revenue Ledger
          </button>
        </div>

        {/* TAB 1: CNIC Verification Queue */}
        {activeTab === 'verifications' && (
          <div className="space-y-6">
            {pendingVerifications.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pendingVerifications.map((worker) => (
                  <div
                    key={worker.id}
                    className="bg-white rounded-2xl p-5 border border-amber-200 card-shadow space-y-4"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border">
                          <Image
                            src={worker.profile_photo_url}
                            alt={worker.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-base text-[#1A1A1A]">
                            {worker.name}
                          </h4>
                          <span className="text-xs text-[#1E5AA8] font-semibold">
                            {worker.category} • {worker.city}
                          </span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                        Pending CNIC
                      </span>
                    </div>

                    <div className="space-y-2 text-xs text-[#4A4A4A]">
                      <div>
                        <span className="text-gray-400">CNIC Number: </span>
                        <span className="font-mono font-bold text-[#1A1A1A] bg-gray-100 px-2 py-0.5 rounded-md">
                          {worker.cnic_number}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Phone: </span>
                        <span className="font-semibold">{worker.phone}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Experience: </span>
                        <span className="font-semibold">{worker.years_experience} Years</span>
                      </div>
                    </div>

                    {/* CNIC Image preview trigger button */}
                    <div className="pt-2 flex items-center justify-between">
                      <button
                        onClick={() => setSelectedCnicWorker(worker)}
                        className="text-xs font-bold text-[#1E5AA8] hover:underline flex items-center gap-1"
                      >
                        <Eye size={14} /> View Uploaded CNIC Documents
                      </button>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex gap-3">
                      <button
                        onClick={() => handleRejectCNIC(worker.id)}
                        className="flex-1 py-2.5 rounded-xl border border-red-200 text-red-700 text-xs font-bold hover:bg-red-50 transition flex items-center justify-center gap-1"
                      >
                        <X size={15} /> Reject
                      </button>
                      <button
                        onClick={() => handleApproveCNIC(worker.id)}
                        className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs flex items-center justify-center gap-1"
                      >
                        <Check size={15} /> Approve & Verify
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 card-shadow text-xs text-gray-500">
                Sab worker CNIC documents approve ho chuke hain! Pending queue empty hai.
              </div>
            )}
          </div>
        )}

        {/* TAB 2: All Workers Table */}
        {activeTab === 'workers' && (
          <div className="bg-white rounded-2xl border border-gray-100 card-shadow overflow-hidden">
            <div className="p-4 border-b border-gray-100 font-bold text-sm text-[#1A1A1A]">
              Platform Service Providers Directory
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="p-3.5">Provider</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">City</th>
                    <th className="p-3.5">CNIC Status</th>
                    <th className="p-3.5">Rate</th>
                    <th className="p-3.5">Rating</th>
                    <th className="p-3.5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {workers.map((w) => (
                    <tr key={w.id} className="hover:bg-gray-50/50">
                      <td className="p-3.5 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 border relative">
                          <Image src={w.profile_photo_url} alt={w.name} fill className="object-cover" />
                        </div>
                        <span className="font-bold text-[#1A1A1A]">{w.name}</span>
                      </td>
                      <td className="p-3.5 text-[#1E5AA8] font-semibold">{w.category}</td>
                      <td className="p-3.5 text-gray-600">{w.city}</td>
                      <td className="p-3.5">
                        {w.is_verified ? (
                          <VerifiedBadge size={14} showText={true} />
                        ) : (
                          <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-semibold text-[10px]">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 font-bold text-[#1A1A1A]">
                        Rs. {w.rate_amount.toLocaleString()}/{w.rate_type === 'hourly' ? 'hr' : 'job'}
                      </td>
                      <td className="p-3.5">
                        <StarRating rating={w.average_rating} totalReviews={w.total_reviews} size={13} />
                      </td>
                      <td className="p-3.5">
                        <button
                          onClick={() =>
                            w.is_verified
                              ? handleRejectCNIC(w.id)
                              : handleApproveCNIC(w.id)
                          }
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                            w.is_verified
                              ? 'border border-red-200 text-red-600 hover:bg-red-50'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700'
                          }`}
                        >
                          {w.is_verified ? 'Unverify' : 'Verify CNIC'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: All Bookings Master View */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-2xl border border-gray-100 card-shadow overflow-hidden">
            <div className="p-4 border-b border-gray-100 font-bold text-sm text-[#1A1A1A]">
              Master Bookings Record
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="p-3.5">Booking ID</th>
                    <th className="p-3.5">Customer</th>
                    <th className="p-3.5">Worker</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Date</th>
                    <th className="p-3.5">Amount</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50/50">
                      <td className="p-3.5 font-semibold text-gray-500">{b.id}</td>
                      <td className="p-3.5 font-bold text-[#1A1A1A]">{b.customer_name}</td>
                      <td className="p-3.5 font-bold text-[#1E5AA8]">{b.worker_name}</td>
                      <td className="p-3.5 text-gray-600">{b.category}</td>
                      <td className="p-3.5 text-gray-500">{b.date_needed}</td>
                      <td className="p-3.5 font-bold text-[#1A1A1A]">Rs. {b.booking_amount.toLocaleString()}</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                            b.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : b.status === 'accepted'
                              ? 'bg-blue-100 text-[#1E5AA8]'
                              : b.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: Commission Revenue Ledger */}
        {activeTab === 'commission' && (
          <div className="bg-white rounded-2xl border border-gray-100 card-shadow overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-[#1A1A1A]">
                  Platform Commission Revenue (10%)
                </h3>
                <p className="text-xs text-gray-500">
                  Calculated automatically on every completed booking
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-400 block">Total Accumulated Revenue</span>
                <span className="text-xl font-bold text-emerald-700">
                  Rs. {totalPlatformRevenue.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="p-3.5">Booking ID</th>
                    <th className="p-3.5">Worker</th>
                    <th className="p-3.5">Total Job Price</th>
                    <th className="p-3.5">10% Platform Cut</th>
                    <th className="p-3.5">Worker Payout</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {completedBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50/50">
                      <td className="p-3.5 font-semibold text-gray-500">{b.id}</td>
                      <td className="p-3.5 font-bold text-[#1A1A1A]">{b.worker_name}</td>
                      <td className="p-3.5 font-bold text-gray-700">Rs. {b.booking_amount.toLocaleString()}</td>
                      <td className="p-3.5 font-bold text-emerald-700">Rs. {b.commission_amount.toLocaleString()}</td>
                      <td className="p-3.5 text-gray-600">
                        Rs. {(b.booking_amount - b.commission_amount).toLocaleString()}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Collected
                        </span>
                      </td>
                    </tr>
                  ))}
                  {completedBookings.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-gray-400">
                        No completed bookings revenue yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* CNIC Document Viewer Modal */}
      {selectedCnicWorker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-gray-100 relative space-y-4">
            <button
              onClick={() => setSelectedCnicWorker(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100"
            >
              <X size={20} />
            </button>

            <h3 className="font-bold text-lg text-[#1A1A1A] flex items-center gap-2">
              <ShieldAlert className="text-amber-600" size={20} />
              CNIC Verification Documents — {selectedCnicWorker.name}
            </h3>

            <div className="p-3 bg-gray-50 rounded-xl text-xs space-y-1">
              <div><span className="text-gray-400">CNIC Number:</span> <span className="font-bold">{selectedCnicWorker.cnic_number}</span></div>
              <div><span className="text-gray-400">Phone:</span> <span className="font-bold">{selectedCnicWorker.phone}</span></div>
              <div><span className="text-gray-400">City / Area:</span> <span className="font-bold">{selectedCnicWorker.area}, {selectedCnicWorker.city}</span></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-xs font-bold text-gray-600 block mb-1">CNIC Front Copy</span>
                <div className="relative h-36 rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
                  <Image
                    src={selectedCnicWorker.cnic_front_url || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400'}
                    alt="CNIC Front"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div>
                <span className="text-xs font-bold text-gray-600 block mb-1">CNIC Back Copy</span>
                <div className="relative h-36 rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
                  <Image
                    src={selectedCnicWorker.cnic_back_url || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400'}
                    alt="CNIC Back"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => handleRejectCNIC(selectedCnicWorker.id)}
                className="flex-1 py-2.5 rounded-xl border border-red-200 text-red-700 font-bold text-xs hover:bg-red-50"
              >
                Reject Documents
              </button>
              <button
                onClick={() => handleApproveCNIC(selectedCnicWorker.id)}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-xs"
              >
                Approve & Mark Verified
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
