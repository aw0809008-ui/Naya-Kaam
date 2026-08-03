'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { PhoneCall, Send, X, ShieldCheck, CheckCircle2, MessageSquare } from 'lucide-react';
import { Booking, ChatMessage, User } from '@/lib/types';
import { getBookingChatMessages, sendChatMessage, getCurrentUser } from '@/lib/store';
import { useCall } from '@/components/call/call-provider';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

interface BookingChatModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BookingChatModal({ booking, isOpen, onClose }: BookingChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    booking ? getBookingChatMessages(booking.id) : []
  );
  const [inputText, setInputText] = useState('');
  const [currentUser] = useState<User | null>(() => getCurrentUser());
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { initiateCall } = useCall();

  // Subscribe to real-time chats from Firestore
  useEffect(() => {
    if (!booking) return;

    // Initialize with local store
    const initialMsgs = getBookingChatMessages(booking.id);
    if (initialMsgs.length > 0) {
      // Set via snapshot or microtask
      Promise.resolve().then(() => {
        setMessages(initialMsgs);
      });
    }

    const q = query(collection(db, 'chats'), where('booking_id', '==', booking.id));
    const unsub = onSnapshot(q, (snapshot) => {
      const liveMsgs: ChatMessage[] = [];
      snapshot.forEach((docSnap) => {
        liveMsgs.push({ id: docSnap.id, ...docSnap.data() } as ChatMessage);
      });
      if (liveMsgs.length > 0) {
        liveMsgs.sort((a, b) => a.created_at.localeCompare(b.created_at));
        setMessages(liveMsgs);
      }
    });

    return () => unsub();
  }, [booking]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen || !booking) return null;

  const isWorkerViewer = currentUser?.role === 'worker';
  const otherPersonName = isWorkerViewer ? booking.customer_name : booking.worker_name;
  const otherPersonPhoto = isWorkerViewer
    ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200'
    : booking.worker_photo || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=200';
  const otherPersonId = isWorkerViewer ? booking.customer_id : booking.worker_id;
  const otherPersonRole = isWorkerViewer ? 'customer' : 'worker';

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !currentUser) return;

    sendChatMessage({
      booking_id: booking.id,
      sender_id: currentUser.id,
      sender_name: currentUser.name,
      sender_role: currentUser.role === 'worker' ? 'worker' : 'customer',
      text: inputText.trim(),
    });

    setInputText('');
  };

  const handleStartCall = () => {
    initiateCall({
      bookingId: booking.id,
      calleeId: otherPersonId,
      calleeName: otherPersonName,
      calleePhoto: otherPersonPhoto,
      calleeRole: otherPersonRole,
      category: booking.category,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-body animate-fade-in">
      <div className="bg-white rounded-[28px] max-w-lg w-full h-[600px] flex flex-col shadow-2xl border border-[#EAECE7] overflow-hidden relative">
        {/* Header */}
        <div className="bg-[#0B0E12] text-white p-4 sm:p-5 flex items-center justify-between border-b border-gray-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-[#1FB863] bg-gray-800 shrink-0">
              <Image
                src={otherPersonPhoto}
                alt={otherPersonName}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-sm text-white flex items-center gap-1.5">
                {otherPersonName}
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1FB863]/20 text-[#39E07A] border border-[#1FB863]/30 capitalize">
                  {otherPersonRole}
                </span>
              </h3>
              <p className="text-xs text-gray-400">
                {booking.category} • Booking #{booking.id.slice(-6)}
              </p>
            </div>
          </div>

          {/* Top In-App Voice Call Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleStartCall}
              className="px-3.5 py-2 rounded-xl bg-[#1FB863] hover:bg-[#189d53] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
              title="Start In-App Voice Call"
            >
              <PhoneCall size={15} />
              <span>Call</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Security / Privacy Banner */}
        <div className="bg-[#D6F5E3] border-b border-[#1FB863]/20 px-4 py-2 text-[11px] text-[#14703B] font-bold flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-[#1FB863]" />
            In-App Voice & Chat (No phone numbers shared)
          </span>
          <span className="text-[10px] font-normal text-gray-600">WebRTC Audio</span>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F7F8F5]">
          {messages.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <MessageSquare size={36} className="text-gray-300 mx-auto" />
              <p className="text-xs text-[#666E7A] font-medium">
                Start a conversation or tap <strong className="text-[#1FB863]">&ldquo;Call&rdquo;</strong> to speak directly over WebRTC.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.sender_id === currentUser?.id;
              const isMissedCall = msg.text.includes('Missed In-App Voice Call') || msg.text.includes('Missed');

              if (isMissedCall) {
                return (
                  <div key={msg.id} className="w-full flex justify-center my-2">
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 max-w-xs w-full text-center space-y-2 shadow-xs">
                      <div className="flex items-center justify-center gap-1.5 text-amber-700 font-bold text-xs">
                        <PhoneCall size={14} className="text-amber-600" />
                        <span>{msg.text}</span>
                      </div>
                      <p className="text-[10px] text-amber-600 font-medium">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <button
                        onClick={handleStartCall}
                        className="w-full py-1.5 px-3 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition shadow-2xs"
                      >
                        <PhoneCall size={13} />
                        <span>Call Back Now</span>
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[10px] text-[#666E7A] px-1 mb-0.5">
                    {msg.sender_name}
                  </span>
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-xs font-medium leading-relaxed ${
                      isMine
                        ? 'bg-[#0B0E12] text-white rounded-tr-none'
                        : 'bg-white text-[#0B0E12] border border-[#EAECE7] rounded-tl-none shadow-2xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-gray-400 mt-1 px-1">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 bg-white border-t border-[#EAECE7] flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            placeholder="Type a message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 p-3 text-xs bg-[#F7F8F5] border border-[#EAECE7] rounded-xl focus:outline-none focus:border-[#0B0E12] font-body"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-3 bg-[#0B0E12] hover:bg-gray-800 disabled:opacity-40 text-white rounded-xl transition flex items-center justify-center shrink-0"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
