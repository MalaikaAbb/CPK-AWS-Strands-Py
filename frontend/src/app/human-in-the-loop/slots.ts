import type { TimeSlot } from "./time-picker-card";

/**
 * The candidate slots both HITL routes offer.
 *
 * Page-owned data, not agent-owned: the model decides *that* a time is needed
 * and passes the topic and attendee, but the options come from the app. Swap in
 * real availability or a calendar API and nothing else has to change.
 */
export const DEFAULT_SLOTS: TimeSlot[] = [
  { label: "Tomorrow 10:00 AM", iso: "2026-04-19T10:00:00-07:00" },
  { label: "Tomorrow 2:00 PM", iso: "2026-04-19T14:00:00-07:00" },
  { label: "Monday 9:00 AM", iso: "2026-04-21T09:00:00-07:00" },
  { label: "Monday 3:30 PM", iso: "2026-04-21T15:30:00-07:00" },
];
