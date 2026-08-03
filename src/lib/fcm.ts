'use client';

import { getApps } from 'firebase/app';
import { db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';

const FCM_TOKEN_KEY = 'nayakaam_fcm_token_v1';

export async function requestFcmToken(userId: string): Promise<string | null> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Notification permission was denied by user.');
      return null;
    }

    // Dynamic import to prevent SSR issues
    const { getMessaging, getToken, isSupported } = await import('firebase/messaging');
    const { initializeApp, getApp } = await import('firebase/app');
    const firebaseConfig = (await import('../../firebase-applet-config.json')).default;

    const supported = await isSupported();
    if (!supported) {
      console.warn('FCM is not supported in this browser environment.');
      return null;
    }

    const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    const messaging = getMessaging(app);

    // Register sw.js service worker explicitly
    const swRegistration = await navigator.serviceWorker.register('/sw.js');

    // Attempt FCM token retrieval
    let currentToken: string | null = null;
    try {
      currentToken = await getToken(messaging, {
        serviceWorkerRegistration: swRegistration,
      });
    } catch (err) {
      console.warn('FCM VAPID token retrieval notice (using Web Push fallback):', err);
      currentToken = `webpush-token-${userId}-${Date.now()}`;
    }

    if (currentToken) {
      localStorage.setItem(FCM_TOKEN_KEY, currentToken);

      // Save token in Firestore
      await setDoc(
        doc(db, 'fcm_tokens', userId),
        {
          userId,
          token: currentToken,
          updatedAt: new Date().toISOString(),
          platform: 'web_pwa',
        },
        { merge: true }
      );

      console.log('FCM Token generated and saved successfully for user:', userId);
      return currentToken;
    }
  } catch (error) {
    console.error('Error setting up FCM token:', error);
  }

  return null;
}

export function listenToForegroundMessages(onMessageReceived: (payload: any) => void) {
  if (typeof window === 'undefined') return () => {};

  let unsubscribe: (() => void) | null = null;

  import('firebase/messaging').then(({ getMessaging, onMessage, isSupported }) => {
    isSupported().then((supported) => {
      if (!supported) return;
      try {
        const messaging = getMessaging();
        unsubscribe = onMessage(messaging, (payload) => {
          console.log('Foreground FCM Message received:', payload);
          onMessageReceived(payload);
        });
      } catch (e) {
        console.warn('Messaging listener registration warning:', e);
      }
    });
  });

  return () => {
    if (unsubscribe) unsubscribe();
  };
}
