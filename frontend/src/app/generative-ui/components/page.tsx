import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

// The page's runtime sample, verbatim. Shown, not run: it is a BuiltInAgent
// TanStack factory, and this harness's agents are Strands agents.
const RUNTIME = `import { chat } from "@tanstack/ai";
import { openaiText } from "@tanstack/ai-openai";
import {
  BuiltInAgent,
  convertInputToTanStackAI,
  CopilotRuntime,
  createCopilotRuntimeHandler,
  InMemoryAgentRunner,
} from "@copilotkit/runtime/v2";

const agent = new BuiltInAgent({
  type: "tanstack",
  factory: ({ input, abortController }) => {
    const { messages, systemPrompts, tools } = convertInputToTanStackAI(input);
    return chat({
      adapter: openaiText("gpt-6-luna"),
      messages,
      systemPrompts: [
        "You are a helpful assistant. When a visual answer helps, render it with generative UI.",
        ...systemPrompts,
      ],
      tools,
      abortController,
    });
  },
});

const runtime = new CopilotRuntime({
  agents: { default: agent },
  runner: new InMemoryAgentRunner(),
});

const handler = createCopilotRuntimeHandler({ runtime, basePath: "/api/copilotkit" });

export const GET = handler;
export const POST = handler;`;

const PROVIDERS = `"use client";
import { CopilotKitProvider } from "@copilotkit/react-core/v2";
import { standardUI } from "@copilotkit/react-core/v2/generative-ui";
import "@copilotkit/react-core/v2/styles.css";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CopilotKitProvider runtimeUrl="/api/copilotkit" generativeUI={{ ui: standardUI }}>
      {children}
    </CopilotKitProvider>
  );
}`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A2UI 1.0 components drawn by the agent: put a catalog on the provider
          (<code>generativeUI=&#123;&#123; ui: standardUI &#125;&#125;</code>) and
          the runtime adds a <code>render_ui</code> tool plus a guide to every
          run, so the model can answer with real UI (tables, charts, cards)
          that fills in while it streams.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Compare the Starter, Team, and Enterprise plans in a table",
              "add a column for support",
            ]}
            expect="A table streams into the chat; the follow-up changes the same table in place."
            fail="Plain markdown text: render_ui never reached the model. Check that the Strands genui agent is registered (/health), and that the provider has a generativeUI catalog."
          />
        </div>
      </Panel>

      <Callout tone="warn" title="Runtime differs from the page">
        <p>
          The page&apos;s runtime is a <code>BuiltInAgent</code> TanStack
          factory (below, shown verbatim). This Strands harness serves the
          same provider config through a repo-authored Strands{" "}
          <code>genui</code> agent at <code>/api/copilotkit-genui</code>. It
          needs no glue for the two things the page asks of an agent:{" "}
          <code>ag_ui_strands</code> proxies the run&apos;s{" "}
          <code>render_ui</code> as a client tool, and puts the run&apos;s
          context (the catalog guide) into the model request. Its one
          instruction is the page&apos;s own system prompt.
        </p>
      </Callout>

      <Panel title="The page's provider and runtime">
        <CodeBlock code={PROVIDERS} filename="app/providers.tsx (doc)" language="tsx" />
        <div className="mt-3">
          <CodeBlock code={RUNTIME} filename="app/api/copilotkit/[[...slug]]/route.ts (doc, not run)" language="ts" />
        </div>
      </Panel>

      <Panel title="What runs here">
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/generative-ui/components/demo-chat/page.tsx" },
            { file: "frontend/src/app/api/copilotkit-genui/[[...slug]]/route.ts" },
            { file: "backend/src/agents/genui_agent.py", region: "agent" },
          ]}
        />
      </Panel>
    </>
  );
}
