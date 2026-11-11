"use client";

import { DemoFrame } from "@/components/demo-frame";

// The page embeds the same `gen-ui-interrupt` demo as the HITL overview, so
// that route's copy is mounted rather than duplicated.
import GenUiInterruptDemo from "../../overview/_demo/gen-ui-interrupt/page";

/**
 * The page's `gen-ui-interrupt` demo, mounted as published. It brings its own
 * `<CopilotKit>`, so this route is in lib/inspector.ts NESTED_PROVIDER_ROUTES.
 */
export default function Page() {
  return (
    <DemoFrame parentPath="/human-in-the-loop/use-interrupt" subtitle="agent: gen-ui-interrupt">
      <GenUiInterruptDemo />
    </DemoFrame>
  );
}
