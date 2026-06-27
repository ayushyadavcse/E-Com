import { Star } from 'lucide-react';

type StarRatingProps = {
  rating: number;
  size?: number;
  showValue?: boolean;
  count?: number;
};

export function StarRating({ rating, size = 14, showValue = false, count }: StarRatingProps) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = rating >= star - 0.25;
          const half = !filled && rating >= star - 0.75;
          return (
            <Star
              key={star}
              style={{ width: size, height: size }}
              className={
                filled
                  ? 'fill-amber-400 text-amber-400'
                  : half
                    ? 'fill-amber-200 text-amber-400'
                    : 'fill-stone-200 text-stone-200'
              }
            />
          );
        })}
      </div>
      {showValue && (
        <span className="text-xs font-medium text-stone-600">
          {rating.toFixed(1)}
          {count !== undefined && <span className="text-stone-400"> ({count})</span>}
        </span>
      )}
    </div>
  );
}
