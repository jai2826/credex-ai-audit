## Day 1 — 2026-05-07
**Hours worked:** 4

**What I did:**
Built the Next.js 16 application using TypeScript, Tailwind CSS and shadcn/ui. Design the Convex database schema to make lead capture easy, without too much API routing boilerplate. Maintained strict repo hygiene per assignment constraints by purging auto-generated bloated AI markdown files (like component docs) fixed some Next.js 16 React Compiler cascading render warnings in the UI components for a clean, green CI build.

**What I learned:** Relying only on AI generators leads to bloat and unstable UI state. I figured out how to safely comply with Next.js 16’s strict `useEffect` rules by deferring state updates to the next execution tick (in particular, in the `use-mobile` and `carousel` components) to avoid infinite render loops while preserving SSR compatibility.

**Blockers / what I'm stuck on:**
Spent time battling the React Compiler over dynamic `form.watch()` calls inside mapped arrays. Fixed by using the state at component root using `useWatch`. Nothing in the way at present.

**Plan for tomorrow:**
To create typescript interfaces for `PRICING_DB` ( Cursor, Copilot, Claude, etc) and implement the pure mathematical logic for the `calculateToolOptimization` engine.