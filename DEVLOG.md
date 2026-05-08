## Day 1 — 2026-05-07
**Hours worked:** 4

**What I did:**
Built the Next.js 16 application using TypeScript, Tailwind CSS and shadcn/ui. Design the Convex database schema to make lead capture easy, without too much API routing boilerplate. Maintained strict repo hygiene per assignment constraints by purging auto-generated bloated AI markdown files (like component docs) fixed some Next.js 16 React Compiler cascading render warnings in the UI components for a clean, green CI build.

**What I learned:** Relying only on AI generators leads to bloat and unstable UI state. I figured out how to safely comply with Next.js 16’s strict `useEffect` rules by deferring state updates to the next execution tick (in particular, in the `use-mobile` and `carousel` components) to avoid infinite render loops while preserving SSR compatibility.

**Blockers / what I'm stuck on:**
Spent time battling the React Compiler over dynamic `form.watch()` calls inside mapped arrays. Fixed by using the state at component root using `useWatch`. Nothing in the way at present.

**Plan for tomorrow:**
To create typescript interfaces for `PRICING_DB` ( Cursor, Copilot, Claude, etc) and implement the pure mathematical logic for the `calculateToolOptimization` engine.

## Day 2 — 2026-05-08
**Hours worked:** 5

**What I did:**
Designed the core audit architecture and the `SpendInputForm`. Shifting from loose typing to strict Zod Discriminated Unions. Making the distinction between SaaS (seats/plans) and API (tokens/models) payloads clear. Developed a dynamic Discovery Engine (`config.ts`) that automatically keeps the UI dropdowns in sync with the `SAAS_PRICING_DB` and `API_PRICING_DB` to create a true Single Source of Truth. Created hyper-specific calculators for Cursor, Copilot, v0, OpenAI, and Gemini to catch billing traps like minimum-seat requirements and batch-API discounts. Finally, created a Data Mapper to safely funnel the validated React Hook Form output into Jotai (`atomWithStorage`) for persistent session hydration.

**What I learned:** 
And I learned the ins and outs of the "Zod Coercion Trap" in React Hook Form. `z.coerce.number()` returns a `unknown` input type that causes major TypeScript conflicts with HTML inputs. I figured out how to safely pass the explicit `Input`, `Context` and `Output` generics to `useForm<SpendInputFormInput, unknown, SpendInputFormOutput>` to get strict typings and completely get rid of lazy `any` assertions, while keeping the code ESLint compatible.

**Blockers / what I'm stuck on:**
Spent a while arguing with TypeScript for typecast mismatches between the unified Form State and the strict Domain State ( `AuditInput` ). Fixed this by adding an intermediate mapping layer inside of `onSubmit` rather than hacking the Zod schema. Build now passes all tests and is fully green without any linting errors.

**Plan for tomorrow:**
Take the hydrated Jotai state, feed it into the master `calculateGlobalAudit` aggregator, and build out the `/results` dashboard page to visually break down the financial inefficiencies, traps, and rationales for the user.