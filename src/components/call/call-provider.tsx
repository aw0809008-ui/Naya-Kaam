'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CallRecord, User } from '@/lib/types';
import { getCurrentUser, saveCallRecord, getCalls, recordMissedCallChatMessage } from '@/lib/store';
import { notifyIncomingCall } from '@/lib/notifications';
import { ringtone } from '@/lib/ringtone';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, where, doc, updateDoc } from 'firebase/firestore';
import { VoiceCallOverlay } from './voice-call-overlay';
import { IncomingCallModal } from './incoming-call-modal';
import { PhoneMissed, PhoneCall, X } from 'lucide-react';

interface InitiateCallParams {
  bookingId: string;
  calleeId: string;
  calleeName: string;
  calleePhoto?: string;
  calleeRole: 'customer' | 'worker';
  category?: string;
}

interface CallContextType {
  activeCall: CallRecord | null;
  incomingCall: CallRecord | null;
  initiateCall: (params: InitiateCallParams) => void;
  endActiveCall: () => void;
  missedCallNotice: CallRecord | null;
  dismissMissedNotice: () => void;
}

const CallContext = createContext<CallContextType | null>(null);

export function useCall() {
  const ctx = useContext(CallContext);
  if (!ctx) {
    throw new Error('useCall must be used within CallProvider');
  }
  return ctx;
}

export function CallProvider({ children }: { children: React.ReactNode }) {
  const [currentUser] = useState<User | null>(() => getCurrentUser());
  const [activeCall, setActiveCall] = useState<CallRecord | null>(null);
  const [incomingCall, setIncomingCall] = useState<CallRecord | null>(null);
  const [isCaller, setIsCaller] = useState<boolean>(true);
  const [missedCallNotice, setMissedCallNotice] = useState<CallRecord | null>(null);

  useEffect(() => {
    // Check for PWA Notification permissions
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  // Ringtone synthesizer for incoming call
  useEffect(() => {
    if (incomingCall && !activeCall) {
      ringtone.startRinging();
    } else {
      ringtone.stopRinging();
    }
    return () => ringtone.stopRinging();
  }, [incomingCall, activeCall]);

  // Listen for incoming calls in Firestore
  useEffect(() => {
    if (!currentUser?.id) return;

    const q = query(
      collection(db, 'calls'),
      where('callee_id', '==', currentUser.id),
      where('status', '==', 'offering')
    );

    const unsub = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added' || change.type === 'modified') {
          const callData = { id: change.doc.id, ...change.doc.data() } as CallRecord;
          if (callData.status === 'offering' && (!activeCall || activeCall.id !== callData.id)) {
            setIncomingCall(callData);

            // Trigger push notification
            notifyIncomingCall(callData.callee_id, callData.caller_name, callData.category, callData.id).catch(() => {});
          }
        }
      });
    });

    return () => unsub();
  }, [currentUser?.id, activeCall]);

  // Initiate an outgoing call
  const initiateCall = useCallback(
    (params: InitiateCallParams) => {
      const user = getCurrentUser();
      const newCall: CallRecord = {
        id: `call-${Date.now()}`,
        booking_id: params.bookingId,
        caller_id: user?.id || 'u-c1',
        caller_name: user?.name || 'Customer',
        caller_photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
        caller_role: user?.role === 'worker' ? 'worker' : 'customer',
        callee_id: params.calleeId,
        callee_name: params.calleeName,
        callee_photo: params.calleePhoto,
        callee_role: params.calleeRole,
        category: params.category,
        status: 'offering',
        duration_seconds: 0,
        created_at: new Date().toISOString(),
      };

      saveCallRecord(newCall);
      setActiveCall(newCall);
      setIsCaller(true);

      // Trigger high priority call push notification
      notifyIncomingCall(params.calleeId, user?.name || 'Customer', params.category, newCall.id).catch(() => {});
    },
    []
  );

  const acceptIncomingCall = useCallback(() => {
    if (!incomingCall) return;
    ringtone.stopRinging();
    const acceptedCall = { ...incomingCall, status: 'connected' as const };
    setActiveCall(acceptedCall);
    setIsCaller(false);
    setIncomingCall(null);
  }, [incomingCall]);

  const declineIncomingCall = useCallback(async () => {
    if (!incomingCall) return;
    ringtone.stopRinging();
    const missed: CallRecord = {
      ...incomingCall,
      status: 'missed',
      ended_at: new Date().toISOString(),
    };
    saveCallRecord(missed);
    setIncomingCall(null);
    setMissedCallNotice(missed);

    // Record missed call in booking chat thread
    recordMissedCallChatMessage(
      incomingCall.booking_id,
      incomingCall.caller_name,
      incomingCall.caller_role
    );

    try {
      await updateDoc(doc(db, 'calls', incomingCall.id), {
        status: 'missed',
        ended_at: new Date().toISOString(),
      });
    } catch {}
  }, [incomingCall]);

  const endActiveCall = useCallback(() => {
    ringtone.stopRinging();
    setActiveCall(null);
  }, []);

  return (
    <CallContext.Provider
      value={{
        activeCall,
        incomingCall,
        initiateCall,
        endActiveCall,
        missedCallNotice,
        dismissMissedNotice: () => setMissedCallNotice(null),
      }}
    >
      {children}

      {/* Incoming Call Screen */}
      {incomingCall && !activeCall && (
        <IncomingCallModal
          callRecord={incomingCall}
          onAccept={acceptIncomingCall}
          onDecline={declineIncomingCall}
        />
      )}

      {/* Active WebRTC Call Overlay */}
      {activeCall && (
        <VoiceCallOverlay
          callRecord={activeCall}
          isCaller={isCaller}
          onEndCall={endActiveCall}
        />
      )}

      {/* Missed Call Banner Notification */}
      {missedCallNotice && (
        <div className="fixed top-20 right-4 z-50 bg-[#141A22] text-white p-4 rounded-2xl border-2 border-amber-500 shadow-2xl flex items-center gap-3 max-w-sm animate-bounce font-body">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <PhoneMissed size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-amber-400">Missed In-App Voice Call</p>
            <p className="text-xs text-gray-200 truncate font-medium">
              From {missedCallNotice.caller_name} ({missedCallNotice.category || 'Service'})
            </p>
            <p className="text-[10px] text-gray-400">Zero phone numbers shared • Logged in App</p>
          </div>
          <button
            onClick={() => setMissedCallNotice(null)}
            className="text-gray-400 hover:text-white p-1 rounded-lg"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </CallContext.Provider>
  );
}
