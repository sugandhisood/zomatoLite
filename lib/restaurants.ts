import { sql } from "@/lib/db";

export type RestaurantSummary = {
  id: number;
  name: string;
  cuisine: string;
  area: string;
};

export type Review = {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
};

export type RestaurantProfile = {
  name: string;
  cuisine: string;
  area: string;
  averageRating: number | null;
  totalReviews: number;
  latestReview: Review | null;
  reviews: Review[];
};

type RestaurantRow = RestaurantSummary;

type ReviewRow = {
  id: number;
  rating: number;
  comment: string;
  created_at: string | Date;
};

type StatsRow = {
  average_rating: number | string | null;
  total_reviews: number | string;
};

function toReview(row: ReviewRow): Review {
  return {
    id: Number(row.id),
    rating: Number(row.rating),
    comment: row.comment,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

export async function getRestaurantSummary(
  id: number,
): Promise<RestaurantSummary | null> {
  const rows = (await sql`
    SELECT id, name, cuisine, area
    FROM restaurants
    WHERE id = ${id}
  `) as RestaurantRow[];

  return rows[0] ?? null;
}

export async function getRestaurantProfile(
  id: number,
): Promise<RestaurantProfile | null> {
  const restaurant = await getRestaurantSummary(id);

  if (!restaurant) {
    return null;
  }

  const [statsResult, reviewResult] = await Promise.all([
    sql`
      SELECT
        ROUND(AVG(rating)::numeric, 1)::float8 AS average_rating,
        COUNT(*)::int AS total_reviews
      FROM reviews
      WHERE restaurant_id = ${id}
    `,
    sql`
      SELECT id, rating, comment, created_at
      FROM reviews
      WHERE restaurant_id = ${id}
      ORDER BY created_at DESC, id DESC
    `,
  ]);

  const stats = statsResult[0] as StatsRow;
  const orderedReviews = (reviewResult as ReviewRow[]).map(toReview);

  return {
    name: restaurant.name,
    cuisine: restaurant.cuisine,
    area: restaurant.area,
    averageRating:
      stats.average_rating === null ? null : Number(stats.average_rating),
    totalReviews: Number(stats.total_reviews),
    latestReview: orderedReviews[0] ?? null,
    reviews: orderedReviews.slice(1),
  };
}
