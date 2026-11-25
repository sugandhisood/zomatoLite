import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReviewForm } from "@/components/review-form";
import { getRestaurantSummary } from "@/lib/restaurants";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Write a review",
};

type ReviewPageProps = {
  params: Promise<{ restaurantId: string }>;
};

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { restaurantId } = await params;
  const id = Number(restaurantId);

  if (!Number.isInteger(id) || id <= 0) {
    notFound();
  }

  const restaurant = await getRestaurantSummary(id);

  if (!restaurant) {
    notFound();
  }

  return (
    <div className="pt-4 sm:pt-8">
      <Link
        href={`/restaurant/${restaurant.id}`}
        className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted transition-colors hover:text-accent"
      >
        <span aria-hidden="true">&larr;</span>
        Back to restaurant
      </Link>

      <header className="mt-8 border-b border-line pb-7">
        <p className="eyebrow">Your note</p>
        <h1 className="mt-3 font-display text-[38px] leading-[1.04] tracking-[-0.035em] sm:text-[46px]">
          Review <span className="italic">{restaurant.name}</span>
        </h1>
        <p className="mt-3 text-sm text-muted">
          {restaurant.cuisine}
          <span aria-hidden="true" className="mx-2 text-line">
            /
          </span>
          {restaurant.area}
        </p>
      </header>

      <ReviewForm
        restaurantId={restaurant.id}
        restaurantName={restaurant.name}
      />
    </div>
  );
}
