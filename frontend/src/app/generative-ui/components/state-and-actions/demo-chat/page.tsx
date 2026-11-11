"use client";

// Ported from the CPK-LangGraph-TS harness (itself ported from aws-strands-ts).
// The strands doc page is byte-identical to the langgraph-typescript one
// (diffed 2026-11-10). The page prints only a TanStack BuiltInAgent; these
// providers' runtime runs the Strands `genui` agent instead (route callout).

import { DemoFrame } from "@/components/demo-frame";

import { GenUIDemo } from "../../_shared/genui-demo";
import { shopUI as functionsShopUI } from "./functions-catalog";
import { shopUI as stateShopUI } from "./state-catalog";
import { DeclarationsSection, FunctionsSection, StateSection } from "./sections";
import { shopUI as writableUI } from "./writable-catalog";

export default function DemoPage() {
  return (
    <DemoFrame parentPath="/generative-ui/components/state-and-actions" subtitle="state · functions · writable">
      <GenUIDemo
        variants={[
          {
            id: "state",
            label: "App state (bind)",
            note: "The page's state catalog, as published (ProductCard only, no layout container).",
            generativeUI: { ui: stateShopUI },
            page: <StateSection />,
            welcome: "Try: show a product card for p1 Trail Runner.",
          },
          {
            id: "functions",
            label: "Run code on click",
            note: "The page's functions catalog, as published (ProductCard only, no layout container).",
            generativeUI: { ui: functionsShopUI },
            page: <FunctionsSection />,
            welcome: "Try: show a product card for p1 Trail Runner.",
          },
          {
            id: "writable",
            label: "Keep what the user types",
            generativeUI: { ui: writableUI },
            welcome: "Try: show a checkout form with the email set to me@example.com.",
          },
          {
            id: "declarations",
            label: "Who may call a function",
            noChat: true,
            page: <DeclarationsSection />,
          },
        ]}
      />
    </DemoFrame>
  );
}
