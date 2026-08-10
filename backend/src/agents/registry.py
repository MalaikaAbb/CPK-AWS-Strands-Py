"""The single list of agents this server exposes.

The key is both the AG-UI agent id the frontend addresses and the path the
agent is mounted at, so `agentId="tool-rendering"` in a React component
resolves to `http://localhost:8000/tool-rendering/` with nothing in between to
keep in sync.

`gaps` names, per agent, the pieces the Strands docs do not publish, and is
served at `GET /gaps`. Read it as a record of what is missing from the docs,
not as a verdict on the route: several agents whose pages publish no backend at
all work fine anyway, because `ag_ui_strands` proxies client-registered tools
without any agent-side wiring. The frontend keeps its own list in
`lib/doc-gaps.ts` for the in-app panels; the two need not match.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Callable

from ag_ui_strands import StrandsAgent

from agents import chat_agents
from agents.language_agent import shared_state_language_agent

#: Reusable gap descriptions. Each string is a fact about the docs, not about
#: this repo — if a doc page starts publishing the missing half, delete the
#: entry here and the panel disappears from the route.
NO_TOOL_WIRING = (
    "No Strands page passes `tools=` to a Strands `Agent`. The published "
    "`src/agents/agent.py` declares the `@tool` functions and then hands them "
    "to `build_showcase_agent(...)`, which is never printed — so the step that "
    "attaches a tool to an agent is missing. `tool_rendering_agent` spells it "
    "out itself with plain Strands SDK; every other agent is tool-free."
)
UNPUBLISHED_TOOLS_MODULE = (
    "Every published `@tool` body delegates to an `_impl` function imported "
    "from a `tools` module a comment locates at `../../shared/python/tools`, "
    "outside anything the docs ship. `get_weather_impl` here is lifted from "
    "the Google ADK version of the same page — see `agents/doc_tools.py`."
)
SETUP_SKIPPED = (
    "This doc page emits `<!-- setup skipped: … is not bundled for strands -->` "
    "where the same page for other frameworks prints a backend snippet. There "
    "is no published Strands backend for it."
)
NO_FRONTEND_TOOL_CHANNEL = (
    "Nothing documents how CopilotKit's frontend-tool channel reaches a Strands "
    "agent. Google ADK has `AGUIToolset()`; the Strands equivalent, if one "
    "exists, is not on any page."
)
NO_STATE_FROM_RESULT = (
    "`ToolBehavior` is imported by the published `agent.py` but never "
    "constructed, so the `ToolBehavior(state_from_result=…)` binding that turns "
    "a tool call into a `StateSnapshotEvent` is undocumented. The "
    "`*_state_from_args` hooks are published; the wiring is not."
)
NO_A2UI_BACKEND = (
    "`build_a2ui_operations_from_tool_call` is imported from an unpublished "
    "`tools` module, and the `generate_a2ui` tool that calls it is never "
    "attached to an agent."
)


@dataclass(frozen=True)
class RegisteredAgent:
    """An agent factory, the doc page it serves, and what the docs omit."""

    build: Callable[[], StrandsAgent]
    doc: str
    gaps: tuple[str, ...] = field(default=())


#region registry
REGISTRY: dict[str, RegisteredAgent] = {
    # --- Getting started -------------------------------------------------
    # The Quickstart's agent, verbatim. The only fully documented route.
    "strands_agent": RegisteredAgent(
        chat_agents.quickstart_agent,
        "/strands/quickstart?agent=bring-your-own",
    ),

    # --- Prebuilt components ---------------------------------------------
    # Frontend-only pages. The Quickstart agent is the whole backend they need.
    "agentic_chat": RegisteredAgent(
        chat_agents.prebuilt_chat_agent, "/strands/prebuilt-components/chat"
    ),
    "prebuilt-sidebar": RegisteredAgent(
        chat_agents.prebuilt_sidebar_agent, "/strands/prebuilt-components/sidebar"
    ),
    "prebuilt-popup": RegisteredAgent(
        chat_agents.prebuilt_popup_agent, "/strands/prebuilt-components/popup"
    ),
    "chat-controls": RegisteredAgent(
        chat_agents.chat_controls_agent,
        "/strands/prebuilt-components/chat-controls",
    ),

    # --- Custom look and feel --------------------------------------------
    "chat-customization-css": RegisteredAgent(
        chat_agents.css_agent, "/strands/custom-look-and-feel/css"
    ),
    "chat-slots": RegisteredAgent(
        chat_agents.slots_agent, "/strands/custom-look-and-feel/slots"
    ),
    "headless-simple": RegisteredAgent(
        chat_agents.headless_simple_agent,
        "/strands/custom-look-and-feel/headless-ui",
    ),
    "headless-complete": RegisteredAgent(
        chat_agents.headless_complete_agent,
        "/strands/custom-look-and-feel/headless-ui",
    ),

    # --- Input modalities -------------------------------------------------
    "multimodal": RegisteredAgent(
        chat_agents.multimodal_agent, "/strands/multimodal-attachments"
    ),
    # Mounted at /voice; the voice runtime route forwards `voice-demo` here.
    "voice": RegisteredAgent(chat_agents.voice_agent, "/strands/voice"),

    # --- Generative UI ----------------------------------------------------
    # No gaps: `useComponent` registrations reach this agent and it calls them,
    # even though the page's backend section is a `setup skipped` placeholder.
    "gen-ui-tool-based": RegisteredAgent(
        chat_agents.tool_based_agent, "/strands/generative-ui/tool-based"
    ),
    # The only agent with a backend tool. See `agents/doc_tools.py`.
    "tool-rendering": RegisteredAgent(
        chat_agents.tool_rendering_agent,
        "/strands/generative-ui/tool-rendering",
        gaps=(UNPUBLISHED_TOOLS_MODULE, NO_TOOL_WIRING),
    ),
    # No gaps on either: client-registered tools reach these agents and they
    # call them, with no backend wiring beyond the Quickstart's four lines.
    "gen-ui-display-only": RegisteredAgent(
        chat_agents.display_only_agent,
        "/strands/generative-ui/your-components/display-only",
    ),
    "gen-ui-interactive": RegisteredAgent(
        chat_agents.interactive_agent,
        "/strands/generative-ui/your-components/interactive",
    ),
    "a2ui-fixed-schema": RegisteredAgent(
        chat_agents.a2ui_fixed_agent,
        "/strands/generative-ui/a2ui/fixed-schema",
        gaps=(NO_TOOL_WIRING, NO_A2UI_BACKEND),
    ),
    "declarative-gen-ui": RegisteredAgent(
        chat_agents.declarative_gen_ui_agent,
        "/strands/generative-ui/a2ui/dynamic-schema",
        gaps=(NO_A2UI_BACKEND,),
    ),

    # --- App control ------------------------------------------------------
    # Neither carries gaps: `useFrontendTool` and `useHumanInTheLoop` both
    # reach these agents through the same proxied-tool channel, with no backend
    # wiring beyond the Quickstart's four lines.
    "frontend_tools": RegisteredAgent(
        chat_agents.frontend_tools_agent, "/strands/frontend-tools"
    ),
    "hitl-in-chat": RegisteredAgent(
        chat_agents.hitl_agent, "/strands/human-in-the-loop"
    ),
    "programmatic-control": RegisteredAgent(
        chat_agents.programmatic_control_agent,
        "/strands/programmatic-control",
        gaps=(SETUP_SKIPPED,),
    ),

    # --- Shared state -----------------------------------------------------
    # The only documented state wiring on any Strands page.
    "shared-state-language": RegisteredAgent(
        shared_state_language_agent, "/strands/shared-state/in-app-agent-read"
    ),
    "shared-state-read-write": RegisteredAgent(
        chat_agents.shared_state_read_write_agent,
        "/strands/shared-state/rendering-in-app",
        gaps=(NO_TOOL_WIRING, NO_STATE_FROM_RESULT),
    ),
    "readonly-state-agent-context": RegisteredAgent(
        chat_agents.readonly_state_agent_context_agent,
        "/strands/shared-state/agent-readonly",
        gaps=(SETUP_SKIPPED,),
    ),

    # --- Multi-agent ------------------------------------------------------
    # Delegation works; the live log does not — the `state_from_result` hook
    # that would write `state["delegations"]` is never published.
    "subagents": RegisteredAgent(
        chat_agents.subagents_agent,
        "/strands/multi-agent/subagents",
        gaps=(NO_STATE_FROM_RESULT, NO_TOOL_WIRING),
    ),

    # --- Agent config -----------------------------------------------------
    "agent-config": RegisteredAgent(
        chat_agents.agent_config_agent,
        "/strands/agent-config",
        gaps=(SETUP_SKIPPED,),
    ),
}
#endregion
