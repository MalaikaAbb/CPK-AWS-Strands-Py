import Link from "next/link";

import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/human-in-the-loop/headless" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A backend tool that pauses the run with a real Strands interrupt.{" "}
          <code>schedule_meeting</code> calls{" "}
          <code>tool_context.interrupt()</code>, and <code>ag_ui_strands</code>{" "}
          ends the run with an AG-UI interrupt outcome. On the client,{" "}
          <code>useInterrupt</code> with <code>renderInChat: false</code> returns
          the picker as an element, and the page places it outside the chat.
          Picking a slot calls <code>resolve()</code>, which resumes the same
          tool call with the answer. This is the first Strands page that
          publishes a working interrupt backend.
        </p>
        <div className="mt-4 space-y-4">
          <TryIt
            prompts={[
              "Book an intro call with the sales team to discuss pricing.",
              "Schedule a 1:1 with Alice next week to review Q2 goals.",
            ]}
            expect={
              <>
                On <Link href="/human-in-the-loop/headless/demo-chat" className="underline">/demo-chat</Link>{" "}
                (both prompts are suggestion pills there): the chat on the right
                shows the tool call and then stops. The dashboard on the left
                switches to &quot;Agent paused&quot; and shows the four-slot
                picker. The chat has no picker. Choose a slot. The dashboard
                reads &quot;Resuming…&quot;, the picker disappears, and the chat
                continues with a confirmation that names the slot you chose.
                &quot;None of these work&quot; resumes with{" "}
                <code>{"{ cancelled: true }"}</code>, and the agent says the
                meeting was not scheduled.
              </>
            }
            fail={
              <>
                The agent confirms a time without any picker appearing, which
                means the model answered instead of calling the tool. Or the run
                stops and the dashboard stays at &quot;No open interrupt&quot;,
                which means the interrupt outcome never reached{" "}
                <code>useInterrupt</code>. Or picking a slot surfaces a run error
                such as &quot;Cannot resume without an active native interrupt
                checkpoint&quot;, which means the resume did not reach the paused
                agent.
              </>
            }
          />
          <TryIt
            prompts={["(no typing, since this page has no chat) click Book call"]}
            expect={
              <>
                On <Link href="/human-in-the-loop/headless/plain-ui/demo-chat" className="underline">/plain-ui/demo-chat</Link>:{" "}
                <code>HeadlessInterruptPanel</code>&apos;s button starts a run.
                When the agent pauses, it becomes &quot;Pick a slot for a
                call:&quot; with four slot buttons. It reads &quot;a call&quot;
                because the Python bridge sends no <code>message</code> on a
                custom interrupt. <code>ApprovalPanel</code> shows the same open
                interrupt as &quot;Approve this action?&quot;. Clicking a slot
                resumes, and both panels reset. Nothing shows the agent&apos;s
                reply because there is no chat. Use the Inspector to see it.
                &quot;Mount HeadlessInterruptPanelRaw&quot; prints{" "}
                <code>threw: ReferenceError: useHeadlessInterrupt is not defined</code>.
              </>
            }
            fail={
              <>
                Book call does nothing, or the panels never change. Approving
                through <code>ApprovalPanel</code> is not a failure, even though
                the tool then reports &quot;User did not pick a time&quot;: the
                snippet resumes with <code>{"{ approved: true }"}</code>, which
                carries no time.
              </>
            }
          />
        </div>
      </Panel>

      <Panel
        title="The agent"
        description="The page's interrupt_agent.py, verbatim except one import (see the header). It is registered as interrupt-headless."
      >
        <SourceCode file="backend/src/agents/interrupt_agent.py" region="interrupt-agent" />
      </Panel>

      <Panel title="The demo page">
        <div className="space-y-4">
          <Callout tone="warn" title="The published file is only the top of the file">
            The page prints <code>page.tsx</code> up to the end of{" "}
            <code>Layout</code>. <code>TimeSlotPopup</code>,{" "}
            <code>AppSurface</code> and the{" "}
            <code>../_shared/interrupt-fallback-slots</code> module it imports
            are never shown. The file also has no <code>&quot;use client&quot;</code>.
            All four are added here, outside the verbatim region, and the popup
            reuses the <Link href="/human-in-the-loop" className="underline">/human-in-the-loop</Link>{" "}
            picker card.
          </Callout>
          <SourceCodeGroup
            files={[
              { file: "frontend/src/app/human-in-the-loop/headless/demo-chat/page.tsx" },
              { file: "frontend/src/app/human-in-the-loop/headless/_shared/interrupt-fallback-slots.ts" },
            ]}
          />
        </div>
      </Panel>

      <Panel title="Driving it from plain UI">
        <div className="space-y-4">
          <Callout tone="warn" title="useHeadlessInterrupt does not exist">
            <code>HeadlessInterruptPanelRaw</code> calls{" "}
            <code>useHeadlessInterrupt</code> and the page describes it as
            &quot;defined above&quot;. For Strands, that earlier spot shows the{" "}
            <code>useInterrupt</code> demo instead, so the hook is defined nowhere.{" "}
            <code>@copilotkit/react-core/v2</code> 1.75.1 does not export it. The
            snippet is kept as published under a{" "}
            <code>@ts-expect-error</code> and throws when mounted. The other
            snippets also use <code>SLOTS</code>, which the page never defines.
            This repo supplies it.
          </Callout>
          <SourceCode file="frontend/src/app/human-in-the-loop/headless/plain-ui/demo-chat/page.tsx" />
        </div>
      </Panel>
    </>
  );
}
