# Components as Tools

> Let your agent render rich React components directly in the chat by calling them as tools.


<!-- interactive demo: gen-ui-tool-based -->


## What is this?

Tool-based Generative UI is the simplest form of Generative UI: you register
a React component with `useComponent`, and CopilotKit exposes it to the
agent as a tool. When the agent calls the tool, CopilotKit renders your
component inline in the chat, passing the tool's arguments straight through
as typed props.

Unlike [tool rendering](/strands/generative-ui/tool-rendering), which wraps a
real backend tool in a custom UI, tool-based GenUI is the component. There
is no handler, no user interaction, no server-side execution. The agent
decides when to show it, populates the data, and CopilotKit paints it.

## When should I use this?

Use `useComponent` when you want to:

- Display rich UI (cards, charts, tables, dashboards) inline in the chat
- Show structured data the agent has derived from its reasoning
- Render previews, status indicators, or visual summaries
- Let the agent present information beyond plain text

For components that need user interaction, see
[Human-in-the-loop](/strands/human-in-the-loop). For operational transparency
around a real backend tool, see [Tool rendering](/strands/generative-ui/tool-rendering).

## How it works in code

<Steps>
  <Step>
    ### Nothing to wire on the agent

    On every run the AG-UI Strands adapter registers a proxy tool in the
    agent's tool registry for each tool the request carries, so the agent
    declares none of its own. A component registered with `useComponent`
    reaches the model by name, and the browser executes the call.

    ```python title="src/agents/chart_agent.py"
    from strands import Agent
    from strands.models.openai import OpenAIModel

    from ag_ui_strands import StrandsAgent

    strands_agent = Agent(
        model=OpenAIModel(model_id="gpt-4o"),
        system_prompt=SYSTEM_PROMPT,
        tools=[],
    )

    agui_agent = StrandsAgent(
        agent=strands_agent,
        name="chart_agent",
        description="Renders charts from data.",
    )
    ```

    A backend tool that already owns the name wins: the adapter never replaces
    a native tool with a proxy. Keep the `useComponent` name distinct from
    every tool in `tools=`.

  </Step>
  <Step>
    ### Tell the model when to call it

    This is the part that is easy to miss. The tool arrives on every run, but a
    model with no instruction about it will answer in prose and never call it.
    Name the tool in `system_prompt` and say what it is for.

    ```python title="src/agents/chart_agent.py"
    SYSTEM_PROMPT = (
        "You are a data visualization assistant.\n"
        "When the user asks for a chart, call the frontend `render_bar_chart` "
        "tool with a concise title and a `data` array of `{label, value}` "
        "items.\n"
        "Keep chat responses brief and let the chart do the talking."
    )
    ```

  </Step>
</Steps>

Import the React hook and Zod in the component that registers the tool. This also
applies to the built-in agent, which needs no backend tool-registration step.

```tsx
import { useComponent } from "@copilotkit/react-core/v2";
import { z } from "zod";
```

`useComponent` takes a name, a Zod schema for its props, and the component
to render. The runtime registers it as a frontend tool so the agent can
discover it, and Zod validates the LLM's arguments before they reach your
component.

```typescript
// src/app/demos/gen-ui-tool-based/page.tsx
  useComponent({
    name: "render_bar_chart",
    description: "Display a bar chart with labeled numeric values.",
    parameters: barChartPropsSchema,
    render: BarChart,
  });
```

The component itself is ordinary React: it reads only its props and can
stream in as the agent fills the payload. The example above uses
[Recharts](https://recharts.org) for the bar chart; it doesn't know
anything about CopilotKit.

<Callout type="info">
  The `name` you pass to `useComponent` is what the agent sees as the tool
  name. Make it a verb like `render_bar_chart` or `show_weather` so the LLM
  reliably picks it when the user asks for that visualization.
</Callout>

<IntegrationGrid path="generative-ui/tool-based" />
