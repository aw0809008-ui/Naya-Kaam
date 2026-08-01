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
    <div className="inline-flex items-center gap-1.5">
      <div className="flex items-center text-amber-500">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= fullStars || (star === fullStars + 1 && hasHalfStar);
          return (
            <Star
              key={star}
              size={size}
              className={`${
                isFilled ? 'fill-amber-400 text-amber-500' : 'text-gray-300 fill-gray-100'
              }`}
            />
          );
        })}
      </div>
      {showText && (
        <span className="text-sm font-semibold text-[#1A1A1A]">
          {rating.toFixed(1)}
          {typeof totalReviews === 'number' && (
            <span className="text-gray-500 font-normal text-xs ml-1">({totalReviews})</span>
          )}
        </span>
      )}
    </div>
  );
}
