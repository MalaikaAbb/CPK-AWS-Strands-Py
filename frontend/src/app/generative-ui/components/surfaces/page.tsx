// Ported from the CPK-LangGraph-TS harness (itself ported from aws-strands-ts).
// The strands doc page is byte-identical to the langgraph-typescript one
// (diffed 2026-11-10). The page prints only a TanStack BuiltInAgent; these
// providers' runtime runs the Strands `genui` agent instead (route callout).

import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

const BASE = "frontend/src/app/generative-ui/components/surfaces/demo-chat";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components/surfaces" />

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
          Generated UI can land outside the chat. A{" "}
          <code>GenerativeUISurface</code> marks an area of the page as a target
          with an id and a description the agent reads on every run; asking in
          the chat then changes that area. A target can restrict which catalog
          components may go in it, opt out of auto-scroll, or exist once per
          item.
        </p>
        <div className="mt-4 space-y-3">
          <TryIt
            prompts={[
              "Show me cheap running shoes in the featured row",
              "Show the featured products again",
            ]}
            expect="The first prompt replaces the page's own three-product row with an agent-rendered ProductGrid; the second deletes that surface and the fallback row comes back."
            fail="The grid appears in the chat instead of the featured row — the target's description never reached the agent."
          />
          <TryIt
            prompts={["Recommend two related shoes under the Trail Runner"]}
            expect="With Trail Runner selected, a grid fills the recommendations target for that product only. Switch product and the target is empty; switch back and it is still there."
          />
          <TryIt
            prompts={["(Limit tab) Put a table of shoe sizes in the featured area"]}
            expect="The agent cannot use Table there: it is not in this catalog nor in the target's components list, so it either builds ProductCards or explains it cannot."
          />
        </div>
      </Panel>

      <Panel title="The page's code">
        <SourceCodeGroup
          files={[
            { file: `${BASE}/featured-products.tsx` },
            { file: `${BASE}/targets.tsx` },
            { file: `${BASE}/surfaces.css` },
            { file: `${BASE}/catalog.ts` },
          ]}
        />
      </Panel>

      <Panel title="The demo" description="The provider config is the page's 'When a component fails' sample.">
        <SourceCodeGroup files={[{ file: `${BASE}/page.tsx` }]} />
      </Panel>

      <Callout tone="warn" title="Gaps and harness changes">
        <ul className="space-y-1.5">
          <li>
            · <code>Product</code>, <code>ProductRow</code> and the products
            list are used by <code>FeaturedProducts</code> but never defined.
            Supplied from <code>_shared/scaffolding.tsx</code>.
          </li>
          <li>
            · <code>./catalog</code> is imported but not printed on this page; it
            is taken to be the Catalogs page&apos;s <code>shopUI</code>, the
            only catalog with ProductGrid and ProductCard.
          </li>
          <li>
            · The one-line targets (<code>sidebar-notes</code>, per-product
            recommendations) are shown without a page around them; the layout is
            scaffolding, and the first scaffolding product stands in for the
            page&apos;s undefined <code>product</code>.
          </li>
          <li>
            · No page gives the agent products, and this repo doesn&apos;t add a
            products tool, so the model invents the products it renders.
          </li>
        </ul>
      </Callout>
    </>
  );
}
