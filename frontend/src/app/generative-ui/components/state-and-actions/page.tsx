// Ported from the CPK-LangGraph-TS harness (itself ported from aws-strands-ts).
// The strands doc page is byte-identical to the langgraph-typescript one
// (diffed 2026-11-10). The page prints only a TanStack BuiltInAgent; these
// providers' runtime runs the Strands `genui` agent instead (route callout).

import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

const BASE = "frontend/src/app/generative-ui/components/state-and-actions/demo-chat";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components/state-and-actions" />

      <Callout tone="warn" title="Agent: Strands, not the doc's BuiltInAgent">
        <p>
          The Components and surfaces pages publish a backend only as a TanStack{" "}
          <code>BuiltInAgent</code> factory, which is not a Strands agent. This
          harness runs its own framework&apos;s agent in that slot: a
          tool-free Strands <code>genui</code> agent
          (<code>backend/src/agents/genui_agent.py</code>) whose prompt is the
          factory&apos;s, verbatim, reached over AG-UI through{" "}
          <code>/api/copilotkit-genui</code>. Doc gap, README §9.35. The
          page&apos;s frontend code below is kept verbatim and type-checked.
          Not yet checked in a browser.
        </p>
      </Callout>

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Generated components can be wired back into the app. A catalog can
          declare <strong>state</strong> that your code fills and the agent
          never sets; <strong>functions</strong> that a component&apos;s event
          calls in the browser; <strong>events</strong> that, when no function
          matches, turn a click into a message to the agent; and{" "}
          <strong>writable</strong> props whose user edits stick.
        </p>
        <div className="mt-4 space-y-3">
          <TryIt
            prompts={["(App state) show a product card for p1 Trail Runner"]}
            expect="The card reads 'In cart: 0' from app state (nothing on the page adds to the cart), not from the agent."
            fail="'In cart' missing or wrong — the bind selector did not run, or the agent set inCart itself."
          />
          <TryIt
            prompts={["(Run code on click) show a product card for p1 Trail Runner"]}
            expect="The card renders. The page prints no ProductCard, so the stand-in has no Add to cart button and the addToCart function can't be clicked here."
            fail="A chat message appears on click — the event did not match addToCart."
          />
          <TryIt
            prompts={["(Writable) show a checkout form with the email set to me@example.com"]}
            expect="The input starts with the agent's value and keeps whatever you type; asking the agent to change the email afterwards does not overwrite your edit."
          />
        </div>
      </Panel>

      <Panel title="The page's code">
        <SourceCodeGroup
          files={[
            { file: `${BASE}/state-catalog.tsx` },
            { file: `${BASE}/functions-catalog.tsx` },
            { file: `${BASE}/declarations.ts` },
            { file: `${BASE}/writable-catalog.tsx` },
          ]}
        />
      </Panel>

      <Panel title="The demo">
        <SourceCodeGroup files={[{ file: `${BASE}/page.tsx` }, { file: `${BASE}/sections.tsx` }]} />
      </Panel>

      <Callout tone="warn" title="Gaps and harness changes">
        <ul className="space-y-1.5">
          <li>
            · Every snippet omits some imports (<code>z</code>,{" "}
            <code>createGenerativeUI</code>, <code>Cart</code>); added and marked.
          </li>
          <li>
            · The state catalog uses a <code>ProductCard</code> the page never
            prints; scaffolding renders <code>inCart</code>.
          </li>
          <li>
            · <code>Cart</code> and <code>cart.addItem</code> are undefined; a
            React-state cart stands in.
          </li>
          <li>
            · &ldquo;Who may call&rdquo; and &ldquo;Keep what the user
            types&rdquo; are fragments; the catalogs around them are
            scaffolding. &ldquo;Send a click to the agent&rdquo; prints only an{" "}
            <code>events</code> fragment and names no component, so it is not
            exercised here.
          </li>
          <li>
            · The state and functions catalogs declare only{" "}
            <code>ProductCard</code>, and a surface has one root, so two cards
            have nothing to sit in: the agent invents a container and the
            browser rejects the <code>createSurface</code>. The catalogs are
            used as published, with no layout container added, so ask for one
            card at a time.
          </li>
          <li>
            · The page says the agent cannot call renderer functions in this
            version whatever <code>allowedCallers</code> says, so the
            declarations are shown as exported rather than exercised.
          </li>
        </ul>
      </Callout>
    </>
  );
}
