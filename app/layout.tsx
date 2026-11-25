import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Zomato Lite",
    template: "%s · Zomato Lite",
  },
  description:
    "A quiet place for restaurant profiles and honest notes about the food.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-paper font-sans text-ink antialiased">
        <div className="mx-auto flex min-h-screen w-full max-w-page flex-col px-5 sm:px-8">
          <header className="flex items-center justify-between py-6">
            <Link
              href="/restaurant/1"
              className="font-display text-[19px] leading-none tracking-tight text-ink"
            >
              Zomato <span className="italic text-accent">Lite</span>
            </Link>
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted">
              The quiet table
            </span>
          </header>

          <main className="flex-1 pb-16">{children}</main>

          <footer className="border-t border-line py-6">
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted">
              Good food deserves a few honest words.
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
