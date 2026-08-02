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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in font-body text-[#0B0E12]">
      <div className="bg-white rounded-[26px] max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#EAECE7] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#666E7A] hover:text-[#0B0E12] p-2 rounded-full hover:bg-[#F7F8F5] transition"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2.5 text-[#0B0E12] mb-2">
          <div className="w-8 h-8 rounded-xl bg-[#0B0E12] text-[#39E07A] flex items-center justify-center -rotate-6">
            <Sparkles size={18} />
          </div>
          <h3 className="font-heading font-extrabold text-lg text-[#0B0E12]">
            AI Smart Search Parser
          </h3>
        </div>

        <p className="text-xs text-[#666E7A] font-medium mb-4">
          Type naturally in Roman Urdu or English (e.g. &quot;mujhe kal subah plumber chahiye Gulshan me&quot;). Gemini AI will extract category, city, area, and urgency!
        </p>

        <form onSubmit={handleParse} className="space-y-3">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Electrician urgently required in Gulberg Lahore for UPS wiring"
              className="w-full pl-4 pr-11 py-3 text-xs rounded-xl border border-[#EAECE7] focus:outline-none focus:border-[#0B0E12] bg-[#F7F8F5] font-medium text-[#0B0E12]"
              autoFocus
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="absolute right-2 top-2 p-1.5 rounded-lg bg-[#0B0E12] text-[#39E07A] hover:bg-[#1FB863] hover:text-white disabled:opacity-50 transition"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
            </button>
          </div>
        </form>

        {/* Sample Suggestions */}
        <div className="mt-4">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#666E7A] mb-2">
            <Lightbulb size={13} className="text-[#FFC93C]" />
            <span>Try clicking one of these samples:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {sampleQueries.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectSample(sample)}
                className="text-left text-[11px] px-2.5 py-1 rounded-full bg-[#F7F8F5] text-[#0B0E12] font-semibold hover:bg-[#EAECE7] transition border border-[#EAECE7]"
              >
                &ldquo;{sample}&rdquo;
              </button>
            ))}
          </div>
        </div>

        {/* AI Parsed Results Card */}
        {parsedResult && (
          <div className="mt-5 p-4 rounded-2xl bg-[#F7F8F5] border border-[#EAECE7] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#0B0E12] uppercase tracking-wider flex items-center gap-1 font-heading">
                <Sparkles size={14} className="text-[#1FB863]" /> AI Parsed Parameters
              </span>
              <span className="text-[10px] bg-[#D6F5E3] text-[#1FB863] font-bold px-2.5 py-0.5 rounded-full border border-[#1FB863]/20">
                Gemini Extracted
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-[#EAECE7]">
                <span className="text-[#666E7A] block text-[10px] font-medium">Category</span>
                <span className="font-bold text-[#0B0E12]">
                  {parsedResult.category || 'Not specified'}
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-[#EAECE7]">
                <span className="text-[#666E7A] block text-[10px] font-medium">City</span>
                <span className="font-bold text-[#0B0E12]">
                  {parsedResult.city || 'Any City'}
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-[#EAECE7]">
                <span className="text-[#666E7A] block text-[10px] font-medium">Area / Neighborhood</span>
                <span className="font-bold text-[#0B0E12]">
                  {parsedResult.area || 'All Areas'}
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-[#EAECE7]">
                <span className="text-[#666E7A] block text-[10px] font-medium">Urgency / Schedule</span>
                <span className="font-bold text-[#0B0E12]">
                  {parsedResult.urgency || 'Standard'}
                </span>
              </div>
            </div>

            <button
              onClick={handleConfirm}
              className="btn btn-lime w-full py-3 text-xs font-bold flex items-center justify-center gap-2"
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
