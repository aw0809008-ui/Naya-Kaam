'use client';

import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8F5] text-[#0B0E12] font-body">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 w-full flex-1">
        <div className="bg-white rounded-[26px] p-6 sm:p-10 border border-[#EAECE7] shadow-xl space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Link href="/" className="text-xs font-bold text-[#666E7A] hover:text-[#0B0E12] flex items-center gap-1 transition">
              <ArrowLeft size={14} /> Wapas (Back)
            </Link>
          </div>

          <div className="border-b border-[#EAECE7] pb-6 space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#0B0E12] text-[#39E07A] flex items-center justify-center -rotate-6 shadow-sm">
              <ShieldCheck size={24} />
            </div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#0B0E12]">
              Privacy Policy (Raazdaari ki Policy)
            </h1>
            <p className="text-xs text-[#666E7A] font-medium">
              Your data security and trust are our top priority across Pakistan
            </p>
          </div>

          <div className="space-y-6 text-xs text-[#4B5563] leading-relaxed">
            <section className="space-y-2">
              <h2 className="font-heading font-extrabold text-sm text-[#0B0E12]">1. Information We Collect</h2>
              <p>
                We collect essential details needed to facilitate skilled worker bookings: name, phone number, city, area location, CNIC details (for worker verification only), and booking logs.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-heading font-extrabold text-sm text-[#0B0E12]">2. How We Protect Your CNIC & Location</h2>
              <p>
                CNIC images submitted by workers are encrypted and accessed exclusively by authorized verification managers. Exact customer address is shared with assigned workers only after booking acceptance.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-heading font-extrabold text-sm text-[#0B0E12]">3. Push Notifications & Voice Calls</h2>
              <p>
                We request browser notification permissions solely to deliver instant booking alerts, chat messages, and web voice calls. We never send advertising spam.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-heading font-extrabold text-sm text-[#0B0E12]">4. Data Sharing & Third Parties</h2>
              <p>
                Naya Kaam does NOT sell personal user data to third-party advertisers. Information is shared only as required by law or to complete requested services.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
