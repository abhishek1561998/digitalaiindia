import { BlogLanding } from "@/components/dai/blog-landing";
import { getCurrentUser } from "@/lib/server/auth";

export default async function BlogPage() {
  const user = await getCurrentUser();
  return <BlogLanding isLoggedIn={Boolean(user)} />;
}
