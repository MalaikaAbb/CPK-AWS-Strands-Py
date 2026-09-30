"use client";

import { CopilotKit } from "@copilotkit/react-core/v2";

import { Chat } from "./chat";

/**
 * "Drop <CopilotChat /> into the page", from
 * https://docs.copilotkit.ai/strands/generative-ui/open-generative-ui
 *
 * The published block starts mid-function at `return (`, so the function
 * wrapper and the imports are harness-authored.
 *
 * One published line is commented out rather than run:
 *   openGenerativeUI={{ designSkill: VISUALIZATION_DESIGN_SKILL }}
 * `VISUALIZATION_DESIGN_SKILL` is never defined or imported anywhere on the
 * page. Kept live, it would type-fail and then throw `ReferenceError` on
 * render, taking the whole demo down; so the provider falls back to its
 * built-in default design skill. See the route's doc-gaps panel.
 */
export default function OpenGenUiDemo() {
  // #region minimal — verbatim except the line noted above
  // src/app/demos/open-gen-ui/page.tsx
  // Minimal Open Generative UI frontend: the built-in activity renderer is
  // registered by CopilotKitProvider, so a plain <CopilotChat /> is enough —
  // no custom tool renderers, no activity-renderer registration.
  // We DO pass `openGenerativeUI.designSkill` to swap in visualisation-tuned
  // guidance in place of the default shadcn design skill.
  return (
    <CopilotKit
      runtimeUrl="/api/copilotkit-ogui"
      agent="open-gen-ui"
      // HARNESS: undefined on the page — openGenerativeUI={{ designSkill: VISUALIZATION_DESIGN_SKILL }}
    >
      <div className="flex justify-center items-center h-screen w-full">
        <div className="h-full w-full max-w-4xl flex flex-col p-3">
          <Chat />
        </div>
      </div>
    </CopilotKit>
  );
  // #endregion
}
