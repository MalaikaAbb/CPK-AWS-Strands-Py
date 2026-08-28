import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, KeyValue, Panel, TryIt } from "@/components/ui";
import { AGENT_IDS, AGENT_URL } from "@/lib/agents";
import { intelligenceStatus } from "@/lib/intelligence-status";

export default function Page() {
  // Server component, so this reads the real process env rather than a guess.
  const intel = intelligenceStatus();

  return (
    <>
      <RouteHeader path="/copilot-runtime" />

      <Callout
        tone={intel.enabled ? "success" : "info"}
        title={
          intel.enabled
            ? "Running in Intelligence mode"
            : "Running in SSE mode — Intelligence is off"
        }
      >
        <p>
          Every runtime in this app takes the Quickstart&apos;s{" "}
          <code>intelligence</code> and <code>identifyUser</code> options from{" "}
          <code>lib/intelligence.ts</code>, which supplies them only when{" "}
          <code>{intel.envVar}</code> is set.{" "}
          {intel.enabled ? (
            <>
              It is set here, so the runtimes construct a{" "}
              <code>CopilotKitIntelligence</code> client and threads persist to
              the platform.
            </>
          ) : (
            <>
              It is not set here, so the options are omitted and the runtimes
              fall back to an in-memory runner. Chat works; Threads and the
              Inspector stay locked and the key is never read — which is the
              fallback the Quickstart&apos;s own callout describes.
            </>
          )}
        </p>
        <p className="mt-2">
          <strong>A green chat proves nothing about this.</strong> The
          Intelligence doc is explicit that a runtime in SSE mode replies
          normally with the key unread, so the only real confirmation is a
          thread appearing in the dashboard.
        </p>
      </Callout>

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
              [
                "Main endpoint",
                <code key="a">/api/copilotkit/[[...slug]]</code>,
              ],
              [
                "Intelligence",
                <span key="i">
                  {intel.enabled ? "on" : "off"} — runtime mode{" "}
                  <code>{intel.mode}</code>
                </span>,
              ],
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
        <SourceCode file="frontend/src/app/api/copilotkit/[[...slug]]/route.ts" />
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

      <Callout tone="info" title="What the 2026-08-26 rewrite added here">
        <p>
          The page&apos;s minimal example moved to the same v2 catch-all shape
          the Quickstart now uses, and gained two things worth copying: an
          explicit <code>runner: new InMemoryAgentRunner()</code>, and the note
          that <code>GET /api/copilotkit/info</code> returns a JSON description
          of the runtime and its agents — &quot;the quickest way to confirm the
          endpoint is wired up&quot;.
        </p>
        <p className="mt-2">
          It also added a warning this repo had to check.{" "}
          <code>useSingleEndpoint={"{false}"}</code> selects the REST transport;
          in released versions <code>&lt;CopilotKit&gt;</code> pins the flag to{" "}
          <code>true</code>, and a multi-route runtime answers that with a 404
          while <code>GET /info</code> still returns 200 — so the app looks
          connected and is not. Verified against 1.66.2:{" "}
          <code>&lt;CopilotKit&gt;</code> resolves{" "}
          <code>props.useSingleEndpoint ?? true</code>, so it honours the prop
          but defaults to the broken combination, while{" "}
          <code>CopilotKitProvider</code> defaults to{" "}
          <code>&quot;auto&quot;</code> and negotiates from <code>/info</code>.
          Every nested provider in this repo passes the prop explicitly for that
          reason.
        </p>
      </Callout>

      <Callout tone="info" title="Legacy vs v2 endpoint factories">
        <p>
          <code>copilotRuntimeNextJSAppRouterEndpoint</code> from{" "}
          <code>@copilotkit/runtime</code> is the <strong>v1</strong> factory.
          The v2 equivalent is <code>createCopilotRuntimeHandler</code> from{" "}
          <code>@copilotkit/runtime/v2</code>. All three endpoints here are on
          v2 now: voice always was, because <code>transcriptionService</code>{" "}
          exists nowhere else, and the other two moved when the Quickstart
          rewrote its runtime step around the v2 handler (README §9.17). The v1
          factory is no longer used anywhere in this repo.
        </p>
      </Callout>

     
    </>
  );
}
