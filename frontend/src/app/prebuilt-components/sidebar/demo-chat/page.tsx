"use client";

import { CopilotSidebar } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

/**
 * The doc's `prebuilt-sidebar` demo: main content and the sidebar as siblings,
 * so the panel slides out without reflowing the page.
 */
export default function Page() {
  return (
    <DemoFrame
      parentPath="/prebuilt-components/sidebar"
      subtitle="agent: prebuilt-sidebar"
    >
      <div className="h-full overflow-hidden">
        <MainContent />
        <CopilotSidebar agentId="prebuilt-sidebar" defaultOpen={true} />
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
        The sidebar is a sibling of this element
      </p>
    </main>
  );
}
