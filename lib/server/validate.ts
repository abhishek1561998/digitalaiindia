// Request validation for the Learn APIs.
//
// Both write endpoints took `trackId` and `stage` straight from the body and
// passed them to Prisma. An authenticated user could therefore create
// TrackEnrollment rows for tracks that don't exist, and write arbitrary
// stage keys — including negative and enormous ones — into the
// stageProgress JSON, growing the blob without bound and skewing every
// percentage computed from it.
//
// Validating against the catalogue closes both: a track has to be one we
// ship, and a stage has to be a real lesson inside it.

import { getCourse } from "@/lib/learn/catalog";

export type Validated = { trackId: string; stage: number };

export function validTrack(raw: unknown): string | null {
  const id = String(raw ?? "").trim();
  if (!id) return null;
  const course = getCourse(id);
  // Return the canonical id, not what was sent — a legacy slug must not
  // become a second enrollment row for the same course.
  return course ? course.id : null;
}

export function validStage(trackId: string, raw: unknown): number | null {
  const course = getCourse(trackId);
  if (!course) return null;
  const stage = Number(raw);
  if (!Number.isInteger(stage) || stage < 0 || stage >= course.stages.length) return null;
  return stage;
}

/** Both at once, for the endpoints that need a specific lesson. */
export function validLesson(rawTrack: unknown, rawStage: unknown): Validated | null {
  const trackId = validTrack(rawTrack);
  if (!trackId) return null;
  const stage = validStage(trackId, rawStage);
  if (stage === null) return null;
  return { trackId, stage };
}
