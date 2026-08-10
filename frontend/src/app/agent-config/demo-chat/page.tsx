"use client";

import {
  CopilotChat,
  useAgentContext,
} from "@copilotkit/react-core/v2";
import { useState } from "react";

import { DemoFrame } from "@/components/demo-frame";

const AGENT_ID = "agent-config";

type AgentConfig = {
  tone: string;
  expertise: string;
  responseLength: string;
};

const FIELDS: { key: keyof AgentConfig; label: string; options: string[] }[] = [
  { key: "tone", label: "Tone", options: ["professional", "playful", "blunt"] },
  {
    key: "expertise",
    label: "Expertise",
    options: ["beginner", "intermediate", "expert"],
  },
  {
    key: "responseLength",
    label: "Length",
    options: ["concise", "medium", "thorough"],
  },
];

/**
 * A typed config object the UI owns, mirrored to the agent as runtime context.
 *
 * The relay component is separate on purpose: `useAgentContext` re-publishes
 * whenever its value changes, so keeping it in its own component with a stable
 * object shape keeps the churn confined instead of spreading through the
 * settings UI.
 */
export default function Page() {
  const [config, setConfig] = useState<AgentConfig>({
    tone: "professional",
    expertise: "intermediate",
    responseLength: "concise",
  });

  return (
    <DemoFrame parentPath="/agent-config" subtitle={`agent: ${AGENT_ID}`}>
      <ConfigContextRelay config={config} />
      <div className="grid h-full grid-cols-1 lg:grid-cols-[22rem_1fr]">
        <aside className="min-h-0 overflow-y-auto border-b border-slate-200 p-6 lg:border-b-0 lg:border-r dark:border-slate-800">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Response preferences
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Published to the agent on every turn. Change one and ask the same
            question again.
          </p>

          <div className="mt-5 space-y-4">
            {FIELDS.map(({ key, label, options }) => (
              <div key={key}>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  {label}
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {options.map((option) => {
                    const active = config[key] === option;
                    return (
                      <button
                        key={option}
                        onClick={() => setConfig((c) => ({ ...c, [key]: option }))}
                        className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                          active
                            ? "bg-[var(--accent)] text-white"
                            : "border border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <pre className="mt-6 overflow-x-auto rounded-lg bg-slate-900 p-3 font-mono text-[11px] text-slate-100">
{JSON.stringify(config, null, 2)}
          </pre>
        </aside>

        <div className="min-h-0">
          <CopilotChat agentId={AGENT_ID} className="h-full" />
        </div>
      </div>
    </DemoFrame>
  );
}

function ConfigContextRelay({ config }: { config: AgentConfig }) {
  useAgentContext({
    description: "Agent response preferences",
    value: {
      tone: config.tone,
      expertise: config.expertise,
      responseLength: config.responseLength,
    },
  });
  return null;
}
