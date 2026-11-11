// "Custom Content" snippet from
// https://docs.copilotkit.ai/strands/custom-look-and-feel/reasoning-messages,
// verbatim between the markers. Harness glue: the CopilotChat import (the
// snippet uses it without importing) and the trailing export.
import { CopilotChat } from "@copilotkit/react-core/v2";
// ---- verbatim ----
function CustomContent({
  isStreaming,
  hasContent,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  isStreaming?: boolean;
  hasContent?: boolean;
}) {
  if (!hasContent && !isStreaming) return null;

  return (
    <div className="px-4 pb-3 text-sm text-gray-500 font-mono" {...props}>
      {children}
      {isStreaming && <span className="animate-pulse ml-1">▊</span>}
    </div>
  );
}

<CopilotChat
  messageView={{
    reasoningMessage: { contentView: CustomContent },
  }}
/>
// ---- end verbatim ----

export { CustomContent };
