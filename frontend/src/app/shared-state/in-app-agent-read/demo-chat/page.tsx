"use client";

import {
  CopilotChat,
  UseAgentUpdate,
  useAgent,
} from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

const AGENT_ID = "shared-state-language";

// Should match the state the agent reads — see `language_prompt` in
// backend/src/agents/language_agent.py, which looks for a `language` key.
type AgentState = {
  language: "english" | "spanish" | string;
};

/**
 * Reading agent state in your own components.
 *
 * Two departures from the page's snippet, both forced:
 *
 *  1. It seeds the hook with `useAgent({ agentId, initialState: { language:
 *     "spanish" } })`. `UseAgentProps` in 1.66.2 has no `initialState` field,
 *     so the default lives in the render instead.
 *  2. It passes `agentId: "strands_agent"` while the backend on the same page
 *     names the agent `languageAgent` — the id its *write*-side sibling uses.
 *     This addresses the agent the backend actually defines.
 *
 * There is no server-side default either: Strands has no state schema, so
 * until something writes `language` the key simply is not there.
 */
export default function Page() {
  return (
    <DemoFrame
      parentPath="/shared-state/in-app-agent-read"
      subtitle={`agent: ${AGENT_ID}`}
    >
      <div className="grid h-full grid-cols-1 lg:grid-cols-[1fr_24rem]">
        <YourMainContent />
        <div className="min-h-0 border-t border-slate-200 lg:border-l lg:border-t-0 dark:border-slate-800">
          <CopilotChat agentId={AGENT_ID} className="h-full" />
        </div>
      </div>
    </DemoFrame>
  );
}

function YourMainContent() {
  const { agent } = useAgent({
    agentId: AGENT_ID,
  });

  const state = agent.state as AgentState | undefined;
  const language = state?.language ?? "english";

  return (
    <main className="h-full overflow-y-auto p-10">
      <div className="grid h-full grid-cols-1 lg:grid-cols-2">
        <div className="min-h-0 overflow-y-auto border-b border-slate-200 p-4 lg:border-b-0 lg:border-r dark:border-slate-800">
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Your main content
          </h1>
          <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">
            Language:{" "}
            <strong className="text-[var(--accent)]">
              {state?.language ?? "—"}
            </strong>
          </p>

          <h2 className="mt-6 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Raw agent.state
          </h2>
          <pre className="mt-2 max-h-56 overflow-auto rounded-lg bg-slate-950 p-3 text-xs text-slate-100">
            {JSON.stringify(agent.state ?? {}, null, 2)}
          </pre>
        </div>
      </div>
    </main>
  );
}
