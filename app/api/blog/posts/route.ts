import { NextResponse } from 'next/server';

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

// Mock data for now - we'll replace with real API calls
const mockPosts: BlogPost[] = [
  {
    id: "1",
    title: "The Future of AI: How Machine Learning is Transforming Industries",
    excerpt: "Explore the latest breakthroughs in artificial intelligence and how they're revolutionizing business operations across various sectors.",
    content: `
      <h2>The AI Revolution is Here</h2>
      <p>Artificial Intelligence has moved from science fiction to reality, transforming industries at an unprecedented pace. From healthcare to finance, manufacturing to retail, AI is reshaping how businesses operate and compete.</p>
      
      <h3>Key Industry Transformations</h3>
      <p><strong>Healthcare:</strong> AI-powered diagnostic tools are helping doctors detect diseases earlier and more accurately. Machine learning algorithms can analyze medical images, predict patient outcomes, and even assist in drug discovery.</p>
      
      <p><strong>Finance:</strong> Banks and financial institutions are using AI for fraud detection, algorithmic trading, and personalized financial advice. Robo-advisors are democratizing investment management.</p>
      
      <p><strong>Manufacturing:</strong> Smart factories powered by AI are optimizing production lines, predicting maintenance needs, and improving quality control. This has led to significant cost reductions and efficiency gains.</p>
      
      <h3>The Role of Machine Learning</h3>
      <p>Machine learning, a subset of AI, is the driving force behind these transformations. By analyzing vast amounts of data, ML algorithms can identify patterns, make predictions, and automate decision-making processes.</p>
      
      <blockquote>
        <p>"AI is not just a technology trend—it's a fundamental shift in how we approach problem-solving and innovation across all industries."</p>
        <cite>— Dr. Sarah Chen, AI Research Director</cite>
      </blockquote>
      
      <h3>Looking Ahead</h3>
      <p>As AI technology continues to evolve, we can expect even more dramatic changes. The integration of AI with other emerging technologies like IoT, blockchain, and quantum computing will create new possibilities we can only begin to imagine.</p>
      
      <p>The future belongs to organizations that embrace AI and use it to enhance human capabilities rather than replace them. The question isn't whether AI will transform your industry—it's whether you'll be leading that transformation.</p>
    `,
    author: "Dr. Sarah Chen",
    publishedAt: "2024-01-15T10:00:00Z",
    source: "Dev.to",
    tags: ["AI", "Machine Learning", "Future Tech", "Innovation"],
    readTime: 8,
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
    url: "https://dev.to/sarahchen/future-of-ai",
    views: 15420
  },
  {
    id: "2",
    title: "Building Intelligent Chatbots with Natural Language Processing",
    excerpt: "Learn how to create sophisticated chatbots that understand context and provide meaningful responses using advanced NLP techniques.",
    content: `
      <h2>The Evolution of Conversational AI</h2>
      <p>Modern chatbots have evolved far beyond simple rule-based systems. Today's intelligent chatbots leverage advanced Natural Language Processing (NLP) to understand context, sentiment, and intent, providing human-like interactions.</p>
      
      <h3>Core NLP Technologies</h3>
      <p><strong>Intent Recognition:</strong> The ability to understand what users want, even when they phrase it differently. Advanced models can distinguish between "I want to cancel" and "I need to stop my subscription."</p>
      
      <p><strong>Entity Extraction:</strong> Identifying and extracting relevant information from user messages, such as dates, names, or product specifications.</p>
      
      <p><strong>Context Management:</strong> Maintaining conversation context across multiple interactions, remembering previous questions and responses.</p>
      
      <h3>Building Blocks of Intelligent Chatbots</h3>
      <ol>
        <li><strong>Preprocessing:</strong> Text cleaning, tokenization, and normalization</li>
        <li><strong>Feature Engineering:</strong> Converting text into numerical representations</li>
        <li><strong>Model Training:</strong> Using transformer models like BERT or GPT for understanding</li>
        <li><strong>Response Generation:</strong> Creating appropriate and contextual responses</li>
      </ol>
      
      <h3>Best Practices</h3>
      <p>Successful chatbot implementation requires careful planning of conversation flows, extensive training data, and continuous improvement based on user interactions.</p>
      
      <p>Remember: The goal isn't to replace human interaction, but to enhance it by handling routine queries efficiently while seamlessly escalating complex issues to human agents.</p>
    `,
    author: "Alex Rodriguez",
    publishedAt: "2024-01-14T14:30:00Z",
    source: "Medium",
    tags: ["Chatbots", "NLP", "AI Development", "Conversational AI"],
    readTime: 12,
    imageUrl: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800&h=400&fit=crop",
    url: "https://medium.com/@alexrodriguez/intelligent-chatbots",
    views: 8930
  },
  {
    id: "3",
    title: "Computer Vision in Healthcare: Diagnosing Diseases with AI",
    excerpt: "Discover how computer vision algorithms are helping doctors detect diseases earlier and more accurately than ever before.",
    content: "Full article content here...",
    author: "Dr. Priya Patel",
    publishedAt: "2024-01-13T09:15:00Z",
    source: "Hashnode",
    tags: ["Computer Vision", "Healthcare", "Medical AI", "Diagnosis"],
    readTime: 15,
    imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop",
    url: "https://hashnode.com/priyapatel/computer-vision-healthcare",
    views: 22150
  },
  {
    id: "4",
    title: "The Rise of Voice AI: Transforming Customer Service",
    excerpt: "How voice AI is revolutionizing customer support with 24/7 availability and natural conversation capabilities.",
    content: "Full article content here...",
    author: "Mike Johnson",
    publishedAt: "2024-01-12T16:45:00Z",
    source: "Dev.to",
    tags: ["Voice AI", "Customer Service", "Automation", "24/7 Support"],
    readTime: 7,
    imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop",
    url: "https://dev.to/mikejohnson/voice-ai-customer-service",
    views: 12780
  },
  {
    id: "5",
    title: "3D AI Avatars: The Next Frontier in Digital Interaction",
    excerpt: "Exploring the development of lifelike 3D AI avatars and their potential applications in virtual environments.",
    content: "Full article content here...",
    author: "Emma Wilson",
    publishedAt: "2024-01-11T11:20:00Z",
    source: "Medium",
    tags: ["3D AI", "Avatars", "Virtual Reality", "Digital Interaction"],
    readTime: 10,
    imageUrl: "https://images.unsplash.com/photo-1639322537228-f912d4e0b2b0?w=800&h=400&fit=crop",
    url: "https://medium.com/@emmawilson/3d-ai-avatars",
    views: 18650
  },
  {
    id: "6",
    title: "AI Ethics: Building Responsible Artificial Intelligence",
    excerpt: "Understanding the importance of ethical AI development and how to implement responsible practices in machine learning projects.",
    content: "Full article content here...",
    author: "Prof. David Kim",
    publishedAt: "2024-01-10T13:00:00Z",
    source: "Hashnode",
    tags: ["AI Ethics", "Responsible AI", "Machine Learning", "Governance"],
    readTime: 14,
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop",
    url: "https://hashnode.com/davidkim/ai-ethics",
    views: 9630
  }
];

// Function to fetch from Dev.to API (free)
async function fetchDevToPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch('https://dev.to/api/articles?tag=ai&per_page=10', {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch from Dev.to');
    }
    
    const data = await response.json();
    
    return data.map((post: any) => ({
      id: `devto-${post.id}`,
      title: post.title,
      excerpt: post.description,
      content: post.body_html, // Full content from Dev.to
      author: post.user.name,
      publishedAt: post.published_at,
      source: 'Dev.to',
      tags: post.tag_list || [],
      readTime: Math.ceil(post.reading_time_minutes || 5),
      imageUrl: post.cover_image,
      url: post.url,
      views: post.public_reactions_count
    }));
  } catch (error) {
    console.error('Error fetching Dev.to posts:', error);
    return [];
  }
}

// Function to fetch full content from RSS feeds (free)
async function fetchRSSContent(): Promise<BlogPost[]> {
  try {
    // For now, we'll use enhanced mock data with full content
    // In production, you can parse RSS feeds from AI blogs
    return [
      {
        id: "rss-1",
        title: "Advanced Machine Learning Techniques for Real-World Applications",
        excerpt: "Deep dive into practical ML implementations and best practices for production systems.",
        content: `
          <h2>Introduction to Production ML Systems</h2>
          <p>Building machine learning systems for production environments requires a different approach than research prototypes. This comprehensive guide covers the essential techniques and best practices for deploying ML models at scale.</p>
          
          <h3>Data Pipeline Architecture</h3>
          <p>The foundation of any successful ML system is a robust data pipeline. Here's what you need to consider:</p>
          
          <ul>
            <li><strong>Data Ingestion:</strong> Automated collection from multiple sources</li>
            <li><strong>Data Validation:</strong> Ensuring quality and consistency</li>
            <li><strong>Feature Engineering:</strong> Creating meaningful predictors</li>
            <li><strong>Model Training:</strong> Automated training pipelines</li>
            <li><strong>Model Deployment:</strong> Seamless production deployment</li>
          </ul>
          
          <h3>Model Monitoring and Maintenance</h3>
          <p>Once deployed, models require continuous monitoring to maintain performance. Key metrics to track include:</p>
          
          <blockquote>
            <p>"The best model is only as good as its monitoring system. Without proper oversight, even the most sophisticated algorithms can degrade over time."</p>
            <cite>— Dr. Maria Rodriguez, ML Engineering Lead</cite>
          </blockquote>
          
          <h3>Best Practices for Production ML</h3>
          <ol>
            <li>Implement automated testing for all ML components</li>
            <li>Use version control for models, data, and code</li>
            <li>Monitor model performance continuously</li>
            <li>Plan for model retraining and updates</li>
            <li>Ensure explainability and interpretability</li>
          </ol>
          
          <p>By following these guidelines, you can build ML systems that are not only accurate but also reliable, maintainable, and scalable in production environments.</p>
        `,
        author: "Tech Writer",
        publishedAt: "2024-01-14T09:00:00Z",
        source: "AI Tech Blog",
        tags: ["Machine Learning", "Production", "Best Practices", "AI Engineering"],
        readTime: 12,
        imageUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop",
        url: "https://medium.com/tech-blog/ml-techniques",
        views: 8500
      }
    ];
  } catch (error) {
    console.error('Error fetching RSS content:', error);
    return [];
  }
}

// Function to fetch from Medium RSS (free)
async function fetchMediumPosts(): Promise<BlogPost[]> {
  try {
    // For now, we'll use mock data for Medium
    // In production, you could parse RSS feeds or use Medium's API
    return [
      {
        id: "medium-1",
        title: "Advanced Machine Learning Techniques for Real-World Applications",
        excerpt: "Deep dive into practical ML implementations and best practices for production systems.",
        content: `
          <h2>Advanced Machine Learning in Production</h2>
          <p>Machine learning in production environments requires careful consideration of scalability, reliability, and maintainability. This comprehensive guide covers the essential aspects of deploying ML models at scale.</p>
          
          <h3>Key Considerations</h3>
          <ul>
            <li>Model versioning and deployment strategies</li>
            <li>Monitoring and alerting systems</li>
            <li>Data pipeline automation</li>
            <li>Performance optimization techniques</li>
          </ul>
          
          <p>Implementing these practices ensures your ML systems are robust, scalable, and maintainable in production environments.</p>
        `,
        author: "Tech Writer",
        publishedAt: "2024-01-13T14:30:00Z",
        source: "Medium",
        tags: ["Machine Learning", "Production", "Best Practices"],
        readTime: 12,
        imageUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop",
        url: "https://medium.com/tech-blog/ml-techniques",
        views: 8500
      }
    ];
  } catch (error) {
    console.error('Error fetching Medium posts:', error);
    return [];
  }
}

export async function GET() {
  try {
    // Fetch from multiple sources
    const [devToPosts, mediumPosts, rssPosts] = await Promise.all([
      fetchDevToPosts(),
      fetchMediumPosts(),
      fetchRSSContent()
    ]);

    // Combine all posts
    const allPosts = [
      ...mockPosts,
      ...devToPosts,
      ...mediumPosts,
      ...rssPosts
    ];

    // Sort by published date (latest first)
    const sortedPosts = allPosts.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    // Limit to 20 posts for performance
    const limitedPosts = sortedPosts.slice(0, 20);

    return NextResponse.json({
      success: true,
      posts: limitedPosts,
      total: limitedPosts.length,
      sources: ['Dev.to', 'Medium', 'Hashnode', 'AI Tech Blog'],
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in blog API:', error);
    
    // Return mock data as fallback
    return NextResponse.json({
      success: false,
      posts: mockPosts,
      total: mockPosts.length,
      error: 'Failed to fetch latest posts, showing cached content',
      lastUpdated: new Date().toISOString()
    });
  }
}

// Cache the response for 1 hour
export const revalidate = 3600;
