// Ported from the CPK-LangGraph-TS harness (itself ported from aws-strands-ts).
// The strands doc page is byte-identical to the langgraph-typescript one
// (diffed 2026-11-10). The page prints only a TanStack BuiltInAgent; these
// providers' runtime runs the Strands `genui` agent instead (route callout).

import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

const BASE = "frontend/src/app/generative-ui/components/markdown-mode/demo-chat";

const EXAMPLE_REPLY = `Here is an estimate you can play with:

\`\`\`a2ui
{"version":"v1.0","createSurface":{"surfaceId":"plan-estimator","dataModel":{"seats":10,"price":"$290 / month"},"components":[{"id":"root","component":"Card","children":["seats","price"]}]}}
{"version":"v1.0","updateComponents":{"surfaceId":"plan-estimator","components":[{"id":"seats","component":"Slider","label":"Seats","min":1,"max":50,"value":{"@path":"/seats"}},{"id":"price","component":"Text","text":{"@path":"/price"}}]}}
\`\`\`

Move the slider to change the seat count.`;

const ENVELOPE = `{
  "v1.0": {
    "supportedCatalogIds": ["copilotkit/standard@1"],
    "inlineCatalogs": [
      {
        "catalogId": "copilotkit/standard@1",
        "protocolVersion": "1.0",
        "components": { "Card": { "props": { "type": "object" } } },
        "functions": {},
        "instructions": "You can show interactive UI in your reply ..."
      }
    ]
  },
  "metadata": {
    "extensions": {
      "copilotkit_format": 3,
      "copilotkit_transport": "markdown",
      "copilotkit_targets": [{ "id": "chat", "kind": "chat" }],
      "copilotkit_surfaces": {},
      "copilotkit_contextSent": false
    }
  }
}`;

const PYTHON = `ui = input.forwarded_props["copilotkit"]["ui"]
catalog = ui["v1.0"]["inlineCatalogs"][0]
system = f"{MY_PROMPT}\\n\\n{catalog['instructions']}\\n\\nComponents:\\n{json.dumps(catalog['components'])}"`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components/markdown-mode" />

      <Callout tone="warn" title="Agent: Strands, not the doc's BuiltInAgent">
        <p>
          The Components and surfaces pages publish a backend only as a TanStack{" "}
          <code>BuiltInAgent</code> factory, which is not a Strands agent. This
          harness runs its own framework&apos;s agent in that slot: a
          tool-free Strands <code>genui</code> agent
          (<code>backend/src/agents/genui_agent.py</code>) whose prompt is the
          factory&apos;s, verbatim, reached over AG-UI through{" "}
          <code>/api/copilotkit-genui</code>. Doc gap, README §9.35. The
          page&apos;s frontend code below is kept verbatim and type-checked.
          Not yet checked in a browser.
        </p>
      </Callout>

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          No tool call at all: the agent writes A2UI operations, one per line,
          in <code>a2ui</code> code blocks inside an ordinary reply, and the chat
          paints each block as a live surface while the text around it renders
          as markdown. The provider ships the schema and a writing guide as
          context; with <code>sendContext: false</code> it ships them only in
          the run&apos;s forwarded props, for backends that build their own
          prompt.
        </p>
        <div className="mt-4 space-y-3">
          <TryIt
            prompts={["Give me a seat-count slider that shows the monthly price at $29 per seat"]}
            expect='transport: "markdown": a reply with prose and a card holding a working slider in the middle of it; the price updates as you drag, with no new run.'
            fail="The raw a2ui JSON shows as a code block — the provider is not on the markdown transport."
          />
          <TryIt
            prompts={["(sendContext: false) the same prompt"]}
            expect="A plain-text or markdown answer with no live UI. This agent never reads forwardedProps.copilotkit.ui, which is exactly the backend work the page leaves to you."
          />
        </div>
      </Panel>

      <Panel title="The providers and demo">
        <SourceCodeGroup files={[{ file: `${BASE}/providers.tsx` }, { file: `${BASE}/page.tsx` }]} />
      </Panel>

      <Panel title="Published but not run" description="What the agent writes, what the run carries, and a Python backend reading it.">
        <div className="space-y-4">
          <CodeBlock code={EXAMPLE_REPLY} filename="An agent reply — as published" language="markdown" />
          <CodeBlock code={ENVELOPE} filename="forwardedProps.copilotkit.ui — as published" language="json" />
          <CodeBlock code={PYTHON} filename="Build your own prompt (Python) — as published" language="python" />
        </div>
      </Panel>

      <Callout tone="warn" title="Gaps and harness changes">
        <ul className="space-y-1.5">
          <li>
            · Both provider samples are bare JSX; each is wrapped in a component
            and pointed at <code>/api/copilotkit-genui</code>.
          </li>
          <li>
            · The <code>sendContext: false</code> path needs a backend that reads
            the envelope. The page shows one only in Python (no{" "}
            <code>MY_PROMPT</code>, no <code>json</code> import), and that
            Python reads <code>input.forwarded_props</code>. The snippet is a
            fragment, not a Strands agent, so the <code>sendContext: false</code>{" "}
            variant runs on the Strands <code>genui</code> agent, which reads
            no envelope: expect it not to render. The default markdown variant
            runs on the same agent.
          </li>
          <li>
            · The page points to <code>examples/v2/a2ui-markdown</code> to run
            the full thing; that example is not part of the page.
          </li>
        </ul>
      </Callout>
    </>
  );
}
