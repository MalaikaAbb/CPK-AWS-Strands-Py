import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

const DEMO = "frontend/src/app/generative-ui/reasoning/_demo";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/reasoning" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Reasoning tokens as their own message type. When the agent streams{" "}
          <code>REASONING_MESSAGE_*</code> events, the chat draws them inline:
          by default in <code>CopilotChatReasoningMessage</code> (a
          &ldquo;Thinking…&rdquo; card that collapses to &ldquo;Thought for X
          seconds&rdquo;), or in your own component passed to{" "}
          <code>messageView.reasoningMessage</code>. The demo has the
          page&apos;s two demos as tabs: the zero-config default and a custom{" "}
          <code>ReasoningBlock</code> banner.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Explain step by step why the sky appears blue during the day but red at sunset.",
            ]}
            expect="Default tab: a 'Thinking…' card fills with the reasoning summary, then collapses to 'Thought for N seconds' above the answer. Custom tab: a tagged 'Reasoning' banner with the summary in italics."
            fail="An answer with no reasoning block: the model emitted no reasoning summary (needs a reasoning model on the Responses API), or the agent failed to start because OPENAI_API_KEY is unset."
          />
        </div>
      </Panel>

      <Callout tone="info" title="All published code, verbatim">
        <p>
          Both demos are the page&apos;s Code-tab source (the Strands showcase&apos;s{" "}
          <code>reasoning-default</code> and <code>reasoning-custom</code>).{" "}
          <code>reasoning-block.tsx</code> matches the page byte for byte. The
          agent, <code>backend/src/agents/reasoning_agent.py</code>, is the
          showcase&apos;s, unedited: a tool-free Strands agent on{" "}
          <code>OpenAIResponsesModel</code> (<code>gpt-6-luna</code>, overridable
          with <code>OPENAI_REASONING_MODEL</code>), with{" "}
          <code>reasoning: &#123; effort: &quot;medium&quot;, summary: &quot;detailed&quot; &#125;</code>.
          The showcase mounts one agent at <code>/reasoning/</code> for both
          ids; this repo&apos;s registry mounts the same factory under each id.
        </p>
        <p className="mt-2">
          Doc gap: both printed <code>page.tsx</code> files import and call a{" "}
          <code>./suggestions</code> hook, but the page never prints{" "}
          <code>suggestions.ts</code>. Those two lines are kept as{" "}
          <code>// doc:</code> comments, so the demos show no suggestion chips.
        </p>
      </Callout>

      <Callout tone="warn" title="Not run in this change">
        <p>
          It typechecks and the registry imports. The Responses-API model and{" "}
          <code>gpt-6-luna</code> haven&apos;t been exercised here.{" "}
          <code>build_reasoning_model</code> raises if{" "}
          <code>OPENAI_API_KEY</code> is unset, which takes down the whole agent
          server at startup rather than just this route.
        </p>
      </Callout>

      <Panel title="Source">
        <SourceCodeGroup
          files={[
            { file: `${DEMO}/reasoning-default/page.tsx` },
            { file: `${DEMO}/reasoning-custom/page.tsx` },
            { file: `${DEMO}/reasoning-custom/reasoning-block.tsx` },
            { file: "backend/src/agents/reasoning_agent.py" },
          ]}
        />
      </Panel>
    </>
  );
}
