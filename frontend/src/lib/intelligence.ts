import "server-only";

import {
  CopilotKitIntelligence,
  type IdentifyUserCallback,
} from "@copilotkit/runtime/v2";

/**
 * CopilotKit Intelligence, wired once for every runtime in this app.
 *
 * The Quickstart's runtime step now constructs this inline:
 *
 *     intelligence: new CopilotKitIntelligence({
 *       apiKey: process.env.INTELLIGENCE_API_KEY!,
 *     }),
 *     identifyUser: (request) => ({
 *       id: request.headers.get("x-user-id") ?? "anonymous",
 *       name: request.headers.get("x-user-name") ?? "Anonymous",
 *     }),
 *
 * This harness has three runtime endpoints rather than one, so the two options
 * live here and each route spreads them in. `identifyUser` below is the page's
 * callback verbatim.
 *
 * **The one deviation, and the doc sanctions it.** The page writes
 * `process.env.INTELLIGENCE_API_KEY!` — a non-null assertion on a key most
 * people cloning this repo will not have. Its own callout says what happens
 * without one: "Drop the `intelligence` and `identifyUser` options and the
 * runtime falls back to SSE mode with an in-memory runner. Chat still works,
 * but Threads and the Inspector stay locked and the key is never read." So the
 * options are omitted rather than passed empty when the key is absent, which is
 * exactly the documented fallback and keeps the harness runnable keyless.
 *
 * `apiUrl` and `wsUrl` are deliberately unset: they default to the managed
 * platform, and `premium/connect-your-runtime` is explicit that they must be
 * overridden together or not at all, because the API and realtime planes are
 * different hosts.
 */

/**
 * Both live in `lib/intelligence-status.ts`, which imports nothing — so a page
 * can ask whether Intelligence is on without dragging this file's
 * `@copilotkit/runtime/v2` import into its module graph. Re-exported here so
 * runtime code has one place to look.
 */
export { INTELLIGENCE_ENABLED, intelligenceStatus } from "./intelligence-status";

const API_KEY = process.env.INTELLIGENCE_API_KEY;

/** The Quickstart's callback, unchanged. Threads are per-user without it. */
const identifyUser: IdentifyUserCallback = (request) => ({
  id: request.headers.get("x-user-id") ?? "anonymous",
  name: request.headers.get("x-user-name") ?? "Anonymous",
});

/**
 * One client for the whole process. The runtime reads the key off the client
 * you pass, not off the environment, so constructing it once and sharing it
 * keeps all three endpoints on the same project.
 */
const client = API_KEY
  ? new CopilotKitIntelligence({ apiKey: API_KEY })
  : undefined;

/**
 * Spread into a `CopilotRuntime` constructor. Empty when no key is configured,
 * which drops the runtime into the documented SSE fallback.
 */
export const intelligenceOptions = client
  ? { intelligence: client, identifyUser }
  : {};

