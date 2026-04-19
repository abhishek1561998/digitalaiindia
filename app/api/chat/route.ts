import { NextResponse } from "next/server";
import { generateChatReply } from "@/lib/server/mock-ai";
import { ApiAuthError, validateApiKeyAndConsume } from "@/lib/server/usage";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const prompt = String(body.prompt || "").trim();

    if (!prompt) {
      return NextResponse.json({ error: "prompt is required" }, { status: 400 });
    }

    const usage = await validateApiKeyAndConsume(req.headers);

    return NextResponse.json({
      id: `resp_${Math.random().toString(36).slice(2, 10)}`,
      content: generateChatReply(prompt),
      model: "dai-chat-v1-mock",
      tokens_used: Math.max(12, Math.floor(prompt.length * 1.7)),
      usage,
    });
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("chat_api_error", error);
    return NextResponse.json({ error: "Failed to process chat request" }, { status: 500 });
  }
}
