# Frontend Tools

> Let your agent interact with and update your application's UI.



<!-- interactive demo: frontend-tools -->


<Callout type="info" title="See this in Inspector">
  Open Inspector on localhost. Go to **Agents**, then **Frontend Tools**.
  Your tool and its schema are listed.

  More detail: [Inspector](/strands/inspector).
</Callout>


## What is this?

Frontend tools let your agent define and invoke client-side functions that run entirely in the user's browser. Because the handler executes on the frontend, it has direct access to component state, browser APIs, and any third-party UI library the page already uses. That's how an agent can "reach into" the app: update React state, trigger animations, read `localStorage`, pop a toast, or steer the user's view.

This page covers the "agent drives the UI" shape of frontend tools. The same primitive also powers Generative UI and Human-in-the-loop; see those pages for interaction patterns.

## When should I use this?

Use frontend tools when your agent needs to:

- Read or modify React component state
- Access browser APIs like `localStorage`, `sessionStorage`, or cookies
- Trigger UI updates, animations, or transitions
- Show alerts, toasts, or notifications
- Interact with third-party frontend libraries
- Perform anything that requires the user's immediate browser context

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

Register a frontend tool with `useFrontendTool`. Give it a name, a Zod schema for parameters, and a handler. The agent can then call it like any other tool and your frontend runs it in the browser.

```typescript
// src/app/demos/frontend-tools/page.tsx
import React, { useState } from "react";
import {
  CopilotKit,
  CopilotSidebar,
  useFrontendTool,
} from "@copilotkit/react-core/v2";
import { z } from "zod";
import { Background, DEFAULT_BACKGROUND } from "./background";
import { useFrontendToolsSuggestions } from "./suggestions";

function Chat() {
  const [background, setBackground] = useState<string>(DEFAULT_BACKGROUND);

  useFrontendTool({
    name: "change_background",
    description:
      "Change the page background. Accepts any valid CSS background value — colors, linear or radial gradients, etc.",
    parameters: z.object({
      background: z
        .string()
        .describe("The CSS background value. Prefer gradients."),
    }),
    handler: async ({ background }) => {
      setBackground(background);
      return { status: "success" };
    },
  });
```

The handler receives the parsed, type-safe parameters and can do anything
the browser can: update state, call an API, touch the DOM. Its return value
is sent back to the agent as the tool result so the model can reason about
what happened.

```typescript
// src/app/demos/frontend-tools/page.tsx
    handler: async ({ background }) => {
      setBackground(background);
      return { status: "success" };
    },
```

<IntegrationGrid path="frontend-tools" />
