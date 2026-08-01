'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Wrench,
  UserCheck,
  Search,
  Menu,
  X,
  ShieldAlert,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
  Briefcase,
} from 'lucide-react';
import { getCurrentUser, setCurrentUser } from '@/lib/store';
import { User as UserType } from '@/lib/types';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setUserState] = useState<UserType | null>(null);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  useEffect(() => {
    setUserState(getCurrentUser());
  }, []);

  const handleSwitchRole = (role: 'customer' | 'worker' | 'admin') => {
    setRoleDropdownOpen(false);
    if (role === 'admin') {
      window.location.href = '/admin';
      return;
    }
    let updated: UserType;
    if (role === 'worker') {
      updated = {
        id: 'u-w1',
        name: 'Mohammad Tariq',
        phone: '03001234567',
        email: 'tariq.electric@gmail.com',
        role: 'worker',
        city: 'Karachi',
        created_at: new Date().toISOString(),
      };
    } else {
      updated = {
        id: 'u-c1',
        name: 'Tariq Mehmood',
        phone: '03001112233',
        email: 'customer@nayakaam.pk',
        role: 'customer',
        city: 'Karachi',
        created_at: new Date().toISOString(),
      };
    }
    setCurrentUser(updated);
    setUserState(updated);
    if (pathname.startsWith('/admin')) {
      window.location.href = '/dashboard';
    } else {
      window.location.reload();
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUserState(null);
    setRoleDropdownOpen(false);
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-[#1E5AA8] flex items-center justify-center text-white shadow-sm group-hover:bg-[#174786] transition-colors">
              <Wrench size={22} className="stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-[#1E5AA8] block leading-none">
                Naya Kaam
              </span>
              <span className="text-[10px] text-gray-500 tracking-wide font-medium block mt-0.5">
                Mahir Kaarigar Marketplace
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
            <Link
              href="/search"
              className={`hover:text-[#1E5AA8] transition-colors flex items-center gap-1.5 ${
                pathname === '/search' ? 'text-[#1E5AA8] font-semibold' : ''
              }`}
            >
              <Search size={16} />
              Dhoondein (Search)
            </Link>
            <Link
              href="/#categories"
              className="hover:text-[#1E5AA8] transition-colors"
            >
              Categories
            </Link>
            <Link
              href="/#how-it-works"
              className="hover:text-[#1E5AA8] transition-colors"
            >
              Kaise Kaam Karta Hai
            </Link>
            <Link
              href="/worker-signup"
              className="text-[#1E5AA8] hover:underline font-semibold flex items-center gap-1"
            >
              <Briefcase size={15} />
              Kaarigar Banein
            </Link>
          </nav>

          {/* Right Action & Role Switcher */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Demo Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Mode:</span>
                <span className="capitalize text-[#1E5AA8]">
                  {currentUser ? currentUser.role : 'Guest'}
                </span>
                <ChevronDown size={14} className="text-gray-400" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-lg border border-gray-100 py-2 z-50 text-xs">
                  <div className="px-3 py-1.5 border-b border-gray-100 text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
                    Switch View (Demo)
                  </div>
                  <button
                    onClick={() => handleSwitchRole('customer')}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                  >
                    <User size={14} className="text-[#1E5AA8]" />
                    <span>Customer Dashboard</span>
                  </button>
                  <button
                    onClick={() => handleSwitchRole('worker')}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                  >
                    <UserCheck size={14} className="text-emerald-600" />
                    <span>Worker Dashboard</span>
                  </button>
                  <button
                    onClick={() => handleSwitchRole('admin')}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                  >
                    <ShieldAlert size={14} className="text-amber-600" />
                    <span>Admin Panel</span>
                  </button>
                </div>
              )}
            </div>

            {currentUser ? (
              <div className="flex items-center gap-2">
                <Link
                  href={currentUser.role === 'admin' ? '/admin' : '/dashboard'}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-[#1E5AA8] hover:bg-[#174786] transition shadow-xs"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-lg transition"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-semibold text-[#1E5AA8] border border-[#1E5AA8] hover:bg-[#1E5AA8]/5 rounded-xl transition"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-sm font-semibold text-white bg-[#F5820D] hover:bg-[#D97109] rounded-xl transition shadow-xs"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-gray-100 bg-white px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/search"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#1E5AA8] font-semibold flex items-center gap-2"
          >
            <Search size={18} />
            Dhoondein Workers (Search)
          </Link>
          <Link
            href="/#categories"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-gray-700 font-medium"
          >
            Categories
          </Link>
          <Link
            href="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-gray-700 font-medium"
          >
            Kaise Kaam Karta Hai
          </Link>
          <Link
            href="/worker-signup"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#1E5AA8] font-semibold flex items-center gap-2"
          >
            <Briefcase size={18} />
            Worker Registration
          </Link>

          <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Quick Switch Role
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleSwitchRole('customer')}
                className="py-1.5 px-2 bg-blue-50 text-[#1E5AA8] rounded-lg text-xs font-semibold text-center"
              >
                Customer
              </button>
              <button
                onClick={() => handleSwitchRole('worker')}
                className="py-1.5 px-2 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold text-center"
              >
                Worker
              </button>
              <button
                onClick={() => handleSwitchRole('admin')}
                className="py-1.5 px-2 bg-amber-50 text-amber-700 rounded-lg text-xs font-semibold text-center"
              >
                Admin
              </button>
            </div>

            {currentUser ? (
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  href={currentUser.role === 'admin' ? '/admin' : '/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl text-white font-semibold bg-[#1E5AA8]"
                >
                  My Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full py-2 text-red-600 font-semibold text-sm border border-red-200 rounded-xl"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-xl font-semibold border border-[#1E5AA8] text-[#1E5AA8]"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-xl font-semibold text-white bg-[#F5820D]"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
