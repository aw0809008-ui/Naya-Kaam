'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { setCurrentUser } from '@/lib/store';
import { Wrench, Phone, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('03001112233');
  const [password, setPassword] = useState('password123');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser({
      id: 'u-c1',
      name: 'Tariq Mehmood',
      phone,
      email: 'customer@nayakaam.pk',
      role: 'customer',
      city: 'Karachi',
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
            <div className="w-12 h-12 rounded-2xl bg-[#1E5AA8] text-white flex items-center justify-center mx-auto">
              <Wrench size={24} />
            </div>
            <h1 className="text-2xl font-bold text-[#1A1A1A]">Welcome Back</h1>
            <p className="text-xs text-gray-500">
              Sign in to your Naya Kaam account to manage bookings
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
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
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#1E5AA8]"
                />
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
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#1E5AA8]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#1E5AA8] hover:bg-[#174786] text-white font-bold text-xs transition shadow-md flex items-center justify-center gap-2"
            >
              <span>Login to Naya Kaam</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
            Account nahi hai?{' '}
            <Link href="/signup" className="text-[#1E5AA8] font-bold hover:underline">
              Naya Account Banayein
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
