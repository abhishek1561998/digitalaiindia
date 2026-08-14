import { Metadata } from "next";
import { LearnProjectLanding } from "@/components/dai/learn-project-landing";
import { getCurrentUser } from "@/lib/server/auth";

export const metadata: Metadata = {
  title: "Free Project Building Course with Certificate — Ship a Real Portfolio Project | DigitalAIIndia Learn",
  description:
    "Learn the process that actually gets side projects finished — choosing an idea, cutting scope, shipping live, writing a README, and talking about your work. Earn a real certificate.",
  keywords: ["portfolio project course", "how to finish side projects", "build and deploy portfolio project", "developer portfolio India", "project building course certificate"],
  alternates: { canonical: "https://learn.digitalaiindia.com/project-building" },
  openGraph: {
    title: "Finish Something Real — Free Project Building Course with a Certificate",
    description: "9 stages: choose, scope, set up, build ugly, harden, ship, document, explain, and keep it alive.",
    url: "https://learn.digitalaiindia.com/project-building",
    siteName: "DigitalAIIndia Learn",
    type: "website",
    images: [{ url: "https://digitalaiindia.com/banner.png", width: 1200, height: 630, alt: "Finish Something Real. — DigitalAIIndia Learn" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Finish Something Real — Free Project Building Course with a Certificate",
    description: "9 stages: choose, scope, set up, build ugly, harden, ship, document, explain, and keep it alive.",
    images: ["https://digitalaiindia.com/banner.png"],
  },
};

const courseJsonLd = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Finish Something Real.",
  description:
    "A 9-stage project building curriculum covering idea selection, scoping, repo and deployment setup, building vertical slices, handling edge cases, shipping live, writing a README that gets read, communicating your work, and getting real users — with a certificate on completion.",
  provider: {
    "@type": "Organization",
    name: "DigitalAIIndia Learn",
    sameAs: "https://digitalaiindia.com",
  },
  url: "https://learn.digitalaiindia.com/project-building",
  isAccessibleForFree: true,
  hasCourseInstance: {
    "@type": "CourseInstance",
    courseMode: "online",
    courseWorkload: "PT8H",
  },
  educationalCredentialAwarded: "Certificate of Completion",
};

export default async function LearnProjectPage() {
  const user = await getCurrentUser();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />
      <LearnProjectLanding isLoggedIn={Boolean(user)} userName={user?.name ?? null} />
    </>
  );
}
