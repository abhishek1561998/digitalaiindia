import { Metadata } from "next";
import { LearnUiuxLanding } from "@/components/dai/learn-uiux-landing";
import { getCurrentUser } from "@/lib/server/auth";

export const metadata: Metadata = {
  title: "Free UI/UX Design Course with Certificate — Design You Can Defend | DigitalAIIndia Learn",
  description:
    "Learn UI/UX as rules, not taste — visual hierarchy, typography, WCAG contrast, spacing systems, component states, accessibility, and usability testing. Earn a real certificate.",
  keywords: [
    "UI UX course free",
    "UI UX design course with certificate",
    "learn UI design for developers",
    "accessibility WCAG contrast course",
    "design systems and tokens",
    "usability testing course India",
  ],
  alternates: { canonical: "https://learn.digitalaiindia.com/ui-ux" },
  openGraph: {
    title: "Design You Can Defend — Free UI/UX Course with a Real Certificate",
    description: "9 stages: hierarchy, typography, contrast, spacing systems, component states, accessibility, and user testing.",
    url: "https://learn.digitalaiindia.com/ui-ux",
    siteName: "DigitalAIIndia Learn",
    type: "website",
    images: [{ url: "https://digitalaiindia.com/banner.png", width: 1200, height: 630, alt: "UI/UX — DigitalAIIndia Learn" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Design You Can Defend — Free UI/UX Course with a Certificate",
    description: "9 stages: hierarchy, typography, contrast, spacing, states, accessibility, and user testing.",
    images: ["https://digitalaiindia.com/banner.png"],
  },
};

const courseJsonLd = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Design You Can Defend.",
  description:
    "A 9-stage UI/UX curriculum for people who build interfaces — visual hierarchy, layout and proximity, typography scales, WCAG colour and contrast, spacing systems and design tokens, full component state sets, accessibility and keyboard navigation, usability testing, and design-to-code handoff — with a certificate on completion.",
  provider: {
    "@type": "Organization",
    name: "DigitalAIIndia Learn",
    sameAs: "https://digitalaiindia.com",
  },
  url: "https://learn.digitalaiindia.com/ui-ux",
  isAccessibleForFree: true,
  hasCourseInstance: {
    "@type": "CourseInstance",
    courseMode: "online",
    courseWorkload: "PT6H",
  },
  educationalCredentialAwarded: "Certificate of Completion",
};

export default async function LearnUiuxPage() {
  const user = await getCurrentUser();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />
      <LearnUiuxLanding isLoggedIn={Boolean(user)} userName={user?.name ?? null} />
    </>
  );
}
