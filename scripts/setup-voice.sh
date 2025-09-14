#!/bin/bash

# Voice AI Setup Script
# This script helps set up the voice AI system

echo "🎤 Setting up AI Voice Agent..."
echo "================================"

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local file..."
    touch .env.local
    echo "# Voice AI Configuration" >> .env.local
    echo "ELEVENLABS_API_KEY=your_elevenlabs_api_key_here" >> .env.local
    echo "" >> .env.local
    echo "# Other environment variables..." >> .env.local
    echo "✅ Created .env.local file"
else
    echo "✅ .env.local file already exists"
fi

# Check if ElevenLabs API key is set
if grep -q "ELEVENLABS_API_KEY=your_elevenlabs_api_key_here" .env.local; then
    echo "⚠️  Please update ELEVENLABS_API_KEY in .env.local with your actual API key"
    echo "   Get your API key from: https://elevenlabs.io"
else
    echo "✅ ElevenLabs API key appears to be configured"
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi

# Check if development server is running
if pgrep -f "next dev" > /dev/null; then
    echo "🚀 Development server is already running"
else
    echo "🚀 Starting development server..."
    echo "   Run 'npm run dev' in another terminal"
fi

echo ""
echo "🎯 Next Steps:"
echo "1. Update ELEVENLABS_API_KEY in .env.local"
echo "2. Run 'npm run dev' to start the server"
echo "3. Visit http://localhost:3000/voice-showcase"
echo "4. Test your voice AI system!"
echo ""
echo "📚 Documentation:"
echo "- Setup Guide: VOICE_SETUP.md"
echo "- Testing Guide: VOICE_TESTING_GUIDE.md"
echo ""
echo "🎉 Voice AI setup complete!"
