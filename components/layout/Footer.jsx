"use client";

import Container from "./Container";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-cream/60 bg-cream">
      <Container className="flex flex-col items-start justify-between gap-4 py-8 text-sm text-charcoal/70 md:flex-row">
        <div>
          <p className="font-semibold text-charcoal">WanderWall</p>
          <p>Wander through events. Wall-to-wall discovery.</p>
        </div>
        <div className="flex gap-6">
          <span>Community-first discovery</span>
          <span>Built for KTU students</span>
        </div>
      </Container>
    </footer>
  );
}
