import { RouteHeader } from "@/components/route-header";
import { Callout, CodeBlock, Panel } from "@/components/ui";

// The page's Python commands, as published (re-fetched 2026-11-10). The
// TypeScript tab uses the same flow with STRANDS_TS_IMPORT_* variables and
// `--source strands-typescript`.
const SOURCE = `export STRANDS_PY_IMPORT_SOURCE_ID="my-strands-app"
export STRANDS_PY_IMPORT_AGENT_IDS="support"
export STRANDS_PY_IMPORT_END_USER_ID="user-123"`;

const LOCAL_FILES = `export STRANDS_PY_IMPORT_STORAGE="filesystem"
export STRANDS_PY_IMPORT_ROOT="/absolute/path/to/sessions"
export STRANDS_PY_IMPORT_FORMAT="records"`;

const S3 = `export STRANDS_PY_IMPORT_STORAGE="s3"
export STRANDS_PY_IMPORT_AWS_REGION="us-east-1"
export STRANDS_PY_IMPORT_S3_BUCKET="my-strands-bucket"
export STRANDS_PY_IMPORT_S3_PREFIX="sessions/"
export STRANDS_PY_IMPORT_FORMAT="records"`;

const AGENTCORE = `export STRANDS_PY_IMPORT_STORAGE="agentcore"
export STRANDS_PY_IMPORT_AWS_REGION="us-east-1"
export STRANDS_PY_IMPORT_FORMAT="records"
export STRANDS_PY_IMPORT_AGENTCORE_MEMORY_ID="my-memory-id"
export STRANDS_PY_IMPORT_AGENTCORE_ACTOR_IDS="actor-123"`;

const DRY_RUN = `npx copilotkit@latest import --source strands-python --dry-run`;

const AGENT_MAP = `{
  "support": "support-agent"
}`;

const DESTINATION = `export INTELLIGENCE_API_URL="https://..."
export CPK_INTELLIGENCE_API_KEY="cpk-..."`;

const IMPORT = `npx copilotkit@latest import --source strands-python --agent-map ./agent-map.json`;

const REPLACE = `npx copilotkit@latest import \\
  --source strands-python \\
  --agent-map ./agent-map.json \\
  --replace`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/threads-import" />

      <Callout tone="info" title="Strands is now a supported import source (2026-11-10)">
        <p>
          Until this sync the page listed only Google ADK, LangGraph and
          Mastra. It now documents a Strands importer for Python and
          TypeScript, and the published CLI agrees:{" "}
          <code>npx copilotkit@latest import --help</code> lists{" "}
          <code>strands-python</code> and <code>strands-typescript</code>.
        </p>
        <p className="mt-2">
          The route stays reference-only, and for this repo&apos;s own reason
          now: the agents here keep conversations in memory (no Strands{" "}
          <code>SessionManager</code>), and the page is clear that in-memory
          conversations can&apos;t be imported. A real import also needs a
          CopilotKit Intelligence project key.
        </p>
      </Callout>

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Copying Strands conversations recorded before Intelligence was
          connected into Intelligence, so they open in the same Threads Drawer
          or <code>useThreads</code> UI as new ones. It&apos;s a one-off CLI
          import: no live delivery, and no ongoing replication. The Python
          importer reads session files, S3, or AgentCore Memory sessions saved
          by <code>AgentCoreMemorySessionManager</code>. The TypeScript one
          reads local files or S3 snapshots only, since its AgentCore Memory
          histories are text-only.
        </p>
      </Panel>

      <Panel
        title="The Python flow, as published"
        description="Recorded for completeness. Nothing here is run, because this repo saves no sessions."
      >
        <div className="space-y-4">
          <CodeBlock code={SOURCE} filename="Source (all storages)" language="bash" />
          <p className="text-sm text-slate-600 dark:text-slate-400">
            <code>STRANDS_PY_IMPORT_END_USER_ID</code> must be the user id your
            runtime&apos;s <code>identifyUser</code> returns. Every selected
            conversation is assigned to that one user.
          </p>
          <CodeBlock code={LOCAL_FILES} filename="Local files" language="bash" />
          <CodeBlock code={S3} filename="S3" language="bash" />
          <CodeBlock code={AGENTCORE} filename="AgentCore Memory" language="bash" />
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Format is <code>records</code> for <code>S3SessionManager</code> or{" "}
            <code>session_&lt;id&gt;/session.json</code> stores, and{" "}
            <code>snapshots</code> for{" "}
            <code>…/snapshots/snapshot_latest.json</code> layouts.
          </p>
          <CodeBlock code={DRY_RUN} filename="Dry run (no Intelligence key needed)" language="bash" />
          <CodeBlock code={AGENT_MAP} filename="agent-map.json" language="json" />
          <CodeBlock code={DESTINATION} filename="Destination: the importer does not read .env" language="bash" />
          <CodeBlock code={IMPORT} filename="Import" language="bash" />
          <CodeBlock code={REPLACE} filename="Re-run, refreshing already-imported conversations" language="bash" />
        </div>
      </Panel>

      <Callout tone="info" title="After the import">
        <p>
          Keep the app on the same native session store and agent, so imported
          conversations can be continued. Intelligence rename, archive and
          delete only touch Intelligence&apos;s records. Verify by opening an
          imported conversation in the{" "}
          <a
            href="/prebuilt-components/copilot-threads-drawer"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            Threads Drawer
          </a>{" "}
          or via{" "}
          <a href="/headless-threads" className="text-[var(--accent)] underline underline-offset-4">
            useThreads
          </a>
          .
        </p>
      </Callout>
    </>
  );
}
