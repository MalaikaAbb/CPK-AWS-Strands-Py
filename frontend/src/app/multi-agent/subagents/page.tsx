import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/multi-agent/subagents" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The canonical multi-agent shape: one supervisor LLM that exposes each
          specialist as a tool. Structurally this is just tool-calling — but
          each &quot;tool&quot; is a full agent with its own system prompt, and
          the supervisor only ever sees what it returns.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The example is Research → Write → Critique, delegated in sequence, and
          every delegation is written into shared state so the UI can show a
          live log instead of a spinner.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Write a short paragraph explaining why agent-native UIs beat chatbots",
              "Draft an announcement for a new pricing tier",
            ]}
            expect="Three tool calls in order — research_agent, writing_agent, critique_agent — then a final answer carrying the draft and a line about the critique. The delegation log beside the chat stays empty, which is expected: see below."
            fail="A direct answer with no tool calls at all — the supervisor skipped delegation. Or the same sub-agent firing repeatedly, which is what the 'EXACTLY ONCE' language in its prompt exists to prevent."
          />
        </div>
      </Panel>

      <Panel title="The delegation log">
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/multi-agent/subagents/demo-chat/page.tsx" },
            { file: "frontend/src/app/multi-agent/subagents/delegation-log.tsx" },
          ]}
        />
      </Panel>

      <Panel
        title="The longest surviving prefix of the Strands backend"
        description="947 lines — enough to delegate, one function short of a live log."
      >
        
        <SourceCodeGroup
          files={[
            { file: "backend/src/agents/subagents.py", region: "subagents" },
            { file: "backend/src/agents/chat_agents.py", region: "subagents-agent" },
          ]}
          note="The first file is the doc excerpt, unmodified. The second is the wiring no Strands page shows — tools=[…] on a Strands Agent, plus a supervisor system prompt the page never prints and without which the model answers directly instead of delegating."
        />
      </Panel>

      <Panel title="What each delegation tool does">
        <ol className="space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
          <li>
            <strong>1.</strong> Run the sub-agent on the supplied{" "}
            <code>task</code> string.
          </li>
          <li>
            <strong>2.</strong> Append the result to{" "}
            <code>state[&quot;delegations&quot;]</code> so the UI can render it.{" "}
            <em>— the step that is missing; see above.</em>
          </li>
          <li>
            <strong>3.</strong> Return the sub-agent&apos;s text as the tool
            result, which the supervisor sees on its next turn.
          </li>
        </ol>
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
          Entries are appended only <em>after</em> the sub-agent returns, so the
          log grows by exactly one completed entry per call rather than showing
          running placeholders.
        </p>
      </Panel>

      <Callout tone="info" title="Failures are entries too">
        <p>
          The published <code>_run_subagent</code> catches its own{" "}
          <code>RuntimeError</code> and returns a string prefixed with the
          sentinel <code>__SUBAGENT_FAILED__:</code> carrying only the exception
          class name — never the message, since provider errors can contain
          request ids and quota details that should not reach a browser. Its own
          comment explains why a sentinel beats sniffing for{" "}
          <code>&quot;Error:&quot;</code>: <code>ag_ui_strands</code> flattens
          the canonical <code>tool_result[&quot;status&quot;]</code> signal
          before a state hook can see it. The hook that would read the
          sentinel is one of the pieces past the cut.
        </p>
      </Callout>

      <Callout tone="info" title="Keep the boundaries narrow">
        <p>
          Each sub-agent prompt does one thing. If a sub-agent needs the whole
          user context to do its job, the boundary is in the wrong place — the
          value of the pattern is that each specialist has less to think about,
          not more.
        </p>
      </Callout>
    </>
  );
}
