import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-start pt-16 sm:pt-24">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 max-w-md font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl">
        This table isn&apos;t set.
      </h1>
      <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-muted">
        The page you were looking for has moved on. The kitchen is still open
        though.
      </p>
      <Link
        href="/restaurant/1"
        className="mt-8 rounded-soft bg-ink px-5 py-3 text-sm font-semibold text-paper transition-colors hover:bg-accent"
      >
        Visit Ludhiana Burrito
      </Link>
    </div>
  );
}
