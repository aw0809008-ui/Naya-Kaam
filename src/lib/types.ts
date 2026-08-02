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
  skills?: string[];
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
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  icon_name: string;
  description: string;
}

export type BookingStatus = 'pending' | 'accepted' | 'completed' | 'cancelled';
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
