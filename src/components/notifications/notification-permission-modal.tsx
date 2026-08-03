'use client';

import { useState, useEffect } from 'react';
import { getCurrentUser } from '@/lib/store';
import { requestFcmToken } from '@/lib/fcm';
import { BellRing, ShieldCheck, X } from 'lucide-react';

export function NotificationPermissionModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [user] = useState(() => getCurrentUser());

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Only prompt if Notification API exists, permission is 'default', and user hasn't dismissed recently
    if ('Notification' in window && Notification.permission === 'default') {
      const dismissed = localStorage.getItem('nayakaam_notif_prompt_dismissed');
      if (!dismissed) {
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  if (!isOpen) return null;

  const handleEnable = async () => {
    setIsOpen(false);
    if (user?.id) {
      await requestFcmToken(user.id);
    } else {
      await Notification.requestPermission();
    }
  };

  const handleDismiss = () => {
    setIsOpen(false);
    try {
      localStorage.setItem('nayakaam_notif_prompt_dismissed', Date.now().toString());
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in font-body text-[#0B0E12]">
      <div className="bg-white rounded-[26px] max-w-sm w-full p-6 shadow-2xl border border-[#EAECE7] relative text-center">
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-[#E8F1FB] text-[#1E5AA8] flex items-center justify-center mx-auto mb-4 border border-[#D0E2F7] shadow-sm animate-pulse">
          <BellRing size={28} />
        </div>

        <h3 className="font-heading font-extrabold text-base text-[#1A1A1A] mb-1">
          Stay Updated / Updates Hasil Karein
        </h3>

        <p className="text-xs text-[#4B5563] font-medium leading-relaxed mb-4">
          Naya Kaam aapko <strong className="text-[#1A1A1A]">booking updates, chat messages aur direct in-app calls</strong> ki instant notifications bhejna chahta hai.
        </p>

        <div className="bg-[#F7F8FA] p-3 rounded-xl border border-gray-100 text-[11px] text-[#6B7280] font-medium flex items-center justify-center gap-2 mb-5">
          <ShieldCheck size={16} className="text-[#1FB863] shrink-0" />
          <span>Koi spam nahi — sirf aap ki active bookings updates.</span>
        </div>

        <div className="space-y-2">
          <button
            onClick={handleEnable}
            className="w-full py-3 rounded-xl bg-[#1E5AA8] hover:bg-[#154277] active:scale-95 text-white font-bold text-xs transition shadow-md flex items-center justify-center gap-2"
          >
            <BellRing size={16} />
            <span>Notifications Enable Karein</span>
          </button>

          <button
            onClick={handleDismiss}
            className="w-full py-2.5 rounded-xl bg-transparent hover:bg-gray-100 text-gray-500 font-semibold text-xs transition"
          >
            Abhi Nahi (Not Now)
          </button>
        </div>
      </div>
    </div>
  );
}
