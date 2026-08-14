import { Metadata } from "next";
import { LearnAwsLanding } from "@/components/dai/learn-aws-landing";
import { getCurrentUser } from "@/lib/server/auth";

export const metadata: Metadata = {
  title: "Free AWS Course with Certificate — EC2, IAM, Docker, Lambda & More | DigitalAIIndia Learn",
  description:
    "Learn AWS step by step — account safety, IAM, EC2, VPC, Docker, ECS Fargate, Lambda, EventBridge, S3, RDS, CodeArtifact, and cost control. Every step written out. Earn a real certificate.",
  keywords: [
    "AWS course free",
    "AWS course with certificate",
    "learn EC2 IAM Lambda",
    "deploy docker on AWS",
    "ECS Fargate tutorial",
    "EventBridge CodeArtifact tutorial",
    "AWS for beginners India",
  ],
  alternates: { canonical: "https://learn.digitalaiindia.com/aws" },
  openGraph: {
    title: "AWS, Without the Fog — Free AWS Course with a Real Certificate",
    description: "11 stages: IAM, EC2, VPC, Docker, ECS Fargate, Lambda, EventBridge, S3, RDS, CodeArtifact, and cost control — step by step.",
    url: "https://learn.digitalaiindia.com/aws",
    siteName: "DigitalAIIndia Learn",
    type: "website",
    images: [{ url: "https://digitalaiindia.com/banner.png", width: 1200, height: 630, alt: "AWS — DigitalAIIndia Learn" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AWS, Without the Fog — Free AWS Course with a Certificate",
    description: "11 stages: IAM, EC2, VPC, Docker, Fargate, Lambda, EventBridge, S3, RDS, CodeArtifact, cost.",
    images: ["https://digitalaiindia.com/banner.png"],
  },
};

const courseJsonLd = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "AWS, Without the Fog.",
  description:
    "An 11-stage, step-by-step AWS curriculum covering safe account setup and billing alarms, IAM, EC2, VPC networking, Docker, ECR and ECS Fargate, Lambda, EventBridge, S3 and RDS, CodeArtifact and CI/CD, and cost monitoring — with a certificate on completion.",
  provider: {
    "@type": "Organization",
    name: "DigitalAIIndia Learn",
    sameAs: "https://digitalaiindia.com",
  },
  url: "https://learn.digitalaiindia.com/aws",
  isAccessibleForFree: true,
  hasCourseInstance: {
    "@type": "CourseInstance",
    courseMode: "online",
    courseWorkload: "PT10H",
  },
  educationalCredentialAwarded: "Certificate of Completion",
};

export default async function LearnAwsPage() {
  const user = await getCurrentUser();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />
      <LearnAwsLanding isLoggedIn={Boolean(user)} userName={user?.name ?? null} />
    </>
  );
}
