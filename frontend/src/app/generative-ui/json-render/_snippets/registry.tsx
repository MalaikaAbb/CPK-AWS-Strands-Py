// Verbatim from the page's `frontend/src/app/registry.tsx` block
// (https://docs.copilotkit.ai/strands/generative-ui/json-render). Not edited.
// The three imports resolve to repo-authored re-exports of the leaf components
// the same page publishes in its embedded demo (see ./metric-card.tsx).
import { z } from "zod";
import { MetricCard } from "./metric-card";
import { BarChart } from "./charts/bar-chart";
import { PieChart } from "./charts/pie-chart";

export const catalog = {
  MetricCard: {
    component: MetricCard,
    propsSchema: z.object({
      title: z.string(),
      value: z.number(),
      delta: z.number().optional(),
    }),
  },
  BarChart: {
    component: BarChart,
    propsSchema: z.object({
      data: z.array(z.object({ label: z.string(), value: z.number() })),
    }),
  },
  PieChart: {
    component: PieChart,
    propsSchema: z.object({
      data: z.array(z.object({ label: z.string(), value: z.number() })),
    }),
  },
};
