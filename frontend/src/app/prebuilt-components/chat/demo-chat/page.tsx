"use client";

import { CopilotChat, useConfigureSuggestions } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

/**
 * The doc's `agentic-chat` demo: a `<CopilotChat>` filling its container, with
 * starter suggestions wired in.
 *
 * The page's snippet calls a `useAgenticChatSuggestions()` helper it never
 * defines. That helper is just `useConfigureSuggestions`, which is a real
 * export, so it is called directly here rather than hidden behind a wrapper.
 */
export default function Page() {
  return (
    <DemoFrame parentPath="/prebuilt-components/chat" subtitle="agent: agentic_chat">
      <Chat />
    </DemoFrame>
  );
}

function Chat() {
  useConfigureSuggestions({
    suggestions: [
      {
        title: "What can you do?",
        message: "What can you help me with?",
      },
      {
        title: "Explain Strands",
        message: "What is the AWS Strands Agents SDK, in two sentences?",
      },
    ],
    available: "always",
  });

  return <CopilotChat agentId="agentic_chat" className="h-full" />;
}
