// Verbatim from the `src/app/demos/declarative-json-render/catalog.ts` code tab of the embedded demo on
// https://docs.copilotkit.ai/strands/generative-ui/json-render — not edited except for
// this header and any `@ts-expect-error` line (see the route's notes).
import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/react/schema";
import { z } from "zod4";

const dataPoint = z.object({ label: z.string(), value: z.number() });

export const catalog = defineCatalog(schema, {
  components: {
    MetricCard: {
      props: z.object({
        label: z.string(),
        value: z.string(),
        trend: z.string().nullable(),
      }),
      description:
        "A labelled metric (single number) with an optional trend subtitle",
    },
    BarChart: {
      props: z.object({
        title: z.string(),
        description: z.string().nullable(),
        data: z.array(dataPoint),
      }),
      description:
        "A vertical bar chart for comparing discrete values side by side",
    },
    PieChart: {
      props: z.object({
        title: z.string(),
        description: z.string().nullable(),
        data: z.array(dataPoint),
      }),
      description:
        "A donut-style pie chart for breaking a total down into category slices",
    },
  },
  actions: {},
});
