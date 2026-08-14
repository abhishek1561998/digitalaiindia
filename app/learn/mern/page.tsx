import { Metadata } from "next";
import { LearnMernLanding } from "@/components/dai/learn-mern-landing";
import { getCurrentUser } from "@/lib/server/auth";

export const metadata: Metadata = {
  title: "Free MERN Stack Course with Certificate — Build & Deploy a Real App | DigitalAIIndia Learn",
  description:
    "Learn the MERN stack by building one real app end to end — Node, Express, MongoDB, React, JWT auth, and actual deployment. Earn a real certificate on completion.",
  keywords: [
    "learn MERN stack free",
    "MERN course with certificate",
    "MongoDB Express React Node course",
    "full stack developer course India",
    "JWT authentication tutorial",
    "deploy MERN app free",
  ],
  alternates: { canonical: "https://learn.digitalaiindia.com/mern" },
  openGraph: {
    title: "A Real App, End to End — Free MERN Course with a Real Certificate",
    description: "9 stages, one app built in layers, real auth, real deployment, and a certificate with your name on it.",
    url: "https://learn.digitalaiindia.com/mern",
    siteName: "DigitalAIIndia Learn",
    type: "website",
    images: [{ url: "https://digitalaiindia.com/banner.png", width: 1200, height: 630, alt: "MERN — DigitalAIIndia Learn" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "A Real App, End to End — Free MERN Course with a Real Certificate",
    description: "9 stages, one app built in layers, real auth, real deployment.",
    images: ["https://digitalaiindia.com/banner.png"],
  },
};

const courseJsonLd = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "A Real App, End to End.",
  description:
    "A 9-stage MERN stack curriculum that builds one real application in layers — Node fundamentals, Express APIs, MongoDB/Mongoose, JWT authentication, React, full-stack integration, deployment, and production hardening — with a certificate on completion.",
  provider: {
    "@type": "Organization",
    name: "DigitalAIIndia Learn",
    sameAs: "https://digitalaiindia.com",
  },
  url: "https://learn.digitalaiindia.com/mern",
  isAccessibleForFree: true,
  hasCourseInstance: {
    "@type": "CourseInstance",
    courseMode: "online",
    courseWorkload: "PT9H",
  },
  educationalCredentialAwarded: "Certificate of Completion",
};

export default async function LearnMernPage() {
  const user = await getCurrentUser();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />
      <LearnMernLanding isLoggedIn={Boolean(user)} userName={user?.name ?? null} />
    </>
  );
}
