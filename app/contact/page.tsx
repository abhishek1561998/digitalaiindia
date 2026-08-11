import { ContactLanding } from "@/components/dai/contact-landing";
import { getCurrentUser } from "@/lib/server/auth";

export default async function ContactPage() {
  const user = await getCurrentUser();
  return <ContactLanding isLoggedIn={Boolean(user)} />;
}
