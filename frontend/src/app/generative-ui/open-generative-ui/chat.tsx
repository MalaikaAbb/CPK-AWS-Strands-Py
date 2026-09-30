"use client";

import { CopilotChat } from "@copilotkit/react-core/v2";

/**
 * Harness-authored. Both Open Generative UI snippets render `<Chat />` and
 * the page never defines it. The minimal snippet's own comment says a plain
 * `<CopilotChat />` is enough, so that is all this is; the agent comes from
 * the surrounding `<CopilotKit agent=…>`. `className="h-full"` only so it fills
 * the doc's `h-full` column.
 */
export function Chat() {
  return <CopilotChat className="h-full" />;
}
