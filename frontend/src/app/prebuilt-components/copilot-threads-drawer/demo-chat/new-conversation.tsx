"use client";

// The two "Add your own New conversation button" snippets from
// https://docs.copilotkit.ai/strands/prebuilt-components/copilot-threads-drawer.
//
// `NewConversationButton` and `ControlledChat` are verbatim. Harness glue
// (not on the page): the `useState` import, which the controlled snippet uses
// without importing, and the `export`s so the demo page can mount them. The
// page's surrounding `Page` (its `<CopilotKitProvider runtimeUrl=...>`) is
// replaced by the demo's existing provider, as for the drawer's main sample.
import { useState } from "react";
import {
  CopilotChatConfigurationProvider,
  CopilotChat,
  CopilotThreadsDrawer,
  useCopilotChatConfiguration,
} from "@copilotkit/react-core/v2";

//#region new-conversation-button
export function NewConversationButton() {
  const configuration = useCopilotChatConfiguration(); // [!code highlight]

  return (
    <button
      type="button"
      onClick={() => configuration?.startNewThread()} // [!code highlight]
    >
      New conversation
    </button>
  );
}
//#endregion

//#region controlled-chat
export function ControlledChat() {
  const [threadId, setThreadId] = useState(() => crypto.randomUUID());
  const startNew = () => setThreadId(crypto.randomUUID());

  return (
    <CopilotChatConfigurationProvider threadId={threadId}>
      <CopilotThreadsDrawer
        onThreadSelect={(id) => setThreadId(id)}
        onNewThread={startNew}
      />
      <button type="button" onClick={startNew}>
        New conversation
      </button>
      <CopilotChat />
    </CopilotChatConfigurationProvider>
  );
}
//#endregion
