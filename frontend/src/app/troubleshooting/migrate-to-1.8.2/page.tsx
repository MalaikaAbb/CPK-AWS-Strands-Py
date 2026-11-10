import { RouteHeader } from "@/components/route-header";
import { Callout, CodeBlock, Panel } from "@/components/ui";

const THUMBS = `<CopilotChat
  onThumbsUp={(message) => console.log(message)}
  onThumbsDown={(message) => console.log(message)}
/>`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/troubleshooting/migrate-to-1.8.2" />

      <Panel title="What the guide says">
        <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <li>A new default look, built on theming variables.</li>
          <li>
            <code>onThumbsUp</code> / <code>onThumbsDown</code> on the chat
            components add feedback icons to each message.
          </li>
          <li>
            The <code>ResponseButton</code> prop is gone. Each message now has
            thumbs up, thumbs down, copy and regenerate buttons.
          </li>
          <li>
            Dark mode works out of the box, driven by the <code>.dark</code>{" "}
            class and <code>color-scheme</code>.
          </li>
        </ul>
        <div className="mt-4">
          <CodeBlock code={THUMBS} filename="Feedback handlers (from the page)" language="tsx" />
        </div>
      </Panel>

      <Callout tone="info" title="Where this is exercised in the harness">
        <p>
          The thumbs handlers run live on{" "}
          <a href="/prebuilt-components/chat-controls" className="text-[var(--accent)] underline underline-offset-4">
            Open, close, and feedback
          </a>
          , on the v2 <code>CopilotChat</code>. The page&apos;s interactive
          look-and-feel preview is a docs-site widget, not code, so it isn&apos;t
          reproduced. The page links to a generic{" "}
          <code>/custom-look-and-feel</code> guide rather than a Strands one.
        </p>
      </Callout>
    </>
  );
}
