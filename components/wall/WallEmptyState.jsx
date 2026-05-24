"use client";

import Image from "next/image";

export default function WallEmptyState() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-3xl border border-cream/60 bg-cream p-12 text-center shadow-poster">
      <Image src="/compass.svg" alt="Compass" width={80} height={80} />
      <div>
        <h3 className="text-lg font-semibold text-charcoal">
          No events on the wall yet.
        </h3>
        <p className="text-sm text-charcoal/70">Be the first to pin one!</p>
      </div>
    </div>
  );
}
