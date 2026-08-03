'use client';

import { useState } from 'react';
import { Booking } from '@/lib/types';
import { createDisputeReport, getCurrentUser } from '@/lib/store';
import { X, AlertTriangle, Send, ShieldAlert } from 'lucide-react';

interface DisputeModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onReportSubmitted?: () => void;
}

export function DisputeModal({ booking, isOpen, onClose, onReportSubmitted }: DisputeModalProps) {
  const [issueCategory, setIssueCategory] = useState<'overcharging' | 'poor_quality' | 'no_show' | 'unprofessional' | 'other'>('overcharging');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !booking) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    setIsSubmitting(true);
    const currentUser = getCurrentUser();

    setTimeout(() => {
      createDisputeReport({
        booking_id: booking.id,
        reporter_id: currentUser?.id || booking.customer_id,
        reporter_name: currentUser?.name || booking.customer_name,
        reporter_role: (currentUser?.role as 'customer' | 'worker') || 'customer',
        reported_user_id: currentUser?.role === 'worker' ? booking.customer_id : booking.worker_id,
        reported_user_name: currentUser?.role === 'worker' ? booking.customer_name : booking.worker_name,
        issue_category: issueCategory,
        reason,
      });

      setIsSubmitting(false);
      if (onReportSubmitted) onReportSubmitted();
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in font-body text-[#0B0E12]">
      <div className="bg-white rounded-[26px] max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#EAECE7] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#666E7A] hover:text-[#0B0E12] p-2 rounded-full hover:bg-[#F7F8F5] transition"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2.5 text-[#0B0E12] mb-1">
          <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
            <AlertTriangle size={18} />
          </div>
          <h3 className="font-heading font-extrabold text-lg text-[#0B0E12]">
            Report Issue / Dispute
          </h3>
        </div>

        <p className="text-xs text-[#666E7A] font-medium mb-4">
          File a official report regarding booking <span className="font-bold text-[#0B0E12]">{booking.id}</span> with <span className="font-bold text-[#0B0E12]">{booking.worker_name}</span>. Admin team will investigate.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#0B0E12] mb-1">
              Issue Category
            </label>
            <select
              value={issueCategory}
              onChange={(e) => setIssueCategory(e.target.value as any)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#EAECE7] bg-[#F7F8F5] font-semibold text-[#0B0E12] focus:outline-none focus:border-red-500"
            >
              <option value="overcharging">Overcharging / Extra Demands</option>
              <option value="poor_quality">Substandard Work Quality</option>
              <option value="no_show">Worker / Customer No-Show</option>
              <option value="unprofessional">Unprofessional Behavior</option>
              <option value="other">Other Issue</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0B0E12] mb-1">
              Describe Details (Tafseel Likhein) *
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide specific facts about what went wrong..."
              rows={3}
              required
              className="w-full p-3 text-xs rounded-xl border border-[#EAECE7] focus:outline-none focus:border-red-500 bg-[#F7F8F5] font-medium text-[#0B0E12]"
            />
          </div>

          <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-[11px] text-amber-800 font-medium flex items-start gap-2">
            <ShieldAlert size={16} className="shrink-0 mt-0.5 text-amber-600" />
            <span>Naya Kaam admin team reviews all reported disputes within 24 hours to enforce quality & fair pricing.</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !reason.trim()}
            className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
          >
            <Send size={15} />
            <span>{isSubmitting ? 'Submitting Report...' : 'Submit Report to Admin'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
