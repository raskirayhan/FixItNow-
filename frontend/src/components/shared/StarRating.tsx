import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

const SIZE_MAP = {
  sm: "h-3.5 w-3.5",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

export default function StarRating({
  rating,
  maxStars = 5,
  size = "md",
  interactive = false,
  onChange,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const displayRating = hoverRating || rating;

  const handleClick = (index: number) => {
    if (interactive && onChange) {
      onChange(index);
    }
  };

  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`${rating} out of ${maxStars} stars`}>
      {Array.from({ length: maxStars }, (_, i) => {
        const starIndex = i + 1;
        const filled = starIndex <= Math.floor(displayRating);
        const halfFilled = !filled && starIndex - 0.5 <= displayRating;

        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => handleClick(starIndex)}
            onMouseEnter={() => interactive && setHoverRating(starIndex)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={cn(
              "relative shrink-0",
              interactive && "cursor-pointer",
              !interactive && "cursor-default"
            )}
          >
            <Star
              className={cn(
                SIZE_MAP[size],
                "transition-colors",
                filled
                  ? "fill-yellow-400 text-yellow-400"
                  : halfFilled
                    ? "fill-yellow-400/50 text-yellow-400"
                    : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
