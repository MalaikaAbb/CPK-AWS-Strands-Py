// The three "Grouping tool calls" snippets from
// https://docs.copilotkit.ai/strands/generative-ui/tool-rendering (each titled
// page.tsx), verbatim between the markers. Type-checked, never rendered:
// nothing imports this file. Harness glue: the imports, and a function
// wrapper around each snippet so it sits inside a component. `MyToolRow` and
// `ToolTimeline` are never defined on the page.
import { CopilotChat, useDefaultRenderTool } from "@copilotkit/react-core/v2";

function GroupedDefaultRenderer() {
  // --- snippet 1 ---
  // @ts-expect-error verbatim doc code: `MyToolRow` is never defined (TS2304)
  useDefaultRenderTool({ render: MyToolRow, group: true });
  // --- end ---
  return null;
}

function LineDisplay() {
  return (
    // --- snippet 2 ---
    // "grouped" (default) | "line" | "stacked" | "turn" | "separate"
    <CopilotChat messageView={{ toolCallDisplay: "line" }} />
    // --- end ---
  );
}

function GroupSlot() {
  return (
    // --- snippet 3 ---
    // ToolTimeline: your component, given the group's `calls` and a `renderCall` function
    <CopilotChat
      messageView={{
        // @ts-expect-error verbatim doc code: `ToolTimeline` is never defined (TS2304)
        assistantMessage: { toolCallsView: { group: ToolTimeline } },
      }}
    />
    // --- end ---
  );
}

export { GroupedDefaultRenderer, LineDisplay, GroupSlot };
