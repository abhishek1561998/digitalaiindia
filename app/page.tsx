import { MarketingLanding } from "@/components/dai/marketing-landing";
import { getCurrentUser } from "@/lib/server/auth";

export default async function HomePage() {
  const user = await getCurrentUser();
  return <MarketingLanding isLoggedIn={Boolean(user)} />;
}
