import { redirect, notFound } from "next/navigation";
import { getCourse } from "@/lib/learn/catalog";

// The old stepper lived at /learn/<slug>/course. The roadmap replaced it, so
// this keeps every bookmark, email link and search result pointing somewhere
// real instead of a 404.
export default async function LegacyCourseRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();
  redirect(`/learn/${course.slug}`);
}
