"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { motion } from "framer-motion";
import SponsoredRibbon from "@/components/event/SponsoredRibbon";
import KtuPointsPill from "@/components/event/KtuPointsPill";
import Badge from "@/components/ui/Badge";
import { formatEventDate, formatCost } from "@/lib/utils";

export default function PosterCard({ event }) {
  const rotation = useMemo(() => (Math.random() * 3 - 1.5).toFixed(2), []);

  return (
    <motion.article
      className="poster-card group relative overflow-hidden rounded-3xl bg-cream shadow-poster"
      style={{ "--random-rotate": `${rotation}deg` }}
      whileHover={{ y: -4 }}
    >
      {event.isSponsored ? <SponsoredRibbon /> : null}
      <Link href={`/event/${event.id}`} className="block">
        <div className="relative h-48 w-full overflow-hidden">
          {event.posterImageUrl ? (
            <Image
              src={event.posterImageUrl}
              alt={event.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-charcoal/10 text-xs text-charcoal/60">
              No poster image yet
            </div>
          )}
        </div>
        <div className="space-y-3 p-4">
          <div>
            <h3 className="text-base font-semibold text-charcoal">{event.title}</h3>
            <p className="text-xs text-charcoal/70">
              {formatEventDate(event.date)} · {event.locationDisplay}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-cream text-charcoal/70">
              {formatCost(event.cost)}
            </Badge>
            <KtuPointsPill points={event.ktuPoints} category={event.ktuCategory} />
            {event.trustedContributor ? (
              <Badge className="bg-teal/10 text-teal">Trusted</Badge>
            ) : null}
          </div>
        </div>
      </Link>
      <span className="absolute left-1/2 top-2 hidden h-2 w-10 -translate-x-1/2 rounded-full bg-charcoal/20 shadow-pin group-hover:block" />
    </motion.article>
  );
}
