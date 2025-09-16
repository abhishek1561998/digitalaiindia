import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - Digitalaiindia | 24/7 AI Support',
  description: 'Get in touch with Digitalaiindia for 24/7 AI support, custom AI solutions, and expert consultation. Contact us for 3D AI chatbots, voice AI, and more.',
  keywords: 'contact Digitalaiindia, AI support, AI consultation, 24/7 support, AI chatbot development, voice AI, custom AI solutions',
  openGraph: {
    title: 'Contact Us - Digitalaiindia | 24/7 AI Support',
    description: 'Get in touch with Digitalaiindia for 24/7 AI support and custom AI solutions.',
    type: 'website',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      {children}
    </div>
  );
}
