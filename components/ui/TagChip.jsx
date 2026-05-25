"use client";

export default function TagChip({ label, active = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
        active
          ? "border-teal bg-teal text-white"
          : "border-charcoal/20 text-charcoal/70 hover:border-charcoal/40"
      }`}
    >
      {label}
    </button>
  );
}
