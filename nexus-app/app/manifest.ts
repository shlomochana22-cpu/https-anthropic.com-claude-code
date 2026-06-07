import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NEXUS — פורטל חיי הלילה",
    short_name: "NEXUS",
    description: "אירועים, כרטיסים וניהול הפקות",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#bff520",
    dir: "rtl",
    lang: "he",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
