import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/agent-config" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Settings that change how the agent behaves, without becoming chat
          messages. The UI owns a typed object — tone, expertise, response
          length — publishes it through <code>useAgentContext</code>, and the
          agent rebuilds its system prompt from it at the start of every turn.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The line the doc draws is worth keeping: if the values are a{" "}
          <em>channel</em> the user occasionally tunes, this is the right shape.
          If they are <em>content</em> the agent should write back to — notes, a
          document, a plan — that is{" "}
          <a
            href="/shared-state/rendering-in-app"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            shared state
          </a>{" "}
          instead.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Ask 'what is a vector database?' with expertise=beginner, then switch to expert and ask again",
              "Set tone=blunt, length=concise, and ask anything",
            ]}
            expect="Identical answers regardless of the settings. useAgentContext publishes the typed object, and nothing documents how a Strands agent reads it back — the page's own Python sample is LangGraph code. What passes here is that the settings panel drives the context entries and the chat streams."
            fail="A crash from useAgentContext, or a chat that does not respond."
          />
        </div>
      </Panel>

      <Panel title="The UI half">
        <SourceCode file="frontend/src/app/agent-config/demo-chat/page.tsx" />
      </Panel>

      <Panel
        title="The agent half, which is a different framework"
        description="The page shows Python. It is not Strands Python."
      >
        <p className="mb-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Under a{" "}
          <code>
            python title=&quot;backend/agent.py — agent reads config and
            rebuilds the system prompt&quot;
          </code>{" "}
          label, the page defines{" "}
          <code>
            async def my_agent_node(state: AgentState, config: RunnableConfig)
          </code>{" "}
          and reads{" "}
          <code>state.get(&quot;copilotkit&quot;, {}).get(&quot;context&quot;, [])</code>
          . <code>AgentState</code> and <code>RunnableConfig</code> are
          LangGraph types, a node function is a LangGraph shape, and{" "}
          <code>state[&quot;copilotkit&quot;][&quot;context&quot;]</code> is
          where LangGraph&apos;s middleware puts context entries. Strands has
          none of the three. The framework-gated slot beside it, the one that
          should hold the Strands version, is the{" "}
          <code>setup skipped</code> placeholder.
        </p>
        <SourceCodeGroup
          files={[
            { file: "backend/src/agents/chat_agents.py", region: "builder" },
          ]}
          note="What runs for this route: the Quickstart's agent. It receives whatever the runtime forwards and has no documented way to look for a config entry in it."
        />
      </Panel>
    </>
  );
}
