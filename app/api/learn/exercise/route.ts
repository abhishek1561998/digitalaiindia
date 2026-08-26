import { NextResponse } from "next/server";
import { checkExercise } from "@/lib/server/exercise-registry";

// Grading only — no session required. Exercises are practice: they award no
// XP, write no progress and read nothing about the learner. The lesson's
// quiz is still what gates completion.
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const trackId = String(body.trackId || "").trim();
  const stage = Number(body.stage);
  const index = Number(body.index);

  if (!trackId || Number.isNaN(stage) || Number.isNaN(index)) {
    return NextResponse.json(
      { error: "trackId, stage and index are required" },
      { status: 400 },
    );
  }

  const result = checkExercise(trackId, stage, index, body.answer);
  if (!result) {
    return NextResponse.json({ error: "No such exercise" }, { status: 404 });
  }

  return NextResponse.json(result);
}
