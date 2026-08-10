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
          The frontend here is Google ADK&apos;s implementation of this page,
          carried over unchanged on request — the two doc pages are
          byte-identical apart from their link slugs, so there was nothing to
          port. It is the doc&apos;s <code>&lt;Canvas&gt;</code> snippet, its{" "}
          <code>toggleItem</code> write-back, and its{" "}
          <code>&lt;CopilotSidebar&gt;</code> layout, with{" "}
          <code>agentId</code> supplied because a 25-agent runtime has no{" "}
          <code>default</code>.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Open the demo, then use the write route to set some state",
              "Ask the agent to add an item to the canvas like - Add an item with label 'go shopping' and done as false",
            ]}
            expect="Whatever the UI writes with setState shows up in the canvas immediately, and survives a chat turn. Asking the agent to add an item gets a refusal or a prose answer — it has no tool to write state with."
            fail="setState writes vanish on the next agent turn, meaning the run is clobbering client state rather than merging it."
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

      <Callout tone="warn" title="What the doc's own snippet does not survive">
        <p>
          <code>toggleItem</code> as printed is{" "}
          <code>(agent.state?.items ?? []).map((it) =&gt; …)</code>. That{" "}
          <code>it</code> is implicitly <code>any</code>, and under{" "}
          <code>strict</code> the build fails. The demo maps over the
          already-narrowed local instead — same result, real types.
        </p>
        <p className="mt-2">
          The larger gap is the other side of the channel. The page&apos;s whole
          premise is that &quot;every time the agent mutates its state … {" "}
          <code>useAgent</code> re-renders this component&quot;. Nothing
          published for Strands mutates agent state: the two{" "}
          <code>*_state_from_args</code> hooks exist in the excerpt, and the{" "}
          <code>ToolBehavior(state_from_result=…)</code> that would attach one
          to a tool does not. So the canvas here is a faithful reader with
          nothing to read but its own writes.
        </p>
      </Callout>
    </>
  );
}
