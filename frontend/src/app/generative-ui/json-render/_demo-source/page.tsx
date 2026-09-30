// Verbatim from the `src/app/demos/declarative-json-render/page.tsx` code tab of the embedded demo on
// https://docs.copilotkit.ai/strands/generative-ui/json-render — not edited except for
// this header and any `@ts-expect-error` line (see the route's notes).
"use client";

import { CopilotKit } from "@copilotkit/react-core/v2";
import { AGENT_ID, Chat } from "./chat";

export default function ByocJsonRenderDemo() {
  return (
    <CopilotKit
      runtimeUrl="/api/copilotkit-declarative-json-render"
      agent={AGENT_ID}
    >
      <div className="flex justify-center items-center h-screen w-full">
        <div className="h-full w-full max-w-4xl">
          <Chat />
        </div>
      </div>
    </CopilotKit>
  );
}
