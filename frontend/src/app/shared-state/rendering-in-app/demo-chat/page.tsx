"use client";

import {
  CopilotSidebar,
  UseAgentUpdate,
  useAgent,
} from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";
import { useEffect } from "react";
import { type Preferences } from "../../notes-card";

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

export function Canvas() {
  // No agentId means the "default" agent. Pass { agentId } to target another.
  const { agent, isReady } = useAgent({agentId: AGENT_ID});
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
          <li
            key={item.id}
            data-done={item.done}
            onClick={() => toggleItem(item.id)}
            className="cursor-pointer data-[done=true]:line-through data-[done=true]:opacity-60"
          >
            {item.label}
          </li>
        ))}
      </ul>
    </main>
  );
}

// function Canvas() {
  
//   // No agentId means the "default" agent. Pass { agentId } to target another.
//   const { agent } = useAgent({agentId: AGENT_ID});
//   const state = (agent.state ?? {}) as Partial<CanvasState>;

//   // The doc writes this as `agent.state?.items`, which is untyped — `it` comes
//   // out implicitly `any` and the build fails. Mapping over the already-narrowed
//   // `state` above gives the same result with real types. See README §9.
//   function toggleItem(id: string) {
//     agent.setState({
//       ...agent.state,
//       items: (state.items ?? []).map((it) =>
//         it.id === id ? { ...it, done: !it.done } : it,
//       ),
//     });
//   }

//   return (
//     <main className="canvas">
//       <h1>{state.title ?? "Untitled"}</h1>
//       <ul>
//         {(state.items ?? []).map((item) => (
//           <li key={item.id} data-done={item.done}>
//             {item.label}
//           </li>
//         ))}
//       </ul>
//     </main>
//   );
// }
