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
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 card-shadow max-w-md w-full space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#F5820D] text-white flex items-center justify-center mx-auto">
              <Wrench size={24} />
            </div>
            <h1 className="text-2xl font-bold text-[#1A1A1A]">Customer Signup</h1>
            <p className="text-xs text-gray-500">
              Create a customer account to book verified skilled workers
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                Full Name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tariq Mehmood"
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#1E5AA8]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 0300 1112233"
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#1E5AA8]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                City
              </label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#1E5AA8] bg-white"
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
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#1E5AA8]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#F5820D] hover:bg-[#D97109] text-white font-bold text-xs transition shadow-md flex items-center justify-center gap-2"
            >
              <span>Create Customer Account</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100 space-y-2">
            <div>
              Pehle se account hai?{' '}
              <Link href="/login" className="text-[#1E5AA8] font-bold hover:underline">
                Login Karein
              </Link>
            </div>
            <div>
              Kaarigar (Worker) hain?{' '}
              <Link href="/worker-signup" className="text-[#F5820D] font-bold hover:underline">
                Worker Signup Karein
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
