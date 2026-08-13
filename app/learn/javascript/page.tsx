import { Metadata } from "next";
import { LearnJsLanding } from "@/components/dai/learn-js-landing";
import { getCurrentUser } from "@/lib/server/auth";

export const metadata: Metadata = {
  title: "Free JavaScript Course with Certificate — 9 Stages, Real Projects | DigitalAIIndia Learn",
  description:
    "Learn JavaScript properly and free — closures, async, the event loop, testing — through 9 project-based stages, a live playground, and quizzes. Earn a real certificate on completion.",
  keywords: [
    "learn JavaScript free",
    "JavaScript course with certificate",
    "JavaScript for beginners",
    "JavaScript closures async event loop",
    "free JavaScript certificate India",
    "JavaScript project based course",
  ],
  alternates: { canonical: "https://learn.digitalaiindia.com/javascript" },
  openGraph: {
    title: "JavaScript, Properly. — Free Course with a Real Certificate",
    description: "9 stages, real code, a live playground, quizzes, and a certificate with your name on it.",
    url: "https://learn.digitalaiindia.com/javascript",
    siteName: "DigitalAIIndia Learn",
    type: "website",
    images: [{ url: "https://digitalaiindia.com/banner.png", width: 1200, height: 630, alt: "JavaScript, Properly — DigitalAIIndia Learn" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JavaScript, Properly. — Free Course with a Real Certificate",
    description: "9 stages, real code, a live playground, quizzes, and a certificate with your name on it.",
    images: ["https://digitalaiindia.com/banner.png"],
  },
};

const courseJsonLd = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "JavaScript, Properly.",
  description:
    "A 9-stage, project-based JavaScript curriculum covering execution model, closures, async/await, the DOM, testing, and more — with a live playground, quizzes, and a certificate on completion.",
  provider: {
    "@type": "Organization",
    name: "DigitalAIIndia Learn",
    sameAs: "https://digitalaiindia.com",
  },
  url: "https://learn.digitalaiindia.com/javascript",
  isAccessibleForFree: true,
  hasCourseInstance: {
    "@type": "CourseInstance",
    courseMode: "online",
    courseWorkload: "PT9H",
  },
  educationalCredentialAwarded: "Certificate of Completion",
};

export default async function LearnJavaScriptPage() {
  const user = await getCurrentUser();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />
      <LearnJsLanding isLoggedIn={Boolean(user)} userName={user?.name ?? null} />
    </>
  );
}
