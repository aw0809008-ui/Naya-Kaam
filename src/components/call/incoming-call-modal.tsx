'use client';

import React from 'react';
import Image from 'next/image';
import { Phone, PhoneOff, ShieldCheck, Sparkles } from 'lucide-react';
import { CallRecord } from '@/lib/types';

interface IncomingCallModalProps {
  callRecord: CallRecord;
  onAccept: () => void;
  onDecline: () => void;
}

export function IncomingCallModal({ callRecord, onAccept, onDecline }: IncomingCallModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-body animate-fade-in">
      <div className="bg-[#141A22] border-2 border-[#1FB863] rounded-[32px] p-8 max-w-sm w-full text-white shadow-2xl text-center space-y-6 relative overflow-hidden">
        {/* Animated aura ring */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1FB863]/10 to-transparent pointer-events-none" />

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1FB863]/20 text-[#39E07A] text-xs font-bold border border-[#1FB863]/30">
          <Sparkles size={14} className="animate-spin" />
          <span>Incoming In-App Voice Call</span>
        </div>

        {/* Profile Avatar */}
        <div className="relative mx-auto w-24 h-24 my-2">
          <div className="absolute inset-0 rounded-full bg-[#1FB863]/30 animate-ping" />
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-[#1FB863] shadow-lg bg-[#273240]">
            <Image
              src={
                callRecord.caller_photo ||
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400'
              }
              alt={callRecord.caller_name}
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Info */}
        <div className="space-y-1">
          <h3 className="text-xl font-heading font-extrabold text-white">
            {callRecord.caller_name}
          </h3>
          <p className="text-xs text-[#39E07A] font-semibold capitalize">
            {callRecord.category || callRecord.caller_role}
          </p>
          <p className="text-xs text-gray-400 pt-1">
            Calling regarding booking #{callRecord.booking_id}
          </p>
        </div>

        {/* Accept / Decline buttons */}
        <div className="pt-4 flex items-center justify-center gap-6">
          <button
            onClick={onDecline}
            className="flex-1 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <PhoneOff size={18} />
            <span>Decline</span>
          </button>

          <button
            onClick={onAccept}
            className="flex-1 py-3.5 rounded-2xl bg-[#1FB863] hover:bg-[#189d53] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all animate-bounce"
          >
            <Phone size={18} />
            <span>Accept Call</span>
          </button>
        </div>

        <p className="text-[10px] text-gray-500 font-medium flex items-center justify-center gap-1">
          <ShieldCheck size={12} className="text-[#39E07A]" />
          Zero phone numbers collected or shared
        </p>
      </div>
    </div>
  );
}
