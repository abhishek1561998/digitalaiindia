"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Clock, User, ExternalLink, TrendingUp, Sparkles, ArrowLeft, Share2, Bookmark } from "lucide-react";
import Link from "next/link";

interface BlogPost {
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

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [showFullArticle, setShowFullArticle] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Client-side detection
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch blog posts from API
  useEffect(() => {
    if (!isClient) return;
    
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/blog/posts');
        const data = await response.json();
        if (data.success && data.posts) {
          setPosts(data.posts);
          setFilteredPosts(data.posts);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [isClient]);

  // Filter and search posts
  useEffect(() => {
    if (!posts.length) return;
    
    let filtered = posts;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Tag filter
    if (selectedTag !== "all") {
      filtered = filtered.filter(post =>
        post.tags.some(tag => tag.toLowerCase() === selectedTag.toLowerCase())
      );
    }

    // Sort posts
    if (sortBy === "latest") {
      filtered = filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    } else if (sortBy === "popular") {
      filtered = filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
    }

    setFilteredPosts(filtered);
  }, [posts, searchTerm, selectedTag, sortBy]);

  // Get unique tags
  const allTags = Array.from(new Set(posts.flatMap(post => post.tags)));

  // Handle opening full article
  const handleOpenArticle = (post: BlogPost) => {
    setSelectedPost(post);
    setShowFullArticle(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle closing full article
  const handleCloseArticle = () => {
    setSelectedPost(null);
    setShowFullArticle(false);
  };

  // Handle sharing
  const handleShare = async (post: BlogPost) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: post.url,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(post.url);
    }
  };

  // Don't render anything until client-side
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl mb-6 animate-pulse">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div className="h-8 bg-gray-800 rounded-lg mb-4 animate-pulse max-w-md mx-auto"></div>
            <div className="h-4 bg-gray-800 rounded w-2/3 mx-auto animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl mb-6 animate-pulse">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div className="h-16 bg-gray-800 rounded-xl mb-6 animate-pulse max-w-2xl mx-auto"></div>
            <div className="h-6 bg-gray-800 rounded-lg w-2/3 mx-auto animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-900/50 rounded-2xl p-8 animate-pulse">
                <div className="h-48 bg-gray-800 rounded-xl mb-6"></div>
                <div className="h-6 bg-gray-800 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-800 rounded mb-2"></div>
                <div className="h-4 bg-gray-800 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Full Article View
  if (showFullArticle && selectedPost) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 pt-20">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-600/5 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-600/5 rounded-full mix-blend-screen filter blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative container mx-auto px-4 py-16">
          {/* Navigation Breadcrumb */}
          <div className="max-w-4xl mx-auto mb-8">
            <nav className="flex items-center space-x-2 text-sm">
              <Link
                href="/"
                className="inline-flex items-center space-x-1 text-gray-400 hover:text-yellow-400 transition-colors duration-300 group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                <span className="font-medium">Digitalai India</span>
              </Link>
              <span className="text-gray-600">/</span>
              <button
                onClick={handleCloseArticle}
                className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 font-medium"
              >
                AI Blog
              </button>
              <span className="text-gray-600">/</span>
              <span className="text-yellow-400 font-medium truncate max-w-xs">
                {selectedPost.title.length > 30 
                  ? selectedPost.title.substring(0, 30) + "..." 
                  : selectedPost.title
                }
              </span>
            </nav>
          </div>

          <article className="max-w-4xl mx-auto">
            {/* Hero Image */}
            {selectedPost.imageUrl && (
              <div className="relative h-96 mb-8 rounded-2xl overflow-hidden">
                <img
                  src={selectedPost.imageUrl}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
            )}

            {/* Article Header */}
            <header className="mb-8">
              {/* Meta */}
              <div className="flex items-center justify-between text-sm text-gray-400 mb-6">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{selectedPost.author}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{selectedPost.readTime} min read</span>
                  </div>
                  <span className="px-3 py-1 bg-yellow-500/10 text-yellow-400 text-xs rounded-full border border-yellow-500/20">
                    {selectedPost.source}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleShare(selectedPost)}
                    className="flex items-center space-x-2 text-gray-400 hover:text-yellow-400 transition-colors duration-300"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-400 hover:text-yellow-400 transition-colors duration-300">
                    <Bookmark className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                {selectedPost.title}
              </h1>

              {/* Excerpt */}
              <p className="text-xl text-gray-300 leading-relaxed mb-6">
                {selectedPost.excerpt}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {selectedPost.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-yellow-500/10 text-yellow-400 text-sm rounded-full border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors duration-300 cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </header>

            {/* Article Content */}
            <div className="prose prose-invert prose-lg max-w-none">
              <div
                className="text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: selectedPost.content || '<p>Content not available.</p>'
                }}
              />
            </div>

            {/* Article Footer */}
            <footer className="mt-12 pt-8 border-t border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-400">
                    Published on {new Date(selectedPost.publishedAt).toLocaleDateString()}
                  </span>
                  {selectedPost.views && (
                    <span className="text-gray-400">
                      {selectedPost.views.toLocaleString()} views
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-400">
                    Originally from {selectedPost.source}
                  </span>
                  <a
                    href={selectedPost.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-yellow-400 border border-gray-700 hover:border-yellow-500/50 rounded-lg transition-all duration-300"
                  >
                    <span className="text-sm">View Original</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </footer>
          </article>

          {/* Related Posts */}
          {posts.filter(p => p.id !== selectedPost.id && p.tags.some(tag => selectedPost.tags.includes(tag))).slice(0, 3).length > 0 && (
            <section className="mt-20">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-white mb-8">Related Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts
                    .filter(p => p.id !== selectedPost.id && p.tags.some(tag => selectedPost.tags.includes(tag)))
                    .slice(0, 3)
                    .map((relatedPost) => (
                    <div
                      key={relatedPost.id}
                      onClick={() => handleOpenArticle(relatedPost)}
                      className="group bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800 hover:border-yellow-500/50 transition-all duration-500 overflow-hidden cursor-pointer"
                    >
                      {relatedPost.imageUrl && (
                        <div className="relative h-32 overflow-hidden">
                          <img
                            src={relatedPost.imageUrl}
                            alt={relatedPost.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors duration-300 line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        <p className="text-gray-400 text-sm line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                          <span>{relatedPost.author}</span>
                          <span>{relatedPost.readTime} min read</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 pt-20">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-600/5 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-600/5 rounded-full mix-blend-screen filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          {/* Navigation Breadcrumb */}
          <div className="flex justify-center mb-6">
            <nav className="flex items-center space-x-2 text-sm">
              <Link
                href="/"
                className="inline-flex items-center space-x-1 text-gray-400 hover:text-yellow-400 transition-colors duration-300 group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                <span className="font-medium">Digitalai India</span>
              </Link>
              <span className="text-gray-600">/</span>
              <span className="text-yellow-400 font-medium">AI Blog</span>
            </nav>
          </div>

          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl mb-6">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              AI Blog
            </span>
            <br />
            <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-amber-500 bg-clip-text text-transparent">
              Insights
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Stay updated with the latest trends, insights, and breakthroughs in artificial intelligence
          </p>
          
          {/* Benefits Banner */}
          <div className="max-w-4xl mx-auto mt-8 p-6 bg-gradient-to-r from-yellow-900/20 to-orange-900/20 backdrop-blur-xl rounded-2xl border border-yellow-500/20">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Read Full Articles Here</h3>
                  <p className="text-gray-400 text-sm">No redirects - complete content with Digitalai India enhancements</p>
                </div>
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-300">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span>Enhanced Content</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span>AI Insights</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-600 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Search and Filter Bar */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search AI articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20 transition-all duration-300"
                />
              </div>

              {/* Tag Filter */}
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="pl-12 pr-8 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20 transition-all duration-300 appearance-none cursor-pointer"
                >
                  <option value="all">All Topics</option>
                  {allTags.map((tag) => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="relative">
                <TrendingUp className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-12 pr-8 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20 transition-all duration-300 appearance-none cursor-pointer"
                >
                  <option value="latest">Latest</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              onClick={() => handleOpenArticle(post)}
              className="group relative bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800 hover:border-yellow-500/50 transition-all duration-500 overflow-hidden cursor-pointer"
            >
              {/* Image */}
              {post.imageUrl && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
              )}

              {/* Content */}
              <div className="p-6">
                {/* Meta */}
                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime} min read</span>
                    </div>
                  </div>
                  <span className="text-yellow-400 font-medium">{post.source}</span>
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors duration-300 line-clamp-2">
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className="text-gray-400 leading-relaxed mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-yellow-500/10 text-yellow-400 text-xs rounded-full border border-yellow-500/20"
                    >
                      {tag}
                    </span>
                  ))}
                  {post.tags.length > 3 && (
                    <span className="px-3 py-1 bg-gray-800 text-gray-400 text-xs rounded-full">
                      +{post.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* Read More */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenArticle(post);
                  }}
                  className="inline-flex items-center space-x-2 text-yellow-400 hover:text-yellow-300 transition-colors duration-300 font-medium"
                >
                  <span>Read Full Article</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>

              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
            </article>
          ))}
        </div>

        {/* No results */}
        {filteredPosts.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🤖</div>
            <h3 className="text-2xl font-bold text-white mb-4">No articles found</h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your search terms or filters to find more AI insights.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedTag("all");
                setSortBy("latest");
              }}
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-white font-semibold rounded-xl transition-all duration-300"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}