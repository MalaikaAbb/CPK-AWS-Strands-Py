// "Render-Prop Children" snippet from
// https://docs.copilotkit.ai/strands/custom-look-and-feel/reasoning-messages,
// verbatim between the markers. Harness glue: the trailing export.
// ---- verbatim ----
import {
  CopilotChatReasoningMessage,
} from "@copilotkit/react-core/v2";
import { CopilotChat } from "@copilotkit/react-core/v2";
import "@copilotkit/react-core/v2/styles.css";

function MyReasoningLayout(props: React.ComponentProps<typeof CopilotChatReasoningMessage>) {
  return (
    <CopilotChatReasoningMessage {...props}>
      {({ header, toggle }) => (
        <div className="rounded-lg border bg-yellow-50 my-2">
          {header}
          {toggle}
        </div>
      )}
    </CopilotChatReasoningMessage>
  );
}

<CopilotChat
  messageView={{
    // @ts-expect-error verbatim doc code: the slot is typed as `typeof CopilotChatReasoningMessage` (with its Header/Content/Toggle statics), so a plain function component fails TS2322 in @copilotkit/react-core 1.79.1
    reasoningMessage: MyReasoningLayout,
  }}
/>
// ---- end verbatim ----

export { MyReasoningLayout };
