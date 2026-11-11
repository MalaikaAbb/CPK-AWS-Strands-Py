// "Sandbox and widget storage" snippet from
// https://docs.copilotkit.ai/strands/generative-ui/mcp-apps, verbatim below
// the line. Type-checked, never rendered: nothing imports it. The snippet is a
// bare JSX expression over an undefined `children`; the import is harness glue.
import { CopilotKit } from "@copilotkit/react-core/v2";
// ---------------------------------------------------------------------------
// @ts-expect-error verbatim doc code: @copilotkit/react-core 1.79.1 has no `mcpApps` prop on <CopilotKit> (TS2322)
<CopilotKit runtimeUrl="/api/copilotkit" mcpApps={{ allowSameOriginFallback: true }}>
  {/* @ts-expect-error verbatim doc code: `children` is never defined on the page (TS2304) */}
  {children}
</CopilotKit>
