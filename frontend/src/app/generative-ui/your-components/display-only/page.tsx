import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/your-components/display-only" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <code>useComponent</code> at its smallest: a React component
          registered as a tool, rendered inline when the agent calls it, with
          the tool arguments passed straight through as props. No handler, no
          user interaction, no server-side execution — the agent decides when to
          show it and supplies the data.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          This page overlaps almost entirely with{" "}
          <a
            href="/generative-ui/tool-based"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            Components as Tools
          </a>
          , which teaches the same hook at more length. What is unique here is
          the two shorthands: registering without a parameter schema, and
          scoping a component to one agent with <code>agentId</code>. Both are
          reproduced in the demo.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Show weather in tokyo where weather condition is sunny and temperature is 77",
              "Greet me with something cheerful",
            ]}
            expect="A weather card inline in the chat — Tokyo, 77°F, Sunny — and a blue greeting box on the second prompt. The typed and the untyped registration both fire."
            fail="Plain text with the values written out. The model did not call the component; phrase the request so it clearly wants something shown."
          />
        </div>
      </Panel>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/generative-ui/your-components/display-only/demo-chat/page.tsx" />
      </Panel>

      <Panel title="The three registration shapes the page shows">
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="font-mono text-xs text-slate-900 dark:text-slate-100">
              With a Zod schema
            </dt>
            <dd className="mt-0.5 text-slate-600 dark:text-slate-400">
              <code>parameters: weatherSchema</code> plus{" "}
              <code>render: WeatherCard</code>. The schema is what the model
              sees (including the <code>.describe()</code> strings) and what
              types the component&apos;s props, so the two cannot drift.
            </dd>
          </div>
          <div>
            <dt className="font-mono text-xs text-slate-900 dark:text-slate-100">
              Without one
            </dt>
            <dd className="mt-0.5 text-slate-600 dark:text-slate-400">
              Just <code>name</code> and an inline <code>render</code>. The
              model gets no parameter contract, so this suits components whose
              single prop is free text.
            </dd>
          </div>
          <div>
            <dt className="font-mono text-xs text-slate-900 dark:text-slate-100">
              Scoped with agentId
            </dt>
            <dd className="mt-0.5 text-slate-600 dark:text-slate-400">
              Restricts the component to one agent in a multi-agent setup. Every
              registration in this harness passes it, because a 25-agent runtime
              has no <code>default</code> to fall back to.
            </dd>
          </div>
        </dl>
      </Panel>

      <Panel
        title="The backend half"
        description="There is none, and it turns out none is needed."
      >
        <p className="mb-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Unlike its siblings, this page has no framework-gated setup block at
          all — no Strands section, no <code>setup skipped</code> placeholder,
          nothing. It is written as if the frontend registration were
          sufficient, and on Strands it is: the agent below is the
          Quickstart&apos;s, unchanged, and it calls the registered component
          anyway. <code>ag_ui_strands</code> proxies client-registered tools
          onto the agent per run — no doc page says so, which is the only thing
          wrong here.
        </p>
        <SourceCodeGroup
          files={[{ file: "backend/src/agents/chat_agents.py", region: "builder" }]}
        />
      </Panel>

      <Callout tone="info" title="Name it like a verb">
        <p>
          The <code>name</code> is what the agent sees on its tool list, so{" "}
          <code>showWeather</code> and <code>renderProfile</code> read as
          actions the model can take. A noun reads as a topic and gets picked
          less reliably — the page&apos;s own examples are all verb-first.
        </p>
      </Callout>
    </>
  );
}
