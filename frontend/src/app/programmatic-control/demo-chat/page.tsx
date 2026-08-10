import { DemoFrame } from "@/components/demo-frame";
import { SourceCode } from "@/components/source-code";
import { Callout } from "@/components/ui";

const AGENT_ID = "programmatic-control";

/**
 * The demo that cannot run.
 *
 * The doc's `headless-complete` snippet references `useAgent` and
 * `useCopilotKit` without importing them, so as a route file it throws at
 * prerender and takes the whole build down with it. Rather than add the import
 * the docs omit, the snippet lives beside this file as `page.snippet.tsx` —
 * a name Next does not treat as a route, so it is never compiled or executed —
 * and this page renders it verbatim instead.
 *
 * Nothing was corrected to make that work. What you read below is what the
 * page publishes.
 */
export default function Page() {
  return (
    <DemoFrame
      parentPath="/programmatic-control"
      subtitle={`agent: ${AGENT_ID} — snippet does not run`}
    >
      <div className="h-full space-y-4 overflow-y-auto p-6">
        <Callout tone="warn" title="This snippet cannot run as published">
          <p>
            The doc&apos;s <code>headless-complete</code> pipeline is the whole
            point of the Programmatic Control page, and it is printed in a form
            that does not execute. Three pieces are missing, none of them
            supplied here:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong>The import line.</strong> The snippet opens mid-file at{" "}
              <code>const {"{ agent }"} = useAgent({"{ agentId }"});</code> with
              no imports at all, so <code>useAgent</code> and{" "}
              <code>useCopilotKit</code> are unresolved.
            </li>
            <li>
              <strong>Three helpers.</strong>{" "}
              <code>useAttachmentsConfig</code> (ten destructured values),{" "}
              <code>useAutoScroll</code> and <code>buildContent</code> appear on
              no doc page. They are reconstructed in{" "}
              <code>../headless-helpers.ts</code> so the shape is legible.
            </li>
            <li>
              <strong>A <code>return</code>.</strong> The body ends at{" "}
              <code>handleReset</code>, so the component renders nothing even
              once the names resolve.
            </li>
          </ul>
          <p className="mt-2">
            The three primitives the page is actually about —{" "}
            <code>agent.addMessage</code>,{" "}
            <code>copilotkit.runAgent</code> and{" "}
            <code>copilotkit.stopAgent</code> — are all visible in the source
            below, and all three work. It is the scaffolding around them that
            was never published.
          </p>
        </Callout>

        <SourceCode file="frontend/src/app/programmatic-control/demo-chat/page.snippet.tsx" />
      </div>
    </DemoFrame>
  );
}
