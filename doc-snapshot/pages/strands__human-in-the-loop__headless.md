# Headless Interrupts

> Resolve agent interrupts from any UI, without a useInterrupt render slot.


<!-- interactive demo: interrupt-headless -->


## What is this?

`useInterrupt`'s `render` callback is the 80% path: it keeps the UI
glued to a `<CopilotChat>` transcript and handles "when to show the
picker" logic for you. This page covers the escape hatch: a
**render-less** interrupt resolver you assemble from the same
primitives `useInterrupt` uses internally — a pattern that lives
anywhere in your React tree, takes any shape you like (button grid,
form, modal, keyboard shortcut), and resolves the interrupt without
mounting a chat at all.



The underlying primitive is the framework's own interrupt call. How it
reaches the client depends on the bridge, and there are two headless shapes
to match:

- A bridge that surfaces the pause as an `on_interrupt` custom event
  (LangGraph): subscribe to that event and resume the run by calling
  `copilotkit.runAgent({...})` with the matching `resume` payload.
- A bridge that finishes the run with a standard AG-UI interrupt outcome
  (AWS Strands): the run's final `RUN_FINISHED` carries
  `outcome: { type: "interrupt", interrupts: [...] }`. Call `useInterrupt` with
  `renderInChat: false` and place the element it returns wherever you like;
  `resolve(...)` resumes the run.

Either way, no chat surface is required.







## When should I use this?

- **Testing / Playwright fixtures** — a deterministic, chat-less button
  grid is easier to drive than a chat surface where the picker only
  appears after an LLM call.
- **Non-chat UIs** — dashboards, side panels, inspector surfaces, or
  any place where you want the _agent's interrupt_ without the _chat
  transcript_.
- **Custom flow control** — when you need to know exactly when the
  interrupt arrived (e.g. to gate other UI) and when it was resolved.
- **Research / debugging** — when you want to observe the raw AG-UI
  custom events without the abstraction layer.

If you just want "a picker in chat", just use
[`useInterrupt`](./useInterrupt).



## The primitives

<!-- setup skipped: programmatic-control-setup is not bundled for strands -->

The simplest headless pattern uses `useInterrupt` with `renderInChat: false`.
Instead of publishing the element into `<CopilotChat>`, the hook returns the
interrupt element directly so you can place it anywhere in your tree:

```tsx
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
```

`interrupt` carries the primary AG-UI `Interrupt` object
(`{ id, reason, message?, responseSchema?, expiresAt?, ... }`).
`resolve(payload)` submits the user's response and resumes the agent.
`cancel()` cancels the interrupt and resumes. Both return a
`Promise<RunAgentResult | void>` — void while waiting on further interrupts
when more than one is open.

Under the hood, `useInterrupt` composes two public APIs:

1. **`agent.subscribe({ onCustomEvent, onRunStartedEvent, onRunFinishedEvent, onRunFinalized, onRunFailed })`**
   — every `AbstractAgent` exposes an AG-UI event subscription.
   Standard interrupts arrive on `onRunFinishedEvent` with
   `{ outcome: { type: "interrupt", interrupts: [...] } }`; legacy LangGraph
   interrupts arrive as a custom event named `on_interrupt`.
2. **`copilotkit.runAgent({ agent, resume })`** (standard) or
   **`copilotkit.runAgent({ agent, forwardedProps: { command: { resume, interruptEvent } } })`** (legacy)
   — the same call `useInterrupt`'s `resolve()` / `cancel()` makes to resume a paused run.

What that region shows depends on the framework. Where the framework pauses
with a legacy custom event, it is a hand-rolled hook over the raw
subscription; where it pauses with a standard AG-UI interrupt, the same
`useInterrupt` call with `renderInChat: false` is all that is needed, and the
snippet shows that instead. Either way, the raw primitives remain available
when you want full control (testing fixtures, custom accumulation logic):

```typescript
// src/app/demos/interrupt-headless/page.tsx
import React, { useEffect, useState } from "react";
import {
  CopilotKit,
  CopilotChat,
  useConfigureSuggestions,
  useInterrupt,
} from "@copilotkit/react-core/v2";
import { generateFallbackSlots } from "../_shared/interrupt-fallback-slots";
import type { TimeSlot } from "../_shared/interrupt-fallback-slots";

type InterruptPayload = {
  topic?: string;
  attendee?: string;
  slots?: TimeSlot[];
};

// Read the tool's `interrupt()` reason off an AG-UI interrupt.
//
// The two bridges expose it on different channels: `ag_ui_strands` (Python)
// carries the reason object under `metadata.reason`, while the published
// `@ag-ui/aws-strands` 0.2.3 JSON-encodes it into `message` instead. Both are
// read so one page serves both, and the legacy event value is read last for
// adapters that pass the payload through unwrapped.
/**
 * JSON.parse that never throws and never returns a primitive. Both readers run
 * inside a React render callback, where a throw takes the whole pane down.
 */
function parseObject(raw: string | undefined): Record<string, unknown> | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    return parsed && typeof parsed === "object"
      ? (parsed as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

function readInterruptPayload(
  interrupt: { metadata?: unknown; message?: string } | null | undefined,
  eventValue: unknown,
): InterruptPayload {
  const metadata = interrupt?.metadata as
    | { reason?: InterruptPayload }
    | undefined;
  if (metadata?.reason && typeof metadata.reason === "object") {
    return metadata.reason;
  }

  // The published TypeScript bridge JSON-encodes the reason into `message`
  // instead of carrying it on metadata.
  const decoded = parseObject(interrupt?.message);
  if (decoded) {
    const nested = (decoded as { reason?: InterruptPayload }).reason;
    return nested && typeof nested === "object"
      ? nested
      : (decoded as InterruptPayload);
  }

  // Legacy channel: some adapters pass the payload through as the event value,
  // JSON-encoded or not.
  const legacy =
    typeof eventValue === "string" ? parseObject(eventValue) : eventValue;
  if (!legacy || typeof legacy !== "object") return {};
  const wrapped = (legacy as { metadata?: { reason?: InterruptPayload } })
    .metadata?.reason;
  if (wrapped && typeof wrapped === "object") return wrapped;
  return legacy as InterruptPayload;
}

export default function InterruptHeadlessDemo() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit" agent="interrupt-headless">
      <Layout />
    </CopilotKit>
  );
}

function Layout() {
  const [resolving, setResolving] = useState(false);
  const interruptElement = useInterrupt({
    agentId: "interrupt-headless",
    renderInChat: false,
    render: ({ event, interrupt, resolve }) => {
      const payload = readInterruptPayload(interrupt, event.value);
      const resumeAfterPaint = (response: unknown) => {
        setResolving(true);
        // A frame boundary lets React paint before resume unmounts the
        // interrupt, but `requestAnimationFrame` never fires in a background
        // tab, so a timer runs whichever comes first and the resume cannot be
        // stranded. Fire-and-forget by design: a rejected resume is re-surfaced
        // globally instead of disappearing.
        let fired = false;
        const resumeOnce = () => {
          if (fired) return;
          fired = true;
          void resolve(response).then(
            () => setResolving(false),
            (error) => {
              setResolving(false);
              queueMicrotask(() => {
                throw error;
              });
            },
          );
        };
        requestAnimationFrame(resumeOnce);
        window.setTimeout(resumeOnce, 100);
      };
      return (
        <TimeSlotPopup
          payload={payload}
          onPick={(slot) => {
            resumeAfterPaint({
              chosen_time: slot.iso,
              chosen_label: slot.label,
            });
          }}
          onCancel={() => {
            resumeAfterPaint({ cancelled: true });
          }}
        />
      );
    },
  });

  useEffect(() => {
    if (interruptElement) {
      setResolving(false);
    }
  }, [interruptElement]);

  useConfigureSuggestions({
    suggestions: [
      {
        title: "Book a call with sales",
        message: "Book an intro call with the sales team to discuss pricing.",
      },
      {
        title: "Schedule a 1:1 with Alice",
        message: "Schedule a 1:1 with Alice next week to review Q2 goals.",
      },
    ],
    available: "always",
  });

  return (
    <div className="grid h-screen grid-cols-[1fr_420px] bg-[#FAFAFC]">
      <AppSurface interruptElement={interruptElement} resolving={resolving} />
      <div className="border-l border-[#DBDBE5] bg-white">
        <CopilotChat agentId="interrupt-headless" className="h-full" />
      </div>
    </div>
  );
}
```

A few things the hand-rolled variant is careful about:

- It stages the incoming event in a local ref and only commits
  it to React state on `onRunFinalized`, mirroring `useInterrupt`,
  which doesn't surface the interrupt until the run has actually paused
  (not just when the event fires mid-stream).
- `onRunStartedEvent` clears any stale pending state, so kicking off a
  new turn always starts from a clean slate.
- `onRunFailed` drops the staged event so a transport hiccup doesn't
  leave the UI stuck showing a picker for a run that never paused.







## Driving it from plain UI

The preferred approach uses `useInterrupt` with `renderInChat: false` — no
hand-rolled subscription, no `<CopilotChat>`, no render prop:

```tsx
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
```

If you need full control over the subscription (e.g. for a custom
`useHeadlessInterrupt` fixture used in Playwright tests), you can still
use the raw primitives from `useHeadlessInterrupt` defined above:

```tsx
function HeadlessInterruptPanelRaw() {
  const { copilotkit } = useCopilotKit();
  const { agent } = useAgent({ agentId: "interrupt-headless" });
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
```



## Going further

- [Tool-based HITL with `useHumanInTheLoop`](../human-in-the-loop) — for
  LLM-initiated pauses where the model decides on the fly to ask the
  user, rather than the runtime forcing the pause itself.
- [`useInterrupt`](./useInterrupt) — the render-prop version of this
  page, with `enabled` gating and `handler` preprocessing.
