// Doc demo source, unedited: src/app/demos/declarative-hashbrown/chat.tsx from the showcase app the embedded demo on
// https://docs.copilotkit.ai/strands/generative-ui/hashbrown is built from. Not one of
// the page's code tabs itself, but imported by tabs that are.
"use client";

import {
  CopilotChat,
  CopilotChatAssistantMessage,
} from "@copilotkit/react-core/v2";
import { HashBrownRenderMessage } from "./hashbrown-renderer";
import { useByocHashbrownSuggestions } from "./suggestions";

export function Chat() {
  useByocHashbrownSuggestions();

  return (
    <CopilotChat
      className="h-full"
      messageView={{
        // The renderer reads only `message` from the slot props; cast to the
        // wider CopilotChatAssistantMessage signature to satisfy the slot type.
        assistantMessage:
          HashBrownRenderMessage as unknown as typeof CopilotChatAssistantMessage,
      }}
    />
  );
}
