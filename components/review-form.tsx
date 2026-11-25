"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { StarIcon } from "@/components/star-icon";

const STAR_VALUES = [1, 2, 3, 4, 5] as const;

const RATING_LABELS: Record<number, string> = {
  1: "Not for me",
  2: "Could be better",
  3: "Decent",
  4: "Really good",
  5: "Unforgettable",
};

type ReviewFormProps = {
  restaurantId: number;
  restaurantName: string;
};

type ErrorResponse = {
  error?: unknown;
};

export function ReviewForm({
  restaurantId,
  restaurantName,
}: ReviewFormProps) {
  const router = useRouter();
  const [rating, setRating] = useState<number | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const activeRating = hoveredRating ?? rating ?? 0;
  const canSubmit =
    rating !== null && comment.trim().length > 0 && !submitting;

  function chooseRating(value: number) {
    setRating(value);
    setError(null);
  }

  function updateComment(value: string) {
    setComment(value);
    setError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (rating === null || !canSubmit) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          restaurantId,
          rating,
          comment: comment.trim(),
        }),
      });

      const data = (await response
        .json()
        .catch(() => null)) as ErrorResponse | null;

      if (response.status === 201) {
        router.push(`/restaurant/${restaurantId}`);
        router.refresh();
        return;
      }

      setError(
        typeof data?.error === "string"
          ? data.error
          : "Something went wrong. Please try again.",
      );
    } catch {
      setError("We couldn't reach the kitchen. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8">
      <fieldset>
        <legend className="eyebrow">Your rating</legend>

        <div
          className="mt-4 flex items-center gap-1.5"
          onMouseLeave={() => setHoveredRating(null)}
        >
          {STAR_VALUES.map((value) => (
            <label
              key={value}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredRating(value)}
            >
              <input
                type="radio"
                name="rating"
                value={value}
                checked={rating === value}
                onChange={() => chooseRating(value)}
                className="peer sr-only"
              />
              <span
                className={`block rounded-sm p-0.5 transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent ${
                  value <= activeRating ? "text-accent" : "text-line"
                }`}
              >
                <StarIcon
                  filled={value <= activeRating}
                  className="h-10 w-10 sm:h-11 sm:w-11"
                />
              </span>
              <span className="sr-only">
                {value} {value === 1 ? "star" : "stars"}
              </span>
            </label>
          ))}
        </div>

        <p
          aria-live="polite"
          className="mt-2 min-h-5 text-sm text-muted"
        >
          {rating === null
            ? "Pick a rating from 1 to 5."
            : RATING_LABELS[rating]}
        </p>
      </fieldset>

      <div className="mt-8">
        <div className="flex items-baseline justify-between gap-4">
          <label htmlFor="comment" className="eyebrow">
            Your note
          </label>
          <span className="text-[10px] uppercase tracking-[0.14em] text-muted">
            About {restaurantName}
          </span>
        </div>
        <textarea
          id="comment"
          name="comment"
          rows={6}
          value={comment}
          onChange={(event) => updateComment(event.target.value)}
          placeholder="What stood out? The food, the service, the little details..."
          className="mt-3 w-full resize-none rounded-soft border border-line bg-white/55 px-4 py-4 text-[15px] leading-7 text-ink placeholder:text-muted/70 transition-colors focus:border-accent focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        />
      </div>

      {error ? (
        <div
          role="alert"
          className="mt-5 rounded-soft border border-accent/30 bg-accent-soft px-4 py-3 text-sm leading-6 text-accent"
        >
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={!canSubmit}
        className="mt-6 w-full rounded-soft bg-ink px-6 py-4 text-sm font-semibold text-paper transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
      >
        {submitting ? "Posting your note..." : "Post review"}
      </button>

      <p className="mt-4 text-center text-[11px] leading-5 text-muted">
        Notes are posted as written and cannot be edited later.
      </p>
    </form>
  );
}
