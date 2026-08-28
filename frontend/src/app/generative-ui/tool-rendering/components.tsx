/**
 * The card components for the tool-rendering renderers.
 *
 * `WeatherCard`, `FlightListCard`, `Flight` and `parseJsonResult` below are all
 * printed on the doc page as of the 2026-08-26 rewrite, which added them with
 * the note that the example "includes every component, type, and helper that
 * its renderers use". Before that they were this repo's reconstructions, so
 * this file got smaller and more faithful in the same edit.
 *
 * `CustomCatchallRenderer` at the bottom is still this repo's: the page shows
 * `useDefaultRenderTool({ render: … })` passing one, and never prints the
 * component itself.
 */

//#region weather-card
export interface WeatherCardProps {
  loading: boolean;
  location: string;
  temperature?: number;
  humidity?: number;
  windSpeed?: number;
  conditions?: string;
}

export function WeatherCard({
  loading,
  location,
  temperature,
  humidity,
  windSpeed,
  conditions,
}: WeatherCardProps) {
  return (
    <article className="rounded-xl border p-4">
      <h3 className="font-semibold">{location || "Weather"}</h3>
      {loading ? (
        <p>Fetching weather...</p>
      ) : (
        <dl>
          <div>
            <dt>Conditions</dt>
            <dd>{conditions ?? "--"}</dd>
          </div>
          <div>
            <dt>Temperature</dt>
            <dd>{temperature ?? "--"}&deg;F</dd>
          </div>
          <div>
            <dt>Humidity</dt>
            <dd>{humidity ?? "--"}%</dd>
          </div>
          <div>
            <dt>Wind</dt>
            <dd>{windSpeed ?? "--"} mph</dd>
          </div>
        </dl>
      )}
    </article>
  );
}
//#endregion

//#region flight-list-card
export interface Flight {
  airline?: string;
  flight?: string;
  depart?: string;
  arrive?: string;
  price_usd?: number;
}

export interface FlightListCardProps {
  loading: boolean;
  origin: string;
  destination: string;
  flights: Flight[];
}

export function FlightListCard({
  loading,
  origin,
  destination,
  flights,
}: FlightListCardProps) {
  return (
    <article className="rounded-xl border p-4">
      <h3 className="font-semibold">
        {origin || "?"} → {destination || "?"}
      </h3>
      {loading ? (
        <p>Searching...</p>
      ) : (
        <ul>
          {flights.map((flight, index) => (
            <li key={`${flight.flight ?? "flight"}-${index}`}>
              {flight.airline ?? "--"} {flight.flight ?? ""}:{" "}
              {flight.depart ?? "?"} → {flight.arrive ?? "?"}
              {flight.price_usd !== undefined ? ` ($${flight.price_usd})` : ""}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
//#endregion

//#region parse-json-result
export function parseJsonResult<T>(result: unknown): T {
  if (!result) return {} as T;

  try {
    return (typeof result === "string" ? JSON.parse(result) : result) as T;
  } catch {
    return {} as T;
  }
}
//#endregion

/**
 * This repo's. The page passes a `<CustomCatchallRenderer>` to
 * `useDefaultRenderTool` and never prints it.
 */
export type CatchallToolStatus = "executing" | "inProgress" | "complete";

export function CustomCatchallRenderer({
  name,
  parameters,
  status,
  result,
}: {
  name: string;
  parameters?: unknown;
  status: CatchallToolStatus;
  result?: unknown;
}) {
  return (
    <details className="rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-800">
      <summary className="cursor-pointer font-mono text-xs">
        <span className="font-semibold">{name}</span>
        <span className="ml-2 text-slate-500">
          {status === "complete" ? "done" : "running"}
        </span>
      </summary>
      <pre className="mt-2 overflow-x-auto text-[11px] text-slate-600 dark:text-slate-400">
        {JSON.stringify({ parameters, result }, null, 2)}
      </pre>
    </details>
  );
}
