import type { MetadataRoute } from "next";
import { COURSES } from "@/lib/learn/catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: "https://digitalaiindia.com", lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: "https://digitalaiindia.com/about", lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: "https://digitalaiindia.com/pricing", lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: "https://digitalaiindia.com/contact", lastModified: now, changeFrequency: "yearly", priority: 0.3 },

    { url: "https://platform.digitalaiindia.com", lastModified: now, changeFrequency: "weekly", priority: 0.8 },

    { url: "https://learn.digitalaiindia.com", lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: "https://learn.digitalaiindia.com/courses", lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: "https://learn.digitalaiindia.com/premium", lastModified: now, changeFrequency: "monthly", priority: 0.7 },

    // Derived from the catalog so shipping a ninth track doesn't need a
    // second edit here to be indexable.
    ...COURSES.map((course) => ({
      url: `https://learn.digitalaiindia.com/${course.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),

    { url: "https://blog.digitalaiindia.com", lastModified: now, changeFrequency: "daily", priority: 0.7 },
  ];
}
