import { Metadata } from "next";
import { LearnSysdesignLanding } from "@/components/dai/learn-sysdesign-landing";
import { getCurrentUser } from "@/lib/server/auth";

export const metadata: Metadata = {
  title: "Free System Design Course with Certificate — Tradeoffs, Not Diagrams | DigitalAIIndia Learn",
  description:
    "Learn system design as tradeoffs under constraints — estimation, scaling, databases, caching, queues, CAP, observability, and interview communication. Earn a real certificate.",
  keywords: ["system design course free", "system design interview preparation", "scalability caching queues CAP", "HLD LLD course India", "system design with certificate"],
  alternates: { canonical: "https://learn.digitalaiindia.com/system-design" },
  openGraph: {
    title: "Defend Every Box You Draw — Free System Design Course with a Certificate",
    description: "9 stages: estimation, scaling, caching, queues, CAP, observability, and how to communicate a design under pressure.",
    url: "https://learn.digitalaiindia.com/system-design",
    siteName: "DigitalAIIndia Learn",
    type: "website",
    images: [{ url: "https://digitalaiindia.com/banner.png", width: 1200, height: 630, alt: "Defend Every Box You Draw. — DigitalAIIndia Learn" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Defend Every Box You Draw — Free System Design Course with a Certificate",
    description: "9 stages: estimation, scaling, caching, queues, CAP, observability, and how to communicate a design under pressure.",
    images: ["https://digitalaiindia.com/banner.png"],
  },
};

const courseJsonLd = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Defend Every Box You Draw.",
  description:
    "A 9-stage system design curriculum covering back-of-envelope estimation, horizontal scaling and statelessness, database indexing/replication/sharding, caching and invalidation, async queues, CAP and consistency tradeoffs, observability, end-to-end design, and interview communication — with a certificate on completion.",
  provider: {
    "@type": "Organization",
    name: "DigitalAIIndia Learn",
    sameAs: "https://digitalaiindia.com",
  },
  url: "https://learn.digitalaiindia.com/system-design",
  isAccessibleForFree: true,
  hasCourseInstance: {
    "@type": "CourseInstance",
    courseMode: "online",
    courseWorkload: "PT8H",
  },
  educationalCredentialAwarded: "Certificate of Completion",
};

export default async function LearnSysdesignPage() {
  const user = await getCurrentUser();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />
      <LearnSysdesignLanding isLoggedIn={Boolean(user)} userName={user?.name ?? null} />
    </>
  );
}
