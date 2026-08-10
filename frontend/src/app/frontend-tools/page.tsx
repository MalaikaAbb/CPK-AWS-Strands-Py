import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/frontend-tools" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The agent reaching into the app. <code>useFrontendTool</code>{" "}
          registers a tool whose handler runs in the user&apos;s browser, so it
          has the things a server never does: component state, the DOM,{" "}
          <code>localStorage</code>, whatever UI library the page already
          loaded. The model calls it like any other tool and never knows the
          difference.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Make the background a warm sunset gradient",
              "Now something cold and minimal",
            ]}
            expect="The page background changes within a second or two, the CSS value under the heading updates to match, and the agent confirms in words."
            fail="The agent describes a gradient without applying one — the tool was not on its list, or the handler threw before setState ran."
          />
        </div>
      </Panel>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/frontend-tools/demo-chat/page.tsx" />
      </Panel>

      <Panel
        title="The backend half the page declines to show — and does not need to"
        description="Where other frameworks get a two-step setup block, Strands gets a comment. It turns out the comment is enough."
      >
        <p className="mb-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The published markdown for this page contains, at the point where the
          backend snippet belongs, the literal string{" "}
          <code>
            &lt;!-- setup skipped: frontend-tools-setup is not bundled for
            strands --&gt;
          </code>
          . The Google ADK version of the same page prints{" "}
          <code>pip install ag-ui-adk</code> followed by an{" "}
          <code>LlmAgent</code> with <code>tools=[AGUIToolset()]</code> — that{" "}
          <code>AGUIToolset()</code> <em>is</em> ADK&apos;s frontend-tool
          channel, and it has to be wired by hand.
        </p>
        <p className="mb-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Strands needs no equivalent, which is presumably why the section is
          empty — but nothing says so.{" "}
          <code>ag_ui_strands.StrandsAgent</code> keeps a{" "}
          <code>_proxy_tool_names_by_thread</code> map and clones the underlying{" "}
          <code>strands.Agent</code> per thread, re-attaching client-registered
          tools alongside whatever <code>tools=</code> the agent was built with.
          So the Quickstart&apos;s four lines are the whole backend, and{" "}
          <code>change_background</code> reaches the model anyway.
        </p>
        <SourceCodeGroup
          files={[
            { file: "backend/src/agents/chat_agents.py", region: "builder" },
          ]}
          note="What runs: the Quickstart's agent, unchanged. The omission here is documentation, not capability."
        />
      </Panel>

      <Callout tone="info" title="The return value is not decoration">
        <p>
          <code>{"{ status: \"success\" }"}</code> travels back to the agent as
          the tool result. That is what lets the model distinguish &quot;done&quot;
          from &quot;failed&quot; and phrase its next message accordingly —
          returning nothing leaves it guessing, and it will often re-call the
          tool.
        </p>
      </Callout>

      <Callout tone="info" title="Same primitive, three pages">
        <p>
          Frontend tools also underpin{" "}
          <a
            href="/generative-ui/tool-based"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            components as tools
          </a>{" "}
          (<code>useComponent</code> — render, no handler) and{" "}
          <a
            href="/human-in-the-loop"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            human in the loop
          </a>{" "}
          (<code>useHumanInTheLoop</code> — render and wait for the user). This
          page is the plain case: a handler that runs and returns.
        </p>
      </Callout>
    </>
  );
}
