import type { MetadataRoute } from "next";
import { events } from "@/lib/events";

const BASE = "https://nexusevents.co.il";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/tickets", "/favorites", "/resale", "/login"].map((p) => ({
    url: `${BASE}${p}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.7,
  }));

  const eventRoutes = events.map((e) => ({
    url: `${BASE}/events/${e.id}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...eventRoutes];
}
