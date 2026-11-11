"use client";

// Ported from the CPK-LangGraph-TS harness (itself ported from aws-strands-ts).
// The strands doc page is byte-identical to the langgraph-typescript one
// (diffed 2026-11-10). The page prints no Strands agent, so no agent stands
// behind these providers' runtime: chats fail (see the route callout).

import { standardUI } from "@copilotkit/react-core/v2/generative-ui";

import { DemoFrame } from "@/components/demo-frame";

import { GenUIDemo } from "../../_shared/genui-demo";
import { appUI as extendedUI } from "./extend";
import { appUI as omittedUI } from "./omit";
import { appUI as overriddenUI } from "./override";

export default function DemoPage() {
  return (
    <DemoFrame parentPath="/generative-ui/components/standard-catalog" subtitle="standardUI">
      <GenUIDemo
        variants={[
          {
            id: "standard",
            label: "standardUI as is",
            note: "All 69 standard components. maplibre-gl is installed, so Map draws a real map.",
            generativeUI: { ui: standardUI },
            welcome: "Try: show the Eiffel Tower and the Louvre on a map.",
          },
          {
            id: "extend",
            label: "extends + ProductCard",
            generativeUI: { ui: extendedUI },
            welcome: "Try: show a ProductCard for a $40 mug next to a chart of its weekly sales.",
          },
          {
            id: "omit",
            label: "omit Map / Video / HtmlView",
            generativeUI: { ui: omittedUI },
            welcome: "Try: show the Eiffel Tower and the Louvre on a map.",
          },
          {
            id: "override",
            label: "overrides Card → MyCard",
            generativeUI: { ui: overriddenUI },
            welcome: "Try: put a short summary of our three plans in a card.",
          },
        ]}
      />
    </DemoFrame>
  );
}
