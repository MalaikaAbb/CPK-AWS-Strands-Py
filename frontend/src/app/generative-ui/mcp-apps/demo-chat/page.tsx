"use client";

import { DemoFrame } from "@/components/demo-frame";

import McpAppsDemo from "../mcp-apps";

/**
 * The page's provider + chat, as published, inside the repo's demo chrome.
 *
 * The doc's `<CopilotKit>` is the nested provider here, on its own runtime at
 * `/api/copilotkit-mcp-apps`. This path is in `lib/inspector.ts`
 * NESTED_PROVIDER_ROUTES so the root provider's inspector stands down; the
 * published JSX passes no `enableInspector`, so the package default
 * (localhost only) applies.
 */
export default function Page() {
  return (
    <DemoFrame parentPath="/generative-ui/mcp-apps" subtitle="agent: mcp-apps">
      <div className="h-full overflow-auto">
        <McpAppsDemo />
      </div>
    </DemoFrame>
  );
}
