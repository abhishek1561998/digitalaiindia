// Badge art, generated from the badge's own colour and family.
//
// Nineteen hand-drawn medals would be nineteen assets to keep in sync the
// first time the palette moves. Instead the shape comes from the family and
// the colour from the badge, so a new badge is a row in the catalogue and
// nothing else.

import type { Badge } from "@/lib/learn/badges";

const FAMILY_MARKS: Record<Badge["family"], React.ReactNode> = {
  Consistency: (
    <path
      d="M12.5 5c.3 2.4-1 3.5-2.1 4.6C9.1 10.8 8 11.9 8 14a4.6 4.6 0 0 0 4.6 4.6A4.3 4.3 0 0 0 16.9 14c0-2.9-1.9-4.2-2.7-6.1-.3-.8-.5-1.9-1.7-2.9z"
      fill="currentColor"
    />
  ),
  Effort: (
    <path
      d="M13.4 4 6.8 12.9c-.3.4-.1 1 .4 1h3.9l-.6 5.8 6.7-8.9c.3-.4.1-1-.4-1h-3.8z"
      fill="currentColor"
    />
  ),
  Progress: (
    <path
      d="m7.4 12.4 3.3 3.3 6.4-6.4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  Competition: (
    <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5.5h6v4a3 3 0 0 1-6 0z" />
      <path d="M9 6.5H7a2 2 0 0 0 2 3M15 6.5h2a2 2 0 0 1-2 3" />
      <path d="M12 12.5v2.5M10 17h4" />
    </g>
  ),
};

export function BadgeMedal({
  badge,
  earned,
  size = 72,
}: {
  badge: Badge;
  earned: boolean;
  size?: number;
}) {
  // Unique per badge+state so two medals on one page never share a gradient.
  const gid = `badge-${badge.id}-${earned ? "on" : "off"}`;

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" role="img" aria-label={badge.name}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor={earned ? badge.color : "currentColor"} stopOpacity={earned ? 1 : 0.14} />
          <stop offset="100%" stopColor={earned ? badge.color : "currentColor"} stopOpacity={earned ? 0.72 : 0.08} />
        </linearGradient>
      </defs>

      {/* A squircle rather than a circle — it reads as an object you were
          given rather than as another status dot. */}
      <path
        d="M12 1.6c4.1 0 6.2 0 7.9 1.2 1.4 1 2.1 2.6 2.3 5.2.1 1.2.1 2.7.1 4s0 2.8-.1 4c-.2 2.6-.9 4.2-2.3 5.2-1.7 1.2-3.8 1.2-7.9 1.2s-6.2 0-7.9-1.2c-1.4-1-2.1-2.6-2.3-5.2C1.7 14.8 1.7 13.3 1.7 12s0-2.8.1-4c.2-2.6.9-4.2 2.3-5.2C5.8 1.6 7.9 1.6 12 1.6z"
        fill={`url(#${gid})`}
      />

      <g color={earned ? "#fff" : "currentColor"} opacity={earned ? 1 : 0.35}>
        {FAMILY_MARKS[badge.family]}
      </g>
    </svg>
  );
}
