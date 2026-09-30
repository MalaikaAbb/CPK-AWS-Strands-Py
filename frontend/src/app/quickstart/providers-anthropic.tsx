"use client";

import { CopilotKit } from "@copilotkit/react-core/v2";

/**
 * `providers.tsx` with the agent swapped for the Anthropic variant. The doc
 * changes only the backend model; the frontend is the same file with a
 * different agent name, so the two backends can be tried side by side.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit" agent="strands_agent_anthropic" useSingleEndpoint={false}>
      {children}
    </CopilotKit>
  );
}
