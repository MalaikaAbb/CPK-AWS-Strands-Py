import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

const DIR = "frontend/src/app/generative-ui/mcp-apps";

// The page's two transport examples, verbatim. They are config-shape
// illustrations with placeholder endpoints, so they are shown, not wired.
const HTTP_EXAMPLE = `{
  type: "http",
  url: "http://localhost:3101/mcp",
  serverId: "my-http-server"
}`;

const SSE_EXAMPLE = `{
  type: "sse",
  url: "https://mcp.example.com/sse",
  headers: {
    "Authorization": "Bearer token"
  },
  serverId: "my-sse-server"
}`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/mcp-apps" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The UI comes from a remote MCP server, not from this app. One{" "}
          <code>mcpApps.servers</code> entry on the runtime makes it discover
          the server&apos;s UI-bearing tools, hand them to the agent, run them
          when the agent calls one, and emit an activity event carrying the
          tool&apos;s UI resource. The provider&apos;s built-in renderer then
          draws that resource in a sandboxed iframe. The frontend code is just
          a provider and a chat.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The server is the page&apos;s own example, Excalidraw. Its only
          model-visible UI tool is <code>create_view</code>, which draws a
          hand-drawn diagram.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Draw a diagram of a browser talking to a server talking to a database",
              "Sketch a flowchart: start → decide → yes/no → end",
            ]}
            expect={
              <>
                Not yet observed in a browser on this repo — this is what the
                code path should produce, with{" "}
                <code>MCP_SERVER_URL=https://mcp.excalidraw.com/mcp</code> set
                (as in <code>.env.example</code>). The agent calls{" "}
                <code>create_view</code>; an Excalidraw iframe appears inline
                in the chat and the shapes draw in.
              </>
            }
            fail={
              <>
                A prose description of a diagram and no iframe, with{" "}
                <code>MCP tool discovery failed</code> in the Next server
                log. That is exactly what the page&apos;s fallback URL{" "}
                <code>https://mcp.excalidraw.com</code> produces: it
                redirects to <code>/mcp</code> and the middleware refuses
                redirects, so the agent never receives the tool. It also
                happens if the Excalidraw server is unreachable. An iframe that
                appears but stays blank points at the renderer or the
                server&apos;s resource instead.
              </>
            }
          />
        </div>
      </Panel>



      <Panel title="The runtime">
        <SourceCode file="frontend/src/app/api/copilotkit-mcp-apps/[[...slug]]/route.ts" />
      </Panel>

      <Panel title="The frontend">
        <SourceCodeGroup
          files={[{ file: `${DIR}/mcp-apps.tsx` }, { file: `${DIR}/chat.tsx` }]}
          note="No activity renderer is registered anywhere in this route: the provider ships the MCP Apps renderer built in."
        />
      </Panel>

      <Panel title="The agent">
        <SourceCode file="backend/src/agents/gen_ui_agents.py" region="mcp-apps-agent" />
      </Panel>

      <Panel title="Transport types (reference only)">
        <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">
          The page&apos;s two <code>servers</code> entry shapes. Both point at
          placeholder endpoints, so neither is wired into a runtime here. Note
          that the installed runtime types describe per-server{" "}
          <code>headers</code> as an Intelligence-mode credential; the page
          presents it for plain SSE.
        </p>
        <div className="space-y-4">
          <CodeBlock code={HTTP_EXAMPLE} filename="HTTP" language="typescript" />
          <CodeBlock code={SSE_EXAMPLE} filename="SSE" language="typescript" />
        </div>
      </Panel>

      <Callout tone="info" title="Why this works with no Strands wiring">
        <p>
          The middleware appends the server&apos;s UI tools to the run&apos;s{" "}
          <code>tools</code> list, so they reach the Strands agent exactly like
          a <code>useFrontendTool</code> registration does. When the agent
          calls one, the middleware — not the agent — executes it against the
          MCP server. Only tools that declare a UI resource are forwarded;
          Excalidraw&apos;s <code>read_me</code>, which its{" "}
          <code>create_view</code> description asks the model to call first,
          is not.
        </p>
      </Callout>
    </>
  );
}
