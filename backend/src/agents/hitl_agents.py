"""Agents for the Human-in-the-loop sub-pages: Headless Interrupts and Governed Actions.

Headless Interrupts publishes its whole backend (`interrupt_agent.py`), which
lives verbatim in `agents/interrupt_agent.py`. The registry points at that
module directly, so nothing for that page is here.

Governed Action Approval UI publishes no backend at all: no tool that emits a
`GovernedAction`, no policy engine behind `verdict`, and no `executeSideEffect`.
Both agents below are this repo's.

  * `governed_actions_agent` backs the page's `useHumanInTheLoop` pattern. It
    is the Quickstart agent with the generic prompt. The model learns about
    `approve_governed_action` only from the frontend tool's description, which
    `ag_ui_strands` proxies onto the agent per run.
  * `governed_actions_interrupt_agent` backs the page's `useInterrupt` pattern.
    The Strands Python bridge can raise AG-UI interrupts (the Headless page's
    own agent does), so this half can be mounted. The tool, its policy and its side effect are invented: minimal and
    labelled. It pauses with `tool_context.interrupt(..., reason={"action": envelope})`.
    `ag_ui_strands` publishes that as `interrupt.metadata.reason.action`, but the
    doc's frontend reads `interrupt.metadata.action`, so the published card never
    renders. That gap is what this agent exists to show. See
    `governed-interrupt-metadata-path` in `frontend/src/lib/doc-gaps.ts`.
"""

from __future__ import annotations

import uuid
from collections.abc import Mapping

from ag_ui_strands import StrandsAgent
from strands import Agent, tool
from strands.types.tools import ToolContext

from agents.chat_agents import build_chat_agent
from agents.model import get_model

_ASSISTANT = "You are a helpful AI assistant."


#region governed-hitl-agent
def governed_actions_agent() -> StrandsAgent:
    """The Quickstart agent. The approval tool is registered by the frontend."""
    return build_chat_agent(name="governed_actions", system_prompt=_ASSISTANT)
#endregion


#region governed-interrupt-agent
# HARNESS-AUTHORED. The page publishes none of this.

#: The whole "policy engine". Every verdict the envelope can carry is reachable,
#: so all three branches of the doc's card can be exercised. The mapping is
#: arbitrary and belongs to this repo, not the doc.
_POLICY = {
    "send_email": ("require_approval", "POLICY-EMAIL-EXTERNAL-001"),
    "apply_discount": ("deny", "POLICY-DISCOUNT-CAP-002"),
    "create_ticket": ("allow", "POLICY-TICKET-OPEN-003"),
}


def _execute_side_effect(tool_name: str, arguments: Mapping) -> str:
    """Stand-in for the doc's `executeSideEffect`, which no page defines.

    Nothing is sent or written. It only reports what would have run.
    """
    return f"(simulated) executed {tool_name} with {dict(arguments)}"


@tool(context=True)
def propose_governed_action(
    action_tool: str, summary: str, arguments: dict, tool_context: ToolContext
) -> str:
    """Propose a side-effecting action and pause for the governed-action checkpoint.

    Args:
        action_tool: One of "send_email", "apply_discount", "create_ticket".
        summary: One sentence describing what the action will do.
        arguments: The exact arguments the side effect would run with.
    """
    verdict, reference = _POLICY.get(
        action_tool, ("require_approval", "POLICY-DEFAULT-000")
    )
    action = {
        "id": str(uuid.uuid4()),
        "summary": summary,
        "tool": action_tool,
        "reference": reference,
        "verdict": verdict,
        "arguments": arguments,
    }

    answer = tool_context.interrupt("governed_action", reason={"action": action})

    # `ag_ui_strands` wraps a resolved answer as {"response": ...} and a
    # cancel as {"cancelled": True}; see agents/interrupt_agent.py.
    envelope: Mapping = answer if isinstance(answer, Mapping) else {}
    if envelope.get("cancelled"):
        return f"Blocked ({verdict}, {reference}). Not executed: {summary}"
    response = envelope.get("response")
    response = response if isinstance(response, Mapping) else {}

    # The doc's `handleApproval`, translated to Python. It executes only for an
    # approved response that names this action's id and reference.
    if (
        response.get("approved")
        and response.get("actionId") == action["id"]
        and response.get("reference") == action["reference"]
    ):
        return _execute_side_effect(action_tool, arguments)
    return "skipped: The user did not approve this action."


def governed_actions_interrupt_agent() -> StrandsAgent:
    agent = Agent(
        model=get_model(),
        system_prompt=(
            f"{_ASSISTANT} Whenever the user asks you to send an email, apply a "
            "discount, or create a ticket, you MUST call "
            "`propose_governed_action` with `action_tool` set to `send_email`, "
            "`apply_discount` or `create_ticket`, a one-sentence `summary`, and "
            "the exact `arguments`. Never claim the action ran unless the tool "
            "result says it executed."
        ),
        tools=[propose_governed_action],
    )
    return StrandsAgent(agent=agent, name="governed_actions_interrupt")
#endregion
