import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/headless-threads" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The same data the prebuilt drawer runs on, with the UI left to you.{" "}
          <code>useThreads</code> returns the list plus five mutations —{" "}
          <code>renameThread</code>, <code>archiveThread</code>,{" "}
          <code>unarchiveThread</code>, <code>deleteThread</code>,{" "}
          <code>startNewThread</code> — and keeps the list synchronised over a
          WebSocket, so a thread created in another tab appears here without
          polling.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The reason to come here rather than use the{" "}
          <a
            href="/prebuilt-components/copilot-threads-drawer"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            drawer
          </a>{" "}
          is <strong>rename</strong>, which the drawer deliberately does not
          surface. Note the trade: the drawer needs no active-thread state,
          whereas this page&apos;s own example tracks{" "}
          <code>activeThreadId</code> in <code>useState</code> and passes it to{" "}
          <code>&lt;CopilotChat threadId&gt;</code> by hand.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Press + New conversation, then send a message",
              "Press it again and send a different message",
              "Click back to the first row",
            ]}
            expect="Each New conversation clears the chat to a welcome screen; sending gives it a row, auto-named by the LLM after the first message. Clicking an earlier row replays it. Rename sets the literal string 'Renamed' — the doc's own handler."
            fail="New conversation appears to do nothing and the console logs a warning about a prop-controlled threadId — that means the parent's threadId prop was not cleared first. An empty sidebar beside a working chat is the unlicensed state, not this."
          />
        </div>
      </Panel>

      <Panel title="The demo">
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/headless-threads/demo-chat/page.tsx", region: "app" },
            { file: "frontend/src/app/headless-threads/demo-chat/page.tsx", region: "thread-sidebar" },
          ]}
          note="The page's step-3 App and step-2 ThreadSidebar, with the step-4 pagination controls folded into the same hook call the page says to fold them into. Only the markup is this repo's — every hook member, the name fallback and the Load more control are the page's."
        />
      </Panel>

      <Callout tone="warn" title="New conversation is where the page's two patterns collide">
        <p>
          The button is <code>startNewThread()</code> off{" "}
          <code>useThreads</code> — not in this page&apos;s own destructure, but
          documented on the lifecycle page as &quot;also available from{" "}
          <code>useThreads()</code> for thread-sidebar UIs&quot;, which is
          exactly this. It is the headless equivalent of the row the prebuilt
          drawer gives you for free.
        </p>
        <p className="mt-2">
          What makes it awkward is that this page&apos;s step 3 drives the chat
          with <code>threadId={"{activeThreadId}"}</code>, and the lifecycle page
          warns that <code>startNewThread()</code>{" "}
          <strong>no-ops and logs a warning when the threadId is
          prop-controlled</strong> — &quot;pick one source of truth&quot;. Follow
          both pages literally and the button silently does nothing. So the
          handler clears the parent&apos;s <code>activeThreadId</code> back to{" "}
          <code>undefined</code> <em>before</em> minting, which is the same
          initial state step 3 starts from. Neither page mentions the other&apos;s
          constraint.
        </p>
      </Callout>

      <Callout tone="warn" title="The page's two snippets do not compose as printed">
        <p>
          Step 2 defines <code>function ThreadSidebar()</code> with no
          parameters. Step 3 then renders{" "}
          <code>&lt;ThreadSidebar onSelectThread={"{setActiveThreadId}"} /&gt;</code>
          . The prop appears only at the call site and is never added to the
          definition, so pasting both snippets gives you a sidebar that lists
          threads and cannot select one. The demo adds the parameter, which is
          the smallest change that makes step 3 mean what it says.
        </p>
      </Callout>

      <Callout tone="info" title="Archive is a soft delete; delete is not">
        <p>
          <code>archiveThread</code> keeps the row in the database and hides it
          from the list — pass <code>includeArchived: true</code> to see
          archived threads again, and <code>unarchiveThread</code> to restore
          one. <code>deleteThread</code> is permanent and irreversible. The page
          is explicit that <strong>neither has a confirmation dialog</strong>;
          the delete button in the demo fires immediately, exactly as published.
        </p>
      </Callout>

      <Panel
        title="The backend half"
        description="Already wired — this is the one thread page whose runtime snippet this repo could act on."
      >
        <p className="mb-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The page&apos;s step 1 is a <code>CopilotRuntime</code> carrying{" "}
          <code>intelligence</code> and <code>identifyUser</code>. That is the
          same configuration the Quickstart now prints, and this repo applies it
          to all three runtime endpoints from one module.
        </p>
        <SourceCode file="frontend/src/lib/intelligence.ts" />
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          Two options the page mentions and this repo does not set:{" "}
          <code>generateThreadNames: false</code> (names are auto-generated by
          the LLM after the first message, which is the behaviour worth seeing
          here) and the three thread-lock tunables —{" "}
          <code>lockTtlSeconds</code>, <code>lockHeartbeatIntervalSeconds</code>{" "}
          and <code>lockKeyPrefix</code>, which only matter once a Redis
          instance is shared between apps.
        </p>
      </Panel>
    </>
  );
}
