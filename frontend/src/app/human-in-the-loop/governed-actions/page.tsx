import Link from "next/link";

import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

import { HANDLE_APPROVAL_SNIPPET } from "./doc-snippets";

export default function Page() {
  return (
    <>
      <RouteHeader path="/human-in-the-loop/governed-actions" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A checkpoint in front of a side effect. The agent proposes an action
          as a small envelope: id, summary, tool, reference, verdict and
          arguments. A card shows that envelope and acts on the verdict.{" "}
          <code>allow</code> goes through, <code>deny</code> is blocked, and{" "}
          <code>require_approval</code> waits for Approve or Reject. The page
          shows two ways to raise the checkpoint: a frontend tool the model
          calls (<code>useHumanInTheLoop</code>) and a run the backend pauses
          (<code>useInterrupt</code>). Both are mounted here, each on its own
          demo.
        </p>
        <div className="mt-4">
          <Callout tone="warn" title="The governance is not real">
            The page publishes no backend, no policy engine and no{" "}
            <code>executeSideEffect</code>. In the tool-call demo, the model
            fills in <code>id</code>, <code>reference</code> and{" "}
            <code>verdict</code> itself. In the interrupt demo, this repo&apos;s
            tool looks them up in a three-entry table and the side effect is a
            simulated string. The approval mechanism is real. The decision it
            gates is made up.
          </Callout>
        </div>
      </Panel>

      <Panel title="Demo 1: tool-call approval with useHumanInTheLoop">
        <div className="space-y-4">
          <TryIt
            prompts={[
              "Before emailing carol@northwind.test about her $420 refund, get my approval with approve_governed_action (verdict require_approval).",
              "Use approve_governed_action to apply a 30% discount to account NW-8812, verdict require_approval.",
              "Use approve_governed_action to create a support ticket for order 1182, verdict allow.",
            ]}
            expect={
              <>
                On <Link href="/human-in-the-loop/governed-actions/demo-chat" className="underline">/demo-chat</Link>:
                a card reads &quot;User approval required&quot; and shows the
                summary, tool, reference and a JSON block of arguments, with two
                unstyled buttons (the doc gives them no classes). The run waits.
                Approve or Reject resumes it. The card then disappears, because
                the snippet returns <code>null</code> once the call is no longer
                executing. The agent&apos;s reply follows <code>approved</code>.
                With <code>verdict allow</code>, the card approves itself on
                mount, so it shows for a moment at most and the agent carries
                on.
              </>
            }
            fail={
              <>
                No card, and the agent answers in prose. The agent has no
                page-specific prompt, so the model decides when to call the
                tool. Name the tool explicitly, as the prompts above do.
              </>
            }
          />
          <SourceCodeGroup
            files={[
              { file: "frontend/src/app/human-in-the-loop/governed-actions/governed-snippets.tsx", region: "use-human-in-the-loop" },
              { file: "frontend/src/app/human-in-the-loop/governed-actions/demo-chat/page.tsx" },
            ]}
          />
        </div>
      </Panel>

      <Panel title="Demo 2: inline approval with useInterrupt (broken as published)">
        <div className="space-y-4">
          <Callout tone="warn" title="The snippet reads the envelope from the wrong key">
            The Python Strands bridge can pause a run with a real interrupt.
            The Headless Interrupts page&apos;s agent does this, so this half is
            mounted here, unlike on bridges that cannot pause. For a custom
            interrupt, <code>ag_ui_strands</code> puts the tool&apos;s reason
            at <code>interrupt.metadata.reason</code>. The snippet reads{" "}
            <code>interrupt.metadata.action</code>, which is always undefined on
            this bridge. <code>render</code> then returns <code>null</code> and
            no card appears. The Headless Interrupts page&apos;s own demo reads{" "}
            <code>metadata.reason</code>. The snippet is kept as published.
          </Callout>
          <TryIt
            prompts={[
              "Send an email to carol@northwind.test telling her the $420 refund is approved.",
            ]}
            expect={
              <>
                As published, on <Link href="/human-in-the-loop/governed-actions/interrupt/demo-chat" className="underline">/interrupt/demo-chat</Link>:
                the chat shows a <code>propose_governed_action</code> call and
                the run stops. No card appears anywhere. The Inspector shows{" "}
                <code>RUN_FINISHED</code> with an interrupt outcome whose{" "}
                <code>metadata.reason.action</code> holds the envelope. The
                thread stays paused on that interrupt. Reload for a fresh
                thread.
              </>
            }
            fail={
              <>
                The agent claims the email was sent without calling the tool.
                Or the run ends with no interrupt outcome at all. Either one
                means the backend half is broken, not the snippet. A card
                appearing would mean the bridge or the snippet changed, and
                this route should be re-checked.
              </>
            }
          />
          <SourceCodeGroup
            files={[
              { file: "frontend/src/app/human-in-the-loop/governed-actions/governed-snippets.tsx", region: "envelope" },
              { file: "frontend/src/app/human-in-the-loop/governed-actions/governed-snippets.tsx", region: "use-interrupt" },
              { file: "frontend/src/app/human-in-the-loop/governed-actions/interrupt/demo-chat/page.tsx" },
              { file: "backend/src/agents/hitl_agents.py", region: "governed-interrupt-agent" },
            ]}
            note="The backend is written by this repo. The page publishes none."
          />
        </div>
      </Panel>

      <Panel title="Resume handling: reference only">
        <div className="space-y-4">
          <Callout tone="warn" title="executeSideEffect is never defined">
            The page&apos;s server-side check is TypeScript and calls{" "}
            <code>executeSideEffect</code>, which no page defines. This
            repo&apos;s backend is Python, so the same id-and-reference check is
            ported into <code>propose_governed_action</code> above, with a
            stand-in that only reports what it would have run.
          </Callout>
          <CodeBlock code={HANDLE_APPROVAL_SNIPPET} language="ts" filename="as published" />
        </div>
      </Panel>

      <Panel title="Agent for demo 1">
        <SourceCode file="backend/src/agents/hitl_agents.py" region="governed-hitl-agent" />
      </Panel>
    </>
  );
}
