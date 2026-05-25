"use client";

import Image from "next/image";
import KtuPointsPill from "./KtuPointsPill";
import Badge from "@/components/ui/Badge";
import { formatEventDate, formatCost } from "@/lib/utils";

export default function EventDetailHero({ event }) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-charcoal text-cream">
      <div className="absolute inset-0">
        {event.posterImageUrl ? (
          <Image
            src={event.posterImageUrl}
            alt={event.title}
            fill
            className="object-cover opacity-70"
            priority
          />
        ) : null}
      </div>
      <div className="relative z-10 flex flex-col gap-4 p-8">
        <Badge className="bg-cream/90 text-charcoal">Pinned Event</Badge>
        <h1 className="text-3xl font-semibold">{event.title}</h1>
        <p className="max-w-2xl text-sm text-cream/80">{event.description}</p>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <Badge className="bg-cream/20 text-cream">
            {formatEventDate(event.date)}
          </Badge>
          <Badge className="bg-cream/20 text-cream">{event.locationDisplay}</Badge>
          <Badge className="bg-cream/20 text-cream">{formatCost(event.cost)}</Badge>
          <KtuPointsPill points={event.ktuPoints} category={event.ktuCategory} />
        </div>
      </div>
    </section>
  );
}
