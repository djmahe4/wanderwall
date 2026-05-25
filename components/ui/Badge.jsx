"use client";

export default function Badge({ children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-cream px-3 py-1 text-xs font-semibold text-charcoal ${className}`}
    >
      {children}
    </span>
  );
}
