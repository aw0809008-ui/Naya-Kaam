import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number; // 0 to 5
  totalReviews?: number;
  size?: number;
  showText?: boolean;
}

export function StarRating({ rating, totalReviews, size = 16, showText = true }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.4;

  return (
    <div className="inline-flex items-center gap-1.5 font-body">
      <div className="flex items-center text-[#FFC93C]">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= fullStars || (star === fullStars + 1 && hasHalfStar);
          return (
            <Star
              key={star}
              size={size}
              className={`${
                isFilled ? 'fill-[#FFC93C] text-[#FFC93C]' : 'text-[#EAECE7] fill-transparent'
              }`}
            />
          );
        })}
      </div>
      {showText && (
        <span className="text-xs font-bold text-[#0B0E12]">
          {rating.toFixed(1)}
          {typeof totalReviews === 'number' && (
            <span className="text-[#666E7A] font-normal text-xs ml-1">({totalReviews})</span>
          )}
        </span>
      )}
    </div>
  );
}
