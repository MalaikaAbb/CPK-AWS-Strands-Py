import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";


export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/your-components/interactive" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A component the agent can hand control to:{" "}
          <code>useHumanInTheLoop</code> registers a client-side tool whose{" "}
          <code>render</code> stays on screen while <code>status</code> is{" "}
          <code>executing</code>, and the run stays open until a button calls{" "}
          <code>respond</code>. Approve and Deny send back different strings, so
          the agent&apos;s next turn knows which happened.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Execute command ls",
              "Delete all the temp files",
            ]}
            expect="The run pauses and an unstyled block appears with the command in a <pre> and two buttons. Nothing further streams until you press one; Approve and Deny send back different strings and the agent's next message reflects which."
            fail="A prose answer with no gate — the model did not call the tool. Or the gate renders but the run continues underneath it, which means respond was never called."
          />
        </div>
      </Panel>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/generative-ui/your-components/interactive/demo-chat/page.tsx" />
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          The bare <code>&lt;div&gt;</code> / <code>&lt;pre&gt;</code> /{" "}
          <code>&lt;button&gt;</code> markup is the page&apos;s, kept unstyled
          on purpose. Its sibling{" "}
          <a
            href="/human-in-the-loop"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            Human-in-the-Loop
          </a>{" "}
          route is where the same hook is exercised with a real card.
        </p>
      </Panel>

      <Panel
        title="The status gate is the whole mechanism"
        description="One line does the work, and it is easy to drop."
      >
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <code>if (status !== &quot;executing&quot;) return &lt;&gt;&lt;/&gt;;</code>{" "}
          is what makes the gate disappear once answered. Without it the render
          keeps drawing after <code>respond</code> has fired, and the buttons
          stay live — a second click resolves an already-resolved tool call.
          Note also that <code>respond</code> is optional (<code>respond?.</code>):
          it is undefined outside the executing window, which is the same fact
          seen from the other side.
        </p>
      </Panel>

      <Panel
        title="The backend half"
        description="The page has no backend section of any kind, and does not need one."
      >
        <SourceCodeGroup
          files={[{ file: "backend/src/agents/chat_agents.py", region: "builder" }]}
          note="The Quickstart's agent, unchanged. Every interactive-component pattern needs the model to see a client-registered tool; ag_ui_strands proxies them onto the agent per run, and no Strands page documents that it does."
        />
      </Panel>

      <Callout tone="info" title="Respond with an instruction, not a value">
        <p>
          Both branches send back a sentence —{" "}
          <code>&quot;Tell the user the command ran&quot;</code> — rather than{" "}
          <code>true</code> / <code>false</code>. The string lands as the tool
          result and goes straight into the model&apos;s context, so phrasing it
          as an instruction is what steers the follow-up message. A bare boolean
          leaves the model to guess what to say about it.
        </p>
      </Callout>
    </>
  );
}
