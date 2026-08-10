import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/prebuilt-components/popup" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <code>&lt;CopilotPopup&gt;</code> is the lightest of the three: a
          floating launcher that opens an overlay on top of the page. Nothing
          in your layout moves when it opens, which is the whole trade — it
          costs no space, but it covers content while it is open.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Hello", "Summarise what this page is showing"]}
            expect="The composer placeholder reads 'Ask the popup anything...' rather than the default, and the cards behind it never shift."
            fail="The layout reflows when the popup opens — that would mean it is docking, not overlaying."
          />
        </div>
      </Panel>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/prebuilt-components/popup/demo-chat/page.tsx" />
      </Panel>

      <Panel
        title="labels"
        description="The one prop this page exercises beyond the sidebar's set."
      >
        <p className="text-sm text-slate-700 dark:text-slate-300">
          <code>labels</code> is a plain convenience prop, not part of the slot
          system — it replaces strings without replacing components. The doc
          overrides <code>chatInputPlaceholder</code>;{" "}
          <code>modalHeaderTitle</code>, <code>welcomeMessageText</code> and{" "}
          <code>chatDisclaimerText</code> work the same way, and all of them
          apply identically to <code>&lt;CopilotChat&gt;</code> and{" "}
          <code>&lt;CopilotSidebar&gt;</code>.
        </p>
      </Panel>
    </>
  );
}
