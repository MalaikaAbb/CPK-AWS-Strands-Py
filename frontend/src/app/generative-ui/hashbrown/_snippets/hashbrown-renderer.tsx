/**
 * The page's `frontend/src/app/hashbrown-renderer.tsx` block, verbatim
 * between the region markers
 * (https://docs.copilotkit.ai/strands/generative-ui/hashbrown).
 *
 * Repo-authored, above the region: the `AssistantMessage` type import the
 * block uses and never writes. `./metric-card` and `./charts` are
 * repo-authored re-exports of the leaf components the same page publishes in
 * its embedded demo.
 *
 * NOT fixed, on purpose: all three Hashbrown calls. In @hashbrownai/react
 * 0.6.1 `useJsonParser(json, schema)` needs a schema, `useUiKit` takes
 * `{ components }` built with `exposeComponent`, and the kit it returns is an
 * object drawn with `kit.render(value)`, not a React node. Each line carries a
 * `@ts-expect-error` so the route throws where the doc code breaks.
 */
import type { AssistantMessage } from "@copilotkit/react-core/v2";

// #region renderer — verbatim
import { useJsonParser, useUiKit } from "@hashbrownai/react";
import { MetricCard } from "./metric-card";
import { PieChart, BarChart } from "./charts";

const catalog = {
  MetricCard,
  PieChart,
  BarChart,
};

export function HashBrownAssistantMessage({ message }: { message: AssistantMessage }) {
  // @ts-expect-error doc API mismatch, kept as published — @hashbrownai/react 0.6.1 useJsonParser(json, schema) requires a schema
  const parsed = useJsonParser(message.content ?? "");
  // @ts-expect-error doc API mismatch, kept as published — useUiKit takes { components }, not { catalog, value }
  const ui = useUiKit({ catalog, value: parsed });
  // @ts-expect-error doc API mismatch, kept as published — useUiKit returns a kit object (render with ui.render(value)), not a ReactNode
  return <div className="space-y-3">{ui}</div>;
}
// #endregion
