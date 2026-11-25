# Zomato Lite

A focused restaurant profile and review app built with Next.js 15, TypeScript,
Tailwind CSS, and Neon Postgres.

Two screens. Two API endpoints. Two tables. No stored averages, no ORMs, and no
client-side math.

## Stack

- Next.js 15 (App Router, TypeScript)
- Tailwind CSS
- Neon Postgres via `@neondatabase/serverless`
- Raw SQL
- Vercel

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` from the example and add your Neon connection string:

   ```bash
   cp .env.example .env.local
   ```

   ```env
   DATABASE_URL=postgresql://user:password@host/database?sslmode=require
   ```

3. Create the tables and seed data:

   ```bash
   npm run db:init
   ```

   `db/schema.sql` resets both tables before seeding, so run this only when you
   want a fresh local dataset.

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

## Routes

| Route | Purpose |
| --- | --- |
| `/restaurant/1` | Restaurant profile, computed rating, latest review, older reviews |
| `/review/1` | Write a review for restaurant `1` |
| `GET /api/restaurants/1` | Screen-shaped restaurant profile payload |
| `POST /api/reviews` | Validate and persist a review |

The root route redirects to `/restaurant/1`; there is intentionally no
restaurant directory or search page.

## API contract

### `POST /api/reviews`

```json
{
  "restaurantId": 1,
  "rating": 4,
  "comment": "Good, but slow service"
}
```

Validation runs in this order and returns `400` with a plain-English `error`
message on the first failure:

1. `rating` is an integer from 1 to 5.
2. `comment` is a non-empty string after trimming.
3. `restaurantId` belongs to an existing restaurant.

Success returns `201 Created`:

```json
{ "success": true, "reviewId": 104 }
```

### `GET /api/restaurants/[id]`

Returns `404` when the restaurant does not exist. Otherwise:

```json
{
  "name": "Ludhiana Burrito",
  "cuisine": "Indian",
  "area": "Sector 32",
  "averageRating": 4.3,
  "totalReviews": 3,
  "latestReview": {
    "id": 103,
    "rating": 4,
    "comment": "Solid. Would repeat.",
    "createdAt": "2026-08-20T21:30:00.000Z"
  },
  "reviews": [
    {
      "id": 102,
      "rating": 4,
      "comment": "Good, but slow service",
      "createdAt": "2026-08-14T13:02:00.000Z"
    },
    {
      "id": 101,
      "rating": 5,
      "comment": "Paneer burrito is unreal",
      "createdAt": "2026-08-12T19:14:00.000Z"
    }
  ]
}
```

`averageRating`, `totalReviews`, and the latest/older split are all computed by
SQL on every request. The database stores facts only.

## Project structure

```text
app/
  api/restaurants/[id]/route.ts   GET restaurant profile
  api/reviews/route.ts            POST review
  restaurant/[id]/page.tsx        restaurant screen
  review/[restaurantId]/page.tsx  review screen
components/
  restaurant-profile-view.tsx     profile fetch and display
  review-form.tsx                 star picker and submission
  star-icon.tsx                   shared star SVG
  star-rating.tsx                 read-only star display
db/
  schema.sql                      tables and seed data
lib/
  db.ts                           Neon client
  restaurants.ts                  raw SQL read model
scripts/
  init-db.mjs                     applies db/schema.sql
```

## Deploying to Vercel

1. Add `DATABASE_URL` to the Vercel project's environment variables for
   Production, Preview, and Development.
2. Import the GitHub repository into Vercel, or run `vercel --prod`.
3. Verify the deployment with:

   ```bash
   curl -i https://your-project.vercel.app/api/restaurants/1
   curl -i https://your-project.vercel.app/api/restaurants/999
   curl -i -X POST https://your-project.vercel.app/api/reviews \
     -H "Content-Type: application/json" \
     -d '{"restaurantId":1,"rating":500,"comment":"Out of range"}'
   ```

The final request must return `400` with a plain-English error.
