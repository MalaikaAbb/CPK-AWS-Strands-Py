"use client";

import { CopilotChat, useComponent } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

import { BarChart, barChartPropsSchema } from "../bar-chart";

const AGENT_ID = "gen-ui-tool-based";

export default function Page() {
  return (
    <DemoFrame parentPath="/generative-ui/tool-based" subtitle={`agent: ${AGENT_ID}`}>
      <Chat />
    </DemoFrame>
  );
}

function Chat() {
  // `useComponent` registers the component as a frontend tool. The name is
  // what the agent sees, so it is phrased as a verb — that is what makes the
  // model reach for it when the user asks for a visualisation.
  useComponent({
    name: "render_bar_chart",
    description: "Display a bar chart with labeled numeric values.",
    parameters: barChartPropsSchema,
    render: BarChart,
    agentId: AGENT_ID,
  });

  return <CopilotChat agentId={AGENT_ID} className="h-full" />;
}
