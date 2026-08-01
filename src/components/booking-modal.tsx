'use client';

import { useState } from 'react';
import { Worker, TimePreference } from '@/lib/types';
import { createBooking, getCurrentUser } from '@/lib/store';
import { X, Calendar, Clock, MapPin, CheckCircle2, Phone, User, FileText, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface BookingModalProps {
  worker: Worker | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess?: () => void;
}

export function BookingModal({ worker, isOpen, onClose, onBookingSuccess }: BookingModalProps) {
  const currentUser = getCurrentUser();

  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState('');
  const [dateNeeded, setDateNeeded] = useState(() =>
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [timePref, setTimePref] = useState<TimePreference>('Morning (9am - 12pm)');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [createdBookingId, setCreatedBookingId] = useState('');

  if (!isOpen || !worker) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !address || !description) return;

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
        booking_amount: worker.rate_amount,
      });

      setCreatedBookingId(newBooking.id);
      setIsSubmitting(false);
      setIsConfirmed(true);
      if (onBookingSuccess) onBookingSuccess();
    }, 600);
  };

  const handleReset = () => {
    setIsConfirmed(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleReset}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition"
        >
          <X size={20} />
        </button>

        {!isConfirmed ? (
          <div>
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-200 shrink-0">
                <Image
                  src={worker.profile_photo_url}
                  alt={worker.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="text-xs text-[#1E5AA8] font-bold uppercase tracking-wider block">
                  Booking Request
                </span>
                <h3 className="text-base font-bold text-[#1A1A1A]">
                  {worker.name} — <span className="text-gray-600 font-normal">{worker.category}</span>
                </h3>
                <p className="text-xs text-gray-500">
                  Rate: Rs. {worker.rate_amount.toLocaleString()} / {worker.rate_type === 'hourly' ? 'hr' : 'job'}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                  Aapka Poora Naam (Full Name) *
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Tariq Mehmood"
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#1E5AA8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                  Phone Number (Rabta Number) *
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 0300 1234567"
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#1E5AA8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                  Pata & Area (Address / Neighborhood) *
                </label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. House 42, Street 5, Gulshan-e-Iqbal Block 4"
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#1E5AA8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                    Date Needed (Kis Din?) *
                  </label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="date"
                      required
                      value={dateNeeded}
                      onChange={(e) => setDateNeeded(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#1E5AA8]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                    Time Preference *
                  </label>
                  <div className="relative">
                    <Clock size={16} className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
                    <select
                      value={timePref}
                      onChange={(e) => setTimePref(e.target.value as TimePreference)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#1E5AA8] bg-white"
                    >
                      <option value="Morning (9am - 12pm)">Morning (9am - 12pm)</option>
                      <option value="Afternoon (12pm - 4pm)">Afternoon (12pm - 4pm)</option>
                      <option value="Evening (4pm - 8pm)">Evening (4pm - 8pm)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                  Kaam Ki Tafseel (Description of Work Needed) *
                </label>
                <div className="relative">
                  <FileText size={16} className="absolute left-3 top-3 text-gray-400" />
                  <textarea
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Wazahat karein kya kaam karwana hai (e.g., UPS ki wiring set karni hai aur 2 fan dimmers change karne hain)"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#1E5AA8]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-[#F5820D] hover:bg-[#D97109] disabled:opacity-50 text-white font-bold text-sm transition shadow-md flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Bhej rahe hain...' : 'Booking Request Bhejein'}
              </button>
            </form>
          </div>
        ) : (
          /* Confirmation Screen */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-xl font-bold text-[#1A1A1A]">
              Booking Request Bhej Di Gayi Hai!
            </h3>
            <p className="text-sm text-[#4A4A4A] leading-relaxed max-w-sm mx-auto">
              Aapki request <span className="font-bold text-[#1E5AA8]">{worker.name}</span> ko bhej di gayi hai. Wo jald hi aap se contact karenge.
            </p>
            <div className="p-3 bg-gray-50 rounded-xl text-xs text-left border border-gray-200 space-y-1">
              <div><span className="text-gray-400">Worker:</span> <span className="font-semibold">{worker.name} ({worker.phone})</span></div>
              <div><span className="text-gray-400">Date & Time:</span> <span className="font-semibold">{dateNeeded} — {timePref}</span></div>
              <div><span className="text-gray-400">Estimated Rate:</span> <span className="font-semibold text-emerald-700">Rs. {worker.rate_amount.toLocaleString()}</span></div>
            </div>
            <div className="pt-2 flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold text-xs hover:bg-gray-50 transition"
              >
                Close Window
              </button>
              <Link
                href="/dashboard"
                onClick={handleReset}
                className="flex-1 py-2.5 rounded-xl bg-[#1E5AA8] text-white font-semibold text-xs hover:bg-[#174786] transition flex items-center justify-center gap-1"
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
