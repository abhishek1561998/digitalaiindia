import { Metadata } from 'next';
import './blog-styles.css';

export const metadata: Metadata = {
  title: 'AI Blog - Latest AI Insights & Trends | Digitalai India',
  description: 'Stay updated with the latest trends, insights, and breakthroughs in artificial intelligence. Expert articles on AI, machine learning, and emerging technologies.',
  keywords: 'AI blog, artificial intelligence, machine learning, AI insights, AI trends, AI articles, technology blog',
  openGraph: {
    title: 'AI Blog - Latest AI Insights & Trends | Digitalai India',
    description: 'Stay updated with the latest trends, insights, and breakthroughs in artificial intelligence.',
    type: 'website',
  },
};

export default function BlogLayout({
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
