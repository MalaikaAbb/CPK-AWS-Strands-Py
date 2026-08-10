import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/shared-state/in-app-agent-read" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The read half, at its smallest. A component well away from the chat
          reads <code>agent.state?.language</code> and re-renders whenever it
          changes — no props threaded through, no event bus.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          What is missing on Strands is a writer. The page&apos;s backend only
          ever <em>reads</em> state, through{" "}
          <code>StrandsAgentConfig(state_context_builder=…)</code>; no published
          Strands code writes a key back. So the value you watch here is
          whichever one the{" "}
          <a
            href="/shared-state/in-app-agent-write"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            write route
          </a>{" "}
          put there. That is the honest shape of shared state on this
          integration, and the page is upfront about it: &quot;Shared-state in
          AWS Strands is prompt-driven.&quot;
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Switch to Spanish", "Now back to English"]}
            expect="The agent replies in whatever language state currently holds and the raw agent.state block below the panel shows it. Ask it to switch and it will say it cannot — there is no tool that writes language; use the write route's toggle instead."
            fail="The raw agent.state block stays empty after the write route has set a language, meaning the two routes are not sharing one agent instance."
          />
        </div>
      </Panel>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/shared-state/in-app-agent-read/demo-chat/page.tsx" />
      </Panel>

      <Panel title="The agent">
        <SourceCode file="backend/src/agents/language_agent.py" region="language-agent" />
      </Panel>

      <Callout tone="warn" title="Three departures from the doc's samples">
        <p>
          <strong>
            <code>useAgent</code> has no <code>initialState</code>.
          </strong>{" "}
          Both this page and its write-side sibling seed the hook with{" "}
          <code>useAgent({"{ agentId, initialState: { language: \"spanish\" } }"})</code>
          . <code>UseAgentProps</code> in 1.66.2 has no such field. The default
          is applied in the render here — and unlike other integrations there is
          no server-side fallback either, because Strands has no state schema.
        </p>
        <p className="mt-2">
          <strong>
            <code>useAgent</code> has no <code>render</code> either.
          </strong>{" "}
          The page&apos;s &quot;Rendering agent state in the chat&quot; section
          passes a <code>render</code> function to the hook. That prop does not
          exist.
        </p>
        <p className="mt-2">
          <strong>The agentId does not match the page&apos;s own backend.</strong>{" "}
          The snippet reads{" "}
          <code>useAgent({"{ agentId: \"strands_agent\" }"})</code>, but the{" "}
          <code>agent/main.py</code> printed twenty lines above it ends with{" "}
          <code>name=&quot;languageAgent&quot;</code> — which is the id the
          write page&apos;s frontend uses. Copied literally, this page addresses
          an agent it never defines.
        </p>
      </Callout>

      <Callout tone="info" title="The backend needs one line the page does not print">
        <p>
          <code>agent/main.py</code> opens with{" "}
          <code>from ag_ui_strands import …</code> and calls{" "}
          <code>os.getenv(&quot;OPENAI_API_KEY&quot;, &quot;&quot;)</code> three
          lines later. There is no <code>import os</code>. As printed the module
          raises <code>NameError</code> before it can build the model;{" "}
          <code>backend/src/agents/language_agent.py</code> adds the import and
          says so in its docstring.
        </p>
      </Callout>

      <Panel title="The write side">
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/shared-state/in-app-agent-write/demo-chat/page.tsx" },
          ]}
          note="Same agent, opposite direction — see the Writing agent state route."
        />
      </Panel>
    </>
  );
}
