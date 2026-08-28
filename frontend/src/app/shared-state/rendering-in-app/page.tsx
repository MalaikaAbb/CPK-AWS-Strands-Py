import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/shared-state/rendering-in-app" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          That agent state is not chat state. <code>useAgent</code> works in any
          component under the provider, so a dashboard, a document canvas, a map
          or a table can subscribe to the same agent the chat uses — and both
          re-render from one state object.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The frontend here is the page&apos;s own <code>Canvas</code>, and it
          is still byte-for-byte what Google ADK&apos;s version of this page
          publishes — both moved together in the 2026-08-26 rewrite, so the
          earlier &quot;same code as google-adk&quot; pin still holds. It is the doc&apos;s <code>&lt;Canvas&gt;</code> snippet, its{" "}
          <code>toggleItem</code> write-back, and its{" "}
          <code>&lt;CopilotSidebar&gt;</code> layout, with{" "}
          <code>agentId</code> supplied because a 25-agent runtime has no{" "}
          <code>default</code>.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Open the demo — the canvas should already show two items",
              "Click a row to toggle it, then ask the agent what it sees",
            ]}
            expect="A 'Project launch' heading and two seeded items on first paint, before anything is typed. Clicking a row flips it and the change survives a chat turn."
            fail="'Untitled' with an empty list — the seeding effect never ran, which usually means isReady stayed false. Or a toggle vanishes on the next agent turn, meaning the run is clobbering client state rather than merging it."
          />
        </div>
      </Panel>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/shared-state/rendering-in-app/demo-chat/page.tsx" />
      </Panel>

      <Callout tone="info" title="Three things worth doing every time">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Target the agent explicitly.</strong>{" "}
            <code>useAgent()</code> with no argument binds to the agent named{" "}
            <code>default</code>. This runtime registers 25 agents and none of
            them is called that, so always pass <code>agentId</code>.
          </li>
          <li>
            <strong>Treat state as partial.</strong> Mid-run it may be
            half-streamed, so guard with defaults —{" "}
            <code>(agent.state ?? {"{}"}) as Partial&lt;T&gt;</code> — rather
            than dotting straight through.
          </li>
          <li>
            <strong>Throttle a heavy canvas.</strong>{" "}
            <code>useAgent({"{ throttleMs }"})</code> if a streaming run
            re-renders it too often.
          </li>
        </ul>
      </Callout>

      <Callout tone="info" title="What the 2026-08-26 rewrite added, and why it matters more here">
        <p>
          The page gained an <code>INITIAL_CANVAS_STATE</code> constant, an{" "}
          <code>isReady</code> flag off <code>useAgent</code>, and an effect
          that fills only the fields still <code>undefined</code>. The page
          explains it as making &quot;the canvas visible before the agent writes
          state&quot;.
        </p>
        <p className="mt-2">
          On Strands that is doing more work than the sentence suggests.
          Nothing published for this integration ever writes agent state — the
          two <code>*_state_from_args</code> hooks exist in the excerpt and the{" "}
          <code>ToolBehavior(state_from_result=…)</code> that would attach one
          does not. Before the rewrite this canvas rendered{" "}
          <code>Untitled</code> over an empty list and stayed that way for the
          whole session. The seed is what gives it anything to mirror.
        </p>
        <p className="mt-2">
          One deviation kept from before: the doc writes{" "}
          <code>agent.state?.items</code> inside <code>toggleItem</code>, which
          leaves <code>it</code> implicitly <code>any</code> and fails the build
          under <code>strict</code>. The demo maps over the already-narrowed
          local instead — same result, real types.
        </p>
      </Callout>
    </>
  );
}
