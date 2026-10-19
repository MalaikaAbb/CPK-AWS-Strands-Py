# MCP Apps

> Render interactive UI components from MCP servers directly in your chat interface.


<!-- interactive demo: mcp-apps -->


## What is this?

MCP Apps are MCP servers that expose tools with associated UI resources. When
the agent calls one of these tools, CopilotKit automatically fetches the
resource and renders the UI component in the chat; no additional frontend
code required.

<Callout type="info">
  **Free course:** See this pattern built end-to-end in [Build Interactive Agents with Generative UI](https://www.deeplearning.ai/short-courses/build-interactive-agents-with-generative-ui/) — a free DeepLearning.AI short course taught by CopilotKit's CEO covering the full Generative UI spectrum (Controlled, Declarative, and Open-Ended).
</Callout>

Key benefits:

- **Zero frontend code** — UI components are served by the MCP server
- **Full interactivity** — components can use HTML, CSS, and JavaScript
- **Secure sandboxing** — content runs in isolated iframes
- **Thread persistence** — MCP Apps are stored in conversation history and restored on reconnect

## Wire the runtime to your MCP server(s)

A single `mcpApps.servers` entry on the runtime is all it takes. The runtime
auto-applies the MCP Apps middleware to every registered agent: each time an
agent calls a tool backed by an MCP UI resource, the middleware fetches the
resource and emits an `activity` event that the built-in
`MCPAppsActivityRenderer` renders inline in the chat as a sandboxed iframe.

```typescript
// src/app/api/copilotkit-mcp-apps/route.ts
// The `mcpApps.servers` config is all you need server-side. The runtime
// auto-applies the MCP Apps middleware to every registered agent: on each
// MCP tool call it fetches the associated UI resource and emits an
// `activity` event that the built-in `MCPAppsActivityRenderer` renders
// inline in the chat.
const runtime = new CopilotRuntime({
  // @ts-ignore -- see main route.ts; published CopilotRuntime's `agents`
  // type wraps Record in MaybePromise<NonEmptyRecord<...>> which rejects
  // plain Records. Fixed in source, pending release.
  agents,
  mcpApps: {
    servers: [
      {
        type: "http",
        url: process.env.MCP_SERVER_URL || "https://mcp.excalidraw.com",
        // Always pin a stable `serverId`. Without it CopilotKit hashes the
        // URL, and a URL change silently breaks restoration of persisted
        // MCP Apps in prior conversation threads.
        serverId: "excalidraw",
      },
    ],
  },
});
```

<Callout type="info" title="Always pin a serverId">
  In production, always provide a stable `serverId`. Without it, CopilotKit
  hashes the server URL, and a URL change (for example between environments)
  silently breaks restoration of MCP Apps persisted in earlier conversation
  threads.
</Callout>

## No frontend renderer needed

Unlike custom activity types, the MCP Apps renderer is already registered by
`CopilotKit` out of the box. A plain `<CopilotChat />` is enough;
no `renderActivityMessages` prop, no manual
`useRenderActivityMessage` wiring.

```typescript
// src/app/demos/mcp-apps/page.tsx
  // No `renderActivityMessages`, no `useRenderActivityMessage` — the
  // CopilotKitProvider auto-registers the built-in `MCPAppsActivityRenderer`
  // for the "mcp-apps" activity type. A plain <CopilotChat /> is enough.
  return (
    <CopilotKit runtimeUrl="/api/copilotkit-mcp-apps" agent="mcp-apps">
      <div className="flex justify-center items-center h-screen w-full">
        <div className="h-full w-full max-w-4xl">
          <Chat />
        </div>
      </div>
    </CopilotKit>
  );
```

## Transport types

The middleware supports two transport types:

### HTTP

Use this format to connect to an MCP server that accepts standard HTTP requests:

```typescript
{
  type: "http",
  url: "http://localhost:3101/mcp",
  serverId: "my-http-server"
}
```

### SSE

Use this format to connect to an MCP server that streams events over a persistent connection:

```typescript
{
  type: "sse",
  url: "https://mcp.example.com/sse",
  headers: {
    "Authorization": "Bearer token"
  },
  serverId: "my-sse-server"
}
```

## Example MCP servers

Try these open-source MCP Apps servers to get started:

- [Excalidraw](https://mcp.excalidraw.com) — collaborative whiteboard rendered in-chat
- [modelcontextprotocol/ext-apps](https://github.com/modelcontextprotocol/ext-apps) — canonical reference implementations

<IntegrationGrid path="generative-ui/mcp-apps" />
