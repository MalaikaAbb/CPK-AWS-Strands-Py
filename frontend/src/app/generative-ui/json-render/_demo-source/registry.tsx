// Verbatim from the `src/app/demos/declarative-json-render/registry.tsx` code tab of the embedded demo on
// https://docs.copilotkit.ai/strands/generative-ui/json-render — not edited except for
// this header and any `@ts-expect-error` line (see the route's notes).
import { defineRegistry } from "@json-render/react";
import { catalog } from "./catalog";
import { MetricCard, type MetricCardComponentProps } from "./metric-card";
import { BarChart, type BarChartComponentProps } from "./charts/bar-chart";
import { PieChart, type PieChartComponentProps } from "./charts/pie-chart";

// @ts-expect-error version drift, kept as published — @json-render/react 0.21's DefineRegistryOptions requires an `actions` key because catalog.ts declares `actions: {}` (the demo pins 0.18); at runtime defineRegistry treats a missing `actions` as none
export const { registry } = defineRegistry(catalog, {
  components: {
    // The agent may nest charts inside a MetricCard root — forward children.
    MetricCard: ({ props, children }) => (
      <div className="flex w-full flex-col items-stretch gap-3">
        <MetricCard {...(props as MetricCardComponentProps)} />
        {children}
      </div>
    ),
    BarChart: ({ props }) => (
      <BarChart {...(props as BarChartComponentProps)} />
    ),
    PieChart: ({ props }) => (
      <PieChart {...(props as PieChartComponentProps)} />
    ),
  },
});
