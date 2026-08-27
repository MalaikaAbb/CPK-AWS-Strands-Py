"use client";

import {
  CopilotChat,
  useDefaultRenderTool,
  useRenderTool,
} from "@copilotkit/react-core/v2";
import { z } from "zod";

import { DemoFrame } from "@/components/demo-frame";

import {
  type CatchallToolStatus,
  CustomCatchallRenderer,
  type Flight,
  FlightListCard,
  WeatherCard,
  parseJsonResult,
} from "../components";

const AGENT_ID = "tool-rendering";

interface WeatherResult {
  city?: string;
  temperature?: number;
  humidity?: number;
  wind_speed?: number;
  conditions?: string;
}

interface FlightSearchResult {
  origin?: string;
  destination?: string;
  flights?: Flight[];
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

  // Named renderer #2: search_flights. Added by the 2026-08-26 rewrite, which
  // also published the FlightListCard it draws into. Nothing on the Strands
  // side exposes a search_flights tool, so this one registers and waits — the
  // page prints the renderer and never a matching backend tool.
  useRenderTool(
    {
      name: "search_flights",
      parameters: z.object({
        origin: z.string(),
        destination: z.string(),
      }),
      render: ({ parameters, result, status }) => {
        const parsed = parseJsonResult<FlightSearchResult>(result);
        return (
          <FlightListCard
            loading={status !== "complete"}
            origin={parameters?.origin ?? parsed.origin ?? ""}
            destination={parameters?.destination ?? parsed.destination ?? ""}
            flights={parsed.flights ?? []}
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
          status={status as CatchallToolStatus}
          result={result}
        />
      ),
    },
    [],
  );

  return <CopilotChat agentId={AGENT_ID} className="h-full" />;
}
