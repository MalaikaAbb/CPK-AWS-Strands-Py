import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/a2ui/fixed-schema" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A surface whose <em>shape</em> is decided in advance and whose{" "}
          <em>data</em> comes from the agent. On the frontend that is a
          five-component catalog merged with CopilotKit&apos;s basic one, and a
          runtime with <code>injectA2UITool: false</code> so the agent&apos;s
          own tool is the only one in play. Both halves are published for
          Strands and both are reproduced here.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The agent&apos;s half is not. The page describes a tool that loads a
          schema at import and returns an <code>a2ui_operations</code>{" "}
          container, but the Python it actually prints is the same truncated{" "}
          <code>src/agents/agent.py</code> as the other two A2UI-adjacent pages,
          whose A2UI tool is <code>generate_a2ui</code> — the{" "}
          <em>dynamic</em>-schema path, ending in a call to{" "}
          <code>build_a2ui_operations_from_tool_call</code> imported from a
          module that is never published. There is no{" "}
          <code>display_flight</code>, no <code>flight_schema.json</code>, and
          no line that attaches any of it to a Strands agent.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Find me a flight from SFO to JFK on United for 300$",
              "What about London to Tokyo on ANA?",
            ]}
            expect="A prose answer with no card. The catalog is registered and the middleware is scoped to this agent, but no tool result ever carries an operations container, because the tool that would return one is not published for Strands. What passes here is that the nested provider mounts with its catalog and the chat streams."
            fail="A crash on mount from createCatalog, or a chat that does not respond."
          />
        </div>
      </Panel>

       <Callout tone="warn" title="Missing Comprehensive Backend Integration">
        <p>
            Documentation is unclear on how fixed schema maps backend tool to a2ui.
        </p>
      </Callout>

      <Callout tone="warn" title="Repo-authored components on this route">
        <p>
          The doc prints <code>definitions.ts</code>,{" "}
          <code>renderers.tsx</code> and <code>catalog.ts</code> in full, and
          all three are reproduced here. But the renderers import primitives
          from a sibling directory the page never shows. Those are rebuilt in{" "}
          <code>_components/primitives.tsx</code> and are the only invented UI
          on this route:
        </p>
        <ul className="mt-2 list-disc space-y-0.5 pl-5">
          <li>
            <code>Card</code>, <code>Badge</code>, <code>Button</code>,{" "}
            <code>Separator</code> — shadcn-style primitives
          </li>
        </ul>
        <p className="mt-2">
          The two schema files the prose refers to (<code>flight_schema.json</code>,{" "}
          <code>booked_schema.json</code>) are not published either, and unlike
          the primitives they are not reconstructed here — a JSON component tree
          is the substance of this pattern, not scaffolding around it, so
          inventing one would be inventing the demo.
        </p>
      </Callout>

      <Panel title="How the pieces would meet">
        <ol className="space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
          <li>
            <strong>1.</strong> The schema JSON is loaded once at module import,
            backend-side. <em>(Not published for Strands.)</em>
          </li>
          <li>
            <strong>2.</strong> <code>display_flight</code> receives origin,
            destination, airline and price from the model.{" "}
            <em>(Not published for Strands.)</em>
          </li>
          <li>
            <strong>3.</strong> It returns an <code>a2ui_operations</code>{" "}
            container: <code>createSurface</code> +{" "}
            <code>updateComponents</code> + <code>updateDataModel</code>.{" "}
            <em>(Not published for Strands.)</em>
          </li>
          <li>
            <strong>4.</strong> The A2UI middleware intercepts the tool result
            and the frontend paints it with the matching catalog.{" "}
            <em>(Live — steps 1–3 are what is missing.)</em>
          </li>
        </ol>
      </Panel>

      <Panel title="The catalog">
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/generative-ui/a2ui/fixed-schema/a2ui/definitions.ts" },
            { file: "frontend/src/app/generative-ui/a2ui/fixed-schema/a2ui/renderers.tsx" },
            { file: "frontend/src/app/generative-ui/a2ui/fixed-schema/a2ui/catalog.ts" },
          ]}
        />
      </Panel>

      <Panel title="The runtime and the provider">
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/api/copilotkit/route.ts" },
            { file: "frontend/src/app/generative-ui/a2ui/fixed-schema/demo-chat/page.tsx" },
          ]}
          note="Both are the page's own snippets: injectA2UITool: false scoped to this agent on the runtime, and the catalog passed on a nested provider. The agent side has no published counterpart — see backend/docs_verbatim/."
        />
      </Panel>

      <Callout tone="warn" title="Action handlers are documented as not working">
        <p>
          The page&apos;s own &quot;Action handlers (reference)&quot; section
          says the pattern pairs a fixed schema with{" "}
          <code>action_handlers={"{…}"}</code> so clicking Book swaps in{" "}
          <code>booked_schema.json</code> — and then says the Python SDK&apos;s{" "}
          <code>a2ui.render</code> &quot;does not yet accept{" "}
          <code>action_handlers</code>&quot;. It sends you to the{" "}
          <em>LangGraph</em> fixed-schema guide for the full pattern. So even
          with a working agent this half would not run.
        </p>
      </Callout>

      <Callout tone="info" title="Why compose small components">
        <p>
          One monolithic <code>FlightCard</code> would be quicker to write and
          would lock the layout into React. Assembling from Card / Column / Row
          / Title / Airport / Arrow / AirlineBadge / PriceTag means the same{" "}
          <code>Airport</code> renderer works in search results and booking
          confirmations, and rearranging the card is a JSON edit with no
          renderer changes at all.
        </p>
      </Callout>
    </>
  );
}
