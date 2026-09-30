"""Repo-authored shim — NOT from the docs.

The two agents the Strands JSON Render and Hashbrown pages publish
(`byoc_json_render.py`, `byoc_hashbrown.py`, reproduced verbatim next to this
file) build their model with a deferred

    from agents.agent import _build_model

`agents/agent.py` in the Strands showcase is the long file whose truncated
prefixes other doc pages print (see `backend/docs_verbatim/`); no published
prefix reaches a `_build_model` definition. Rather than edit the verbatim
modules, this file supplies exactly that one name, backed by the model every
other agent in this package uses (`agents.model.get_model`, the Quickstart's
`OpenAIModel` with the model id made overridable).

Nothing else from the showcase `agent.py` lives here.
"""

from __future__ import annotations

from strands.models.openai import OpenAIModel

from agents.model import get_model


def _build_model() -> OpenAIModel:
    """The name the published byoc agents import; delegates to `get_model()`."""
    return get_model()
