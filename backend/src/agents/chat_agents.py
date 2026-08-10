"""Every agent this server can build from published Strands code.

There is exactly one documented way to stand up a Strands agent behind AG-UI,
and it is the Quickstart's four lines:

    agent = Agent(model=model, system_prompt=...)
    agui_agent = StrandsAgent(agent=agent, name=...)
    app = create_strands_app(agui_agent, "/")

`build_chat_agent` is that shape with the system prompt lifted out, because a
dozen routes in this harness differ only on the frontend and would otherwise
repeat the same literal a dozen times.

**Almost no tools, and that is the docs' doing.** No page under
docs.copilotkit.ai/strands passes `tools=` to a Strands `Agent`. The published
`src/agents/agent.py` excerpt (see `backend/docs_verbatim/`) declares fourteen
`@tool` functions and then hands them to a `build_showcase_agent(...)` that is
never printed, so the step that would connect a tool to an agent is missing
from the docs. Rather than invent that step, agents here are tool-free and each
affected route carries a Doc gap panel naming what is missing. See README §9.

Two agents carry tools. `tool_rendering_agent` has the `get_weather` declared
in `agents/doc_tools.py`, and `subagents_agent` has the three delegation tools
from `agents/subagents.py` — both lifted from doc pages. The `tools=[…]` wiring
that attaches them is undocumented either way; each module's docstring says
exactly what was taken and what is still missing.
"""

from __future__ import annotations

from ag_ui_strands import (
    StrandsAgent,
    ToolBehavior,
    StrandsAgentConfig
)
from strands import Agent

from agents.doc_tools import get_weather
from agents.model import get_model
from agents.subagents import critique_agent, research_agent, writing_agent, _make_subagent_state_from_result

#region builder
def build_chat_agent(*, name: str, system_prompt: str) -> StrandsAgent:
    """The Quickstart's agent, parameterised by name and system prompt."""
    agent = Agent(
        model=get_model(),
        system_prompt=system_prompt,
    )
    return StrandsAgent(
        agent=agent,
        name=name,
    )
#endregion


#region quickstart
#: The Quickstart's own agent, prompt and name untouched.
#: https://docs.copilotkit.ai/strands/quickstart?agent=bring-your-own
def quickstart_agent() -> StrandsAgent:
    agent = Agent(
        model=get_model(),
        system_prompt="You are a helpful AI assistant.",
    )
    return StrandsAgent(
        agent=agent,
        name="strands_agent",
    )
#endregion


_ASSISTANT = "You are a helpful AI assistant."

# The prompts below are this repo's, not the docs'. They exist only so a
# reviewer opening two prebuilt-component routes can tell which surface they
# are looking at from the agent's first reply.

def prebuilt_chat_agent() -> StrandsAgent:
    return build_chat_agent(
        name="agentic_chat",
        system_prompt=(
            f"{_ASSISTANT} You are mounted inside an inline <CopilotChat> pane. "
            "If asked which chat surface you are running in, say so."
        ),
    )


def prebuilt_sidebar_agent() -> StrandsAgent:
    return build_chat_agent(
        name="prebuilt_sidebar",
        system_prompt=(
            f"{_ASSISTANT} You are mounted inside a docked <CopilotSidebar>. "
            "If asked which chat surface you are running in, say so."
        ),
    )


def prebuilt_popup_agent() -> StrandsAgent:
    return build_chat_agent(
        name="prebuilt_popup",
        system_prompt=(
            f"{_ASSISTANT} You are mounted inside a floating <CopilotPopup>. "
            "If asked which chat surface you are running in, say so."
        ),
    )


def chat_controls_agent() -> StrandsAgent:
    return build_chat_agent(
        name="chat_controls",
        system_prompt=(
            f"{_ASSISTANT} Keep answers to two or three sentences so the "
            "thumbs-up / thumbs-down toolbar is easy to reach."
        ),
    )


def css_agent() -> StrandsAgent:
    return build_chat_agent(
        name="chat_customization_css",
        system_prompt=(
            f"{_ASSISTANT} Answer in short paragraphs and use markdown "
            "(headings, lists, inline code) so the CSS overrides have "
            "something to style."
        ),
    )


def slots_agent() -> StrandsAgent:
    return build_chat_agent(name="chat_slots", system_prompt=_ASSISTANT)


def headless_simple_agent() -> StrandsAgent:
    return build_chat_agent(name="headless_simple", system_prompt=_ASSISTANT)


def headless_complete_agent() -> StrandsAgent:
    return build_chat_agent(name="headless_complete", system_prompt=_ASSISTANT)


def multimodal_agent() -> StrandsAgent:
    return build_chat_agent(
        name="multimodal",
        system_prompt=(
            f"{_ASSISTANT} Users may attach images, audio, video or documents. "
            "Describe what you actually received; if a part came through in a "
            "form you cannot read, say that plainly instead of guessing."
        ),
    )


def voice_agent() -> StrandsAgent:
    return build_chat_agent(
        name="voice_demo",
        system_prompt=(
            f"{_ASSISTANT} Your input is often a speech transcript, so expect "
            "disfluencies and mis-heard words. Answer in one or two sentences."
        ),
    )


def tool_based_agent() -> StrandsAgent:
    return build_chat_agent(name="gen_ui_tool_based", system_prompt=_ASSISTANT)


#region tool-rendering-agent
def tool_rendering_agent() -> StrandsAgent:
    """The one agent here with a backend tool.

    `build_chat_agent` cannot express this, because nothing in the Strands docs
    shows `tools=` on a Strands `Agent` — so the Quickstart's shape is spelled
    out longhand with the one addition made visible.
    """
    agent = Agent(
        model=get_model(),
        system_prompt=(
            f"{_ASSISTANT} You can look up current weather with the "
            "get_weather tool. Call it whenever the user asks about weather in "
            "a place, and let the tool result speak for itself rather than "
            "restating every number back to them."
        ),
        tools=[get_weather],
    )
    return StrandsAgent(
        agent=agent,
        name="tool_rendering",
    )
#endregion


def display_only_agent() -> StrandsAgent:
    return build_chat_agent(name="gen_ui_display_only", system_prompt=_ASSISTANT)


def interactive_agent() -> StrandsAgent:
    return build_chat_agent(name="gen_ui_interactive", system_prompt=_ASSISTANT)


def a2ui_fixed_agent() -> StrandsAgent:
    return build_chat_agent(name="a2ui_fixed_schema", system_prompt=_ASSISTANT)


def declarative_gen_ui_agent() -> StrandsAgent:
    return build_chat_agent(name="declarative_gen_ui", system_prompt=_ASSISTANT)


def frontend_tools_agent() -> StrandsAgent:
    return build_chat_agent(name="frontend_tools", system_prompt=_ASSISTANT)


def hitl_agent() -> StrandsAgent:
    return build_chat_agent(name="hitl_in_chat", system_prompt=_ASSISTANT)


def programmatic_control_agent() -> StrandsAgent:
    return build_chat_agent(
        name="programmatic_control",
        system_prompt=(
            f"{_ASSISTANT} Runs reach you from buttons and code rather than a "
            "composer. Answer at whatever length the request asks for."
        ),
    )


def readonly_state_agent_context_agent() -> StrandsAgent:
    return build_chat_agent(name="readonly_state_agent_context", system_prompt=_ASSISTANT)


def shared_state_read_write_agent() -> StrandsAgent:
    return build_chat_agent(name="shared_state_read_write", system_prompt=_ASSISTANT)


#region subagents-agent
def subagents_agent() -> StrandsAgent:


    
    """The supervisor, carrying the three published delegation tools.

    The tools, their sub-agent prompts and the whole `_run_subagent` /
    `_invoke_subagent_llm` path come from `agents/subagents.py`, which is the
    doc excerpt verbatim. Two things here are not the docs':

      * `tools=[…]` — no Strands page attaches a tool to a Strands `Agent`.
      * the supervisor's system prompt — the page never prints one, and
        without instructions the model answers directly instead of
        delegating, so the demo has nothing to show.

    Still missing, and not reconstructed: the
    `ToolBehavior(state_from_result=…)` hook that would write
    `state["delegations"]`. Delegation runs; the live log does not fill in.
    """


    shared_state_config = StrandsAgentConfig(
        tool_behaviors={
            "research_agent": ToolBehavior(
                state_from_result=_make_subagent_state_from_result("research_agent"),
            ),
            "writing_agent": ToolBehavior(
                state_from_result=_make_subagent_state_from_result("writing_agent"),
            ),
            "critique_agent": ToolBehavior(
                state_from_result=_make_subagent_state_from_result("critique_agent"),
            ),
        },
    )

    agent = Agent(
        model=get_model(),
        system_prompt=(
            "You are a supervisor agent. You do not answer substantive "
            "requests yourself — you delegate, then synthesise.\n\n"
            "For any request to research, write, draft or review something, "
            "run this sequence, calling each tool EXACTLY ONCE:\n"
            "  1. research_agent — gather the facts.\n"
            "  2. writing_agent — draft from those facts; pass them in the "
            "task string, since sub-agents share no memory with you.\n"
            "  3. critique_agent — review the draft.\n\n"
            "Then reply with the final draft and a one-line note on what the "
            "critique asked for. If a tool result begins with "
            "'__SUBAGENT_FAILED__:', say plainly that that sub-agent failed "
            "and carry on with the others — never invent its output."
        ),
        tools=[research_agent, writing_agent, critique_agent],
    )
    return StrandsAgent(
        agent=agent,
        name="subagents",
        config=shared_state_config,
    )
#endregion


def agent_config_agent() -> StrandsAgent:
    return build_chat_agent(name="agent_config", system_prompt=_ASSISTANT)
