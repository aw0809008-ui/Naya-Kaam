'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { BookingModal } from '@/components/booking-modal';
import { getWorkerById, initializeStore } from '@/lib/store';
import { Worker } from '@/lib/types';

interface BookClientProps {
  workerId: string;
}

export function BookClient({ workerId }: BookClientProps) {
  const router = useRouter();
  const [worker, setWorker] = useState<Worker | null>(null);

  useEffect(() => {
    initializeStore();
    const w = getWorkerById(workerId);
    if (w) setWorker(w);
  }, [workerId]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        {worker ? (
          <BookingModal
            worker={worker}
            isOpen={true}
            onClose={() => router.push(`/worker/${worker.id}`)}
          />
        ) : (
          <div className="text-center py-10">
            <p className="text-sm text-gray-500 mb-4">Worker not found for booking.</p>
            <button
              onClick={() => router.push('/search')}
              className="px-4 py-2 bg-[#1E5AA8] text-white rounded-xl text-xs font-bold"
            >
              Back to Search
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
