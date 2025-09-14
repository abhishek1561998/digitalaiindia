import { NextRequest, NextResponse } from "next/server";
import { ElevenLabs } from "@elevenlabs/elevenlabs-js";

export async function POST(req: NextRequest) {
  try {
    const { text, voiceId = "pNInz6obpgDQGcFmaJgB", voiceSettings } = await req.json();
    
    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    // Initialize ElevenLabs client
    const elevenlabs = new ElevenLabs({
      apiKey: process.env.ELEVENLABS_API_KEY || '',
    });

    // Generate speech
    const audioStream = await elevenlabs.generate({
      voice: voiceId,
      text: text,
      voice_settings: voiceSettings || {
        stability: 0.5,
        similarity_boost: 0.5,
        style: 0.0,
        use_speaker_boost: true
      },
      model_id: "eleven_multilingual_v2"
    });

    // Convert stream to buffer
    const chunks = [];
    for await (const chunk of audioStream) {
      chunks.push(chunk);
    }
    const audioBuffer = Buffer.concat(chunks);

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error("Text-to-speech error:", error);
    return NextResponse.json(
      { error: "Failed to generate speech" },
      { status: 500 }
    );
  }
}
