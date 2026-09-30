/**
 * The page's `frontend/src/app/json-render-renderer.tsx` block, verbatim
 * between the region markers
 * (https://docs.copilotkit.ai/strands/generative-ui/json-render).
 *
 * Repo-authored, above the region: the two imports the block uses and never
 * writes — the `AssistantMessage` type, and the three helpers `parseSpec`
 * calls (defined in ./spec-helpers.ts, also repo-authored).
 *
 * NOT fixed, on purpose: `<Renderer spec catalog>`. @json-render/react 0.21
 * takes `registry` (built with `defineRegistry`), not `catalog`, and reads
 * contexts only `<JSONUIProvider>` supplies. The line is kept as published
 * under a `@ts-expect-error`, so the route throws where the doc code breaks.
 */
import type { AssistantMessage } from "@copilotkit/react-core/v2";

import {
  stripCodeFencesAndPrelude,
  tolerantJsonParse,
  validateAgainstCatalog,
} from "./spec-helpers";

// #region renderer — verbatim
import { Renderer } from "@json-render/react";
import { catalog } from "./registry";

export function JsonRenderAssistantMessage({ message }: { message: AssistantMessage }) {
  const spec = parseSpec(message.content ?? "");
  if (!spec) return null;
  // @ts-expect-error doc API mismatch, kept as published — @json-render/react 0.21 <Renderer> has no `catalog` prop (it takes `registry`) and needs <JSONUIProvider>
  return <Renderer spec={spec} catalog={catalog} />;
}

function parseSpec(content: string) {
  const cleaned = stripCodeFencesAndPrelude(content);
  const partial = tolerantJsonParse(cleaned);
  return validateAgainstCatalog(partial);
}
// #endregion
