import { RouteHeader } from "@/components/route-header";
import { Callout, CodeBlock, Panel } from "@/components/ui";

const MESSAGES = `// Before: message classes and type guards
const message = new TextMessage({
  role: MessageRole.Assistant,
  content: "Hello, how are you?",
});
if (message.isTextMessage()) { /* ... */ }

// After: plain objects, checked by role
const message = {
  role: "assistant",
  content: "Hello, how are you?",
};
if (message.role === "assistant") {
  console.log(message.content, message.toolCalls, message.image);
}`;

const ASSISTANT = `// subComponent (legacy) and generativeUI (new) both still work
export const AssistantMessage = (props: AssistantMessageProps) => {
  const { message } = props;
  return <div style={{ marginBottom: "0.5rem" }}>{message.generativeUI}</div>;
};`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/troubleshooting/migrate-to-1.10.X" />

      <Callout tone="info" title="A v1-era guide; this repo is on the v2 API">
        <p>
          1.10.X is a v1 release. Its examples import from{" "}
          <code>@copilotkit/react-ui</code> and use{" "}
          <code>useCopilotChat</code> / <code>useCopilotChatHeadless_c</code>,
          none of which this repo uses (it&apos;s on{" "}
          <code>@copilotkit/react-core/v2</code>, see Migrate to V2). Kept as
          reference.
        </p>
      </Callout>

      <Panel title="What the guide says">
        <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <li>
            Messages become plain objects instead of classes, and the{" "}
            <code>isTextMessage()</code>-style guards give way to checking{" "}
            <code>role</code>.
          </li>
          <li>
            Custom assistant messages can read <code>message.generativeUI</code>{" "}
            instead of the <code>subComponent</code> prop. Both keep working.
          </li>
          <li>
            A new headless hook, <code>useCopilotChatHeadless_c</code>, gives
            full control over chat rendering, including generative UI,
            suggestions and interrupts.
          </li>
          <li>Existing <code>useCopilotChat</code> code keeps working.</li>
        </ul>
        <div className="mt-4 space-y-3">
          <CodeBlock code={MESSAGES} filename="Message format (from the page, condensed)" language="tsx" />
          <CodeBlock code={ASSISTANT} filename="Custom assistant message (from the page)" language="tsx" />
        </div>
      </Panel>
    </>
  );
}
