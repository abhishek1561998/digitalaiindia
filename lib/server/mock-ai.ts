const chatReplies = [
  "AI is software that learns patterns from data to generate predictions, text, speech, or actions.",
  "Think of AI as a system that can understand language, reason from examples, and automate decisions.",
  "Modern AI apps combine language models, retrieval, and workflows to solve real product problems quickly.",
];

export function generateChatReply(prompt: string) {
  const base = chatReplies[Math.floor(Math.random() * chatReplies.length)];
  return `${base}\n\nPrompt received: \"${prompt.slice(0, 180)}\"`;
}

export function generateVoiceMeta(text: string, voice = "Priya") {
  const durationSec = Math.max(1.2, text.length * 0.06);
  return {
    voice,
    durationSec: Number(durationSec.toFixed(1)),
    format: "mp3",
    message: "Mock synthesis complete",
  };
}

export function generate3DMock(prompt: string) {
  return {
    assetId: `asset_${Math.random().toString(36).slice(2, 10)}`,
    format: "glb",
    style: "low-poly",
    prompt,
    previewUrl: "/mock/3d-preview.glb",
  };
}

export function generateDesignMock(prompt: string) {
  return {
    type: "component",
    prompt,
    css: `.card {\n  border-radius: 16px;\n  padding: 16px;\n  background: linear-gradient(145deg, #1f2937, #111827);\n  color: #f9fafb;\n}`,
  };
}
