import { RouteHeader } from "@/components/route-header";
import { Callout, CodeBlock, Panel } from "@/components/ui";

// The only code the page carries for Strands, from its Markdown export
// (https://docs.copilotkit.ai/strands/generative-ui/state-rendering.md),
// verbatim. It is a fragment of the showcase's page.tsx, not a whole file.
const USE_AGENT_FRAGMENT = `// src/app/demos/shared-state-streaming/page.tsx
  // Subscribe to BOTH state changes and run-status changes. The former
  // drives the per-token document rerender; the latter toggles the
  // "LIVE" badge when the agent starts / stops.
  const { agent } = useAgent({
    agentId: "shared-state-streaming",
    updates: [UseAgentUpdate.OnStateChanged, UseAgentUpdate.OnRunStatusChanged],
  });`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/state-rendering" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          UI driven by agent state: a component subscribes with{" "}
          <code>useAgent</code> to state and run-status changes and re-renders
          as the backend pushes new values. The page&apos;s point is a backend
          mapping that forwards a tool argument into state while the model is
          still writing it.
        </p>
      </Panel>

      <Callout tone="warn" title="Reference only: not supported on AWS Strands (Python)">
        <p>
          Re-checked 2026-11-11: the rendered page shows &ldquo;Not supported on
          AWS Strands (Python)&rdquo; in place of every code block and has no
          Code tab. Its backend setup and the{" "}
          <code>state-streaming-middleware</code> snippet are skipped for
          Strands, so no agent, tool, document panel or runtime wiring is
          printed. Nothing runs on this route.
        </p>
        <p className="mt-2">
          Doc gap: the demo&apos;s <code>page.tsx</code>,{" "}
          <code>demo-layout.tsx</code>, <code>document-view.tsx</code>,{" "}
          <code>suggestions.ts</code> and the <code>shared-state-streaming</code>{" "}
          agent (<code>write_document</code> +{" "}
          <code>ToolBehavior(state_from_args=…)</code>) are not printed. Only the
          Markdown export&apos;s <code>useAgent</code> fragment is shown below.
        </p>
      </Callout>

      <Panel title="Published code (Markdown export, verbatim)">
        <CodeBlock code={USE_AGENT_FRAGMENT} language="typescript" filename="state-rendering.md" />
      </Panel>
    </>
  );
}
