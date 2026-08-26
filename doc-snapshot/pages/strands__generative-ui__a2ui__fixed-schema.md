# Fixed Schema A2UI

> Pre-defined A2UI schema with dynamic data. The fastest approach, with no LLM schema generation needed.


<!-- interactive demo: a2ui-fixed-schema -->


In the fixed-schema approach, you design the UI schema once (by hand,
or using the [A2UI Composer](https://a2ui-composer.ag-ui.com/)) and
keep it on the agent side. The agent tool only provides the *data*;
the surface appears instantly when the tool returns because nothing
has to be generated at runtime.

How the schema is *delivered* to the runtime is the only thing that
varies between integrations:

- **Schema-loading** (langgraph-python, langgraph-typescript,
  langgraph-fastapi, llamaindex, crewai-crews, pydantic-ai,
  ms-agent-python, google-adk), the schema is saved as a `.json`
  file next to the agent and loaded once at startup.
- **Schema-inline** (spring-ai, ms-agent-dotnet), the schema is
  declared inline as a typed literal in source. The host language
  doesn't ship a `load_schema` JSON loader, so the structure is
  compiled in directly.
- **LLM-driven** (mastra, strands), the agent runs a secondary LLM
  call to produce the operations container per-request. The catalog
  is still fixed; the schema is generated on demand.

Ask about a flight and the agent renders a fully structured card from a pre-defined schema:

## How it works

1. The schema is made available to the agent, either loaded from a
   JSON file at startup, declared inline, or generated per-request,
   depending on the integration.
2. The agent's `display_flight` tool receives data from the primary LLM
   (origin / destination / airline / price).
3. The tool returns `a2ui.render(...)` with `createSurface` +
   `updateComponents` + `updateDataModel` operations.
4. The A2UI middleware intercepts the tool result and the frontend
   renders the surface using the matching 5-component client catalog
   (Title, Airport, Arrow, AirlineBadge, PriceTag, plus the built-ins).

## Compositional schemas

The example below ships a flight card assembled compositionally from
small sub-components rather than one monolithic `FlightCard`:

```
Card
 └─ Column
     ├─ Title        ("Flight Details")
     ├─ Row          (Airport → Arrow → Airport)
     ├─ Row          (AirlineBadge · PriceTag)
     └─ Button       (Book)
```

That tree lives backend-side, as a JSON file, an inline literal, or
a per-request LLM output, depending on the integration. Components
without data bindings (like `Title` or `Arrow`) carry their value
inline; components bound to the LLM's data (like `Airport`) reference
fields via JSON Pointer paths such as `{ "path": "/origin" }`. The
A2UI binder resolves those paths *before* the React renderer runs, so
your renderer receives the resolved value and never sees the path — but
the *definition* still has to declare that prop as a literal-or-binding
union, because that union is the only signal the binder has that the
prop is bindable. See [Declare the component
definitions](#declare-the-component-definitions).

## The 5-component custom catalog

The frontend catalog declares just the domain-specific primitives
(Title, Airport, Arrow, AirlineBadge, PriceTag) and merges in
CopilotKit's basic catalog (Card, Column, Row, Text, Button, …) via
`includeBasicCatalog: true`.

<Steps>
<Step>
### Install the renderer package

The catalog, definitions and renderers below all import from
`@copilotkit/a2ui-renderer`. It ships separately from
`@copilotkit/react-core`, and the definitions use `zod` for prop schemas:

```npm
npm install @copilotkit/a2ui-renderer zod
```
</Step>

<Step>
### Declare the component definitions

Each component declares its props as a Zod schema. Any prop the schema
binds to the data model — anything that can arrive as
`{ "path": "/origin" }` rather than a literal — **must** be declared as a
union of the literal type and the binding object. That is what the
`DynString` helper below is for, and why `Airport`'s `code` uses it
rather than a plain `z.string()`.

The binder decides whether to resolve a prop by *inspecting its Zod
type*: a union with a `{ path }` member is treated as dynamic and
resolved against the data model, while a plain literal type is treated
as static and passed through untouched. So declaring a bound prop as
`z.string()` does not merely lose type precision — it tells the binder
not to resolve it, and the raw `{ path: "/origin" }` object reaches your
renderer.

<Callout type="warn" title="Plain `z.string()` on a bound prop crashes the render">
  Because the unresolved object reaches the renderer, the first thing
  that renders it as text throws React's
  [error #31](https://react.dev/errors/31):
  `Objects are not valid as a React child (found: object with keys {path})`.
  Nothing in that message points at the schema, so it reads as a renderer
  bug rather than a missing union. If you hit it, check the prop's
  declared type first.

  Props that are never bound (`Arrow`, or a `variant` enum) are fine as
  plain types. This applies only to props the schema binds.
</Callout>

Once the union is declared, the binder resolves the path before your
renderer runs, so the renderer still receives a plain string — the union
describes what the *schema* may send, not what the renderer must handle.
`@copilotkit/a2ui-renderer` re-exports A2UI's canonical
`DynamicStringSchema` (plus `DynamicNumberSchema`, `DynamicBooleanSchema`
and the matching types) if you would rather not hand-roll the union:

```ts
import { DynamicStringSchema } from "@copilotkit/a2ui-renderer";
```

```typescript
// src/app/demos/a2ui-fixed-schema/a2ui/definitions.ts
import { z } from "zod";
import type { CatalogDefinitions } from "@copilotkit/a2ui-renderer";

/**
 * Dynamic string: literal OR a data-model path binding. The GenericBinder
 * resolves path bindings to the actual value at render time.
 */
const DynString = z.union([z.string(), z.object({ path: z.string() })]);

export const definitions = {
  /**
   * Card override: gives the outer flight-card container a ShadCN look
   * (rounded-xl, neutral-200 border, soft shadow). The basic catalog's
   * Card uses inline styles; overriding here lets the demo's renderer
   * adopt the demo's Tailwind aesthetic without touching the schema JSON.
   */
  Card: {
    description: "A container card with a single child.",
    props: z.object({
      child: z.string(),
    }),
  },
  Title: {
    description: "A prominent heading for the flight card.",
    props: z.object({
      text: DynString,
    }),
  },
  Airport: {
    description: "A 3-letter airport code, displayed large.",
    props: z.object({
      code: DynString,
    }),
  },
  Arrow: {
    description: "A right-pointing arrow used between airports.",
    props: z.object({}),
  },
  AirlineBadge: {
    description: "A pill-styled airline name tag.",
    props: z.object({
      name: DynString,
    }),
  },
  PriceTag: {
    description: "A stylized price display (e.g. '$289').",
    props: z.object({
      amount: DynString,
    }),
  },
  /**
   * Button override: swaps in an ActionButton renderer that tracks
   * its own `done` state so clicking "Book flight" visually updates to
   * a "Booked ✓" confirmation. The basic catalog's Button is stateless,
   * so without this override the click fires the action but the button
   * looks unchanged. Mirrors the pattern in beautiful-chat
   * (src/app/demos/beautiful-chat/declarative-generative-ui/renderers.tsx).
   */
  Button: {
    description:
      "An interactive button with an action event. Use 'child' with a Text component ID for the label. After click, the button shows a confirmation state.",
    props: z.object({
      child: z
        .string()
        .describe(
          "The ID of the child component (e.g. a Text component for the label).",
        ),
      variant: z.enum(["primary", "secondary", "ghost"]).optional(),
      // Union with { event } so GenericBinder resolves this as ACTION → callable () => void.
      action: z
        .union([
          z.object({
            event: z.object({
              name: z.string(),
              context: z.record(z.any()).optional(),
            }),
          }),
          z.null(),
        ])
        .optional(),
    }),
  },
} satisfies CatalogDefinitions;
```
</Step>

<Step>
### Implement the React renderers

TypeScript enforces that the renderer map's keys and prop shapes
match the definitions exactly, so refactors stay safe:

```typescript
// src/app/demos/a2ui-fixed-schema/a2ui/renderers.tsx
export const renderers: CatalogRenderers<Definitions> = {
  /**
   * Card override: ShadCN-style outer container. The basic catalog's Card
   * uses inline styles; overriding here keeps the demo's tailwind aesthetic.
   * The flight schema renders Card > Column > [Title, Row, …]; the inner
   * Column adds the vertical spacing.
   */
  Card: ({ props, children }) => (
    <Card className="w-full max-w-md p-5" data-testid="a2ui-fixed-card">
      {props.child ? children(props.child) : null}
    </Card>
  ),
  Title: ({ props }) => (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-500">
          Itinerary
        </p>
        <h3 className="text-base font-semibold leading-none tracking-tight text-neutral-900">
          {s(props.text)}
        </h3>
      </div>
      <Badge variant="outline" className="font-mono">
        1-stop · economy
      </Badge>
    </div>
  ),
  Airport: ({ props }) => (
    <div className="flex flex-col items-center">
      <span className="font-mono text-2xl font-semibold tracking-wider text-neutral-900">
        {s(props.code)}
      </span>
    </div>
  ),
  Arrow: () => (
    <div className="flex flex-1 items-center px-3">
      <Separator className="flex-1 bg-neutral-200" />
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mx-1 text-neutral-400"
        aria-hidden
      >
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
      <Separator className="flex-1 bg-neutral-200" />
    </div>
  ),
  AirlineBadge: ({ props }) => (
    <Badge variant="secondary" className="uppercase tracking-[0.08em]">
      {s(props.name)}
    </Badge>
  ),
  PriceTag: ({ props }) => (
    <div className="flex items-baseline gap-1">
      <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-500">
        Total
      </span>
      <span className="font-mono text-base font-semibold text-neutral-900">
        {s(props.amount)}
      </span>
    </div>
  ),
  /**
   * Button override: this is a pure-presentation demo, so the button just
   * renders its label. The schema declares an `action` for visual fidelity,
   * but the click handler is inert until the Python SDK exposes
   * `action_handlers=` on `a2ui.render` (see `src/agents/a2ui_fixed.py`).
   */
  Button: ({ props, children }) => (
    <UIButton className="w-full">
      {props.child ? children(props.child) : null}
    </UIButton>
  ),
};
```
</Step>

<Step>
### Wire the catalog

`createCatalog(..., { includeBasicCatalog: true })` merges the custom
renderers with CopilotKit's built-ins so the schema can reference
`Card`, `Column`, `Row`, `Button` alongside the domain primitives:

```typescript
// src/app/demos/a2ui-fixed-schema/a2ui/catalog.ts
import { createCatalog } from "@copilotkit/a2ui-renderer";

import { definitions } from "./definitions";
import { renderers } from "./renderers";

export const CATALOG_ID = "copilotkit://flight-fixed-catalog";

export const catalog = createCatalog(definitions, renderers, {
  catalogId: CATALOG_ID,
  includeBasicCatalog: true,
});
```
</Step>








<Step>
### Generate the schema dynamically

Mastra and Strands take a different route: the agent tool runs a
*secondary* LLM call with a forced tool choice that produces the
operations container per-request. The frontend catalog is still fixed
(same `Title`/`Airport`/`Arrow`/`AirlineBadge`/`PriceTag` primitives),
but the schema is built on the fly. Schema construction and render
emission happen in the same tool call.

Neither SDK ships an `a2ui.render(...)` equivalent here, so the tool
assembles the `a2ui_operations` envelope itself — the operation builder
below is part of what you copy. Note the operations are *nested*
(`{ createSurface: {...} }`): a consumer dispatches on the operation
key, so a flat `{ type: "create_surface" }` shape is ignored and the
surface never paints.

```python
# src/agents/a2ui_generate.py
import json
import logging
from typing import TypedDict

from strands import tool

# Shared tool implementations, symlinked at the project root
# (→ ../../shared/python/tools). ``build_a2ui_operations_from_tool_call`` wraps
# the inner model's ``render_a2ui`` arguments in the nested A2UI v0.9
# ``a2ui_operations`` envelope the middleware detects in a tool result.
from tools import build_a2ui_operations_from_tool_call

logger = logging.getLogger(__name__)


class _A2uiError(TypedDict):
    """Shape of the structured error dict returned by generate_a2ui branches.

    Mirrors the google-adk and langroid sibling agents' error shape — keep
    all three in sync. Every error branch MUST populate all three keys so
    callers (and the LLM summarizing the tool result) see a consistent
    surface.
    """

    error: str
    message: str
    remediation: str


# The `generate_a2ui` tool runs a secondary LLM call with a forced
# `render_a2ui` tool, then converts that tool call's args into the
# A2UI `a2ui_operations` container via
# `build_a2ui_operations_from_tool_call`. The ag_ui_strands middleware
# detects the container in the tool result and forwards the ops to
# the frontend, which resolves component names through the registered
# catalog (`copilotkit://generative-catalog`).
@tool
def generate_a2ui(context: str) -> str:
    """Generate dynamic A2UI components based on the conversation.

    A secondary LLM designs the UI schema and data. The result is
    returned as an a2ui_operations container for the middleware to detect.

    Error branches return a JSON-serialized ``_A2uiError`` dict rather
    than raising, so OpenAI transport / quota / auth failures surface to
    the LLM as a structured tool result (not an uncaught exception in the
    strands tool machinery). See ``_A2uiError`` above.

    Args:
        context: Conversation context to generate UI from

    Returns:
        A2UI operations (or ``_A2uiError``) as JSON string
    """
    tool_schema = {
        "type": "function",
        "function": {
            "name": "render_a2ui",
            "description": "Render a dynamic A2UI v0.9 surface.",
            "parameters": {
                "type": "object",
                "properties": {
                    "surfaceId": {"type": "string"},
                    "catalogId": {"type": "string"},
                    "components": {"type": "array", "items": {"type": "object"}},
                    "data": {"type": "object"},
                },
                "required": ["surfaceId", "catalogId", "components"],
            },
        },
    }

    # Wrap the OpenAI call so raw SDK / transport failures do NOT bubble up
    # through the strands tool machinery as uncaught exceptions. Return a
    # structured error with remediation instead — the LLM can surface this
    # to the user. Mirrors the google-adk and langroid sibling agents'
    # error-handling shape — keep all three in sync.
    #
    # Exception scope is broad on the SDK side but still bounded:
    #   * ``openai.OpenAIError`` covers config-time failures (e.g. from
    #     ``OpenAI()`` constructor when ``OPENAI_API_KEY`` is unset).
    #     ``APIError`` subclasses (RateLimitError, APIConnectionError,
    #     AuthenticationError, BadRequestError, etc.) are also caught via
    #     the broader ``except`` tuple. Verified against ``openai>=1.0`` —
    #     re-check hierarchy on major version bumps.
    #   * ``httpx.HTTPError`` covers transport failures (ConnectError,
    #     ReadTimeout, RemoteProtocolError) that can escape below the SDK's
    #     wrap layer in rare cases.
    # Programmer errors (AttributeError, NameError, TypeError from bad
    # kwargs, etc.) still propagate so bugs are not silently swallowed as
    # "LLM error". Note the client construction itself is inside the try
    # block for the same reason.
    import openai as _openai_mod
    import httpx as _httpx_mod

    try:
        client = _openai_mod.OpenAI()
        response = client.chat.completions.create(
            model="gpt-4.1",
            messages=[
                {
                    "role": "system",
                    "content": context or "Generate a useful dashboard UI.",
                },
                {
                    "role": "user",
                    "content": "Generate a dynamic A2UI dashboard based on the conversation.",
                },
            ],
            tools=[tool_schema],
            tool_choice={"type": "function", "function": {"name": "render_a2ui"}},
        )
    except (_openai_mod.OpenAIError, _httpx_mod.HTTPError) as exc:
        logger.exception("generate_a2ui: OpenAI API call failed")
        return json.dumps(
            _A2uiError(
                error="a2ui_llm_error",
                message=f"Secondary A2UI LLM call failed: {exc.__class__.__name__}",
                remediation=(
                    "Verify OPENAI_API_KEY is set and the OpenAI service is reachable. "
                    "See server logs for the full traceback."
                ),
            )
        )

    if not response.choices:
        logger.warning("generate_a2ui: OpenAI response contained no choices")
        return json.dumps(
            _A2uiError(
                error="a2ui_empty_response",
                message="Secondary A2UI LLM returned no choices.",
                remediation="Retry; if this persists, check OpenAI status.",
            )
        )

    tool_calls = response.choices[0].message.tool_calls
    if not tool_calls:
        logger.warning(
            "generate_a2ui: OpenAI response had no tool_calls despite forced tool_choice"
        )
        return json.dumps(
            _A2uiError(
                error="a2ui_no_tool_call",
                message="Secondary A2UI LLM did not call render_a2ui.",
                remediation=(
                    "Retry the request. If this persists, verify the tool_choice "
                    "schema matches the OpenAI API contract."
                ),
            )
        )

    tool_call = tool_calls[0]
    try:
        args = json.loads(tool_call.function.arguments)
    except (ValueError, TypeError) as exc:
        logger.exception(
            "generate_a2ui: failed to parse render_a2ui tool arguments as JSON"
        )
        return json.dumps(
            _A2uiError(
                error="a2ui_invalid_arguments",
                message=f"Could not parse render_a2ui arguments: {exc}",
                remediation="Retry the request; the secondary LLM emitted malformed JSON.",
            )
        )

    result = build_a2ui_operations_from_tool_call(args)
    return json.dumps(result)


```
</Step>

</Steps>

## Why compositional beats monolithic

A single big `FlightCard` component would be faster to write but would
lock the design in place. Assembling the card from Card / Column /
Row / Title / Airport / Arrow / AirlineBadge / PriceTag gives you:

- **Reusable primitives** the same `Airport` renderer works in
  search results, booking confirmations, and future seat maps.
- **Schema-level design iteration** re-arranging rows or swapping a
  badge requires only a JSON edit; the renderer code is untouched.
- **A2UI Composer compatibility** hand-written and Composer-built
  schemas share the same primitive vocabulary.

## Registering the runtime

Your agent owns the tool in the fixed-schema approach, so you do not
want the runtime to inject its own. Enable A2UI but turn injection off.

Passing a catalog on the provider is enough to enable A2UI:

```tsx title="app/page.tsx"
<CopilotKit runtimeUrl="/api/copilotkit" a2ui={{ catalog: myCatalog }}>
  {children}
</CopilotKit>
```

Because a catalog auto-injects the A2UI tool by default, set
`injectA2UITool: false` on the runtime so your agent's own tool is the
only one in play. The middleware still auto-detects the operations the
tool returns and renders the surface, with no subagent involved:

```typescript title="app/api/copilotkit/route.ts"
const runtime = new CopilotRuntime({
  agents: { "a2ui-fixed-schema": agent },
  a2ui: { injectA2UITool: false, agents: ["a2ui-fixed-schema"] },
});
```

<!-- setup skipped: a2ui-fixed-schema-setup is not bundled for strands -->

## Action handlers (reference)

The canonical reference pairs fixed schemas with
`action_handlers={...}` to declare optimistic UI swaps (e.g. replacing
the flight schema with `BOOKED_SCHEMA` when the user clicks "Book").
The Python SDK's `a2ui.render` does not yet accept `action_handlers`,
so the cell omits them; the `booked_schema.json` sibling is retained
so the swap can be wired up the moment the SDK exposes the handler
kwarg.

When available, a button declares its action like this:

```json
{
  "Button": {
    "label": "Book",
    "action": {
      "name": "book_flight",
      "context": [
        { "key": "flightNumber", "value": { "path": "/flightNumber" } },
        { "key": "price", "value": { "path": "/price" } }
      ]
    }
  }
}
```

And the Python tool matches it with a handler keyed by the action
name (plus a `"*"` catch-all). Until the SDK lands, handle the click on the
frontend instead — see
[Advanced — Action Handlers](./advanced#action-handlers) for the
`createA2UIMessageRenderer` / `onAction` pattern.

## When should I use fixed schemas?

- The surface is well-known: flight cards, product tiles, order
  summaries, dashboards.
- You want deterministic, designer-controlled UI. No LLM schema drift.
- You want the fastest possible first paint; no secondary LLM call.

If the UI must adapt per prompt, reach for
**[dynamic schemas](./dynamic-schema)** instead.

<IntegrationGrid path="generative-ui/a2ui" />
