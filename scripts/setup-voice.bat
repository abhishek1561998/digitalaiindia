@echo off
echo 🎤 Setting up AI Voice Agent...
echo ================================

REM Check if .env.local exists
if not exist ".env.local" (
    echo 📝 Creating .env.local file...
    echo # Voice AI Configuration > .env.local
    echo ELEVENLABS_API_KEY=your_elevenlabs_api_key_here >> .env.local
    echo. >> .env.local
    echo # Other environment variables... >> .env.local
    echo ✅ Created .env.local file
) else (
    echo ✅ .env.local file already exists
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
    echo ✅ Dependencies installed
) else (
    echo ✅ Dependencies already installed
)

echo.
echo 🎯 Next Steps:
echo 1. Update ELEVENLABS_API_KEY in .env.local
echo 2. Run 'npm run dev' to start the server
echo 3. Visit http://localhost:3000/voice-showcase
echo 4. Test your voice AI system!
echo.
echo 📚 Documentation:
echo - Setup Guide: VOICE_SETUP.md
echo - Testing Guide: VOICE_TESTING_GUIDE.md
echo.
echo 🎉 Voice AI setup complete!
pause
