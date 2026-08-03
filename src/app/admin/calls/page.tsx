'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { getCalls, initializeStore, getCurrentUser } from '@/lib/store';
import { CallRecord, CallStatus } from '@/lib/types';
import {
  PhoneCall,
  PhoneMissed,
  PhoneOff,
  ShieldCheck,
  Calendar,
  Clock,
  ArrowLeft,
  Users,
  Search,
  Filter,
  Lock,
  Key,
  AlertTriangle,
} from 'lucide-react';

export default function AdminCallsPage() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const user = getCurrentUser();
      if (user?.role === 'admin') return true;
      return localStorage.getItem('nayakaam_admin_session') === 'true';
    }
    return false;
  });
  const [passkeyInput, setPasskeyInput] = useState('');
  const [passkeyError, setPasskeyError] = useState('');

  const [calls, setCalls] = useState<CallRecord[]>(() => {
    initializeStore();
    return getCalls();
  });
  const [statusFilter, setStatusFilter] = useState<'all' | 'connected' | 'missed' | 'declined'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passkeyInput === '7860' || passkeyInput === 'admin123') {
      if (typeof window !== 'undefined') {
        localStorage.setItem('nayakaam_admin_session', 'true');
      }
      setIsAdminAuthenticated(true);
      setPasskeyError('');
    } else {
      setPasskeyError('Ghalat Passkey! Please enter correct passkey.');
    }
  };

  const refreshCalls = useCallback(() => {
    setCalls(getCalls());
  }, []);

  const formatDuration = (secs: number) => {
    if (!secs || secs === 0) return '0s';
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}m ${remainingSecs}s`;
  };

  const filteredCalls = calls.filter((c) => {
    if (statusFilter === 'connected' && c.status !== 'ended' && c.status !== 'connected') return false;
    if (statusFilter === 'missed' && c.status !== 'missed') return false;
    if (statusFilter === 'declined' && c.status !== 'declined') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.caller_name.toLowerCase().includes(q) ||
        c.callee_name.toLowerCase().includes(q) ||
        c.booking_id.toLowerCase().includes(q) ||
        (c.category && c.category.toLowerCase().includes(q))
      );
    }

    return true;
  });

  const totalCalls = calls.length;
  const connectedCalls = calls.filter((c) => c.status === 'ended' || c.status === 'connected').length;
  const missedCalls = calls.filter((c) => c.status === 'missed').length;
  const totalSeconds = calls.reduce((sum, c) => sum + (c.duration_seconds || 0), 0);
  const totalMinutes = Math.round(totalSeconds / 60);

  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F7F8FA] font-body">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4 my-12">
          <div className="bg-white rounded-2xl p-8 border border-[#E5E7EB] shadow-xl max-w-md w-full">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-amber-200">
                <Lock size={28} />
              </div>
              <h2 className="text-xl font-heading font-bold text-[#1A1A1A]">Call Logs Restricted</h2>
              <p className="text-xs text-[#6B7280] mt-1">
                Please enter the Naya Kaam Administrator passkey to inspect WebRTC in-app voice call logs.
              </p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
                  Admin Access Passkey
                </label>
                <div className="relative">
                  <Key size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                  <input
                    type="password"
                    value={passkeyInput}
                    onChange={(e) => setPasskeyInput(e.target.value)}
                    placeholder="Enter passkey (Default: 7860)"
                    className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#F5820D] bg-gray-50 font-medium"
                    required
                  />
                </div>
                {passkeyError && (
                  <p className="text-xs text-red-600 mt-2 font-medium flex items-center gap-1">
                    <AlertTriangle size={13} /> {passkeyError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#0B0E12] hover:bg-gray-800 text-white text-xs font-bold rounded-xl transition shadow-md"
              >
                Unlock Voice Call Audit Logs
              </button>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FA] font-body">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-r from-[#0B0E12] via-[#141A22] to-[#1E5AA8] text-white py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1 text-xs text-gray-300 hover:text-white bg-white/10 px-3 py-1 rounded-full border border-white/20 transition"
              >
                <ArrowLeft size={14} /> Back to Admin Control Center
              </Link>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#1FB863]/20 text-[#39E07A] text-xs font-bold border border-[#1FB863]/30">
                <ShieldCheck size={14} /> Privacy Protected WebRTC Logs
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight flex items-center gap-3">
              In-App Voice Call Audit Ledger
            </h1>
            <p className="text-xs text-gray-300 mt-1">
              Zero phone numbers shared. Peer-to-peer audio call history logs between customers and workers.
            </p>
          </div>

          <button
            onClick={refreshCalls}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition border border-white/20"
          >
            Refresh Calls
          </button>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 space-y-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-1">
            <span className="text-xs font-bold font-heading uppercase text-gray-500 block">Total Calls</span>
            <span className="text-2xl font-heading font-extrabold text-[#0B0E12] block">{totalCalls}</span>
            <span className="text-[11px] text-gray-500">Initiated via app</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-1">
            <span className="text-xs font-bold font-heading uppercase text-emerald-700 block">Connected</span>
            <span className="text-2xl font-heading font-extrabold text-emerald-700 block">{connectedCalls}</span>
            <span className="text-[11px] text-gray-500">Audio established</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-1">
            <span className="text-xs font-bold font-heading uppercase text-amber-700 block">Missed</span>
            <span className="text-2xl font-heading font-extrabold text-amber-700 block">{missedCalls}</span>
            <span className="text-[11px] text-gray-500">Unanswered calls</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-1">
            <span className="text-xs font-bold font-heading uppercase text-[#1E5AA8] block">Call Minutes</span>
            <span className="text-2xl font-heading font-extrabold text-[#1E5AA8] block">{totalMinutes} mins</span>
            <span className="text-[11px] text-gray-500">Total duration</span>
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                statusFilter === 'all'
                  ? 'bg-[#0B0E12] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Calls ({calls.length})
            </button>
            <button
              onClick={() => setStatusFilter('connected')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                statusFilter === 'connected'
                  ? 'bg-[#1FB863] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Connected ({connectedCalls})
            </button>
            <button
              onClick={() => setStatusFilter('missed')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                statusFilter === 'missed'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Missed ({missedCalls})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or booking..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#0B0E12]"
            />
          </div>
        </div>

        {/* Calls Table */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#E5E7EB] font-heading font-bold text-sm text-[#0B0E12] flex items-center justify-between">
            <span>Call Records Ledger</span>
            <span className="text-xs text-gray-500 font-normal font-body">
              Showing {filteredCalls.length} logs
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-body">
              <thead className="bg-[#F7F8FA] text-gray-500 uppercase tracking-wider font-semibold font-heading">
                <tr>
                  <th className="p-4">Call ID</th>
                  <th className="p-4">Caller (Initiator)</th>
                  <th className="p-4">Callee (Receiver)</th>
                  <th className="p-4">Booking ID & Category</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {filteredCalls.map((call) => {
                  const isConnected = call.status === 'ended' || call.status === 'connected';
                  const isMissed = call.status === 'missed';

                  return (
                    <tr key={call.id} className="hover:bg-gray-50/60">
                      <td className="p-4 font-mono font-semibold text-gray-500">{call.id}</td>

                      {/* Caller */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200 bg-gray-100 shrink-0">
                            <Image
                              src={call.caller_photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200'}
                              alt={call.caller_name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <span className="font-bold text-[#0B0E12] block">{call.caller_name}</span>
                            <span className="text-[10px] text-gray-500 capitalize">{call.caller_role}</span>
                          </div>
                        </div>
                      </td>

                      {/* Callee */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200 bg-gray-100 shrink-0">
                            <Image
                              src={call.callee_photo || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=200'}
                              alt={call.callee_name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <span className="font-bold text-[#0B0E12] block">{call.callee_name}</span>
                            <span className="text-[10px] text-gray-500 capitalize">{call.callee_role}</span>
                          </div>
                        </div>
                      </td>

                      {/* Booking ID & Category */}
                      <td className="p-4">
                        <span className="font-bold text-[#1E5AA8] block">{call.booking_id}</span>
                        <span className="text-[10px] text-gray-500 font-semibold">{call.category || 'General Service'}</span>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit capitalize ${
                            isConnected
                              ? 'bg-[#D6F5E3] text-[#1FB863] border border-[#1FB863]/20'
                              : isMissed
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-red-100 text-red-800 border border-red-200'
                          }`}
                        >
                          {isConnected ? (
                            <PhoneCall size={12} />
                          ) : isMissed ? (
                            <PhoneMissed size={12} />
                          ) : (
                            <PhoneOff size={12} />
                          )}
                          {isConnected ? 'Connected' : call.status}
                        </span>
                      </td>

                      {/* Duration */}
                      <td className="p-4 font-mono font-bold text-[#0B0E12]">
                        {formatDuration(call.duration_seconds)}
                      </td>

                      {/* Timestamp */}
                      <td className="p-4 text-gray-500 text-[11px]">
                        {new Date(call.created_at).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}

                {filteredCalls.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-gray-400 font-medium">
                      No call records match your filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
