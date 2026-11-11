"""The one model every agent in this package uses.

The Strands Quickstart's code block used to set `model_id="gpt-5.4"`, a model
id that did not resolve against the OpenAI API, while the callout beneath it
said "GPT-4o". Since the 2026-11-10 sync it sets `model_id="gpt-6-luna"` and
the GPT-4o callout is gone; the new id has not been checked against the API.

The Shared State pages (`in-app-agent-read`, `in-app-agent-write`) build the
same model with `model_id="gpt-4o"`, so that is the value this repo defaults
to. `MODEL_ID` in `.env` overrides it, including to the Quickstart's literal
`gpt-6-luna`. The discrepancy is recorded in
README §9 and surfaced in-app on the Quickstart route.
"""

from __future__ import annotations

import os

from strands.models.openai import OpenAIModel

#region model
#: What the Quickstart code block literally prints. Shown in the UI; not used.
DOC_QUICKSTART_MODEL_ID = "gpt-6-luna"

#: What the Shared State pages use, and what this server runs unless overridden.
DEFAULT_MODEL_ID = "gpt-4o"

MODEL_ID = os.getenv("MODEL_ID", DEFAULT_MODEL_ID)


def get_model() -> OpenAIModel:
    """The Quickstart's `OpenAIModel(...)` with the model id made overridable."""
    api_key = os.getenv("OPENAI_API_KEY", "")
    return OpenAIModel(
        client_args={"api_key": api_key},
        model_id=MODEL_ID,
    )
#endregion
