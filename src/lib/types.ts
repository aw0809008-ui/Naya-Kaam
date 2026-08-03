export type UserRole = 'customer' | 'worker' | 'admin';

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  city: string;
  created_at: string;
}

export type RateType = 'hourly' | 'per-job' | 'job';

export interface Worker {
  id: string;
  user_id?: string;
  name: string;
  phone: string;
  email?: string;
  cnic_number: string;
  cnic_photo_url?: string;
  cnic_front_url?: string;
  cnic_back_url?: string;
  profile_photo_url: string;
  category: string;
  bio: string;
  trust_summary?: string;
  years_experience: number;
  rate_type: RateType;
  rate_amount: number; // PKR
  city: string;
  area: string;
  is_verified: boolean;
  is_available: boolean;
  is_suspended?: boolean;
  average_rating: number;
  total_reviews: number;
  completed_jobs?: number;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  icon_name: string;
  description: string;
}

export type BookingStatus = 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled';
export type CommissionStatus = 'pending' | 'paid';
export type TimePreference = 'Morning (9am - 12pm)' | 'Afternoon (12pm - 4pm)' | 'Evening (4pm - 8pm)';

export interface Booking {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  worker_id: string;
  worker_name: string;
  worker_photo?: string;
  worker_phone?: string;
  category: string;
  date_needed: string;
  time_preference: TimePreference;
  address: string;
  description: string;
  status: BookingStatus;
  booking_amount: number;
  commission_amount: number;
  commission_status: CommissionStatus;
  created_at: string;
  completed_at?: string;
  has_review?: boolean;
}

export interface Review {
  id: string;
  booking_id: string;
  customer_id: string;
  customer_name: string;
  worker_id: string;
  rating: number; // 1-5
  comment: string;
  created_at: string;
}

export interface SmartSearchParsed {
  category?: string;
  city?: string;
  area?: string;
  urgency?: string;
}

export type CallStatus = 'offering' | 'connected' | 'ended' | 'declined' | 'missed';

export interface CallRecord {
  id: string;
  booking_id: string;
  caller_id: string;
  caller_name: string;
  caller_photo?: string;
  caller_role: 'customer' | 'worker';
  callee_id: string;
  callee_name: string;
  callee_photo?: string;
  callee_role: 'customer' | 'worker';
  category?: string;
  status: CallStatus;
  offer?: { type: 'answer' | 'offer' | 'pranswer' | 'rollback'; sdp?: string };
  answer?: { type: 'answer' | 'offer' | 'pranswer' | 'rollback'; sdp?: string };
  caller_candidates?: Array<{ candidate: string; sdpMid: string | null; sdpMLineIndex: number | null }>;
  callee_candidates?: Array<{ candidate: string; sdpMid: string | null; sdpMLineIndex: number | null }>;
  duration_seconds: number;
  created_at: string;
  ended_at?: string;
}

export interface ChatMessage {
  id: string;
  booking_id: string;
  sender_id: string;
  sender_name: string;
  sender_role: 'customer' | 'worker';
  text: string;
  created_at: string;
}

export interface DisputeReport {
  id: string;
  booking_id: string;
  reporter_id?: string;
  reporter_name?: string;
  reporter_role?: 'customer' | 'worker';
  reported_user_id?: string;
  reported_user_name?: string;
  complainant_id?: string;
  complainant_role?: 'customer' | 'worker';
  target_worker_id?: string;
  issue_category: string;
  description?: string;
  reason?: string;
  evidence_photo_url?: string;
  status: 'open' | 'under_review' | 'investigating' | 'resolved' | 'dismissed' | 'resolved_refunded' | 'resolved_no_action' | 'resolved_worker_warned';
  created_at: string;
  resolved_at?: string;
  resolution_notes?: string;
}
