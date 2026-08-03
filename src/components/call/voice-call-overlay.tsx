'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Mic, MicOff, Volume2, VolumeX, PhoneOff, PhoneCall, ShieldCheck, Sparkles } from 'lucide-react';
import { CallRecord, CallStatus } from '@/lib/types';
import { saveCallRecord } from '@/lib/store';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, updateDoc, setDoc } from 'firebase/firestore';

interface VoiceCallOverlayProps {
  callRecord: CallRecord;
  isCaller: boolean;
  onEndCall: () => void;
}

const STUN_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

export function VoiceCallOverlay({ callRecord, isCaller, onEndCall }: VoiceCallOverlayProps) {
  const [callStatus, setCallStatus] = useState<CallStatus>(callRecord.status || 'offering');
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [duration, setDuration] = useState(callRecord.duration_seconds || 0);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const otherPersonName = isCaller ? callRecord.callee_name : callRecord.caller_name;
  const otherPersonPhoto = isCaller ? callRecord.callee_photo : callRecord.caller_photo;
  const otherPersonRole = isCaller ? callRecord.callee_role : callRecord.caller_role;

  // Format timer
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  // Start call duration timer
  const startTimer = useCallback(() => {
    if (timerIntervalRef.current) return;
    timerIntervalRef.current = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);
  }, []);

  // Stop timer
  const stopTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, []);

  // Gracefully end call
  const terminateCall = useCallback(
    async (finalStatus: CallStatus = 'ended') => {
      stopTimer();
      setCallStatus(finalStatus);

      // Stop local tracks
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
      }

      // Close PeerConnection
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }

      // Save call record to store & Firestore
      const updatedRecord: CallRecord = {
        ...callRecord,
        status: finalStatus,
        duration_seconds: duration,
        ended_at: new Date().toISOString(),
      };

      saveCallRecord(updatedRecord);

      try {
        await updateDoc(doc(db, 'calls', callRecord.id), {
          status: finalStatus,
          duration_seconds: duration,
          ended_at: new Date().toISOString(),
        });
      } catch (e) {
        console.log('Call status update notice:', e);
      }

      setTimeout(() => {
        onEndCall();
      }, 1200);
    },
    [callRecord, duration, stopTimer, onEndCall]
  );

  // Initialize WebRTC connection
  useEffect(() => {
    let mounted = true;

    async function setupWebRTC() {
      try {
        const pc = new RTCPeerConnection(STUN_SERVERS);
        pcRef.current = pc;

        // Remote track handler
        pc.ontrack = (event) => {
          if (remoteAudioRef.current && event.streams[0]) {
            remoteAudioRef.current.srcObject = event.streams[0];
          }
        };

        // ICE candidates
        pc.onicecandidate = (event) => {
          if (event.candidate) {
            const cand = event.candidate.toJSON();
            const candField = isCaller ? 'caller_candidates' : 'callee_candidates';
            const updatedCandidates = [
              ...(isCaller ? callRecord.caller_candidates || [] : callRecord.callee_candidates || []),
              cand,
            ];
            updateDoc(doc(db, 'calls', callRecord.id), {
              [candField]: updatedCandidates,
            }).catch(() => {});
          }
        };

        // Acquire Audio Stream
        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        } catch {
          // Fallback synthetic audio stream for headless container / permission denied
          const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
          const dest = ctx.createMediaStreamDestination();
          const osc = ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(440, ctx.currentTime);
          const gain = ctx.createGain();
          gain.gain.setValueAtTime(0.001, ctx.currentTime); // silent synth tone
          osc.connect(gain);
          gain.connect(dest);
          osc.start();
          stream = dest.stream;
        }

        localStreamRef.current = stream;
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        if (isCaller) {
          // Create Offer
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);

          const offerObj = { type: offer.type, sdp: offer.sdp || '' };
          await setDoc(
            doc(db, 'calls', callRecord.id),
            {
              ...callRecord,
              offer: offerObj,
              status: 'offering',
            },
            { merge: true }
          );
        } else if (callRecord.offer) {
          // Receiver sets offer and creates Answer
          await pc.setRemoteDescription(new RTCSessionDescription(callRecord.offer as RTCSessionDescriptionInit));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);

          const answerObj = { type: answer.type, sdp: answer.sdp || '' };
          await updateDoc(doc(db, 'calls', callRecord.id), {
            answer: answerObj,
            status: 'connected',
          });
          if (mounted) {
            setCallStatus('connected');
            startTimer();
          }
        }
      } catch (err) {
        console.error('WebRTC setup notice:', err);
      }
    }

    setupWebRTC();

    // Firestore listener for call state changes
    const unsub = onSnapshot(doc(db, 'calls', callRecord.id), (docSnap) => {
      if (!docSnap.exists() || !mounted) return;
      const data = docSnap.data() as CallRecord;

      if (data.status === 'connected' && callStatus !== 'connected') {
        setCallStatus('connected');
        startTimer();
        if (data.answer && pcRef.current && !pcRef.current.currentRemoteDescription) {
          pcRef.current.setRemoteDescription(new RTCSessionDescription(data.answer as RTCSessionDescriptionInit)).catch(() => {});
        }
      }

      if (data.status === 'ended' || data.status === 'declined') {
        terminateCall(data.status);
      }

      // Add Remote ICE Candidates
      const remoteCandidates = isCaller ? data.callee_candidates : data.caller_candidates;
      if (remoteCandidates && pcRef.current) {
        remoteCandidates.forEach((cand) => {
          pcRef.current?.addIceCandidate(new RTCIceCandidate(cand)).catch(() => {});
        });
      }
    });

    return () => {
      mounted = false;
      unsub();
      stopTimer();
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (pcRef.current) {
        pcRef.current.close();
      }
    };
  }, [callRecord.id, isCaller, startTimer, stopTimer, terminateCall, callRecord, callStatus]);

  // Toggle Mute
  const toggleMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((t) => {
        t.enabled = isMuted; // Toggle track enabled status
      });
      setIsMuted(!isMuted);
    }
  };

  // Toggle Speaker
  const toggleSpeaker = () => {
    if (remoteAudioRef.current) {
      remoteAudioRef.current.muted = isSpeakerOn;
      setIsSpeakerOn(!isSpeakerOn);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0E12]/90 backdrop-blur-md font-body">
      {/* Hidden audio element for WebRTC remote voice stream */}
      <audio ref={remoteAudioRef} autoPlay playsInline />

      <div className="bg-[#141A22] border border-[#273240] rounded-[32px] p-8 max-w-sm w-full text-white shadow-2xl text-center space-y-6 relative overflow-hidden">
        {/* Glowing background aura */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#1FB863]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#1E5AA8]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Security badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-[#39E07A] font-semibold">
          <ShieldCheck size={14} />
          <span>Encrypted WebRTC In-App Call</span>
        </div>

        {/* Avatar with pulse ring */}
        <div className="relative mx-auto w-28 h-28 my-4">
          {callStatus === 'offering' && (
            <div className="absolute inset-0 rounded-full bg-[#1FB863]/30 animate-ping" />
          )}
          <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-[#1FB863] shadow-lg bg-[#273240]">
            <Image
              src={
                otherPersonPhoto ||
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400'
              }
              alt={otherPersonName}
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Caller Info */}
        <div className="space-y-1">
          <h3 className="text-xl font-heading font-extrabold text-white">{otherPersonName}</h3>
          <p className="text-xs text-gray-400 capitalize font-medium">
            {callRecord.category ? `${callRecord.category} • ` : ''}
            {otherPersonRole}
          </p>

          {/* Call Status Label or Duration */}
          <div className="pt-2">
            {callStatus === 'offering' ? (
              <span className="text-sm font-semibold text-amber-400 flex items-center justify-center gap-2 animate-pulse">
                <PhoneCall size={16} />
                {isCaller ? 'Ringing...' : 'Connecting...'}
              </span>
            ) : callStatus === 'connected' ? (
              <span className="text-lg font-mono font-bold text-[#39E07A] tracking-wider">
                {formatTime(duration)}
              </span>
            ) : (
              <span className="text-sm font-semibold text-red-400">Call Ended</span>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="pt-4 flex items-center justify-center gap-6">
          {/* Mute toggle */}
          <button
            onClick={toggleMute}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              isMuted ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
          </button>

          {/* End Call Button */}
          <button
            onClick={() => terminateCall('ended')}
            className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"
            title="End Call"
          >
            <PhoneOff size={26} />
          </button>

          {/* Speaker toggle */}
          <button
            onClick={toggleSpeaker}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              !isSpeakerOn ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            title={isSpeakerOn ? 'Speaker On' : 'Speaker Off'}
          >
            {isSpeakerOn ? <Volume2 size={22} /> : <VolumeX size={22} />}
          </button>
        </div>

        <p className="text-[11px] text-gray-500 pt-2 font-medium">
          No phone numbers are shared. Direct peer-to-peer audio connection.
        </p>
      </div>
    </div>
  );
}
