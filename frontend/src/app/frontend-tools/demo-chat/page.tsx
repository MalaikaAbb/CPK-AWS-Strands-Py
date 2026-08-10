"use client";

import { CopilotSidebar, useFrontendTool } from "@copilotkit/react-core/v2";
import { useState } from "react";
import { z } from "zod";

import { DemoFrame } from "@/components/demo-frame";

const AGENT_ID = "frontend_tools";
const DEFAULT_BACKGROUND =
  "linear-gradient(135deg, #eef2ff 0%, #f8fafc 60%, #ecfeff 100%)";

/**
 * A tool the agent calls that runs in the browser.
 *
 * The handler is ordinary React code with a closure over `setBackground` — it
 * can touch component state, browser APIs, anything the page can. Its return
 * value goes back to the agent as the tool result, which is how the model
 * knows the call succeeded and can say so.
 */
export default function Page() {
  return (
    <DemoFrame parentPath="/frontend-tools" subtitle={`agent: ${AGENT_ID}`}>
      <Chat />
    </DemoFrame>
  );
}

function Chat() {
  const [background, setBackground] = useState<string>(DEFAULT_BACKGROUND);

  useFrontendTool({
    name: "change_background",
    description:
      "Change the page background. Accepts any valid CSS background value — colors, linear or radial gradients, etc.",
    parameters: z.object({
      background: z
        .string()
        .describe("The CSS background value. Prefer gradients."),
    }),
    handler: async ({ background }) => {
      setBackground(background);
      return { status: "success" };
    },
    agentId: AGENT_ID,
  });

  return (
    <div className="h-full overflow-hidden transition-[background] duration-500" style={{ background }}>
      <main className="h-full overflow-y-auto p-10">
        <h1 className="text-2xl font-semibold text-slate-900">
          CopilotKit - Content
        </h1>
        <code className="mt-6 inline-block max-w-full break-all rounded-lg bg-white/70 px-3 py-2 font-mono text-xs text-slate-700 shadow-sm">
          {background}
        </code>
      </main>
      <CopilotSidebar agentId={AGENT_ID} defaultOpen />
    </div>
  );
}
