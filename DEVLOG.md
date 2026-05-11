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

## Day 3 — 2026-05-09
**Hours worked:** 3

**What I did:**
- Implemented the `calculateGlobalAudit` aggregator and wired the hydrated Jotai session state into the calculation engine.
- Built the `/results` dashboard, engineering a high-converting UI to render per-tool cost breakdowns, expose minimum-seat traps, and highlight batch-routing optimizations.
- Enforced strict domain boundaries by adding TypeScript interfaces for `PRICING_DB` (Cursor, Copilot, Claude, v0, OpenAI, Gemini) and refactored the underlying calculators to strictly consume these types.
- Resolved Zod coercion conflicts by building an intermediate mapping layer inside the form's `onSubmit` handler, bridging the gap between loose HTML inputs and strict domain payloads.
- Wrote unit tests covering critical edge cases, specifically validating minimum-seat requirements and accurate batch-discount applications.

**What I learned:**
When we are working with HTML forms and complex domain logic we cannot just rely on schema validation. It is not enough. We need to do something. Using a layer that maps everything between the user interface and the Jotai store makes things a lot easier to work with in TypeScript. This also stops us from running into problems with Zod coercion. So we should use this mapping layer to make our work simpler and to avoid these problems, with Jotai store and Zot coercion.

**Blockers / what I'm stuck on:**
None at present. The engine is working well the data flow is organized in an order and the way things are shown makes sense with the mathematical results. The engine and the data flow and the visual hierarchy of the engine all work together to give us mathematical output from the engine.

**Plan for tomorrow:**
- Polish the `/results` UI/UX and implement a robust CSV/PDF/DOC export feature so users can download and share their financial audit reports.
- Write end-to-end (E2E) tests covering the primary user flow from the marketing page form submission to the final dashboard render.

## Day 4 — 2026-05-10
**Hours worked:** 6

**What I did:**
- Completed the **Cross-Tool Insight Engine**, incorporating sophisticated reasoning to spot vendor overlaps (such as subscribing to both Cursor and Copilot) and discrepancies between use cases throughout the AI pipeline.
- Designed the **Zero-Footprint Personalization Scheme** to guarantee that the "ruthless mentor" character gives harsh, practical financial guidance without compromising on privacy or generating imaginary specifics regarding the user.
- Reorganized the `currency.ts` file to enable real-time exchange rates using an efficient failover approach, deployed through a server-side cache within the Next.js root layout to avoid hitting the API limit.
- Revamped the **Lead Generation module**, opting for managed React forms and a secured API route to retain Jotai state consistency during the lead conversion process.
- Established consistent UI/UX design for "Low Saving" conditions, keeping the engine "honest" (as per the assignment criteria) while confirming maximum spend levels and allowing a choice to subscribe for future price notifications.
- Improved the CSV export feature to produce flawless alignment and accurate data for the final audit reports.

**What I learned:**
- I discovered that implementing "Cross-Tool" logic is significantly more complex than per-tool audits because it requires a global state scan to identify overlapping capabilities (like the "Coding" use-case being serviced by three different subscriptions). 


**Blockers / what I'm stuck on:**
- Debugged a tricky array-to-string interpolation bug in the insight engine that was causing use-cases to render incorrectly in the UI.

**Plan for tomorrow:**
- Creation of Lead Capture of backend with convex. 
- Deployment to Vercel/Production and final verification of the end-to-end lead capture and database integration.


## Day 5 — 2026-05-11
**Hours worked:** 2

**What I did:**
- Engineered a bulletproof `try/catch` fallback mechanism. If the Anthropic API throws a 429 Rate Limit error or times out, the component instantly degrades to a hardcoded templated summary so the user experience never crashes.
- Created the lead capture form, added backend for the form. 

**What I learned:** 
I learned that LLM network calls are inherently unstable and slow. I had to implement a skeleton loading state in the UI so the rest of the dashboard renders instantly while the Anthropic API takes 2-3 seconds to generate the 100-word summary. 

**Blockers / what I'm stuck on:**
Too much calculations can halucinate the tool, finding a better solution for it.

**Plan for tomorrow:**
Draft `LANDING_COPY.md` and `METRICS.md`, and polish the root `README.md` and `ARCHITECTURE.md`. Prepare for the final Vercel production deployment and Lighthouse optimization. Also add other markdown files needed for the project