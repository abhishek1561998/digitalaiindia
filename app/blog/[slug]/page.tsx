import { BlogDetailLanding } from "@/components/dai/blog-detail-landing";
import { getCurrentUser } from "@/lib/server/auth";

export default async function BlogPostPage() {
  const user = await getCurrentUser();
  return <BlogDetailLanding isLoggedIn={Boolean(user)} />;
}
