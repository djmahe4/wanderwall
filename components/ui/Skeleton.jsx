"use client";

export default function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-cream/70 shadow-inner ${className}`}
    />
  );
}
