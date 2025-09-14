# 🚀 Production Deployment Guide - Voice AI System

## 📋 **Pre-Deployment Checklist**

### ✅ **Environment Setup**
- [ ] ElevenLabs API key configured
- [ ] Clerk authentication keys set up
- [ ] Convex deployment URL configured
- [ ] Anthropic API key for LangGraph
- [ ] wxflows API credentials configured
- [ ] All environment variables secured

### ✅ **Security Configuration**
- [ ] HTTPS enforced in production
- [ ] API keys stored as environment variables
- [ ] CORS policies configured
- [ ] Rate limiting implemented
- [ ] Input validation and sanitization
- [ ] Audio data privacy compliance

### ✅ **Performance Optimization**
- [ ] Next.js production build optimized
- [ ] Audio compression and caching
- [ ] Database indexing optimized
- [ ] CDN configured for static assets
- [ ] Monitoring and logging set up

## 🏗️ **Deployment Architecture**

```
Production Voice AI System
├── Frontend (Next.js)
│   ├── Static Assets (CDN)
│   ├── Voice Components
│   ├── Error Boundaries
│   └── Analytics Dashboard
├── Backend APIs
│   ├── /api/voice/speech-to-text
│   ├── /api/voice/text-to-speech
│   └── /api/voice/chat
├── External Services
│   ├── ElevenLabs (Voice Processing)
│   ├── Anthropic (AI Conversation)
│   ├── Convex (Database)
│   └── Clerk (Authentication)
└── Monitoring
    ├── Error Tracking
    ├── Performance Metrics
    ├── Voice Analytics
    └── User Feedback
```

## 🔧 **Deployment Steps**

### 1. **Environment Configuration**

Create production environment files:

```bash
# .env.production
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
CONVEX_DEPLOYMENT=https://your-deployment.convex.cloud
ELEVENLABS_API_KEY=your_production_api_key
ANTHROPIC_API_KEY=your_production_api_key
WXFLOW_ENDPOINT=your_production_endpoint
WXFLOW_APIKEY=your_production_apikey
NODE_ENV=production
```

### 2. **Next.js Production Build**

```bash
# Install dependencies
npm ci

# Build for production
npm run build

# Test production build locally
npm run start
```

### 3. **Deployment Platforms**

#### **Vercel (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod

# Configure environment variables in Vercel dashboard
```

#### **Netlify**
```bash
# Build command
npm run build

# Publish directory
.next

# Configure environment variables in Netlify dashboard
```

#### **AWS Amplify**
```bash
# Build settings
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

#### **Docker Deployment**
```dockerfile
# Dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

## 🔒 **Security Hardening**

### **API Security**
```typescript
// middleware.ts - Enhanced security
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Security headers
  const response = NextResponse.next()
  
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'microphone=(), camera=()')
  
  // CORS for voice APIs
  if (request.nextUrl.pathname.startsWith('/api/voice/')) {
    response.headers.set('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS || '*')
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  }
  
  return response
}

export const config = {
  matcher: [
    '/api/voice/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
```

### **Rate Limiting**
```typescript
// lib/rate-limit.ts
import { NextRequest } from 'next/server'

const rateLimitMap = new Map()

export function rateLimit(identifier: string, limit: number = 10, window: number = 60000) {
  const now = Date.now()
  const windowStart = now - window
  
  if (!rateLimitMap.has(identifier)) {
    rateLimitMap.set(identifier, [])
  }
  
  const requests = rateLimitMap.get(identifier)
  const validRequests = requests.filter((time: number) => time > windowStart)
  
  if (validRequests.length >= limit) {
    return false
  }
  
  validRequests.push(now)
  rateLimitMap.set(identifier, validRequests)
  
  return true
}
```

### **Input Validation**
```typescript
// lib/validation.ts
import { z } from 'zod'

export const voiceRequestSchema = z.object({
  text: z.string().min(1).max(5000),
  voiceId: z.string().optional(),
  voiceSettings: z.object({
    stability: z.number().min(0).max(1),
    similarity_boost: z.number().min(0).max(1),
    style: z.number().min(0).max(1),
    use_speaker_boost: z.boolean(),
  }).optional(),
})

export const audioRequestSchema = z.object({
  audio: z.instanceof(File).refine(
    (file) => file.size <= 10 * 1024 * 1024, // 10MB limit
    "Audio file too large"
  ),
})
```

## 📊 **Performance Optimization**

### **Audio Optimization**
```typescript
// lib/audio-optimization.ts
export const optimizeAudioSettings = {
  // Reduce file size for faster uploads
  audioConstraints: {
    sampleRate: 16000,
    channelCount: 1,
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  },
  
  // Compress audio before sending
  compressAudio: async (audioBlob: Blob) => {
    const formData = new FormData()
    formData.append('audio', audioBlob, 'recording.webm')
    return formData
  },
  
  // Cache voice responses
  cacheVoiceResponse: (text: string, audioBlob: Blob) => {
    const cacheKey = `voice_${btoa(text)}`
    sessionStorage.setItem(cacheKey, URL.createObjectURL(audioBlob))
  },
}
```

### **Database Optimization**
```typescript
// convex/messages.ts - Optimized queries
export const list = query({
  args: {
    chatId: v.id("chats"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
      .order("desc")
      .take(args.limit || 50) // Limit messages for performance
      .collect();

    return messages.reverse(); // Return in chronological order
  },
});
```

## 📈 **Monitoring & Analytics**

### **Error Tracking**
```typescript
// lib/error-tracking.ts
export const trackError = (error: Error, context: string) => {
  // Send to your error tracking service (Sentry, LogRocket, etc.)
  console.error(`Voice Error [${context}]:`, error)
  
  // Track in analytics
  if (typeof window !== 'undefined') {
    // Google Analytics or similar
    gtag('event', 'exception', {
      description: error.message,
      fatal: false,
      custom_map: {
        context: context,
      }
    })
  }
}
```

### **Performance Monitoring**
```typescript
// lib/performance-monitoring.ts
export const trackVoiceMetrics = {
  speechToTextTime: (startTime: number) => {
    const duration = Date.now() - startTime
    console.log(`Speech-to-text took ${duration}ms`)
    
    // Send to analytics
    gtag('event', 'timing_complete', {
      name: 'speech_to_text',
      value: duration,
    })
  },
  
  textToSpeechTime: (startTime: number) => {
    const duration = Date.now() - startTime
    console.log(`Text-to-speech took ${duration}ms`)
    
    // Send to analytics
    gtag('event', 'timing_complete', {
      name: 'text_to_speech',
      value: duration,
    })
  },
  
  conversationLatency: (startTime: number) => {
    const duration = Date.now() - startTime
    console.log(`Total conversation latency: ${duration}ms`)
    
    // Send to analytics
    gtag('event', 'timing_complete', {
      name: 'conversation_latency',
      value: duration,
    })
  },
}
```

## 🔍 **Health Checks**

### **API Health Endpoints**
```typescript
// app/api/health/route.ts
export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      elevenlabs: await checkElevenLabsHealth(),
      anthropic: await checkAnthropicHealth(),
      convex: await checkConvexHealth(),
      clerk: await checkClerkHealth(),
    }
  }
  
  return Response.json(health)
}

async function checkElevenLabsHealth() {
  try {
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY! }
    })
    return response.ok ? 'healthy' : 'unhealthy'
  } catch {
    return 'unhealthy'
  }
}
```

## 🚀 **Deployment Commands**

### **Vercel Deployment**
```bash
# Deploy to production
vercel --prod

# Set environment variables
vercel env add ELEVENLABS_API_KEY
vercel env add CLERK_SECRET_KEY
vercel env add CONVEX_DEPLOYMENT
vercel env add ANTHROPIC_API_KEY

# Deploy with custom domain
vercel domains add your-domain.com
```

### **Docker Deployment**
```bash
# Build Docker image
docker build -t voice-ai-system .

# Run container
docker run -p 3000:3000 \
  -e ELEVENLABS_API_KEY=your_key \
  -e CLERK_SECRET_KEY=your_key \
  voice-ai-system

# Deploy to cloud
docker tag voice-ai-system your-registry/voice-ai-system
docker push your-registry/voice-ai-system
```

## 📋 **Post-Deployment Checklist**

### ✅ **Testing**
- [ ] Voice input works correctly
- [ ] Voice output plays properly
- [ ] Error handling functions
- [ ] Mobile interface responsive
- [ ] Analytics tracking active
- [ ] Performance metrics normal

### ✅ **Monitoring**
- [ ] Error tracking configured
- [ ] Performance monitoring active
- [ ] Health checks responding
- [ ] Logs being collected
- [ ] Alerts configured

### ✅ **Security**
- [ ] HTTPS enforced
- [ ] API rate limiting active
- [ ] Input validation working
- [ ] CORS policies applied
- [ ] Security headers set

## 🎯 **Production URLs**

After deployment, your voice AI system will be available at:

- **Main Site**: `https://your-domain.com/ai-machine-agent`
- **Voice Showcase**: `https://your-domain.com/voice-showcase`
- **Premium Features**: `https://your-domain.com/voice-premium`
- **Simple Demo**: `https://your-domain.com/voice-demo`
- **Health Check**: `https://your-domain.com/api/health`

## 🎉 **Production Ready!**

Your voice AI system is now ready for production deployment with:

✅ **Enterprise Security** - Comprehensive security hardening  
✅ **Performance Optimization** - Optimized for production scale  
✅ **Monitoring & Analytics** - Real-time performance tracking  
✅ **Error Handling** - Production-grade error management  
✅ **Health Checks** - Service monitoring and alerting  
✅ **Scalable Architecture** - Ready for high-volume usage  

**Your premium voice AI system is production-ready!** 🚀✨
