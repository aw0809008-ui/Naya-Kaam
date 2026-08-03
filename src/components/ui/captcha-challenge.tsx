'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, RefreshCw } from 'lucide-react';

interface CaptchaProps {
  onVerify: (isValid: boolean) => void;
}

export function CaptchaChallenge({ onVerify }: CaptchaProps) {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const generatePuzzle = () => {
    const a = Math.floor(Math.random() * 8) + 1;
    const b = Math.floor(Math.random() * 8) + 1;
    setNum1(a);
    setNum2(b);
    setUserAnswer('');
    setIsVerified(false);
    onVerify(false);
  };

  useEffect(() => {
    generatePuzzle();
  }, []);

  const handleChange = (val: string) => {
    setUserAnswer(val);
    const expected = num1 + num2;
    if (parseInt(val.trim(), 10) === expected) {
      setIsVerified(true);
      onVerify(true);
    } else {
      setIsVerified(false);
      onVerify(false);
    }
  };

  return (
    <div className="bg-[#F7F8FA] border border-[#EAECE7] p-3.5 rounded-2xl space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#0B0E12]">
          <ShieldCheck size={16} className={isVerified ? 'text-emerald-500' : 'text-amber-500'} />
          <span>Security Verification (Bot Check)</span>
        </div>

        <button
          type="button"
          onClick={generatePuzzle}
          className="text-gray-400 hover:text-gray-600 p-1 rounded-md transition"
          title="Refresh Challenge"
        >
          <RefreshCw size={13} />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="bg-white border border-[#EAECE7] px-3 py-2 rounded-xl text-xs font-bold text-[#0B0E12] tracking-wider font-mono">
          {num1} + {num2} = ?
        </div>

        <input
          type="number"
          value={userAnswer}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Jawab likhein"
          className="w-full px-3 py-2 text-xs rounded-xl border border-[#EAECE7] focus:outline-none focus:border-[#0B0E12] font-semibold bg-white text-[#0B0E12]"
        />
      </div>

      {isVerified && (
        <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
          ✓ Verification Successful! You are human.
        </p>
      )}
    </div>
  );
}
