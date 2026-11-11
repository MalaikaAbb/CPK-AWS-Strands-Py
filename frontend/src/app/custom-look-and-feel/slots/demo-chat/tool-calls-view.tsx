// "Tool calls" snippet from
// https://docs.copilotkit.ai/strands/custom-look-and-feel/slots (title
// page.tsx), verbatim below the line. The demo page mounts `Chat` inside a
// CopilotChatConfigurationProvider pointed at the `tool-rendering` agent
// (harness glue: the snippet's chat names no agent, and only that agent has
// backend tools whose calls this slot can wrap).
// ---------------------------------------------------------------------------
import {
  CopilotChat,
  CopilotChatToolCallsView,
  type CopilotChatToolCallsViewProps,
} from "@copilotkit/react-core/v2";

const CustomToolCallsView = (props: CopilotChatToolCallsViewProps) => (
  <div className="rounded-lg border border-dashed p-2">
    <CopilotChatToolCallsView {...props} />
  </div>
);

export function Chat() {
  return (
    <CopilotChat
      messageView={{
        assistantMessage: { toolCallsView: CustomToolCallsView },
      }}
    />
  );
}
