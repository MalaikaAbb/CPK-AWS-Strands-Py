"use client";

import {
  useAgent,
  useCopilotKit,
  useRenderToolCall,
} from "@copilotkit/react-core/v2";
import { useEffect, useRef, useState } from "react";

import { DemoFrame } from "@/components/demo-frame";

const AGENT_ID = "headless-simple";

/**
 * A chat with no CopilotKit chrome at all — no `<CopilotChat>`, no slots.
 *
 * Three hooks do the work, and they are the same ones `<CopilotChat>` uses
 * internally:
 *
 *   useAgent          — the conversation (`messages`, `isRunning`) and run state
 *   useCopilotKit     — the runtime handle you call `runAgent({ agent })` on
 *   useRenderToolCall — paints any registered tool call inline
 *
 * The trade-off the doc names is real: you get text and tool calls, and
 * nothing else. Reasoning cards, activity messages and custom message slots do
 * not appear unless you wire them in yourself.
 */
export default function Page() {
  return (
    <DemoFrame
      parentPath="/custom-look-and-feel/headless-ui"
      subtitle={`agent: ${AGENT_ID}`}
    >
      <Chat />
    </DemoFrame>
  );
}

function Chat() {
  const { agent } = useAgent({ agentId: AGENT_ID });
  const { copilotkit } = useCopilotKit();
  const renderToolCall = useRenderToolCall();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const messages = agent.messages;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, agent.isRunning]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || agent.isRunning) return;
    agent.addMessage({
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    });
    setInput("");
    void copilotkit.runAgent({ agent }).catch((err) => {
      // Swallowing this would model broken practice: a transport failure or
      // runtime error should reach the developer's console.
      console.error("[strands:headless-simple] runAgent failed", err);
    });
  };

  return (
    <div className="flex h-full flex-col bg-white dark:bg-slate-950">
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-6">
        {messages.length === 0 && (
          <p className="py-16 text-center text-sm text-slate-400">
            Nothing here is a CopilotKit component. Say something.
          </p>
        )}

        {messages.map((m) =>
          m.role === "user" ? (
            <UserBubble
              key={m.id}
              content={typeof m.content === "string" ? m.content : ""}
            />
          ) : m.role === "assistant" ? (
            <AssistantBubble
              key={m.id}
              content={typeof m.content === "string" ? m.content : undefined}
            >
              {("toolCalls" in m && Array.isArray(m.toolCalls)
                ? m.toolCalls
                : []
              ).map((tc) => {
                const node = renderToolCall({ toolCall: tc });
                return node ? <div key={tc.id}>{node}</div> : null;
              })}
            </AssistantBubble>
          ) : null,
        )}

        {agent.isRunning && (
          <p className="animate-pulse text-xs text-slate-400">Thinking…</p>
        )}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex shrink-0 gap-2 border-t border-slate-200 p-4 dark:border-slate-800"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Message the agent…"
          className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[var(--accent)] dark:border-slate-700 dark:bg-slate-900"
        />
        <button
          type="submit"
          disabled={agent.isRunning || !input.trim()}
          className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
        >
          Send
        </button>
      </form>
    </div>
  );
}

function UserBubble({ content }: { content: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-[var(--accent)] px-4 py-2.5 text-sm text-white">
        <p className="whitespace-pre-wrap break-words">{content}</p>
      </div>
    </div>
  );
}

function AssistantBubble({
  content,
  children,
}: {
  content?: string;
  children?: React.ReactNode;
}) {
  const hasText = typeof content === "string" && content.trim().length > 0;
  if (!hasText && !children) return null;

  return (
    <div className="flex flex-col items-start gap-2">
      {hasText && (
        <div className="max-w-[90%] rounded-2xl rounded-tl-sm bg-slate-100 px-4 py-2.5 text-sm text-slate-900 dark:bg-slate-800 dark:text-slate-100">
          <p className="whitespace-pre-wrap break-words">{content}</p>
        </div>
      )}
      {children}
    </div>
  );
}
