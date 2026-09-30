"use client";

import { useState } from "react";

import { DemoErrorBoundary } from "@/components/demo-error-boundary";
import { DemoFrame } from "@/components/demo-frame";

import ByocHashbrownDemo from "../_snippets/page";
import ByocHashbrownDemoSource from "../_demo-source/page";

type Mode = "doc snippets" | "doc demo source";

/**
 * The page publishes two versions of this example, and both are mounted here
 * unedited so they can be compared side by side:
 *
 *  - **doc snippets** — the prose code blocks (../_snippets). Its runtime is
 *    `/api/copilotkit-byoc-hashbrown` (repo-authored; the page never shows it).
 *  - **doc demo source** — the embedded demo's code tabs (../_demo-source),
 *    against the demo's own verbatim `/api/copilotkit-declarative-hashbrown` route.
 *
 * Each brings its own `<CopilotKit>`, so switching remounts the provider and
 * starts a fresh conversation. Only one is mounted at a time, which keeps this
 * route to a single Inspector (see lib/inspector.ts).
 */
export default function Page() {
  const [mode, setMode] = useState<Mode>("doc snippets");

  return (
    <DemoFrame parentPath="/generative-ui/hashbrown" subtitle="backend agent: byoc-hashbrown">
      <div className="flex h-full flex-col">
        <div className="flex shrink-0 items-center gap-2 border-b border-slate-200 px-4 py-2 dark:border-slate-800">
          {(["doc snippets", "doc demo source"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-md px-3 py-1 text-xs font-medium ${
                mode === m
                  ? "bg-[var(--accent)] text-white"
                  : "border border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-300"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <div className="min-h-0 flex-1 overflow-auto">
          {mode === "doc snippets" ? (
            <DemoErrorBoundary key="snippets">
              <ByocHashbrownDemo />
            </DemoErrorBoundary>
          ) : (
            <DemoErrorBoundary key="demo-source">
              <ByocHashbrownDemoSource />
            </DemoErrorBoundary>
          )}
        </div>
      </div>
    </DemoFrame>
  );
}
