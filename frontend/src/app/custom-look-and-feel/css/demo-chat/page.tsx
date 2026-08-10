"use client";

import { CopilotChat } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

// Importing the stylesheet from the page module is enough; Next bundles it
// with this route. Every rule inside is scoped to the wrapper class below.
import "../theme.css";

export default function Page() {
  return (
    <DemoFrame
      parentPath="/custom-look-and-feel/css"
      subtitle="agent: chat-customization-css"
    >
      <div className="chat-css-demo-scope h-full">
        <CopilotChat
          agentId="chat-customization-css"
          className="h-full"
          labels={{
            chatInputPlaceholder: "Type a message...",
          }}
        />
      </div>
    </DemoFrame>
  );
}
