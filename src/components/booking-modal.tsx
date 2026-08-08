'use client';

import { useState } from 'react';
import { Worker, TimePreference } from '@/lib/types';
import { createBooking, getCurrentUser, checkCustomerBookingRateLimit } from '@/lib/store';
import { X, Calendar, Clock, MapPin, CheckCircle2, Phone, User, FileText, ArrowRight, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface BookingModalProps {
  worker: Worker | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess?: () => void;
  onBookingCreated?: () => void;
}

export function BookingModal({ worker, isOpen, onClose, onBookingSuccess, onBookingCreated }: BookingModalProps) {
  const currentUser = getCurrentUser();

  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState('');
  const [dateNeeded, setDateNeeded] = useState(() =>
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [timePref, setTimePref] = useState<TimePreference>('Morning (9am - 12pm)');
  const [description, setDescription] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [createdBookingId, setCreatedBookingId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen || !worker) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!fullName || !phone || !address || !description) return;

    const customerId = currentUser?.id || 'guest';
    const rateCheck = checkCustomerBookingRateLimit(customerId);

    if (!rateCheck.allowed) {
      setErrorMessage('Aap aaj 5 bookings ki rozana limit poori kar chuke hain. Spam se bachao k liye rozana max 5 bookings ki ijazat hai.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newBooking = createBooking({
        customer_id: currentUser?.id || `u-c-${Date.now()}`,
        customer_name: fullName,
        customer_phone: phone,
        worker_id: worker.id,
        worker_name: worker.name,
        worker_photo: worker.profile_photo_url,
        worker_phone: worker.phone,
        category: worker.category,
        date_needed: dateNeeded,
        time_preference: timePref,
        address: `${address}, ${worker.city}`,
        description,
        is_urgent: isUrgent,
        photo_attachment_url: photoUrl || undefined,
        booking_amount: worker.rate_amount,
      });

      setCreatedBookingId(newBooking.id);
      setIsSubmitting(false);
      setIsConfirmed(true);
      if (onBookingSuccess) onBookingSuccess();
      if (onBookingCreated) onBookingCreated();
    }, 600);
  };

  const handleReset = () => {
    setIsConfirmed(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-[26px] max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#EAECE7] relative max-h-[90vh] overflow-y-auto text-[#0B0E12] font-body">
        <button
          onClick={handleReset}
          className="absolute top-4 right-4 text-[#666E7A] hover:text-[#0B0E12] p-2 rounded-full hover:bg-[#F7F8F5] transition"
        >
          <X size={20} />
        </button>

        {!isConfirmed ? (
          <div>
            <div className="flex items-center gap-3 pb-4 mb-5 border-b border-[#EAECE7]">
              <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-[#EAECE7] shrink-0">
                <Image
                  src={worker.profile_photo_url}
                  alt={worker.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="text-xs text-[#1FB863] font-bold uppercase tracking-wider block">
                  Booking Request
                </span>
                <h3 className="text-base font-extrabold font-heading text-[#0B0E12]">
                  {worker.name} — <span className="text-[#666E7A] font-normal">{worker.category}</span>
                </h3>
                <p className="text-xs text-[#666E7A] font-medium">
                  Rate: Rs. {worker.rate_amount.toLocaleString()} / {worker.rate_type === 'hourly' ? 'hr' : 'job'}
                </p>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 mb-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs font-semibold">
                <AlertTriangle size={16} className="shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0B0E12] font-heading mb-1.5">
                  Aapka Poora Naam (Full Name) *
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-3.5 text-[#666E7A]" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Tariq Mehmood"
                    className="w-full pl-10 pr-3 py-3 text-xs rounded-xl border border-[#EAECE7] focus:outline-none focus:border-[#0B0E12] text-[#0B0E12] bg-[#F7F8F5] font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B0E12] font-heading mb-1.5">
                  Phone Number (Account Recovery Only) *
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-3.5 text-[#666E7A]" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 0300 1234567"
                    className="w-full pl-10 pr-3 py-3 text-xs rounded-xl border border-[#EAECE7] focus:outline-none focus:border-[#0B0E12] text-[#0B0E12] bg-[#F7F8F5] font-medium"
                  />
                </div>
                <p className="text-[10px] text-[#1FB863] font-bold mt-1">
                  🔒 Kept strictly private for account recovery. Calls connect via WebRTC in-app calling without phone numbers.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B0E12] font-heading mb-1.5">
                  Pata & Area (Address / Neighborhood) *
                </label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3.5 top-3.5 text-[#666E7A]" />
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. House 42, Street 5, Gulshan-e-Iqbal Block 4"
                    className="w-full pl-10 pr-3 py-3 text-xs rounded-xl border border-[#EAECE7] focus:outline-none focus:border-[#0B0E12] text-[#0B0E12] bg-[#F7F8F5] font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0B0E12] font-heading mb-1.5">
                    Date Needed (Kis Din?) *
                  </label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3.5 top-3.5 text-[#666E7A]" />
                    <input
                      type="date"
                      required
                      value={dateNeeded}
                      onChange={(e) => setDateNeeded(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl border border-[#EAECE7] focus:outline-none focus:border-[#0B0E12] text-[#0B0E12] bg-[#F7F8F5] font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B0E12] font-heading mb-1.5">
                    Time Preference *
                  </label>
                  <div className="relative">
                    <Clock size={16} className="absolute left-3.5 top-3.5 text-[#666E7A] pointer-events-none" />
                    <select
                      value={timePref}
                      onChange={(e) => setTimePref(e.target.value as TimePreference)}
                      className="w-full pl-10 pr-3 py-3 text-xs rounded-xl border border-[#EAECE7] focus:outline-none focus:border-[#0B0E12] bg-[#F7F8F5] text-[#0B0E12] font-medium"
                    >
                      <option value="Morning (9am - 12pm)">Morning (9am - 12pm)</option>
                      <option value="Afternoon (12pm - 4pm)">Afternoon (12pm - 4pm)</option>
                      <option value="Evening (4pm - 8pm)">Evening (4pm - 8pm)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B0E12] font-heading mb-1.5">
                  Kaam Ki Tafseel (Description of Work Needed) *
                </label>
                <div className="relative">
                  <FileText size={16} className="absolute left-3.5 top-3.5 text-[#666E7A]" />
                  <textarea
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Wazahat karein kya kaam karwana hai (e.g., UPS ki wiring set karni hai aur 2 fan dimmers change karne hain)"
                    className="w-full pl-10 pr-3 py-3 text-xs rounded-xl border border-[#EAECE7] focus:outline-none focus:border-[#0B0E12] text-[#0B0E12] bg-[#F7F8F5] font-medium"
                  />
                </div>
              </div>

              {/* Urgent Flag & Photo Attachment */}
              <div className="p-3 bg-[#F7F8F5] rounded-xl border border-[#EAECE7] space-y-2.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isUrgent}
                    onChange={(e) => setIsUrgent(e.target.checked)}
                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                  />
                  <span className="text-xs font-bold text-[#0B0E12] flex items-center gap-1">
                    🚨 Emergency Service Needed (Urgent request within 1-2 hours)
                  </span>
                </label>

                <div>
                  <label className="block text-[11px] font-bold text-[#666E7A] mb-1">
                    Attach Problem Photo URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500"
                    className="w-full p-2 text-[11px] rounded-lg border border-[#EAECE7] text-[#0B0E12] bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-lime w-full py-4 text-xs font-extrabold mt-2"
              >
                {isSubmitting ? 'Bhej rahe hain...' : 'Booking Request Bhejein'}
              </button>
            </form>
          </div>
        ) : (
          /* Confirmation Screen */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#0B0E12] text-[#39E07A] mx-auto flex items-center justify-center -rotate-6">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-xl font-heading font-extrabold text-[#0B0E12]">
              Booking Request Bhej Di Gayi Hai!
            </h3>
            <p className="text-xs text-[#666E7A] font-medium leading-relaxed max-w-sm mx-auto">
              Aapki request <span className="font-bold text-[#0B0E12]">{worker.name}</span> ko bhej di gayi hai. Wo jald hi aap se contact karenge.
            </p>
            <div className="p-4 bg-[#F7F8F5] rounded-2xl text-xs text-left border border-[#EAECE7] space-y-1.5 font-medium">
              <div><span className="text-[#666E7A]">Worker:</span> <span className="font-bold text-[#0B0E12]">{worker.name} ({worker.phone})</span></div>
              <div><span className="text-[#666E7A]">Date & Time:</span> <span className="font-bold text-[#0B0E12]">{dateNeeded} — {timePref}</span></div>
              <div><span className="text-[#666E7A]">Estimated Rate:</span> <span className="font-bold text-[#1FB863]">Rs. {worker.rate_amount.toLocaleString()}</span></div>
            </div>
            <div className="pt-2 flex gap-3">
              <button
                onClick={handleReset}
                className="btn btn-secondary flex-1 py-3 text-xs font-bold"
              >
                Close Window
              </button>
              <Link
                href="/dashboard"
                onClick={handleReset}
                className="btn btn-primary flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1"
              >
                View Dashboard <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
