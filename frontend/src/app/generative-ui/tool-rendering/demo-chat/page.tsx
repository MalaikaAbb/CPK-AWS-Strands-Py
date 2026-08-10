"use client";

import {
  CopilotChat,
  useDefaultRenderTool,
  useRenderTool,
} from "@copilotkit/react-core/v2";
import { z } from "zod";

import { DemoFrame } from "@/components/demo-frame";

import {
  CustomCatchallRenderer,
  WeatherCard,
  parseJsonResult,
} from "../weather-card";

const AGENT_ID = "tool-rendering";

interface WeatherResult {
  city?: string;
  temperature?: number;
  humidity?: number;
  wind_speed?: number;
  conditions?: string;
}

export default function Page() {
  return (
    <DemoFrame
      parentPath="/generative-ui/tool-rendering"
      subtitle={`agent: ${AGENT_ID}`}
    >
      <Chat />
    </DemoFrame>
  );
}

function Chat() {
  // Named renderer: `name` must equal the tool name the agent exposes — that
  // string is how the runtime routes the call to this component.
  useRenderTool(
    {
      name: "get_weather",
      parameters: z.object({
        location: z.string(),
      }),
      render: ({ parameters, result, status }) => {
        const loading = status !== "complete";
        const parsed = parseJsonResult<WeatherResult>(result);
        return (
          <WeatherCard
            loading={loading}
            location={parameters?.location ?? parsed.city ?? ""}
            temperature={parsed.temperature}
            humidity={parsed.humidity}
            windSpeed={parsed.wind_speed}
            conditions={parsed.conditions}
          />
        );
      },
    },
    [],
  );

  // Wildcard catch-all for anything a named renderer above did not claim.
  // `useDefaultRenderTool` is a convenience wrapper around
  // `useRenderTool({ name: "*", ... })`.
  useDefaultRenderTool(
    {
      render: ({ name, parameters, status, result }) => (
        <CustomCatchallRenderer
          name={name}
          parameters={parameters}
          status={status}
          result={result}
        />
      ),
    },
    [],
  );

  return <CopilotChat agentId={AGENT_ID} className="h-full" />;
}
