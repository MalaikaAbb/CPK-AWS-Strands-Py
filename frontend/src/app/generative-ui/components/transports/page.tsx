// Ported from the CPK-LangGraph-TS harness (itself ported from aws-strands-ts).
// The strands doc page is byte-identical to the langgraph-typescript one
// (diffed 2026-11-10). The page prints no Strands agent, so no agent stands
// behind these providers' runtime: chats fail (see the route callout).

import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

const BASE = "frontend/src/app/generative-ui/components/transports/demo-chat";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components/transports" />

      <Callout tone="warn" title="Broken: no Strands agent is printed">
        <p>
          The Components and surfaces pages publish a backend only as a TanStack{" "}
          <code>BuiltInAgent</code> factory; nothing for Strands. The
          repo-authored Strands <code>genui</code> agent (and its{" "}
          <code>/api/copilotkit-genui</code> runtime) was removed, so the
          demo&apos;s chat has no agent and its requests fail. The page&apos;s
          frontend code below is kept verbatim and type-checked.
        </p>
      </Callout>

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The same catalog can reach the browser two ways: the agent calls a{" "}
          <code>render_ui</code> tool the runtime adds (checked server-side as
          it streams), or it writes <code>a2ui</code> code blocks inside its
          reply (checked in the browser). <code>agentIds</code> limits which
          agents get any of it, and the runtime&apos;s{" "}
          <code>generativeUI</code> option controls when the tool is added.
        </p>
        <div className="mt-4 space-y-3">
          <TryIt
            prompts={["Compare the Starter, Team, and Enterprise plans in a table"]}
            expect="Expected today: every variant errors. The runtime route is the page's CopilotRuntime sample verbatim, and its agent is never defined, so the route throws on load."
            fail="The 'as default' variant renders a component — agentIds was ignored."
          />
        </div>
      </Panel>

      <Panel title="The runtime" description="The page's CopilotRuntime sample, verbatim; its agent is undefined.">
        <SourceCode file="frontend/src/app/api/copilotkit-genui-transports/[[...slug]]/route.ts" />
      </Panel>

      <Panel title="The provider configs and demo">
        <SourceCodeGroup files={[{ file: `${BASE}/configs.ts` }, { file: `${BASE}/page.tsx` }]} />
      </Panel>

      <Callout tone="warn" title="Gaps and harness changes">
        <ul className="space-y-1.5">
          <li>
            · The runtime sample references an <code>agent</code> it never
            builds, and no Strands agent is printed. It is kept verbatim under{" "}
            <code>@ts-expect-error</code>, so the route throws a{" "}
            <code>ReferenceError</code> when loaded.
          </li>
          <li>
            · The &ldquo;Only some agents&rdquo; sample lists a{" "}
            <code>shop</code> agent in <code>agentIds</code> that no page
            builds; none is registered.
          </li>
          <li>
            · The runtime sample sets no <code>runner</code>; it gets the
            runtime&apos;s default in-memory runner.
          </li>
        </ul>
      </Callout>
    </>
  );
}
