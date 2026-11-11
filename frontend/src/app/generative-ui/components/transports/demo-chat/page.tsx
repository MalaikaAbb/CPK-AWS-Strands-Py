"use client";

// Ported from the CPK-LangGraph-TS harness (itself ported from aws-strands-ts).
// The strands doc page is byte-identical to the langgraph-typescript one
// (diffed 2026-11-10). The page prints no Strands agent, so no agent stands
// behind these providers' runtime: chats fail (see the route callout).

import { DemoFrame } from "@/components/demo-frame";

import { GenUIDemo } from "../../_shared/genui-demo";
import { markdownTransport, someAgents, toolTransport } from "./configs";

/** The Transports page's runtime (`generativeUI: true`), not the shared one. */
const RUNTIME_URL = "/api/copilotkit-genui-transports";
const WELCOME = "Try: compare the Starter, Team, and Enterprise plans in a table.";

export default function DemoPage() {
  return (
    <DemoFrame parentPath="/generative-ui/components/transports" subtitle="tool · markdown · agentIds">
      <GenUIDemo
        variants={[
          {
            id: "tool",
            label: "Tool transport",
            note: "The agent calls render_ui; the table arrives as a separate tool-call message.",
            runtimeUrl: RUNTIME_URL,
            generativeUI: toolTransport,
            welcome: WELCOME,
          },
          {
            id: "markdown",
            label: "Markdown transport",
            note: "The agent writes ```a2ui blocks inside its reply; the table sits in the text.",
            runtimeUrl: RUNTIME_URL,
            generativeUI: markdownTransport,
            welcome: WELCOME,
          },
          {
            id: "default",
            label: "agentIds: [\"shop\"] — chat as default",
            note: "agentIds lists \"shop\", which this runtime doesn't register (the page never builds a shop agent). The chat talks to default, which is not in the list, so it should get no catalog and no guide.",
            runtimeUrl: RUNTIME_URL,
            generativeUI: someAgents,
            welcome: WELCOME,
          },
        ]}
      />
    </DemoFrame>
  );
}
