// "Custom Header" snippet from
// https://docs.copilotkit.ai/strands/custom-look-and-feel/reasoning-messages,
// verbatim between the markers. Harness glue: the trailing export.
// ---- verbatim ----
import { CopilotChat } from "@copilotkit/react-core/v2";
import "@copilotkit/react-core/v2/styles.css";

function CustomHeader({
  isOpen,
  label,
  hasContent,
  isStreaming,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isOpen?: boolean;
  label?: string;
  hasContent?: boolean;
  isStreaming?: boolean;
}) {
  return (
    <button
      className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium"
      {...props}
    >
      {isStreaming ? "🧠" : "💡"}
      <span>{label}</span>
      {hasContent && (
        <span className="ml-auto text-xs">{isOpen ? "Hide" : "Show"}</span>
      )}
    </button>
  );
}

<CopilotChat
  messageView={{
    reasoningMessage: { header: CustomHeader },
  }}
/>
// ---- end verbatim ----

export { CustomHeader };
