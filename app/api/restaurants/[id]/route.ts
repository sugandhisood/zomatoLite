import { NextResponse } from "next/server";
import { getRestaurantProfile } from "@/lib/restaurants";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const restaurantId = Number(id);

  if (!Number.isInteger(restaurantId) || restaurantId <= 0) {
    return NextResponse.json(
      { error: "Restaurant not found." },
      { status: 404 },
    );
  }

  try {
    const restaurant = await getRestaurantProfile(restaurantId);

    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(restaurant, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Failed to load restaurant", error);

    return NextResponse.json(
      { error: "Unable to load this restaurant right now." },
      { status: 500 },
    );
  }
}
