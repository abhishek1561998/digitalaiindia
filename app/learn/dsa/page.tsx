import { Metadata } from "next";
import { LearnDsaLanding } from "@/components/dai/learn-dsa-landing";
import { getCurrentUser } from "@/lib/server/auth";

export const metadata: Metadata = {
  title: "Free DSA Course with Certificate — Patterns, Not Problems | DigitalAIIndia Learn",
  description:
    "Learn Data Structures & Algorithms through 8 core patterns, not 400 memorized solutions — two pointers, hashing, trees, graphs, DP, and more. Earn a real certificate on completion.",
  keywords: [
    "learn DSA free",
    "data structures and algorithms course",
    "DSA course with certificate",
    "coding interview patterns",
    "two pointers hashing trees graphs dynamic programming",
    "free DSA certificate India",
  ],
  alternates: { canonical: "https://learn.digitalaiindia.com/dsa" },
  openGraph: {
    title: "Patterns, Not Problems — Free DSA Course with a Real Certificate",
    description: "9 stages, 8 core patterns, real code, mock interview practice, and a certificate with your name on it.",
    url: "https://learn.digitalaiindia.com/dsa",
    siteName: "DigitalAIIndia Learn",
    type: "website",
    images: [{ url: "https://digitalaiindia.com/banner.png", width: 1200, height: 630, alt: "DSA — DigitalAIIndia Learn" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Patterns, Not Problems — Free DSA Course with a Real Certificate",
    description: "9 stages, 8 core patterns, real code, mock interview practice.",
    images: ["https://digitalaiindia.com/banner.png"],
  },
};

const courseJsonLd = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Patterns, Not Problems.",
  description:
    "A 9-stage Data Structures & Algorithms curriculum built around 8 core patterns — two pointers, hashing, linked lists, stacks/queues, trees, graphs, dynamic programming, and pattern recognition — with mock interview practice and a certificate on completion.",
  provider: {
    "@type": "Organization",
    name: "DigitalAIIndia Learn",
    sameAs: "https://digitalaiindia.com",
  },
  url: "https://learn.digitalaiindia.com/dsa",
  isAccessibleForFree: true,
  hasCourseInstance: {
    "@type": "CourseInstance",
    courseMode: "online",
    courseWorkload: "PT8H",
  },
  educationalCredentialAwarded: "Certificate of Completion",
};

export default async function LearnDsaPage() {
  const user = await getCurrentUser();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />
      <LearnDsaLanding isLoggedIn={Boolean(user)} userName={user?.name ?? null} />
    </>
  );
}
