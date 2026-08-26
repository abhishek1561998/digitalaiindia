import { AppShell } from "./AppShell";
import { LearnLanding } from "./LearnLanding";
import { LearnHome } from "./LearnHome";
import { getCurrentUser } from "@/lib/server/auth";
import { COURSE_SUMMARIES, TOTAL_LESSONS, getCourse, locateLesson } from "@/lib/learn/catalog";
import { getCourseProgress, pickNextCourse } from "@/lib/server/learn-progress";
import { getLearnerState } from "@/lib/server/learn-state";
import { guestState } from "@/lib/learn/guest-state";
import { getPreferences } from "@/lib/server/learn-preferences";
import { getLeague } from "@/lib/server/leagues";

// The Learn home screen, as a component rather than a page — it's mounted at
// both "/" (the main domain now leads with Learn) and "/learn", and the two
// must never drift apart.
export async function LearnHomeScreen() {
  const user = await getCurrentUser();

  // Signed out, the home screen is a landing page — an empty streak card and
  // a zeroed league board sell nothing. Signed in, it's the app.
  if (!user) {
    return (
      <AppShell
        active="home"
        user={null}
        state={guestState()}
        preferences={await getPreferences(null)}
        promo={false}
        minimal
      >
        <LearnLanding courses={COURSE_SUMMARIES} totalLessons={TOTAL_LESSONS} />
      </AppShell>
    );
  }

  // These only need the user id, so they go together rather than one after
  // another — it was four sequential database round trips before.
  const [preferences, state, progress] = await Promise.all([
    getPreferences(user.id),
    getLearnerState(user.id),
    getCourseProgress(user.id),
  ]);

  // League placement depends on the XP that state just resolved.
  const league = await getLeague(user.id, state.xp);

  const featured = pickNextCourse(progress);
  const course = getCourse(featured)!;
  const stage = progress[featured]?.nextStage ?? 0;
  const located = locateLesson(course, stage);

  return (
    <AppShell active="home" user={{ name: user.name, email: user.email }} state={state} preferences={preferences}>
      <LearnHome
        courses={COURSE_SUMMARIES}
        progress={progress}
        state={state}
        featured={featured}
        nextLesson={
          located
            ? {
                stage,
                title: located.lesson.title,
                levelTitle: located.level.title,
                time: located.lesson.time,
              }
            : null
        }
        firstName={user.name.split(" ")[0]}
        league={league}
        goalDays={state.goalDays}
        signedIn
      />
    </AppShell>
  );
}
