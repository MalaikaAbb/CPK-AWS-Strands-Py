"use client";

import { useCallback, useState } from "react";
import { useAgent, useCopilotKit } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

const AGENT_ID = "programmatic-control";

export default function Page() {
  return (
    <DemoFrame
      parentPath="/programmatic-control"
      subtitle={`agent: ${AGENT_ID}`}
    >
      <AgentTrigger agentId={AGENT_ID} />
    </DemoFrame>
  );
}

function AgentTrigger({ agentId }: { agentId: string }) {
  const { agent } = useAgent({ agentId });
  const { copilotkit } = useCopilotKit();

  // Stores logs so they can be displayed directly in the UI.
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();

    setLogs((previousLogs) => [...previousLogs, `[${timestamp}] ${message}`]);
  }, []);

  const run = async () => {
    addLog("Run agent clicked.");

    if (agent.isRunning) {
      addLog("Agent is already running. Ignoring request.");
      return;
    }

    addLog("Adding user message to agent.");

    agent.addMessage({
      id: crypto.randomUUID(),
      role: "user",
      content: "Summarize the latest sales data",
    });

    addLog("User message added successfully.");
    addLog("Calling copilotkit.runAgent().");

    try {
      await copilotkit.runAgent({ agent });

      addLog("copilotkit.runAgent() completed successfully.");
    } catch (error) {
      addLog(
        `copilotkit.runAgent() failed: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );

      console.error("CopilotKit runAgent failed:", error);
    }
  };

  const stop = () => {
    addLog("Stop agent clicked.");

    if (!agent.isRunning) {
      addLog("Agent is not currently running. Nothing to stop.");
      return;
    }

    try {
      copilotkit.stopAgent({ agent });

      addLog("copilotkit.stopAgent() called successfully.");
    } catch (error) {
      addLog(
        `copilotkit.stopAgent() failed: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );

      console.error("CopilotKit stopAgent failed:", error);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      {/* Programmatic controls */}
      <div className="flex gap-3">
        <button
          onClick={run}
          disabled={agent.isRunning}
          className="rounded-md border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Run agent
        </button>

        <button
          onClick={stop}
          disabled={!agent.isRunning}
          className="rounded-md border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Stop agent
        </button>

        <button onClick={clearLogs} className="rounded-md border px-4 py-2">
          Clear logs
        </button>
      </div>

      {/* Current agent state */}
      <div className="rounded-md border p-4">
        <h2 className="mb-2 font-semibold">Agent State</h2>

        <div className="text-sm">
          <div>
            <strong>Agent ID:</strong> {agentId}
          </div>

          <div>
            <strong>Running:</strong> {agent.isRunning ? "true" : "false"}
          </div>
        </div>
      </div>

      {/* Frontend logs */}
      <div className="flex min-h-0 flex-1 flex-col rounded-md border">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="font-semibold">Programmatic Control Logs</h2>

          <span className="text-sm text-muted-foreground">
            {logs.length} {logs.length === 1 ? "log" : "logs"}
          </span>
        </div>

        <div className="min-h-[300px] flex-1 overflow-y-auto p-4">
          {logs.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No logs yet. Click &quot;Run agent&quot; to start.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {logs.map((log, index) => (
                <div
                  key={`${log}-${index}`}
                  className="rounded-md border p-2 font-mono text-sm"
                >
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
