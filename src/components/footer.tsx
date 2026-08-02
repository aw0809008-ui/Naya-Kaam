import Link from 'next/link';

export function Footer() {
  return (
    <footer className="pt-14 pb-8 bg-[#F7F8F5] border-t border-[#EAECE7] font-body text-[#0B0E12]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 pb-8 border-b border-[#EAECE7]">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#0B0E12] flex items-center justify-center -rotate-6 shadow-xs shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M14.7 6.3a1 1 0 0 0-1.4 0L4.6 15A2 2 0 0 0 4 16.4V19a1 1 0 0 0 1 1h2.6a2 2 0 0 0 1.4-.6l8.7-8.7a1 1 0 0 0 0-1.4l-3-3Z" stroke="#39E07A" strokeWidth="1.8" />
                </svg>
              </div>
              <span className="font-heading font-extrabold text-xl text-[#0B0E12]">
                Naya Kaam
              </span>
            </div>
            <p className="text-sm text-[#666E7A] leading-relaxed max-w-sm font-medium">
              Pakistan ke mohallon ko verified kaarigar se jorne wala platform. Electricians, plumbers, tailors, tutors aur bohot kuch.
            </p>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-heading font-bold text-sm text-[#0B0E12] mb-4">
              Company
            </h4>
            <div className="flex flex-col gap-2 text-sm font-medium text-[#666E7A]">
              <Link href="#" className="hover:text-[#0B0E12] transition">About</Link>
              <Link href="#" className="hover:text-[#0B0E12] transition">Contact</Link>
              <Link href="#" className="hover:text-[#0B0E12] transition">Careers</Link>
            </div>
          </div>

          {/* For Workers */}
          <div>
            <h4 className="font-heading font-bold text-sm text-[#0B0E12] mb-4">
              For Workers
            </h4>
            <div className="flex flex-col gap-2 text-sm font-medium text-[#666E7A]">
              <Link href="/worker-signup" className="hover:text-[#0B0E12] transition">Become a worker</Link>
              <Link href="#" className="hover:text-[#0B0E12] transition">Earnings</Link>
              <Link href="#" className="hover:text-[#0B0E12] transition">Support</Link>
            </div>
          </div>

          {/* Legal & Admin */}
          <div>
            <h4 className="font-heading font-bold text-sm text-[#0B0E12] mb-4">
              Legal
            </h4>
            <div className="flex flex-col gap-2 text-sm font-medium text-[#666E7A]">
              <Link href="#" className="hover:text-[#0B0E12] transition">Terms</Link>
              <Link href="#" className="hover:text-[#0B0E12] transition">Privacy</Link>
              <Link href="/admin" className="text-[#1FB863] font-bold hover:underline transition">Admin Portal</Link>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center text-xs font-semibold text-[#666E7A] gap-2">
          <span>© 2026 Naya Kaam</span>
          <span>Made in Pakistan 🇵🇰</span>
        </div>
      </div>
    </footer>
  );
}

