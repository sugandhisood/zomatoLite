import { StarIcon } from "@/components/star-icon";

type StarRatingProps = {
  rating: number;
  className?: string;
};

export function StarRating({ rating, className = "" }: StarRatingProps) {
  return (
    <span
      role="img"
      aria-label={`${rating} out of 5 stars`}
      className={`inline-flex items-center gap-1 text-accent ${className}`}
    >
      {[1, 2, 3, 4, 5].map((value) => (
        <StarIcon
          key={value}
          filled={value <= rating}
          className="h-3.5 w-3.5"
        />
      ))}
    </span>
  );
}
