'use client';

import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { ShieldCheck, FileText, ArrowLeft } from 'lucide-react';

export default function TermsPage() {
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
              <FileText size={24} />
            </div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#0B0E12]">
              Terms of Service & Conditions (Sharaait-o-Zawabit)
            </h1>
            <p className="text-xs text-[#666E7A] font-medium">
              Last Updated: August 2026 • Applicable across all Pakistani cities
            </p>
          </div>

          <div className="space-y-6 text-xs text-[#4B5563] leading-relaxed">
            <section className="space-y-2">
              <h2 className="font-heading font-extrabold text-sm text-[#0B0E12]">1. Acceptance of Terms</h2>
              <p>
                By accessing or registering on Naya Kaam, customers and skilled workers (kaarigar) agree to follow all platform guidelines and fair practice rules.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-heading font-extrabold text-sm text-[#0B0E12]">2. Verified Workers & Safety</h2>
              <p>
                All registered workers must submit authentic NADRA CNIC details for verification. Fake identities or misrepresentation will lead to immediate account termination and regulatory escalation.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-heading font-extrabold text-sm text-[#0B0E12]">3. Platform Commission (15%)</h2>
              <p>
                Naya Kaam charges a transparent 15% platform commission on completed bookings to maintain infrastructure, verified support, and customer safety. Workers agree to pay accumulated commission on schedule.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-heading font-extrabold text-sm text-[#0B0E12]">4. Anti-Circumvention Policy</h2>
              <p>
                Sharing direct off-platform payment details, personal phone numbers in public chats, or attempting to bypass platform bookings to evade commission is strictly prohibited. Violation results in permanent suspension.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-heading font-extrabold text-sm text-[#0B0E12]">5. Dispute Resolution</h2>
              <p>
                If work is incomplete or price disagreement occurs, both parties can open a formal dispute within 48 hours of service completion via the dashboard. Admin decisions are final.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
