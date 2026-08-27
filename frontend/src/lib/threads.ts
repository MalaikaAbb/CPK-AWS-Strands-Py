/**
 * The client-side half of CopilotKit Intelligence.
 *
 * Threads need two different credentials, and the docs introduce them on
 * different pages, which is easy to miss:
 *
 *   - `INTELLIGENCE_API_KEY` — server-side, read by `lib/intelligence.ts` and
 *     passed to `new CopilotKitIntelligence({ apiKey })` on every runtime. This
 *     is what makes the runtime store threads at all.
 *   - `publicLicenseKey` — client-side, passed to `<CopilotKitProvider>`. The
 *     Threads Drawer page puts it inline as `publicLicenseKey="ck_pub_..."`.
 *     Without it the drawer renders "a locked view in place of the list".
 *
 * Both are needed for the thread routes to do anything. The public one is
 * genuinely public — it ships to the browser by design — so unlike the server
 * key it *does* take a `NEXT_PUBLIC_` prefix.
 */

/** The doc's `publicLicenseKey`, from the environment rather than inline. */
export const PUBLIC_LICENSE_KEY =
  process.env.NEXT_PUBLIC_COPILOTKIT_PUBLIC_LICENSE_KEY;

/**
 * Whether the client half is configured. The server half is reported
 * separately by `lib/intelligence.ts`, which cannot be imported here — it is
 * `server-only` and these routes are client components.
 */
export const THREADS_LICENSE_PRESENT = Boolean(PUBLIC_LICENSE_KEY);

/** Shown on every thread route so the locked state is never a mystery. */
export const THREADS_LOCKED_NOTE =
  "Threads require CopilotKit Intelligence. Set INTELLIGENCE_API_KEY (server) " +
  "and NEXT_PUBLIC_COPILOTKIT_PUBLIC_LICENSE_KEY (client); without both, the " +
  "drawer shows a locked view and useThreads has nothing to list.";
