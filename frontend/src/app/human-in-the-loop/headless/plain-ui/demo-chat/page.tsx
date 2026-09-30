"use client";

/**
 * The three smaller snippets from
 * https://docs.copilotkit.ai/strands/human-in-the-loop/headless, each verbatim
 * between its region markers:
 *   - `ApprovalPanel` ("The primitives"),
 *   - `HeadlessInterruptPanel` ("Driving it from plain UI"),
 *   - `HeadlessInterruptPanelRaw` (same section).
 *
 * The snippets print no imports. The import line and `SLOTS` are this repo's.
 * The page never defines `SLOTS`. `useHeadlessInterrupt` is kept undefined
 * because neither the page nor the package defines it: the page says it is
 * "defined above", but for Strands that spot shows the `useInterrupt` demo
 * instead. `@copilotkit/react-core/v2` 1.75.1 does not export it either, so
 * the Raw panel throws a ReferenceError when it mounts. It sits behind a button
 * and an error boundary so the error shows up in place.
 *
 * Everything below the last region is harness code.
 */

import React, { Component, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  CopilotKit,
  useAgent,
  useCopilotKit,
  useInterrupt,
} from "@copilotkit/react-core/v2";

import { nestedInspectorSetting } from "@/lib/inspector";

import { DEFAULT_SLOTS } from "../../../slots";

/** HARNESS: the snippets map over `SLOTS`, which the page never defines. */
const SLOTS = DEFAULT_SLOTS;

// #region approval-panel
function ApprovalPanel() {
  const element = useInterrupt({
    renderInChat: false,
    render: ({ interrupt, resolve, cancel }) => (
      <div className="p-3 border rounded">
        <p>{interrupt?.message ?? "Approve this action?"}</p>
        <div className="mt-2 flex gap-2">
          <button onClick={() => resolve({ approved: true })}>Approve</button>
          <button onClick={() => cancel()}>Cancel</button>
        </div>
      </div>
    ),
  });

  // `element` is null while no interrupt is active; render it wherever you like.
  return <div className="approval-panel">{element}</div>;
}
// #endregion

// #region plain-ui
function HeadlessInterruptPanel() {
  const { copilotkit } = useCopilotKit();
  const { agent } = useAgent({ agentId: "interrupt-headless" });

  const kickOff = (prompt: string) => {
    agent.addMessage({ id: crypto.randomUUID(), role: "user", content: prompt });
    void copilotkit.runAgent({ agent });
  };

  const interruptElement = useInterrupt({
    renderInChat: false,
    render: ({ interrupt, resolve, cancel }) => (
      <div>
        <p>Pick a slot for {interrupt?.message ?? "a call"}:</p>
        {SLOTS.map((s) => (
          <button key={s.iso} onClick={() => resolve({ chosen_time: s.iso, chosen_label: s.label })}>
            {s.label}
          </button>
        ))}
        <button onClick={() => cancel()}>Cancel</button>
      </div>
    ),
  });

  if (interruptElement) {
    return interruptElement;
  }

  return <button onClick={() => kickOff("Book a call with sales.")}>Book call</button>;
}
// #endregion

// #region plain-ui-raw
function HeadlessInterruptPanelRaw() {
  const { copilotkit } = useCopilotKit();
  const { agent } = useAgent({ agentId: "interrupt-headless" });
  // @ts-expect-error useHeadlessInterrupt is defined on no Strands page and not exported by @copilotkit/react-core/v2 (README §9)
  const { pending, resolve } = useHeadlessInterrupt("interrupt-headless");

  const kickOff = (prompt: string) => {
    agent.addMessage({ id: crypto.randomUUID(), role: "user", content: prompt });
    void copilotkit.runAgent({ agent });
  };

  if (pending) {
    return (
      <div>
        <p>Pick a slot for {pending.value.topic ?? "a call"}:</p>
        {SLOTS.map((s) => (
          <button key={s.iso} onClick={() => resolve({ chosen_time: s.iso, chosen_label: s.label })}>
            {s.label}
          </button>
        ))}
        <button onClick={() => resolve({ cancelled: true })}>Cancel</button>
      </div>
    );
  }

  return <button onClick={() => kickOff("Book a call with sales.")}>Book call</button>;
}
// #endregion

// #region harness
class ThrowCatcher extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <p
          className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 font-mono text-xs text-rose-900"
          data-testid="raw-panel-error"
        >
          threw: {this.state.error.name}: {this.state.error.message}
        </p>
      );
    }
    return this.props.children;
  }
}

function Box({ title, note, children }: { title: string; note: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="font-mono text-sm font-semibold text-slate-900">{title}</h2>
      <p className="mt-1 text-xs text-slate-500">{note}</p>
      <div className="mt-3 space-y-2 text-sm [&_button]:mr-2 [&_button]:rounded-md [&_button]:border [&_button]:border-slate-300 [&_button]:px-2.5 [&_button]:py-1 [&_button:hover]:bg-slate-50">
        {children}
      </div>
    </section>
  );
}

function RawPanelSlot() {
  const [mounted, setMounted] = useState(false);
  if (!mounted) {
    return <button onClick={() => setMounted(true)}>Mount HeadlessInterruptPanelRaw</button>;
  }
  return (
    <ThrowCatcher>
      <HeadlessInterruptPanelRaw />
    </ThrowCatcher>
  );
}

export default function Page() {
  return (
    <CopilotKit
      runtimeUrl="/api/copilotkit"
      agent="interrupt-headless"
      // Same props as the doc's own demo provider, plus the inspector routing
      // every nested provider in this repo uses.
      enableInspector={nestedInspectorSetting}
    >
      <div className="min-h-dvh bg-[#FAFAFC] p-8">
        <header className="mb-6 flex items-baseline justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold">Headless Interrupts, no chat</h1>
            <p className="text-xs text-slate-500">
              agent: interrupt-headless · the page&apos;s three smaller snippets, no CopilotChat mounted
            </p>
          </div>
          <Link href="/human-in-the-loop/headless" className="text-xs underline underline-offset-4">
            ← Notes &amp; source
          </Link>
        </header>
        <div className="grid max-w-3xl gap-4">
          <Box
            title="HeadlessInterruptPanel"
            note="Book call adds a user message and starts a run. When the agent pauses, this panel becomes the slot picker."
          >
            <HeadlessInterruptPanel />
          </Box>
          <Box
            title="ApprovalPanel"
            note="A second useInterrupt on the same agent. It shows the same open interrupt. Approve resumes with { approved: true }, which carries no time."
          >
            <ApprovalPanel />
          </Box>
          <Box
            title="HeadlessInterruptPanelRaw"
            note="Calls useHeadlessInterrupt, which does not exist. Mounting it throws."
          >
            <RawPanelSlot />
          </Box>
        </div>
      </div>
    </CopilotKit>
  );
}
// #endregion
