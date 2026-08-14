import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: "https://digitalaiindia.com", lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: "https://digitalaiindia.com/about", lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: "https://digitalaiindia.com/pricing", lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: "https://digitalaiindia.com/contact", lastModified: now, changeFrequency: "yearly", priority: 0.3 },

    { url: "https://platform.digitalaiindia.com", lastModified: now, changeFrequency: "weekly", priority: 0.8 },

    { url: "https://learn.digitalaiindia.com", lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: "https://learn.digitalaiindia.com/javascript", lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: "https://learn.digitalaiindia.com/dsa", lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: "https://learn.digitalaiindia.com/mern", lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: "https://learn.digitalaiindia.com/ai", lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: "https://learn.digitalaiindia.com/system-design", lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: "https://learn.digitalaiindia.com/project-building", lastModified: now, changeFrequency: "weekly", priority: 0.9 },

    { url: "https://blog.digitalaiindia.com", lastModified: now, changeFrequency: "daily", priority: 0.7 },
  ];
}
