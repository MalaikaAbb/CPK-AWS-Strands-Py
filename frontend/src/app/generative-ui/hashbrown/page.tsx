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
          while the agent is still typing.
        </p>
      </Panel>

      <Callout tone="info" title="The page now publishes one version (2026-11-10)">
        <p>
          The page used to print prose snippets with a different Hashbrown API
          (<code>useUiKit(&#123; catalog, value &#125;)</code>, broken by design
          here) next to its embedded demo. Its prose is now the demo&apos;s own{" "}
          <code>page.tsx</code>, <code>chat.tsx</code> and{" "}
          <code>hashbrown-renderer.tsx</code>, which match the copies below
          (only a header comment differs). So the old snippets, their written-in
          helpers and the repo-authored <code>/api/copilotkit-byoc-hashbrown</code>{" "}
          route were removed.
        </p>
        <p className="mt-2">
          The page says the bundled demos pin <code>@hashbrownai/*</code> to{" "}
          <code>0.5.0-beta.4</code>. This repo stays on <code>0.6.1</code>,
          where the published files type-check with no suppression. The page
          also says to use the versions in your own <code>package.json</code>.
        </p>
      </Callout>

      <Panel title="The demo source (verbatim)">
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
