"use client";
import { useCallback, useState } from "react";

import { DemoFrame } from "@/components/demo-frame";

import {
  buildContent,
  useAttachmentsConfig,
  useAutoScroll,
} from "../headless-helpers";

const AGENT_ID = "programmatic-control";

const SUGGESTIONS = [
  "Write one sentence about agent-native apps.",
  "Explain the AG-UI protocol in about 200 words.",
];

/**
 * ============== PARTIAL - NOT WORKING - MISSING CODE AND IMPORTS
 *
 * `.snippet.tsx`, not `page.tsx`: Next never compiles or executes this file,
 * which is the only way to keep it as published. It is shown verbatim by the
 * route beside it.
 *
 * Three things the docs never print, all left missing:
 *
 *  1. The import line. The `headless-complete` snippet opens mid-file at
 *     `const { agent } = useAgent({ agentId });` with no imports at all, so
 *     `useAgent` and `useCopilotKit` are unresolved here too.
 *  2. `useAttachmentsConfig`, `useAutoScroll` and `buildContent`. The snippet
 *     destructures ten values out of the first and calls the other two;
 *     none appears on any doc page. Reconstructed in `../headless-helpers.ts`
 *     so the shape is at least legible.
 *  3. A `return`. The body ends at `handleReset`, so the component it defines
 *     renders nothing — hence the empty fragment at the bottom.
 */
export default function Page() {
  return (
    <DemoFrame parentPath="/programmatic-control" subtitle={`agent: ${AGENT_ID}`}>
      <Chat agentId={AGENT_ID} />
    </DemoFrame>
  );
}

function Chat({ agentId }: { agentId: string }) {
   const { agent } = useAgent({ agentId });
  const { copilotkit } = useCopilotKit();

  const {
    attachments,
    fileInputRef,
    containerRef,
    handleFileUpload,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    dragOver,
    removeAttachment,
    consumeAttachments,
  } = useAttachmentsConfig();

  const [input, setInput] = useState("");
  const messages = agent.messages;
  const { listRef, bottomRef, stickRef } = useAutoScroll(
    messages,
    agent.isRunning,
  );

  // Send pipeline: consume any ready attachments at submit time, build
  // the multimodal `content` array if needed, then dispatch the run.
  const sendText = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      // Consume queued uploads first so they get sent even if the user
      // didn't type any text alongside them.
      const ready = consumeAttachments();
      if (!trimmed && ready.length === 0) return;
      if (agent.isRunning) return;

      stickRef.current = true;

      const content = buildContent(trimmed, ready);
      agent.addMessage({
        id: crypto.randomUUID(),
        role: "user",
        content,
      });
      void copilotkit
        .runAgent({ agent })
        .catch((err) =>
          console.error("[headless-complete] runAgent failed", err),
        );
    },
    [agent, copilotkit, consumeAttachments],
  );

  const handleSend = useCallback(() => {
    sendText(input);
    setInput("");
  }, [input, sendText]);

  const handleSuggestion = useCallback(
    (text: string) => {
      sendText(text);
    },
    [sendText],
  );

  const handleReset = useCallback(() => {
    if (agent.isRunning) {
      try {
        agent.abortRun();
      } catch {
        // no-op: some transports don't support abort
      }
    }
    agent.setMessages([]);
    setInput("");
    stickRef.current = true;
  }, [agent]);

  return (<></>)
}
