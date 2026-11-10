"use client";

import { useState } from "react";

import { DemoFrame } from "@/components/demo-frame";

import HitlInChatDemo from "../_demo/hitl-in-chat/page";
import GenUiInterruptDemo from "../_demo/gen-ui-interrupt/page";

type Mode = "hitl-in-chat" | "gen-ui-interrupt";

/**
 * The HITL overview's two embedded demos, one at a time, each mounted as
 * published. Each brings its own `<CopilotKit runtimeUrl="/api/copilotkit">`,
 * so switching remounts the provider. Registered in `lib/inspector.ts`
 * NESTED_PROVIDER_ROUTES; the doc's providers pass no `enableInspector`.
 */
export default function Page() {
  const [mode, setMode] = useState<Mode>("hitl-in-chat");

  return (
    <DemoFrame parentPath="/human-in-the-loop/overview" subtitle={`agent: ${mode}`}>
      <div className="flex h-full flex-col">
        <div className="flex shrink-0 items-center gap-2 border-b border-slate-200 px-4 py-2 dark:border-slate-800">
          {(["hitl-in-chat", "gen-ui-interrupt"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-md px-3 py-1 text-xs font-medium ${
                mode === m
                  ? "bg-[var(--accent)] text-white"
                  : "border border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-300"
              }`}
            >
              {m === "hitl-in-chat" ? "useHumanInTheLoop (hitl-in-chat)" : "useInterrupt (gen-ui-interrupt)"}
            </button>
          ))}
        </div>
        <div className="min-h-0 flex-1 overflow-auto">
          {mode === "hitl-in-chat" ? <HitlInChatDemo key="a" /> : <GenUiInterruptDemo key="b" />}
        </div>
      </div>
    </DemoFrame>
  );
}
