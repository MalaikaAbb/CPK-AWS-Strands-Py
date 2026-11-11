"use client";

import {
  CopilotKit,
  CopilotChat,
  CopilotChatConfigurationProvider,
  CopilotThreadsDrawer,
} from "@copilotkit/react-core/v2";

import { useState } from "react";

import { DemoFrame } from "@/components/demo-frame";
import { nestedInspectorSetting } from "@/lib/inspector";

import { ControlledChat, NewConversationButton } from "./new-conversation";
import "./hide-new-thread.css";

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
/**
 * Variants added for the page's "Add your own New conversation button"
 * section (2026-11-10). "Your button" is the page's `Page` body with the same
 * two deviations as above; "Your button only" adds the page's CSS that hides
 * the drawer's own controls; "Controlled thread id" mounts the page's
 * `ControlledChat` as printed (no `agentId`).
 */
const VARIANTS = [
  { id: "drawer", label: "Drawer only" },
  { id: "button", label: "Your button" },
  { id: "button-only", label: "Your button only (CSS parts hidden)" },
  { id: "controlled", label: "Controlled thread id" },
] as const;

type VariantId = (typeof VARIANTS)[number]["id"];

export default function Page() {
  const [variant, setVariant] = useState<VariantId>("drawer");

  return (
    <DemoFrame
      parentPath="/prebuilt-components/copilot-threads-drawer"
      subtitle={`agent: ${AGENT_ID}`}
    >
      <div className="flex h-full flex-col">
        <div className="flex shrink-0 flex-wrap gap-2 border-b border-slate-200 p-2 dark:border-slate-800">
          {VARIANTS.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setVariant(v.id)}
              className={`rounded-md border px-3 py-1 text-xs font-medium ${
                variant === v.id
                  ? "border-indigo-500 text-indigo-600"
                  : "border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-300"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
        <div
          key={variant}
          className={`min-h-0 flex-1 ${variant === "button-only" ? "hide-drawer-new-thread" : ""}`}
        >
          <CopilotKit
            runtimeUrl="/api/copilotkit-threads"
            agent={AGENT_ID}
            enableInspector={nestedInspectorSetting}
          >
            {variant === "drawer" && (
              <CopilotChatConfigurationProvider>
                <div style={{ display: "flex", height: "100%" }}>
                  <CopilotThreadsDrawer agentId={AGENT_ID} />
                  <CopilotChat agentId={AGENT_ID} className="h-full flex-1" />
                </div>
              </CopilotChatConfigurationProvider>
            )}
            {(variant === "button" || variant === "button-only") && (
              <CopilotChatConfigurationProvider>
                <div style={{ display: "flex", height: "100%" }}>
                  <CopilotThreadsDrawer agentId={AGENT_ID} />
                  <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <header>
                      <NewConversationButton />
                    </header>
                    <CopilotChat agentId={AGENT_ID} />
                  </main>
                </div>
              </CopilotChatConfigurationProvider>
            )}
            {variant === "controlled" && <ControlledChat />}
          </CopilotKit>
        </div>
      </div>
    </DemoFrame>
  );
}
