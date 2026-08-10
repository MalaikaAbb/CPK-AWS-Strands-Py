"use client";

import { CopilotChat, useComponent } from "@copilotkit/react-core/v2";
import { z } from "zod";

import { DemoFrame } from "@/components/demo-frame";

const AGENT_ID = "gen-ui-display-only";

/**
 * The Display-only page's three snippets, run as one surface.
 *
 * All three are reproduced as printed: the typed `showWeather` card, the
 * untyped `showGreeting` shorthand, and the `agentId`-scoped variant. The only
 * addition is `agentId` on the first two — the page omits it because its
 * examples assume a single `default` agent, and this runtime has 25 named ones.
 *
 * None of them will fire. Nothing published for Strands documents how a
 * frontend tool reaches the agent; see the route page for the detail.
 */
const weatherSchema = z.object({
  city: z.string().describe("City name"),
  temperature: z.number().describe("Temperature in Fahrenheit"),
  condition: z.string().describe("Weather condition"),
});

function WeatherCard({
  city,
  temperature,
  condition,
}: z.infer<typeof weatherSchema>) {
  return (
    <div className="rounded-lg border p-4">
      <h3 className="font-semibold">{city}</h3>
      <p className="text-2xl">{temperature}°F</p>
      <p className="text-sm text-gray-500">{condition}</p>
    </div>
  );
}

export default function Page() {
  return (
    <DemoFrame
      parentPath="/generative-ui/your-components/display-only"
      subtitle={`agent: ${AGENT_ID}`}
    >
      <YourMainContent />
    </DemoFrame>
  );
}

function YourMainContent() {
  // Typed: the Zod schema is both the tool's parameter definition and the
  // component's prop types.
  useComponent({
    name: "showWeather",
    description: "Display a weather card for a city.",
    parameters: weatherSchema,
    render: WeatherCard,
    agentId: AGENT_ID,
  });

  // Untyped shorthand, for components that need no parameter schema.
  useComponent({
    name: "showGreeting",
    render: ({ message }: { message: string }) => (
      <div className="rounded border p-3 bg-blue-50">
        <p>{message}</p>
      </div>
    ),
    agentId: AGENT_ID,
  });

  return <CopilotChat agentId={AGENT_ID} className="h-full" />;
}
