"use client";

import { useState } from "react";

import { Providers as OpenAIProviders } from "./providers";
import { Providers as AnthropicProviders } from "./providers-anthropic";

const PROVIDERS = {
  openai: {
    label: "OpenAI",
    agent: "strands_agent",
    Providers: OpenAIProviders,
  },
  anthropic: {
    label: "Anthropic",
    agent: "strands_agent_anthropic",
    Providers: AnthropicProviders,
  },
} as const;

type ProviderId = keyof typeof PROVIDERS;

/**
 * Harness chrome, not the doc's: switches the demo between the Quickstart's
 * OpenAI agent and its "Using Anthropic instead" agent on one route.
 *
 * Each option is a complete `Providers` file, so the page is still bound
 * through the provider's `agent` prop alone. The `key` remounts the provider
 * on every switch — the chat starts fresh rather than carrying one agent's
 * thread into the other.
 */
export function ProviderSwitch({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState<ProviderId>("openai");
  const { Providers, agent } = PROVIDERS[active];

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 flex-wrap items-center gap-3 border-b border-slate-200 px-4 py-2 text-xs dark:border-slate-800">
        <div role="tablist" aria-label="Model provider" className="inline-flex rounded-md border border-slate-300 p-0.5 dark:border-slate-700">
          {(Object.keys(PROVIDERS) as ProviderId[]).map((id) => {
            const selected = id === active;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActive(id)}
                className={`rounded px-3 py-1 font-medium ${
                  selected
                    ? "bg-[var(--accent)] text-white"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                }`}
              >
                {PROVIDERS[id].label}
              </button>
            );
          })}
        </div>
        <span className="text-slate-500">
          agent: <code>{agent}</code> (set on the provider)
        </span>
      </div>
      <div className="min-h-0 flex-1">
        <Providers key={active}>{children}</Providers>
      </div>
    </div>
  );
}
