import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

const DEMO = "frontend/src/app/generative-ui/state-rendering/_demo/shared-state-streaming";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/state-rendering" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A document panel driven only by <code>agent.state.document</code>.
          The page subscribes with <code>useAgent</code> to state and
          run-status changes, so the panel re-renders as state arrives and a
          LIVE badge shows while the agent runs. The page&apos;s point is that a
          backend mapping pushes the <code>write_document</code> argument into
          state while the model is still writing it.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Write a short poem about autumn leaves."]}
            expect="The LIVE badge lights while the agent runs, and the poem appears in the document panel, whole, once write_document's arguments are complete. On Strands it doesn't stream token by token."
            fail="The poem appears as a chat message and the panel stays empty: the tool wasn't called, or the state hook didn't emit."
          />
        </div>
      </Panel>

      <Callout tone="info" title="Frontend: the Code tab, verbatim">
        <code>page.tsx</code>, <code>demo-layout.tsx</code>,{" "}
        <code>document-view.tsx</code> and <code>suggestions.ts</code> are the
        Strands showcase&apos;s <code>shared-state-streaming</code> demo,
        unchanged. The page prints the <code>useAgent</code> call from{" "}
        <code>page.tsx</code>.
      </Callout>

      <Callout tone="warn" title="Backend: not on the page, borrowed from the GitHub showcase">
        <p>
          The page skips its Strands backend setup and middleware snippet.{" "}
          <code>write_document</code> and its{" "}
          <code>ToolBehavior(state_from_args=…)</code> hook are{" "}
          <strong>from CopilotKit&apos;s GitHub showcase</strong> (
          <code>showcase/integrations/strands/src/agents/agent.py</code>),
          verbatim. The builder and its short prompt are repo-authored. As the
          showcase&apos;s own comment says, Strands updates state from the{" "}
          <em>complete</em> tool arguments, so the document lands whole, not
          per token. That&apos;s why this route is <code>partial</code>.
        </p>
      </Callout>

      <Panel title="Source">
        <SourceCodeGroup
          files={[
            { file: `${DEMO}/page.tsx` },
            { file: `${DEMO}/document-view.tsx` },
            { file: "backend/src/agents/state_streaming_agent.py" },
          ]}
        />
      </Panel>
    </>
  );
}
