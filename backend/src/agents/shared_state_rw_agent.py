"""Agent behind /shared-state (the `shared-state-read-write` demo).

https://docs.copilotkit.ai/strands/shared-state

The page has no embedded demo and skips its Strands backend ("shared-state-setup
is not bundled for strands"); its snippets are cut from the showcase's
`shared-state-read-write` frontend. Everything inside
`#region borrowed-from-showcase` is **borrowed from CopilotKit's GitHub
showcase** (`showcase/integrations/strands/src/agents/agent.py`, the module
the docs' demo Code tabs ship), verbatim:

  * `set_notes` + `notes_state_from_args` — the agent writes `state["notes"]`
    and a `ToolBehavior(state_from_args=…)` hook emits it;
  * `_format_preferences_block` + `with_state_context` + `_StateContextWrapper`
    — the UI's `agent.setState({ preferences })` is copied into transient
    request context every turn (the Strands stand-in for the
    `PreferencesInjectorMiddleware` the page's comment names).

Repo-authored: the builder (model via `get_model()`, a prompt made of the two
showcase prompt lines about notes and preferences, the name).
"""

from __future__ import annotations

import json
import logging
from collections.abc import AsyncIterator
from contextlib import aclosing
from typing import Any, Optional

from ag_ui.core.types import Context
from ag_ui_strands import StrandsAgent, StrandsAgentConfig, ToolBehavior
from strands import Agent, tool

from agents.model import get_model

logger = logging.getLogger(__name__)


#region borrowed-from-showcase
class _StateContextWrapper:
    """Add transient state context and preserve the adapter's event stream."""

    def __init__(self, delegate: StrandsAgent) -> None:
        self._delegate = delegate

    def __getattr__(self, name: str) -> Any:
        return getattr(self._delegate, name)

    async def run(self, input_data: Any) -> AsyncIterator[Any]:
        # The adapter owns snapshots, including unfinished parallel calls.
        async with aclosing(
            self._delegate.run(with_state_context(input_data))
        ) as events:
            async for event in events:
                yield event


# ---- Shared State (Read + Write) demo ----------------------------------
#
# The frontend's `shared-state-read-write` page writes a `preferences`
# object into agent state via `agent.setState()`. ``with_state_context``
# copies it from ``input_data.state`` into transient request context so
# the LLM sees the user's preferred name / tone / language / interests on
# every turn. The agent in turn uses ``set_notes`` to mutate
# ``state["notes"]``; ``notes_state_from_args`` emits a ``StateSnapshotEvent``
# so the UI re-renders the notes panel as soon as the tool fires.


@tool
def set_notes(notes: list[str]):
    """Replace the notes array in shared state with the full updated list.

    Use this whenever the user asks you to remember something, or when
    you have an observation about the user worth surfacing in the UI's
    notes panel. ALWAYS pass the FULL notes list (existing notes + any
    new ones), not a diff. Keep each note short (< 120 chars).

    Args:
        notes: The complete updated list of short note strings.

    Returns:
        Confirmation string for the LLM to summarise back to the user.
    """
    return f"Notes updated. Tracking {len(notes)} note(s)."


async def notes_state_from_args(context):
    """Emit a StateSnapshotEvent for the ``notes`` slot when ``set_notes`` fires.

    Mirrors ``sales_state_from_args`` shape — accept str-or-dict tool
    input, validate, return a snapshot dict for ag_ui_strands to publish.
    """
    raw_input = getattr(context, "tool_input", None)
    if raw_input is None:
        logger.warning("notes_state_from_args: context has no tool_input")
        return None

    tool_input = raw_input
    if isinstance(tool_input, str):
        try:
            tool_input = json.loads(tool_input)
        except json.JSONDecodeError as exc:
            logger.warning(
                "notes_state_from_args: malformed JSON tool input (%s); input excerpt: %s",
                exc,
                repr(raw_input)[:200],
            )
            return None

    if isinstance(tool_input, dict):
        notes_data = tool_input.get("notes")
    elif isinstance(tool_input, list):
        notes_data = tool_input
    else:
        logger.warning(
            "notes_state_from_args: unsupported tool_input type %s",
            type(tool_input).__name__,
        )
        return None

    if not isinstance(notes_data, list):
        return None

    cleaned: list[str] = []
    for n in notes_data:
        if isinstance(n, str):
            cleaned.append(n)
        else:
            cleaned.append(str(n))
    return {"notes": cleaned}


def _format_preferences_block(prefs: dict) -> Optional[str]:
    """Render the UI-supplied preferences as a system-style block.

    Returns ``None`` when the dict is empty so the caller can skip
    injection entirely. Mirrors ``langgraph-python``'s
    ``PreferencesInjectorMiddleware._build_prefs_message`` shape.
    """
    if not isinstance(prefs, dict) or not prefs:
        return None
    lines: list[str] = []
    if prefs.get("name"):
        lines.append(f"- Name: {prefs['name']}")
    if prefs.get("tone"):
        lines.append(f"- Preferred tone: {prefs['tone']}")
    if prefs.get("language"):
        lines.append(f"- Preferred language: {prefs['language']}")
    interests = prefs.get("interests") or []
    if isinstance(interests, list) and interests:
        lines.append(f"- Interests: {', '.join(str(i) for i in interests)}")
    if not lines:
        return None
    return (
        "The user has shared these preferences with you:\n"
        + "\n".join(lines)
        + "\nTailor every response to these preferences. Address the user "
        "by name when appropriate."
    )


def with_state_context(input_data):
    """Copy current UI state into transient AG-UI context, preserving user text.

    The adapter supplies context during model calls and restores native history
    afterward, including tool continuations. Never use state_context_builder to
    prepend application instructions to durable user messages.
    """
    context = list(input_data.context)
    state = input_data.state
    if isinstance(state, dict):
        preferences = _format_preferences_block(state.get("preferences") or {})
        if preferences:
            context.append(
                Context(description="Current user preferences", value=preferences)
            )
        if "todos" in state:
            context.append(
                Context(
                    description="Current sales pipeline",
                    value=json.dumps(state["todos"], indent=2),
                )
            )
    return input_data.model_copy(update={"context": context})
#endregion


#region builder
#: The two lines of the showcase's all-demos SYSTEM_PROMPT that concern this demo.
SHARED_STATE_PROMPT = (
    "You are a helpful AI assistant.\n"
    "- Remember things the user tells you by calling `set_notes` with the FULL "
    "updated list of short note strings (existing notes + new). The UI "
    "renders these in a notes panel.\n"
    "When the user shares preferences (name, tone, language, interests), they will be "
    "supplied in a system-style block at the top of every turn — respect them.\n"
)


def build_shared_state_rw_agent() -> Any:
    """Repo-authored: one tool, its state hook, the preferences context wrapper."""
    agent = StrandsAgent(
        agent=Agent(model=get_model(), system_prompt=SHARED_STATE_PROMPT, tools=[set_notes]),
        name="shared-state-read-write",
        config=StrandsAgentConfig(
            tool_behaviors={
                "set_notes": ToolBehavior(state_from_args=notes_state_from_args),
            },
        ),
    )
    return _StateContextWrapper(agent)
#endregion
