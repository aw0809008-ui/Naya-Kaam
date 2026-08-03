'use client';

import { db } from './firebase';
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';

export interface AppNotification {
  id: string;
  recipient_id: string;
  title: string;
  body: string;
  type: 'booking_request' | 'booking_status' | 'chat_message' | 'incoming_call' | 'booking_completed';
  url: string;
  is_read: boolean;
  created_at: string;
  meta?: {
    bookingId?: string;
    workerId?: string;
    customerId?: string;
    callId?: string;
  };
}

const NOTIFICATIONS_STORAGE_KEY = 'nayakaam_notifications_v1';

export function getStoredNotifications(userId: string): AppNotification[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`${NOTIFICATIONS_STORAGE_KEY}_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStoredNotification(userId: string, notification: AppNotification) {
  if (typeof window === 'undefined') return;
  const current = getStoredNotifications(userId);
  const updated = [notification, ...current.slice(0, 49)];
  localStorage.setItem(`${NOTIFICATIONS_STORAGE_KEY}_${userId}`, JSON.stringify(updated));
}

// Show System / PWA Native Push Notification if permitted
export function triggerNativeNotification(title: string, body: string, url: string, isCall: boolean = false) {
  if (typeof window === 'undefined' || !('Notification' in window)) return;

  if (Notification.permission === 'granted') {
    try {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'SHOW_NOTIFICATION',
          title,
          body,
          url,
          isCall,
        });
      } else {
        if ('vibrate' in navigator) {
          try {
            navigator.vibrate(isCall ? [300, 100, 300, 100, 600] : [200, 100, 200]);
          } catch {}
        }
        new Notification(title, {
          body,
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-192x192.png',
          data: { url },
        } as any);
      }
    } catch (e) {
      console.warn('Native notification trigger fallback:', e);
    }
  }
}

// Dispatch event helper
export async function sendAppNotification({
  recipientId,
  title,
  body,
  type,
  url,
  meta,
}: {
  recipientId: string;
  title: string;
  body: string;
  type: AppNotification['type'];
  url: string;
  meta?: AppNotification['meta'];
}) {
  const notification: AppNotification = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    recipient_id: recipientId,
    title,
    body,
    type,
    url,
    is_read: false,
    created_at: new Date().toISOString(),
    meta,
  };

  saveStoredNotification(recipientId, notification);

  // Trigger browser push/system alert if app is open/background
  triggerNativeNotification(title, body, url, type === 'incoming_call');

  // Sync to Firestore notifications collection
  try {
    await addDoc(collection(db, 'app_notifications'), notification);
  } catch (err) {
    console.warn('Firestore notification sync offline fallback:', err);
  }

  // Dispatch custom window event so UI can immediately update
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('nayakaam_new_notification', { detail: notification }));
  }
}

// Specialized event notification triggers:
export async function notifyNewBookingRequest(workerId: string, customerName: string, category: string, bookingId: string) {
  await sendAppNotification({
    recipientId: workerId,
    title: '⚡ Naya Booking Request Aaya Hai!',
    body: `${customerName} ne ${category} service ke liye booking bheji hai. Dashboard par response dein.`,
    type: 'booking_request',
    url: '/dashboard?tab=bookings',
    meta: { bookingId, workerId },
  });
}

export async function notifyBookingStatusChanged(customerId: string, workerName: string, status: 'accepted' | 'declined' | 'cancelled', bookingId: string) {
  const statusText = status === 'accepted' ? 'qabool (accepted)' : status === 'declined' ? 'mustarad (declined)' : 'mansookh (cancelled)';
  await sendAppNotification({
    recipientId: customerId,
    title: `📋 Booking ${status.toUpperCase()} by ${workerName}`,
    body: `${workerName} ne aapki booking ${statusText} kar di hai.`,
    type: 'booking_status',
    url: '/dashboard?tab=bookings',
    meta: { bookingId, customerId },
  });
}

export async function notifyNewChatMessage(recipientId: string, senderName: string, messageText: string, bookingId: string) {
  await sendAppNotification({
    recipientId,
    title: `💬 New Message from ${senderName}`,
    body: messageText.length > 60 ? `${messageText.substring(0, 60)}...` : messageText,
    type: 'chat_message',
    url: `/dashboard?tab=bookings&chat=${bookingId}`,
    meta: { bookingId },
  });
}

export async function notifyIncomingCall(calleeId: string, callerName: string, category?: string, callId?: string) {
  await sendAppNotification({
    recipientId: calleeId,
    title: `📞 URGENT: Incoming Call from ${callerName}`,
    body: `In-App Voice Call regarding ${category || 'service booking'}. Tap to answer immediately!`,
    type: 'incoming_call',
    url: '/dashboard',
    meta: { callId },
  });
}

export async function notifyBookingCompleted(customerId: string, workerName: string, bookingId: string) {
  await sendAppNotification({
    recipientId: customerId,
    title: `🎉 Service Complete! Review ${workerName}`,
    body: `${workerName} ne kaam mukammal kar diya hai. Apni raye (review) share karein!`,
    type: 'booking_completed',
    url: `/dashboard?tab=completed&review=${bookingId}`,
    meta: { bookingId, customerId },
  });
}
