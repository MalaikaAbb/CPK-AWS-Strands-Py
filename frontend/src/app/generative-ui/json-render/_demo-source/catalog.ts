// Verbatim from the `src/app/demos/declarative-json-render/catalog.ts` code tab of the embedded demo on
// https://docs.copilotkit.ai/strands/generative-ui/json-render — not edited except for
// this header and any `@ts-expect-error` line (see the route's notes).
import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/react/schema";
import { z } from "zod";

const dataPoint = z.object({ label: z.string(), value: z.number() });

export const catalog = defineCatalog(schema, {
  components: {
    MetricCard: {
      // @ts-expect-error version drift, kept as published — the doc's demo pins @json-render 0.18; 0.21 types catalog props as Zod 4 schemas and this repo's `zod` is 3.25 (Zod 3 types)
      props: z.object({
        label: z.string(),
        value: z.string(),
        trend: z.string().nullable(),
      }),
      description:
        "A labelled metric (single number) with an optional trend subtitle",
    },
    BarChart: {
      // @ts-expect-error version drift, kept as published — the doc's demo pins @json-render 0.18; 0.21 types catalog props as Zod 4 schemas and this repo's `zod` is 3.25 (Zod 3 types)
      props: z.object({
        title: z.string(),
        description: z.string().nullable(),
        data: z.array(dataPoint),
      }),
      description:
        "A vertical bar chart for comparing discrete values side by side",
    },
    PieChart: {
      // @ts-expect-error version drift, kept as published — the doc's demo pins @json-render 0.18; 0.21 types catalog props as Zod 4 schemas and this repo's `zod` is 3.25 (Zod 3 types)
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
