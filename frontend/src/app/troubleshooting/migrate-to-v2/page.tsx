import { RouteHeader } from "@/components/route-header";
import { Callout, CodeBlock, Panel } from "@/components/ui";

const IMPORTS = `// Before (v1)
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";

// After (v2)
import { CopilotKit, CopilotPopup } from "@copilotkit/react-core/v2";
import "@copilotkit/react-core/v2/styles.css";`;

const AG_UI = `npm install @ag-ui/client@1.0.2
npm ls @ag-ui/client   # should list one version`;

const HOOKS: [string, string][] = [
  ["useCopilotAction", "useFrontendTool"],
  ["useCopilotReadable", "useAgentContext"],
  ["useCopilotAdditionalInstructions", "useAgentContext"],
  ["useCoAgent", "useAgent"],
  ["useCopilotChat", "useAgent (headless: useCopilotChatHeadless_c)"],
  ["AssistantMessage prop", "messageView.assistantMessage slot"],
  ["markdownTagRenderers prop", "assistantMessage.markdownRenderer slot"],
];

export default function Page() {
  return (
    <>
      <RouteHeader path="/troubleshooting/migrate-to-v2" />

      <Panel title="What the guide says">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          V2 moves the frontend into one entry point: hooks, UI components and
          styles all come from <code>@copilotkit/react-core/v2</code>, and{" "}
          <code>@copilotkit/react-ui</code> goes away. The provider keeps its
          name (<code>CopilotKit</code>), only its import moves. The backend,
          the <code>CopilotRuntime</code> config and agent definitions
          don&apos;t change.
        </p>
        <div className="mt-3">
          <CodeBlock code={IMPORTS} filename="Imports, before and after (from the page)" language="tsx" />
        </div>
        <table className="mt-4 w-full text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-slate-500">
              <th className="py-1 pr-4">v1</th>
              <th className="py-1">v2</th>
            </tr>
          </thead>
          <tbody className="text-slate-700 dark:text-slate-300">
            {HOOKS.map(([a, b]) => (
              <tr key={a} className="border-t border-slate-200 dark:border-slate-800">
                <td className="py-1 pr-4 font-mono text-xs">{a}</td>
                <td className="py-1 font-mono text-xs">{b}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4">
          <CodeBlock code={AG_UI} filename="If you import @ag-ui/client directly" language="bash" />
        </div>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          A version other than the one <code>@copilotkit/runtime</code> depends
          on installs a second copy, with its own <code>HttpAgent</code> class.
        </p>
      </Panel>

      <Callout tone="warn" title="Checked against this repo (2026-11-10): the @ag-ui/client step is not followed">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            No v1 imports: nothing in <code>frontend/src</code> imports{" "}
            <code>@copilotkit/react-ui</code> or the root{" "}
            <code>@copilotkit/react-core</code>, and no v1 hook names are used.
          </li>
          <li>
            <strong>But <code>frontend/package.json</code> pins{" "}
            <code>@ag-ui/client</code> 1.0.3</strong>, while the installed{" "}
            <code>@copilotkit/runtime</code> depends on 1.0.2. After{" "}
            <code>npm ci</code> there are three copies (1.0.2, 1.0.3 and an
            old 0.0.59). That is exactly the duplicate <code>HttpAgent</code>{" "}
            the page warns about. It&apos;s the likely cause of the six{" "}
            <code>TS2769</code> &ldquo;not assignable to type{" "}
            <code>AgentsConfig</code>&rdquo; errors <code>tsc</code> reports on
            the runtime routes. Not fixed here: a dependency pin is an infra
            change of its own.
          </li>
        </ul>
      </Callout>
    </>
  );
}
