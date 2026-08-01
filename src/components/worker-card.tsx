import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Briefcase, ChevronRight } from 'lucide-react';
import { Worker } from '@/lib/types';
import { VerifiedBadge } from './verified-badge';
import { StarRating } from './star-rating';
import { CategoryIcon } from './category-icon';

interface WorkerCardProps {
  worker: Worker;
  onBookClick?: (worker: Worker) => void;
}

export function WorkerCard({ worker, onBookClick }: WorkerCardProps) {
  return (
    <div className="bg-white rounded-[12px] border border-gray-100 p-5 card-shadow card-shadow-hover flex flex-col justify-between h-full relative group">
      <div>
        {/* Availability tag & Category badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1E5AA8]/8 text-[#1E5AA8] text-xs font-semibold">
            <CategoryIcon name={worker.category} size={14} />
            {worker.category}
          </span>
          <span
            className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
              worker.is_available
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}
          >
            {worker.is_available ? 'Available Now' : 'Busy'}
          </span>
        </div>

        {/* Worker Header: Photo, Name, Verified */}
        <div className="flex items-start gap-3.5 mb-3">
          <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-gray-100 shrink-0 bg-gray-100 shadow-xs">
            <Image
              src={worker.profile_photo_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200'}
              alt={worker.name}
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-bold text-base text-[#1A1A1A] truncate group-hover:text-[#1E5AA8] transition">
                {worker.name}
              </h3>
              {worker.is_verified && <VerifiedBadge size={15} showText={false} />}
            </div>
            <p className="text-xs text-[#4A4A4A] flex items-center gap-1 mt-1">
              <MapPin size={13} className="text-gray-400 shrink-0" />
              <span className="truncate">
                {worker.area ? `${worker.area}, ` : ''}{worker.city}
              </span>
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {worker.years_experience} years experience
            </p>
          </div>
        </div>

        {/* Rating summary */}
        <div className="my-3 py-2 border-y border-gray-100 flex items-center justify-between text-xs">
          <StarRating rating={worker.average_rating} totalReviews={worker.total_reviews} size={15} />
          <span className="font-semibold text-gray-700">
            {worker.total_reviews > 0 ? `${worker.average_rating} Score` : 'New'}
          </span>
        </div>

        {/* Short Bio snippet */}
        <p className="text-xs text-[#4A4A4A] line-clamp-2 leading-relaxed mb-4">
          {worker.bio}
        </p>
      </div>

      {/* Footer: Price & View Profile CTA */}
      <div className="pt-2 border-t border-gray-50 flex items-center justify-between gap-2 mt-auto">
        <div>
          <span className="text-[10px] uppercase font-semibold text-gray-400 block tracking-wider">
            Starting Rate
          </span>
          <span className="text-base font-bold text-[#1E5AA8]">
            Rs. {worker.rate_amount.toLocaleString()}
            <span className="text-xs font-normal text-gray-500 ml-0.5">
              /{worker.rate_type === 'hourly' ? 'hr' : 'job'}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onBookClick && (
            <button
              onClick={() => onBookClick(worker)}
              className="px-3 py-1.5 rounded-xl bg-[#F5820D] hover:bg-[#D97109] text-white text-xs font-bold transition shadow-xs"
            >
              Book
            </button>
          )}
          <Link
            href={`/worker/${worker.id}`}
            className="px-3 py-1.5 rounded-xl border border-[#1E5AA8] text-[#1E5AA8] hover:bg-[#1E5AA8] hover:text-white text-xs font-semibold transition flex items-center gap-1"
          >
            Profile
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
