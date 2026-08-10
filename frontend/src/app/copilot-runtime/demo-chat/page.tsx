"use client";

import { useAgent, useCopilotKit } from "@copilotkit/react-core/v2";
import { useEffect, useRef, useState } from "react";

import { DemoFrame } from "@/components/demo-frame";

type Captured = { seq: number; type: string; detail?: string };

/**
 * Three agents behind one runtime, each with its own event capture and reply.
 *
 * The point of the tabs is agent *routing*, which is what this doc page is
 * about: one `<CopilotKitProvider runtimeUrl="/api/copilotkit">`, one endpoint,
 * and `agentId` alone deciding which of the 25 registered agents a run reaches.
 * The three below were chosen because their event streams differ visibly —
 * switching tabs shows the runtime resolving a different backend, not the same
 * trace relabelled.
 *
 * All three panes stay mounted, so each keeps its own conversation and its own
 * subscriber. Switching away does not drop events from a run still in flight.
 *
 * Within a pane: `agent.subscribe` on the left is the honest answer to "what is
 * going over the wire", and the right pane is those same deltas reassembled
 * from `textMessageBuffer` — no chat component anywhere.
 */

const AGENTS = [
  {
    id: "agentic_chat",
    label: "Plain chat",
    sample: "Hello",
    watch: "Text only. No TOOL_CALL_* rows, and STATE_SNAPSHOT carries {}.",
  },
  {
    id: "tool-rendering",
    label: "With a backend tool",
    sample: "What's the weather in Tokyo?",
    watch:
      "TOOL_CALL_START names get_weather, then TOOL_CALL_END — the only agent here with a tool attached.",
  },
  {
    id: "shared-state-language",
    label: "With shared state",
    sample: "Tell me a joke",
    watch:
      "The only agent wired to state. Set a language on the Writing agent state route first, then watch STATE_SNAPSHOT arrive non-empty.",
  },
] as const;

export default function Page() {
  const [active, setActive] = useState<string>(AGENTS[0].id);

  return (
    <DemoFrame parentPath="/copilot-runtime" subtitle={`agent: ${active}`}>
      <div className="flex h-full flex-col">
        <nav
          className="flex shrink-0 gap-1 overflow-x-auto border-b border-slate-200 px-3 pt-2 dark:border-slate-800"
          aria-label="Agent"
        >
          {AGENTS.map((a) => {
            const selected = a.id === active;
            return (
              <button
                key={a.id}
                onClick={() => setActive(a.id)}
                aria-current={selected ? "true" : undefined}
                className={`shrink-0 rounded-t-lg border-b-2 px-3 py-2 text-sm transition-colors ${
                  selected
                    ? "border-[var(--accent)] font-medium text-slate-900 dark:text-slate-100"
                    : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                {a.label}
                <span className="ml-2 font-mono text-[10px] text-slate-400">
                  {a.id}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Every pane stays mounted so its subscriber keeps running. */}
        {AGENTS.map((a) => (
          <div
            key={a.id}
            className={a.id === active ? "flex min-h-0 flex-1 flex-col" : "hidden"}
          >
            <AgentPane
              agentId={a.id}
              sample={a.sample}
              watch={a.watch}
            />
          </div>
        ))}
      </div>
    </DemoFrame>
  );
}

function AgentPane({
  agentId,
  sample,
  watch,
}: {
  agentId: string;
  sample: string;
  watch: string;
}) {
  const { agent } = useAgent({ agentId });
  const { copilotkit } = useCopilotKit();
  const [events, setEvents] = useState<Captured[]>([]);
  const [input, setInput] = useState(sample);
  /** The prompt that produced the reply currently on screen. */
  const [prompt, setPrompt] = useState<string | null>(null);
  /** The assistant reply, reassembled from the same event stream. */
  const [answer, setAnswer] = useState("");
  const [failed, setFailed] = useState(false);
  const seq = useRef(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const answerEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const push = (type: string, detail?: string) =>
      setEvents((e) => [...e, { seq: seq.current++, type, detail }]);

    const sub = agent.subscribe({
      onRunStartedEvent: () => {
        // A new run replaces the reply on screen, not appends to it.
        setAnswer("");
        setFailed(false);
        push("RUN_STARTED");
      },
      onTextMessageStartEvent: () => push("TEXT_MESSAGE_START"),
      onTextMessageContentEvent: ({ event, textMessageBuffer }) => {
        // `textMessageBuffer` is the accumulated text so far, not just this
        // delta — so the reply pane needs no accumulator of its own.
        setAnswer(textMessageBuffer ?? "");
        setEvents((e) => {
          // Collapse the delta burst into one counted row.
          const last = e[e.length - 1];
          if (last?.type === "TEXT_MESSAGE_CONTENT") {
            const n = Number(last.detail?.match(/\d+/)?.[0] ?? 0) + 1;
            return [...e.slice(0, -1), { ...last, detail: `${n} deltas` }];
          }
          return [
            ...e,
            {
              seq: seq.current++,
              type: "TEXT_MESSAGE_CONTENT",
              detail: `1 delta (${event.delta?.length ?? 0} chars)`,
            },
          ];
        });
      },
      onTextMessageEndEvent: () => push("TEXT_MESSAGE_END"),
      onToolCallStartEvent: ({ event }) =>
        push("TOOL_CALL_START", event.toolCallName),
      onToolCallEndEvent: () => push("TOOL_CALL_END"),
      onToolCallResultEvent: () => push("TOOL_CALL_RESULT"),
      onStateSnapshotEvent: ({ event }) =>
        push("STATE_SNAPSHOT", JSON.stringify(event.snapshot ?? {})),
      onStateDeltaEvent: () => push("STATE_DELTA"),
      onCustomEvent: ({ event }) => push("CUSTOM", event.name),
      onRunFinishedEvent: () => push("RUN_FINISHED"),
      onRunFailed: () => {
        setFailed(true);
        push("RUN_FAILED");
      },
    });
    return () => sub.unsubscribe();
  }, [agent]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [events.length]);

  useEffect(() => {
    answerEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [answer]);

  const send = () => {
    const text = input.trim();
    if (!text || agent.isRunning) return;
    setPrompt(text);
    agent.addMessage({
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    });
    void copilotkit
      .runAgent({ agent })
      .catch((err) => console.error(`[copilot-runtime:${agentId}] runAgent`, err));
  };

  const clear = () => {
    setEvents([]);
    setAnswer("");
    setPrompt(null);
    setFailed(false);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 border-b border-slate-200 p-4 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
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
        </div>
        <p className="mt-2 text-xs text-slate-500">
          <span className="font-semibold">What to watch: </span>
          {watch}
        </p>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-2">
        {/* Left: the wire. */}
        <section className="flex min-h-0 flex-col border-b border-slate-200 lg:border-b-0 lg:border-r dark:border-slate-800">
          <h2 className="shrink-0 border-b border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-800">
            AG-UI events
          </h2>
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            {events.length === 0 ? (
              <p className="py-16 text-center text-sm text-slate-400">
                Press Run and watch the protocol.
              </p>
            ) : (
              <ol className="space-y-0.5">
                {events.map((e) => (
                  <li
                    key={e.seq}
                    className="flex items-baseline gap-3 rounded px-2 py-1 font-mono text-xs odd:bg-slate-50 dark:odd:bg-slate-800/40"
                  >
                    <span className="w-8 shrink-0 text-right text-slate-400">
                      {e.seq}
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {e.type}
                    </span>
                    {e.detail && (
                      <span className="min-w-0 truncate text-slate-500">
                        {e.detail}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            )}
            <div ref={bottomRef} />
          </div>
        </section>

        {/* Right: the same bytes, reassembled. */}
        <section className="flex min-h-0 flex-col">
          <h2 className="flex shrink-0 items-center gap-2 border-b border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-800">
            <span>Agent response</span>
            {agent.isRunning && (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium normal-case tracking-normal text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                streaming
              </span>
            )}
            {answer && (
              <span className="ml-auto font-mono text-[10px] font-normal normal-case tracking-normal text-slate-400">
                {answer.length} chars
              </span>
            )}
          </h2>
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            {prompt === null ? (
              <p className="py-16 text-center text-sm text-slate-400">
                The reply appears here, rebuilt from the deltas on the left.
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
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    {agentId}
                  </p>
                  {failed ? (
                    <p className="mt-0.5 text-sm text-rose-700 dark:text-rose-400">
                      RUN_FAILED — nothing was streamed. Check the Python server
                      and OPENAI_API_KEY.
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
                <div ref={answerEndRef} />
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
