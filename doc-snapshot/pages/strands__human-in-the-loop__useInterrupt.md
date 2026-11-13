# Pausing the Agent for Input

> Pause an agent run mid-tool, hand control to a custom React component, and resume with the user's answer.


<!-- interactive demo: gen-ui-interrupt -->


## What is this?

`useInterrupt` lets your agent pause mid-run, hand control to the user
through a custom React component, and resume with whatever the user
returns. How that pause is implemented depends on the framework's
runtime.



This framework ships a first-class interrupt primitive that lets running
work suspend itself and hand control to the client
([LangGraph](https://docs.langchain.com/oss/python/langgraph/interrupts),
[AWS Strands](https://strandsagents.com/docs/user-guide/concepts/interrupts/)).
The run is frozen server-side until the client resolves the interrupt with a
payload, at which point execution resumes as if the interrupt call had simply
returned that payload.

CopilotKit's `useInterrupt` is the frontend half of that contract: it
subscribes to the paused run, renders whatever component you give it,
and calls the agent back with the user's answer.







## When should I use this?

Reach for `useInterrupt` when the pause is a **graph-enforced
checkpoint** where the code path _must_ stop and wait for a human,
not an LLM-initiated tool call. Typical cases:

- A sensitive action (payments, irreversible writes) must be approved
- A required piece of state isn't known and can only be collected from the user
- The agent explicitly reaches an approval node in a longer workflow
- You want the server-side contract to be `interrupt(...)` and resume with a payload

For LLM-initiated pauses where the model decides on the fly to ask
the user, prefer [`useHumanInTheLoop`](../human-in-the-loop).



## The backend: `interrupt()` inside a tool

<Steps>
  <Step>
    ### Pause a tool with Strands' native interrupt

    AWS Strands ships a first-class
    [interrupt primitive](https://strandsagents.com/docs/user-guide/concepts/interrupts/).
    A tool declared with `@tool(context=True)` calls
    `tool_context.interrupt(name, reason=...)`, which halts the agent loop and
    hands `reason` to the client as the interrupt payload. The AG-UI adapter
    finishes the run with `RUN_FINISHED` carrying `outcome.type == "interrupt"`.

    
~~~~python title="src/agents/interrupt_agent.py"
@tool(context=True)
def schedule_meeting(topic: str, tool_context: ToolContext, attendee: str = "") -> str:
    """Ask the user to pick a meeting time, then confirm what was scheduled.

    Args:
        topic: Short description of the meeting purpose.
        attendee: Who the meeting is with, if known.
    """
    answer = tool_context.interrupt(
        "schedule_meeting",
        reason={"topic": topic, "attendee": attendee},
    )

    # Neither the envelope nor the value inside it is guaranteed to be a
    # mapping: `ag_ui_strands` wraps a resolved answer as `{"response": ...}`
    # and a cancel as `{"cancelled": True}`, but the payload itself is whatever
    # the client sent, and a client that answers with a bare value would make
    # `answer.get` raise inside the tool. Both levels are checked.
    envelope: Mapping = answer if isinstance(answer, Mapping) else {}
    # `ag_ui_strands` wraps the answer under "response"; a bridge that passes
    # the client payload through (the published TypeScript one does) hands the
    # payload itself, so a mapping without that key IS the payload.
    inner = envelope["response"] if "response" in envelope else envelope
    payload = inner if isinstance(inner, Mapping) else {}
    cancelled = (
        envelope.get("cancelled")
        or envelope.get("status") == "cancelled"
        or payload.get("cancelled")
        or payload.get("status") == "cancelled"
    )
    if cancelled:
        return f"User cancelled. Meeting NOT scheduled: {topic}"

    label = payload.get("chosen_label") or payload.get("chosen_time")
    if not label:
        return f"User did not pick a time. Meeting NOT scheduled: {topic}"
    return f"Meeting scheduled for {label}: {topic}"


~~~~


    The resume payload arrives wrapped: an answer as `{"response": ...}`, a
    client-side cancel as `{"cancelled": True}`. The adapter wraps it because
    Strands' resume gate is truthiness-based, so a bare falsy answer would
    re-raise the same interrupt forever.

  </Step>
  <Step>
    ### Keep the pausing tool off a client-executed name

    `useHumanInTheLoop` registers its tool on the FRONTEND, so a name used
    there cannot also be a pausing backend tool. This showcase mounts a
    dedicated interrupt agent and points the interrupt demos' agent names at
    it, leaving `schedule_meeting` on the shared agent free for the
    frontend-tool flow.

  </Step>
  <Step>
    ### Resume in the same process, or across a restart

    Pause and resume on the same running process need no extra wiring. For a
    resume that survives a restart, give the agent a Strands `SessionManager`
    through `StrandsAgentConfig.session_manager_provider`; the adapter
    persists its interrupt checkpoint into that session.

  </Step>
</Steps>

The example agent exposes a `schedule_meeting` tool. When the model
calls it, the tool interrupts itself with the meeting context. The run
freezes here until the client resolves; the resolution becomes the return
value of the interrupt call, which the tool then turns into a final string
for the model:

```python
# src/agents/interrupt_agent.py
@tool(context=True)
def schedule_meeting(topic: str, tool_context: ToolContext, attendee: str = "") -> str:
    """Ask the user to pick a meeting time, then confirm what was scheduled.

    Args:
        topic: Short description of the meeting purpose.
        attendee: Who the meeting is with, if known.
    """
    answer = tool_context.interrupt(
        "schedule_meeting",
        reason={"topic": topic, "attendee": attendee},
    )

    # Neither the envelope nor the value inside it is guaranteed to be a
    # mapping: `ag_ui_strands` wraps a resolved answer as `{"response": ...}`
    # and a cancel as `{"cancelled": True}`, but the payload itself is whatever
    # the client sent, and a client that answers with a bare value would make
    # `answer.get` raise inside the tool. Both levels are checked.
    envelope: Mapping = answer if isinstance(answer, Mapping) else {}
    # `ag_ui_strands` wraps the answer under "response"; a bridge that passes
    # the client payload through (the published TypeScript one does) hands the
    # payload itself, so a mapping without that key IS the payload.
    inner = envelope["response"] if "response" in envelope else envelope
    payload = inner if isinstance(inner, Mapping) else {}
    cancelled = (
        envelope.get("cancelled")
        or envelope.get("status") == "cancelled"
        or payload.get("cancelled")
        or payload.get("status") == "cancelled"
    )
    if cancelled:
        return f"User cancelled. Meeting NOT scheduled: {topic}"

    label = payload.get("chosen_label") or payload.get("chosen_time")
    if not label:
        return f"User did not pick a time. Meeting NOT scheduled: {topic}"
    return f"Meeting scheduled for {label}: {topic}"


```

Two things to note:

- The payload (`{"topic": topic, "attendee": attendee}`) is what the
  frontend reads off the interrupt. Keep it a plain, serializable object.
  It's the "pause-time context" the UI needs to render. Where it lands
  depends on the bridge: LangGraph hands it to `render` as `event.value`,
  while a standard AG-UI interrupt carries it on the interrupt itself, either
  under `metadata` or JSON-encoded into `message`. Read the channels your
  bridge uses rather than assuming one.
- The return-side contract (`{chosen_label, chosen_time}` or
  `{cancelled: true}`) is entirely yours. The client can send anything
  as the resolve payload; the tool is the one that gives it meaning.

## The frontend: `useInterrupt` render prop

On the client you register a `useInterrupt` hook per agent. When the
paused run arrives, `render` receives both the raw `event` and the
`interrupt` itself, and `resolve(...)` is how you resume the run. Where the
payload sits depends on how the framework pauses: a legacy custom-event
interrupt carries it on `event.value`, while a standard AG-UI interrupt
carries it on the `interrupt` (its `metadata`, or a JSON-encoded `message`,
depending on the bridge). Read the channel your framework uses:

```typescript
// src/app/demos/gen-ui-interrupt/page.tsx
import {
  CopilotKit,
  CopilotChat,
  useInterrupt,
} from "@copilotkit/react-core/v2";
import type { TimeSlot } from "./_components/time-picker-card";
import { TimePickerCard } from "./_components/time-picker-card";
import { generateFallbackSlots } from "../_shared/interrupt-fallback-slots";
import { useGenUiInterruptSuggestions } from "./suggestions";

// Shape the backend `schedule_meeting` tool pauses with: its `interrupt()`
// `reason` payload. `slots` is absent on the Strands path (the tool passes only
// topic and attendee), so the picker falls back to generated slots.
type SchedulingPayload = {
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

function readSchedulingPayload(
  interrupt: { metadata?: unknown; message?: string } | null | undefined,
  eventValue: unknown,
): SchedulingPayload {
  const metadata = interrupt?.metadata as
    | { reason?: SchedulingPayload }
    | undefined;
  if (metadata?.reason && typeof metadata.reason === "object") {
    return metadata.reason;
  }

  // The published TypeScript bridge JSON-encodes the reason into `message`
  // instead of carrying it on metadata.
  const decoded = parseObject(interrupt?.message);
  if (decoded) {
    const nested = (decoded as { reason?: SchedulingPayload }).reason;
    return nested && typeof nested === "object"
      ? nested
      : (decoded as SchedulingPayload);
  }

  // Legacy channel: some adapters pass the payload through as the event value,
  // JSON-encoded or not.
  const legacy =
    typeof eventValue === "string" ? parseObject(eventValue) : eventValue;
  if (!legacy || typeof legacy !== "object") return {};
  const wrapped = (legacy as { metadata?: { reason?: SchedulingPayload } })
    .metadata?.reason;
  if (wrapped && typeof wrapped === "object") return wrapped;
  return legacy as SchedulingPayload;
}

export default function GenUiInterruptDemo() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit" agent="gen-ui-interrupt">
      <div className="flex justify-center items-center h-screen w-full">
        <div className="h-full w-full max-w-4xl">
          <Chat />
        </div>
      </div>
    </CopilotKit>
  );
}

function Chat() {
  // The failure banner lives OUTSIDE the interrupt element on purpose. The hook
  // caches the element it rendered, so a picker already on screen never sees an
  // updated prop: a flag threaded into the card would keep showing a stale
  // failure on the NEXT booking, before that booking's resume has even started.
  const [resumeFailed, setResumeFailed] = useState(false);

  return (
    <div className="flex h-full flex-col">
      {resumeFailed && (
        <div
          role="alert"
          data-testid="time-picker-resume-error"
          className="m-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
        >
          Your previous selection could not be sent. Please try booking again.
        </div>
      )}
      <div className="min-h-0 flex-1">
        <InterruptChat setResumeFailed={setResumeFailed} />
      </div>
    </div>
  );
}

function InterruptChat({
  setResumeFailed,
}: {
  setResumeFailed: (failed: boolean) => void;
}) {
  useGenUiInterruptSuggestions();

  // Native interrupt path. The backend `schedule_meeting` tool calls Strands'
  // `tool_context.interrupt(...)`; the @ag-ui/aws-strands bridge finishes the
  // run with `outcome.type === "interrupt"` and carries the tool's `reason`
  // under the interrupt's `metadata.reason`. `resolve(...)` resumes the same
  // Strands run, handing the selection back to that `interrupt()` call.
  useInterrupt({
    agentId: "gen-ui-interrupt",
    renderInChat: true,
    render: ({ event, interrupt, resolve }) => {
      const payload = readSchedulingPayload(interrupt, event.value);
      const slots =
        payload.slots && payload.slots.length > 0
          ? payload.slots
          : generateFallbackSlots();
      return (
        <TimePickerCard
          topic={payload.topic ?? "a call"}
          attendee={payload.attendee}
          slots={slots}
          onSubmit={(result) => {
            setResumeFailed(false);
            // Defer resolve so React commits the picked/cancelled badge before
            // useInterrupt clears the interrupt element (a single rAF is not
            // reliable: it can fire before React's commit). The rejection is
            // re-surfaced rather than dropped, because the card has already
            // shown a green "Booked" badge by then and a silently failed
            // resume would leave the user reading a success that never
            // happened.
            window.setTimeout(() => {
              void resolve(result).catch((error: unknown) => {
                setResumeFailed(true);
                queueMicrotask(() => {
                  throw error;
                });
              });
            }, 500);
          }}
        />
      );
    },
  });
```

Whatever you pass to `resolve` is round-tripped back to the agent as
the return value of the matching `interrupt(...)` call.







### Key props

- **`agentId`** — must match a runtime-registered agent. If omitted, the
  hook assumes `"default"`. A mismatch means the interrupt never fires.
- **`render`** — receives `{ event, interrupt, resolve }`. The payload you
  passed to `interrupt(...)` on the server arrives on `event.value` for a
  legacy custom-event interrupt and on the `interrupt` for a standard one.
- **`renderInChat`** — when `true` (as above), the picker appears inline
  in the chat transcript, between the paused assistant turn and the
  still-pending continuation.

## Multiple interrupts? Add a type and gate with `enabled`

If your graph issues more than one kind of interrupt (e.g. `"ask"` vs
`"approval"`), tag each with a `type` field on the payload and install
one `useInterrupt` per shape, each gated by an `enabled` predicate:

```tsx
useInterrupt({
  agentId: "gen-ui-interrupt",
  enabled: (event) => event.value.type === "ask",
  render: ({ event, resolve }) => (
    <AskCard question={event.value.content} onAnswer={resolve} />
  ),
});

useInterrupt({
  agentId: "gen-ui-interrupt",
  enabled: (event) => event.value.type === "approval",
  render: ({ event, resolve }) => (
    <ApproveCard content={event.value.content} onAnswer={resolve} />
  ),
});
```

## Preprocess with `handler`

For cases where the interrupt can sometimes be resolved _without_ user
input (e.g. the current user already has permission), pass a `handler`
that runs before `render`. The handler can call `resolve(...)` itself
to resume the agent early — the interrupt card unmounts when the resume
run starts. Or return a value that `render` receives as `result`:

```tsx
useInterrupt({
  agentId: "gen-ui-interrupt",
  handler: async ({ event, resolve }) => {
    const dept = await lookupUserDepartment();
    if (event.value.accessDepartment === dept || dept === "admin") {
      resolve({ code: "AUTH_BY_DEPARTMENT" });
      return; // agent will resume; card unmounts when the run starts
    }
    return { dept };
  },
  render: ({ result, event, resolve }) => (
    <RequestAccessCard
      dept={result?.dept}
      onRequest={() => resolve({ code: "REQUEST_AUTH" })}
      onCancel={() => resolve({ code: "CANCEL" })}
    />
  ),
});
```



## AG-UI standard interrupt flow vs. legacy

`useInterrupt` supports two interrupt transports. Understanding which one your
agent uses helps you write the right `render` code.

### Standard flow (`RUN_FINISHED` with `outcome.type === "interrupt"`)

When the agent backend conforms to the AG-UI protocol, it signals an interrupt
by emitting a `RUN_FINISHED` event whose outcome carries the interrupts array:

```
outcome.type === "interrupt"
outcome.interrupts  // Interrupt[]
```

The hook detects this on `onRunFinishedEvent` and exposes the interrupts on the
render props **after** `onRunFinalized` fires. Your `render` function receives:

- **`interrupt`** — the primary `Interrupt` (`interrupts[0]`), with shape
  `{ id, reason, message?, toolCallId?, responseSchema?, expiresAt?, metadata? }`.
- **`interrupts`** — the full open set (usually one, but multi-interrupt is
  supported — see below).
- **`resolve(payload?, interruptId?)`** — records `{ status: "resolved", payload }`
  for the targeted interrupt (defaults to the primary). The agent run resumes
  once every open interrupt has a response.
- **`cancel(interruptId?)`** — records `{ status: "cancelled" }` for the
  targeted interrupt. Same accumulate-then-submit logic applies.

### Legacy flow (`on_interrupt` custom event)

Older agents (or agents not yet migrated to the AG-UI interrupt spec) emit a
custom `on_interrupt` event. The hook detects this on `onCustomEvent` and sets
`interrupt` to `null` and `interrupts` to `[]`. The payload is in
`event.value`. Calling `resolve(payload)` resumes via `forwardedProps.command`
(the legacy resume mechanism). `cancel()` dismisses the interrupt without
resuming — the agent never receives a response.

### Priority

If both signals appear on the same run (unlikely but possible during migration),
the standard flow wins.

### Approve / Cancel example

```tsx
function ApprovalInterrupt() {
  useInterrupt({
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
  return null;
}
```

`resolve({ approved: true })` records a resolved entry and submits the `resume`
array to the agent. `cancel()` records a cancelled entry and does the same.
Both return the `RunAgentResult` once the run restarts.

### Multi-interrupt behavior

Some agents issue more than one interrupt in a single run (e.g. two independent
approvals). Each interrupt has its own `id`. Address them individually:

```tsx
useInterrupt({
  render: ({ interrupts, resolve, cancel }) => (
    <ul>
      {interrupts.map((i) => (
        <li key={i.id}>
          {i.message}
          <button onClick={() => resolve({ ok: true }, i.id)}>Approve</button>
          <button onClick={() => cancel(i.id)}>Cancel</button>
        </li>
      ))}
    </ul>
  ),
});
```

The agent run only resumes once **every** open interrupt has been addressed.
Calling `resolve` or `cancel` with a specific `interruptId` marks that interrupt
done; the hook auto-submits the accumulated responses when the last one is
addressed. If you omit `interruptId`, the primary interrupt (`interrupts[0]`)
is targeted.

### `responseSchema` — surface only, no client-side validation

The `Interrupt` type exposes a `responseSchema` field (a JSON Schema object)
that the agent can use to describe the expected payload shape. `useInterrupt`
surfaces this field on `interrupt.responseSchema` for your UI to read
(e.g. to drive a form), but it does **not** validate `resolve` payloads against
it. Validation is the agent's responsibility on resume.

## Going further

- [Tool-based HITL with `useHumanInTheLoop`](../human-in-the-loop) — for
  LLM-initiated pauses.
- [Headless interrupts](./headless) — compose the lower-level primitives
  (`useAgent`, `agent.subscribe`, `copilotkit.runAgent`) to resolve
  interrupts outside a chat surface.
