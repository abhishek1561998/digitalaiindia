"use client";

import css from "./learn-app.module.css";
import { LockIcon, TrophyIcon, BoltIcon } from "./icons";
import type { LeagueView } from "@/lib/server/leagues";

// Deterministic avatar tint per learner — same person, same colour, every
// week, without storing anything.
const AVATAR_COLORS = ["#6C5CE7", "#00A97F", "#E8890C", "#E85D9E", "#0FA3C7", "#F0B429"];

function tintFor(userId: string) {
  let h = 0;
  for (let i = 0; i < userId.length; i++) h = (h * 31 + userId.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

export function LeagueCard({ league, totalXp }: { league: LeagueView; totalXp: number }) {
  if (!league.unlocked) {
    return (
      <section className={`${css.card} ${css.metaRow}`}>
        <span className={css.metaIcon}><LockIcon /></span>
        <div>
          <p className={css.metaTitle}>Unlock leagues</p>
          <p className={css.metaValue}>{totalXp} of {totalXp + league.xpToUnlock} XP</p>
        </div>
      </section>
    );
  }

  return (
    <section className={css.card} aria-label={`${league.tierName} league`}>
      <header className={css.leagueHead}>
        <span className={css.leagueBadge} style={{ background: league.tierColor }}>
          <TrophyIcon size={22} />
        </span>
        <div>
          <p className={css.leagueName}>{league.tierName} league</p>
          <p className={css.leagueMeta}>
            Top {league.promoteCount} advance · {league.daysLeft}{" "}
            {league.daysLeft === 1 ? "day" : "days"} left
          </p>
        </div>
      </header>

      {league.rows.length === 0 ? (
        <p className={css.leagueEmpty}>
          Finish a lesson to join this week&apos;s league — you&apos;ll be ranked as soon as you
          earn your first XP of the cycle.
        </p>
      ) : (
        <div className={css.leagueRows}>
          {league.rows.map((row, i) => (
            <div key={row.userId}>
              <div className={css.leagueRow} data-me={row.isMe}>
                <span className={css.leagueRank}>{row.rank}</span>
                <span className={css.leagueAvatar} style={{ background: tintFor(row.userId) }}>
                  {row.name[0]?.toUpperCase()}
                </span>
                <span className={css.leagueWho}>{row.isMe ? "You" : row.name}</span>
                <span className={css.leagueXp}>
                  {row.xp} <BoltIcon size={13} />
                </span>
              </div>
              {/* The promotion line only means something once the cohort is
                  actually deeper than it. */}
              {i + 1 === league.promoteCount && league.rows.length > league.promoteCount && (
                <p className={css.leagueCut}>Advancing to next league</p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
