'use client';

import { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(() => (typeof window !== 'undefined' ? !navigator.onLine : false));
  const [showBackOnline, setShowBackOnline] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOffline = () => {
      setIsOffline(true);
      setShowBackOnline(false);
    };

    const handleOnline = () => {
      setIsOffline(false);
      setShowBackOnline(true);
      const timer = setTimeout(() => setShowBackOnline(false), 3500);
      return () => clearTimeout(timer);
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (isOffline) {
    return (
      <div className="bg-amber-600 text-white px-4 py-2 text-xs font-bold font-body text-center flex items-center justify-center gap-2 shadow-sm z-50 sticky top-0 animate-fade-in">
        <WifiOff size={15} className="animate-pulse shrink-0" />
        <span>Internet connection check karein (Offline Mode — Cached data visible)</span>
      </div>
    );
  }

  if (showBackOnline) {
    return (
      <div className="bg-[#1FB863] text-white px-4 py-2 text-xs font-bold font-body text-center flex items-center justify-center gap-2 shadow-sm z-50 sticky top-0 animate-fade-in">
        <Wifi size={15} className="shrink-0" />
        <span>Internet connected! Data synchronized.</span>
      </div>
    );
  }

  return null;
}
