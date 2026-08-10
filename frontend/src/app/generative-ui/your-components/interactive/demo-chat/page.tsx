"use client";

import { CopilotChat, useHumanInTheLoop } from "@copilotkit/react-core/v2";
import { z } from "zod";

import { DemoFrame } from "@/components/demo-frame";

const AGENT_ID = "gen-ui-interactive";

/**
 * The Interactive page's one and only code block, run as-is.
 *
 * The page itself is two sentences plus a single React placeholder tag, so its
 * rendered body falls back to generic frontend-tool prose and this approval
 * example. It is reproduced with its unstyled markup intact — bare `<div>`,
 * `<pre>` and `<button>`, no classes — because dressing it up would hide how
 * little the page actually gives you.
 *
 * Two additions, both mechanical: `agentId`, since this runtime has no
 * `default` agent, and a `return` for the chat surface, since the snippet's
 * body is `// ...` on both sides of the hook.
 */
export default function Page() {
  return (
    <DemoFrame
      parentPath="/generative-ui/your-components/interactive"
      subtitle={`agent: ${AGENT_ID}`}
    >
      <InteractivePage />
    </DemoFrame>
  );
}

export function InteractivePage() {
  // ...

  useHumanInTheLoop({
    name: "humanApprovedCommand",
    description: "Ask human for approval to run a command.",
    parameters: z.object({
      command: z.string().describe("The command to run"),
    }),
    agentId: AGENT_ID,
    render: ({ args, respond, status }) => {
      if (status !== "executing") return <></>;
      return (
        <div>
          <pre>{args.command}</pre>
          <button onClick={() => respond?.(`Tell the user the command ran`)}>
            Approve
          </button>
          <button
            onClick={() => respond?.(`Tell the user the command wasn't run`)}
          >
            Deny
          </button>
        </div>
      );
    },
  });

  // ...

  return <CopilotChat agentId={AGENT_ID} className="h-full" />;
}
