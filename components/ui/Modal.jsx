"use client";

import { useEffect } from "react";

export default function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return;
    const onEsc = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-cream p-6 shadow-poster">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-charcoal">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-charcoal/60 hover:text-charcoal"
          >
            ✕
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
