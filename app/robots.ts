import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard", "/admin", "/system-health"],
      },
    ],
    sitemap: "https://digitalaiindia.com/sitemap.xml",
  };
}
