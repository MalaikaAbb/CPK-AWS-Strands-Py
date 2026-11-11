// "Customizing the Reasoning Message" snippet from
// https://docs.copilotkit.ai/strands/custom-look-and-feel/reasoning-messages,
// verbatim between the markers. Harness glue: the imports. The bare JSX
// expression is kept as printed; it is created once at import time and discarded.
import { CopilotChat } from "@copilotkit/react-core/v2";
import { CustomHeader } from "./custom-header";
import { CustomContent } from "./custom-content";
// ---- verbatim ----
<CopilotChat
  messageView={{
    reasoningMessage: {
      header: CustomHeader,
      contentView: CustomContent,
    },
  }}
/>
// ---- end verbatim ----
