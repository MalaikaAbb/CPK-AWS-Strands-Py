"use client";

import { useState } from "react";

import { DemoFrame } from "@/components/demo-frame";

import ReasoningDefaultDemo from "../_demo/reasoning-default/page";
import ReasoningCustomDemo from "../_demo/reasoning-custom/page";

type Mode = "default" | "custom";

/**
 * The page's two demos, one at a time, each mounted as published. Each brings
 * its own `<CopilotKit runtimeUrl="/api/copilotkit">`, so switching remounts the
 * provider and starts a fresh conversation. Registered in `lib/inspector.ts`
 * NESTED_PROVIDER_ROUTES; the doc's providers pass no `enableInspector`, so the
 * package default applies.
 */
export default function Page() {
  const [mode, setMode] = useState<Mode>("default");

  return (
    <DemoFrame parentPath="/generative-ui/reasoning" subtitle={`agent: reasoning-${mode}`}>
      <div className="flex h-full flex-col">
        <div className="flex shrink-0 items-center gap-2 border-b border-slate-200 px-4 py-2 dark:border-slate-800">
          {(["default", "custom"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-md px-3 py-1 text-xs font-medium ${
                mode === m
                  ? "bg-[var(--accent)] text-white"
                  : "border border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-300"
              }`}
            >
              {m === "default" ? "Default card (reasoning-default)" : "Custom slot (reasoning-custom)"}
            </button>
          ))}
        </div>
        <div className="min-h-0 flex-1 overflow-auto">
          {mode === "default" ? <ReasoningDefaultDemo key="default" /> : <ReasoningCustomDemo key="custom" />}
        </div>
      </div>
    </DemoFrame>
  );
}
