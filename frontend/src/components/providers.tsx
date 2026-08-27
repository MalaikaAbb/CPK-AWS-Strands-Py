"use client";

import { CopilotKitProvider } from "@copilotkit/react-core/v2";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { rootInspectorSetting } from "@/lib/inspector";
import { PUBLIC_LICENSE_KEY } from "@/lib/threads";

/**
 * One provider for the whole app, so a conversation survives navigation
 * between test routes.
 *
 * Three routes mount a second, nested `<CopilotKit>` of their own rather than
 * using this one — Voice (different runtime, because transcription only exists
 * on the v2 runtime) and the two A2UI routes (each needs its own catalog, and
 * dynamic-schema needs the runtime that still injects the A2UI tool). Those
 * are the cases where the doc page is specifically about the provider, so an
 * isolated instance is the honest thing to show.
 *
 * Note what this provider does NOT set: `agent`. The Quickstart passes
 * `agent="strands_agent"` here, which makes it the default for every surface
 * below. With 25 registered agents that default would only hide mistakes, so
 * every route names its agent with `agentId` instead.
 *
 * `useSingleEndpoint={false}` is the Quickstart's, and it is the client half of
 * the runtime move to a `[[...slug]]` catch-all: with it off, the client calls
 * the runtime's own sub-routes (`/info`, `/agent/:id/run`, `/transcribe`) under
 * `runtimeUrl` instead of posting everything to one path. The two have to agree
 * — a catch-all route with single-endpoint mode on gets no `/info`.
 *
 * On the inspector prop name, which is genuinely confusing: the doc page says
 * `enableInspector`, and that prop exists — but only on `<CopilotKit>`, the v1
 * compatibility wrapper. All it does there is forward to this provider's
 * `showDevConsole`. On `CopilotKitProvider` there is no `enableInspector` at
 * all, and `showDevConsole` is the only switch. See README §9.
 */

const RUNTIME_URL = "/api/copilotkit";

export function Providers({ children }: { children: ReactNode }) {
  // The inspector can only watch the core it is attached to, and two of them
  // on one page is fatal — so on routes that bring their own provider, this
  // one yields. `lib/inspector.ts` owns that decision.
  const pathname = usePathname();

  return (
    <CopilotKitProvider
      runtimeUrl={RUNTIME_URL}
      useSingleEndpoint={false}
      // The Threads Drawer page passes this inline as
      // `publicLicenseKey="ck_pub_..."`. It is the client half of Intelligence
      // — without it the drawer renders a locked view. Undefined when unset,
      // which is the same as not passing it.
      publicLicenseKey={PUBLIC_LICENSE_KEY}
      showDevConsole={rootInspectorSetting(pathname)}
      // Bottom-left, because the prebuilt Popup and Sidebar launchers both
      // live bottom-right and would sit under the inspector button.
      inspectorDefaultAnchor={{ horizontal: "left", vertical: "bottom" }}
      onError={(event) => {
        console.error(`[CopilotKit ${event.code}]`, event.error);
      }}
    >
      {children}
    </CopilotKitProvider>
  );
}
