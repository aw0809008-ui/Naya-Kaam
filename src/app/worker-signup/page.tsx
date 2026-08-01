'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { getCategories, saveWorker, setCurrentUser } from '@/lib/store';
import { Worker, Category } from '@/lib/types';
import {
  Briefcase,
  Sparkles,
  ShieldCheck,
  User,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  Upload,
  CheckCircle2,
  Loader2,
  ArrowRight,
} from 'lucide-react';

export default function WorkerSignupPage() {
  const router = useRouter();
  const categories = getCategories();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Karachi');
  const [area, setArea] = useState('');
  const [category, setCategory] = useState('Electrician');
  const [experience, setExperience] = useState(5);
  const [rateType, setRateType] = useState<'hourly' | 'job'>('hourly');
  const [rateAmount, setRateAmount] = useState(1000);
  const [cnicNumber, setCnicNumber] = useState('');
  const [bio, setBio] = useState('');

  // Mock file upload states
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(
    'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400'
  );
  const [cnicPhotoUploaded, setCnicPhotoUploaded] = useState(false);

  // AI Bio Generation state
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGenerateBio = async () => {
    if (!name || !category) {
      alert('Pehle apna naam aur category chunein!');
      return;
    }
    setIsGeneratingBio(true);
    try {
      const res = await fetch('/api/ai/generate-bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          category,
          yearsExperience: experience,
          city,
        }),
      });
      const data = await res.json();
      if (data.bio) {
        setBio(data.bio);
      }
    } catch (err) {
      console.error('Bio generation error:', err);
    } finally {
      setIsGeneratingBio(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !cnicNumber || !area) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const newWorkerId = `w-${Date.now()}`;
      const newWorker: Worker = {
        id: newWorkerId,
        name,
        phone,
        email: `${name.toLowerCase().replace(/\s+/g, '')}@nayakaam.pk`,
        category,
        city,
        area,
        cnic_number: cnicNumber,
        years_experience: experience,
        rate_type: rateType,
        rate_amount: Number(rateAmount),
        bio: bio || `${category} with ${experience} years experience in ${city}.`,
        profile_photo_url: profilePhotoUrl,
        cnic_front_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400',
        cnic_back_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400',
        is_verified: false, // Pending admin verification
        is_available: true,
        average_rating: 5.0,
        total_reviews: 0,
        created_at: new Date().toISOString(),
      };

      saveWorker(newWorker);

      // Set user session to this newly registered worker
      setCurrentUser({
        id: `u-${newWorkerId}`,
        name: newWorker.name,
        phone: newWorker.phone,
        email: newWorker.email,
        role: 'worker',
        city: newWorker.city,
        created_at: newWorker.created_at,
      });

      setIsSubmitting(false);
      router.push('/dashboard');
    }, 600);
  };

  const citiesList = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad'];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 card-shadow space-y-6">
          <div className="text-center space-y-2 border-b border-gray-100 pb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#1E5AA8] text-white flex items-center justify-center mx-auto shadow-sm">
              <Briefcase size={24} />
            </div>
            <h1 className="text-2xl font-bold text-[#1A1A1A]">
              Kaarigar Registration (Worker Signup)
            </h1>
            <p className="text-xs text-[#4A4A4A] max-w-md mx-auto">
              Naya Kaam par verified provider banein. CNIC verify karwayen aur rozana naye customers se kaam hasil karein.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Details */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-[#1E5AA8] uppercase tracking-wider flex items-center gap-1.5">
                <User size={16} /> 1. Basic Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                    Poora Naam (Full Name) *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Mohammad Tariq"
                    className="w-full p-2.5 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#1E5AA8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                    Phone Number (Rabta Number) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 0300 1234567"
                    className="w-full p-2.5 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#1E5AA8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                    Shehar (City) *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#1E5AA8] bg-white"
                  >
                    {citiesList.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                    Area / Neighborhood *
                  </label>
                  <input
                    type="text"
                    required
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. Gulshan-e-Iqbal, DHA, F-8"
                    className="w-full p-2.5 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#1E5AA8]"
                  />
                </div>
              </div>
            </div>

            {/* Skill & Pricing */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="font-bold text-sm text-[#1E5AA8] uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase size={16} /> 2. Service Skill & Rates
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                    Primary Service Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#1E5AA8] bg-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                    Experience (Kitne saal ka tajurba?) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={40}
                    value={experience}
                    onChange={(e) => setExperience(Number(e.target.value))}
                    className="w-full p-2.5 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#1E5AA8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                    Pricing Type *
                  </label>
                  <select
                    value={rateType}
                    onChange={(e) => setRateType(e.target.value as any)}
                    className="w-full p-2.5 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#1E5AA8] bg-white"
                  >
                    <option value="hourly">Per Hour (Ghante k hisab se)</option>
                    <option value="job">Per Job (Kaam k hisab se)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                    Rate Amount (PKR) *
                  </label>
                  <input
                    type="number"
                    min={200}
                    step={100}
                    value={rateAmount}
                    onChange={(e) => setRateAmount(Number(e.target.value))}
                    className="w-full p-2.5 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#1E5AA8]"
                  />
                </div>
              </div>
            </div>

            {/* CNIC Verification Upload */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="font-bold text-sm text-[#1E5AA8] uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck size={16} /> 3. NADRA CNIC Verification
              </h3>

              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                  CNIC Number (42101-XXXXXXX-X) *
                </label>
                <input
                  type="text"
                  required
                  value={cnicNumber}
                  onChange={(e) => setCnicNumber(e.target.value)}
                  placeholder="e.g. 42101-1234567-1"
                  className="w-full p-2.5 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#1E5AA8]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl text-center hover:border-[#1E5AA8] transition cursor-pointer">
                  <Upload size={20} className="text-gray-400 mx-auto mb-1" />
                  <span className="text-xs font-semibold text-[#1A1A1A] block">
                    Upload Front CNIC Photo
                  </span>
                  <span className="text-[10px] text-gray-400">JPG or PNG (Max 5MB)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={() => setCnicPhotoUploaded(true)}
                    className="hidden"
                    id="cnic-front"
                  />
                  <label htmlFor="cnic-front" className="block text-[11px] text-[#1E5AA8] font-bold mt-1 cursor-pointer">
                    {cnicPhotoUploaded ? '✓ Photo Attached' : 'Select File'}
                  </label>
                </div>

                <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl text-center hover:border-[#1E5AA8] transition cursor-pointer">
                  <Upload size={20} className="text-gray-400 mx-auto mb-1" />
                  <span className="text-xs font-semibold text-[#1A1A1A] block">
                    Upload Back CNIC Photo
                  </span>
                  <span className="text-[10px] text-gray-400">JPG or PNG (Max 5MB)</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="cnic-back"
                  />
                  <label htmlFor="cnic-back" className="block text-[11px] text-[#1E5AA8] font-bold mt-1 cursor-pointer">
                    Select File
                  </label>
                </div>
              </div>
            </div>

            {/* AI Bio Generator Box */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-[#1A1A1A]">
                  Professional Bio (About Your Experience)
                </label>
                <button
                  type="button"
                  onClick={handleGenerateBio}
                  disabled={isGeneratingBio}
                  className="px-3 py-1 rounded-lg bg-[#1E5AA8]/10 text-[#1E5AA8] hover:bg-[#1E5AA8]/20 text-xs font-bold flex items-center gap-1.5 transition border border-[#1E5AA8]/20"
                >
                  {isGeneratingBio ? (
                    <Loader2 size={13} className="animate-spin text-[#1E5AA8]" />
                  ) : (
                    <Sparkles size={13} />
                  )}
                  <span>Generate Bio with AI</span>
                </button>
              </div>

              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Click 'Generate Bio with AI' to let Gemini write an impressive summary, or type manually..."
                className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#1E5AA8]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-[#F5820D] hover:bg-[#D97109] text-white font-bold text-sm transition shadow-md flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Registering Provider...' : 'Submit Provider Registration'}
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
