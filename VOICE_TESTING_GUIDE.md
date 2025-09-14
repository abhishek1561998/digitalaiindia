# Voice AI Testing Guide

This guide will help you test all the voice features of your AI machine agent system.

## 🚀 Quick Test Checklist

### Prerequisites
- [ ] ElevenLabs API key added to `.env.local`
- [ ] Development server running (`npm run dev`)
- [ ] Microphone permissions granted in browser
- [ ] Audio output working

### Test Pages
- [ ] **Main Page**: `/ai-machine-agent` - Check voice demo links
- [ ] **Voice Showcase**: `/voice-showcase` - Full featured experience
- [ ] **Simple Demo**: `/voice-demo` - Basic voice chat

## 🎤 Voice Input Testing

### Speech-to-Text Tests
1. **Basic Speech Recognition**
   - [ ] Click microphone button
   - [ ] Speak clearly: "Hello, how are you?"
   - [ ] Verify text appears in chat
   - [ ] Check audio level visualization works

2. **Different Languages**
   - [ ] Test English: "What's the weather like?"
   - [ ] Test Hindi: "आप कैसे हैं?" (if supported)
   - [ ] Verify accurate transcription

3. **Audio Quality Tests**
   - [ ] Test with clear speech
   - [ ] Test with background noise
   - [ ] Test with different volumes
   - [ ] Verify error handling for poor audio

### Voice Controls
- [ ] Start/stop recording works
- [ ] Audio level indicator animates
- [ ] Recording stops automatically after silence
- [ ] Error messages show for microphone issues

## 🔊 Voice Output Testing

### Text-to-Speech Tests
1. **Basic TTS**
   - [ ] Send text message: "Hello, I'm your AI assistant"
   - [ ] Verify audio plays automatically in voice mode
   - [ ] Check audio quality and clarity

2. **Voice Settings**
   - [ ] Open voice settings panel
   - [ ] Test different voice options (Adam, Bella, Arnold, etc.)
   - [ ] Adjust stability slider (0.0 to 1.0)
   - [ ] Adjust similarity boost (0.0 to 1.0)
   - [ ] Toggle speaker boost on/off
   - [ ] Verify changes affect voice output

3. **Voice Customization**
   - [ ] Test low stability (0.1) - more variation
   - [ ] Test high stability (0.9) - more consistent
   - [ ] Test different similarity boost levels
   - [ ] Verify voice changes are applied

## 💬 Conversation Testing

### Chat Integration
1. **Voice to Text Chat**
   - [ ] Speak: "Tell me about artificial intelligence"
   - [ ] Verify message appears in chat
   - [ ] Check AI response is generated
   - [ ] Verify response is spoken back (in voice mode)

2. **Mixed Mode Chat**
   - [ ] Send text message: "What's 2+2?"
   - [ ] Switch to voice mode
   - [ ] Speak: "What about 3+3?"
   - [ ] Verify both text and voice work together

3. **Conversation Memory**
   - [ ] Start new conversation
   - [ ] Say: "My name is John"
   - [ ] Ask: "What's my name?"
   - [ ] Verify AI remembers context

### Backend Integration
- [ ] Messages are saved to Convex database
- [ ] Voice indicators show in message history
- [ ] LangGraph tools work with voice input
- [ ] Conversation context is maintained

## 👤 Avatar Testing

### Avatar Selection
- [ ] Multiple avatars are available
- [ ] Avatar selection works
- [ ] Selected avatar shows in interface
- [ ] Avatar image loads correctly

### Avatar Voice Integration
- [ ] Voice settings apply to selected avatar
- [ ] Speaking animation works during TTS
- [ ] Avatar visual feedback during conversation

## 🎯 Advanced Features

### Error Handling
- [ ] Test with no microphone access
- [ ] Test with poor internet connection
- [ ] Test with invalid API key
- [ ] Verify graceful error messages

### Performance
- [ ] Voice processing is fast (< 2 seconds)
- [ ] Audio playback starts quickly
- [ ] No memory leaks during long conversations
- [ ] Smooth animations and transitions

### Browser Compatibility
- [ ] Chrome/Chromium - Full support
- [ ] Firefox - Full support
- [ ] Safari - Basic support (may need HTTPS)
- [ ] Edge - Full support

## 🐛 Common Issues & Solutions

### Microphone Not Working
- **Issue**: "Microphone access denied"
- **Solution**: Check browser permissions, ensure HTTPS in production

### Audio Not Playing
- **Issue**: No sound from TTS
- **Solution**: Check browser audio settings, verify ElevenLabs API key

### Poor Speech Recognition
- **Issue**: Inaccurate transcription
- **Solution**: Speak clearly, check microphone quality, reduce background noise

### Voice Settings Not Applied
- **Issue**: Voice sounds the same after changes
- **Solution**: Refresh page, check API key, verify settings are saved

## 📊 Performance Benchmarks

### Expected Performance
- **Speech-to-Text**: < 2 seconds
- **Text-to-Speech**: < 3 seconds
- **Audio Quality**: 44.1kHz, clear voice
- **Response Time**: < 5 seconds total

### Monitoring Points
- [ ] API response times
- [ ] Audio processing latency
- [ ] Memory usage during long conversations
- [ ] Error rates and types

## 🚀 Production Readiness Checklist

### Security
- [ ] API keys are environment variables
- [ ] User authentication works
- [ ] Audio data is not stored permanently
- [ ] HTTPS enforced in production

### Scalability
- [ ] Multiple users can use voice simultaneously
- [ ] Database handles conversation history
- [ ] API rate limits are respected
- [ ] Error handling is robust

### User Experience
- [ ] Clear visual feedback for all states
- [ ] Intuitive voice controls
- [ ] Responsive design works on mobile
- [ ] Loading states and error messages

## 🎉 Success Criteria

Your voice AI system is ready when:
- [ ] Users can have natural voice conversations
- [ ] Voice quality is clear and natural
- [ ] Settings can be customized
- [ ] Conversations are persistent
- [ ] Error handling is graceful
- [ ] Performance is smooth and fast

## 📝 Test Results Template

```
Date: ___________
Tester: ___________
Browser: ___________
Environment: ___________

Voice Input: ✅/❌
Voice Output: ✅/❌
Avatar System: ✅/❌
Settings Panel: ✅/❌
Backend Integration: ✅/❌
Error Handling: ✅/❌
Performance: ✅/❌

Notes:
- 
- 
- 

Overall Rating: ⭐⭐⭐⭐⭐
```

---

**Happy Testing!** 🎤✨

Your AI voice agent should now provide a seamless, professional voice conversation experience that rivals the best voice AI platforms in the market.
