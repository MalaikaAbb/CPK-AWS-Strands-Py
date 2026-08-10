import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/shared-state/agent-readonly" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A one-way UI-to-agent channel. Sometimes the agent should{" "}
          <em>know</em> something — who is logged in, what page they are on,
          what they just did — without being able to change it.{" "}
          <code>useAgentContext</code> publishes those values as pure inputs:
          refreshed when they change, removed automatically on unmount, and with
          no setter or tool for the agent to write back through.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Props for the agent, in other words. When you need reads{" "}
          <em>and</em> writes, that is{" "}
          <a
            href="/shared-state/in-app-agent-write"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            full shared state
          </a>{" "}
          instead.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Who am I and what have I been doing?",
              "Change my name to David/any other name — then ask again",
            ]}
            expect="The agent says it has no information about you. The three useAgentContext entries are published on the client, and nothing documents where a Strands agent would find them — the page's backend section is the `setup skipped` placeholder. What passes here is that the entries register and unregister cleanly (watch the Inspector's Context tab) and the chat streams."
            fail="A crash from useAgentContext, or a chat that does not respond."
          />
        </div>
      </Panel>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/shared-state/agent-readonly/demo-chat/page.tsx" />
      </Panel>

      <Panel
        title="The agent side, which the page skips"
        description="Where Google ADK gets a before_model_callback that reads the entries, Strands gets a placeholder."
      >
        <p className="mb-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The page states that entries are &quot;surfaced to the agent via the
          backend&apos;s <code>CopilotKitMiddleware</code>, which threads the
          entries into the model&apos;s message history on every turn&quot;.
          That middleware is never shown for Strands, never imported in the
          published <code>agent.py</code>, and never named again anywhere in the
          Strands tree. The setup block that would show it is the{" "}
          <code>setup skipped</code> placeholder.
        </p>
        <SourceCodeGroup
          files={[
            { file: "backend/src/agents/chat_agents.py", region: "builder" },
          ]}
          note="What runs: the Quickstart's agent. The one Strands page that does read something the UI wrote is Shared State, and it does it with StrandsAgentConfig(state_context_builder=…) — a different mechanism, reading agent state rather than context entries."
        />
      </Panel>


      <Callout tone="info" title="The description is prompt">
        <p>
          Each entry ships its <code>description</code> alongside its value, and
          that string is what tells the model what the value is for. &quot;The
          user&apos;s IANA timezone (used when mentioning times)&quot; earns its
          length; <code>&quot;tz&quot;</code> would not.
        </p>
      </Callout>
    </>
  );
}
