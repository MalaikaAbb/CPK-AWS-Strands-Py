import { RouteHeader } from "@/components/route-header";
import { SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

const DEMO = "frontend/src/app/shared-state/_demo/shared-state-read-write";

export default function Page() {
  return (
    <>
      <RouteHeader path="/shared-state" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Two-way shared state. The UI reads <code>agent.state</code> through{" "}
          <code>useAgent</code> with <code>OnStateChanged</code>, and writes
          back with <code>agent.setState</code>. A preferences card writes{" "}
          <code>preferences</code> into state for the agent&apos;s next turn,
          and the agent&apos;s <code>set_notes</code> tool fills a notes card,
          which has a Clear button that writes back again.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Remember that I prefer short answers and I'm learning Spanish.",
              "What do you know about my preferences?",
            ]}
            expect="Notes appear in the Agent Scratch pad as soon as set_notes fires; after you edit the name or tone in the preferences card, the next answer follows it; Clear empties the notes."
            fail="An empty notes card although the agent says it saved notes (no state snapshot reached the client), or answers that ignore the edited preferences."
          />
        </div>
      </Panel>

      <Callout tone="info" title="Where the code comes from">
        The page has no embedded demo, but its three snippets are cut from the
        showcase&apos;s <code>shared-state-read-write</code> frontend (the{" "}
        <code>useAgent</code> and <code>setState</code> regions of{" "}
        <code>page.tsx</code>, and <code>notes-card.tsx</code>). That demo is
        copied whole and verbatim.
      </Callout>

      <Callout tone="warn" title="The Strands backend is not on the page; borrowed from the GitHub showcase">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            The page skips its backend setup for Strands. The agent,{" "}
            <code>backend/src/agents/shared_state_rw_agent.py</code>, takes{" "}
            <code>set_notes</code>, its <code>state_from_args</code> hook, and the
            preferences context wrapper verbatim from CopilotKit&apos;s GitHub
            showcase. The builder is repo-authored.
          </li>
          <li>
            The write snippet&apos;s comment credits{" "}
            <code>PreferencesInjectorMiddleware</code> (LangGraph&apos;s). On
            Strands the showcase does it with <code>with_state_context</code>,
            which copies <code>state.preferences</code> into transient request
            context.
          </li>
          <li>
            <strong>Shared agent id:</strong> the published demo addresses{" "}
            <code>shared-state-read-write</code>, the same id as{" "}
            <code>/shared-state/rendering-in-app</code>. That registry entry
            now builds this borrowed agent instead of the tool-free Quickstart
            agent.
          </li>
        </ul>
      </Callout>

      <Panel title="Source">
        <SourceCodeGroup
          files={[
            { file: `${DEMO}/page.tsx` },
            { file: `${DEMO}/notes-card.tsx` },
            { file: "backend/src/agents/shared_state_rw_agent.py" },
          ]}
        />
      </Panel>
    </>
  );
}
