import { Metadata } from "next";
import { LearnAiLanding } from "@/components/dai/learn-ai-landing";
import { getCurrentUser } from "@/lib/server/auth";

export const metadata: Metadata = {
  title: "Free AI Engineering Course with Certificate — RAG, Embeddings & LLM Apps | DigitalAIIndia Learn",
  description:
    "Learn AI engineering by building a real RAG pipeline — chunking, embeddings, vector search, streaming, evals, and cost control. Earn a real certificate on completion.",
  keywords: [
    "AI engineering course",
    "learn RAG pipeline",
    "LLM application development",
    "embeddings and vector search tutorial",
    "AI engineer course India free",
    "prompt engineering course with certificate",
  ],
  alternates: { canonical: "https://learn.digitalaiindia.com/ai" },
  openGraph: {
    title: "Ship AI That Actually Works — Free AI Engineering Course with a Certificate",
    description: "9 stages: chunking, embeddings, RAG, streaming, evals, and cost — build a production pipeline, not a demo.",
    url: "https://learn.digitalaiindia.com/ai",
    siteName: "DigitalAIIndia Learn",
    type: "website",
    images: [{ url: "https://digitalaiindia.com/banner.png", width: 1200, height: 630, alt: "AI Engineering — DigitalAIIndia Learn" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ship AI That Actually Works — Free AI Engineering Course",
    description: "9 stages: chunking, embeddings, RAG, streaming, evals, and cost.",
    images: ["https://digitalaiindia.com/banner.png"],
  },
};

const courseJsonLd = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Ship AI That Actually Works.",
  description:
    "A 9-stage AI engineering curriculum covering LLM fundamentals, prompt engineering, chunking, embeddings and vector search, RAG pipelines, streaming UX, production API handling, evaluation, and cost control — with a certificate on completion.",
  provider: {
    "@type": "Organization",
    name: "DigitalAIIndia Learn",
    sameAs: "https://digitalaiindia.com",
  },
  url: "https://learn.digitalaiindia.com/ai",
  isAccessibleForFree: true,
  hasCourseInstance: {
    "@type": "CourseInstance",
    courseMode: "online",
    courseWorkload: "PT8H",
  },
  educationalCredentialAwarded: "Certificate of Completion",
};

export default async function LearnAiPage() {
  const user = await getCurrentUser();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />
      <LearnAiLanding isLoggedIn={Boolean(user)} userName={user?.name ?? null} />
    </>
  );
}
