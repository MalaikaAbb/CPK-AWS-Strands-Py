"use client";

import { CopilotKit, CopilotChat, useThreads } from "@copilotkit/react-core/v2";
import { useState } from "react";

import { DemoFrame } from "@/components/demo-frame";
import { nestedInspectorSetting } from "@/lib/inspector";

/**
 * Wrapped in its own provider pointed at `/api/copilotkit-threads`.
 *
 * The app-wide provider talks to `/api/copilotkit`, which registers 25 agents
 * and runs in SSE mode. Intelligence has to be on a runtime that advertises as
 * few agents as possible, because the client opens a realtime thread channel
 * per advertised agent — see the threads endpoint for the full story.
 */
const AGENT_ID = "agentic_chat";

/**
 * The page's three snippets, assembled into the app they describe.
 *
 * `ThreadSidebar` and `App` below are the doc's, with the pagination block from
 * its fourth step folded into the same hook call the page tells you to fold it
 * into. Two things had to be reconciled, both the page's own inconsistencies:
 *
 *  1. Step 2 defines `function ThreadSidebar()` taking no props; step 3 renders
 *     `<ThreadSidebar onSelectThread={setActiveThreadId} />`. The prop is
 *     added here — without it the two snippets cannot be combined at all, and
 *     step 3 is explicitly the one that says how to combine them.
 *  2. `agentId: "my-agent"` is this runtime's `agentic_chat`.
 *
 * Everything else — the destructured members, `thread.name ?? "New
 * conversation"`, the rename/archive buttons, the `hasMoreThreads` control — is
 * printed on the page.
 */
export default function Page() {
  return (
    <DemoFrame parentPath="/headless-threads" subtitle={`agent: ${AGENT_ID}`}>
      <CopilotKit
        runtimeUrl="/api/copilotkit-threads"
        agent={AGENT_ID}
        enableInspector={nestedInspectorSetting}
      >
        <App />
      </CopilotKit>
    </DemoFrame>
  );
}

//#region app
function App() {
  const [activeThreadId, setActiveThreadId] = useState<string | undefined>();

  return (
    <div className="flex h-full">
      <ThreadSidebar
        onSelectThread={setActiveThreadId}
        // Clearing the prop is not decoration. Step 3 drives the chat with
        // `threadId={activeThreadId}`, and the lifecycle page is explicit that
        // `startNewThread()` "no-ops and logs a warning when the threadId is
        // prop-controlled". So the button has to drop the authoritative prop
        // before the setter can mean anything.
        onNewThread={() => setActiveThreadId(undefined)}
      />
      <CopilotChat
        agentId={AGENT_ID}
        threadId={activeThreadId}
        className="h-full flex-1"
      />
    </div>
  );
}
//#endregion

//#region thread-sidebar
function ThreadSidebar({
  onSelectThread,
  onNewThread,
}: {
  onSelectThread: (threadId: string) => void;
  onNewThread: () => void;
}) {
  const {
    threads,
    isLoading,
    renameThread,
    archiveThread,
    deleteThread,
    // Not in this page's own destructure, but documented on the lifecycle
    // page: "Also available from `useThreads()` for thread-sidebar UIs."
    startNewThread,
    hasMoreThreads,
    isFetchingMoreThreads,
    fetchMoreThreads,
  } = useThreads({ agentId: AGENT_ID, limit: 20 });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="w-72 shrink-0 overflow-y-auto border-r border-slate-200 p-3 dark:border-slate-800">
      <p className="px-1 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Threads ({threads.length})
      </p>

      {/* The headless equivalent of the prebuilt drawer's "New Conversation"
          row. Order matters: drop the prop first, then mint. */}
      <button
        onClick={() => {
          onNewThread();
          startNewThread();
        }}
        className="mb-3 w-full rounded-lg bg-[var(--accent)] px-3 py-2 text-sm font-medium text-white"
      >
        + New conversation
      </button>

      {threads.length === 0 && (
        <p className="px-1 py-8 text-sm text-slate-400">
          No threads. Send a message, or check that Intelligence is configured —
          without it this list is always empty.
        </p>
      )}

      {threads.map((thread) => (
        <div
          key={thread.id}
          className="mb-1 rounded-lg border border-slate-200 p-2 dark:border-slate-800"
        >
          <button
            onClick={() => onSelectThread(thread.id)}
            className="block w-full truncate text-left text-sm text-slate-800 dark:text-slate-200"
          >
            <span>{thread.name ?? "New conversation"}</span>
          </button>
          <div className="mt-1 flex flex-wrap gap-2 text-[11px]">
            <button
              onClick={() => renameThread(thread.id, "Renamed")}
              className="text-slate-500 underline underline-offset-2"
            >
              Rename
            </button>
            <button
              onClick={() => archiveThread(thread.id)}
              className="text-slate-500 underline underline-offset-2"
            >
              Archive
            </button>
            <button
              onClick={() => deleteThread(thread.id)}
              className="text-rose-600 underline underline-offset-2 dark:text-rose-400"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {hasMoreThreads && (
        <button
          onClick={fetchMoreThreads}
          disabled={isFetchingMoreThreads}
          className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm disabled:opacity-40 dark:border-slate-700"
        >
          {isFetchingMoreThreads ? "Loading..." : "Load more"}
        </button>
      )}
    </div>
  );
}
//#endregion
