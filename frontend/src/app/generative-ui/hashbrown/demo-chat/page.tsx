"use client";

import { DemoErrorBoundary } from "@/components/demo-error-boundary";
import { DemoFrame } from "@/components/demo-frame";

import ByocHashbrownDemoSource from "../_demo-source/page";

/**
 * The page's demo source (../_demo-source), mounted unedited against its own
 * verbatim `/api/copilotkit-declarative-hashbrown` route. It brings its own
 * `<CopilotKit>`, so this route keeps a single Inspector (see lib/inspector.ts).
 *
 * Until 2026-11-10 the page also printed separate prose snippets with a
 * different Hashbrown API, mounted here as a second "doc snippets" mode. The
 * page now prints the demo source itself, so that mode was removed.
 */
export default function Page() {
  return (
    <DemoFrame parentPath="/generative-ui/hashbrown" subtitle="backend agent: byoc-hashbrown">
      <div className="h-full overflow-auto">
        <DemoErrorBoundary key="demo-source">
          <ByocHashbrownDemoSource />
        </DemoErrorBoundary>
      </div>
    </DemoFrame>
  );
}
