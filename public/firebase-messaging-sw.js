// Firebase Cloud Messaging Background Service Worker
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Initialize Firebase App in SW
firebase.initializeApp({
  apiKey: "AIzaSyCUXOOvyb6qF2BignTQ6CwUk4eZwjNZt7U",
  authDomain: "meta-expanse-6ds98.firebaseapp.com",
  projectId: "meta-expanse-6ds98",
  storageBucket: "meta-expanse-6ds98.firebasestorage.app",
  messagingSenderId: "919994022815",
  appId: "1:919994022815:web:cf1fbc575101f90c6ddbaa",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification?.title || payload.data?.title || 'Naya Kaam Notification';
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || 'Aap ke liye naya message/update aaya hai.',
    icon: payload.notification?.icon || '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    data: {
      url: payload.data?.url || '/dashboard',
    },
    vibrate: [200, 100, 200, 100, 400],
    requireInteraction: payload.data?.isCall === 'true',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
