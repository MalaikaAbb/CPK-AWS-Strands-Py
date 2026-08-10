"""The one backend tool this harness runs, and the half of it the docs omit.

`get_weather` below is reproduced exactly as the Strands Tool Call Rendering
page prints it — decorator, signature, docstring, body. That page is the only
one in the Strands tree that shows a backend tool at all.

Its body calls `get_weather_impl`, which the page imports from a `tools` module
a comment locates at `../../shared/python/tools` — outside anything the docs
ship. Every `@tool` in the published `agent.py` delegates to one of those
`_impl` functions, so none of them can execute as published.

`get_weather_impl` here is lifted from the **Google ADK** version of the same
doc page, which prints the payload inline instead of behind an `_impl`
indirection:

    def get_weather(tool_context: ToolContext, location: str) -> dict:
        return {"city": location, "temperature": 68, "humidity": 55,
                "wind_speed": 10, "conditions": "Sunny"}

Those five keys are exactly the ones the Strands page's own frontend renderer
reads (`parsed.city`, `.temperature`, `.humidity`, `.wind_speed`,
`.conditions`), so the shape is confirmed by published Strands code even though
the values are not. Nothing here is invented; it is doc code from a sibling
framework's page, which is why it lives in its own file rather than inside
`chat_agents.py`.

Still undocumented, and worth knowing before you copy this file:

  * **No Strands page passes `tools=` to a Strands `Agent`.** The published
    `agent.py` hands its `@tool`s to a `build_showcase_agent(...)` that is
    never printed. `chat_agents.tool_rendering_agent` does the obvious thing —
    `Agent(model=…, system_prompt=…, tools=[get_weather])` — which is standard
    Strands SDK, not a CopilotKit API. The composition is this repo's.
  * **`search_flights` has no backend here.** The Tool Call Rendering page
    registers a renderer for it on the frontend and never shows a matching
    tool; its `@tool` in the published excerpt delegates to another unpublished
    `_impl`. That renderer stays unexercised.
"""

from __future__ import annotations

import json

from strands import tool

#region get-weather-impl
def get_weather_impl(location: str) -> dict:
    """The payload the Google ADK page returns inline. See module docstring."""
    return {
        "city": location,
        "temperature": 68,
        "humidity": 55,
        "wind_speed": 10,
        "conditions": "Sunny",
    }
#endregion


#region get-weather-tool
@tool
def get_weather(location: str):
    """Get current weather for a location.

    Args:
        location: The location to get weather for

    Returns:
        Weather information as JSON string
    """
    return json.dumps(get_weather_impl(location))
#endregion
