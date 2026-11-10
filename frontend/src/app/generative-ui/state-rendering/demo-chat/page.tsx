"use client";

import { DemoFrame } from "@/components/demo-frame";

import SharedStateStreamingDemo from "../_demo/shared-state-streaming/page";

/**
 * The page's `shared-state-streaming` demo, mounted as published. It brings its
 * own `<CopilotKit runtimeUrl="/api/copilotkit">`, so this route is in
 * lib/inspector.ts NESTED_PROVIDER_ROUTES; the doc's provider passes no
 * `enableInspector`, so the package default applies.
 */
export default function Page() {
  return (
    <DemoFrame parentPath="/generative-ui/state-rendering" subtitle="agent: shared-state-streaming">
      <SharedStateStreamingDemo />
    </DemoFrame>
  );
}
