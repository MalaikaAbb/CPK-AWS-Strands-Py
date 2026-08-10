import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, KeyValue, Panel, TryIt } from "@/components/ui";
import { AGENT_IDS, AGENT_URL } from "@/lib/agents";

export default function Page() {
  return (
    <>
      <RouteHeader path="/copilot-runtime" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The layer between the browser and the agents. It runs on your server,
          which is what makes it the right place for authentication, AG-UI
          middleware and agent routing — none of which can be trusted if they
          live in the client.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The demo is a raw capture of the protocol flowing through it, so the
          runtime is inspectable rather than merely described — and beside it,
          the reply those same events are carrying, rebuilt from{" "}
          <code>textMessageBuffer</code> off the subscriber with no chat
          component involved. Watching the two panes fill together is what
          shows the event log <em>is</em> the reply rather than a description
          of it.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          It carries three agent tabs, because routing is what this page is
          for: one provider, one endpoint, and <code>agentId</code> alone
          deciding which of the 25 registered agents a run reaches. The three
          were picked so the event streams differ visibly —{" "}
          <code>agentic_chat</code> is text only,{" "}
          <code>tool-rendering</code> adds <code>TOOL_CALL_*</code> rows, and{" "}
          <code>shared-state-language</code> is the only one whose{" "}
          <code>STATE_SNAPSHOT</code> ever arrives non-empty. All three panes
          stay mounted, so switching tabs never drops events from a run still
          in flight.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Plain chat tab: Hello",
              "With a backend tool tab: What's the weather in Tokyo?",
              "Then switch back — the first tab still holds its own transcript",
            ]}
            expect="Left pane: RUN_STARTED → TEXT_MESSAGE_START → a collapsed TEXT_MESSAGE_CONTENT row whose delta count climbs → TEXT_MESSAGE_END → RUN_FINISHED. Right pane: your prompt, then the reply appearing a few characters at a time in step with that delta counter, with a 'streaming' pill in the header until the run finishes. On the tool tab, TOOL_CALL_START names get_weather before any text arrives. Each tab keeps its own events and transcript across switches."
            fail="RUN_FAILED, or nothing at all. Check that the Python server is reachable at the agent URL below. Deltas climbing on the left with the right pane empty would mean the buffer is not being read — that is the one failure the two panes can tell apart. Identical event shapes on all three tabs would mean the runtime is not resolving agentId."
          />
        </div>
      </Panel>

      <Panel title="This repo's runtime">
        <div className="mb-4">
          <KeyValue
            rows={[
              ["Main endpoint", <code key="a">/api/copilotkit</code>],
              ["Agent server", <code key="b">{AGENT_URL}</code>],
              ["Agents routed", `${AGENT_IDS.length}`],
              [
                "Extra endpoints",
                <span key="c">
                  <code>/api/copilotkit-voice</code> (v2 runtime, transcription)
                  {" · "}
                  <code>/api/copilotkit-declarative-gen-ui</code> (A2UI
                  auto-inject)
                </span>,
              ],
            ]}
          />
        </div>
        <SourceCode file="frontend/src/app/api/copilotkit/route.ts" />
      </Panel>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/copilot-runtime/demo-chat/page.tsx" />
      </Panel>

      <Panel
        title="Why three runtimes and not one"
        description="Each extra endpoint exists because a doc page needs configuration the main one cannot carry."
      >
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="font-mono text-xs text-slate-900 dark:text-slate-100">
              /api/copilotkit
            </dt>
            <dd className="mt-0.5 text-slate-600 dark:text-slate-400">
              All 25 agents, plus{" "}
              <code>a2ui: {"{ injectA2UITool: false, agents: [\"a2ui-fixed-schema\"] }"}</code>{" "}
              — that agent owns its own tool and must not be handed a second
              one.
            </dd>
          </div>
          <div>
            <dt className="font-mono text-xs text-slate-900 dark:text-slate-100">
              /api/copilotkit-voice
            </dt>
            <dd className="mt-0.5 text-slate-600 dark:text-slate-400">
              <code>transcriptionService</code> exists only on the v2 runtime,
              and the v1 wrapper silently drops it. Needs a{" "}
              <code>[[...slug]]</code> catch-all so the v2 handler can own its
              sub-routing.
            </dd>
          </div>
          <div>
            <dt className="font-mono text-xs text-slate-900 dark:text-slate-100">
              /api/copilotkit-declarative-gen-ui
            </dt>
            <dd className="mt-0.5 text-slate-600 dark:text-slate-400">
              Needs A2UI tool injection <em>on</em>, which the main runtime
              turns off. Separate endpoint, no <code>a2ui</code> block at all.
            </dd>
          </div>
        </dl>
      </Panel>

      <Panel title="Registered agents">
        <div className="flex flex-wrap gap-1.5">
          {AGENT_IDS.map((id) => (
            <code
              key={id}
              className="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              {id}
            </code>
          ))}
        </div>
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
          The Quickstart registers one agent at the server root, because{" "}
          <code>create_strands_app(agui_agent, &quot;/&quot;)</code> is one app
          for one agent. This harness needs one per route, so the Python server
          calls that same function once per agent and mounts each result at{" "}
          <code>/&lt;agent-id&gt;/</code>; the runtime builds one{" "}
          <code>HttpAgent</code> per id from the list below. Nothing on any
          Strands page shows two agents in one process, so the composition is
          this repo&apos;s — the Voice page&apos;s{" "}
          <code>{"`${AGENT_URL}/voice/`"}</code> is the only hint that the
          mounted form is expected at all.
        </p>
        <div className="mt-4">
          <SourceCodeGroup
            files={[
              { file: "frontend/src/lib/agents.ts" },
              { file: "backend/src/agents/registry.py", region: "registry" },
            ]}
          />
        </div>
      </Panel>

      <Callout tone="info" title="No default agent here">
        <p>
          Registering an agent under the name <code>default</code> lets the
          prebuilt components use it without an <code>agentId</code> anywhere.
          That is the right call for an app with one primary agent; with 25 it
          would only hide mistakes, so every surface in this repo names its
          agent explicitly. The voice runtime is the exception — it aliases{" "}
          <code>default</code> to its one agent, per the doc.
        </p>
      </Callout>

      <Callout tone="warn" title="Legacy vs v2 endpoint factories">
        <p>
          <code>copilotRuntimeNextJSAppRouterEndpoint</code> from{" "}
          <code>@copilotkit/runtime</code> is the <strong>v1</strong> factory.
          The v2 equivalent is <code>createCopilotRuntimeHandler</code> from{" "}
          <code>@copilotkit/runtime/v2</code>. Both work in 1.66; the docs
          recommend v2 for new projects. This repo uses the v1 factory for the
          main endpoint — which is what the Quickstart and this page both show —
          and v2 for the voice endpoint, because <code>transcriptionService</code>{" "}
          leaves it no choice.
        </p>
      </Callout>

     
    </>
  );
}
