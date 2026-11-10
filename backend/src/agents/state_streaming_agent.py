"""Agent behind /generative-ui/state-rendering (the `shared-state-streaming` demo).

https://docs.copilotkit.ai/strands/generative-ui/state-rendering

The page skips its backend for Strands ("state-streaming-setup is not bundled
for strands", and the `state-streaming-middleware` region is missing). The
pieces below are **borrowed from CopilotKit's GitHub showcase**
(`showcase/integrations/strands/src/agents/agent.py`, the same module the
docs' demo Code tabs ship), not from the page:

  * `write_document` and `document_state_from_args`, verbatim inside
    `#region borrowed-from-showcase`;
  * the `ToolBehavior(state_from_args=document_state_from_args)` wiring the
    showcase's `build_showcase_agent` registers for it.

Its own comment says it plainly: Strands updates state from the *complete*
tool args, not per token, so the document lands whole when the tool call
finishes rather than streaming in as the page describes.

Repo-authored: the builder below (model via `get_model()`, a one-paragraph
system prompt instead of the showcase's all-demos prompt, and the name).
"""

from __future__ import annotations

import json
import logging

from ag_ui_strands import StrandsAgent, StrandsAgentConfig, ToolBehavior
from strands import Agent, tool

from agents.model import get_model

logger = logging.getLogger(__name__)


#region borrowed-from-showcase
# ---- Shared State (Streaming) demo --------------------------------------
#
# The shared-state-streaming demo writes a document into ``state["document"]``
# via a ``write_document`` tool; the frontend subscribes to state changes and
# renders ``state.document`` live. Mirrors langgraph-python's
# ``StateStreamingMiddleware`` target. Strands updates state from the complete
# tool args (not per-token), which the d5 probe tolerates — it only asserts the
# document grew substantively after settle, not mid-stream chunking.


@tool
def write_document(document: str):
    """Write a document for the user.

    Call this whenever the user asks you to write, draft, or revise any
    piece of text (a poem, email, essay, summary, etc.). Pass the FULL
    content as a single string in the ``document`` argument — the document
    lives in shared state and the UI renders it live; never paste it into a
    chat message.

    Args:
        document: The full document content as a single string.

    Returns:
        Confirmation string for the LLM to summarise back to the user.
    """
    return "Document written to shared state."


async def document_state_from_args(context):
    """Emit a StateSnapshotEvent for the ``document`` slot when
    ``write_document`` fires. Accepts str-or-dict tool input, mirrors
    ``notes_state_from_args`` shape."""
    raw_input = getattr(context, "tool_input", None)
    if raw_input is None:
        logger.warning("document_state_from_args: context has no tool_input")
        return None

    tool_input = raw_input
    if isinstance(tool_input, str):
        try:
            tool_input = json.loads(tool_input)
        except json.JSONDecodeError as exc:
            logger.warning(
                "document_state_from_args: malformed JSON tool input (%s); input excerpt: %s",
                exc,
                repr(raw_input)[:200],
            )
            return None

    if isinstance(tool_input, dict):
        document = tool_input.get("document")
    elif isinstance(tool_input, str):
        document = tool_input
    else:
        logger.warning(
            "document_state_from_args: unsupported tool_input type %s",
            type(tool_input).__name__,
        )
        return None

    if not isinstance(document, str) or not document:
        return None
    return {"document": document}
#endregion


#region builder
def build_state_streaming_agent() -> StrandsAgent:
    """Repo-authored: one tool, its state hook, and a short prompt."""
    agent = Agent(
        model=get_model(),
        system_prompt=(
            "You are a collaborative writing assistant. Whenever the user asks "
            "you to write, draft, or revise any text, call write_document with "
            "the full content. Never paste the document into a chat message."
        ),
        tools=[write_document],
    )
    return StrandsAgent(
        agent=agent,
        name="shared-state-streaming",
        config=StrandsAgentConfig(
            tool_behaviors={
                "write_document": ToolBehavior(
                    state_from_args=document_state_from_args,
                ),
            },
        ),
    )
#endregion
