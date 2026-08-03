'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Briefcase, ChevronRight, Heart } from 'lucide-react';
import { Worker } from '@/lib/types';
import { VerifiedBadge } from './verified-badge';
import { StarRating } from './star-rating';
import { CategoryIcon } from './category-icon';
import { getFavoriteWorkerIds, toggleFavoriteWorker } from '@/lib/store';

interface WorkerCardProps {
  worker: Worker;
  onBookClick?: (worker: Worker) => void;
}

export function WorkerCard({ worker, onBookClick }: WorkerCardProps) {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  useEffect(() => {
    const favs = getFavoriteWorkerIds();
    setIsFavorite(favs.includes(worker.id));
  }, [worker.id]);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = toggleFavoriteWorker(worker.id);
    setIsFavorite(updated.includes(worker.id));
  };

  return (
    <div className="bg-white rounded-[26px] border border-[#EAECE7] p-6 hover:-translate-y-1.5 hover:shadow-[0_16px_36px_rgba(11,14,18,0.08)] transition-all duration-200 flex flex-col justify-between h-full relative group">
      <div>
        {/* Availability tag & Category badge */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-[#0B0E12] text-xs font-bold border border-gray-200">
            <span className="w-5 h-5 rounded-full bg-[#0B0E12] text-[#39E07A] flex items-center justify-center shrink-0">
              <CategoryIcon name={worker.category} size={12} />
            </span>
            {worker.category}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleFavorite}
              className={`p-1.5 rounded-full border transition ${
                isFavorite
                  ? 'bg-rose-50 border-rose-200 text-rose-500'
                  : 'bg-gray-50 border-gray-200 text-gray-400 hover:text-rose-500 hover:bg-rose-50'
              }`}
              title={isFavorite ? 'Remove from Favorites' : 'Save to Favorites'}
            >
              <Heart size={14} className={isFavorite ? 'fill-rose-500' : ''} />
            </button>

            <span
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${
                worker.is_available
                  ? 'bg-[#D6F5E3] text-[#1FB863]'
                  : 'bg-[#FFE3EC] text-[#FF5F82]'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${worker.is_available ? 'bg-[#1FB863] animate-pulse' : 'bg-[#FF5F82]'}`} />
              {worker.is_available ? 'Available' : 'Busy'}
            </span>
          </div>
        </div>

        {/* Worker Header: Photo, Name, Verified */}
        <div className="flex items-start gap-3.5 mb-4">
          <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#0B0E12] shrink-0 bg-gray-100 shadow-xs">
            <Image
              src={worker.profile_photo_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200'}
              alt={worker.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-heading font-extrabold text-base text-[#0B0E12] truncate group-hover:text-[#1FB863] transition-colors">
                {worker.name}
              </h3>
              {worker.is_verified && <VerifiedBadge size={16} showText={false} />}
            </div>
            <p className="text-xs text-[#666E7A] flex items-center gap-1 mt-1 font-body font-medium">
              <MapPin size={13} className="text-[#0B0E12] shrink-0" />
              <span className="truncate">
                {worker.area ? `${worker.area}, ` : ''}{worker.city}
              </span>
            </p>
            <p className="text-xs text-[#666E7A] mt-0.5 font-body flex items-center gap-1 font-medium">
              <Briefcase size={12} className="text-[#666E7A]" />
              <span>{worker.years_experience} yrs experience</span>
            </p>
          </div>
        </div>

        {/* Rating summary */}
        <div className="my-3.5 py-2.5 border-y border-[#EAECE7] flex items-center justify-between text-xs bg-[#F7F8F5] px-3 rounded-xl">
          <StarRating rating={worker.average_rating} totalReviews={worker.total_reviews} size={14} />
          <span className="font-bold text-[#0B0E12]">
            {worker.total_reviews > 0 ? `${worker.average_rating} (${worker.total_reviews})` : 'New'}
          </span>
        </div>

        {/* Short Bio snippet */}
        <p className="text-xs text-[#666E7A] line-clamp-2 leading-relaxed mb-5 font-body font-medium">
          {worker.bio}
        </p>
      </div>

      {/* Footer: Price & View Profile CTA */}
      <div className="pt-3 border-t border-[#EAECE7] flex items-center justify-between gap-2 mt-auto">
        <div>
          <span className="text-[10px] uppercase font-bold text-[#666E7A] block tracking-wider">
            Rate
          </span>
          <span className="text-base font-extrabold text-[#0B0E12] font-heading">
            Rs. {worker.rate_amount.toLocaleString()}
            <span className="text-xs font-normal text-[#666E7A] ml-0.5 font-body">
              /{worker.rate_type === 'hourly' ? 'hr' : 'job'}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onBookClick && (
            <button
              onClick={() => onBookClick(worker)}
              className="btn btn-lime text-xs py-2 px-3.5 font-bold"
            >
              Book
            </button>
          )}
          <Link
            href={`/worker/${worker.id}`}
            className="btn btn-secondary text-xs py-2 px-3 flex items-center gap-1 font-bold"
          >
            Profile
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
