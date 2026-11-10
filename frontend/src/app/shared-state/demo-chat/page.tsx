"use client";

import { DemoFrame } from "@/components/demo-frame";

import SharedStateReadWriteDemo from "../_demo/shared-state-read-write/page";

/**
 * The showcase demo the page's snippets are cut from, mounted as published. It
 * brings its own `<CopilotKit runtimeUrl="/api/copilotkit">`, so this route is
 * in lib/inspector.ts NESTED_PROVIDER_ROUTES.
 */
export default function Page() {
  return (
    <DemoFrame parentPath="/shared-state" subtitle="agent: shared-state-read-write">
      <SharedStateReadWriteDemo />
    </DemoFrame>
  );
}
