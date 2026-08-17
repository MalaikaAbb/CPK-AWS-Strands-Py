# Tool Call Rendering

> Render your agent's tool calls with custom UI components.


<!-- interactive demo: tool-rendering -->


## What is this?

Tools are how an LLM invokes predefined, typically-deterministic functions.
Tool rendering lets you decide how each of those tool calls appears in the
chat. Instead of showing raw JSON, you register a React component that draws
a branded card for the call (arguments, live status, and the eventual
result). This is the **Generative UI** variant CopilotKit calls **tool
rendering**.

<Callout type="info">
  **Free course:** See this pattern built end-to-end in [Build Interactive Agents with Generative UI](https://www.deeplearning.ai/short-courses/build-interactive-agents-with-generative-ui/) — a free DeepLearning.AI short course taught by CopilotKit's CEO covering the full Generative UI spectrum (Controlled, Declarative, and Open-Ended).
</Callout>

## When should I use this?

Render tool calls when you want to:

- Show users exactly what tools the agent is invoking and with what arguments
- Display live progress indicators while a tool executes
- Render rich, polished results once a tool completes
- Give tool-heavy agents a transparent, on-brand chat experience

## Default tool rendering (zero-config)

The simplest entry point: call `useDefaultRenderTool()` with no arguments.
CopilotKit registers its built-in `DefaultToolCallRenderer` as the `*`
wildcard: every tool call renders as a tidy status card (tool name, live
**Running → Done** pill, collapsible arguments/result) without you writing
any UI.

Without this hook the runtime has no `*` renderer and tool calls are
invisible; the user only sees the assistant's final text summary.

```typescript
// src/app/demos/tool-rendering-default-catchall/page.tsx
  // Opt in to CopilotKit's built-in default tool-call card. Called with
  // no config so the package-provided `DefaultToolCallRenderer` is used
  // as the wildcard renderer — this is the "out-of-the-box" UI the cell
  // is meant to showcase.
  useDefaultRenderTool();
```

Here's what the built-in status card looks like for each tool call:


<!-- interactive demo: tool-rendering-default-catchall -->


## Custom catch-all

Once you want on-brand chrome, pass a `render` function to
`useDefaultRenderTool`. It's a convenience wrapper around
`useRenderTool({ name: "*", ... })`: one wildcard renderer handles every
tool call, named or not:

```typescript
// src/app/demos/tool-rendering-custom-catchall/page.tsx
  // `useDefaultRenderTool` is a convenience wrapper around
  // `useRenderTool({ name: "*", ... })` — a single wildcard renderer
  // that handles every tool call not claimed by a named renderer.
  useDefaultRenderTool(
    {
      render: ({ name, parameters, status, result }) => (
        <CustomCatchallRenderer
          name={name}
          parameters={parameters}
          status={status as CatchallToolStatus}
          result={result}
        />
      ),
    },
    [],
  );
```

Here's the branded catch-all in action, where every tool call gets the same on-brand card:


<!-- interactive demo: tool-rendering-custom-catchall -->


## Per-tool renderers

The most expressive path is one renderer per tool name. The primary
`tool-rendering` cell wires two: `get_weather` draws a branded
`WeatherCard`, `search_flights` draws a `FlightListCard`. Each renderer
receives the tool's parsed arguments, a live `status`, and (once the agent
returns) the `result`:

```typescript
// src/app/demos/tool-rendering/page.tsx
import React from "react";
import {
  CopilotKit,
  CopilotChat,
  useRenderTool,
  useDefaultRenderTool,
} from "@copilotkit/react-core/v2";
import { z } from "zod";
import { WeatherCard } from "./weather-card";
import { FlightListCard, type Flight } from "./flight-list-card";
import { StockCard } from "./stock-card";
import { D20Card } from "./d20-card";
import {
  CustomCatchallRenderer,
  type CatchallToolStatus,
} from "./custom-catchall-renderer";
import { parseJsonResult } from "../_shared/parse-json-result";
import { useSuggestions } from "./suggestions";

interface WeatherResult {
  city?: string;
  temperature?: number;
  humidity?: number;
  wind_speed?: number;
  conditions?: string;
}

interface FlightSearchResult {
  origin?: string;
  destination?: string;
  flights?: Flight[];
}

interface StockResult {
  ticker?: string;
  price_usd?: number;
  change_pct?: number;
}

interface D20Result {
  value?: number;
  result?: number;
  sides?: number;
}

export default function ToolRenderingDemo() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit" agent="tool-rendering">
      <div className="flex justify-center items-center h-screen w-full">
        <div className="h-full w-full max-w-4xl">
          <Chat />
        </div>
      </div>
    </CopilotKit>
  );
}

function Chat() {
  // Per-tool renderer #1: get_weather → branded WeatherCard.
  useRenderTool(
    {
      name: "get_weather",
      parameters: z.object({
        location: z.string(),
      }),
      render: ({ parameters, result, status }) => {
        const loading = status !== "complete";
        const parsed = parseJsonResult<WeatherResult>(result);
        return (
          <WeatherCard
            loading={loading}
            location={parameters?.location ?? parsed.city ?? ""}
            temperature={parsed.temperature}
            humidity={parsed.humidity}
            windSpeed={parsed.wind_speed}
            conditions={parsed.conditions}
          />
        );
      },
    },
    [],
  );
```

The flight renderer follows the same pattern with a different component and schema:

```typescript
// src/app/demos/tool-rendering/page.tsx
import React from "react";
import {
  CopilotKit,
  CopilotChat,
  useRenderTool,
  useDefaultRenderTool,
} from "@copilotkit/react-core/v2";
import { z } from "zod";
import { WeatherCard } from "./weather-card";
import { FlightListCard, type Flight } from "./flight-list-card";
import { StockCard } from "./stock-card";
import { D20Card } from "./d20-card";
import {
  CustomCatchallRenderer,
  type CatchallToolStatus,
} from "./custom-catchall-renderer";
import { parseJsonResult } from "../_shared/parse-json-result";
import { useSuggestions } from "./suggestions";

interface WeatherResult {
  city?: string;
  temperature?: number;
  humidity?: number;
  wind_speed?: number;
  conditions?: string;
}

interface FlightSearchResult {
  origin?: string;
  destination?: string;
  flights?: Flight[];
}

interface StockResult {
  ticker?: string;
  price_usd?: number;
  change_pct?: number;
}

interface D20Result {
  value?: number;
  result?: number;
  sides?: number;
}

export default function ToolRenderingDemo() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit" agent="tool-rendering">
      <div className="flex justify-center items-center h-screen w-full">
        <div className="h-full w-full max-w-4xl">
          <Chat />
        </div>
      </div>
    </CopilotKit>
  );
}

function Chat() {
  // Per-tool renderer #1: get_weather → branded WeatherCard.
  useRenderTool(
    {
      name: "get_weather",
      parameters: z.object({
        location: z.string(),
      }),
      render: ({ parameters, result, status }) => {
        const loading = status !== "complete";
        const parsed = parseJsonResult<WeatherResult>(result);
        return (
          <WeatherCard
            loading={loading}
            location={parameters?.location ?? parsed.city ?? ""}
            temperature={parsed.temperature}
            humidity={parsed.humidity}
            windSpeed={parsed.wind_speed}
            conditions={parsed.conditions}
          />
        );
      },
    },
    [],
  );

  // Per-tool renderer #2: search_flights → branded FlightListCard.
  useRenderTool(
    {
      name: "search_flights",
      parameters: z.object({
        origin: z.string(),
        destination: z.string(),
      }),
      render: ({ parameters, result, status }) => {
        const loading = status !== "complete";
        const parsed = parseJsonResult<FlightSearchResult>(result);
        return (
          <FlightListCard
            loading={loading}
            origin={parameters?.origin ?? parsed.origin ?? ""}
            destination={parameters?.destination ?? parsed.destination ?? ""}
            flights={parsed.flights ?? []}
          />
        );
      },
    },
    [],
  );
```

<Callout type="info">
  The `name` you pass to `useRenderTool` must match the tool name the agent
  exposes; that's how the runtime routes the call to your component.
</Callout>

Per-tool renderers compose with a catch-all: named renderers claim the
"interesting" tools and a wildcard handles everything else. In the primary
cell, the same `CustomCatchallRenderer` from above catches `get_stock_price`
and `roll_dice`:

```typescript
// src/app/demos/tool-rendering/page.tsx
  // Wildcard catch-all for anything that doesn't match a per-tool
  // renderer above.
  useDefaultRenderTool(
    {
      render: ({ name, parameters, status, result }) => (
        <CustomCatchallRenderer
          name={name}
          parameters={parameters}
          status={status as CatchallToolStatus}
          result={result}
        />
      ),
    },
    [],
  );
```

## The backend tool definition

The frontend renderer only sees what the agent sends down. Here's the
matching backend definition for `get_weather`: expose a tool named
`get_weather`, return structured data, and let the frontend renderer with
the same name paint the card.

```python
# src/agents/agent.py
import json
import logging
import os
import threading
import uuid
from collections.abc import AsyncIterator, Mapping
from typing import Any, Optional, TypedDict

from ag_ui.core.events import (
    EventType,
    MessagesSnapshotEvent,
    RunStartedEvent,
    StateSnapshotEvent,
    TextMessageContentEvent,
    TextMessageEndEvent,
    TextMessageStartEvent,
    ToolCallArgsEvent,
    ToolCallEndEvent,
    ToolCallResultEvent,
    ToolCallStartEvent,
)
from ag_ui.core.types import (
    AssistantMessage,
    FunctionCall,
    ToolCall,
    ToolMessage,
    UserMessage,
)
from ag_ui_strands import (
    StrandsAgent,
    StrandsAgentConfig,
    ToolBehavior,
)
from strands import Agent, tool
from strands.hooks import (
    AfterToolCallEvent,
    BeforeInvocationEvent,
    BeforeToolCallEvent,
    HookProvider,
    HookRegistry,
)
from strands.models.openai import OpenAIModel

# Import shared tool implementations (symlinked at project root → ../../shared/python/tools)
from tools import (
    get_weather_impl,
    query_data_impl,
    manage_sales_todos_impl,
    roll_dice_impl,
    schedule_meeting_impl,
    search_flights_impl,
    build_a2ui_operations_from_tool_call,
)

# gen-ui-agent specialization (set_steps tool + state hook + prompt addendum).
# The shared Strands backend serves every demo; this module lives in its own
# file so the gen-ui-agent surface area is reviewable in isolation, matching
# the wave-2 BYOC pattern (byoc_hashbrown.py / byoc_json_render.py).
from agents.gen_ui_agent import (
    GEN_UI_AGENT_PROMPT,
    set_steps,
    steps_state_from_args,
)

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# MessagesSnapshot-injecting wrapper
# ---------------------------------------------------------------------------
#
# ag_ui_strands (through at least v0.1.7) does NOT emit
# ``MessagesSnapshotEvent`` events. The CopilotKit frontend requires
# these events to build its internal message tree — without them,
# responses that include tool calls never render as assistant messages
# in the DOM (the tool-call events are received but no visible message
# element is created).
#
# ``_MessagesSnapshotWrapper`` sits between StrandsAgent.run() and the
# SSE transport: it intercepts the event stream and injects
# ``MessagesSnapshotEvent`` at the points where LangGraph Python's
# adapter would emit them:
#
#   1. After the initial ``RunStartedEvent`` — snapshot contains the
#      user message that started this turn.
#   2. After each ``ToolCallEndEvent`` — snapshot contains the assistant
#      message with its ``tool_calls[]`` list so the frontend's message
#      tree can create the assistant bubble before the tool result
#      arrives.
#   3. After each ``ToolCallResultEvent`` — snapshot contains the
#      ``ToolMessage`` so the frontend pairs the result with the call.
#   4. After each ``TextMessageEndEvent`` — snapshot contains the
#      assistant's text response so the frontend renders the final
#      bubble.
# ---------------------------------------------------------------------------


class _MessagesSnapshotWrapper:
    """Wraps a ``StrandsAgent`` and injects ``MessagesSnapshotEvent``."""

    def __init__(self, delegate: StrandsAgent) -> None:
        self._delegate = delegate

    # Proxy attribute access to the real StrandsAgent so
    # ``create_strands_app`` and any other consumer sees the same
    # interface (name, description, config, etc.).
    def __getattr__(self, name: str) -> Any:
        return getattr(self._delegate, name)

    async def run(self, input_data: Any) -> AsyncIterator[Any]:
        """Wrap ``delegate.run()`` and inject ``MessagesSnapshotEvent``."""

        # Seed the snapshot message list from the full conversation
        # history that CopilotKit sends with every request.  This way
        # each MESSAGES_SNAPSHOT contains the *complete* thread state
        # (prior turns + whatever this turn adds), matching the
        # contract the CopilotKit frontend expects.
        messages: list[Any] = []
        if input_data.messages:
            for msg in input_data.messages:
                msg_id = getattr(msg, "id", None) or str(uuid.uuid4())
                if msg.role == "user":
                    content = (
                        msg.content
                        if isinstance(msg.content, str)
                        else str(msg.content)
                    )
                    messages.append(
                        UserMessage(id=msg_id, role="user", content=content)
                    )
                elif msg.role == "assistant":
                    tool_calls_list = None
                    if hasattr(msg, "tool_calls") and msg.tool_calls:
                        tool_calls_list = []
                        for tc in msg.tool_calls:
                            fn = tc.function if hasattr(tc, "function") else {}
                            fn_name = (
                                fn.get("name")
                                if isinstance(fn, dict)
                                else getattr(fn, "name", "unknown")
                            )
                            fn_args = (
                                fn.get("arguments")
                                if isinstance(fn, dict)
                                else getattr(fn, "arguments", "{}")
                            )
                            tool_calls_list.append(
                                ToolCall(
                                    id=tc.id,
                                    type="function",
                                    function=FunctionCall(
                                        name=fn_name or "unknown",
                                        arguments=fn_args or "{}",
                                    ),
                                )
                            )
                    content = (
                        msg.content
                        if isinstance(msg.content, str)
                        else (str(msg.content) if msg.content else "")
                    )
                    messages.append(
                        AssistantMessage(
                            id=msg_id,
                            role="assistant",
                            content=content,
                            tool_calls=tool_calls_list,
                        )
                    )
                elif msg.role == "tool":
                    content = (
                        msg.content
                        if isinstance(msg.content, str)
                        else str(msg.content)
                    )
                    messages.append(
                        ToolMessage(
                            id=msg_id,
                            role="tool",
                            content=content,
                            tool_call_id=getattr(msg, "tool_call_id", ""),
                        )
                    )

        # Track state as events flow through.
        run_started = False
        initial_snapshot_emitted = False
        current_tool_call_id: Optional[str] = None
        current_tool_call_name: Optional[str] = None
        current_tool_call_args: str = "{}"
        current_text_id: Optional[str] = None
        accumulated_text: str = ""

        async for event in self._delegate.run(input_data):
            yield event

            # Detect event types by checking the ``type`` attribute
            # (which is an ``EventType`` enum member on all AG-UI events).
            etype = getattr(event, "type", None)

            # 1. After RunStartedEvent — emit initial snapshot with user msg.
            if etype == EventType.RUN_STARTED and not run_started:
                run_started = True
                continue  # snapshot after first StateSnapshot

            # Emit the initial snapshot right after the first
            # StateSnapshotEvent (which always follows RunStartedEvent).
            if (
                etype == EventType.STATE_SNAPSHOT
                and run_started
                and not initial_snapshot_emitted
            ):
                initial_snapshot_emitted = True
                if messages:
                    yield MessagesSnapshotEvent(
                        type=EventType.MESSAGES_SNAPSHOT,
                        messages=list(messages),
                    )
                continue

            # 2. Track tool call events.
            if etype == EventType.TOOL_CALL_START:
                current_tool_call_id = getattr(event, "tool_call_id", None)
                current_tool_call_name = getattr(event, "tool_call_name", None)
                current_text_id = getattr(event, "parent_message_id", None)
                current_tool_call_args = ""
                continue

            if etype == EventType.TOOL_CALL_ARGS:
                current_tool_call_args += getattr(event, "delta", "")
                continue

            if etype == EventType.TOOL_CALL_END and current_tool_call_id:
                # Build an AssistantMessage with the tool call.
                tc = ToolCall(
                    id=current_tool_call_id,
                    type="function",
                    function=FunctionCall(
                        name=current_tool_call_name or "unknown",
                        arguments=current_tool_call_args or "{}",
                    ),
                )
                assistant_msg = AssistantMessage(
                    id=current_text_id or str(uuid.uuid4()),
                    role="assistant",
                    content="",
                    tool_calls=[tc],
                )
                messages.append(assistant_msg)
                yield MessagesSnapshotEvent(
                    type=EventType.MESSAGES_SNAPSHOT,
                    messages=list(messages),
                )
                continue

            # 3. After tool result — add ToolMessage and snapshot.
            if etype == EventType.TOOL_CALL_RESULT:
                tool_call_id = getattr(event, "tool_call_id", None)
                content = getattr(event, "content", "")
                if tool_call_id:
                    tool_msg = ToolMessage(
                        id=getattr(event, "message_id", str(uuid.uuid4())),
                        role="tool",
                        content=content or "",
                        tool_call_id=tool_call_id,
                    )
                    messages.append(tool_msg)
                    yield MessagesSnapshotEvent(
                        type=EventType.MESSAGES_SNAPSHOT,
                        messages=list(messages),
                    )
                # Reset tool tracking.
                current_tool_call_id = None
                current_tool_call_name = None
                current_tool_call_args = "{}"
                continue

            # 4. Track text message streaming.
            if etype == EventType.TEXT_MESSAGE_START:
                current_text_id = getattr(event, "message_id", None)
                accumulated_text = ""
                continue

            if etype == EventType.TEXT_MESSAGE_CONTENT:
                accumulated_text += getattr(event, "delta", "")
                continue

            if etype == EventType.TEXT_MESSAGE_END and current_text_id:
                assistant_msg = AssistantMessage(
                    id=current_text_id,
                    role="assistant",
                    content=accumulated_text,
                )
                messages.append(assistant_msg)
                yield MessagesSnapshotEvent(
                    type=EventType.MESSAGES_SNAPSHOT,
                    messages=list(messages),
                )
                current_text_id = None
                accumulated_text = ""
                continue


class _A2uiError(TypedDict):
    """Shape of the structured error dict returned by generate_a2ui branches.

    Mirrors the google-adk and langroid sibling agents' error shape — keep
    all three in sync. Every error branch MUST populate all three keys so
    callers (and the LLM summarizing the tool result) see a consistent
    surface.
    """

    error: str
    message: str
    remediation: str


# ---- Tools --------------------------------------------------------------


@tool
def get_weather(location: str):
    """Get current weather for a location.

    Args:
        location: The location to get weather for

    Returns:
        Weather information as JSON string
    """
    return json.dumps(get_weather_impl(location))


```

<IntegrationGrid path="generative-ui/tool-rendering" />
