"use client";

import { CopilotChat } from "@copilotkit/react-core/v2";

/**
 * The Markdown Rendering page's three `markdownRenderer` examples, one
 * component each. Source: https://docs.copilotkit.ai/strands/custom-look-and-feel/markdown
 * (fetched 2026-09-30). The page is frontend-only; it prints no backend code,
 * and any chat agent serves it — here `chat_agents.markdown_agent`.
 *
 * Each `messageView` value is the page's snippet verbatim. The only addition is
 * `agentId="chat-markdown"`, which every demo in this harness passes because
 * there is one root provider serving many agents.
 *
 * `my-link` and `my-heading` are the page's class names. The page defines no
 * CSS for them, and neither does this repo, so the first example changes
 * nothing you can see. Check it in DevTools instead: the `<a>` and `<h2>` should
 * carry the class and should NOT carry `data-streamdown`.
 */

// "Restyle individual HTML tags"
export function Chat() {
  return (
    <CopilotChat
      agentId="chat-markdown"
      messageView={{
        assistantMessage: {
          markdownRenderer: {
            components: {
              a: ({ node, children, ...props }) => (
                <a {...props} className="my-link">
                  {children}
                </a>
              ),
              h2: ({ node, children, ...props }) => (
                <h2 {...props} className="my-heading">
                  {children}
                </h2>
              ),
            },
          },
        },
      }}
    />
  );
}

// "Restyle the whole markdown block"
export function ClassStringChat() {
  return (
    <CopilotChat
      agentId="chat-markdown"
      messageView={{
        assistantMessage: { markdownRenderer: "text-sm leading-7" },
      }}
    />
  );
}

// "Replace the renderer"
const PlainText = ({ content }: { content: string }) => (
  <pre className="whitespace-pre-wrap">{content}</pre>
);

export function PlainTextChat() {
  return (
    <CopilotChat
      agentId="chat-markdown"
      messageView={{ assistantMessage: { markdownRenderer: PlainText } }}
    />
  );
}
