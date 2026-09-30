/**
 * HARNESS-AUTHORED. The Headless Interrupts demo imports this module as
 * `../_shared/interrupt-fallback-slots`, and no page publishes it. The two
 * exports are the smallest thing that satisfies that import. The slots are
 * the same four the `/human-in-the-loop` route offers.
 *
 * The folder starts with `_`, so Next treats it as private and builds no route
 * for it.
 */
import { DEFAULT_SLOTS } from "../../slots";
import type { TimeSlot } from "../../time-picker-card";

export type { TimeSlot };

/** The picker's slots when the interrupt reason carries none. The published agent never sends any. */
export function generateFallbackSlots(): TimeSlot[] {
  return DEFAULT_SLOTS;
}
