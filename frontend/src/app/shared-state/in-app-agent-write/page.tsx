import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/shared-state/in-app-agent-write" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The write half of the same agent as{" "}
          <a
            href="/shared-state/in-app-agent-read"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            Reading agent state
          </a>
          . <code>agent.setState</code> pushes a value into shared state and
          re-renders everything subscribed to it. The agent reads it on its next
          turn — which is the detail that catches people out, so this route
          shows both timings side by side.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Press Toggle Language, then send: tell me a joke",
              "Press Toggle & re-run and wait",
            ]}
            expect="After the first, the joke comes back in the new language — the toggle changed behaviour, not just the panel, because state_context_builder prepends the language to the prompt. After the second, the agent replies in the new language immediately with no typing from you."
            fail="The panel flips but replies stay in the old language: the StrandsAgentConfig is not attached, or the state key the builder looks for is not the one setState wrote."
          />
        </div>
      </Panel>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/shared-state/in-app-agent-write/demo-chat/page.tsx" />
      </Panel>

      <Panel title="Two timings">
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="font-medium text-slate-900 dark:text-slate-100">
              setState alone
            </dt>
            <dd className="mt-0.5 text-slate-600 dark:text-slate-400">
              Stages the value. The UI updates now; the agent notices on its
              next turn, whenever that is. Right for settings the user will
              follow with a question anyway.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-slate-900 dark:text-slate-100">
              setState + addMessage + runAgent
            </dt>
            <dd className="mt-0.5 text-slate-600 dark:text-slate-400">
              Stages it, tells the agent what changed, and runs. Right for a
              control whose effect should be visible immediately. The hint
              message matters: without it the agent re-runs with no idea why.
            </dd>
          </div>
        </dl>
      </Panel>

      <Panel title="The agent">
        <SourceCode file="backend/src/agents/language_agent.py" region="language-agent" />
      </Panel>

    </>
  );
}
