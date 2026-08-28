"use client";

import { CopilotSidebar, useAgent } from "@copilotkit/react-core/v2";
import { useEffect } from "react";

import { DemoFrame } from "@/components/demo-frame";

const AGENT_ID = "shared-state-read-write";

type CanvasState = {
  title: string;
  items: { id: string; label: string; done: boolean }[];
};

const INITIAL_CANVAS_STATE: CanvasState = {
  title: "Project launch",
  items: [
    { id: "research", label: "Research user needs", done: true },
    { id: "prototype", label: "Build a prototype", done: false },
  ],
};

/**
 * The same agent and the same state as the chat, laid out the other way round:
 * the canvas is the primary content and the chat is docked beside it.
 *
 * That is the entire point of the page. `<Canvas>` and `<CopilotSidebar>` both
 * call `useAgent` for the same id, so they share one agent instance and one
 * state object. There is nothing chat-specific about reading `agent.state` —
 * the sidebar is not special.
 *
 * The 2026-08-26 rewrite added `INITIAL_CANVAS_STATE` and the seeding effect
 * below. It matters more here than the page lets on: nothing published for
 * Strands writes agent state, so before this the canvas rendered "Untitled"
 * with an empty list and stayed that way forever. Now it has something to show
 * on first paint, and the toggle proves the write half round-trips.
 */
export default function Page() {
  return (
    <DemoFrame
      parentPath="/shared-state/rendering-in-app"
      subtitle={`agent: ${AGENT_ID}`}
    >
      <div className="h-full overflow-hidden">
        <Canvas />
        <CopilotSidebar agentId={AGENT_ID} defaultOpen />
      </div>
    </DemoFrame>
  );
}

//#region canvas
function Canvas() {
  // The doc calls this with no argument, which binds to the agent named
  // "default". This runtime registers 25 agents and none is called that, so
  // the id is passed explicitly — the one deviation in this component.
  const { agent, isReady } = useAgent({ agentId: AGENT_ID });
  const state = (agent.state ?? {}) as Partial<CanvasState>;

  useEffect(() => {
    if (!isReady) return;

    const current = (agent.state ?? {}) as Partial<CanvasState>;
    const updates: Partial<CanvasState> = {};

    if (current.title === undefined) {
      updates.title = INITIAL_CANVAS_STATE.title;
    }
    if (current.items === undefined) {
      updates.items = INITIAL_CANVAS_STATE.items;
    }

    if (Object.keys(updates).length > 0) {
      agent.setState({ ...(agent.state ?? {}), ...updates });
    }
  }, [agent, isReady, state.title, state.items]);

  // The doc writes this as `agent.state?.items`, which is untyped — `it` comes
  // out implicitly `any` and the build fails under strict. Mapping over the
  // already-narrowed `state` above gives the same result with real types.
  function toggleItem(id: string) {
    agent.setState({
      ...agent.state,
      items: (state.items ?? []).map((it) =>
        it.id === id ? { ...it, done: !it.done } : it,
      ),
    });
  }

  return (
    <main className="h-full overflow-y-auto p-10">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
        {state.title ?? "Untitled"}
      </h1>
      <ul className="mt-4 space-y-2">
        {(state.items ?? []).map((item) => (
          <li key={item.id} data-done={item.done}>
            <button
              onClick={() => toggleItem(item.id)}
              className="flex w-full max-w-md items-center gap-3 rounded-lg border border-slate-200 px-3 py-2 text-left text-sm hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
            >
              <span
                aria-hidden
                className={`h-4 w-4 shrink-0 rounded border ${
                  item.done
                    ? "border-emerald-500 bg-emerald-500"
                    : "border-slate-300 dark:border-slate-600"
                }`}
              />
              <span
                className={
                  item.done
                    ? "text-slate-400 line-through"
                    : "text-slate-800 dark:text-slate-200"
                }
              >
                {item.label}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-6 max-w-md text-xs text-slate-500">
        Clicking a row calls the doc&apos;s <code>toggleItem</code>, which is{" "}
        <code>agent.setState</code> — the same state the sidebar reads. The
        checkbox markup is this repo&apos;s; the doc renders a bare{" "}
        <code>&lt;li&gt;</code> with no click target.
      </p>
    </main>
  );
}
//#endregion
