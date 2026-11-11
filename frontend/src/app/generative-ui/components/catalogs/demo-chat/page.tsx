"use client";

// Ported from the CPK-LangGraph-TS harness (itself ported from aws-strands-ts).
// The strands doc page is byte-identical to the langgraph-typescript one
// (diffed 2026-11-10). The page prints no Strands agent, so no agent stands
// behind these providers' runtime: chats fail (see the route callout).

import { DemoFrame } from "@/components/demo-frame";

import { GenUIDemo } from "../../_shared/genui-demo";
import { shopUI } from "./catalog";
import { appUI } from "./combine";
import { ExportView } from "./export-view";
import { schemaLibrariesUI } from "./schema-libraries";

/**
 * Catalogs: one variant per catalog the page builds. Each mounts the
 * provider with `generativeUI={{ ui }}` exactly as the page's provider line
 * does, pointed at the harness's copy of the doc runtime.
 */
export default function DemoPage() {
  return (
    <DemoFrame parentPath="/generative-ui/components/catalogs" subtitle="createGenerativeUI">
      <GenUIDemo
        variants={[
          {
            id: "shop",
            label: "shopUI (Create a catalog)",
            note: "Only ProductGrid and ProductCard exist in this catalog — no standard components.",
            generativeUI: { ui: shopUI },
            welcome: "Try: show me three running shoes as product cards.",
          },
          {
            id: "combined",
            label: "appUI (Combine catalogs)",
            note: "standardUI + cartUI (scaffolding) + Hero, merged with extends.",
            generativeUI: { ui: appUI },
            welcome: "Try: show a hero titled 'Spring sale' and a cart badge with 3 items.",
          },
          {
            id: "schemas",
            label: "zod vs Valibot props",
            note: "Two components whose props come from different schema libraries. No layout container, so ask for one at a time.",
            generativeUI: { ui: schemaLibrariesUI },
            welcome: "Try: show a ValibotProductCard for a $40 mug.",
          },
          {
            id: "export",
            label: "exportA2UICatalog",
            noChat: true,
            page: <ExportView />,
          },
        ]}
      />
    </DemoFrame>
  );
}
