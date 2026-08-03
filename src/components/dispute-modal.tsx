'use client';

import React, { useState } from 'react';
import { Booking } from '@/lib/types';
import { createDisputeReport, getCurrentUser } from '@/lib/store';
import { AlertOctagon, X, Upload, CheckCircle2, ShieldAlert } from 'lucide-react';

interface DisputeModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
}

export function DisputeModal({ booking, isOpen, onClose, onSubmitted }: DisputeModalProps) {
  const currentUser = getCurrentUser();

  const [category, setCategory] = useState<'Work not completed' | 'Price disagreement' | 'Behavior issue' | 'Other'>('Work not completed');
  const [description, setDescription] = useState('');
  const [evidencePhotoUrl, setEvidencePhotoUrl] = useState('');
  const [isPhotoAttached, setIsPhotoAttached] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !booking || !currentUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      createDisputeReport({
        booking_id: booking.id,
        complainant_id: currentUser.id,
        complainant_role: currentUser.role === 'worker' ? 'worker' : 'customer',
        target_worker_id: booking.worker_id,
        issue_category: category,
        description,
        evidence_photo_url: isPhotoAttached
          ? evidencePhotoUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400'
          : undefined,
      });

      setIsSubmitting(false);
      setIsSubmitted(true);
      if (onSubmitted) onSubmitted();
    }, 500);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-[26px] border border-[#EAECE7] max-w-lg w-full p-6 shadow-2xl relative space-y-5 animate-slide-up">
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition"
        >
          <X size={18} />
        </button>

        {isSubmitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100 shadow-sm">
              <CheckCircle2 size={32} />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading font-extrabold text-lg text-[#0B0E12]">
                Issue Reported Successfully!
              </h3>
              <p className="text-xs text-[#666E7A] font-medium max-w-xs mx-auto">
                Aapki shikayat admin panel ko bhej di gayi hai. Hum 24 ghante ke andar mutasira tareekay se case ko review karein ge.
              </p>
            </div>
            <button
              onClick={handleClose}
              className="btn btn-lime w-full py-3 text-xs font-bold"
            >
              Theek Hai (Close)
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-1 pr-6 border-b border-[#EAECE7] pb-4">
              <div className="flex items-center gap-2 text-rose-600 font-extrabold text-xs uppercase tracking-wider">
                <AlertOctagon size={16} />
                <span>Report an Issue (Dispute Form)</span>
              </div>
              <h2 className="font-heading font-extrabold text-xl text-[#0B0E12]">
                Booking #{booking.id}
              </h2>
              <p className="text-xs text-[#666E7A] font-medium">
                Kaarigar: <strong className="text-[#0B0E12]">{booking.worker_name}</strong> • Category: {booking.category}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0B0E12] mb-1.5">
                  Issue Category (Shikayat ki Wajah) *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-3 text-xs rounded-xl border border-[#EAECE7] focus:outline-none focus:border-[#0B0E12] font-semibold text-[#0B0E12] bg-[#F7F8F5]"
                >
                  <option value="Work not completed">Work not completed (Kaam adhoora chhora)</option>
                  <option value="Price disagreement">Price disagreement (Paise zyada mange)</option>
                  <option value="Behavior issue">Behavior issue (Badtameezi / Bad behavior)</option>
                  <option value="Other">Other (Koi aur masla)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B0E12] mb-1.5">
                  Detailed Description (Pura Masla Bayan Karein) *
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Bayan karein k kya masla pesh aaya..."
                  className="w-full p-3 text-xs rounded-xl border border-[#EAECE7] focus:outline-none focus:border-[#0B0E12] font-medium text-[#0B0E12] bg-[#F7F8F5]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B0E12] mb-1.5">
                  Optional Photo Evidence (Tasveer Attach Karein)
                </label>
                <div className="p-3 border-2 border-dashed border-[#EAECE7] bg-[#F7F8F5] rounded-xl text-center hover:border-[#0B0E12] transition cursor-pointer">
                  <Upload size={18} className="text-[#666E7A] mx-auto mb-1" />
                  <span className="text-xs font-bold text-[#0B0E12] block">
                    Upload Damage or Work Photo
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={() => {
                      setIsPhotoAttached(true);
                      setEvidencePhotoUrl('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400');
                    }}
                    className="hidden"
                    id="dispute-photo-input"
                  />
                  <label htmlFor="dispute-photo-input" className="block text-[11px] text-[#1FB863] font-bold mt-1 cursor-pointer">
                    {isPhotoAttached ? '✓ Photo Attached' : 'Select Photo'}
                  </label>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-start gap-2 text-[11px] text-amber-800 font-medium">
                <ShieldAlert size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Admin team is dispute, chat logs aur calling records review kar ke refund ya warning ka faisla karegi.
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !description.trim()}
                className="btn btn-lime w-full py-3.5 text-xs font-extrabold"
              >
                {isSubmitting ? 'Submitting Report...' : 'Submit Dispute Report'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
