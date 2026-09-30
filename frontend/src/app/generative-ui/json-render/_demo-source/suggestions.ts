// Verbatim from the `src/app/demos/declarative-json-render/suggestions.ts` code tab of the embedded demo on
// https://docs.copilotkit.ai/strands/generative-ui/json-render — not edited except for
// this header and any `@ts-expect-error` line (see the route's notes).
import { useConfigureSuggestions } from "@copilotkit/react-core/v2";

export const BYOC_JSON_RENDER_SUGGESTIONS = [
  {
    title: "Sales dashboard",
    message: "Show me the sales dashboard with metrics and a revenue chart",
  },
  {
    title: "Revenue by category",
    message: "Break down revenue by category as a pie chart",
  },
  {
    title: "Expense trend",
    message: "Show me monthly expenses as a bar chart",
  },
];

export function useByocJsonRenderSuggestions() {
  useConfigureSuggestions({
    suggestions: BYOC_JSON_RENDER_SUGGESTIONS,
    available: "always",
  });
}
