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
  const [currentUser, setUserState] = useState<UserType | null>(() => getCurrentUser());
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

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
    <header className="sticky top-0 z-50 w-full bg-[#F7F8F5]/90 backdrop-blur-md border-b border-[#EAECE7]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[76px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-[#0B0E12] flex items-center justify-center -rotate-6 shadow-xs group-hover:rotate-0 transition-transform duration-200 shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M14.7 6.3a1 1 0 0 0-1.4 0L4.6 15A2 2 0 0 0 4 16.4V19a1 1 0 0 0 1 1h2.6a2 2 0 0 0 1.4-.6l8.7-8.7a1 1 0 0 0 0-1.4l-3-3Z" stroke="#39E07A" strokeWidth="1.8" />
              </svg>
            </div>
            <span className="font-heading font-extrabold text-xl text-[#0B0E12] tracking-tight">
              Naya Kaam
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-[15px] font-semibold text-[#0B0E12]">
            <Link href="/search" className="hover:text-[#1FB863] transition-colors flex items-center gap-1.5">
              <Search size={16} />
              Categories
            </Link>
            <Link href="/#how-it-works" className="hover:text-[#1FB863] transition-colors">
              How it works
            </Link>
            <Link href="/worker-signup" className="hover:text-[#1FB863] transition-colors flex items-center gap-1">
              Become a worker
            </Link>
          </nav>

          {/* Right Action Buttons & Role Switcher */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Demo Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#EAECE7] bg-white text-xs font-bold text-[#0B0E12] hover:bg-gray-50 transition"
              >
                <span className="w-2 h-2 rounded-full bg-[#39E07A] animate-pulse"></span>
                <span>Mode:</span>
                <span className="capitalize text-[#1FB863]">
                  {currentUser ? currentUser.role : 'Guest'}
                </span>
                <ChevronDown size={14} className="text-[#666E7A]" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-[#EAECE7] py-2 z-50 text-xs">
                  <div className="px-3 py-1.5 border-b border-[#EAECE7] text-[#666E7A] font-bold uppercase tracking-wider text-[10px]">
                    Switch View (Demo)
                  </div>
                  <button
                    onClick={() => handleSwitchRole('customer')}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2 text-[#0B0E12] font-semibold transition"
                  >
                    <User size={14} className="text-[#1FB863]" />
                    <span>Customer View</span>
                  </button>
                  <button
                    onClick={() => handleSwitchRole('worker')}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2 text-[#0B0E12] font-semibold transition"
                  >
                    <UserCheck size={14} className="text-emerald-600" />
                    <span>Worker View</span>
                  </button>
                  <button
                    onClick={() => handleSwitchRole('admin')}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2 text-[#0B0E12] font-semibold transition"
                  >
                    <ShieldAlert size={14} className="text-amber-600" />
                    <span>Admin Panel</span>
                  </button>
                  <Link
                    href="/admin/calls"
                    onClick={() => setRoleDropdownOpen(false)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2 text-[#0B0E12] font-semibold transition"
                  >
                    <Sparkles size={14} className="text-[#1FB863]" />
                    <span>In-App Call Logs</span>
                  </Link>
                </div>
              )}
            </div>

            {currentUser ? (
              <div className="flex items-center gap-2">
                <Link
                  href={currentUser.role === 'admin' ? '/admin' : '/dashboard'}
                  className="btn btn-primary text-xs py-2 px-4"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-[#666E7A] hover:text-red-600 hover:bg-red-50 rounded-full transition"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="btn btn-ghost text-xs py-2 px-4 font-bold"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="btn btn-primary text-xs py-2 px-4 font-bold"
                >
                  Sign up
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
