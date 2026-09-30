"use client";

import { CopilotChat } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

import { GovernedActionTool } from "../governed-snippets";

/**
 * The page's "Tool-call approval with useHumanInTheLoop" pattern. The hook
 * component and the card are verbatim in `../governed-snippets.tsx`. Only this
 * wrapper is the repo's.
 *
 * The page gives no agent for this pattern. `governed-actions` is the
 * Quickstart agent with the generic prompt, and the model learns about
 * `approve_governed_action` only from the tool's own description.
 */
const AGENT_ID = "governed-actions";

export default function Page() {
  return (
    <DemoFrame
      parentPath="/human-in-the-loop/governed-actions"
      subtitle={`agent: ${AGENT_ID} · useHumanInTheLoop`}
    >
      <GovernedActionTool />
      <CopilotChat agentId={AGENT_ID} className="h-full" />
    </DemoFrame>
  );
}
