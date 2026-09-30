// Verbatim from the page's `frontend/src/app/page.tsx` block
// (https://docs.copilotkit.ai/strands/generative-ui/json-render). Not edited.
import {
  CopilotKit,
  CopilotChat,
  useConfigureSuggestions,
} from "@copilotkit/react-core/v2";
import { JsonRenderAssistantMessage } from "./json-render-renderer";

export default function ByocJsonRenderDemo() {
  useConfigureSuggestions({
    suggestions: [
      { title: "Sales dashboard", message: "Show me a sales dashboard." },
      { title: "Region breakdown", message: "Break down sales by region." },
    ],
    available: "always",
  });

  return (
    <CopilotKit runtimeUrl="/api/copilotkit-byoc-json-render" agent="byoc_json_render">
      <CopilotChat
        // @ts-expect-error doc bug, kept as published — CopilotKit 1.75 types this slot as typeof CopilotChatAssistantMessage (with static sub-components), which a plain ({ message }) component does not satisfy
        messageView={{ assistantMessage: JsonRenderAssistantMessage }}
      />
    </CopilotKit>
  );
}
