'use client';

import { useState } from 'react';
import { Sparkles, Search, Loader2, X, ArrowRight, Lightbulb } from 'lucide-react';
import { SmartSearchParsed } from '@/lib/types';

interface SmartSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyParsed: (parsed: SmartSearchParsed) => void;
}

export function SmartSearchModal({ isOpen, onClose, onApplyParsed }: SmartSearchModalProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [parsedResult, setParsedResult] = useState<SmartSearchParsed | null>(null);

  if (!isOpen) return null;

  const handleParse = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setParsedResult(null);

    try {
      const res = await fetch('/api/ai/parse-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setParsedResult(data);
    } catch (err) {
      console.error('Smart search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const sampleQueries = [
    'Mujhe kal subah plumber chahiye Gulshan e Iqbal me',
    'Need an AC technician for gas refill in DHA Lahore',
    'Ladies tailor required for urgent suit stitching in Islamabad F-8',
    'O level Physics home tutor needed in Karachi Phase 6',
  ];

  const handleSelectSample = (sample: string) => {
    setQuery(sample);
  };

  const handleConfirm = () => {
    if (parsedResult) {
      onApplyParsed(parsedResult);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2.5 text-[#1E5AA8] mb-2">
          <div className="w-8 h-8 rounded-lg bg-[#1E5AA8]/10 flex items-center justify-center text-[#1E5AA8]">
            <Sparkles size={18} />
          </div>
          <h3 className="font-bold text-lg text-[#1A1A1A]">
            AI Smart Search Parser
          </h3>
        </div>

        <p className="text-xs text-[#4A4A4A] mb-4">
          Type naturally in Roman Urdu or English (e.g. &quot;mujhe kal subah plumber chahiye Gulshan me&quot;). Gemini AI will extract category, city, area, and urgency!
        </p>

        <form onSubmit={handleParse} className="space-y-3">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Electrician urgently required in Gulberg Lahore for UPS wiring"
              className="w-full pl-4 pr-11 py-3 text-sm rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#1E5AA8] focus:ring-2 focus:ring-[#1E5AA8]/20 bg-gray-50/50"
              autoFocus
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="absolute right-2 top-2 p-1.5 rounded-lg bg-[#F5820D] hover:bg-[#D97109] disabled:opacity-50 text-white transition"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
            </button>
          </div>
        </form>

        {/* Sample Suggestions */}
        <div className="mt-3">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 mb-1.5">
            <Lightbulb size={13} className="text-amber-500" />
            <span>Try clicking one of these samples:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {sampleQueries.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectSample(sample)}
                className="text-left text-[11px] px-2.5 py-1 rounded-lg bg-blue-50/70 text-[#1E5AA8] hover:bg-blue-100 transition"
              >
                &ldquo;{sample}&rdquo;
              </button>
            ))}
          </div>
        </div>

        {/* AI Parsed Results Card */}
        {parsedResult && (
          <div className="mt-5 p-4 rounded-xl bg-gradient-to-br from-blue-50/80 to-indigo-50/50 border border-blue-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1E5AA8] uppercase tracking-wider flex items-center gap-1">
                <Sparkles size={14} /> AI Parsed Parameters
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                Gemini Extracted
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-gray-100">
                <span className="text-gray-400 block text-[10px] font-medium">Category</span>
                <span className="font-bold text-[#1A1A1A]">
                  {parsedResult.category || 'Not specified'}
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-gray-100">
                <span className="text-gray-400 block text-[10px] font-medium">City</span>
                <span className="font-bold text-[#1A1A1A]">
                  {parsedResult.city || 'Any City'}
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-gray-100">
                <span className="text-gray-400 block text-[10px] font-medium">Area / Neighborhood</span>
                <span className="font-bold text-[#1A1A1A]">
                  {parsedResult.area || 'All Areas'}
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-gray-100">
                <span className="text-gray-400 block text-[10px] font-medium">Urgency / Schedule</span>
                <span className="font-bold text-[#1A1A1A]">
                  {parsedResult.urgency || 'Standard'}
                </span>
              </div>
            </div>

            <button
              onClick={handleConfirm}
              className="w-full py-2.5 rounded-xl bg-[#F5820D] hover:bg-[#D97109] text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-xs"
            >
              Apply Filter & Show Workers
              <ArrowRight size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
