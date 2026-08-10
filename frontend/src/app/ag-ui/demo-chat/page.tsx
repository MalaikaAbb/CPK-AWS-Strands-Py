"use client";

import { useAgent, useCopilotKit } from "@copilotkit/react-core/v2";
import { useEffect, useRef, useState } from "react";

import { DemoFrame } from "@/components/demo-frame";

const AGENT_ID = "agentic_chat";

type Row = { seq: number; group: string; name: string; detail?: string };

/**
 * The AG-UI page's `EventLog`, widened to every callback in its table.
 *
 * The page shows three callbacks (`onTextMessageContentEvent`,
 * `onToolCallEndEvent`, `onStateChanged`) and then prints a table mapping all
 * of the AG-UI event types to their callback names. This subscribes to the
 * whole table, so the mapping is checkable rather than taken on trust — a
 * callback that never fires here either is not wired or is not emitted by
 * `ag_ui_strands`, and both are worth knowing.
 *
 * The `agent` handle itself is the other half of the page: it is a proxy the
 * registry resolved from the runtime's `/info`, not the Strands agent, which
 * is why `agent.messages` and `agent.state` read the same regardless of what
 * is running on port 8000.
 *
 * The reply pane beside the log is that handle read two ways at once, which is
 * the distinction the doc page draws and never demonstrates:
 *
 *   - `textMessageBuffer`, off the low-level `onTextMessageContentEvent`, is
 *     the accumulated text so far — the page's own example of what that
 *     callback carries, and enough to build a transcript with no accumulator.
 *   - `onMessagesChanged` is the high-level pair, firing only once the deltas
 *     have been folded into `agent.messages`. The counter shows how far behind
 *     it lands.
 */
export default function Page() {
  return (
    <DemoFrame parentPath="/ag-ui" subtitle={`agent: ${AGENT_ID}`}>
      <EventLog />
    </DemoFrame>
  );
}

const GROUP_STYLE: Record<string, string> = {
  Run: "text-emerald-700 dark:text-emerald-400",
  Step: "text-sky-700 dark:text-sky-400",
  Text: "text-slate-700 dark:text-slate-300",
  Tool: "text-violet-700 dark:text-violet-400",
  State: "text-amber-700 dark:text-amber-400",
  Messages: "text-rose-700 dark:text-rose-400",
  Custom: "text-fuchsia-700 dark:text-fuchsia-400",
  Changed: "text-slate-500 dark:text-slate-500",
};

function EventLog() {
  const { agent } = useAgent({ agentId: AGENT_ID });
  const { copilotkit } = useCopilotKit();
  const [rows, setRows] = useState<Row[]>([]);
  const [input, setInput] = useState("Say hello in one short sentence.");
  /** The prompt that produced the reply currently on screen. */
  const [prompt, setPrompt] = useState<string | null>(null);
  /** Built from `textMessageBuffer` — the low-level path. */
  const [answer, setAnswer] = useState("");
  /** Rebuilt from `agent.messages` — the high-level path. */
  const [folded, setFolded] = useState("");
  const [failed, setFailed] = useState(false);
  const seq = useRef(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const answerEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const push = (group: string, name: string, detail?: string) =>
      setRows((r) => [...r, { seq: seq.current++, group, name, detail }]);

    // One entry per row of the doc page's event-to-callback table.
    const sub = agent.subscribe({
      onRunStartedEvent: () => {
        // A new run replaces the reply on screen rather than appending to it.
        setAnswer("");
        setFolded("");
        setFailed(false);
        push("Run", "onRunStartedEvent");
      },
      onRunFinishedEvent: () => push("Run", "onRunFinishedEvent"),
      onRunErrorEvent: () => {
        setFailed(true);
        push("Run", "onRunErrorEvent");
      },
      onStepStartedEvent: () => push("Step", "onStepStartedEvent"),
      onStepFinishedEvent: () => push("Step", "onStepFinishedEvent"),
      onTextMessageStartEvent: () => push("Text", "onTextMessageStartEvent"),
      onTextMessageContentEvent: ({ textMessageBuffer }) => {
        // The buffer is the page's own example of what this callback carries:
        // accumulated text, not just the delta, so the pane needs no
        // accumulator of its own.
        setAnswer(textMessageBuffer ?? "");
        // Collapse the delta burst into one counted row.
        setRows((r) => {
          const last = r[r.length - 1];
          const detail = `buffer: ${textMessageBuffer?.length ?? 0} chars`;
          if (last?.name === "onTextMessageContentEvent") {
            return [...r.slice(0, -1), { ...last, detail }];
          }
          return [
            ...r,
            {
              seq: seq.current++,
              group: "Text",
              name: "onTextMessageContentEvent",
              detail,
            },
          ];
        });
      },
      onTextMessageEndEvent: () => push("Text", "onTextMessageEndEvent"),
      // The doc page destructures `toolCallName` straight off the subscriber
      // params. On the start event it lives on `event`; only the end event
      // hoists it to the top level.
      onToolCallStartEvent: ({ event }) =>
        push("Tool", "onToolCallStartEvent", event.toolCallName),
      onToolCallArgsEvent: () => push("Tool", "onToolCallArgsEvent"),
      onToolCallEndEvent: ({ toolCallName }) =>
        push("Tool", "onToolCallEndEvent", toolCallName),
      onToolCallResultEvent: () => push("Tool", "onToolCallResultEvent"),
      onStateSnapshotEvent: () => push("State", "onStateSnapshotEvent"),
      onStateDeltaEvent: () => push("State", "onStateDeltaEvent"),
      onMessagesSnapshotEvent: () =>
        push("Messages", "onMessagesSnapshotEvent"),
      onCustomEvent: ({ event }) => push("Custom", "onCustomEvent", event.name),
      onMessagesChanged: ({ agent: a }) => {
        // The high-level counterpart: fires after the deltas have been folded
        // into agent.messages, so it lags the buffer above by a whole message.
        const last = [...(a.messages ?? [])]
          .reverse()
          .find((m) => m.role === "assistant");
        const content = last?.content;
        setFolded(typeof content === "string" ? content : "");
        push("Changed", "onMessagesChanged");
      },
      onStateChanged: ({ agent: a }) =>
        push("Changed", "onStateChanged", JSON.stringify(a.state ?? {})),
    });
    return () => sub.unsubscribe();
  }, [agent]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [rows.length]);

  useEffect(() => {
    answerEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [answer]);

  const send = () => {
    const text = input.trim();
    if (!text || agent.isRunning) return;
    setPrompt(text);
    agent.addMessage({ id: crypto.randomUUID(), role: "user", content: text });
    void copilotkit
      .runAgent({ agent })
      .catch((err) => console.error("[ag-ui] runAgent failed", err));
  };

  const clear = () => {
    setRows([]);
    setAnswer("");
    setFolded("");
    setPrompt(null);
    setFailed(false);
  };

  const seen = new Set(rows.map((r) => r.name));

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-slate-200 p-4 dark:border-slate-800">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
        />
        <button
          onClick={send}
          disabled={agent.isRunning}
          className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
        >
          Run
        </button>
        <button
          onClick={clear}
          className="text-xs text-slate-500 underline underline-offset-4"
        >
          Clear
        </button>
        <span className="w-full text-xs text-slate-500 sm:w-auto">
          {seen.size} of 18 documented callbacks seen
        </span>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-2">
        {/* Left: every callback in the doc page's table. */}
        <section className="flex min-h-0 flex-col border-b border-slate-200 lg:border-b-0 lg:border-r dark:border-slate-800">
          <h2 className="shrink-0 border-b border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-800">
            Subscriber callbacks
          </h2>
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            {rows.length === 0 ? (
              <p className="py-16 text-center text-sm text-slate-400">
                Press Run. Every callback in the doc page&apos;s table is
                subscribed; the ones that never appear are the ones{" "}
                <code>ag_ui_strands</code> does not emit.
              </p>
            ) : (
              <ol className="space-y-0.5">
                {rows.map((r) => (
                  <li
                    key={r.seq}
                    className="flex items-baseline gap-3 rounded px-2 py-1 font-mono text-xs odd:bg-slate-50 dark:odd:bg-slate-800/40"
                  >
                    <span className="w-8 shrink-0 text-right text-slate-400">
                      {r.seq}
                    </span>
                    <span className={`w-16 shrink-0 ${GROUP_STYLE[r.group] ?? ""}`}>
                      {r.group}
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {r.name}
                    </span>
                    {r.detail && (
                      <span className="min-w-0 truncate text-slate-500">
                        {r.detail}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            )}
            <div ref={bottomRef} />
          </div>
        </section>

        {/* Right: the same stream read at both levels. */}
        <section className="flex min-h-0 flex-col">
          <h2 className="flex shrink-0 items-center gap-2 border-b border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-800">
            <span>Agent response</span>
            {agent.isRunning && (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium normal-case tracking-normal text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                streaming
              </span>
            )}
          </h2>
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            {prompt === null ? (
              <p className="py-16 text-center text-sm text-slate-400">
                The reply appears here, assembled from the same callbacks.
              </p>
            ) : (
              <div className="space-y-3">
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-800/40">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    You
                  </p>
                  <p className="mt-0.5 text-sm text-slate-700 dark:text-slate-300">
                    {prompt}
                  </p>
                </div>

                <div className="rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-800">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      textMessageBuffer
                    </p>
                    <span className="font-mono text-[10px] text-slate-400">
                      {answer.length} chars
                    </span>
                  </div>
                  {failed ? (
                    <p className="mt-0.5 text-sm text-rose-700 dark:text-rose-400">
                      onRunErrorEvent fired — nothing was streamed. Check the
                      Python server and OPENAI_API_KEY.
                    </p>
                  ) : answer ? (
                    <p className="mt-0.5 whitespace-pre-wrap text-sm text-slate-900 dark:text-slate-100">
                      {answer}
                    </p>
                  ) : (
                    <p className="mt-0.5 text-sm text-slate-400">
                      {agent.isRunning
                        ? "Waiting for the first delta…"
                        : "No text in this run."}
                    </p>
                  )}
                </div>

                <div className="rounded-lg border border-dashed border-slate-300 px-3 py-2 dark:border-slate-700">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      agent.messages · via onMessagesChanged
                    </p>
                    <span className="font-mono text-[10px] text-slate-400">
                      {folded.length} chars
                    </span>
                  </div>
                  <p className="mt-0.5 whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-400">
                    {folded || (
                      <span className="text-slate-400">
                        Empty until the deltas are folded in — this is the lag
                        the doc page&apos;s &quot;high-level changes&quot; row
                        describes.
                      </span>
                    )}
                  </p>
                </div>
                <div ref={answerEndRef} />
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
