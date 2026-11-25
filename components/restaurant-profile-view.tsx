"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { StarRating } from "@/components/star-rating";
import type { RestaurantProfile, Review } from "@/lib/restaurants";

type LoadState =
  | { status: "loading" }
  | { status: "ready"; data: RestaurantProfile }
  | { status: "not-found" }
  | { status: "error" };

type RestaurantProfileViewProps = {
  restaurantId: string;
};

function formatReviewDate(createdAt: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(createdAt));
}

function ProfileSkeleton() {
  return (
    <div className="animate-pulse pt-4 sm:pt-8" aria-hidden="true">
      <div className="h-2.5 w-28 rounded bg-line" />
      <div className="mt-7 h-12 w-4/5 rounded bg-line" />
      <div className="mt-4 h-3 w-32 rounded bg-line" />
      <div className="mt-10 flex items-end gap-5 border-y border-line py-8">
        <div className="h-20 w-24 rounded bg-line" />
        <div className="mb-2 h-8 w-24 rounded bg-line" />
      </div>
      <div className="mt-10 h-40 rounded-soft bg-line/70" />
      <div className="mt-10 h-3 w-24 rounded bg-line" />
      <div className="mt-6 h-20 rounded bg-line/70" />
    </div>
  );
}

function EmptyState() {
  return (
    <section className="mt-10 rounded-soft border border-line bg-white/55 px-6 py-10 text-center">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
        First seat
      </p>
      <h2 className="mt-4 font-display text-3xl tracking-tight">
        No notes yet.
      </h2>
      <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-muted">
        This table is waiting for its first honest word. Tell everyone what the
        kitchen is getting right.
      </p>
    </section>
  );
}

function ReviewItem({ review }: { review: Review }) {
  return (
    <li className="border-b border-line py-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <StarRating rating={review.rating} />
          <span className="text-[11px] text-muted">{review.rating}/5</span>
        </div>
        <time
          dateTime={review.createdAt}
          className="text-[11px] uppercase tracking-[0.12em] text-muted"
        >
          {formatReviewDate(review.createdAt)}
        </time>
      </div>
      <p className="mt-3 text-[15px] leading-7 text-ink/85">{review.comment}</p>
    </li>
  );
}

export function RestaurantProfileView({
  restaurantId,
}: RestaurantProfileViewProps) {
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    setState({ status: "loading" });

    async function loadRestaurant() {
      try {
        const response = await fetch(`/api/restaurants/${restaurantId}`, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (response.status === 404) {
          setState({ status: "not-found" });
          return;
        }

        if (!response.ok) {
          throw new Error("Could not load restaurant");
        }

        const data = (await response.json()) as RestaurantProfile;
        setState({ status: "ready", data });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setState({ status: "error" });
      }
    }

    loadRestaurant();

    return () => controller.abort();
  }, [restaurantId, reloadKey]);

  if (state.status === "loading") {
    return <ProfileSkeleton />;
  }

  if (state.status === "not-found") {
    return (
      <div className="pt-16 sm:pt-24">
        <p className="eyebrow">404</p>
        <h1 className="mt-4 max-w-md font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl">
          This table isn&apos;t set.
        </h1>
        <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-muted">
          We couldn&apos;t find that restaurant. The kitchen is still open
          though.
        </p>
        <Link
          href="/restaurant/1"
          className="mt-8 inline-flex rounded-soft bg-ink px-5 py-3 text-sm font-semibold text-paper transition-colors hover:bg-accent"
        >
          Visit Ludhiana Burrito
        </Link>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="pt-16 sm:pt-24">
        <p className="eyebrow">A small pause</p>
        <h1 className="mt-4 max-w-md font-display text-4xl leading-[1.08] tracking-tight">
          The kitchen didn&apos;t answer.
        </h1>
        <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-muted">
          We couldn&apos;t load this restaurant right now. Please try again in a
          moment.
        </p>
        <button
          type="button"
          onClick={() => setReloadKey((key) => key + 1)}
          className="mt-8 rounded-soft bg-ink px-5 py-3 text-sm font-semibold text-paper transition-colors hover:bg-accent"
        >
          Try again
        </button>
      </div>
    );
  }

  const { data } = state;
  const hasReviews = data.totalReviews > 0 && data.latestReview !== null;

  return (
    <div className="pt-4 sm:pt-8">
      <div className="flex items-center justify-between gap-4">
        <p className="eyebrow">Restaurant profile</p>
        <p className="text-[11px] uppercase tracking-[0.14em] text-muted">
          Est. notes
        </p>
      </div>

      <header className="mt-6">
        <h1 className="font-display text-[44px] leading-[0.98] tracking-[-0.035em] text-ink sm:text-[54px]">
          {data.name}
        </h1>
        <p className="mt-4 text-sm text-muted">
          {data.cuisine}
          <span aria-hidden="true" className="mx-2 text-line">
            /
          </span>
          {data.area}
        </p>
      </header>

      <section
        aria-label="Rating summary"
        className="mt-9 flex items-end justify-between border-y border-line py-7"
      >
        <div className="flex items-end gap-4">
          <span className="font-display text-[82px] leading-[0.72] tracking-[-0.055em] text-ink sm:text-[98px]">
            {data.averageRating === null ? "\u2014" : data.averageRating}
          </span>
          <div className="pb-1.5">
            <p className="eyebrow">Average</p>
            <p className="mt-2 text-sm text-muted">
              {data.totalReviews}{" "}
              {data.totalReviews === 1 ? "review" : "reviews"}
            </p>
          </div>
        </div>
        <p className="hidden pb-2 text-[10px] uppercase tracking-[0.18em] text-muted sm:block">
          Out of 5
        </p>
      </section>

      {hasReviews ? (
        <section className="mt-10" aria-labelledby="latest-review-heading">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="latest-review-heading" className="eyebrow">
              Latest note
            </h2>
            <time
              dateTime={data.latestReview!.createdAt}
              className="text-[11px] uppercase tracking-[0.12em] text-muted"
            >
              {formatReviewDate(data.latestReview!.createdAt)}
            </time>
          </div>

          <article className="relative mt-3 rounded-soft border border-line bg-white/60 px-5 py-6 sm:px-7 sm:py-7">
            <span
              aria-hidden="true"
              className="absolute right-5 top-5 h-2 w-2 rounded-full bg-accent"
            />
            <div className="flex items-center gap-3">
              <StarRating rating={data.latestReview!.rating} />
              <span className="text-[11px] text-muted">
                {data.latestReview!.rating}/5
              </span>
            </div>
            <blockquote className="mt-5 pr-4 font-display text-[24px] leading-[1.38] tracking-[-0.015em] text-ink sm:text-[27px]">
              {data.latestReview!.comment}
            </blockquote>
          </article>
        </section>
      ) : (
        <EmptyState />
      )}

      {data.reviews.length > 0 ? (
        <section className="mt-11" aria-labelledby="older-reviews-heading">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="older-reviews-heading" className="eyebrow">
              Earlier notes
            </h2>
            <span className="text-[10px] uppercase tracking-[0.16em] text-muted">
              Newest first
            </span>
          </div>

          <ul className="mt-3 border-t border-line">
            {data.reviews.map((review) => (
              <ReviewItem key={review.id} review={review} />
            ))}
          </ul>
        </section>
      ) : null}

      <Link
        href={`/review/${restaurantId}`}
        className="group mt-10 flex items-center justify-between gap-6 rounded-soft bg-ink px-5 py-4 text-paper transition-colors hover:bg-accent sm:px-6 sm:py-5"
      >
        <span>
          <span className="block text-sm font-semibold">Write a review</span>
          <span className="mt-1 block text-[10px] uppercase tracking-[0.17em] text-paper/60">
            Tell us what you thought
          </span>
        </span>
        <span
          aria-hidden="true"
          className="text-xl transition-transform group-hover:translate-x-1"
        >
          &rarr;
        </span>
      </Link>
    </div>
  );
}
