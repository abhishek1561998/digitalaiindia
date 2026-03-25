import { NextResponse } from "next/server";
import { generateVoiceMeta } from "@/lib/server/mock-ai";
import { ApiAuthError, validateApiKeyAndConsume } from "@/lib/server/usage";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const text = String(body.text || "").trim();
    const voice = String(body.voice || "Priya").trim();

    if (!text) {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }

    const usage = await validateApiKeyAndConsume(req.headers);

    return NextResponse.json({
      id: `voice_${Math.random().toString(36).slice(2, 10)}`,
      ...generateVoiceMeta(text, voice),
      usage,
    });
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("voice_api_error", error);
    return NextResponse.json({ error: "Failed to process voice request" }, { status: 500 });
  }
}
