"use client";

// Ported from the CPK-LangGraph-TS harness (itself ported from aws-strands-ts).
// The strands doc page is byte-identical to the langgraph-typescript one
// (diffed 2026-11-10). Harness glue points at this repo's Strands `genui` agent.

import { DemoFrame } from "@/components/demo-frame";

import { GenUIDemo } from "../../_shared/genui-demo";
import { appUI } from "./app-ui";

/**
 * The "After" provider: `generativeUI={{ ui: appUI }}`. Its runtime is the
 * shared one, which already matches "Runtime, after" — no A2UI option.
 */
export default function DemoPage() {
  return (
    <DemoFrame parentPath="/generative-ui/components/from-a2ui" subtitle="createGenerativeUI · after">
      <GenUIDemo
        variants={[
          {
            id: "after",
            label: "After",
            generativeUI: { ui: appUI },
            welcome: "Try: show a flight card from SFO (San Francisco) to JFK (New York) with a Book button.",
          },
        ]}
      />
    </DemoFrame>
  );
}
