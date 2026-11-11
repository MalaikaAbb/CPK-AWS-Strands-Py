import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

const DIR = "frontend/src/app/generative-ui/json-render";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/json-render" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The chat&apos;s assistant-message slot is swapped for a renderer that
          reads the reply as a <code>{"{ root, elements }"}</code> spec and
          draws it with <code>@json-render/react</code> against a Zod-typed
          component catalog.
        </p>
      </Panel>

      <Callout tone="info" title="The page now publishes one version (2026-11-10)">
        <p>
          The page used to print prose snippets (<code>&lt;Renderer catalog&gt;</code>,
          broken by design here) next to its embedded demo. Its prose is now
          the demo&apos;s own <code>chat.tsx</code>,{" "}
          <code>json-render-renderer.tsx</code>, <code>catalog.ts</code> and{" "}
          <code>registry.tsx</code>. So the old snippets, their repo-authored
          helpers and the <code>/api/copilotkit-byoc-json-render</code> route
          were removed.
        </p>
        <p className="mt-2">
          The page&apos;s <code>catalog.ts</code> imports <code>z</code> from{" "}
          <code>&quot;zod4&quot;</code>, a package alias for Zod 4 next to a Zod 3{" "}
          <code>zod</code>. This repo now installs that alias, and with it the
          four <code>@ts-expect-error</code> lines the old <code>zod</code>{" "}
          import needed are gone: the published catalog and registry type-check
          cleanly on <code>@json-render/*</code> 0.21. The page names 0.18.0.
        </p>
      </Callout>

      <Panel title="The demo source (verbatim)">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Every code tab of the page&apos;s embedded demo, unedited:{" "}
          <code>defineCatalog</code> + <code>defineRegistry</code>, a renderer
          that wraps <code>&lt;Renderer registry&gt;</code> in{" "}
          <code>&lt;JSONUIProvider&gt;</code> and falls back to the default
          bubble until the JSON is complete, its own{" "}
          <code>/api/copilotkit-declarative-json-render</code> route, and the
          Strands agent <code>byoc_json_render.py</code>. Two imported files
          that are not tabs themselves (<code>chat.tsx</code>,{" "}
          <code>charts/chart-config.ts</code>) come from the same demo source.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Show me the sales dashboard with metrics and a revenue chart",
              "Break down revenue by category as a pie chart",
            ]}
            expect="Three suggestion pills above the input. While the reply streams it shows as raw JSON in a normal bubble; once the object closes it is replaced by a metric card with a bar and/or pie chart below it, with no error. (Predicted from server-rendering the same catalog, registry and spec; not yet observed in a browser.)"
            fail="The JSON never turns into a dashboard: the reply used a component type outside MetricCard/BarChart/PieChart, or is not one balanced object — check the raw reply in the Inspector. A red error box means the demo code itself threw; record the message."
          />
        </div>
        <div className="mt-4">
          <SourceCodeGroup
            files={[
              { file: `${DIR}/_demo-source/page.tsx` },
              { file: `${DIR}/_demo-source/chat.tsx` },
              { file: `${DIR}/_demo-source/json-render-renderer.tsx` },
              { file: `${DIR}/_demo-source/registry.tsx` },
              { file: `${DIR}/_demo-source/catalog.ts` },
              { file: `${DIR}/_demo-source/suggestions.ts` },
              { file: "frontend/src/app/api/copilotkit-declarative-json-render/route.ts" },
              { file: "backend/src/agents/byoc_json_render.py" },
            ]}
          />
        </div>
      </Panel>

      <Panel title="Backend">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The agent is the page&apos;s <code>byoc_json_render.py</code>,
          unedited, registered as <code>byoc-json-render</code> so it mounts at
          the <code>/byoc-json-render/</code> path the demo&apos;s route proxies
          to. It imports <code>_build_model</code> from{" "}
          <code>agents.agent</code>, which no page prints;{" "}
          <code>backend/src/agents/agent.py</code> is a repo-authored shim for
          that one name.
        </p>
        <div className="mt-4">
          <SourceCodeGroup files={[{ file: "backend/src/agents/agent.py" }]} />
        </div>
      </Panel>
    </>
  );
}
