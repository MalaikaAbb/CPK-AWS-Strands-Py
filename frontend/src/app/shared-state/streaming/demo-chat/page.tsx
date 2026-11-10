"use client";

import { DemoFrame } from "@/components/demo-frame";

import SharedStateStreamingDemo from "../_demo/shared-state-streaming/page";

/**
 * The page's `shared-state-streaming` demo, mounted as published (the same
 * Code tab as Generative UI › State Rendering). It brings its own
 * `<CopilotKit>`, so this route is in lib/inspector.ts NESTED_PROVIDER_ROUTES.
 */
export default function Page() {
  return (
    <DemoFrame parentPath="/shared-state/streaming" subtitle="agent: shared-state-streaming">
      <SharedStateStreamingDemo />
    </DemoFrame>
  );
}
