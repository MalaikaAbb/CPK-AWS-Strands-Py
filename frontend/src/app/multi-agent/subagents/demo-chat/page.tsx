"use client";

import {
  CopilotChat,
  UseAgentUpdate,
  useAgent,
} from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

import { DelegationLog, type Delegation } from "../delegation-log";

const AGENT_ID = "subagents";

type SubagentsState = { delegations?: Delegation[] };

/**
 * The delegation log is a plain reactive render of one shared-state slot.
 *
 * This is where the shared-state channel earns its keep: the supervisor's
 * delegation tools mutate `state["delegations"]` as each sub-agent returns,
 * and this component redraws. Without it the whole fan-out would be one long
 * unexplained pause.
 */
export default function Page() {
  return (
    <DemoFrame parentPath="/multi-agent/subagents" subtitle={`agent: ${AGENT_ID}`}>
      <Surface />
    </DemoFrame>
  );
}

function Surface() {
  const { agent } = useAgent({
    agentId: AGENT_ID,
    updates: [UseAgentUpdate.OnStateChanged, UseAgentUpdate.OnRunStatusChanged],
  });

  const state = agent.state as SubagentsState | undefined;
  const delegations = state?.delegations ?? [];

  return (
    <div className="grid h-full grid-cols-1 lg:grid-cols-[1fr_24rem]">
      <div className="min-h-0 p-6">
        <DelegationLog delegations={delegations} isRunning={agent.isRunning} />
      </div>
      <div className="min-h-0 border-t border-slate-200 lg:border-l lg:border-t-0 dark:border-slate-800">
        <CopilotChat agentId={AGENT_ID} className="h-full" />
      </div>
    </div>
  );
}
