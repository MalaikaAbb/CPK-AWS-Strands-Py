"""The agent behind every /generative-ui/components/* route.

https://docs.copilotkit.ai/strands/generative-ui/components

Agent: Strands, not the doc's BuiltInAgent. The Components and surfaces pages
print their backend only as a TanStack `BuiltInAgent` factory
(`new BuiltInAgent({ type: "tanstack", factory: ... })`), a framework-generic
agent rather than a Strands one. This harness runs its own framework's agent
in that slot: the Quickstart shape (`StrandsAgent` around a `strands.Agent`),
with no tools, because the page's factory defines none of its own, and the
factory's system prompt verbatim.

The page asks only that the agent pass the run's tools and context to its
model. `ag_ui_strands` proxies the run's `render_ui` as a client tool and
formats the run's context (the catalog guide) into the model request. Record of
the swap: README §9.35.
"""

from __future__ import annotations

from agents.chat_agents import build_chat_agent

#region genui-agent
#: The TanStack factory's own system prompt, verbatim.
GENUI_PROMPT = (
    "You are a helpful assistant. When a visual answer helps, render it with "
    "generative UI."
)


def genui_agent():
    return build_chat_agent(name="genui", system_prompt=GENUI_PROMPT)
#endregion
