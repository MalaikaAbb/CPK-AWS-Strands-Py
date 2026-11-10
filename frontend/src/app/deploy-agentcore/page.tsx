import { RouteHeader } from "@/components/route-header";
import { Callout, Panel } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/deploy-agentcore" />

      <Callout tone="warn" title="Reference only: needs an AWS account and AgentCore">
        <p>
          The page is a deployment guide for running a Strands agent on AWS
          Bedrock AgentCore, with CopilotKit as its frontend. Both of its
          quickstart paths need AWS credentials configured locally, and the
          result runs in AWS, not on this laptop. Nothing here is deployed or
          mocked, so there&apos;s nothing to run on this route.
        </p>
      </Callout>

      <Panel title="What the page covers">
        <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <li>
            <strong>Architecture:</strong> browser → CopilotKit Runtime →
            AgentCore Runtime → your agent. The runtime has to be server-side,
            because AgentCore calls are signed (SigV4 / OAuth2), which a
            browser can&apos;t do. It&apos;s the same Copilot Runtime this repo
            already runs in <code>/api/copilotkit</code>.
          </li>
          <li>
            <strong>Features carried over:</strong> chat UI (prebuilt or
            headless), shared state, generative UI and human-in-the-loop, plus
            AgentCore&apos;s memory layer persisting conversation history
            across sessions.
          </li>
          <li>
            <strong>Troubleshooting:</strong> starts with{" "}
            <code>HTTP 401: Missing Authentication Token</code> from agent
            execution, meaning the runtime is calling AgentCore unsigned.
          </li>
        </ul>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          The page&apos;s markdown is a single{" "}
          <code>&lt;Content framework=&quot;strands&quot; /&gt;</code> include;
          the summary above is from the rendered page (fetched 2026-11-10).
        </p>
      </Panel>

      <Callout tone="info" title="Related in this repo">
        <p>
          The Import History route covers importing conversations saved by{" "}
          <code>AgentCoreMemorySessionManager</code> into Intelligence (
          <a href="/threads-import" className="text-[var(--accent)] underline underline-offset-4">
            /threads-import
          </a>
          ).
        </p>
      </Callout>
    </>
  );
}
