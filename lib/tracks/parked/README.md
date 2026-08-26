# Parked tracks

Written, complete, and not currently in the catalogue. They were pulled out
to focus the platform on JavaScript, Python, DSA and the generative AI path.

Bringing one back:

1. Move the content file up to `lib/tracks/`
2. Move its quiz bank up to `lib/server/`
3. Register the bank in `lib/server/quiz-registry.ts`
4. Add a seed to `SEEDS` in `lib/learn/catalog.ts`
5. Add a composition for it in `components/dai/learn-app/CourseGlyph.tsx`

Routes, sitemap, paths and badge thresholds all derive from the catalogue,
so nothing else needs touching.
