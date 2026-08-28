"use client";

import {
  CopilotKit,
  CopilotChat,
  CopilotChatConfigurationProvider,
  CopilotThreadsDrawer,
} from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";
import { nestedInspectorSetting } from "@/lib/inspector";

/**
 * Wrapped in its own provider pointed at `/api/copilotkit-threads`.
 *
 * The app-wide provider talks to `/api/copilotkit`, which registers 25 agents
 * and runs in SSE mode. Intelligence has to be on a runtime that advertises as
 * few agents as possible, because the client opens a realtime thread channel
 * per advertised agent — see the threads endpoint for the full story.
 */
const AGENT_ID = "agentic_chat";

/**
 * The page's whole integration, which is genuinely the whole integration.
 *
 * The doc's example is a `<CopilotKitProvider>` wrapping a
 * `<CopilotChatConfigurationProvider>` wrapping a flex row of
 * `<CopilotThreadsDrawer />` and `<CopilotChat />`. Two deviations, both
 * structural rather than behavioural:
 *
 *  1. The provider is the app-wide one in `components/providers.tsx`, which
 *     already carries `runtimeUrl` and `publicLicenseKey` — so this file starts
 *     at the configuration provider instead of nesting a second root.
 *  2. `agentId` is passed, because this runtime registers 25 agents and none is
 *     called `default`.
 *
 * Everything else is the page's: the shared `CopilotChatConfigurationProvider`
 * is what lets the drawer drive the chat with no active-thread state of your
 * own, and that is the claim this route exists to test.
 */
export default function Page() {
  return (
    <DemoFrame
      parentPath="/prebuilt-components/copilot-threads-drawer"
      subtitle={`agent: ${AGENT_ID}`}
    >
      <CopilotKit
        runtimeUrl="/api/copilotkit-threads"
        agent={AGENT_ID}
        enableInspector={nestedInspectorSetting}
      >
        <CopilotChatConfigurationProvider>
          <div style={{ display: "flex", height: "100%" }}>
            <CopilotThreadsDrawer agentId={AGENT_ID} />
            <CopilotChat agentId={AGENT_ID} className="h-full flex-1" />
          </div>
        </CopilotChatConfigurationProvider>
      </CopilotKit>
    </DemoFrame>
  );
}
