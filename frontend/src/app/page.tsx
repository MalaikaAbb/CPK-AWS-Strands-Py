import Link from "next/link";

import { KeyValue, Panel } from "@/components/ui";
import { AGENT_IDS } from "@/lib/agents";
import { ALL_ROUTES, DOCS_ROOT } from "@/lib/nav-config";
import { DocDriftPanel } from "@/components/doc-drift-panel";

/** Dynamic: the doc-sync readouts below read the snapshot off disk. */
export const dynamic = "force-dynamic";

export default function Page() {
  const counts = ALL_ROUTES.reduce<Record<string, number>>((acc, r) => {
    acc[r.status] = (acc[r.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <header className="border-b border-slate-200 pb-5 dark:border-slate-800">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          CopilotKit + AWS Strands
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-400">
          A test harness for the AWS Strands (Python) integration. Every doc
          page under{" "}
          <a
            href={DOCS_ROOT}
            target="_blank"
            rel="noreferrer"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            docs.copilotkit.ai/strands
          </a>{" "}
          that this repo tracks is a route here, and each route runs the thing
          its page teaches — or, where the page stops short of publishing
          enough to run it, says exactly where it stopped.
        </p>
      </header>


      <DocDriftPanel />

      <Panel title="Where things stand">
        <KeyValue
          rows={[
            ["Doc pages tracked", `${ALL_ROUTES.length}`],
            [
              "Status",
              <span key="s">
                {counts.working ?? 0} working · {counts.partial ?? 0} partial ·{" "}
                {counts.broken ?? 0} broken · {counts.reference ?? 0} reference
              </span>,
            ],
            ["Agents registered", `${AGENT_IDS.length}`],
            [
              "Agents with tools",
              <span key="t">
                1 of {AGENT_IDS.length} — no Strands page passes{" "}
                <code>tools=</code> to a Strands <code>Agent</code>, so the
                Tool Call Rendering agent wires its one tool by hand
              </span>,
            ],
            [
              "Docs tracked",
              <a
                key="d"
                href={DOCS_ROOT}
                target="_blank"
                rel="noreferrer"
                className="text-[var(--accent)] underline underline-offset-4"
              >
                {DOCS_ROOT}
              </a>,
            ],
          ]}
        />
      </Panel>

      <Panel title="How a message travels">
        <ol className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <li>
            <strong>1.</strong> A chat component posts to{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-slate-800">
              /api/copilotkit
            </code>{" "}
            in this Next app.
          </li>
          <li>
            <strong>2.</strong> The Copilot Runtime resolves the agent id and
            forwards the run over AG-UI to{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-slate-800">
              localhost:8000/&lt;agent-id&gt;/
            </code>
            , where that agent&apos;s <code>create_strands_app</code> is
            mounted.
          </li>
          <li>
            <strong>3.</strong> <code>ag_ui_strands</code> runs the Strands{" "}
            <code>Agent</code>, which calls OpenAI.
          </li>
          <li>
            <strong>4.</strong> AG-UI events stream back as SSE, and
            browser-executed tools run at this point and return their results
            into the same run. That step works and no Strands page documents
            it.
          </li>
        </ol>
      </Panel>

      <Panel title="Start here">
        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
          <p>
            <Link
              href="/quickstart"
              className="text-[var(--accent)] underline underline-offset-4"
            >
              Quickstart
            </Link>{" "}
            is the one route whose backend the docs publish end to end. If
            nothing else works, that one should.
          </p>
          <p>
            <Link
              href="/shared-state/in-app-agent-write"
              className="text-[var(--accent)] underline underline-offset-4"
            >
              Writing agent state
            </Link>{" "}
            is the only route where a Strands agent reads something the UI
            wrote, via{" "}
            <code>StrandsAgentConfig(state_context_builder=…)</code>.
          </p>
          <p>
            <Link
              href="/ag-ui"
              className="text-[var(--accent)] underline underline-offset-4"
            >
              AG-UI
            </Link>{" "}
            subscribes to every callback the doc page tabulates, so you can see
            which ones <code>ag_ui_strands</code> actually emits.
          </p>
          <p>
            Sidebar dot colours mirror status: green working, amber partial, red
            broken, grey reference. The{" "}
            <Link
              href="/status"
              className="text-[var(--accent)] underline underline-offset-4"
            >
              status overview
            </Link>{" "}
            lists every route in one table.
          </p>
        </div>
      </Panel>
    </>
  );
}
