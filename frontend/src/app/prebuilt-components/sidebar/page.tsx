import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/prebuilt-components/sidebar" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <code>&lt;CopilotSidebar&gt;</code> docks the chat to the side of the
          app and renders as a <em>sibling</em> of your content rather than
          wrapping it — which is what lets it slide out without reflowing the
          page. Same props as <code>&lt;CopilotChat&gt;</code>, plus{" "}
          <code>defaultOpen</code>, <code>header</code> and{" "}
          <code>toggleButton</code>.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Hello", "What is this app for?"]}
            expect="The panel is open on load (defaultOpen), the toggle collapses and restores it, and the conversation survives the collapse."
            fail="The main column jumps or reflows when the panel opens — that is the popup's behaviour, not the sidebar's."
          />
        </div>
      </Panel>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/prebuilt-components/sidebar/demo-chat/page.tsx" />
      </Panel>

      <Panel title="Sidebar-specific props">
        <dl className="space-y-2 text-sm">
          {[
            ["defaultOpen", "Whether the panel starts open on first render."],
            ["agentId", "Agent slug the sidebar talks to."],
            ["labels", "Header, placeholder and disclaimer copy."],
            ["header", "Slot for the header bar."],
            ["toggleButton", "Slot for the open/close launcher."],
          ].map(([name, desc]) => (
            <div key={name} className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
              <dt className="shrink-0 font-mono text-xs text-slate-900 sm:w-36 dark:text-slate-100">
                {name}
              </dt>
              <dd className="text-slate-600 dark:text-slate-400">{desc}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
          Opening and closing it from your own button — rather than the built-in
          toggle — is the{" "}
          <a
            href="/prebuilt-components/chat-controls"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            chat controls
          </a>{" "}
          route.
        </p>
      </Panel>
    </>
  );
}
