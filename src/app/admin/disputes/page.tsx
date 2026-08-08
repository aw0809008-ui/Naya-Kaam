'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { getDisputeReports, resolveDisputeReport, getBookings, getBookingChatMessages } from '@/lib/store';
import { DisputeReport, Booking, ChatMessage } from '@/lib/types';
import {
  AlertOctagon,
  CheckCircle2,
  Clock,
  ShieldAlert,
  MessageSquare,
  Eye,
  X,
  Lock,
  Key,
  AlertTriangle,
  ArrowLeft,
  DollarSign,
  User,
} from 'lucide-react';

export default function AdminDisputesPage() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('nayakaam_admin_session') === 'true';
    }
    return false;
  });
  const [passkeyInput, setPasskeyInput] = useState('');
  const [passkeyError, setPasskeyError] = useState('');

  const [disputes, setDisputes] = useState<DisputeReport[]>(() => getDisputeReports());
  const [selectedDispute, setSelectedDispute] = useState<DisputeReport | null>(null);
  const [relatedBooking, setRelatedBooking] = useState<Booking | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [adminNote, setAdminNote] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'resolved'>('all');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passkeyInput === '7860' || passkeyInput === 'admin123') {
      if (typeof window !== 'undefined') {
        localStorage.setItem('nayakaam_admin_session', 'true');
      }
      setIsAdminAuthenticated(true);
      setPasskeyError('');
    } else {
      setPasskeyError('Ghalat Passkey!');
    }
  };

  const handleViewDetails = (dispute: DisputeReport) => {
    setSelectedDispute(dispute);
    setAdminNote('');
    const allBookings = getBookings();
    const bk = allBookings.find((b) => b.id === dispute.booking_id) || null;
    setRelatedBooking(bk);

    if (dispute.booking_id) {
      const msgs = getBookingChatMessages(dispute.booking_id);
      setChatHistory(msgs);
    } else {
      setChatHistory([]);
    }
  };

  const handleResolve = (
    resolutionStatus: 'resolved_refunded' | 'resolved_no_action' | 'resolved_worker_warned'
  ) => {
    if (!selectedDispute) return;
    const updated = resolveDisputeReport(selectedDispute.id, resolutionStatus, adminNote);
    setDisputes(updated);

    const updatedCurrent = updated.find((d) => d.id === selectedDispute.id) || null;
    setSelectedDispute(updatedCurrent);
  };

  const filteredDisputes = disputes.filter((d) => {
    if (filterStatus === 'open') return d.status === 'open' || d.status === 'under_review';
    if (filterStatus === 'resolved') return d.status !== 'open' && d.status !== 'under_review';
    return true;
  });

  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F7F8FA] font-body">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4 my-12">
          <div className="bg-white rounded-2xl p-8 border border-[#E5E7EB] shadow-xl max-w-md w-full text-center space-y-4">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto border border-rose-200">
              <Lock size={24} />
            </div>
            <h2 className="text-xl font-heading font-bold text-[#1A1A1A]">Dispute Resolution Console</h2>
            <p className="text-xs text-[#6B7280]">
              Enter admin passkey (7860) to manage customer-worker dispute cases.
            </p>
            <form onSubmit={handleAdminLogin} className="space-y-3">
              <input
                type="password"
                value={passkeyInput}
                onChange={(e) => setPasskeyInput(e.target.value)}
                placeholder="Admin Passkey"
                className="w-full p-3 text-xs rounded-xl border border-gray-200 font-medium"
              />
              {passkeyError && <p className="text-xs text-rose-600 font-bold">{passkeyError}</p>}
              <button type="submit" className="btn btn-lime w-full py-3 text-xs font-bold">
                Unlock Disputes Panel
              </button>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8F5] text-[#0B0E12] font-body">
      <Navbar />

      <div className="bg-[#0B0E12] text-white py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link href="/admin" className="text-xs font-bold text-[#39E07A] hover:underline flex items-center gap-1">
                <ArrowLeft size={14} /> Admin Home
              </Link>
              <span className="text-gray-600">•</span>
              <span className="text-xs font-extrabold text-rose-400 uppercase tracking-wider">Dispute Resolution</span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
              Customer & Worker Dispute Cases
            </h1>
            <p className="text-xs text-[#666E7A] font-medium">
              Review booking logs, evidence photos, chat transcripts and issue resolutions.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#171C24] p-1.5 rounded-xl border border-[#27303E]">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                filterStatus === 'all' ? 'bg-[#39E07A] text-[#0B0E12]' : 'text-gray-400 hover:text-white'
              }`}
            >
              All ({disputes.length})
            </button>
            <button
              onClick={() => setFilterStatus('open')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                filterStatus === 'open' ? 'bg-[#39E07A] text-[#0B0E12]' : 'text-gray-400 hover:text-white'
              }`}
            >
              Open ({disputes.filter((d) => d.status === 'open' || d.status === 'under_review').length})
            </button>
            <button
              onClick={() => setFilterStatus('resolved')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                filterStatus === 'resolved' ? 'bg-[#39E07A] text-[#0B0E12]' : 'text-gray-400 hover:text-white'
              }`}
            >
              Resolved ({disputes.filter((d) => d.status !== 'open' && d.status !== 'under_review').length})
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full flex-1 space-y-6">
        {filteredDisputes.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#EAECE7] space-y-2">
            <CheckCircle2 size={40} className="text-emerald-500 mx-auto" />
            <h3 className="font-heading font-bold text-lg text-[#0B0E12]">No Dispute Reports Found</h3>
            <p className="text-xs text-[#666E7A]">Is filter category mein koi dispute report nahi hai.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDisputes.map((dispute) => (
              <div
                key={dispute.id}
                className="bg-white rounded-2xl border border-[#EAECE7] p-5 shadow-xs hover:shadow-md transition space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-[#EAECE7]">
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-100">
                      {dispute.issue_category}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                        dispute.status === 'open'
                          ? 'bg-amber-100 text-amber-800'
                          : dispute.status === 'resolved_refunded'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {dispute.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-[#666E7A] font-semibold block">Booking ID #{dispute.booking_id}</span>
                    <h3 className="font-heading font-extrabold text-sm text-[#0B0E12] mt-0.5">
                      Reported by {(dispute.complainant_role || dispute.reporter_role || 'user').toUpperCase()}
                    </h3>
                    <p className="text-xs text-[#666E7A] line-clamp-3 mt-1 font-medium bg-[#F7F8F5] p-2.5 rounded-xl border border-[#EAECE7]">
                      &ldquo;{dispute.description}&rdquo;
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#EAECE7] flex items-center justify-between">
                  <span className="text-[11px] text-[#666E7A] font-medium">
                    {new Date(dispute.created_at).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleViewDetails(dispute)}
                    className="btn btn-lime py-2 px-3 text-xs font-bold flex items-center gap-1"
                  >
                    <Eye size={14} /> Review & Action
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action & Detail Modal */}
      {selectedDispute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-[26px] max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#EAECE7] relative max-h-[90vh] overflow-y-auto space-y-6">
            <button
              onClick={() => setSelectedDispute(null)}
              className="absolute top-5 right-5 text-[#666E7A] hover:text-[#0B0E12] p-1.5 rounded-full hover:bg-gray-100 transition"
            >
              <X size={20} />
            </button>

            <div className="space-y-1 border-b border-[#EAECE7] pb-4 pr-8">
              <div className="flex items-center gap-2 text-rose-600 font-extrabold text-xs uppercase tracking-wider">
                <AlertOctagon size={16} />
                <span>Dispute Case Investigation</span>
              </div>
              <h2 className="font-heading font-extrabold text-xl text-[#0B0E12]">
                Report #{selectedDispute.id}
              </h2>
              <p className="text-xs text-[#666E7A]">
                Issue Category: <strong className="text-[#0B0E12]">{selectedDispute.issue_category}</strong>
              </p>
            </div>

            {/* Complainant Statement */}
            <div className="bg-rose-50/50 border border-rose-100 p-4 rounded-2xl space-y-1.5">
              <span className="text-xs font-bold text-rose-800 block">Complainant Statement:</span>
              <p className="text-xs text-[#0B0E12] font-medium leading-relaxed">
                &ldquo;{selectedDispute.description}&rdquo;
              </p>
              {selectedDispute.evidence_photo_url && (
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-rose-800 block mb-1">Uploaded Evidence Photo:</span>
                  <div className="relative h-32 w-full rounded-xl overflow-hidden border border-rose-200">
                    <Image
                      src={selectedDispute.evidence_photo_url}
                      alt="Evidence"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Linked Booking Info */}
            {relatedBooking && (
              <div className="bg-[#F7F8F5] border border-[#EAECE7] p-4 rounded-2xl space-y-2 text-xs">
                <span className="font-bold text-[#0B0E12] block border-b border-[#EAECE7] pb-1.5">
                  Linked Booking Details
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>Customer: <strong>{relatedBooking.customer_name}</strong> ({relatedBooking.customer_phone})</div>
                  <div>Worker: <strong>{relatedBooking.worker_name}</strong> ({relatedBooking.worker_phone})</div>
                  <div>Category: <strong>{relatedBooking.category}</strong></div>
                  <div>Amount: <strong className="text-emerald-700">Rs. {relatedBooking.booking_amount.toLocaleString()}</strong></div>
                </div>
              </div>
            )}

            {/* Chat History Transcript */}
            <div className="space-y-2">
              <h4 className="font-heading font-bold text-xs text-[#0B0E12] flex items-center gap-1.5">
                <MessageSquare size={14} className="text-[#1FB863]" /> Chat History Transcript ({chatHistory.length} messages)
              </h4>
              <div className="max-h-36 overflow-y-auto p-3 bg-[#F7F8F5] rounded-xl border border-[#EAECE7] space-y-2">
                {chatHistory.length > 0 ? (
                  chatHistory.map((msg) => (
                    <div key={msg.id} className="text-xs">
                      <strong className="text-[#0B0E12]">{msg.sender_name}:</strong>{' '}
                      <span className="text-[#666E7A]">{msg.text}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 italic">Is booking ke chat records khali hain.</p>
                )}
              </div>
            </div>

            {/* Resolution Form */}
            <div className="space-y-3 pt-4 border-t border-[#EAECE7]">
              <label className="block text-xs font-bold text-[#0B0E12]">
                Admin Decision & Case Note
              </label>
              <textarea
                rows={3}
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Faisle ki wazahat likhein (e.g., Customer target refunded 50% due to delayed task...)"
                className="w-full p-3 text-xs rounded-xl border border-[#EAECE7] font-medium bg-[#F7F8F5] focus:outline-none focus:border-[#0B0E12]"
              />

              <div className="grid grid-cols-3 gap-2 pt-1">
                <button
                  onClick={() => handleResolve('resolved_refunded')}
                  className="py-3 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                >
                  Resolve — Refunded
                </button>
                <button
                  onClick={() => handleResolve('resolved_worker_warned')}
                  className="py-3 px-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                >
                  Resolve — Warned
                </button>
                <button
                  onClick={() => handleResolve('resolved_no_action')}
                  className="py-3 px-2 bg-gray-800 hover:bg-black text-white rounded-xl text-xs font-bold transition shadow-xs"
                >
                  Resolve — Close Case
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
