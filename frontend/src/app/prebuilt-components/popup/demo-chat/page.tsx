"use client";

import { CopilotPopup } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

/** The doc's `prebuilt-popup` demo, including its `labels` override. */
export default function Page() {
  return (
    <DemoFrame
      parentPath="/prebuilt-components/popup"
      subtitle="agent: prebuilt-popup"
    >
      <div className="h-full overflow-hidden">
        <MainContent />
        <CopilotPopup
          agentId="prebuilt-popup"
          defaultOpen={true}
          labels={{
            chatInputPlaceholder: "Ask the popup anything...",
          }}
        />
      </div>
    </DemoFrame>
  );
}

function MainContent() {
  return (
    <main className="h-full overflow-y-auto p-10">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
        Your app content
      </h1>
      <p className="mt-3 max-w-prose text-sm text-slate-600 dark:text-slate-400">
       CopilotKit Popup
      </p>
    </main>
  );
}
