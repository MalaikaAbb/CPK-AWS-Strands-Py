// Verbatim from the `src/app/demos/declarative-hashbrown/types.ts` code tab of the embedded demo on
// https://docs.copilotkit.ai/strands/generative-ui/hashbrown — not edited except for
// this header and any `@ts-expect-error` line (see the route's notes).
export const SALES_STAGES = [
  "prospect",
  "qualified",
  "proposal",
  "negotiation",
  "closed-won",
  "closed-lost",
] as const;

export type SalesStage = (typeof SALES_STAGES)[number];
