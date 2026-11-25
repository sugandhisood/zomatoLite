type StarIconProps = {
  filled?: boolean;
  className?: string;
};

export function StarIcon({ filled = false, className }: StarIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    >
      <path d="M12 2.75l2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 17.56l-5.8 3.05 1.1-6.46-4.69-4.58 6.49-.94L12 2.75z" />
    </svg>
  );
}
