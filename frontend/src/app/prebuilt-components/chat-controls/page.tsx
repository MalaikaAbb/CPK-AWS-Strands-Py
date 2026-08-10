import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/prebuilt-components/chat-controls" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Two things the prebuilt surfaces expose to your own UI. First, modal
          state: <code>useCopilotChatConfiguration()</code> returns{" "}
          <code>isModalOpen</code> and <code>setModalOpen</code>, so any button
          in the tree can open or close the chat. Second, feedback: passing{" "}
          <code>onThumbsUp</code>/<code>onThumbsDown</code> to the assistant
          message slot is what makes those buttons appear at all — they are
          opt-in, not hidden by default.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Ask the assistant → then send: what's the weather like?"]}
            expect="Both buttons open the closed sidebar; the toggle's label flips with the panel. Rating a reply appends a row to Captured feedback with that message's id."
            fail="The buttons do not render — that means no provider in the tree owns modal state."
          />
        </div>
      </Panel>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/prebuilt-components/chat-controls/demo-chat/page.tsx" />
      </Panel>

      <Panel title="Feedback handlers">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          Each handler receives the assistant <code>message</code>, so feedback
          can be recorded against a specific response via{" "}
          <code>message.id</code>. The doc pipes this into{" "}
          <code>analytics.track</code>; this route renders the captured events
          on screen instead, so the wiring is visible without a network tab. The
          same <code>messageView</code> slot works on all three prebuilt
          surfaces, since Popup and Sidebar both wrap{" "}
          <code>&lt;CopilotChat&gt;</code>.
        </p>
      </Panel>
    </>
  );
}
