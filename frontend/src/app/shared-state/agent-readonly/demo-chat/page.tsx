"use client";

import { CopilotPopup, useAgentContext } from "@copilotkit/react-core/v2";
import { useState } from "react";

import { DemoFrame } from "@/components/demo-frame";

const AGENT_ID = "readonly-state-agent-context";

const ACTIVITIES = [
  "Opened the Q3 revenue dashboard",
  "Exported the churn report to CSV",
  "Commented on the Acme renewal thread",
  "Archived 12 closed-lost opportunities",
];

const TIMEZONES = [
  "America/Los_Angeles",
  "Europe/London",
  "Asia/Tokyo",
  "Australia/Sydney",
];

/**
 * `useAgentContext` publishes UI-owned values as a one-way channel. The agent
 * sees them on every turn; there is no setter and no tool to write them back,
 * so a confused model cannot "update" them.
 *
 * Think of it as props for the agent. Values re-publish when they change and
 * unregister automatically on unmount — which is exactly what you want for
 * "the record currently on screen".
 */
export default function Page() {
  return (
    <DemoFrame
      parentPath="/shared-state/agent-readonly"
      subtitle={`agent: ${AGENT_ID}`}
    >
      <DemoContent />
    </DemoFrame>
  );
}

function DemoContent() {
  const [userName, setUserName] = useState("Atai");
  const [userTimezone, setUserTimezone] = useState("America/Los_Angeles");
  const [recentActivity, setRecentActivity] = useState<string[]>([
    ACTIVITIES[0],
    ACTIVITIES[2],
  ]);

  // One call per value. The description is not a comment — the agent reads it
  // alongside the value, so treat it like a parameter docstring.
  useAgentContext({
    description: "The currently logged-in user's display name",
    value: userName,
  });
  useAgentContext({
    description: "The user's IANA timezone (used when mentioning times)",
    value: userTimezone,
  });
  useAgentContext({
    description: "The user's recent activity in the app, newest first",
    value: recentActivity,
  });

  const toggleActivity = (activity: string) => {
    setRecentActivity((current) =>
      current.includes(activity)
        ? current.filter((a) => a !== activity)
        : [activity, ...current],
    );
  };

  return (
    <div className="h-full overflow-hidden">
      <main className="h-full overflow-y-auto p-8">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          What the app tells the agent
        </h1>
        <p className="mt-2 max-w-prose text-sm text-slate-600 dark:text-slate-400">
          Everything below is published read-only. Change any of it and ask the
          agent again — it will see the new value on its next turn, but it has
          no way to change it itself.
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Display name
            </h2>
            <input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
            />
          </section>

          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Timezone
            </h2>
            <select
              value={userTimezone}
              onChange={(e) => setUserTimezone(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </section>
        </div>

        <section className="mt-6">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Recent activity
          </h2>
          <ul className="mt-1.5 space-y-1.5">
            {ACTIVITIES.map((activity) => {
              const on = recentActivity.includes(activity);
              return (
                <li key={activity}>
                  <button
                    onClick={() => toggleActivity(activity)}
                    className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                      on
                        ? "border-[var(--accent)] bg-blue-50 text-slate-900 dark:bg-blue-950/40 dark:text-slate-100"
                        : "border-slate-200 text-slate-500 dark:border-slate-800"
                    }`}
                  >
                    <span className="mr-2 font-mono text-[10px] uppercase">
                      {on ? "published" : "hidden"}
                    </span>
                    {activity}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      </main>

      <CopilotPopup
        agentId={AGENT_ID}
        defaultOpen={true}
        labels={{ chatInputPlaceholder: "Ask about your context..." }}
      />
    </div>
  );
}
