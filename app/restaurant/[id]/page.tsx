import type { Metadata } from "next";
import { RestaurantProfileView } from "@/components/restaurant-profile-view";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Restaurant profile",
};

type RestaurantPageProps = {
  params: Promise<{ id: string }>;
};

export default async function RestaurantPage({ params }: RestaurantPageProps) {
  const { id } = await params;

  return <RestaurantProfileView restaurantId={id} />;
}
