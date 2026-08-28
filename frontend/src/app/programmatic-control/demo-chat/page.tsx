"use client";

import { useAgent, useCopilotKit } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

const AGENT_ID = "programmatic-control";

/**
 * The page's send-and-stop example, run as published.
 *
 * This route used to be Partial for a reason that no longer exists. The page
 * used to print the `headless-complete` cell: a hook body that destructured ten
 * values out of a `useAttachmentsConfig()` no page defined, called two more
 * undefined helpers, and ended with no `return` — so it neither compiled nor
 * rendered anything. The 2026-08-26 rewrite replaced it with the
 * `AgentTrigger` below, which the page itself calls "intentionally
 * self-contained": imports, hooks, handlers and JSX, all of it printed.
 *
 * `AgentTrigger` is that component verbatim. The transcript beside it is this
 * repo's — the doc's component has no output of its own, and a QA harness needs
 * to show that the button did something.
 */
export default function Page() {
  return (
    <DemoFrame parentPath="/programmatic-control" subtitle={`agent: ${AGENT_ID}`}>
      <div className="flex h-full flex-col">
        <div className="shrink-0 border-b border-slate-200 p-4 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            <AgentTrigger agentId={AGENT_ID} />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Both buttons are the doc&apos;s. The prompt they send is the
            doc&apos;s too — &quot;Summarize the latest sales data&quot; —
            hardcoded in the component, since the point is driving a run from
            code rather than from a composer.
          </p>
        </div>
        <Transcript agentId={AGENT_ID} />
      </div>
    </DemoFrame>
  );
}

//#region agent-trigger
export function AgentTrigger({ agentId }: { agentId: string }) {
  const { agent } = useAgent({ agentId });
  const { copilotkit } = useCopilotKit();

  const run = async () => {
    if (agent.isRunning) return;

    agent.addMessage({
      id: crypto.randomUUID(),
      role: "user",
      content: "Summarize the latest sales data",
    });

    try {
      await copilotkit.runAgent({ agent });
    } catch (error) {
      console.error("CopilotKit runAgent failed:", error);
    }
  };

  return (
    <>
      <button onClick={run} disabled={agent.isRunning}>
        Run agent
      </button>
      <button
        onClick={() => copilotkit.stopAgent({ agent })}
        disabled={!agent.isRunning}
      >
        Stop
      </button>
    </>
  );
}
//#endregion

/**
 * This repo's, not the doc's. `AgentTrigger` renders two bare buttons and
 * nothing else, so without this you cannot tell a working run from a no-op.
 */
function Transcript({ agentId }: { agentId: string }) {
  const { agent } = useAgent({ agentId });
  const messages = agent.messages ?? [];

  return (
    <div className="min-h-0 flex-1 overflow-y-auto p-4">
      {messages.length === 0 ? (
        <p className="py-16 text-center text-sm text-slate-400">
          Press <strong>Run agent</strong>. No composer, no chat component —
          the run is dispatched from a click handler.
        </p>
      ) : (
        <ol className="space-y-3">
          {messages.map((m, i) => (
            <li
              key={m.id ?? i}
              className="rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-800"
            >
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                {m.role}
              </p>
              <p className="mt-0.5 whitespace-pre-wrap text-sm text-slate-900 dark:text-slate-100">
                {typeof m.content === "string"
                  ? m.content
                  : JSON.stringify(m.content)}
              </p>
            </li>
          ))}
        </ol>
      )}
      {agent.isRunning && (
        <p className="mt-3 text-xs text-emerald-700 dark:text-emerald-400">
          Running — press Stop to cancel mid-stream.
        </p>
      )}
    </div>
  );
}
