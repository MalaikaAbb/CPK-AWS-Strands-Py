import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

const DIR = "frontend/src/app/custom-look-and-feel/reasoning-messages/_snippets";

export default function Page() {
  return (
    <>
      <RouteHeader path="/custom-look-and-feel/reasoning-messages" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The look of the reasoning card, part by part.{" "}
          <code>messageView.reasoningMessage</code> takes either sub-slots
          (<code>header</code>, <code>contentView</code>, <code>toggle</code>)
          or a whole component. The page shows a custom header (emoji, label,
          Show/Hide), a custom content area (monospace with a blinking cursor
          while streaming), and a render-prop layout that rearranges the
          built-in <code>header</code> and <code>toggle</code> in a yellow box.
          Each is a variant in the demo.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Explain step by step why the sky appears blue during the day but red at sunset.",
            ]}
            expect="Custom header: 🧠 while thinking, 💡 after, with a Show/Hide toggle on the right. Custom content: gray monospace text with a ▊ cursor while streaming. Render-prop: the default header and body inside a yellow bordered box."
            fail="The default card on every variant (the slot was ignored), or no reasoning block at all (the model sent no reasoning summary)."
          />
        </div>
      </Panel>

      <Callout tone="info" title="What's verbatim, and what's harness glue">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            The four snippets are byte-for-byte in <code>_snippets/</code>. Glue:
            imports (<code>custom-content.tsx</code> uses{" "}
            <code>CopilotChat</code> without importing it), trailing exports,
            and each snippet&apos;s bare <code>&lt;CopilotChat /&gt;</code>{" "}
            expression is left as printed.
          </li>
          <li>
            The page&apos;s two embedded demos (<code>reasoning-default</code>,{" "}
            <code>reasoning-custom</code>) are the same ones as the Reasoning
            page. Here the snippets run on its agent,{" "}
            <code>backend/src/agents/reasoning_agent.py</code> (showcase,
            verbatim), registered identically to that route.
          </li>
        </ul>
      </Callout>

      <Callout tone="warn" title="One snippet fails type-checking">
        <p>
          The render-prop example assigns a plain function component to{" "}
          <code>reasoningMessage</code>. In <code>@copilotkit/react-core</code>{" "}
          1.79.1 the slot is typed as{" "}
          <code>typeof CopilotChatReasoningMessage</code>, including its{" "}
          <code>Header</code> / <code>Content</code> / <code>Toggle</code>{" "}
          statics, so it fails TS2322. The line is kept under{" "}
          <code>@ts-expect-error</code>. The demo variant passes it with an{" "}
          <code>as unknown as</code> cast, which is type-only.
        </p>
      </Callout>

      <Panel title="Source">
        <SourceCodeGroup
          files={[
            { file: `${DIR}/slot-props.tsx` },
            { file: `${DIR}/custom-header.tsx` },
            { file: `${DIR}/custom-content.tsx` },
            { file: `${DIR}/render-prop.tsx` },
            { file: "frontend/src/app/custom-look-and-feel/reasoning-messages/demo-chat/page.tsx" },
          ]}
        />
      </Panel>
    </>
  );
}
