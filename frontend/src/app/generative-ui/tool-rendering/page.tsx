import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/tool-rendering" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A real backend tool, drawn as a branded card instead of raw JSON. The
          renderer sees three things — the parsed arguments, a live{" "}
          <code>status</code>, and the <code>result</code> once it lands — which
          is enough to show what is being fetched <em>while</em> it is being
          fetched, not just afterwards.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Named renderers and a wildcard compose: the interesting tools get
          their own components, and one catch-all handles everything else. The
          demo wires both.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["What's the weather in Tokyo?", "How about São Paulo?"]}
            expect="A sky-blue card appears with the city name and 'Calling weather API…', then fills in with 68°, Sunny, humidity and wind. The reply does not restate the numbers. Ask about flights instead and you get prose — search_flights has a renderer but no backend tool."
            fail="Raw JSON or the generic catch-all card in place of the WeatherCard — the renderer's name does not match the tool's name."
          />
        </div>
      </Panel>

      <Panel title="The renderers">
        <SourceCode file="frontend/src/app/generative-ui/tool-rendering/demo-chat/page.tsx" />
      </Panel>

      <Panel title="The components">
        <SourceCode file="frontend/src/app/generative-ui/tool-rendering/weather-card.tsx" />
      </Panel>

      <Panel
        title="The backend tool"
        description="The one tool any Strands page prints — and the one line of it that is missing."
      >
        <p className="mb-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Note - get_weather_impl() is MISSING in docs
        </p>
        <SourceCodeGroup
          files={[
            { file: "backend/src/agents/doc_tools.py", region: "get-weather-tool" },
            { file: "backend/src/agents/doc_tools.py", region: "get-weather-impl" },
            { file: "backend/src/agents/chat_agents.py", region: "tool-rendering-agent" },
          ]}
          note="The third file is the step no Strands page shows: `tools=[get_weather]` on a Strands Agent. That is plain Strands SDK, not a CopilotKit API, but the composition is this repo's — which is why this route still carries a doc-gap panel despite working."
        />
      </Panel>
    </>
  );
}
