import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://nexusevents.co.il/sitemap.xml",
    host: "https://nexusevents.co.il",
  };
}
