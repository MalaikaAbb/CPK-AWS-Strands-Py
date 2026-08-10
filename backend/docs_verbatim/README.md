# Doc code, kept verbatim — not part of the running server

Nothing in this directory is imported by `src/`. It exists so the harness can
show you exactly what the Strands docs publish, next to a note about what they
leave out.

## `agent_py_published_excerpt.py`

Three doc pages print a file called `src/agents/agent.py` from CopilotKit's own
AWS Strands showcase:

| Page | Lines printed |
| --- | --- |
| [`generative-ui/tool-rendering`](https://docs.copilotkit.ai/strands/generative-ui/tool-rendering) | 1–332 |
| [`generative-ui/a2ui/fixed-schema`](https://docs.copilotkit.ai/strands/generative-ui/a2ui/fixed-schema) | 1–585 |
| [`multi-agent/subagents`](https://docs.copilotkit.ai/strands/multi-agent/subagents) | 1–947 |

They are not three files. They are **three progressively longer prefixes of one
file** (verified: each shorter one is byte-identical to the head of the next),
and the longest of them — the 947 lines in this directory, taken from the
subagents page — is still a prefix. The file is cut off mid-way; the rest
is never published anywhere.

This copy is byte-identical to what the subagents page serves. It does not run.

### What it needs and never gets

**Two modules that are never published**

```python
from tools import (
    get_weather_impl, query_data_impl, manage_sales_todos_impl,
    roll_dice_impl, schedule_meeting_impl, search_flights_impl,
    build_a2ui_operations_from_tool_call,
)
from agents.gen_ui_agent import GEN_UI_AGENT_PROMPT, set_steps, steps_state_from_args
```

`tools` is described in a comment as "symlinked at project root →
`../../shared/python/tools`" — a path outside anything the docs ship. Every
`@tool` body in the excerpt delegates to one of those `_impl` functions, so no
tool in the file can execute.

**Symbols referenced but never defined**

- `build_showcase_agent(...)` — the function that would attach the `@tool`s to a
  Strands `Agent`, register the `ToolBehavior(state_from_result=…)` hooks, and
  build the `StrandsAgentConfig`. Referred to twice in comments; never printed.
  Without it there is no documented path from a `@tool` to a running agent.
- `subagent_state_from_result` / `_make_subagent_state_from_result` — named in
  comments as the hook that turns each delegation into a `StateSnapshotEvent`.
- `build_state_prompt` — named in the Shared State comment block as the reader
  of `input_data.state`.

**Imports that are never used in the printed prefix**

`ToolBehavior`, `HookProvider`, `HookRegistry`, `BeforeInvocationEvent`,
`BeforeToolCallEvent`, `AfterToolCallEvent`, `RunStartedEvent`,
`StateSnapshotEvent`, `TextMessage*Event`, `ToolCall*Event`, `Mapping`, `os`.
They are all imported at the top and all first used in the part that is cut
off — which is a fair signal of how much of the file is missing.

**Dead code in the prefix**

`_seed_delegations_from_state` and the `_delegations_by_thread` scratchpad are
fully defined but never called; the only caller would be the missing
`state_from_result` hook.

### The one complete thing here — and it is already obsolete

`_MessagesSnapshotWrapper` (lines 99–302 of the excerpt) is the only complete,
self-contained unit in the file. Its comment block states that `ag_ui_strands`
"through at least v0.1.7" does not emit `MessagesSnapshotEvent`, and that
without those events "responses that include tool calls never render as
assistant messages in the DOM". The wrapper is CopilotKit's own workaround,
sitting between `StrandsAgent.run()` and the SSE transport.

**That is no longer true.** Against `ag-ui-strands` 0.2.4 — the version this
repo pins — a raw AG-UI POST to a mounted agent returns:

```
data: {"type":"RUN_STARTED","threadId":"t1","runId":"r1"}
data: {"type":"STATE_SNAPSHOT","snapshot":{}}
data: {"type":"MESSAGES_SNAPSHOT","messages":[{"id":"m1","role":"user","content":"hi"}]}
data: {"type":"STATE_SNAPSHOT","snapshot":{}}
data: {"type":"RUN_FINISHED","threadId":"t1","runId":"r1"}
```

`MESSAGES_SNAPSHOT` is emitted natively, with no wrapper anywhere in the call
path. So this harness does not install it, and neither should you — the doc has
simply not caught up with the package. It is the one item on the repo's doc-gap
ledger that resolves in the reader's favour.

Reproduce it yourself: start the server, then

```bash
curl -s -X POST http://localhost:8000/strands_agent/ \
  -H 'Content-Type: application/json' \
  -d '{"threadId":"t1","runId":"r1","messages":[{"id":"m1","role":"user","content":"hi"}],
       "state":{},"tools":[],"context":[],"forwardedProps":{}}'
```
