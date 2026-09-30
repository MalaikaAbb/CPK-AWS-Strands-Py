"""Agents for the two runtime-middleware Generative UI pages.

Neither page publishes an agent:

  * **Open Generative UI** — the runtime snippet registers `agents` and names
    two ids, `open-gen-ui` and `open-gen-ui-advanced`, but never shows what is
    behind them. The `generateSandboxedUi` tool the model has to call is a
    *frontend* tool the `<CopilotKit>` provider registers when
    `openGenerativeUI` is active, so it reaches the Strands agent through the
    same proxied-tool channel every `useFrontendTool` route in this repo uses.
  * **MCP Apps** — the runtime snippet names one agent, `mcp-apps`, and again
    shows nothing behind it. `MCPAppsMiddleware` appends the MCP server's UI
    tools to the run's `tools` list, so they reach the agent the same way.

So every agent here is the Quickstart shape with the Quickstart prompt. No
page-specific instruction is added: writing one would be supplying the half
the doc left out, and it would also mask whether the injected tool
descriptions (plus, for Open Generative UI, the design skill the provider
adds to context) are enough on their own to make the model call the tool.
"""

from __future__ import annotations

from ag_ui_strands import StrandsAgent

from agents.chat_agents import build_chat_agent

#: The Quickstart's system prompt, unchanged.
_ASSISTANT = "You are a helpful AI assistant."


#region open-gen-ui-agents
def open_gen_ui_agent() -> StrandsAgent:
    """Behind the page's `open-gen-ui` id. Not published — Quickstart shape."""
    return build_chat_agent(name="open_gen_ui", system_prompt=_ASSISTANT)


def open_gen_ui_advanced_agent() -> StrandsAgent:
    """Behind `open-gen-ui-advanced`. Not published — Quickstart shape.

    The sandbox functions are host-page bridges, not agent tools; the model
    only learns about them from the context the provider injects.
    """
    return build_chat_agent(name="open_gen_ui_advanced", system_prompt=_ASSISTANT)
#endregion


#region mcp-apps-agent
def mcp_apps_agent() -> StrandsAgent:
    """Behind the page's `mcp-apps` id. Not published — Quickstart shape.

    Carries no tools of its own: the Excalidraw `create_view` tool is added to
    each run by the runtime's MCP Apps middleware, and executed there too.
    """
    return build_chat_agent(name="mcp_apps", system_prompt=_ASSISTANT)
#endregion
