import Link from 'next/link';
import { Wrench, Phone, Mail, MapPin, Shield, CheckCircle2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#102a52] text-white pt-12 pb-8 border-t border-[#1E5AA8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-blue-900/60">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#F5820D] flex items-center justify-center text-white">
                <Wrench size={20} />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Naya Kaam
              </span>
            </div>
            <p className="text-xs text-blue-200 leading-relaxed">
              Pakistan&apos;s trusted marketplace connecting homeowners with CNIC-verified skilled workers. Electricians, plumbers, AC technicians, tailors, tutors, drivers, and more.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <CheckCircle2 size={14} /> 100% CNIC Verified Providers
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-blue-300 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs text-blue-100">
              <li>
                <Link href="/search" className="hover:text-white transition">
                  Search Workers (Karachi, Lahore, ISL)
                </Link>
              </li>
              <li>
                <Link href="/#categories" className="hover:text-white transition">
                  All Service Categories
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-white transition">
                  How Booking Works
                </Link>
              </li>
              <li>
                <Link href="/worker-signup" className="text-[#F5820D] hover:underline font-semibold">
                  Become a Worker (Kaarigar Registration)
                </Link>
              </li>
            </ul>
          </div>

          {/* Top Services */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-blue-300 mb-4">
              Top Services
            </h4>
            <ul className="space-y-2 text-xs text-blue-100 grid grid-cols-2 gap-x-2">
              <li><Link href="/search?category=Electrician" className="hover:text-white">Electrician</Link></li>
              <li><Link href="/search?category=Plumber" className="hover:text-white">Plumber</Link></li>
              <li><Link href="/search?category=AC+Technician" className="hover:text-white">AC Repair</Link></li>
              <li><Link href="/search?category=Tailor" className="hover:text-white">Tailor</Link></li>
              <li><Link href="/search?category=Tutor" className="hover:text-white">Home Tutor</Link></li>
              <li><Link href="/search?category=Driver" className="hover:text-white">Driver</Link></li>
              <li><Link href="/search?category=Makeup+Artist" className="hover:text-white">Makeup Artist</Link></li>
              <li><Link href="/search?category=Mehndi+Artist" className="hover:text-white">Mehndi Artist</Link></li>
            </ul>
          </div>

          {/* Contact & Admin */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-blue-300 mb-4">
              Help & Contact
            </h4>
            <ul className="space-y-2.5 text-xs text-blue-100">
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-[#F5820D]" />
                <span>Helpline: +92 300 111 KAAM (5226)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-[#F5820D]" />
                <span>support@nayakaam.pk</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={14} className="text-[#F5820D]" />
                <span>Karachi, Lahore & Islamabad Offices</span>
              </li>
              <li className="pt-2">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-900/80 hover:bg-blue-800 text-blue-200 text-xs transition border border-blue-700/50"
                >
                  <Shield size={13} />
                  <span>Admin Portal</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-blue-300 gap-4">
          <p>© {new Date().getFullYear()} Naya Kaam Pakistan. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-white">Privacy Policy</Link>
            <Link href="#" className="hover:text-white">Terms of Service</Link>
            <Link href="#" className="hover:text-white">Safety Guidelines</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
