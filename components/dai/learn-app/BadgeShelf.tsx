"use client";

import css from "./learn-app.module.css";
import { BadgeMedal } from "./BadgeMedal";
import { BADGES, type Badge } from "@/lib/learn/badges";
import type { EarnedBadgeView } from "@/lib/server/learn-badges";

const FAMILY_ORDER: Badge["family"][] = ["Consistency", "Effort", "Progress", "Competition"];

function whenLabel(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function BadgeShelf({
  earned,
  next,
}: {
  earned: EarnedBadgeView[];
  next: Badge | null;
}) {
  const earnedById = new Map(earned.map((b) => [b.id, b]));

  return (
    <section>
      <h2 className={css.sectionTitle}>
        Badges
        <span style={{ color: "var(--text3)", fontWeight: 450, fontSize: "1rem", marginLeft: "0.6rem" }}>
          {earned.length} of {BADGES.length}
        </span>
      </h2>

      {next && (
        <div className={css.badgeNext}>
          <BadgeMedal badge={next} earned={false} size={54} />
          <div className={css.badgeNextBody}>
            <p className={css.badgeNextLabel}>Closest one</p>
            <p className={css.badgeNextName}>{next.name}</p>
            <p className={css.badgeDesc} style={{ textAlign: "left" }}>{next.description}</p>
          </div>
        </div>
      )}

      {FAMILY_ORDER.map((family) => {
        const badges = BADGES.filter((b) => b.family === family);
        return (
          <div key={family} className={css.badgeFamily}>
            <h3 className={css.badgeFamilyName}>
              {family} · {badges.filter((b) => earnedById.has(b.id)).length}/{badges.length}
            </h3>
            <div className={css.badgeGrid}>
              {badges.map((badge) => {
                const got = earnedById.get(badge.id);
                return (
                  <article
                    key={badge.id}
                    className={css.badge}
                    data-earned={Boolean(got)}
                    title={badge.description}
                  >
                    <BadgeMedal badge={badge} earned={Boolean(got)} size={62} />
                    <span className={css.badgeName}>{badge.name}</span>
                    {got ? (
                      <span className={css.badgeWhen}>{whenLabel(got.earnedAt)}</span>
                    ) : (
                      <span className={css.badgeDesc}>{badge.description}</span>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        );
      })}
    </section>
  );
}
