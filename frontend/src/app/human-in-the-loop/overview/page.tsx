import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

const DEMO = "frontend/src/app/human-in-the-loop/overview/_demo";

export default function Page() {
  return (
    <>
      <RouteHeader path="/human-in-the-loop/overview" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The two ways to pause for a human, side by side.{" "}
          <strong>useHumanInTheLoop</strong> (tool-based): the model decides
          to call a frontend tool (<code>book_call</code>), a time-picker card
          renders in the chat, and the pick becomes the tool result.{" "}
          <strong>useInterrupt</strong> (backend-paused): a Strands tool calls{" "}
          <code>tool_context.interrupt(...)</code>, the run finishes with an
          interrupt outcome, the card renders from its payload, and resolving
          resumes the same tool call. The demo has the page&apos;s two
          embedded demos as tabs.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Please book an intro call with the sales team to discuss pricing."]}
            expect="On both tabs a time-picker card appears; picking a slot makes the agent confirm the booked time. On useInterrupt the card comes from the interrupt payload, and the run resumes on the same thread."
            fail="A plain-text answer (no tool call / no interrupt), or a card that never resumes the run."
          />
        </div>
      </Panel>

      <Callout tone="info" title="What was copied">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Both demos are the Code tab&apos;s (Strands showcase{" "}
            <code>hitl-in-chat</code> and <code>gen-ui-interrupt</code>),
            verbatim. <code>hitl-in-chat</code> runs on this repo&apos;s{" "}
            <code>hitl-in-chat</code> agent, and <code>gen-ui-interrupt</code>{" "}
            on <code>backend/src/agents/interrupt_agent.py</code>, whose{" "}
            <code>schedule_meeting</code> matches the snippet on the
            useInterrupt page.
          </li>
          <li>
            <code>_shared/interrupt-fallback-slots.ts</code>, imported by{" "}
            <code>gen-ui-interrupt</code>, is not in the doc bundle.{" "}
            <strong>Borrowed from CopilotKit&apos;s GitHub showcase</strong>.
          </li>
        </ul>
      </Callout>

      <Callout tone="warn" title="Contradicts this repo's older /human-in-the-loop note">
        The off-sidebar <code>/human-in-the-loop</code> route says{" "}
        <code>useInterrupt</code> is LangGraph-only and doesn&apos;t apply to
        Strands. The sidebar HITL pages now document Strands&apos; native{" "}
        <code>tool_context.interrupt()</code> with <code>useInterrupt</code>.
        That note is out of date. I left it unchanged here because it belongs to
        a different page.
      </Callout>

      <Panel title="Source">
        <SourceCodeGroup
          files={[
            { file: `${DEMO}/hitl-in-chat/page.tsx` },
            { file: `${DEMO}/gen-ui-interrupt/page.tsx` },
            { file: "backend/src/agents/interrupt_agent.py", region: "interrupt-agent" },
          ]}
        />
      </Panel>
    </>
  );
}
