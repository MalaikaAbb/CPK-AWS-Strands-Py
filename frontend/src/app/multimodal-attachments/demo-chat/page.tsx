"use client";

import { CopilotChat } from "@copilotkit/react-core/v2";
import type { SyntheticEvent } from "react";
import { useState } from "react";

import { DemoFrame } from "@/components/demo-frame";

const AGENT_ID = "multimodal";

/**
 * `attachments={{ enabled: true }}` is the whole feature — the paperclip and
 * drag-and-drop appear, files become AG-UI content parts, and a vision-capable
 * model sees them.
 *
 * Everything else here is the page's *other* half: `accept`, `maxSize`, and
 * `onUploadFailed`, which is the only way to find out a file was rejected.
 */
export default function Page() {
  const [rejected, setRejected] = useState<string[]>([]);

  return (
    <DemoFrame parentPath="/multimodal-attachments" subtitle={`agent: ${AGENT_ID}`}>
      <div className="flex h-full flex-col">
        {rejected.length > 0 && (
          <ul className="shrink-0 space-y-1 border-b border-amber-300 bg-amber-50 px-4 py-2 text-xs text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
            {rejected.map((r, i) => (
              <li key={i}>⚠ {r}</li>
            ))}
          </ul>
        )}

        <div className="min-h-0 flex-1">
          <CopilotChat
            agentId={AGENT_ID}
            className="h-full"
            attachments={{
              enabled: true,
              // Omit `accept` to allow all types. Restricted here so the
              // rejection path is reachable without hunting for a huge file.
              accept: "image/*,application/pdf,text/plain",
              maxSize: 5 * 1024 * 1024,
              onUploadFailed: (error) => {
                setRejected((r) => [
                  ...r,
                  `${error.file?.name ?? "file"} — ${error.reason}: ${error.message}`,
                ]);
              },
            }}
            labels={{
              chatInputPlaceholder: "Drop an image or PDF, or paperclip one…",
            }}
            // The union is not optional. `CopilotChatProps` inherits the
            // div's `onError` alongside its own, so the prop's type is an
            // *intersection* of both handlers — the callback has to accept a
            // SyntheticEvent as well, and narrow. See README §9.
            onError={(
              event:
                | SyntheticEvent<HTMLDivElement>
                | { error: Error; code: string },
            ) => {
              if ("error" in event) {
                console.error(`[multimodal ${event.code}]`, event.error.message);
              }
            }}
          />
        </div>
      </div>
    </DemoFrame>
  );
}
