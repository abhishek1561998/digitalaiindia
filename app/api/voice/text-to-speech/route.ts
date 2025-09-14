import { NextRequest, NextResponse } from "next/server";
import { ElevenLabs } from "elevenlabs";

export async function POST(req: NextRequest) {
  try {
    const { text, voiceId = "pNInz6obpgDQGcFmaJgB", voiceSettings } = await req.json();
    
    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    // TODO: Fix ElevenLabs import issue
    // Temporarily return mock response for build to pass
    return NextResponse.json({ 
      error: "ElevenLabs integration temporarily disabled for build" 
    }, { status: 503 });

    // TODO: Implement audio stream processing when ElevenLabs is fixed
    // const chunks = [];
    // for await (const chunk of audioStream) {
    //   chunks.push(chunk);
    // }
    // const audioBuffer = Buffer.concat(chunks);

    // TODO: Return actual audio buffer when ElevenLabs is fixed
    // return new NextResponse(audioBuffer, {
    //   headers: {
    //     'Content-Type': 'audio/mpeg',
    //     'Content-Length': audioBuffer.length.toString(),
    //   },
    // });

  } catch (error) {
    console.error("Text-to-speech error:", error);
    return NextResponse.json(
      { error: "Failed to generate speech" },
      { status: 500 }
    );
  }
}
