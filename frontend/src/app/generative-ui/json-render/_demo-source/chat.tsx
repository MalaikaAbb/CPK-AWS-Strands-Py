// Doc demo source, unedited: src/app/demos/declarative-json-render/chat.tsx from the showcase app the embedded demo on
// https://docs.copilotkit.ai/strands/generative-ui/json-render is built from. Not one of
// the page's code tabs itself, but imported by tabs that are.
"use client";

import {
  CopilotChat,
  CopilotChatAssistantMessage,
} from "@copilotkit/react-core/v2";
import { JsonRenderAssistantMessage } from "./json-render-renderer";
import { useByocJsonRenderSuggestions } from "./suggestions";

export const AGENT_ID = "byoc_json_render";

export function Chat() {
  useByocJsonRenderSuggestions();

  return (
    <CopilotChat
      agentId={AGENT_ID}
      className="h-full rounded-2xl"
      messageView={{
        assistantMessage:
          JsonRenderAssistantMessage as unknown as typeof CopilotChatAssistantMessage,
      }}
    />
  );
}
