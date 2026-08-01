'use client';

import { useState } from 'react';
import { Booking } from '@/lib/types';
import { addReview } from '@/lib/store';
import { X, Star, Send, ThumbsUp } from 'lucide-react';

interface ReviewModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted?: () => void;
}

export function ReviewModal({ booking, isOpen, onClose, onReviewSubmitted }: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !booking) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      addReview({
        booking_id: booking.id,
        customer_id: booking.customer_id,
        customer_name: booking.customer_name,
        worker_id: booking.worker_id,
        rating,
        comment,
      });

      setIsSubmitting(false);
      if (onReviewSubmitted) onReviewSubmitted();
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 text-[#1E5AA8] mb-1">
          <ThumbsUp size={20} />
          <h3 className="font-bold text-lg text-[#1A1A1A]">
            Review & Rating Dijiye
          </h3>
        </div>

        <p className="text-xs text-[#4A4A4A] mb-4">
          Aapka feedback <span className="font-bold text-[#1E5AA8]">{booking.worker_name}</span> k kaam ko certify karne mein madad karta hai.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star selector */}
          <div className="text-center py-2 bg-amber-50/50 rounded-xl border border-amber-100">
            <span className="text-xs font-semibold text-gray-600 block mb-1">
              Select Rating (1-5 Stars)
            </span>
            <div className="flex items-center justify-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110 focus:outline-hidden"
                >
                  <Star
                    size={28}
                    className={`${
                      star <= (hoverRating || rating)
                        ? 'fill-amber-400 text-amber-500'
                        : 'text-gray-300 fill-gray-100'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-bold text-amber-700 mt-1 block">
              {rating === 5 && 'Outstanding Work (Zabardast!)'}
              {rating === 4 && 'Very Good Service (Accha Kaam)'}
              {rating === 3 && 'Average (Theek tha)'}
              {rating === 2 && 'Below Expectation'}
              {rating === 1 && 'Poor Experience'}
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
              Aapka Comment / Feedback *
            </label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Kaam kaisa laga? Punctuality, safai aur pricing k baray mein batayein..."
              className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#1E5AA8]"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !comment.trim()}
            className="w-full py-3 rounded-xl bg-[#F5820D] hover:bg-[#D97109] disabled:opacity-50 text-white font-bold text-xs transition shadow-md flex items-center justify-center gap-2"
          >
            {isSubmitting ? 'Submit Ho Raha Hai...' : 'Submit Review'}
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
}
