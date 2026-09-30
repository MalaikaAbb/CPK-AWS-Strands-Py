"use client";

import { CopilotChat, CopilotKit } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";
import { nestedInspectorSetting } from "@/lib/inspector";

import { GovernedActionApproval } from "../../governed-snippets";

/**
 * The page's "Inline approval with useInterrupt" pattern. The hook component
 * and card are verbatim in `../governed-snippets.tsx`. Only this wrapper is the
 * repo's.
 *
 * The published `useInterrupt` call passes no `agentId`, so it binds to the
 * provider's default agent. A nested provider with
 * `agent="governed-actions-interrupt"` is how that default points at the
 * interrupting agent without editing the snippet.
 *
 * Expected, as published: the agent pauses, but no card appears. The snippet
 * reads `interrupt.metadata.action`. `ag_ui_strands` publishes a custom
 * interrupt's reason as `interrupt.metadata.reason`, so the envelope arrives
 * at `metadata.reason.action`, `action` is undefined, and `render` returns null.
 */
const AGENT_ID = "governed-actions-interrupt";

export default function Page() {
  return (
    <DemoFrame
      parentPath="/human-in-the-loop/governed-actions"
      subtitle={`agent: ${AGENT_ID} · useInterrupt`}
    >
      <CopilotKit
        runtimeUrl="/api/copilotkit"
        agent={AGENT_ID}
        useSingleEndpoint={false}
        enableInspector={nestedInspectorSetting}
      >
        <GovernedActionApproval />
        <CopilotChat agentId={AGENT_ID} className="h-full" />
      </CopilotKit>
    </DemoFrame>
  );
}
