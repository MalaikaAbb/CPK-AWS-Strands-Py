"use client";
// HARNESS: the directive above is the one line added before the doc region.
// The page prints this file without it, and every hook below needs it.

/**
 * `src/app/demos/interrupt-headless/page.tsx` from
 * https://docs.copilotkit.ai/strands/human-in-the-loop/headless ("The
 * primitives"), verbatim between the region markers.
 *
 * The page prints only the top of the file. Three names it uses are defined
 * nowhere on the page:
 *   - `../_shared/interrupt-fallback-slots` (`generateFallbackSlots`,
 *     `TimeSlot`), rebuilt in `headless/_shared/interrupt-fallback-slots.ts`;
 *   - `TimeSlotPopup` and `AppSurface`, rebuilt below the region.
 * All three are this repo's. Their gap is `headless-demo-file-truncated` in
 * `lib/doc-gaps.ts`.
 */

// #region doc-page
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
// #endregion

// #region harness — the two components the published excerpt uses but never defines
import Link from "next/link";

import { TimePickerCard } from "../../time-picker-card";

/**
 * Reuses the `/human-in-the-loop` picker card. The card only offers slots when
 * `status` is "executing". An interrupt is only rendered while it is open, so
 * that status is always true here.
 */
function TimeSlotPopup({
  payload,
  onPick,
  onCancel,
}: {
  payload: InterruptPayload;
  onPick: (slot: TimeSlot) => void;
  onCancel: () => void;
}) {
  const slots = payload.slots?.length ? payload.slots : generateFallbackSlots();
  return (
    <TimePickerCard
      topic={payload.topic || "a call"}
      attendee={payload.attendee || undefined}
      slots={slots}
      status="executing"
      onSubmit={(result) => {
        if ("cancelled" in result) {
          onCancel();
          return;
        }
        onPick({ iso: result.chosen_time, label: result.chosen_label });
      }}
    />
  );
}

/** The non-chat half of the layout: a dashboard where the picker is placed by hand. */
function AppSurface({
  interruptElement,
  resolving,
}: {
  interruptElement: React.ReactElement | null;
  resolving: boolean;
}) {
  const state = resolving
    ? "Resuming the agent with your answer…"
    : interruptElement
      ? "Agent paused. It is waiting on the picker below."
      : "No open interrupt. Ask the chat on the right to book a call.";

  return (
    <main className="flex min-h-0 flex-col gap-6 overflow-y-auto p-8">
      <header className="flex items-baseline justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-[#010507]">
            Scheduling dashboard
          </h1>
          <p className="text-xs text-[#57575B]">
            agent: interrupt-headless · picker rendered with renderInChat: false
          </p>
        </div>
        <Link
          href="/human-in-the-loop/headless"
          className="text-xs text-[#57575B] underline underline-offset-4"
        >
          ← Notes &amp; source
        </Link>
      </header>
      <p
        className="rounded-xl border border-[#DBDBE5] bg-white px-4 py-3 text-sm text-[#57575B]"
        data-testid="interrupt-state"
      >
        {state}
      </p>
      {interruptElement}
    </main>
  );
}
// #endregion
