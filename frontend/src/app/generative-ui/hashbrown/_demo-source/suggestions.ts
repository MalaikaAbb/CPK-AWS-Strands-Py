// Verbatim from the `src/app/demos/declarative-hashbrown/suggestions.ts` code tab of the embedded demo on
// https://docs.copilotkit.ai/strands/generative-ui/hashbrown — not edited except for
// this header and any `@ts-expect-error` line (see the route's notes).
import { useConfigureSuggestions } from "@copilotkit/react-core/v2";

export interface Suggestion {
  label: string;
  prompt: string;
}

export const BYOC_HASHBROWN_SUGGESTIONS: Suggestion[] = [
  {
    label: "Sales dashboard",
    prompt:
      "Show me a Q4 sales dashboard. Include a total-revenue metric card, a pie chart of revenue by segment, and a bar chart of monthly revenue.",
  },
  {
    label: "Revenue by category",
    prompt:
      "Break down Q4 revenue by product category as a pie chart. Include at least four segments with realistic sample values.",
  },
  {
    label: "Expense trend",
    prompt:
      "Show me monthly operating expenses for the last six months as a bar chart with one bar per month.",
  },
];

export function useByocHashbrownSuggestions() {
  useConfigureSuggestions({
    suggestions: BYOC_HASHBROWN_SUGGESTIONS.map((s) => ({
      title: s.label,
      message: s.prompt,
    })),
    available: "always",
  });
}
