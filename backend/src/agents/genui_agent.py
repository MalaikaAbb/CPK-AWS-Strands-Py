"""Agents behind every /generative-ui/components/* route.

https://docs.copilotkit.ai/strands/generative-ui/components

The Components and surfaces pages publish no Strands agent. Their runtime is a
TanStack `BuiltInAgent` factory (shown on the overview route, not run), and all
they ask of an existing agent is to pass the run's tools and context to its
model. `ag_ui_strands` already does both: the run's `render_ui` arrives in
`RunAgentInput.tools` and is proxied as a client tool, and the run's context
(the catalog guide) is formatted into the model request.

So these agents have no tools of their own. Repo-authored: the module, the
names, and the model (`get_model()`, like every agent here). The one
instruction is the page's own system prompt from its TanStack sample.
`genui-shop` is an identical second agent for the Transports page's
`agentIds: ["shop"]` sample.
"""

from __future__ import annotations

from ag_ui_strands import StrandsAgent
from strands import Agent

from agents.model import get_model

#region agent
#: The page's own prompt (its TanStack factory's first system prompt).
GENUI_PROMPT = (
    "You are a helpful assistant. When a visual answer helps, render it with "
    "generative UI."
)


def genui_agent() -> StrandsAgent:
    return StrandsAgent(
        agent=Agent(model=get_model(), system_prompt=GENUI_PROMPT),
        name="genui",
    )


def genui_shop_agent() -> StrandsAgent:
    return StrandsAgent(
        agent=Agent(model=get_model(), system_prompt=GENUI_PROMPT),
        name="genui-shop",
    )
#endregion
