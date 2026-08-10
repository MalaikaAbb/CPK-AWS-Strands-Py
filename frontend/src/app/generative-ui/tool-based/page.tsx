import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/tool-based" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The simplest form of generative UI: register a React component with{" "}
          <code>useComponent</code> and CopilotKit exposes it to the agent as a
          tool. When the model calls it, the component renders inline with the
          tool&apos;s arguments as typed props.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The distinction worth holding onto:{" "}
          <a
            href="/generative-ui/tool-rendering"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            tool rendering
          </a>{" "}
          wraps a <em>real backend tool</em> in custom UI. Here there is no
          backend tool at all — the component <em>is</em> the tool. No handler,
          no server-side execution, no user interaction. The agent decides when
          to show it and supplies the data.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Chart the number of days in each month of 2026",
              "Show me a bar chart of the population of the five largest EU countries",
            ]}
            expect="A bar chart renders inline in the chat with the model's numbers, and the reply does not repeat them as a list."
            fail="Plain text with the numbers written out — the model did not call the tool. Make the request explicitly visual."
          />
        </div>
      </Panel>

      <Panel title="The component">
        <SourceCode file="frontend/src/app/generative-ui/tool-based/bar-chart.tsx" />
      </Panel>

      <Panel title="The registration">
        <SourceCode file="frontend/src/app/generative-ui/tool-based/demo-chat/page.tsx" />
      </Panel>

      <Callout tone="info" title="Name it like a verb">
        <p>
          The <code>name</code> passed to <code>useComponent</code> is what the
          agent sees on its tool list, so <code>render_bar_chart</code> or{" "}
          <code>show_weather</code> reads as an action the model can take.
          A noun like <code>bar_chart</code> reads as a topic, and the model
          picks it less reliably.
        </p>
      </Callout>

      <Callout tone="info" title="The schema does double duty">
        <p>
          The Zod schema is both the tool&apos;s parameter definition — which is
          what the model sees, including the <code>.describe()</code> strings —
          and the source of the component&apos;s prop types. One definition, so
          the two cannot drift apart.
        </p>
      </Callout>
    </>
  );
}
