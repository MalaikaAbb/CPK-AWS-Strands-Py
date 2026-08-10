"""The one agent the Strands docs wire to shared state.

`in-app-agent-read` and `in-app-agent-write` print the same `agent/main.py`, and
it is the only Strands backend on any page that does more than the Quickstart:
it passes a `StrandsAgentConfig(state_context_builder=...)` so the value the UI
writes with `agent.setState({ language })` is folded into the prompt on every
turn.

Reproduced as printed, with two deviations, both forced:

  * the snippet calls `os.getenv` without importing `os`, so the import is
    added here — otherwise the module does not load;
  * `model_id="gpt-4o"` becomes `get_model()`, which is the same call with the
    id read from `MODEL_ID`. See `agents/model.py` for why.

Nothing else here is this repo's. In particular there is no tool that writes
`language` back, because the docs never show one — shared state on this page is
UI-writes / agent-reads only, which is exactly what the two pages demonstrate.

Doc gap worth knowing before you test: the read page's frontend calls
`useAgent({ agentId: "strands_agent" })` while the backend on the same page
names the agent `languageAgent`, which is the id the *write* page's frontend
uses. Copied literally, the read page addresses an agent that page never
defines. This harness mounts it once, under `shared-state-language`, and both
routes point there.
"""

from __future__ import annotations

import os  # noqa: F401 -- the doc snippet uses os.getenv without importing it

from ag_ui_strands import StrandsAgent, StrandsAgentConfig

from agents.model import get_model
from strands import Agent

#region language-agent
_SYSTEM_PROMPT = (
    "Always communicate in the preferred language of the user as defined in "
    "your state. Do not communicate in any other language."
)


# Inject state into the prompt
def language_prompt(input_data, user_message: str) -> str:
    state_dict = getattr(input_data, "state", None)
    if isinstance(state_dict, dict) and "language" in state_dict:
        return f"Current language: {state_dict['language']}\n\nUser request: {user_message}"
    return user_message


def shared_state_language_agent() -> StrandsAgent:
    # Create the Strands agent
    strands_agent = Agent(
        model=get_model(),
        system_prompt=_SYSTEM_PROMPT,
    )

    config = StrandsAgentConfig(state_context_builder=language_prompt)

    # Wrap with AG-UI integration
    return StrandsAgent(
        agent=strands_agent,
        name="languageAgent",
        description="Always communicate in the preferred language of the user",
        config=config,
    )
#endregion
