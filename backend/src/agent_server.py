"""The Strands agent server.

The Quickstart builds one AG-UI app for one agent:

    app = create_strands_app(agui_agent, "/")

This harness has one agent per doc route, and no Strands page shows more than
one agent in a process. So each registered agent gets its own
`create_strands_app(..., "/")` — the documented call, unchanged — and the
sub-apps are mounted side by side on a parent FastAPI app at `/{agent_id}`.
`app.mount` is plain Starlette, not a CopilotKit API, which is why it is the
composition used: nothing about the documented call is altered.

Because a mounted sub-app owns its own root, the AG-UI endpoint for agent
`tool-rendering` is `http://localhost:8000/tool-rendering/` — with the trailing
slash. `frontend/src/lib/agents.ts` builds the `HttpAgent` URLs the same way;
the Voice doc page shows the same trailing-slash form.

Run with:  uv run --directory backend python src/agent_server.py
"""

from __future__ import annotations

import logging
import os

import uvicorn
from ag_ui_strands import create_strands_app
from fastapi import FastAPI

from agents.model import MODEL_ID
from agents.registry import REGISTRY

logging.basicConfig(level=os.environ.get("LOG_LEVEL", "INFO"))
logger = logging.getLogger(__name__)

HOST = os.environ.get("AGENT_HOST", "0.0.0.0")
PORT = int(os.environ.get("AGENT_PORT", "8000"))

app = FastAPI(
    title="CopilotKit + AWS Strands test suite — agent server",
    description="One AG-UI endpoint per doc route.",
)


#region mount
for agent_id, registered in REGISTRY.items():
    agui_agent = registered.build()
    # The Quickstart's call, once per agent.
    sub_app = create_strands_app(agui_agent, "/")
    app.mount(f"/{agent_id}", sub_app)
#endregion


@app.get("/health")
def health() -> dict:
    """Lets the README's smoke test confirm every agent mounted."""
    return {
        "status": "ok",
        "model_id": MODEL_ID,
        "agents": sorted(REGISTRY),
        "count": len(REGISTRY),
    }


@app.get("/gaps")
def gaps() -> dict:
    """Per-agent list of what the Strands docs do not publish.

    The `/copilot-runtime` route fetches this and cross-checks it against the
    frontend's own copy, so drift between the two shows up as a diff rather
    than as a quietly optimistic status badge.
    """
    return {
        agent_id: {"doc": r.doc, "gaps": list(r.gaps)}
        for agent_id, r in sorted(REGISTRY.items())
    }


if __name__ == "__main__":
    logger.info(
        "Mounted %d agents on model %s: %s",
        len(REGISTRY),
        MODEL_ID,
        ", ".join(sorted(REGISTRY)),
    )
    uvicorn.run(app, host=HOST, port=PORT)
