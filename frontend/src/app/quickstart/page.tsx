import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

// The Python tab of the page's "Using Anthropic instead" callout, verbatim.
const ANTHROPIC_MODEL = `from strands.models.anthropic import AnthropicModel

model = AnthropicModel(
    client_args={"api_key": os.getenv("ANTHROPIC_API_KEY", "")},
    model_id="claude-sonnet-4-6",
    max_tokens=8192,  # required
)`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/quickstart" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The bring-your-own-agent path, end to end, and the only page in the
          Strands tree whose backend is published in full. A{" "}
          <code>strands.Agent</code> is wrapped by{" "}
          <code>ag_ui_strands.StrandsAgent</code> and turned into an ASGI app by{" "}
          <code>create_strands_app</code>; the Next runtime reaches it with an{" "}
          <code>HttpAgent</code>. Two processes, two ports — Strands is Python,
          so the agent genuinely lives somewhere else.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Can you tell me a joke?",
              "What do you think about React?",
            ]}
            expect="The sidebar opens from its launcher with no agentId on it; tokens stream in a word at a time and the reply renders as markdown. That the agent answers at all proves the provider's agent prop did the binding. Flip the OpenAI / Anthropic toggle at the top of the demo and ask again: the chat resets and the reply comes from the other model."
            fail="An error banner. Check that the Python server is up on :8000 and that OPENAI_API_KEY is set in its environment — and see the model-id gap above if the error mentions an unknown model. On the Anthropic side, an authentication error means ANTHROPIC_API_KEY was not set when the server started."
          />
        </div>
      </Panel>

      <Panel
        title="The demo"
        description="The page's three frontend files. providers.tsx and page.tsx are verbatim; layout.tsx is the doc's layout reduced to what a nested layout may render."
      >
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/quickstart/providers.tsx" },
            { file: "frontend/src/app/quickstart/demo-chat/layout.tsx" },
            { file: "frontend/src/app/quickstart/demo-chat/page.tsx" },
          ]}
        />
        <div className="mt-4">
          <Callout tone="info" title="The provider lives in its own file">
            <p>
              The page puts the provider in a <code>&quot;use client&quot;</code>{" "}
              <code>app/providers.tsx</code> and has the layout — a server
              component — render it, and <code>app/page.tsx</code> carries its
              own <code>&quot;use client&quot;</code>.
            </p>
            <p className="mt-2">
              This demo runs on that provider rather than the app-wide one, so
              the sidebar has no <code>agentId</code>: it reaches{" "}
              <code>strands_agent</code> only through the provider&apos;s{" "}
              <code>agent</code> prop, which is what the page teaches. The
              provider is nested inside the harness&apos;s root one, the same
              arrangement the Voice route uses. The published page is unstyled,
              and so is this one — a bare <code>&lt;h1&gt;</code> and the
              sidebar.
            </p>
          </Callout>
        </div>
      </Panel>

      <Panel
        title="Using Anthropic instead"
        description="The page's callout for swapping the model. The demo's toggle switches between this agent and the OpenAI one on the same route."
      >
        <div className="space-y-4">
          <CodeBlock code={`uv add "strands-agents[anthropic]"`} language="bash" />
          <CodeBlock code={ANTHROPIC_MODEL} language="python" filename="main.py (as published)" />
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Used exactly as published, model id included, as its own agent{" "}
            <code>strands_agent_anthropic</code>. It reads{" "}
            <code>ANTHROPIC_API_KEY</code> from the agent server&apos;s env.
            With the key unset the model still builds (the default is an empty
            string), so the server starts and only Anthropic runs fail. The
            frontend is the same <code>page.tsx</code>; only the provider&apos;s{" "}
            <code>agent</code> prop changes.
          </p>
          <SourceCodeGroup
            files={[
              { file: "backend/src/agents/chat_agents.py", region: "quickstart_anthropic" },
              { file: "frontend/src/app/quickstart/providers-anthropic.tsx" },
              { file: "frontend/src/app/quickstart/provider-switch.tsx" },
            ]}
          />
        </div>
      </Panel>

      <Callout tone="info" title="This page's runtime step was rewritten">
        <p>
          The Quickstart used to build a <strong>v1</strong> endpoint at{" "}
          <code>app/api/copilotkit/route.ts</code> with{" "}
          <code>copilotRuntimeNextJSAppRouterEndpoint</code> and an{" "}
          <code>ExperimentalEmptyAdapter</code>, exporting only{" "}
          <code>POST</code>. It now builds a <strong>v2</strong> handler at a{" "}
          <code>[[...slug]]</code> catch-all, drops the service adapter, exports{" "}
          <code>GET</code> and <code>POST</code>, and adds{" "}
          <code>CopilotKitIntelligence</code>. The route below follows all of
          that; the provider&apos;s matching{" "}
          <code>useSingleEndpoint={"{false}"}</code> is the client half. Full
          before/after in README §9.17.
        </p>
      </Callout>

      <Panel
        title="The files that make it work"
        description="Read from this repo, so they can be diffed against the doc's samples directly."
      >
        <SourceCodeGroup
          files={[
            { file: "backend/src/agents/model.py", region: "model" },
            { file: "backend/src/agents/chat_agents.py", region: "quickstart" },
            { file: "backend/src/agent_server.py", region: "mount" },
            { file: "frontend/src/app/api/copilotkit/[[...slug]]/route.ts" },
          ]}
        />
      </Panel>

      <Callout tone="warn" title="What this repo changed, and why">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <strong>The model id is read from an env var.</strong> The page
            hardcodes <code>model_id=&quot;gpt-5.4&quot;</code>, which does not
            resolve; its own callout says GPT-4o and the two Shared State pages
            use <code>gpt-4o</code>. <code>MODEL_ID</code> defaults to{" "}
            <code>gpt-4o</code> here. Set it to <code>gpt-5.4</code> in{" "}
            <code>backend/.env</code> to reproduce the failure.
          </li>
          <li>
            <strong>One app per agent, mounted side by side.</strong> The page
            ends at <code>create_strands_app(agui_agent, &quot;/&quot;)</code> —
            one app, one agent, one root. Nothing documents serving a second
            agent from the same process, so{" "}
            <code>agent_server.py</code> calls that same function once per agent
            and mounts each result with Starlette&apos;s{" "}
            <code>app.mount</code>. The documented call is untouched; the
            composition around it is this repo&apos;s.
          </li>
          <li>
            <strong>Intelligence is opt-in rather than asserted.</strong> The
            page writes{" "}
            <code>apiKey: process.env.INTELLIGENCE_API_KEY!</code> — a non-null
            assertion on a key most people cloning this repo will not have. Its
            own callout says dropping <code>intelligence</code> and{" "}
            <code>identifyUser</code> falls back to SSE mode, so{" "}
            <code>lib/intelligence.ts</code> omits them when the key is absent
            and the harness stays runnable keyless.{" "}
            <a
              href="/copilot-runtime"
              className="text-[var(--accent)] underline underline-offset-4"
            >
              Copilot Runtime
            </a>{" "}
            reports which mode is live.
          </li>
          <li>
            <strong>Frontend install line names a package that is not used.</strong>{" "}
            The page runs{" "}
            <code>
              npm install @copilotkit/react-ui @copilotkit/react-core
              @copilotkit/runtime @ag-ui/client
            </code>{" "}
            and then imports every component from{" "}
            <code>@copilotkit/react-core/v2</code>.{" "}
            <code>@copilotkit/react-ui</code> is the v1 package and is not
            imported anywhere on the page, so it is not a dependency here.
          </li>
        </ul>
      </Callout>

      <Callout tone="info" title="Trailing slashes matter">
        <p>
          Because each agent is a mounted sub-app, its AG-UI root is{" "}
          <code>http://localhost:8000/&lt;agent-id&gt;/</code> — with the
          slash. <code>lib/agents.ts</code> builds every{" "}
          <code>HttpAgent</code> URL that way. The Voice doc page writes its own
          the same way (<code>{"`${AGENT_URL}/voice/`"}</code>), which is the
          only place the docs acknowledge the form.
        </p>
      </Callout>
    </>
  );
}
