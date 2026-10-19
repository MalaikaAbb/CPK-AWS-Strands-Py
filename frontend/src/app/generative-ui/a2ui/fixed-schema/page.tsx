import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/a2ui/fixed-schema" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A surface whose <em>shape</em> is authored in advance and whose{" "}
          <em>data</em> comes from the agent. The <code>display_flight</code>{" "}
          tool takes four strings — origin, destination, airline, price — and
          returns an <code>a2ui_operations</code> container: the 12-component
          tree from <code>flight_schema.json</code>, plus a data model those
          components read through <code>{"{ path }"}</code> bindings. The
          runtime middleware spots the container in the tool result and the
          page&apos;s five-component catalog draws it. No second model call,
          and the same card every time.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Find me a flight from SFO to JFK on United for $289.",
              "What about London to Tokyo on ANA for 900 dollars?",
            ]}
            expect="One display_flight call with {origin, destination, airline, price}, then a card in the chat: 'Flight Details', SFO → JFK in large monospace codes with an arrow between them, a United badge, a $289 price tag and a 'Book flight' button, followed by a one-sentence reply. In the Inspector the tool result's a2ui_operations holds createSurface, updateComponents (the 12 components of flight_schema.json, with { path: '/origin' } bindings) and updateDataModel. Verified over raw AG-UI against the agent server, 2/2 runs; not yet watched in a browser."
            fail="A card with blank airport codes or price means the DynString bindings did not resolve — `npm ls zod` must show one 3.x copy. Raw JSON in a tool bubble and no card means the A2UI middleware is not on this agent: the provider must point at /api/copilotkit-a2ui-fixed-schema. A Book button that does nothing is expected — see the last callout."
          />
        </div>
      </Panel>

      <Callout tone="warn" title="The backend is from CopilotKit's GitHub showcase, not from the doc page">
        <p>
          The page describes <code>display_flight</code> and{" "}
          <code>flight_schema.json</code> and prints neither — not in its prose
          and not in its demo Code tab, whose own comments still point at{" "}
          <code>src/agents/a2ui_fixed.py</code>. The Python the page does print
          for Strands is a different tool, <code>generate_a2ui</code>, which has
          a second model invent the tree per request; this route does not use
          it.
        </p>
        <p className="mt-2">
          <code>backend/src/agents/a2ui_fixed.py</code> and{" "}
          <code>a2ui_schemas/flight_schema.json</code> are byte-exact copies of{" "}
          <code>showcase/integrations/strands/src/agents/</code> in the
          CopilotKit monorepo. Their catalog id and component names match this
          route&apos;s catalog exactly. Nothing in them was edited.
        </p>
      </Callout>

      <Callout tone="success" title="From the doc page's demo Code tab, byte-exact">
        <ul className="list-disc space-y-0.5 pl-5">
          <li>
            The catalog — <code>definitions.ts</code>,{" "}
            <code>renderers.tsx</code>, <code>catalog.ts</code> — also printed in
            the page prose.
          </li>
          <li>
            The four shadcn-style primitives the renderers import:{" "}
            <code>_components/{"{badge,button,card,separator}"}.tsx</code>.
          </li>
          <li>
            The dedicated runtime{" "}
            <code>api/copilotkit-a2ui-fixed-schema/route.ts</code>: single-route
            mode, <code>injectA2UITool: false</code>, and a{" "}
            <code>defaultCatalogId</code>.
          </li>
          <li>
            The demo <code>page.tsx</code>, <code>chat.tsx</code> and{" "}
            <code>suggestions.ts</code>.
          </li>
        </ul>
      </Callout>

      <Callout tone="warn" title="Repo-authored on this route">
        <ul className="list-disc space-y-0.5 pl-5">
          <li>
            <code>_build_model</code> in <code>backend/src/agents/agent.py</code>
            . <code>a2ui_fixed.py</code> imports it; the published one lives in
            the Code tab&apos;s <code>agent.py</code>, which cannot import. The
            shim runs this repo&apos;s <code>gpt-4o</code>; the published
            function defaults to <code>gpt-5-mini</code>.
          </li>
          <li>
            The registry entry that mounts the agent at{" "}
            <code>/a2ui-fixed-schema/</code>, and the matching frontend id. The
            page never shows how its agent is served.
          </li>
          <li>
            The demo page&apos;s frame and <code>enableInspector</code> prop.
          </li>
          <li>
            <code>zod</code> pinned at 3.25.76. The page&apos;s install line
            pulls zod 4, under which the <code>DynString</code> bindings stop
            resolving and the card renders blank.
          </li>
        </ul>
      </Callout>

      <Panel title="The agent and its schema">
        <SourceCodeGroup
          files={[
            { file: "backend/src/agents/a2ui_fixed.py" },
            { file: "backend/src/agents/a2ui_schemas/flight_schema.json" },
          ]}
          note="Byte-exact from the GitHub showcase. The tree is Card › Column › [Title, Row(Airport, Arrow, Airport), Row(AirlineBadge, PriceTag), Button › Text]; every data-bearing prop is a { path } binding against the four-key data model the tool returns."
        />
      </Panel>

      <Panel title="The catalog">
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/generative-ui/a2ui/fixed-schema/a2ui/definitions.ts" },
            { file: "frontend/src/app/generative-ui/a2ui/fixed-schema/a2ui/renderers.tsx" },
            { file: "frontend/src/app/generative-ui/a2ui/fixed-schema/a2ui/catalog.ts" },
            { file: "frontend/src/app/generative-ui/a2ui/fixed-schema/_components/card.tsx" },
          ]}
          note="All byte-exact from the Code tab, badge/button/separator included."
        />
      </Panel>

      <Panel title="The runtime and the provider">
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/api/copilotkit-a2ui-fixed-schema/route.ts" },
            { file: "frontend/src/app/generative-ui/a2ui/fixed-schema/demo-chat/published-page.tsx.txt" },
            { file: "frontend/src/app/generative-ui/a2ui/fixed-schema/demo-chat/page.tsx" },
            { file: "frontend/src/app/generative-ui/a2ui/fixed-schema/demo-chat/chat.tsx" },
            { file: "frontend/src/app/generative-ui/a2ui/fixed-schema/demo-chat/suggestions.ts" },
          ]}
          note={
            "The Code tab's route is the one the demo uses. The page's prose shows a different runtime — `a2ui: { injectA2UITool: false, agents: ['a2ui-fixed-schema'] }` on the app-wide /api/copilotkit — which this app also keeps, as printed. The harness's demo page differs from the published one only in the chrome around the provider."
          }
        />
      </Panel>

      <Callout tone="warn" title="Action handlers are documented as not working">
        <p>
          The page&apos;s &quot;Action handlers (reference)&quot; section pairs
          a fixed schema with <code>action_handlers={"{…}"}</code> and then
          says the Python SDK&apos;s <code>a2ui.render</code> does not accept
          them. <code>flight_schema.json</code> declares the Book button&apos;s{" "}
          <code>action.event</code> (name <code>book_flight</code>, four path
          bindings) the way the page&apos;s JSON example does, but the showcase
          ships no <code>booked_schema.json</code> or handler for Strands, and
          the Button renderer is pure presentation. The click does nothing. The
          page sends you to the LangGraph guide for the <code>onAction</code>{" "}
          pattern.
        </p>
      </Callout>
    </>
  );
}
