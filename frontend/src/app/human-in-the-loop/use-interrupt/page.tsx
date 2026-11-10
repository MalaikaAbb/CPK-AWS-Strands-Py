import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

const DOC = "frontend/src/app/human-in-the-loop/use-interrupt/_doc";

export default function Page() {
  return (
    <>
      <RouteHeader path="/human-in-the-loop/use-interrupt" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A backend-enforced pause. The Strands tool{" "}
          <code>schedule_meeting</code> calls{" "}
          <code>tool_context.interrupt(&quot;schedule_meeting&quot;, reason=…)</code>.
          The AG-UI bridge finishes the run with{" "}
          <code>RUN_FINISHED</code> / <code>outcome.type === &quot;interrupt&quot;</code>,
          the <code>useInterrupt</code> render prop draws a time picker, and{" "}
          <code>resolve(...)</code> resumes the same tool call with the
          user&apos;s answer. The page also covers <code>enabled</code> gating
          for several interrupt types, <code>handler</code> preprocessing, the
          standard vs legacy flows, and multi-interrupt runs.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Please book an intro call with the sales team to discuss pricing."]}
            expect="The run pauses and a time-picker card appears in the chat; picking a slot resumes the run and the agent confirms the time."
            fail="The agent answers without pausing, or the card appears but picking a slot never resumes the run (the resume didn't reach the same thread)."
          />
        </div>
      </Panel>

      <Callout tone="info" title="Demo and backend">
        The embedded <code>gen-ui-interrupt</code> demo is mounted from the HITL
        overview route&apos;s verbatim copy. The page&apos;s{" "}
        <code>schedule_meeting</code> snippet matches{" "}
        <code>backend/src/agents/interrupt_agent.py</code>, already in this repo
        for the Headless Interrupts page, now also registered as{" "}
        <code>gen-ui-interrupt</code>. It still imports the unpublished{" "}
        <code>_build_model</code> (repo shim).
      </Callout>

      <Callout tone="warn" title="The other snippets are type-checked, not run">
        The <code>enabled</code>, <code>handler</code>, approve/cancel and
        multi-interrupt snippets are kept byte-for-byte in <code>_doc/</code>.{" "}
        <code>AskCard</code>, <code>ApproveCard</code>,{" "}
        <code>RequestAccessCard</code> and <code>lookupUserDepartment</code>{" "}
        are never defined on the page (TS2304, suppressed), and the agent
        emits only the one interrupt type.
      </Callout>

      <Panel title="Source">
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/human-in-the-loop/overview/_demo/gen-ui-interrupt/page.tsx" },
            { file: "backend/src/agents/interrupt_agent.py", region: "interrupt-agent" },
            { file: `${DOC}/enabled-gating.tsx` },
            { file: `${DOC}/handler-preprocess.tsx` },
            { file: `${DOC}/approve-cancel.tsx` },
            { file: `${DOC}/multi-interrupt.tsx` },
          ]}
        />
      </Panel>
    </>
  );
}
