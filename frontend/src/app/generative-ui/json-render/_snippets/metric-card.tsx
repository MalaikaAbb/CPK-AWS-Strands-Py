// Repo-authored re-export. The page's registry.tsx block imports MetricCard
// from `./metric-card`; the page publishes that component in its embedded
// demo (`src/app/demos/declarative-json-render/metric-card.tsx`), reproduced
// verbatim in ../_demo-source. Its props are `{ label, value: string, trend }`,
// not the `{ title, value: number, delta }` the registry.tsx block's Zod schema
// describes — the two halves of the same page disagree.
export { MetricCard } from "../_demo-source/metric-card";
