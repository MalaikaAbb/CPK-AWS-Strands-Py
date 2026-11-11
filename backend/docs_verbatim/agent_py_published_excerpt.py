# src/agents/agent.py
import json
import logging
import os
import threading
import uuid
from collections.abc import AsyncIterator, Mapping
from contextlib import aclosing
from typing import Any, Optional

from ag_ui.core.types import Context
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
from strands.types.tools import ToolContext

# Import shared tool implementations (symlinked at project root → ../../shared/python/tools)
from tools import (
    get_weather_impl,
    query_data_impl,
    roll_dice_impl,
    schedule_meeting_impl,
    search_flights_impl,
)

from tools.todos import BoardTodoInput, manage_todos_impl

# gen-ui-agent specialization (set_steps tool + state hook + prompt addendum).
# The shared Strands backend serves every demo; this module lives in its own
# file so the gen-ui-agent surface area is reviewable in isolation, matching
# the wave-2 BYOC pattern (byoc_hashbrown.py / byoc_json_render.py).
from agents.gen_ui_agent import (
    GEN_UI_AGENT_PROMPT,
    set_steps,
    steps_state_from_args,
)

# Dynamic A2UI generation (`generate_a2ui` + its structured error shape). Its
# own module for the same reason as gen_ui_agent above — and so the docs'
# `backend-render-operations` snippet is that tool rather than all of agent.py.
from agents.a2ui_generate import generate_a2ui
from agents.todo_state_sync import TodoStateAgent, TodoStateHook

logger = logging.getLogger(__name__)


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




@tool
def roll_dice(sides: int):
    """Roll a die with the given number of sides and return the result.

    Use for any dice-rolling request (e.g. 'roll a d20' -> sides=20).

    Args:
        sides: Number of sides (e.g. 20 for a d20)

    Returns:
        Roll result as JSON string
    """
    return json.dumps(roll_dice_impl(sides))


@tool
def query_data(query: str):
    """Query financial database for chart data.

    Always call before showing a chart or graph.

    Args:
        query: Natural language query for financial data

    Returns:
        Financial data as JSON string
    """
    return json.dumps(query_data_impl(query))


# Native agent state key holding the sales pipeline. A configured Strands
# SessionManager persists ``agent.state`` with the session and restores it on
# the next agent built for the same session. The STATE_SNAPSHOT emitted by
# ``sales_state_from_args`` only carries the list to the UI.
SALES_TODOS_STATE_KEY = "todos"


def _process_sales_todos(todos: list, tool_use_id: str | None) -> list[dict]:
    """Run the shared impl, giving new items ids derived from the tool call.

    ``sales_state_from_args`` (UI snapshot, emitted before the tool runs) and
    ``manage_sales_todos`` (native state) process the same arguments
    separately. Deriving a missing id from the tool call id and position keeps
    both copies identical instead of each drawing its own random id.
    """
    if tool_use_id:
        todos = [
            {
                **todo,
                "id": str(uuid.uuid5(uuid.NAMESPACE_URL, f"{tool_use_id}/{index}")),
            }
            if isinstance(todo, dict) and not todo.get("id")
            else todo
            for index, todo in enumerate(todos)
        ]
    return [dict(todo) for todo in manage_todos_impl(todos)]


@tool(context=True)
def manage_sales_todos(todos: list[BoardTodoInput], tool_context: ToolContext):
    """Manage the sales pipeline by replacing the entire list of todos.

    CRITICAL: Read get_sales_todos first and provide the entire list, not just
    changed items. Copy every existing id exactly; omit id only for new items.
    Preserve titles, descriptions, emoji and metadata on unchanged items.
    Use status pending or completed for board tasks; do not use completed.

    Args:
        todos: The complete updated list of sales todos

    Returns:
        Success message
    """
    result = _process_sales_todos(todos, tool_context.tool_use.get("toolUseId"))
    tool_context.agent.state.set(SALES_TODOS_STATE_KEY, result)
    return f"Sales todos updated. Tracking {len(result)} item(s)."


@tool(context=True)
def get_sales_todos(tool_context: ToolContext):
    """Read the authoritative saved todo list for this conversation.

    Call before updating todos. Preserve the returned ids exactly.
    """
    return tool_context.agent.state.get(SALES_TODOS_STATE_KEY) or []


# `hitl-in-chat` registers `schedule_meeting` as a FRONTEND tool, so its async
# handler resolves only once the user picks a slot or cancels in the in-chat
# picker.
#
# This `@tool` declaration is the backend's contract with the LLM: the
# docstring and signature are what the model sees when deciding to call
# `schedule_meeting`. CopilotKit's runtime routes the call to the frontend
# handler registered with the same name, so the local
# `schedule_meeting_impl` body acts as a fallback for non-UI invocations.
#
# The interrupt demos do NOT use this tool. They run against the dedicated
# `agents/interrupt_agent.py`, whose `schedule_meeting` pauses itself with
# Strands' native `tool_context.interrupt(...)`.
@tool
def schedule_meeting(reason: str):
    """Schedule a meeting with user approval.

    Duration is intentionally defaulted in this showcase to keep the
    demo HITL flow minimal; callers only supply a reason.

    Args:
        reason: Reason for the meeting

    Returns:
        Meeting scheduling result as JSON string
    """
    return json.dumps(schedule_meeting_impl(reason))




@tool
def search_flights(flights: list[dict]):
    """Search for flights and display the results as rich cards. Return exactly 2 flights.

    Each flight must have: airline, airlineLogo, flightNumber, origin, destination,
    date (short readable format like "Tue, Mar 18" -- use near-future dates),
    departureTime, arrivalTime, duration (e.g. "4h 25m"),
    status (e.g. "On Time" or "Delayed"),
    statusColor (hex color for status dot),
    price (e.g. "$289"), and currency (e.g. "USD").

    For airlineLogo use Google favicon API:
    https://www.google.com/s2/favicons?domain={airline_domain}&sz=128

    Args:
        flights: List of flight objects

    Returns:
        Flight search results as JSON string
    """
    result = search_flights_impl(flights)
    return json.dumps(result)


@tool
def set_theme_color(theme_color: str):
    """Change the theme color of the UI.

    This is a frontend tool - it returns None as the actual
    execution happens through the frontend tool registration.

    Args:
        theme_color: The color to set as theme
    """
    return None


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


# ---- Sub-Agents demo ----------------------------------------------------
#
# A supervisor LLM (this top-level Strands Agent) delegates to three
# specialised sub-agents — research / writing / critique — exposed as
# ordinary @tool functions. Each sub-agent is a single-shot OpenAI call
# with its own system prompt; this mirrors the ``google-adk`` reference
# implementation (``subagents_agent.py``) rather than spinning up a full
# secondary Strands ``Agent`` per delegation, which is heavier than the
# demo needs.
#
# Every delegation appends a ``Delegation`` record to the per-thread
# scratchpad below, then ``subagent_state_from_result`` emits a
# ``StateSnapshotEvent`` so the UI's <DelegationLog/> reflects the new
# entry the moment the tool returns.


# Each sub-agent is a single-shot OpenAI completion driven by its own
# system prompt. They don't share memory or tools with the supervisor —
# the supervisor only sees the returned text. We keep the prompts in a
# dict (rather than spinning up a full secondary Strands ``Agent`` per
# delegation) because the demo only needs one round-trip per call.
_SUBAGENT_SYSTEM_PROMPTS: dict[str, str] = {
    "research_agent": (
        "You are a research sub-agent. Given a topic, produce a concise "
        "bulleted list of 3-5 key facts. No preamble, no closing."
    ),
    "writing_agent": (
        "You are a writing sub-agent. Given a brief and optional source "
        "facts, produce a polished 1-paragraph draft. Be clear and "
        "concrete. No preamble."
    ),
    "critique_agent": (
        "You are an editorial critique sub-agent. Given a draft, give "
        "2-3 crisp, actionable critiques. No preamble."
    ),
}


# Per-thread scratchpad of delegations. Keyed by ``thread_id``; the entry
# is the FULL ordered list of Delegation dicts the supervisor has produced
# so far in this run. ``state_from_result`` reads/writes this so it can
# return the full updated list to the UI on every delegation.
#
# Concurrency: ag_ui_strands runs one request per thread_id at a time, so
# no within-thread races. We still hold a lock so cross-thread access
# (which Python's GIL makes safe but PyPy / future GIL-removed CPython
# would not) is explicit.
_delegations_by_thread: dict[str, list[dict]] = {}
_delegations_lock = threading.Lock()


def _seed_delegations_from_state(thread_id: str, state) -> list[dict]:
    """Initialise the per-thread scratchpad from the inbound state.

    Called lazily from each delegation tool. The frontend persists
    ``state["delegations"]`` across runs through its agent store, so a
    multi-turn conversation should APPEND to the prior list rather than
    overwriting it.
    """
    with _delegations_lock:
        if thread_id in _delegations_by_thread:
            return _delegations_by_thread[thread_id]
        seeded: list[dict] = []
        if isinstance(state, dict):
            existing = state.get("delegations")
            if isinstance(existing, list):
                seeded = [dict(d) for d in existing if isinstance(d, dict)]
        _delegations_by_thread[thread_id] = seeded
        return seeded


# Internal marker prepended to a sub-agent tool result when the underlying
# call failed. ``_make_subagent_state_from_result`` detects this prefix and
# records the Delegation entry with ``status: "failed"`` instead of
# "completed".
#
# Why a sentinel rather than `result_text.startswith("Error:")`?
#  - Strands wraps tool exceptions into a result whose first content item
#    text *does* start with "Error: " (see strands/tools/decorator.py and
#    strands/tools/executors/_executor.py), but ag_ui_strands' result
#    extraction (agent.py around line 654) only forwards the inner text /
#    parsed-JSON to ``state_from_result`` — the canonical
#    ``tool_result["status"] == "error"`` signal is dropped before our hook
#    sees it. That makes a string-prefix check fragile (e.g. cancellation
#    text "Tool cancelled by user", "Unknown tool: ..." don't start with
#    "Error:") and couples our success/failure classification to Strands'
#    error-text formatting, which is internal API.
#  - Catching the failure inside ``_run_subagent`` lets us classify before
#    Strands' wrapper ever runs, so the surface is fully under our control.
#  - Class-name-only message avoids leaking ``repr(exc)`` (which can
#    contain provider-specific error bodies, request IDs, etc.) into the UI.
_SUBAGENT_FAILURE_MARKER = "__SUBAGENT_FAILED__:"
# Sentinel for the legitimately-empty completion case. The sub-agent
# returned successfully but produced no content; we still want a
# "completed" Delegation entry rather than a confusing failure row, so we
# substitute a human-readable placeholder instead of raising.
_SUBAGENT_EMPTY_RESULT_TEXT = "(sub-agent returned no content)"


def _invoke_subagent_llm(system_prompt: str, task: str) -> str:
    """Run a single-shot OpenAI completion as a sub-agent.

    Raises ``RuntimeError`` only on transport / API failures. A successful
    call that legitimately returns empty content is logged at INFO and
    surfaced as a placeholder string rather than an exception, so the
    Delegation entry shows as "completed" with a clear message instead of
    the misleading "failed" status the previous "empty text" raise produced.
    """
    import openai as _openai_mod
    import httpx as _httpx_mod

    try:
        client = _openai_mod.OpenAI()
        response = client.chat.completions.create(
            reasoning_effort="none",
            model="gpt-6-luna",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": task},
            ],
        )
    except (_openai_mod.OpenAIError, _httpx_mod.HTTPError) as exc:
        logger.exception("sub-agent: OpenAI call failed")
        raise RuntimeError(f"sub-agent call failed: {exc.__class__.__name__}") from exc

    if not response.choices:
        raise RuntimeError("sub-agent returned no choices")
    content = response.choices[0].message.content or ""
    text = content.strip()
    if not text:
        logger.info(
            "sub-agent: OpenAI completion returned empty content; "
            "surfacing placeholder rather than failure"
        )
        return _SUBAGENT_EMPTY_RESULT_TEXT
    return text


def _run_subagent(name: str, task: str) -> str:
    """Tool body shared by all three subagent tools.

    Catches ``RuntimeError`` from ``_invoke_subagent_llm`` and converts the
    failure into a sentinel-prefixed string carrying only the exception
    class name. ``_make_subagent_state_from_result`` recognizes the
    sentinel and records ``status: "failed"`` on the Delegation entry.

    This intercepts the exception *before* Strands' tool-decorator wraps
    it into a generic ``status: "error"`` ToolResult — that wrapper format
    is internal API and is flattened by ag_ui_strands before reaching our
    state hook, so we cannot reliably read it from ``result_data`` alone.
    Doing the classification here keeps the failure signal end-to-end
    explicit.
    """
    system_prompt = _SUBAGENT_SYSTEM_PROMPTS[name]
    try:
        return _invoke_subagent_llm(system_prompt, task)
    except RuntimeError as exc:
        # Class-name only — never the message — to avoid leaking provider
        # error bodies, request IDs, or stack traces into the UI.
        return f"{_SUBAGENT_FAILURE_MARKER}{exc.__class__.__name__}"


# Each @tool wraps a sub-agent invocation. The supervisor LLM "calls"
# these tools to delegate work; ``_run_subagent`` synchronously runs the
# matching sub-agent (a single-shot OpenAI completion), and the result
# string is returned to the supervisor as the tool result. The matching
# ``ToolBehavior(state_from_result=...)`` hook on each tool (registered
# in ``build_showcase_agent``) appends a Delegation entry to shared
# state so the UI's <DelegationLog/> reflects the call in real time.
@tool
def research_agent(task: str) -> str:
    """Delegate a research task to the research sub-agent.

    Use for: gathering facts, background, definitions, statistics.
    Returns a bulleted list of key facts as plain text.

    Args:
        task: The research brief to hand off.
    """
    return _run_subagent("research_agent", task)


@tool
def writing_agent(task: str) -> str:
    """Delegate a drafting task to the writing sub-agent.

    Use for: producing a polished paragraph, draft, or summary. Pass
    relevant facts from prior research inside ``task``.

    Args:
        task: The writing brief to hand off.
    """
    return _run_subagent("writing_agent", task)


@tool
def critique_agent(task: str) -> str:
    """Delegate a critique task to the critique sub-agent.

    Use for: reviewing a draft and suggesting concrete improvements.

    Args:
        task: The draft to critique.
    """
    return _run_subagent("critique_agent", task)


