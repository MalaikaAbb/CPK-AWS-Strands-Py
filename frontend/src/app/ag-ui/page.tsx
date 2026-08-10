import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/ag-ui" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The protocol underneath everything else. Messages, state updates, tool
          calls and run lifecycle all travel as server-sent events, and{" "}
          <code>useAgent</code> hands you the <code>AbstractAgent</code> they
          arrive on. <code>agent.subscribe</code> is the raw tap.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The demo subscribes to <em>every</em> callback in the page&apos;s
          event table rather than the three its snippet shows, which turns the
          table from a claim into a test: a callback that never fires is either
          not wired or not emitted by <code>ag_ui_strands</code>.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The right-hand pane assembles the reply from those same callbacks,
          twice — once from <code>textMessageBuffer</code> off the low-level{" "}
          <code>onTextMessageContentEvent</code>, once from{" "}
          <code>agent.messages</code> via <code>onMessagesChanged</code>. That
          is the distinction the page&apos;s last section draws and never
          demonstrates; here you can watch the first fill in character by
          character while the second stays empty until the deltas are folded
          in.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Say hello in one short sentence."]}
            expect="Left: onRunStartedEvent → onStateSnapshotEvent → onMessagesSnapshotEvent → onTextMessageStartEvent → a collapsing onTextMessageContentEvent row whose buffer length climbs → onTextMessageEndEvent → onMessagesChanged → onRunFinishedEvent, with the toolbar counter settling well short of 18 (the absences are the point). Right: the textMessageBuffer box fills in character by character while the agent.messages box stays empty, then snaps to the full reply when onMessagesChanged fires."
            fail="Nothing at all, or onRunErrorEvent. Check the Python server is reachable and OPENAI_API_KEY is set. Both boxes staying empty while the delta counter climbs would mean the buffer is not being read."
          />
        </div>
      </Panel>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/ag-ui/demo-chat/page.tsx" />
      </Panel>

      <Panel
        title="What you should not see fire"
        description="The interesting result on this integration is the absences."
      >
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600 dark:text-slate-400">
          <li>
            <code>onToolCallStartEvent</code> /{" "}
            <code>onToolCallArgsEvent</code> / <code>onToolCallEndEvent</code> /{" "}
            <code>onToolCallResultEvent</code> — no agent in this repo has
            tools, because no Strands page shows how to attach one. Every
            tool-shaped route in the nav is red for this reason.
          </li>
          <li>
            <code>onStateDeltaEvent</code> — the adapter sends whole snapshots,
            not JSON-Patch deltas. <code>onStateSnapshotEvent</code>{" "}
            <em>does</em> fire, twice per run, but with an empty object on every
            agent except Shared State — and that one only <em>reads</em> state,
            so it never grows a key the agent put there.
          </li>
          <li>
            <code>onStepStartedEvent</code> / <code>onStepFinishedEvent</code> —
            steps are a graph concept; nothing in the Strands tree emits them.
          </li>
        </ul>
      </Panel>

      <Panel title="The proxy pattern">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The <code>agent</code> that <code>useAgent</code> returns is not the
          Strands agent. CopilotKit discovers agents through the runtime&apos;s{" "}
          <code>/info</code> endpoint and represents each one with a proxy
          implementing the same <code>AbstractAgent</code> interface;{" "}
          <code>agent.runAgent()</code> becomes a POST to the runtime, which
          resolves the id, clones the agent for request isolation, runs it, and
          re-encodes the AG-UI events as SSE on the way back.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          That indirection is why nothing on the frontend changes when the
          backend does — and, on this repo specifically, why{" "}
          <code>agent.state</code> and <code>agent.messages</code> read
          identically whether the agent behind them has tools or not. The
          frontend contract is intact; what is missing is upstream of it.
        </p>
      </Panel>

      <Callout tone="success" title="One documented problem that has since been fixed">
        <p>
          <code>onMessagesSnapshotEvent</code> <em>does</em> fire here, and it
          should not according to the docs. The published{" "}
          <code>agent.py</code> asserts that <code>ag_ui_strands</code>
          &quot;through at least v0.1.7&quot; emits no{" "}
          <code>MessagesSnapshotEvent</code>, and that without it
          &quot;responses that include tool calls never render as assistant
          messages in the DOM&quot; — then prints a 200-line{" "}
          <code>_MessagesSnapshotWrapper</code> to inject them by hand. Against{" "}
          <code>ag-ui-strands</code> 0.2.4 a raw AG-UI POST returns{" "}
          <code>RUN_STARTED → STATE_SNAPSHOT → MESSAGES_SNAPSHOT →
          STATE_SNAPSHOT → RUN_FINISHED</code> with no wrapper anywhere. The
          adapter handles it; the doc has not caught up. This is the one gap on
          the ledger that resolves in the reader&apos;s favour.
        </p>
      </Callout>

      <Callout tone="info" title="Two ways to read the same stream">
        <p>
          <code>onTextMessageContentEvent</code> gives you{" "}
          <code>textMessageBuffer</code> — the accumulated text so far, not just
          the delta — so a custom transcript needs no accumulator of its own.
          The high-level pair, <code>onMessagesChanged</code> and{" "}
          <code>onStateChanged</code>, fire after the low-level events have been
          folded in, which is the level most UI wants.
        </p>
        <p className="mt-2">
          The reply pane in the demo runs both at once so the difference is
          visible rather than asserted: the buffer box streams, the{" "}
          <code>agent.messages</code> box lands in one step at the end. Build a
          progress indicator on the first and a transcript on the second.
        </p>
      </Callout>

      <Callout tone="info" title="Where this differs from Copilot Runtime">
        <p>
          The{" "}
          <a
            href="/copilot-runtime"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            Copilot Runtime
          </a>{" "}
          route captures the same stream but groups it by raw AG-UI event type,
          which is the shape you want when debugging the wire. This one groups
          it by <em>callback</em> name, which is the shape you want when
          checking your subscriber against the doc&apos;s table.
        </p>
      </Callout>
    </>
  );
}
