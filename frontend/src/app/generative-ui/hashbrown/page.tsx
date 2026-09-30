import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

const DIR = "frontend/src/app/generative-ui/hashbrown";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/hashbrown" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The chat&apos;s assistant-message slot is swapped for a renderer that
          feeds the streaming reply to Hashbrown&apos;s partial-JSON parser and
          draws each finished node through a UI kit, so a dashboard fills in
          while the agent is still typing. The Strands page publishes this
          example <strong>twice</strong> — prose code blocks, and the code tabs
          of its embedded demo — and they target different Hashbrown APIs. The
          demo has a toggle and mounts each one unedited.
        </p>
      </Panel>

      <Panel title="Mode 1 — doc snippets (broken by design)">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The prose <code>page.tsx</code> and <code>hashbrown-renderer.tsx</code>,
          verbatim. The imports they leave out were written in (see below); the
          three Hashbrown calls were left exactly as printed.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Show me a sales dashboard.", "Break down sales by region."]}
            expect={
              <>
                <strong>An error is expected</strong> as soon as the first
                assistant message mounts, before any JSON matters. The demo is
                replaced by a red box reading{" "}
                <code>
                  TypeError: Cannot read properties of undefined (reading
                  &apos;forEach&apos;)
                </code>{" "}
                — <code>useUiKit</code> was given <code>{"{ catalog, value }"}</code>,
                so <code>createUiKit</code> iterates an undefined{" "}
                <code>components</code>. No suggestion pills appear.
              </>
            }
            fail={
              <>
                A reply renders with no error — the installed Hashbrown would
                then accept the prose calls and this route needs revisiting. Or
                a network error: check the backend has{" "}
                <code>byoc-hashbrown</code> in <code>/health</code>.
              </>
            }
          />
        </div>
        <div className="mt-4">
          <Callout tone="warn" title="Kept as published, with @ts-expect-error">
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <code>useJsonParser(message.content ?? &quot;&quot;)</code> —
                0.6.1 takes <code>(json, schema)</code>. On its own this does
                not throw.
              </li>
              <li>
                <code>useUiKit(&#123; catalog, value: parsed &#125;)</code> —
                0.6.1 takes <code>&#123; components &#125;</code> built with{" "}
                <code>exposeComponent</code>. <strong>This is the line that
                throws.</strong>
              </li>
              <li>
                <code>&#123;ui&#125;</code> in JSX — the kit is an object,
                drawn with <code>ui.render(value)</code>.
              </li>
              <li>
                <code>page.tsx</code>&apos;s{" "}
                <code>messageView=&#123;&#123; assistantMessage: HashBrownAssistantMessage &#125;&#125;</code>{" "}
                — slot typed as <code>typeof CopilotChatAssistantMessage</code>{" "}
                in CopilotKit 1.75. Type-only.
              </li>
            </ul>
            <p className="mt-2">
              Also as published: <code>useConfigureSuggestions</code> runs
              outside the page&apos;s own <code>&lt;CopilotKit&gt;</code>, and
              the prose example output (<code>{"{ \"type\": \"MetricCard\", … }"}</code>,
              a <code>Stack</code> tree) is not the{" "}
              <code>{"{ \"ui\": [...] }"}</code> envelope Hashbrown parses —
              the page&apos;s own agent prompt asks for the envelope.
            </p>
          </Callout>
        </div>
        <div className="mt-4">
          <SourceCodeGroup
            files={[
              { file: `${DIR}/_snippets/page.tsx` },
              { file: `${DIR}/_snippets/hashbrown-renderer.tsx` },
            ]}
          />
        </div>
      </Panel>

      <Panel title="Mode 1 — written in (repo-authored, not from the docs)">
        <ul className="mb-4 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li>
            The <code>AssistantMessage</code> type import.
          </li>
          <li>
            <code>metric-card.tsx</code> and <code>charts.ts</code> —
            re-exports of the components the page publishes in its demo tabs.
            The prose imports <code>./charts</code>, but the demo only has{" "}
            <code>charts/bar-chart</code> and <code>charts/pie-chart</code>.
          </li>
          <li>
            <code>/api/copilotkit-byoc-hashbrown</code> — the runtime route the
            prose points at, serving agent id <code>byoc_hashbrown</code>.
          </li>
        </ul>
        <SourceCodeGroup
          files={[
            { file: `${DIR}/_snippets/charts.ts` },
            { file: `${DIR}/_snippets/metric-card.tsx` },
            {
              file: "frontend/src/app/api/copilotkit-byoc-hashbrown/[[...slug]]/route.ts",
            },
          ]}
        />
      </Panel>

      <Panel title="Mode 2 — doc demo source (verbatim)">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Every code tab of the page&apos;s embedded demo, unedited: a UI kit of{" "}
          <code>metric</code>, <code>pieChart</code>, <code>barChart</code>,{" "}
          <code>dealCard</code> and Markdown built with{" "}
          <code>exposeComponent</code>, provided through context, parsed with{" "}
          <code>useJsonParser(content, kit.schema)</code> and drawn with{" "}
          <code>kit.render</code>; its own{" "}
          <code>/api/copilotkit-declarative-hashbrown</code> route (agent id{" "}
          <code>declarative-hashbrown-demo</code>); and the Strands agent{" "}
          <code>byoc_hashbrown.py</code>. <code>chat.tsx</code> and{" "}
          <code>charts/chart-config.ts</code> are imported by the tabs but are
          not tabs themselves; they come from the same demo source. It
          type-checks against 0.6.1 with no suppression.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Show me a Q4 sales dashboard. Include a total-revenue metric card, a pie chart of revenue by segment, and a bar chart of monthly revenue.",
            ]}
            expect="Three suggestion pills above the input. The metric card appears first and the charts fill in below it while the reply is still streaming, with no error. (Parser and kit behaviour on partial input confirmed by server-rendering; the full page not yet observed in a browser.)"
            fail="An empty assistant bubble: the reply started with prose or a ```json fence (the parser needs JSON from the first character) — check the raw reply in the Inspector. The same empty bubble is expected for a plain-prose reply such as “hello”, since this renderer has no fallback."
          />
        </div>
        <div className="mt-4">
          <SourceCodeGroup
            files={[
              { file: `${DIR}/_demo-source/page.tsx` },
              { file: `${DIR}/_demo-source/chat.tsx` },
              { file: `${DIR}/_demo-source/hashbrown-renderer.tsx` },
              { file: `${DIR}/_demo-source/suggestions.ts` },
              { file: "frontend/src/app/api/copilotkit-declarative-hashbrown/route.ts" },
              { file: "backend/src/agents/byoc_hashbrown.py" },
            ]}
          />
        </div>
      </Panel>

      <Panel title="Backend">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The agent is the page&apos;s <code>byoc_hashbrown.py</code>, unedited,
          registered as <code>byoc-hashbrown</code> so it mounts at the{" "}
          <code>/byoc-hashbrown/</code> path the demo&apos;s route proxies to.
          Its <code>_build_model</code> import is served by the repo-authored{" "}
          <code>backend/src/agents/agent.py</code> shim.
        </p>
      </Panel>
    </>
  );
}
