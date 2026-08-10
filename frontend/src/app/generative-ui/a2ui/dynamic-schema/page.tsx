import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/a2ui/dynamic-schema" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The opposite trade from{" "}
          <a
            href="/generative-ui/a2ui/fixed-schema"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            fixed schema
          </a>
          . Nothing about the layout is decided in advance — a secondary LLM
          designs the whole surface per request, choosing components from the
          catalog you gave it and filling them with data. You supply a
          vocabulary; it writes the sentence.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          What makes it work is that the runtime serialises your catalog —
          component names and their Zod prop schemas, descriptions included —
          into the agent&apos;s context, so the model knows exactly what it is
          allowed to emit.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Build me a dashboard for a SaaS company's Q3: revenue, churn, top accounts, and pipeline by stage",
              "Show me a breakdown of website traffic by source with a chart",
            ]}
            expect="A prose answer and no surface. Passing the catalog on the provider auto-injects the A2UI tool, but nothing documents how a Strands agent receives an injected frontend tool — see the doc gaps above. What passes here is that createCatalog builds, the nested provider mounts, and the chat streams."
            fail="A crash from createCatalog or a TypeScript error in renderers.tsx — which is the interesting failure, since the doc ships that file with no import line at all."
          />
        </div>
      </Panel>

      <Callout tone="warn" title="renderers.tsx does not compile as printed">
        <p>
          The page&apos;s <code>renderers.tsx</code> block opens on line one at{" "}
          <code>
            export const myRenderers: CatalogRenderers&lt;MyDefinitions&gt; = {"{"}
          </code>
          . <code>CatalogRenderers</code> comes from{" "}
          <code>@copilotkit/a2ui-renderer</code>, <code>MyDefinitions</code>{" "}
          from the sibling <code>definitions.ts</code>, and the file is 350
          lines of JSX. None of the three imports is shown. The import line here
          was reconstructed from the neighbouring{" "}
          <code>definitions.ts</code> and <code>catalog.ts</code> blocks, which
          do show theirs.
        </p>
      </Callout>

      <Callout tone="warn" title="Repo-authored components on this route">
        <p>
          <code>definitions.ts</code>, <code>renderers.tsx</code> and{" "}
          <code>catalog.ts</code> are all printed in the doc and reproduced
          here. What is not printed is the leaf UI the renderers call into, so
          these are this repo&apos;s:
        </p>
        <ul className="mt-2 list-disc space-y-0.5 pl-5">
          <li>
            <code>CardShell</code>, <code>Badge</code>, <code>Button</code> —
            shadcn-style primitives
          </li>
          <li>
            <code>CHART_COLORS</code> and the <code>c</code> colour constants
          </li>
        </ul>
        <p className="mt-2">
          The doc&apos;s <code>coerceChartData</code> logic is inlined from its
          two duplicated copies into one helper — same behaviour, including the{" "}
          <code>console.warn</code> rather than a silent zero.
        </p>
      </Callout>

      <Panel title="The three-file split">
        <dl className="space-y-2 text-sm">
          {[
            ["definitions.ts", "Zod prop schemas plus human-readable descriptions. Platform-agnostic, so the runtime can serialise it to the LLM."],
            ["renderers.tsx", "React implementations keyed by the same names. TypeScript enforces that every definition has one."],
            ["catalog.ts", "createCatalog(definitions, renderers, { includeBasicCatalog: true })."],
          ].map(([name, desc]) => (
            <div key={name} className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
              <dt className="shrink-0 font-mono text-xs text-slate-900 sm:w-32 dark:text-slate-100">
                {name}
              </dt>
              <dd className="text-slate-600 dark:text-slate-400">{desc}</dd>
            </div>
          ))}
        </dl>
      </Panel>

      <Panel title="The catalog">
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/generative-ui/a2ui/dynamic-schema/a2ui/definitions.ts" },
            { file: "frontend/src/app/generative-ui/a2ui/dynamic-schema/a2ui/renderers.tsx" },
            { file: "frontend/src/app/generative-ui/a2ui/dynamic-schema/a2ui/catalog.ts" },
          ]}
        />
      </Panel>

      <Panel title="The provider and the runtime">
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/generative-ui/a2ui/dynamic-schema/demo-chat/page.tsx" },
            { file: "frontend/src/app/api/copilotkit-declarative-gen-ui/route.ts" },
            { file: "backend/src/agents/chat_agents.py", region: "builder" },
          ]}
          note="The agent is the Quickstart's, unchanged. The page's own backend snippet is the truncated agent.py, whose generate_a2ui tool ends in a call to build_a2ui_operations_from_tool_call — imported from an unpublished module, and never attached to an agent."
        />
      </Panel>

      <Callout tone="info" title="Descriptions are prompt, not documentation">
        <p>
          Every <code>description</code> in <code>definitions.ts</code> is read
          by the LLM when it picks a component. That is why they read like
          guidance — &quot;Ideal for rankings and per-item breakdowns&quot;,
          &quot;Use <code>gap</code> (px) to space dashboard tiles&quot; — and
          why the <code>DataTable</code> entry spells out a constraint the type
          system cannot express.
        </p>
      </Callout>

      <Callout tone="info" title="Progressive streaming">
        <p>
          The middleware does not wait for the whole payload. It holds until the{" "}
          <code>components</code> array is complete (a half-built schema cannot
          render), emits <code>createSurface</code> +{" "}
          <code>updateComponents</code>, then emits one{" "}
          <code>updateDataModel</code> per complete data item — so cards appear
          one by one as data streams in.
        </p>
      </Callout>

      <Callout tone="warn" title="The opt-out path in the doc is LangGraph's">
        <p>
          Its &quot;I opted out of auto-inject&quot; section builds the tool
          with <code>get_a2ui_tools</code> from{" "}
          <code>ag_ui_langgraph</code> and a <code>ChatOpenAI</code> model.
          There is no <code>get_a2ui_tool</code> in{" "}
          <code>ag_ui_strands</code> on any page, and no Strands equivalent is
          named. This route takes the auto-inject path, which needs no tool
          construction — but that path then depends on the agent receiving an
          injected frontend tool, which is exactly the undocumented step.
        </p>
      </Callout>
    </>
  );
}
