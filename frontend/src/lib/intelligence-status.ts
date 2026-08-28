import "server-only";

/**
 * Whether this checkout runs in Intelligence mode — and nothing else.
 *
 * Deliberately a separate module from `lib/intelligence.ts`, which imports
 * `@copilotkit/runtime/v2` to construct the client. That package is ~6.5 MB of
 * server runtime, so a page importing even one boolean from that module pulls
 * the whole thing into the *page's* module graph and makes it enormously slow
 * to compile in dev — slow enough to hang the dev server.
 *
 * A page needs the answer, not the runtime. This file reads `process.env` and
 * imports nothing.
 */

/** Server-side secret. Never give this a NEXT_PUBLIC_ prefix. */
const API_KEY = process.env.INTELLIGENCE_API_KEY;

/** True when the runtimes will run in Intelligence mode rather than SSE mode. */
export const INTELLIGENCE_ENABLED = Boolean(API_KEY);

/** What `/copilot-runtime` reports, so the mode is visible without a dashboard. */
export function intelligenceStatus() {
  return {
    enabled: INTELLIGENCE_ENABLED,
    mode: INTELLIGENCE_ENABLED ? "intelligence" : "sse",
    envVar: "INTELLIGENCE_API_KEY",
  } as const;
}
