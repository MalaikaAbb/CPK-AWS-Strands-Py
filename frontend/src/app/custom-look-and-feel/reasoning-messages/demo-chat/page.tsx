"use client";

import { useState } from "react";
import {
  CopilotChat,
  CopilotChatReasoningMessage,
  CopilotKit,
} from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";
import { nestedInspectorSetting } from "@/lib/inspector";

import { CustomContent } from "../_snippets/custom-content";
import { CustomHeader } from "../_snippets/custom-header";
import { MyReasoningLayout } from "../_snippets/render-prop";

/**
 * The page's slot snippets (../_snippets, verbatim) mounted one at a time on
 * the reasoning agent the page's embedded demos use (`reasoning-default`,
 * backend/src/agents/reasoning_agent.py). Harness glue: this provider, the
 * variant switch, and the `as unknown as` cast on the render-prop layout,
 * whose published slot assignment fails type-checking (see the snippet file).
 */
const VARIANTS = [
  { id: "default", label: "Default card" },
  { id: "header", label: "Custom header" },
  { id: "content", label: "Custom content" },
  { id: "both", label: "Header + content" },
  { id: "render-prop", label: "Render-prop layout" },
] as const;

type VariantId = (typeof VARIANTS)[number]["id"];

function messageViewFor(variant: VariantId) {
  switch (variant) {
    case "header":
      return { reasoningMessage: { header: CustomHeader } };
    case "content":
      return { reasoningMessage: { contentView: CustomContent } };
    case "both":
      return { reasoningMessage: { header: CustomHeader, contentView: CustomContent } };
    case "render-prop":
      return {
        reasoningMessage:
          MyReasoningLayout as unknown as typeof CopilotChatReasoningMessage,
      };
    default:
      return undefined;
  }
}

export default function Page() {
  const [variant, setVariant] = useState<VariantId>("default");
  const messageView = messageViewFor(variant);

  return (
    <DemoFrame parentPath="/custom-look-and-feel/reasoning-messages" subtitle="agent: reasoning-default">
      <div className="flex h-full flex-col">
        <div className="flex shrink-0 flex-wrap gap-2 border-b border-slate-200 px-4 py-2 dark:border-slate-800">
          {VARIANTS.map((v) => (
            <button
              key={v.id}
              onClick={() => setVariant(v.id)}
              className={`rounded-md px-3 py-1 text-xs font-medium ${
                variant === v.id
                  ? "bg-[var(--accent)] text-white"
                  : "border border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-300"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
        <div className="min-h-0 flex-1" key={variant}>
          <CopilotKit
            runtimeUrl="/api/copilotkit"
            agent="reasoning-default"
            enableInspector={nestedInspectorSetting}
          >
            <CopilotChat
              agentId="reasoning-default"
              className="h-full"
              {...(messageView ? { messageView } : {})}
            />
          </CopilotKit>
        </div>
      </div>
    </DemoFrame>
  );
}
