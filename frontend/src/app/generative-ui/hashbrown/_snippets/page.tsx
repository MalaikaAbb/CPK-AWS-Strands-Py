// Verbatim from the page's `frontend/src/app/page.tsx` block
// (https://docs.copilotkit.ai/strands/generative-ui/hashbrown). Not edited.
import {
  CopilotKit,
  CopilotChat,
  useConfigureSuggestions,
} from "@copilotkit/react-core/v2";
import { HashBrownAssistantMessage } from "./hashbrown-renderer";

export default function ByocHashbrownDemo() {
  useConfigureSuggestions({
    suggestions: [
      { title: "Sales overview", message: "Show me a sales dashboard." },
      { title: "Region split", message: "Break down sales by region." },
    ],
    available: "always",
  });

  return (
    <CopilotKit runtimeUrl="/api/copilotkit-byoc-hashbrown" agent="byoc_hashbrown">
      <CopilotChat
        // @ts-expect-error doc bug, kept as published — CopilotKit 1.75 types this slot as typeof CopilotChatAssistantMessage (with static sub-components), which a plain ({ message }) component does not satisfy
        messageView={{ assistantMessage: HashBrownAssistantMessage }}
      />
    </CopilotKit>
  );
}
