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
          component catalog. The Strands page publishes this example{" "}
          <strong>twice</strong>: once as prose code blocks, and once as the
          code tabs of its embedded demo. The two disagree on almost every
          detail, so the demo has a toggle and mounts each one unedited.
        </p>
      </Panel>

      <Panel title="Mode 1 — doc snippets (broken by design)">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The prose <code>page.tsx</code>, <code>json-render-renderer.tsx</code>{" "}
          and <code>registry.tsx</code>, verbatim. The code they call but never
          show was written in (see below); the library call itself was left
          exactly as printed.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Break down revenue by category as a pie chart",
              "Show me a sales dashboard.",
            ]}
            expect={
              <>
                <strong>An error is expected</strong> for a single-chart
                request. Once the streamed spec has a chart root with a{" "}
                <code>data</code> array, the demo is replaced by a red box
                reading{" "}
                <code>
                  Error: useVisibility must be used within a VisibilityProvider
                </code>{" "}
                — the prose never wraps <code>&lt;Renderer&gt;</code> in{" "}
                <code>JSONUIProvider</code> (and passes <code>catalog</code>,
                a prop 0.21 does not have). For the dashboard prompt the
                assistant bubble most likely stays <strong>empty</strong>, with
                no error: the page&apos;s agent roots the dashboard on a{" "}
                <code>MetricCard</code> with <code>label</code>/string{" "}
                <code>value</code>, which the prose Zod schema (
                <code>title</code>/number <code>value</code>) rejects, so
                nothing reaches the library. No suggestion pills appear.
              </>
            }
            fail={
              <>
                A chart renders with no error — that would mean the installed{" "}
                <code>@json-render/react</code> accepts the prose call and this
                route needs revisiting. Or a network error: check the backend
                has <code>byoc-json-render</code> in <code>/health</code>.
              </>
            }
          />
        </div>
        <div className="mt-4">
          <Callout tone="warn" title="Kept as published, with @ts-expect-error">
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <code>json-render-renderer.tsx</code>:{" "}
                <code>&lt;Renderer spec=&#123;spec&#125; catalog=&#123;catalog&#125; /&gt;</code>{" "}
                — no <code>catalog</code> prop in 0.21; throws at runtime as
                above.
              </li>
              <li>
                <code>page.tsx</code>:{" "}
                <code>messageView=&#123;&#123; assistantMessage: JsonRenderAssistantMessage &#125;&#125;</code>{" "}
                — CopilotKit 1.75 types the slot as{" "}
                <code>typeof CopilotChatAssistantMessage</code>. Type-only;
                does not throw.
              </li>
            </ul>
            <p className="mt-2">
              Also as published: <code>useConfigureSuggestions</code> runs
              outside the <code>&lt;CopilotKit&gt;</code> it renders, so its
              suggestions land on the app&apos;s root provider, and the prose
              example output uses a <code>Stack</code> type that is in no
              catalog.
            </p>
          </Callout>
        </div>
        <div className="mt-4">
          <SourceCodeGroup
            files={[
              { file: `${DIR}/_snippets/page.tsx` },
              { file: `${DIR}/_snippets/json-render-renderer.tsx` },
              { file: `${DIR}/_snippets/registry.tsx` },
            ]}
          />
        </div>
      </Panel>

      <Panel title="Mode 1 — written in (repo-authored, not from the docs)">
        <ul className="mb-4 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li>
            <code>spec-helpers.ts</code> — <code>stripCodeFencesAndPrelude</code>,{" "}
            <code>tolerantJsonParse</code>, <code>validateAgainstCatalog</code>,
            which <code>parseSpec</code> calls and the page never defines.
          </li>
          <li>
            The <code>AssistantMessage</code> type import.
          </li>
          <li>
            <code>metric-card.tsx</code>, <code>charts/*.tsx</code> — one-line
            re-exports of the leaf components the page <em>does</em> publish in
            its demo tabs.
          </li>
          <li>
            <code>/api/copilotkit-byoc-json-render</code> — the runtime route
            the prose points at. It reaches the same backend agent as mode 2.
          </li>
        </ul>
        <SourceCodeGroup
          files={[
            { file: `${DIR}/_snippets/spec-helpers.ts` },
            { file: `${DIR}/_snippets/metric-card.tsx` },
            {
              file: "frontend/src/app/api/copilotkit-byoc-json-render/[[...slug]]/route.ts",
            },
          ]}
        />
      </Panel>

      <Panel title="Mode 2 — doc demo source (verbatim)">
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
          <Callout tone="warn" title="Two @ts-expect-error lines — version drift, not a logic bug">
            <p>
              The demo pins <code>@json-render/*</code> 0.18; this repo has
              0.21. Under 0.21 <code>catalog.ts</code>&apos;s three{" "}
              <code>props: z.object(…)</code> fail to type-check (0.21 expects
              Zod 4 schemas; the demo&apos;s <code>zod</code> import is 3.25),
              and <code>registry.tsx</code>&apos;s <code>defineRegistry</code>{" "}
              call fails because 0.21 wants an <code>actions</code> key. Both
              are type-level only: the catalog is built and the registry renders
              without them.
            </p>
          </Callout>
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
