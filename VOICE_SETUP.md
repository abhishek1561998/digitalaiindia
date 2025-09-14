# AI Voice Agent Setup Guide

This guide will help you set up the real-time voice conversation system using ElevenLabs.

## Prerequisites

1. **ElevenLabs Account**: Sign up at [elevenlabs.io](https://elevenlabs.io)
2. **API Key**: Get your API key from the ElevenLabs dashboard
3. **Microphone Access**: Ensure your browser has microphone permissions

## Environment Setup

Create a `.env.local` file in your project root with:

```env
# ElevenLabs API Configuration
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

# Other existing environment variables...
```

## Features Implemented

### 🎤 Voice Input (Speech-to-Text)
- Real-time audio recording with WebRTC
- Audio level visualization with animated indicators
- Automatic speech-to-text conversion using ElevenLabs Whisper
- Support for multiple languages and accents

### 🔊 Voice Output (Text-to-Speech)
- High-quality AI voice synthesis using ElevenLabs
- Multiple voice options and customization
- Real-time audio playback with proper cleanup
- Voice settings customization (stability, similarity, style)

### 💬 Integrated Voice Chat System
- **Full Backend Integration**: Connected to LangGraph conversation flow
- **Database Persistence**: Messages stored in Convex with voice indicators
- **Real-time Streaming**: Server-sent events for live conversation
- **Dual Mode**: Seamless switching between voice and text
- **Memory & Context**: Conversation history maintained across sessions
- **Tool Integration**: Works with existing wxflows tools and LangGraph agents

## API Routes Created

1. **`/api/voice/speech-to-text`** - Converts audio to text using ElevenLabs Whisper
2. **`/api/voice/text-to-speech`** - Converts text to speech using ElevenLabs TTS
3. **`/api/voice/chat`** - Integrated voice chat with LangGraph and Convex backend

## Components Created

1. **`VoiceConversation`** - Core voice interaction component with audio visualization
2. **`VoiceChat`** - Complete integrated chat interface with backend connectivity
3. **`VoiceChatInterface`** - Standalone voice chat interface (legacy)
4. **Voice Demo Page** - `/voice-demo` route with full backend integration

## Usage

### Quick Start
1. **Set up environment**: Add your ElevenLabs API key to `.env.local`
2. **Navigate to demo**: Go to `/voice-demo` to test the voice functionality
3. **Create chat session**: Click "Start Voice Chat" to create a new conversation
4. **Voice interaction**: 
   - Click the microphone to start recording
   - Speak your message naturally
   - AI will respond with both text and voice
   - Toggle between voice and text modes as needed

### Integration with Existing System
The voice system is fully integrated with your existing:
- **LangGraph conversation flow** - Uses your existing AI agent logic
- **Convex database** - Messages are persisted with voice indicators
- **wxflows tools** - All your existing tools work with voice input
- **Authentication** - Uses Clerk for user management

## Voice Settings

You can customize voice settings in the TTS API call:

```typescript
{
  voice_settings: {
    stability: 0.5,        // Voice stability (0-1)
    similarity_boost: 0.5,  // Voice similarity (0-1)
    style: 0.0,            // Voice style (0-1)
    use_speaker_boost: true // Speaker boost
  }
}
```

## Browser Compatibility

- Chrome/Chromium: Full support
- Firefox: Full support
- Safari: Limited support (may need HTTPS)
- Edge: Full support

## Troubleshooting

### Microphone Not Working
- Check browser permissions
- Ensure HTTPS in production
- Test microphone in other applications

### Audio Playback Issues
- Check browser audio settings
- Ensure no audio conflicts
- Try different browsers

### API Errors
- Verify ElevenLabs API key
- Check API quota limits
- Ensure proper environment variables

## Next Steps

1. Add more voice options and languages
2. Implement voice cloning for custom voices
3. Add conversation memory and context
4. Integrate with your existing chat system
5. Add voice emotion detection

## Demo Pages

### 🎯 Voice Showcase (`/voice-showcase`)
- **Complete voice experience** with avatar selection
- **Advanced voice settings** and customization
- **Real-time conversation** with full backend integration
- **Professional presentation** with feature highlights

### 🚀 Simple Voice Demo (`/voice-demo`)
- **Quick voice chat** for testing
- **Basic voice functionality** demonstration
- **Minimal interface** for easy testing

### 🏠 Main AI Agent Page (`/ai-machine-agent`)
- **Landing page** with voice demo links
- **Feature overview** and capabilities
- **Integration examples** and use cases

## Quick Start

1. **Set up environment**: Add your ElevenLabs API key to `.env.local`
2. **Visit showcase**: Go to `/voice-showcase` for the complete experience
3. **Create chat session**: Click "Start Voice Conversation"
4. **Choose avatar**: Select from available AI avatars
5. **Start talking**: Click microphone and speak naturally
6. **Customize voice**: Adjust voice settings for optimal experience

## Production Ready Features

✅ **Real-time Voice Processing** - WebRTC audio capture and ElevenLabs synthesis  
✅ **Backend Integration** - Full LangGraph and Convex integration  
✅ **Avatar System** - Multiple AI personas with voice customization  
✅ **Voice Settings** - Professional-grade voice parameter controls  
✅ **Error Handling** - Robust error management and user feedback  
✅ **Responsive Design** - Works on desktop and mobile devices  
✅ **Authentication** - Secure user management with Clerk  
✅ **Database Persistence** - Conversation history and context preservation
