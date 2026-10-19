"use client";

import { CopilotKit } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";
import { A2UI_FIXED_AGENT_ID } from "@/lib/agents";
import { nestedInspectorSetting } from "@/lib/inspector";

import { catalog } from "../a2ui/catalog";
import { Chat } from "./chat";

/**
 * The page's demo `page.tsx` (kept byte-exact beside this file as
 * `published-page.tsx.txt`), inside the harness's chrome.
 *
 * From the page: the provider pointed at its own runtime
 * (`/api/copilotkit-a2ui-fixed-schema`, the Code tab's route.ts), the agent
 * id, `a2ui={{ catalog }}`, and `<Chat />` with its suggestion hook. The agent
 * behind the id is `display_flight` over `flight_schema.json`, which the page
 * describes but does not publish; it comes from CopilotKit's GitHub showcase.
 *
 * Not the page's: `DemoFrame` in place of the demo's full-screen flex wrapper,
 * and `enableInspector` — this provider owns the inspector on this route; see
 * `lib/inspector.ts`.
 *
 * No `useSingleEndpoint` here, on purpose. The published runtime is
 * `mode: "single-route"` with a single `POST` export, so the provider's
 * default single-endpoint mode is the one that matches it — unlike every
 * other nested provider in this app, which sits on a `[[...slug]]` catch-all.
 */
export default function Page() {
  return (
    <DemoFrame
      parentPath="/generative-ui/a2ui/fixed-schema"
      subtitle={`agent: ${A2UI_FIXED_AGENT_ID}`}
    >
      <CopilotKit
        runtimeUrl="/api/copilotkit-a2ui-fixed-schema"
        agent={A2UI_FIXED_AGENT_ID}
        a2ui={{ catalog: catalog }}
        enableInspector={nestedInspectorSetting}
      >
        <Chat />
      </CopilotKit>
    </DemoFrame>
  );
}
