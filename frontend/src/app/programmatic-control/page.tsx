import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/programmatic-control" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Driving an agent from code rather than from a composer — a button, a
          form, a cron job, a keyboard shortcut. This is Google ADK&apos;s
          implementation of this page, carried over unchanged on request. The
          two doc pages are identical apart from their link slugs and the
          backend block Strands does not have, so there was nothing to port.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Open the demo"]}
            expect="A blank pane under the demo header. That is faithful: the doc's headless-complete snippet is a hook body with no JSX, so the component it defines returns nothing renderable, and the carried-over implementation returns an empty fragment rather than inventing a UI for it. What the route is for is the source panel below."
            fail="A build error, or a runtime error from useAgent / useCopilotKit — the hooks themselves should resolve cleanly."
          />
        </div>
      </Panel>

      <Panel title="It is an issue - half the code is missing and imports are missing">
        <Callout tone="warn" title="Missing code">
          <p>
           Missing imports and code 
          </p>
        </Callout>
      </Panel>


      <Panel title="The three primitives">
        <dl className="space-y-2 text-sm">
          {[
            [
              "agent.addMessage(…)",
              "Append to the conversation without running. Pair with runAgent when the appended message should kick off a turn.",
            ],
            [
              "copilotkit.runAgent({ agent })",
              "The same entry point <CopilotChat> calls. Orchestrates frontend tools, follow-up runs, and the subscriber lifecycle.",
            ],
            [
              "copilotkit.stopAgent({ agent })",
              "Cancel mid-run. agent.abortRun() is the lower-level form the reset handler falls back to.",
            ],
          ].map(([name, desc]) => (
            <div key={name} className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
              <dt className="shrink-0 font-mono text-xs text-slate-900 sm:w-56 dark:text-slate-100">
                {name}
              </dt>
              <dd className="text-slate-600 dark:text-slate-400">{desc}</dd>
            </div>
          ))}
        </dl>
      </Panel>

      

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/programmatic-control/demo-chat/page.snippet.tsx" />
      </Panel>


      <Panel title="The agent">
        <SourceCodeGroup
          files={[{ file: "backend/src/agents/chat_agents.py", region: "builder" }]}
          note="Nothing special server-side — programmatic control drives the same agent a chat component would. The doc page's Strands backend slot is the `setup skipped` placeholder, so this is the Quickstart's shape."
        />
      </Panel>

      <Callout tone="info" title="copilotkit.runAgent vs agent.runAgent">
        <p>
          Both trigger the agent, at different levels.{" "}
          <code>copilotkit.runAgent({"{ agent }"})</code> is the one to reach
          for: it executes frontend tools, chains follow-up runs, and routes
          errors through the subscriber system.{" "}
          <code>agent.runAgent(options)</code> sends the request and does none
          of that — useful only when you specifically want the raw send.
        </p>
      </Callout>

      <Callout tone="warn" title="The interrupt-resolution half does not apply">
        <p>
          A large part of the doc page covers resolving a paused run from a
          button, via <code>agent.subscribe</code> plus{" "}
          <code>copilotkit.runAgent({"{ agent, forwardedProps: { command: { resume } } }"})</code>
          . That section is gated on the runtime exposing an interrupt
          primitive. Strands matches neither branch: the{" "}
          <code>native</code> one is LangGraph&apos;s, and the{" "}
          <code>promise-based</code> one collapses to{" "}
          <code>
            &lt;!-- snippet skipped: region &apos;headless-promise-primitives&apos;
            missing in strands::interrupt-headless --&gt;
          </code>
          . The page&apos;s own fallback text says to use{" "}
          <a
            href="/human-in-the-loop"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            useHumanInTheLoop
          </a>{" "}
          instead — which on Strands has its own blocker. The three primitives
          above are unaffected; only the resume path is framework-specific.
        </p>
      </Callout>

      <Callout tone="warn" title="Carried over verbatim, including its problems">
        <p>
          Two of them, both the doc&apos;s. The snippet opens by destructuring
          ten values from a <code>useAttachmentsConfig()</code> that is never
          printed on any page, and also calls <code>useAutoScroll</code> and{" "}
          <code>buildContent</code> — likewise never printed. All three are
          reconstructed in <code>headless-helpers.ts</code>. And the function
          body it gives ends at <code>handleReset</code> with no{" "}
          <code>return</code>, so there is no UI to render. Both were left as
          they are rather than papered over.
        </p>
      </Callout>

    </>
  );
}
