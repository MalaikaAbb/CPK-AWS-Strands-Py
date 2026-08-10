"use client";

import {
  CopilotSidebar,
  UseAgentUpdate,
  useAgent,
} from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

import { type Preferences } from "../../notes-card";

const AGENT_ID = "shared-state-read-write";

type CanvasState = {
  title: string;
  items: { id: string; label: string; done: boolean }[];
};


/**
 * The same agent and the same state as /shared-state, laid out the other way
 * round: the canvas is the primary content and the chat is docked beside it.
 *
 * That is the entire point of the page. `<Canvas>` and `<CopilotSidebar>` both
 * call `useAgent` for the same id, so they share one agent instance and one
 * state object. There is nothing chat-specific about reading `agent.state` —
 * the sidebar is not special.
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

function Canvas() {
  
  // No agentId means the "default" agent. Pass { agentId } to target another.
  const { agent } = useAgent({agentId: AGENT_ID});
  const state = (agent.state ?? {}) as Partial<CanvasState>;

  // The doc writes this as `agent.state?.items`, which is untyped — `it` comes
  // out implicitly `any` and the build fails. Mapping over the already-narrowed
  // `state` above gives the same result with real types. See README §9.
  function toggleItem(id: string) {
    agent.setState({
      ...agent.state,
      items: (state.items ?? []).map((it) =>
        it.id === id ? { ...it, done: !it.done } : it,
      ),
    });
  }

  return (
    <main className="canvas">
      <h1>{state.title ?? "Untitled"}</h1>
      <ul>
        {(state.items ?? []).map((item) => (
          <li key={item.id} data-done={item.done}>
            {item.label}
          </li>
        ))}
      </ul>
    </main>
  );
}
