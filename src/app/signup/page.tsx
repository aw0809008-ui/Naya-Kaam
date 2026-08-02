'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { setCurrentUser } from '@/lib/store';
import { Wrench, Phone, User, Lock, MapPin, ArrowRight } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Karachi');
  const [password, setPassword] = useState('');

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    setCurrentUser({
      id: `u-c-${Date.now()}`,
      name,
      phone,
      email: `${name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      role: 'customer',
      city,
      created_at: new Date().toISOString(),
    });
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8F5] text-[#0B0E12] font-body">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="bg-white rounded-[26px] p-8 border border-[#EAECE7] shadow-xl max-w-md w-full space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#0B0E12] text-[#39E07A] flex items-center justify-center mx-auto -rotate-6 shadow-sm">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M14.7 6.3a1 1 0 0 0-1.4 0L4.6 15A2 2 0 0 0 4 16.4V19a1 1 0 0 0 1 1h2.6a2 2 0 0 0 1.4-.6l8.7-8.7a1 1 0 0 0 0-1.4l-3-3Z" stroke="#39E07A" strokeWidth="2" />
              </svg>
            </div>
            <h1 className="font-heading font-extrabold text-2xl text-[#0B0E12] pt-2">Customer Signup</h1>
            <p className="text-xs text-[#666E7A] font-medium">
              Create a customer account to book verified skilled workers
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#0B0E12] mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-3.5 text-[#666E7A]" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tariq Mehmood"
                  className="w-full pl-10 pr-3 py-3 text-xs rounded-xl border border-[#EAECE7] focus:outline-none focus:border-[#0B0E12] font-medium text-[#0B0E12] bg-[#F7F8F5]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0B0E12] mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-3.5 text-[#666E7A]" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 0300 1112233"
                  className="w-full pl-10 pr-3 py-3 text-xs rounded-xl border border-[#EAECE7] focus:outline-none focus:border-[#0B0E12] font-medium text-[#0B0E12] bg-[#F7F8F5]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0B0E12] mb-1.5">
                City
              </label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3.5 top-3.5 text-[#666E7A] pointer-events-none" />
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 text-xs rounded-xl border border-[#EAECE7] focus:outline-none focus:border-[#0B0E12] font-medium text-[#0B0E12] bg-[#F7F8F5]"
                >
                  <option value="Karachi">Karachi</option>
                  <option value="Lahore">Lahore</option>
                  <option value="Islamabad">Islamabad</option>
                  <option value="Rawalpindi">Rawalpindi</option>
                  <option value="Faisalabad">Faisalabad</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0B0E12] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-3.5 text-[#666E7A]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-3 text-xs rounded-xl border border-[#EAECE7] focus:outline-none focus:border-[#0B0E12] font-medium text-[#0B0E12] bg-[#F7F8F5]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-lime w-full py-3.5 text-xs font-extrabold mt-2"
            >
              <span>Create Customer Account</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="text-center text-xs text-[#666E7A] pt-4 border-t border-[#EAECE7] font-medium space-y-2">
            <div>
              Pehle se account hai?{' '}
              <Link href="/login" className="text-[#1FB863] font-bold hover:underline">
                Login Karein
              </Link>
            </div>
            <div>
              Kaarigar (Worker) hain?{' '}
              <Link href="/worker-signup" className="text-[#0B0E12] font-extrabold hover:underline">
                Worker Registration Karein →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
