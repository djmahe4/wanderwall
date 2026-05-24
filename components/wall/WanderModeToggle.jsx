"use client";

export default function WanderModeToggle({ enabled, onToggle }) {
  return (
    <button
      type="button"
      onClick={() => onToggle(!enabled)}
      className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold transition ${
        enabled
          ? "bg-teal text-white"
          : "bg-cream text-charcoal border border-charcoal/20"
      }`}
    >
      <span className="text-base">🧭</span>
      Wander Mode
    </button>
  );
}
