import { NextResponse } from "next/server";
import { generateDesignMock } from "@/lib/server/mock-ai";
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
      ...generateDesignMock(prompt),
      usage,
    });
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("design_api_error", error);
    return NextResponse.json({ error: "Failed to process design request" }, { status: 500 });
  }
}
