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


#region otel-noise
class _DetachNoiseFilter(logging.Filter):
    """Drops OpenTelemetry's ``Failed to detach context`` records.

    Every prompt logs two of these, each with a full traceback ending in
    ``ValueError: <Token ...> was created in a different Context``. They look
    fatal and are not. Neither package at fault is this one:

    Strands wraps the ``yield``s in ``Agent.stream_async`` and in
    ``event_loop_cycle`` with ``trace_api.use_span(...)``, attaching a
    contextvars token that can only be reset from the same ``Context`` — the
    pattern OTel warns against in generators — and ``stream_async`` never
    ``aclose()``s the ``_run_loop`` generator it drives, so an early exit
    leaves it to the GC. ``ag_ui_strands`` then supplies the early exit: it
    breaks out of the stream on Strands' ``complete`` event, and its teardown
    gates the explicit ``aclose()`` on ``ag_running``, which is False for a
    *suspended* generator and not only an exhausted one. Both generators are
    finalized by asyncio's async-generator hook in a different Context, and the
    token reset raises.

    Fixing only the adapter would not silence this: measured on the same nested
    shape, break-then-``aclose()``-in-task still logs 1 of the 2 (closing the
    outer generator does not close the inner one). See README §9.17.

    Harmless regardless — OTel's ``detach()`` catches the ValueError and only
    logs it, and the break happens after the terminal event, so the client
    already has the whole stream. Filter exactly this message and nothing else;
    set ``OTEL_DETACH_NOISE=1`` to see the records again while debugging.
    """

    def filter(self, record: logging.LogRecord) -> bool:
        return record.getMessage() != "Failed to detach context"


if os.environ.get("OTEL_DETACH_NOISE") != "1":
    logging.getLogger("opentelemetry.context").addFilter(_DetachNoiseFilter())
#endregion

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
