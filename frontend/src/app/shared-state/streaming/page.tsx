import { RouteHeader } from "@/components/route-header";
import { Callout, CodeBlock, Panel } from "@/components/ui";

// The only code the page carries for Strands, from its Markdown export
// (https://docs.copilotkit.ai/strands/shared-state/streaming.md), verbatim.
// It is a fragment of the showcase's page.tsx, not a whole file.
const USE_AGENT_FRAGMENT = "// src/app/demos/shared-state-streaming/page.tsx\n  // Subscribe to BOTH state changes and run-status changes. The former\n  // drives the per-token document rerender; the latter toggles the\n  // \"LIVE\" badge when the agent starts / stops.\n  const { agent } = useAgent({\n    agentId: \"shared-state-streaming\",\n    updates: [UseAgentUpdate.OnStateChanged, UseAgentUpdate.OnRunStatusChanged],\n  });";

export default function Page() {
  return (
    <>
      <RouteHeader path="/shared-state/streaming" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Streaming one tool argument into a state key while the model is still
          generating it, so a <code>useAgent</code> subscriber can watch the
          value grow.
        </p>
      </Panel>

      <Callout tone="warn" title="Reference only: not supported on AWS Strands (Python)">
        <p>
          Re-checked 2026-11-11: the rendered page shows &ldquo;Not supported on
          AWS Strands (Python)&rdquo; in place of its code and has no Code tab.
          The backend setup and the <code>state-streaming-middleware</code>{" "}
          snippet are skipped for Strands.
        </p>
        <p className="mt-2">
          Doc gap: no agent (<code>write_document</code> and its state mapping),
          demo component or runtime wiring is printed. Only the Markdown
          export&apos;s <code>useAgent</code> fragment is shown below. Nothing
          runs on this route.
        </p>
      </Callout>

      <Panel title="Published code (Markdown export, verbatim)">
        <CodeBlock code={USE_AGENT_FRAGMENT} language="typescript" filename="streaming.md" />
      </Panel>
    </>
  );
}
