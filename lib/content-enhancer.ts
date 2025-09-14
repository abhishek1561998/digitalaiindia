// Content enhancement utilities for blog posts

export interface EnhancedContent {
  originalContent: string;
  enhancedContent: string;
  wordCount: number;
  readingTime: number;
  hasCode: boolean;
  hasImages: boolean;
  hasLists: boolean;
}

/**
 * Enhances blog content with better formatting and additional elements
 */
export function enhanceContent(content: string, title: string, source: string): EnhancedContent {
  // Handle null/undefined content
  if (!content || typeof content !== 'string') {
    content = '<p>Content not available.</p>';
  }
  
  let enhancedContent = content;

  // Add a custom intro for Digitalai India blog
  const customIntro = `
    <div class="custom-intro" style="background: linear-gradient(135deg, rgba(250,204,21,0.1), rgba(249,115,22,0.1)); padding: 1.5rem; border-radius: 1rem; border-left: 4px solid #f59e0b; margin-bottom: 2rem;">
      <p style="margin: 0; color: #e5e7eb; font-style: italic;">
        <strong style="color: #fbbf24;">Digitalai India Insight:</strong> 
        This article explores cutting-edge AI technologies and their real-world applications. 
        Discover how artificial intelligence is transforming industries and shaping the future.
      </p>
    </div>
  `;

  // Add custom conclusion
  const customConclusion = `
    <div class="custom-conclusion" style="background: linear-gradient(135deg, rgba(250,204,21,0.05), rgba(249,115,22,0.05)); padding: 1.5rem; border-radius: 1rem; border: 1px solid rgba(245,158,11,0.2); margin-top: 2rem;">
      <h3 style="color: #fbbf24; margin-top: 0;">🚀 Ready to Implement AI Solutions?</h3>
      <p style="margin-bottom: 1rem; color: #d1d5db;">
        At Digitalai India, we specialize in bringing AI innovations to life. 
        Whether you need 3D AI chatbots, voice AI systems, or intelligent automation, 
        our team is ready to help you transform your business with cutting-edge AI technology.
      </p>
      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        <a href="/" style="display: inline-flex; align-items: center; padding: 0.75rem 1.5rem; background: linear-gradient(135deg, #f59e0b, #ea580c); color: white; text-decoration: none; border-radius: 0.5rem; font-weight: 600; transition: all 0.3s ease;">
          Explore Our AI Solutions
        </a>
        <a href="#contact" style="display: inline-flex; align-items: center; padding: 0.75rem 1.5rem; background: rgba(245,158,11,0.1); color: #fbbf24; text-decoration: none; border: 1px solid rgba(245,158,11,0.3); border-radius: 0.5rem; font-weight: 600; transition: all 0.3s ease;">
          Get 24/7 AI Support
        </a>
      </div>
    </div>
  `;

  // Insert custom intro after the first paragraph
  enhancedContent = insertAfterFirstParagraph(enhancedContent, customIntro);

  // Add custom conclusion at the end
  enhancedContent += customConclusion;

  // Enhance code blocks with better styling
  enhancedContent = enhanceCodeBlocks(enhancedContent);

  // Enhance images with captions and better styling
  enhancedContent = enhanceImages(enhancedContent);

  // Calculate content metrics
  const wordCount = countWords(enhancedContent);
  const readingTime = Math.ceil(wordCount / 200); // 200 words per minute
  const hasCode = /<pre|<code/.test(enhancedContent);
  const hasImages = /<img/.test(enhancedContent);
  const hasLists = /<ul|<ol/.test(enhancedContent);

  return {
    originalContent: content,
    enhancedContent,
    wordCount,
    readingTime,
    hasCode,
    hasImages,
    hasLists
  };
}

function insertAfterFirstParagraph(content: string, insertHtml: string): string {
  // Handle null/undefined content
  if (!content || typeof content !== 'string') {
    return insertHtml + '<p>Content not available.</p>';
  }
  
  // Find the first paragraph and insert after it
  const firstParagraphMatch = content.match(/<p[^>]*>.*?<\/p>/);
  if (firstParagraphMatch) {
    const insertIndex = firstParagraphMatch.index! + firstParagraphMatch[0].length;
    return content.slice(0, insertIndex) + insertHtml + content.slice(insertIndex);
  }
  return insertHtml + content;
}

function enhanceCodeBlocks(content: string): string {
  // Handle null/undefined content
  if (!content || typeof content !== 'string') {
    return '';
  }
  
  // Add better styling to code blocks
  return content.replace(
    /<pre([^>]*)>/g,
    '<pre$1 style="background: #1f2937; border: 1px solid #374151; border-radius: 0.5rem; padding: 1.5rem; overflow-x: auto; position: relative;"><div style="position: absolute; top: 0.5rem; right: 0.5rem; background: rgba(245,158,11,0.1); color: #fbbf24; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 600;">Code</div>'
  );
}

function enhanceImages(content: string): string {
  // Handle null/undefined content
  if (!content || typeof content !== 'string') {
    return '';
  }
  
  // Add better styling to images
  return content.replace(
    /<img([^>]*)>/g,
    '<img$1 style="border-radius: 0.75rem; box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.3); margin: 1.5rem 0; max-width: 100%; height: auto;">'
  );
}

function countWords(text: string): number {
  // Handle null/undefined text
  if (!text || typeof text !== 'string') {
    return 0;
  }
  
  // Remove HTML tags and count words
  const cleanText = text.replace(/<[^>]*>/g, '');
  return cleanText.split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Add related content suggestions based on the current article
 */
export function generateRelatedContent(tags: string[], source: string): string[] {
  const suggestions = [];

  if (tags.includes('AI') || tags.includes('Machine Learning')) {
    suggestions.push('3D AI Chatbot Development');
    suggestions.push('AI Voice Integration');
  }

  if (tags.includes('Chatbots') || tags.includes('NLP')) {
    suggestions.push('Conversational AI Best Practices');
    suggestions.push('Natural Language Processing');
  }

  if (tags.includes('Automation')) {
    suggestions.push('AI Process Automation');
    suggestions.push('24/7 AI Support Systems');
  }

  if (source === 'Dev.to') {
    suggestions.push('Developer AI Tools');
    suggestions.push('AI API Integration');
  }

  return suggestions.slice(0, 3); // Return top 3 suggestions
}
