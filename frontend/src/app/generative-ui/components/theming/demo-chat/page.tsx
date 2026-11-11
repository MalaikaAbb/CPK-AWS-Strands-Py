"use client";

// Ported from the CPK-LangGraph-TS harness (itself ported from aws-strands-ts).
// The strands doc page is byte-identical to the langgraph-typescript one
// (diffed 2026-11-10). The page prints no Strands agent, so no agent stands
// behind these providers' runtime: chats fail (see the route callout).

import { DemoFrame } from "@/components/demo-frame";

import { GenUIDemo } from "../../_shared/genui-demo";
import { ColorSchemeScript } from "./dark-mode";
import { brandTheme, cssTheme, fileTheme, mapTheme, perModeTheme } from "./themes";
import "./theming.css";

const WELCOME = "Try: show a card with a primary button, a slider, and a bar chart of three months.";

export default function DemoPage() {
  return (
    <DemoFrame parentPath="/generative-ui/components/theming" subtitle="generativeUI.theme">
      <ColorSchemeScript />
      <GenUIDemo
        variants={[
          { id: "brand", label: "Provider theme", generativeUI: brandTheme, welcome: WELCOME },
          { id: "file", label: "GenerativeUITheme file", generativeUI: fileTheme, welcome: WELCOME },
          { id: "per-mode", label: "Colors per mode", generativeUI: perModeTheme, welcome: WELCOME },
          {
            id: "map",
            label: "Map style",
            note: "The page's mapStyle URLs are placeholders on tiles.example.com.",
            generativeUI: mapTheme,
            welcome: "Try: show the Eiffel Tower on a map.",
          },
          { id: "css", label: "CSS variables", generativeUI: cssTheme, welcome: WELCOME },
        ]}
      />
    </DemoFrame>
  );
}
