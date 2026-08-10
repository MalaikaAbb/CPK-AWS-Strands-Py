"use client";

import {
  CopilotChatConfigurationProvider,
  CopilotSidebar,
  useCopilotChatConfiguration,
} from "@copilotkit/react-core/v2";
import { useState } from "react";

import { DemoFrame } from "@/components/demo-frame";

type Feedback = { messageId: string; value: "up" | "down" };

/**
 * Both halves of the Open/close/feedback page in one surface.
 *
 * The wrapping `<CopilotChatConfigurationProvider>` is load-bearing, and it is
 * the part that is easy to get wrong. `useCopilotChatConfiguration()` returns
 * modal state only when some provider *above the calling component* owns it.
 * `<CopilotSidebar>` does create one — but it creates it **inside itself**, and
 * it takes no children, so a button rendered as its sibling sees nothing and
 * `setModalOpen` comes back undefined. Both buttons then hit their
 * `if (!config?.setModalOpen) return null` guard and silently render nothing.
 *
 * Hoisting a provider above both fixes it, which is what the doc means by
 * "if you compose chat yourself, wrap the relevant subtree". Nesting is safe:
 * a child provider syncs to its parent in both directions, so the sidebar's
 * own toggle and these buttons drive the same state and stay in agreement.
 */
export default function Page() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);

  return (
    <DemoFrame
      parentPath="/prebuilt-components/chat-controls"
      subtitle="agent: chat-controls"
    >
      <CopilotChatConfigurationProvider
        agentId="chat-controls"
        isModalDefaultOpen={false}
      >
        <div className="h-full overflow-hidden">
          <CopilotSidebar
            agentId="chat-controls"
            defaultOpen={false}
            messageView={{
              assistantMessage: {
                onThumbsUp: (message: { id: string }) =>
                  setFeedback((f) => [
                    ...f,
                    { messageId: message.id, value: "up" },
                  ]),
                onThumbsDown: (message: { id: string }) =>
                  setFeedback((f) => [
                    ...f,
                    { messageId: message.id, value: "down" },
                  ]),
              },
            }}
          />
          <MainContent feedback={feedback} />
        </div>
      </CopilotChatConfigurationProvider>
    </DemoFrame>
  );
}

function MainContent({ feedback }: { feedback: Feedback[] }) {
  return (
    <main className="h-full overflow-y-auto p-10">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
        Chat controls
      </h1>

      <div className="mt-6 flex flex-wrap gap-3">
        <OpenChatButton />
        <ToggleChatButton />
      </div>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Captured feedback
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          The thumbs buttons only render because handlers were passed to the
          assistant message slot. Each fires with the message it belongs to.
        </p>
        {feedback.length === 0 ? (
          <p className="mt-3 rounded-lg border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500 dark:border-slate-700">
            Send a message, then rate the reply.
          </p>
        ) : (
          <ul className="mt-3 space-y-1.5">
            {feedback.map((f, i) => (
              <li
                key={`${f.messageId}-${i}`}
                className="rounded-lg border border-slate-200 px-3 py-2 font-mono text-xs dark:border-slate-800"
              >
                {f.value === "up" ? "👍" : "👎"} {f.messageId}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

function OpenChatButton() {
  const config = useCopilotChatConfiguration();

  // setModalOpen is only present when a provider in the tree owns modal state
  // (the prebuilt CopilotPopup / CopilotSidebar create it for you).
  if (!config?.setModalOpen) return null;

  return (
    <button
      onClick={() => config.setModalOpen?.(true)}
      className="rounded-md bg-[var(--accent)] px-3 py-1.5 text-sm font-medium text-white"
    >
      Ask the assistant
    </button>
  );
}

function ToggleChatButton() {
  const config = useCopilotChatConfiguration();
  if (!config?.setModalOpen) return null;

  return (
    <button
      onClick={() => config.setModalOpen?.(!config.isModalOpen)}
      className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200"
    >
      {config.isModalOpen ? "Close chat" : "Open chat"}
    </button>
  );
}
