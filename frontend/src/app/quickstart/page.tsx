import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

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
            expect="Tokens stream in a word at a time and the reply renders as markdown."
            fail="An error banner. Check that the Python server is up on :8000 and that OPENAI_API_KEY is set in its environment — and see the model-id gap above if the error mentions an unknown model."
          />
        </div>
      </Panel>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/quickstart/demo-chat/page.tsx" />
      </Panel>

      <Panel
        title="The four files that make it work"
        description="Read from this repo, so they can be diffed against the doc's samples directly."
      >
        <SourceCodeGroup
          files={[
            { file: "backend/src/agents/model.py", region: "model" },
            { file: "backend/src/agents/chat_agents.py", region: "quickstart" },
            { file: "backend/src/agent_server.py", region: "mount" },
            { file: "frontend/src/app/api/copilotkit/route.ts" },
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
