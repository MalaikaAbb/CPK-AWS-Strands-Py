// Repo-authored barrel. The page's hashbrown-renderer.tsx block imports
// `{ PieChart, BarChart } from "./charts"`, but its embedded demo only publishes
// `charts/pie-chart.tsx` and `charts/bar-chart.tsx` — no `charts/index`. This
// file supplies that one import path, pointing at the demo's verbatim copies.
export { PieChart } from "../_demo-source/charts/pie-chart";
export { BarChart } from "../_demo-source/charts/bar-chart";
