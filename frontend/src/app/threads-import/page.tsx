import { RouteHeader } from "@/components/route-header";
import { Callout, CodeBlock, Panel } from "@/components/ui";

const DRY_RUN = `# The two sources the importer supports. Neither is Strands.
npx copilotkit@latest import --source adk --dry-run
npx copilotkit@latest import --source langgraph --dry-run`;

const DESTINATION = `# The importer reads the process environment — it does not load .env
# or .copilotkit/project.json automatically.
export INTELLIGENCE_API_URL="https://..."
export INTELLIGENCE_API_KEY="cpk_..."`;

const AGENT_MAP = `{
  "support-agent": "support-agent",
  "sales-agent": "sales-agent"
}`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/threads-import" />

      <Callout tone="warn" title="Strands is not a supported import source">
        <p>
          This page sits in the Strands doc tree and its own &quot;Supported
          sources&quot; table lists exactly two: <strong>Google ADK</strong> and{" "}
          <strong>LangGraph</strong>. The prose says &quot;Built-in import
          currently supports Google ADK and LangGraph, with more sources coming
          soon.&quot; Every link out of the flow goes to{" "}
          <code>/google-adk/threads-import</code> or{" "}
          <code>/langgraph-python/threads-import</code>; there is no Strands
          equivalent to link to.
        </p>
        <p className="mt-2">
          So there is nothing to run here. <code>--source strands</code> is not
          an option the CLI offers, and this repo does not invent one. The route
          exists to record the commands the page publishes and the fact that
          they do not apply to this integration.
        </p>
      </Callout>

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Bringing conversations that already exist in a framework&apos;s own
          store into CopilotKit Intelligence as Rich Threads, so they show up in
          the same thread UI as new ones — without replacing the native storage
          or analytics you already have. It is a one-off CLI migration followed
          by ordinary CopilotKit runs.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          It is the only one of the four thread pages with no React surface at
          all. There is no hook, no component and no runtime option — the whole
          feature is <code>npx copilotkit@latest import</code>, which is why
          this route is reference rather than a demo.
        </p>
      </Panel>

      <Panel title="What the importer moves, and what it does not">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
              Imported
            </p>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
              <li>user, assistant, tool, system and developer messages</li>
              <li>tool calls and tool results</li>
              <li>reasoning traces, where the source exposes them</li>
              <li>media that can be resolved during extraction</li>
              <li>original timestamps</li>
              <li>import provenance and per-conversation outcomes</li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-rose-700 dark:text-rose-400">
              Not imported
            </p>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
              <li>agent state snapshots</li>
              <li>framework transport noise</li>
              <li>LangSmith traces</li>
              <li>unsupported source stores</li>
            </ul>
          </div>
        </div>
      </Panel>

      <Panel
        title="The commands, as published"
        description="Recorded for completeness. Neither source applies to a Strands backend."
      >
        <div className="space-y-4">
          <CodeBlock code={DRY_RUN} filename="Dry run" language="bash" />
          <p className="text-sm text-slate-600 dark:text-slate-400">
            A dry run reads the source, discovers agent keys, counts
            conversations, reports skips and estimates upload size{" "}
            <em>without</em> opening an import batch — and needs no Intelligence
            URL or key at all.
          </p>
          <CodeBlock
            code={AGENT_MAP}
            filename="agent-map.json"
            language="json"
          />
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Each source agent key maps to the <code>agentId</code> your live
            runtime uses. Keeping the labels aligned is what stops imported
            history and future traffic splitting across two ids.
          </p>
          <CodeBlock
            code={DESTINATION}
            filename="Destination, before a real import"
            language="bash"
          />
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Note the trap the page flags: a CLI-created starter writes these to{" "}
            <code>.env</code>, but{" "}
            <strong>the importer does not read <code>.env</code></strong> — only
            flags or the current process environment. <code>COPILOTKIT_API_KEY</code>{" "}
            is accepted for the key, and <code>--api-url</code> /{" "}
            <code>--api-key</code> work instead of exporting.
          </p>
        </div>
      </Panel>

      <Callout tone="info" title="Re-running is safe">
        <p>
          Already-imported conversations are skipped, so a repeated import is a
          no-op rather than a duplicate. <code>--replace</code> is the opt-in for
          intentionally refreshing threads that were imported before.
        </p>
      </Callout>

      <Callout tone="info" title="Where this route would lead, if it applied">
        <p>
          The page&apos;s last step is verification through the thread UI: open
          the{" "}
          <a
            href="/prebuilt-components/copilot-threads-drawer"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            Threads Drawer
          </a>
          , select an imported conversation and confirm its history appears —
          or, for a custom UI, select with{" "}
          <a
            href="/headless-threads"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            useThreads
          </a>{" "}
          and pass <code>thread.id</code> to your chat as{" "}
          <code>threadId</code>. Both of those routes exist here; only the
          import that would populate them does not.
        </p>
      </Callout>
    </>
  );
}
