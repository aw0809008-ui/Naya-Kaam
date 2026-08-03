'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { getCategories, saveWorker, setCurrentUser, checkDeviceSignupRateLimit, recordDeviceSignup } from '@/lib/store';
import { CaptchaChallenge } from '@/components/ui/captcha-challenge';
import Link from 'next/link';
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
  AlertTriangle,
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

  // Agreement & Security states
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedCommission, setAgreedCommission] = useState(false);
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
    setErrorMessage('');

    if (!name || !phone || !cnicNumber || !area) return;

    if (!agreedTerms) {
      setErrorMessage('Baraye meherbani Terms & Conditions aur Privacy Policy ko qabool karein.');
      return;
    }

    if (!agreedCommission) {
      setErrorMessage('Baraye meherbani 15% platform commission aur suspension policy ko qabool karein.');
      return;
    }

    if (!isCaptchaValid) {
      setErrorMessage('Security verification (Bot check) ka sahi jawab likhein.');
      return;
    }

    if (!checkDeviceSignupRateLimit()) {
      setErrorMessage('Is device se zyada worker accounts create karne ki limit poori ho chuki hai. Baad mein koshish karein.');
      return;
    }

    recordDeviceSignup();
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
    <div className="min-h-screen flex flex-col bg-[#F7F8F5] text-[#0B0E12] font-body">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-1">
        <div className="bg-white rounded-[26px] p-6 sm:p-10 border border-[#EAECE7] shadow-xl space-y-6">
          <div className="text-center space-y-2 border-b border-[#EAECE7] pb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#0B0E12] text-[#39E07A] flex items-center justify-center mx-auto -rotate-6 shadow-sm">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M14.7 6.3a1 1 0 0 0-1.4 0L4.6 15A2 2 0 0 0 4 16.4V19a1 1 0 0 0 1 1h2.6a2 2 0 0 0 1.4-.6l8.7-8.7a1 1 0 0 0 0-1.4l-3-3Z" stroke="#39E07A" strokeWidth="2" />
              </svg>
            </div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#0B0E12] pt-2">
              Kaarigar Registration (Worker Signup)
            </h1>
            <p className="text-xs sm:text-sm text-[#666E7A] font-medium max-w-md mx-auto">
              Naya Kaam par verified provider banein. CNIC verify karwayen aur rozana naye customers se kaam hasil karein.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Details */}
            <div className="space-y-4">
              <h3 className="font-heading font-extrabold text-sm text-[#0B0E12] uppercase tracking-wider flex items-center gap-1.5">
                <User size={16} className="text-[#1FB863]" /> 1. Basic Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0B0E12] mb-1.5">
                    Poora Naam (Full Name) *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Mohammad Tariq"
                    className="w-full p-3 text-xs rounded-xl border border-[#EAECE7] focus:outline-none focus:border-[#0B0E12] font-medium text-[#0B0E12] bg-[#F7F8F5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B0E12] mb-1.5">
                    Phone Number (Rabta Number) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 0300 1234567"
                    className="w-full p-3 text-xs rounded-xl border border-[#EAECE7] focus:outline-none focus:border-[#0B0E12] font-medium text-[#0B0E12] bg-[#F7F8F5]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0B0E12] mb-1.5">
                    Shehar (City) *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-3 text-xs rounded-xl border border-[#EAECE7] focus:outline-none focus:border-[#0B0E12] font-medium text-[#0B0E12] bg-[#F7F8F5]"
                  >
                    {citiesList.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B0E12] mb-1.5">
                    Area / Neighborhood *
                  </label>
                  <input
                    type="text"
                    required
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. Gulshan-e-Iqbal, DHA, F-8"
                    className="w-full p-3 text-xs rounded-xl border border-[#EAECE7] focus:outline-none focus:border-[#0B0E12] font-medium text-[#0B0E12] bg-[#F7F8F5]"
                  />
                </div>
              </div>
            </div>

            {/* Skill & Pricing */}
            <div className="space-y-4 pt-4 border-t border-[#EAECE7]">
              <h3 className="font-heading font-extrabold text-sm text-[#0B0E12] uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase size={16} className="text-[#1FB863]" /> 2. Service Skill & Rates
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0B0E12] mb-1.5">
                    Primary Service Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-3 text-xs rounded-xl border border-[#EAECE7] focus:outline-none focus:border-[#0B0E12] font-medium text-[#0B0E12] bg-[#F7F8F5]"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B0E12] mb-1.5">
                    Experience (Kitne saal ka tajurba?) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={40}
                    value={experience}
                    onChange={(e) => setExperience(Number(e.target.value))}
                    className="w-full p-3 text-xs rounded-xl border border-[#EAECE7] focus:outline-none focus:border-[#0B0E12] font-medium text-[#0B0E12] bg-[#F7F8F5]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0B0E12] mb-1.5">
                    Pricing Type *
                  </label>
                  <select
                    value={rateType}
                    onChange={(e) => setRateType(e.target.value as any)}
                    className="w-full p-3 text-xs rounded-xl border border-[#EAECE7] focus:outline-none focus:border-[#0B0E12] font-medium text-[#0B0E12] bg-[#F7F8F5]"
                  >
                    <option value="hourly">Per Hour (Ghante k hisab se)</option>
                    <option value="job">Per Job (Kaam k hisab se)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B0E12] mb-1.5">
                    Rate Amount (PKR) *
                  </label>
                  <input
                    type="number"
                    min={200}
                    step={100}
                    value={rateAmount}
                    onChange={(e) => setRateAmount(Number(e.target.value))}
                    className="w-full p-3 text-xs rounded-xl border border-[#EAECE7] focus:outline-none focus:border-[#0B0E12] font-medium text-[#0B0E12] bg-[#F7F8F5]"
                  />
                </div>
              </div>
            </div>

            {/* CNIC Verification Upload */}
            <div className="space-y-4 pt-4 border-t border-[#EAECE7]">
              <h3 className="font-heading font-extrabold text-sm text-[#0B0E12] uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-[#1FB863]" /> 3. NADRA CNIC Verification
              </h3>

              <div>
                <label className="block text-xs font-bold text-[#0B0E12] mb-1.5">
                  CNIC Number (42101-XXXXXXX-X) *
                </label>
                <input
                  type="text"
                  required
                  value={cnicNumber}
                  onChange={(e) => setCnicNumber(e.target.value)}
                  placeholder="e.g. 42101-1234567-1"
                  className="w-full p-3 text-xs rounded-xl border border-[#EAECE7] focus:outline-none focus:border-[#0B0E12] font-medium text-[#0B0E12] bg-[#F7F8F5]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 border-2 border-dashed border-[#EAECE7] bg-[#F7F8F5] rounded-2xl text-center hover:border-[#0B0E12] transition cursor-pointer">
                  <Upload size={20} className="text-[#666E7A] mx-auto mb-1" />
                  <span className="text-xs font-bold text-[#0B0E12] block">
                    Upload Front CNIC Photo
                  </span>
                  <span className="text-[10px] text-[#666E7A] font-medium">JPG or PNG (Max 5MB)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={() => setCnicPhotoUploaded(true)}
                    className="hidden"
                    id="cnic-front"
                  />
                  <label htmlFor="cnic-front" className="block text-[11px] text-[#1FB863] font-bold mt-1 cursor-pointer">
                    {cnicPhotoUploaded ? '✓ Photo Attached' : 'Select File'}
                  </label>
                </div>

                <div className="p-4 border-2 border-dashed border-[#EAECE7] bg-[#F7F8F5] rounded-2xl text-center hover:border-[#0B0E12] transition cursor-pointer">
                  <Upload size={20} className="text-[#666E7A] mx-auto mb-1" />
                  <span className="text-xs font-bold text-[#0B0E12] block">
                    Upload Back CNIC Photo
                  </span>
                  <span className="text-[10px] text-[#666E7A] font-medium">JPG or PNG (Max 5MB)</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="cnic-back"
                  />
                  <label htmlFor="cnic-back" className="block text-[11px] text-[#1FB863] font-bold mt-1 cursor-pointer">
                    Select File
                  </label>
                </div>
              </div>
            </div>

            {/* AI Bio Generator Box */}
            <div className="space-y-3 pt-4 border-t border-[#EAECE7]">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-[#0B0E12]">
                  Professional Bio (About Your Experience)
                </label>
                <button
                  type="button"
                  onClick={handleGenerateBio}
                  disabled={isGeneratingBio}
                  className="px-3 py-1.5 rounded-full bg-[#D6F5E3] text-[#1FB863] hover:bg-[#c3f2d4] text-xs font-bold flex items-center gap-1.5 transition border border-[#1FB863]/20"
                >
                  {isGeneratingBio ? (
                    <Loader2 size={13} className="animate-spin text-[#1FB863]" />
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
                className="w-full p-3 text-xs rounded-xl border border-[#EAECE7] focus:outline-none focus:border-[#0B0E12] font-medium text-[#0B0E12] bg-[#F7F8F5]"
              />
            </div>

            {/* Security Verification & Agreements */}
            <div className="space-y-4 pt-4 border-t border-[#EAECE7]">
              <CaptchaChallenge onVerify={(isValid) => setIsCaptchaValid(isValid)} />

              <div className="space-y-2.5">
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="worker-terms"
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="mt-0.5 rounded border-[#EAECE7] text-[#0B0E12] focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="worker-terms" className="text-xs text-[#666E7A] font-medium leading-tight cursor-pointer">
                    I agree to the{' '}
                    <Link href="/terms" target="_blank" className="text-[#0B0E12] font-bold underline hover:text-[#1FB863]">
                      Terms & Conditions
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" target="_blank" className="text-[#0B0E12] font-bold underline hover:text-[#1FB863]">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="worker-commission"
                    checked={agreedCommission}
                    onChange={(e) => setAgreedCommission(e.target.checked)}
                    className="mt-0.5 rounded border-[#EAECE7] text-[#0B0E12] focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="worker-commission" className="text-xs text-[#666E7A] font-medium leading-tight cursor-pointer">
                    I agree to the <strong>15% platform commission</strong> and understand that sharing contact details outside the app may result in account suspension.
                  </label>
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs font-semibold">
                <AlertTriangle size={16} className="shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !agreedTerms || !agreedCommission || !isCaptchaValid}
              className="btn btn-lime w-full py-4 text-xs font-extrabold disabled:opacity-50 disabled:cursor-not-allowed"
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
