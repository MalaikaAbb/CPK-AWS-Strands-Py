import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/custom-look-and-feel/headless-ui" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A working chat with zero CopilotKit chrome. Nothing on the demo route
          is a CopilotKit component — the bubbles, the composer and the layout
          are all hand-written. CopilotKit still handles the part that is hard:
          agent communication, message management, streaming and tool-call
          rendering.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Hello", "Write two sentences about headless UI"]}
            expect="Tokens stream into hand-written bubbles, a 'Thinking…' line appears while the run is open, and the view sticks to the bottom."
            fail="The first message does nothing — usually the runtime handshake has not resolved yet, so runAgent raced it."
          />
        </div>
      </Panel>

      <Panel title="The three hooks">
        <dl className="space-y-2 text-sm">
          {[
            [
              "useAgent({ agentId })",
              "The conversation itself — messages, isRunning, and the methods to append to it.",
            ],
            [
              "useCopilotKit()",
              "The runtime handle. copilotkit.runAgent({ agent }) is what <CopilotChat> calls under the hood.",
            ],
            [
              "useRenderToolCall()",
              "Returns a function that paints any registered tool call inline.",
            ],
          ].map(([name, desc]) => (
            <div key={name} className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
              <dt className="shrink-0 font-mono text-xs text-slate-900 sm:w-52 dark:text-slate-100">
                {name}
              </dt>
              <dd className="text-slate-600 dark:text-slate-400">{desc}</dd>
            </div>
          ))}
        </dl>
      </Panel>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/custom-look-and-feel/headless-ui/demo-chat/page.tsx" />
      </Panel>
    </>
  );
}
