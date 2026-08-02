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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in font-body text-[#0B0E12]">
      <div className="bg-white rounded-[26px] max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#EAECE7] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#666E7A] hover:text-[#0B0E12] p-2 rounded-full hover:bg-[#F7F8F5] transition"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2.5 text-[#0B0E12] mb-1">
          <div className="w-8 h-8 rounded-xl bg-[#0B0E12] text-[#39E07A] flex items-center justify-center -rotate-6">
            <ThumbsUp size={18} />
          </div>
          <h3 className="font-heading font-extrabold text-lg text-[#0B0E12]">
            Review & Rating Dijiye
          </h3>
        </div>

        <p className="text-xs text-[#666E7A] font-medium mb-4">
          Aapka feedback <span className="font-bold text-[#0B0E12]">{booking.worker_name}</span> k kaam ko certify karne mein madad karta hai.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star selector */}
          <div className="text-center py-3 bg-[#F7F8F5] rounded-2xl border border-[#EAECE7]">
            <span className="text-xs font-bold text-[#666E7A] block mb-1">
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
                  className="p-1 transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    size={28}
                    className={`${
                      star <= (hoverRating || rating)
                        ? 'fill-[#FFC93C] text-[#FFC93C]'
                        : 'text-[#EAECE7] fill-transparent'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-extrabold text-[#0B0E12] mt-1 block">
              {rating === 5 && 'Outstanding Work (Zabardast!)'}
              {rating === 4 && 'Very Good Service (Accha Kaam)'}
              {rating === 3 && 'Average (Theek tha)'}
              {rating === 2 && 'Below Expectation'}
              {rating === 1 && 'Poor Experience'}
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0B0E12] mb-1">
              Aapka Comment / Feedback *
            </label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Kaam kaisa laga? Punctuality, safai aur pricing k baray mein batayein..."
              className="w-full p-3 text-xs rounded-xl border border-[#EAECE7] focus:outline-none focus:border-[#0B0E12] bg-[#F7F8F5] font-medium text-[#0B0E12]"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !comment.trim()}
            className="btn btn-lime w-full py-3.5 text-xs font-extrabold flex items-center justify-center gap-2"
          >
            {isSubmitting ? 'Submit Ho Raha Hai...' : 'Submit Review'}
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
}
