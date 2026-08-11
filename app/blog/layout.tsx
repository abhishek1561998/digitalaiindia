import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - Latest AI Insights & Updates | DigitalAIIndia',
  description: 'Ideas, updates, and AI insights from the team building DigitalAIIndia.',
  keywords: 'AI blog, artificial intelligence, machine learning, AI insights, AI trends, AI articles, technology blog',
  openGraph: {
    title: 'Blog - Latest AI Insights & Updates | DigitalAIIndia',
    description: 'Ideas, updates, and AI insights from the team building DigitalAIIndia.',
    type: 'website',
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
