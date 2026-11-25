import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

type ReviewPayload = {
  restaurantId?: unknown;
  rating?: unknown;
  comment?: unknown;
};

type InsertedReview = {
  id: number;
};

export async function POST(request: Request) {
  let payload: ReviewPayload;

  try {
    const body: unknown = await request.json();

    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      return NextResponse.json(
        { error: "Request body must be a JSON object." },
        { status: 400 },
      );
    }

    payload = body as ReviewPayload;
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  const { restaurantId, rating, comment } = payload;

  if (
    typeof rating !== "number" ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    return NextResponse.json(
      { error: "Rating must be a whole number from 1 to 5." },
      { status: 400 },
    );
  }

  if (typeof comment !== "string" || comment.trim().length === 0) {
    return NextResponse.json(
      { error: "Please write a comment before submitting." },
      { status: 400 },
    );
  }

  if (
    typeof restaurantId !== "number" ||
    !Number.isInteger(restaurantId) ||
    restaurantId <= 0
  ) {
    return NextResponse.json(
      { error: "Restaurant not found." },
      { status: 400 },
    );
  }

  try {
    const restaurantRows = (await sql`
      SELECT id
      FROM restaurants
      WHERE id = ${restaurantId}
    `) as { id: number }[];

    if (!restaurantRows[0]) {
      return NextResponse.json(
        { error: "Restaurant not found." },
        { status: 400 },
      );
    }

    const inserted = (await sql`
      INSERT INTO reviews (restaurant_id, rating, comment)
      VALUES (${restaurantId}, ${rating}, ${comment.trim()})
      RETURNING id
    `) as InsertedReview[];

    return NextResponse.json(
      { success: true, reviewId: inserted[0].id },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to create review", error);

    return NextResponse.json(
      { error: "Unable to save your review right now." },
      { status: 500 },
    );
  }
}
