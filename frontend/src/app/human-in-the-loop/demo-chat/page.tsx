"use client";

import {
  CopilotChat,
  useConfigureSuggestions,
  useHumanInTheLoop,
} from "@copilotkit/react-core/v2";
import { z } from "zod";

import { DemoFrame } from "@/components/demo-frame";

import type { TimeSlot } from "../time-picker-card";
import { TimePickerCard } from "../time-picker-card";

const DEFAULT_SLOTS: TimeSlot[] = [
  { label: "Tomorrow 10:00 AM", iso: "2026-04-19T10:00:00-07:00" },
  { label: "Tomorrow 2:00 PM", iso: "2026-04-19T14:00:00-07:00" },
  { label: "Monday 9:00 AM", iso: "2026-04-21T09:00:00-07:00" },
  { label: "Monday 3:30 PM", iso: "2026-04-21T15:30:00-07:00" },
];

const AGENT_ID = "hitl-in-chat";

export default function Page() {
  return (
    <DemoFrame parentPath="/human-in-the-loop" subtitle={`agent: ${AGENT_ID}`}>
      <Chat />
    </DemoFrame>
  );
}

function Chat() {
  useConfigureSuggestions({
    suggestions: [
      {
        title: "Book a call with sales",
        message:
          "Please book an intro call with the sales team to discuss pricing.",
      },
      {
        title: "Schedule a 1:1 with Alice",
        message: "Schedule a 1:1 with Alice next week to review Q2 goals.",
      },
    ],
    available: "always",
  });

   useHumanInTheLoop({
    agentId: AGENT_ID,
    name: "book_call",
    description:
      "Use this tool for ANY request to schedule, book, set up, arrange, or organize a call, meeting, 1:1, intro, sync, or chat — including phrasings like 'schedule a 1:1 with Alice', 'book a call', or 'set up a meeting'. It presents the user an in-chat time picker with candidate slots and returns their chosen time. ALWAYS prefer this tool over `schedule_meeting` or any other scheduling tool when the user wants to pick a meeting time in this conversation.",
    parameters: z.object({
      topic: z
        .string()
        .describe("What the call is about (e.g. 'Intro with sales')"),
      attendee: z
        .string()
        .describe("Who the call is with (e.g. 'Alice from Sales')"),
    }),
    // The doc page types this render prop `: any` (human-in-the-loop.md:127).
    // Kept as published; suppressed rather than narrowed.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render: ({ args, status, respond }: any) => (
      <TimePickerCard
        topic={args?.topic ?? "a call"}
        attendee={args?.attendee}
        slots={DEFAULT_SLOTS}
        status={status}
        onSubmit={(result) => respond?.(result)}
      />
    ),
  });

  return <CopilotChat agentId={AGENT_ID} className="h-full" />;
}
