"use client";

import {
  CopilotChat,
  UseAgentUpdate,
  useAgent,
  useCopilotKit,
} from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";
import { useEffect } from "react";

const AGENT_ID = "shared-state-language";

type AgentState = {
  language: "english" | "spanish" | string;
};

/**
 * Writing agent state from the UI, in the two shapes the doc gives.
 *
 * This is the one route in the harness where the Strands backend does
 * something the Quickstart's does not: `StrandsAgentConfig(
 * state_context_builder=language_prompt)` reads whatever `setState` wrote and
 * prepends it to the user message before the model sees it. It is the only
 * documented UI → agent data path in the whole Strands tree.
 *
 * `setState` alone stages the value — the agent picks it up on its *next*
 * turn, whenever that happens. The advanced form adds a hint message and calls
 * `runAgent` so the change takes effect immediately, which is usually what a
 * toggle in a settings panel should do.
 */
export default function Page() {
  return (
    <DemoFrame
      parentPath="/shared-state/in-app-agent-write"
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

  const { agent, isReady } = useAgent({
    agentId: AGENT_ID,
  });
  const state = (agent.state ?? {}) as Partial<AgentState>;

  useEffect(() => {
  if (!isReady || state.language !== undefined) return;
      agent.setState({ ...(agent.state ?? {}), language: "spanish" });
    }, [agent, isReady, state.language]);

  const toggleLanguage = () => {
    agent.setState({ ...(agent.state ?? {}), language: state.language === "english" ? "spanish" : "english" }); 
  };
  

  
  const language = state?.language ?? "-";
  const next = language === "english" ? "spanish" : "english";
;

  return (
    <main className="h-full overflow-y-auto p-10">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
        Your main content
      </h1>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Language
        </p>
        <p
          data-testid="language-value"
          className="mt-1 text-3xl font-semibold capitalize text-slate-900 dark:text-slate-100"
        >
          {language}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={toggleLanguage}
            disabled={agent.isRunning}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium disabled:opacity-40 dark:border-slate-700"
          >
            Toggle Language
          </button>
          
        </div>
      </div>
    </main>
  );
}
