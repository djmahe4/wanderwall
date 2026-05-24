"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import PosterCard from "./PosterCard";
import Button from "@/components/ui/Button";

function seededRandom(seed) {
  return (Math.sin(seed) + 1) / 2;
}

export default function MasonryGrid({ events, wanderMode }) {
  const [seed, setSeed] = useState(1);

  const positions = useMemo(() => {
    return events.map((_, index) => {
      const left = seededRandom(seed + index * 2) * 70 + 5;
      const top = seededRandom(seed + index * 3) * 60 + index * 6;
      const rotate = seededRandom(seed + index * 4) * 3 - 1.5;
      return { left, top, rotate };
    });
  }, [events, seed]);

  if (wanderMode) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button variant="outline" onClick={() => setSeed((prev) => prev + 1)}>
            Shuffle
          </Button>
        </div>
        <div className="wander-scatter relative">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              className="absolute w-64 sm:w-72"
              style={{
                left: `${positions[index].left}%`,
                top: `${positions[index].top}%`,
                transform: `rotate(${positions[index].rotate}deg)`,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <PosterCard event={event} />
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="masonry-wall">
      {events.map((event) => (
        <PosterCard key={event.id} event={event} />
      ))}
    </div>
  );
}
