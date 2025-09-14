// Blog utility functions

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  source: string;
  tags: string[];
  readTime: number;
  imageUrl?: string;
  url: string;
  views?: number;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else if (diffInHours < 48) {
    return 'Yesterday';
  } else if (diffInHours < 168) { // 7 days
    const days = Math.floor(diffInHours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}

export function formatViews(views: number): string {
  if (views < 1000) {
    return views.toString();
  } else if (views < 1000000) {
    return `${(views / 1000).toFixed(1)}K`;
  } else {
    return `${(views / 1000000).toFixed(1)}M`;
  }
}

export function getReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export function extractExcerpt(content: string, maxLength: number = 150): string {
  // Remove HTML tags
  const plainText = content.replace(/<[^>]*>/g, '');
  
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  return plainText.substring(0, maxLength).trim() + '...';
}

export function getSourceColor(source: string): string {
  const colors = {
    'Dev.to': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'Medium': 'bg-green-500/10 text-green-400 border-green-500/20',
    'Hashnode': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    'default': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
  };
  
  return colors[source as keyof typeof colors] || colors.default;
}

export function filterPostsByTag(posts: BlogPost[], tag: string): BlogPost[] {
  if (tag === 'all') {
    return posts;
  }
  
  return posts.filter(post =>
    post.tags.some(postTag =>
      postTag.toLowerCase().includes(tag.toLowerCase())
    )
  );
}

export function searchPosts(posts: BlogPost[], searchTerm: string): BlogPost[] {
  if (!searchTerm.trim()) {
    return posts;
  }
  
  const term = searchTerm.toLowerCase();
  
  return posts.filter(post =>
    post.title.toLowerCase().includes(term) ||
    post.excerpt.toLowerCase().includes(term) ||
    post.author.toLowerCase().includes(term) ||
    post.tags.some(tag => tag.toLowerCase().includes(term))
  );
}

export function sortPosts(posts: BlogPost[], sortBy: string): BlogPost[] {
  switch (sortBy) {
    case 'latest':
      return [...posts].sort((a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    case 'popular':
      return [...posts].sort((a, b) => (b.views || 0) - (a.views || 0));
    case 'trending':
      // Simple trending algorithm based on views and recency
      return [...posts].sort((a, b) => {
        const aScore = (a.views || 0) / (Date.now() - new Date(a.publishedAt).getTime());
        const bScore = (b.views || 0) / (Date.now() - new Date(b.publishedAt).getTime());
        return bScore - aScore;
      });
    default:
      return posts;
  }
}

export function getAllTags(posts: BlogPost[]): string[] {
  const tagSet = new Set<string>();
  posts.forEach(post => {
    post.tags.forEach(tag => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
}

export function getPopularTags(posts: BlogPost[], limit: number = 10): string[] {
  const tagCounts: { [key: string]: number } = {};
  
  posts.forEach(post => {
    post.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  
  return Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([tag]) => tag);
}
