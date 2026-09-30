// Doc demo source, unedited: src/app/demos/declarative-json-render/charts/chart-config.ts from the showcase app the embedded demo on
// https://docs.copilotkit.ai/strands/generative-ui/json-render is built from. Not one of
// the page's code tabs itself, but imported by tabs that are.
export const CHART_COLORS = [
  "#BEC2FF", // lilac-400
  "#85ECCE", // mint-400
  "#FFAC4D", // orange-400
  "#FFF388", // yellow-400
  "#189370", // mint-800
  "#EEE6FE", // primary-100
  "#FA5F67", // red-400
] as const;

export const CHART_CONFIG = {
  tooltipStyle: {
    backgroundColor: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    padding: "10px 14px",
    color: "var(--foreground)",
    fontSize: "13px",
    fontFamily: "var(--font-body)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
};
