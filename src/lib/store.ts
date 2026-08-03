'use client';

import { Worker, Category, Booking, Review, User, BookingStatus, CommissionStatus, CallRecord, ChatMessage, DisputeReport } from './types';
import { INITIAL_CATEGORIES, INITIAL_WORKERS, INITIAL_REVIEWS, INITIAL_BOOKINGS, INITIAL_CALLS, INITIAL_CHAT_MESSAGES } from './initial-data';
import { db, handleFirestoreError, OperationType } from './firebase';
import { doc, setDoc, deleteDoc, getDocs, collection } from 'firebase/firestore';

const STORAGE_KEYS = {
  WORKERS: 'nayakaam_workers_v1',
  CATEGORIES: 'nayakaam_categories_v1',
  BOOKINGS: 'nayakaam_bookings_v1',
  REVIEWS: 'nayakaam_reviews_v1',
  CURRENT_USER: 'nayakaam_user_v1',
  CALLS: 'nayakaam_calls_v1',
  CHAT_MESSAGES: 'nayakaam_chats_v1',
  FAVORITES: 'nayakaam_favorites_v1',
  DISPUTES: 'nayakaam_disputes_v1',
};

// Helper to safely get from localStorage
function getStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.error(`Error reading key ${key}:`, err);
    return fallback;
  }
}

// Helper to set to localStorage
function setStored<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error setting key ${key}:`, err);
  }
}

export function initializeStore() {
  if (typeof window === 'undefined') return;

  if (!window.localStorage.getItem(STORAGE_KEYS.WORKERS)) {
    setStored(STORAGE_KEYS.WORKERS, INITIAL_WORKERS);
  }
  if (!window.localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    setStored(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  }
  if (!window.localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
    setStored(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  }
  if (!window.localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
    setStored(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
  }
  if (!window.localStorage.getItem(STORAGE_KEYS.CALLS)) {
    setStored(STORAGE_KEYS.CALLS, INITIAL_CALLS);
  }
  if (!window.localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES)) {
    setStored(STORAGE_KEYS.CHAT_MESSAGES, INITIAL_CHAT_MESSAGES);
  }
}

// --- CATEGORIES ---
export function getCategories(): Category[] {
  return getStored(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
}

export function saveCategory(category: Category): Category[] {
  const current = getCategories();
  const existingIdx = current.findIndex((c) => c.id === category.id);
  let updated: Category[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = category;
  } else {
    updated = [category, ...current];
  }
  setStored(STORAGE_KEYS.CATEGORIES, updated);

  // Firestore sync
  setDoc(doc(db, 'categories', category.id), category).catch((err) => {
    handleFirestoreError(err, OperationType.WRITE, `categories/${category.id}`);
  });

  return updated;
}

export function deleteCategory(id: string): Category[] {
  const current = getCategories();
  const updated = current.filter((c) => c.id !== id);
  setStored(STORAGE_KEYS.CATEGORIES, updated);

  deleteDoc(doc(db, 'categories', id)).catch((err) => {
    handleFirestoreError(err, OperationType.DELETE, `categories/${id}`);
  });

  return updated;
}

// --- WORKERS ---
export function getWorkers(): Worker[] {
  return getStored(STORAGE_KEYS.WORKERS, INITIAL_WORKERS);
}

export function getWorkerById(id: string): Worker | undefined {
  const workers = getWorkers();
  return workers.find((w) => w.id === id);
}

export function saveWorker(worker: Worker): Worker {
  const workers = getWorkers();
  const index = workers.findIndex((w) => w.id === worker.id);
  let updated: Worker[];
  if (index >= 0) {
    updated = [...workers];
    updated[index] = worker;
  } else {
    updated = [worker, ...workers];
  }
  setStored(STORAGE_KEYS.WORKERS, updated);

  // Firestore sync
  setDoc(doc(db, 'workers', worker.id), worker).catch((err) => {
    handleFirestoreError(err, OperationType.WRITE, `workers/${worker.id}`);
  });

  return worker;
}

export function toggleWorkerVerified(workerId: string): Worker[] {
  const workers = getWorkers();
  const updated = workers.map((w) =>
    w.id === workerId ? { ...w, is_verified: !w.is_verified } : w
  );
  setStored(STORAGE_KEYS.WORKERS, updated);

  const updatedWorker = updated.find((w) => w.id === workerId);
  if (updatedWorker) {
    setDoc(doc(db, 'workers', workerId), updatedWorker).catch((err) => {
      handleFirestoreError(err, OperationType.UPDATE, `workers/${workerId}`);
    });
  }

  return updated;
}

export function verifyWorkerCNIC(workerId: string, isVerified: boolean): Worker[] {
  const workers = getWorkers();
  const updated = workers.map((w) =>
    w.id === workerId ? { ...w, is_verified: isVerified } : w
  );
  setStored(STORAGE_KEYS.WORKERS, updated);

  const updatedWorker = updated.find((w) => w.id === workerId);
  if (updatedWorker) {
    setDoc(doc(db, 'workers', workerId), updatedWorker).catch((err) => {
      handleFirestoreError(err, OperationType.UPDATE, `workers/${workerId}`);
    });
  }

  return updated;
}

export function toggleWorkerSuspended(workerId: string): Worker[] {
  const workers = getWorkers();
  const updated = workers.map((w) =>
    w.id === workerId ? { ...w, is_suspended: !w.is_suspended } : w
  );
  setStored(STORAGE_KEYS.WORKERS, updated);

  const updatedWorker = updated.find((w) => w.id === workerId);
  if (updatedWorker) {
    setDoc(doc(db, 'workers', workerId), updatedWorker).catch((err) => {
      handleFirestoreError(err, OperationType.UPDATE, `workers/${workerId}`);
    });
  }

  return updated;
}

// --- BOOKINGS ---
export function getBookings(): Booking[] {
  return getStored(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
}

export function getCustomerBookings(customerId: string): Booking[] {
  const bookings = getBookings();
  return bookings.filter((b) => b.customer_id === customerId);
}

export function getWorkerBookings(workerId: string): Booking[] {
  const bookings = getBookings();
  return bookings.filter((b) => b.worker_id === workerId);
}

export function createBooking(data: Omit<Booking, 'id' | 'created_at' | 'status' | 'commission_amount' | 'commission_status'>): Booking {
  const bookings = getBookings();
  const commission = Math.round((data.booking_amount || 1000) * 0.1);
  const newBooking: Booking = {
    ...data,
    id: `b-${Date.now()}`,
    status: 'pending',
    commission_amount: commission,
    commission_status: 'pending',
    created_at: new Date().toISOString(),
  };
  const updated = [newBooking, ...bookings];
  setStored(STORAGE_KEYS.BOOKINGS, updated);

  // Firestore sync
  setDoc(doc(db, 'bookings', newBooking.id), newBooking).catch((err) => {
    handleFirestoreError(err, OperationType.CREATE, `bookings/${newBooking.id}`);
  });

  return newBooking;
}

export function updateBookingStatus(bookingId: string, status: BookingStatus): Booking[] {
  const bookings = getBookings();
  let targetBooking: Booking | undefined;
  const updated = bookings.map((b) => {
    if (b.id === bookingId) {
      targetBooking = b;
      return {
        ...b,
        status,
        completed_at: status === 'completed' ? new Date().toISOString() : b.completed_at,
      };
    }
    return b;
  });
  setStored(STORAGE_KEYS.BOOKINGS, updated);

  const updatedBooking = updated.find((b) => b.id === bookingId);
  if (updatedBooking) {
    setDoc(doc(db, 'bookings', bookingId), updatedBooking).catch((err) => {
      handleFirestoreError(err, OperationType.UPDATE, `bookings/${bookingId}`);
    });

    // If job was completed, update worker's completed_jobs stat
    if (status === 'completed' && targetBooking?.worker_id) {
      const workers = getWorkers();
      const updatedWorkers = workers.map((w) =>
        w.id === targetBooking?.worker_id ? { ...w, completed_jobs: (w.completed_jobs || 0) + 1 } : w
      );
      setStored(STORAGE_KEYS.WORKERS, updatedWorkers);
      const targetWorker = updatedWorkers.find((w) => w.id === targetBooking?.worker_id);
      if (targetWorker) {
        setDoc(doc(db, 'workers', targetWorker.id), targetWorker).catch((err) => {
          handleFirestoreError(err, OperationType.UPDATE, `workers/${targetWorker.id}`);
        });
      }
    }
  }

  return updated;
}

export function markCommissionPaid(bookingId: string): Booking[] {
  const bookings = getBookings();
  const updated = bookings.map((b) =>
    b.id === bookingId ? { ...b, commission_status: 'paid' as CommissionStatus } : b
  );
  setStored(STORAGE_KEYS.BOOKINGS, updated);

  const updatedBooking = updated.find((b) => b.id === bookingId);
  if (updatedBooking) {
    setDoc(doc(db, 'bookings', bookingId), updatedBooking).catch((err) => {
      handleFirestoreError(err, OperationType.UPDATE, `bookings/${bookingId}`);
    });
  }

  return updated;
}

// --- REVIEWS ---
export function getReviews(): Review[] {
  return getStored(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
}

export function getWorkerReviews(workerId: string): Review[] {
  const reviews = getReviews();
  return reviews.filter((r) => r.worker_id === workerId);
}

export function addReview(reviewData: Omit<Review, 'id' | 'created_at'>): Review {
  const reviews = getReviews();
  const newReview: Review = {
    ...reviewData,
    id: `rev-${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  const updatedReviews = [newReview, ...reviews];
  setStored(STORAGE_KEYS.REVIEWS, updatedReviews);

  setDoc(doc(db, 'reviews', newReview.id), newReview).catch((err) => {
    handleFirestoreError(err, OperationType.CREATE, `reviews/${newReview.id}`);
  });

  // Mark booking as reviewed
  const bookings = getBookings();
  const updatedBookings = bookings.map((b) =>
    b.id === reviewData.booking_id ? { ...b, has_review: true } : b
  );
  setStored(STORAGE_KEYS.BOOKINGS, updatedBookings);

  const updatedBooking = updatedBookings.find((b) => b.id === reviewData.booking_id);
  if (updatedBooking) {
    setDoc(doc(db, 'bookings', reviewData.booking_id), updatedBooking).catch((err) => {
      handleFirestoreError(err, OperationType.UPDATE, `bookings/${reviewData.booking_id}`);
    });
  }

  // Recalculate Worker average_rating & total_reviews
  const workerReviews = updatedReviews.filter((r) => r.worker_id === reviewData.worker_id);
  const total = workerReviews.length;
  const sum = workerReviews.reduce((acc, r) => acc + r.rating, 0);
  const avg = total > 0 ? parseFloat((sum / total).toFixed(1)) : 5.0;

  const workers = getWorkers();
  const updatedWorkers = workers.map((w) =>
    w.id === reviewData.worker_id
      ? { ...w, average_rating: avg, total_reviews: total }
      : w
  );
  setStored(STORAGE_KEYS.WORKERS, updatedWorkers);

  const updatedWorker = updatedWorkers.find((w) => w.id === reviewData.worker_id);
  if (updatedWorker) {
    setDoc(doc(db, 'workers', reviewData.worker_id), updatedWorker).catch((err) => {
      handleFirestoreError(err, OperationType.UPDATE, `workers/${reviewData.worker_id}`);
    });
  }

  return newReview;
}

// --- USER AUTH & CURRENT USER STATE ---
export function getCurrentUser(): User | null {
  return getStored<User | null>(STORAGE_KEYS.CURRENT_USER, {
    id: 'u-c1',
    name: 'Tariq Mehmood',
    phone: '03001112233',
    email: 'customer@nayakaam.pk',
    role: 'customer',
    city: 'Karachi',
    created_at: new Date().toISOString(),
  });
}

export function setCurrentUser(user: User | null): void {
  setStored(STORAGE_KEYS.CURRENT_USER, user);
}

// --- VOICE CALL LOGS & REALTIME CALLS ---
export function getCalls(): CallRecord[] {
  return getStored<CallRecord[]>(STORAGE_KEYS.CALLS, INITIAL_CALLS);
}

export function saveCallRecord(call: CallRecord): CallRecord[] {
  const calls = getCalls();
  const existingIdx = calls.findIndex((c) => c.id === call.id);
  let updated: CallRecord[];
  if (existingIdx >= 0) {
    updated = [...calls];
    updated[existingIdx] = call;
  } else {
    updated = [call, ...calls];
  }
  setStored(STORAGE_KEYS.CALLS, updated);

  // Firestore sync for calls
  setDoc(doc(db, 'calls', call.id), call).catch((err) => {
    handleFirestoreError(err, OperationType.WRITE, `calls/${call.id}`);
  });

  return updated;
}

export function getMissedCallsForUser(userId: string): CallRecord[] {
  const calls = getCalls();
  return calls.filter((c) => c.callee_id === userId && c.status === 'missed');
}

// --- BOOKING CHAT MESSAGES ---
export function getChatMessages(): ChatMessage[] {
  return getStored<ChatMessage[]>(STORAGE_KEYS.CHAT_MESSAGES, INITIAL_CHAT_MESSAGES);
}

export function getBookingChatMessages(bookingId: string): ChatMessage[] {
  const msgs = getChatMessages();
  return msgs.filter((m) => m.booking_id === bookingId).sort((a, b) => a.created_at.localeCompare(b.created_at));
}

export function sendChatMessage(msgData: Omit<ChatMessage, 'id' | 'created_at'>): ChatMessage {
  const msgs = getChatMessages();
  const newMsg: ChatMessage = {
    ...msgData,
    id: `msg-${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  const updated = [...msgs, newMsg];
  setStored(STORAGE_KEYS.CHAT_MESSAGES, updated);

  setDoc(doc(db, 'chats', newMsg.id), newMsg).catch((err) => {
    handleFirestoreError(err, OperationType.CREATE, `chats/${newMsg.id}`);
  });

  return newMsg;
}

// --- FAVORITE WORKERS ---
export function getFavoriteWorkerIds(): string[] {
  return getStored<string[]>(STORAGE_KEYS.FAVORITES, []);
}

export function toggleFavoriteWorker(workerId: string): string[] {
  const favorites = getFavoriteWorkerIds();
  const exists = favorites.includes(workerId);
  const updated = exists ? favorites.filter((id) => id !== workerId) : [...favorites, workerId];
  setStored(STORAGE_KEYS.FAVORITES, updated);
  return updated;
}

// --- DISPUTES / REPORTS ---
export function getDisputeReports(): DisputeReport[] {
  return getStored<DisputeReport[]>(STORAGE_KEYS.DISPUTES, []);
}

export function createDisputeReport(data: Omit<DisputeReport, 'id' | 'created_at' | 'status'>): DisputeReport {
  const reports = getDisputeReports();
  const newReport: DisputeReport = {
    ...data,
    id: `disp-${Date.now()}`,
    status: 'open',
    created_at: new Date().toISOString(),
  };
  const updated = [newReport, ...reports];
  setStored(STORAGE_KEYS.DISPUTES, updated);

  setDoc(doc(db, 'disputes', newReport.id), newReport).catch((err) => {
    handleFirestoreError(err, OperationType.CREATE, `disputes/${newReport.id}`);
  });

  return newReport;
}



