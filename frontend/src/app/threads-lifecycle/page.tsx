import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/threads-lifecycle" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Where a <code>threadId</code> comes from, and what makes history come
          back. The page is mostly reference — of everything it publishes, one
          component is runnable, and that is the demo: reopening a known thread
          with <code>setActiveThreadId(id, {"{ explicit: true }"})</code>, and
          starting a clean one with <code>startNewThread()</code>.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Send a message, then watch threadId and explicit? in the readout",
              "Press New chat — the id changes and explicit? stays false",
              "Pick the earlier thread and press Open conversation, then try Set id, no replay",
            ]}
            expect="The readout tracks the live id. New chat mints a fresh one and clears the view. Open conversation flips explicit? to true and replays that thread's history; Set id, no replay sets the same id with explicit? false and shows the welcome screen instead — that contrast is the whole point of the two buttons."
            fail="Both Open buttons disabled and the picker reading 'No threads yet' — that is the unlicensed state, since the picker is fed by useThreads. The readout and New chat still work without a key, because those are pure client state. If a button does nothing at all and logs a warning, a threadId prop is shadowing the setters."
          />
        </div>
      </Panel>

      <Panel title="The lifecycle, in the page's own four steps">
        <ol className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <li>
            <strong>1. Mint.</strong> A chat mounting without a{" "}
            <code>threadId</code> generates one client-side — a UUID v4.
          </li>
          <li>
            <strong>2. Run.</strong> Messages and tool calls stream under that
            id, and are persisted as they happen <em>if</em> a server-side store
            is configured. A runtime with no persistence layer keeps nothing.
          </li>
          <li>
            <strong>3. Hydrate.</strong> Mounting <em>with</em> a known id
            connects and replays the persisted history into the UI.
          </li>
          <li>
            <strong>4. Switch / start.</strong> Change the active thread, or
            mint a fresh one and clear the view.
          </li>
        </ol>
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
          The resolution order for step 1 is worth knowing, highest first: an
          explicit <code>threadId</code> prop (authoritative — it also drives
          replay and disables the welcome screen), then a{" "}
          <code>setActiveThreadId</code> override, then an id inherited from a
          parent configuration provider, then a non-authoritative seed, then a
          fresh <code>randomUUID()</code>.
        </p>
      </Panel>

      <Panel title="The demo">
        <p className="mb-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Carried over from the llamaindex harness on request. The two doc pages
          are byte-identical apart from their slug, so nothing needed porting
          beyond <code>AGENT_ID</code>. It goes further than the page&apos;s own{" "}
          <code>ThreadControls</code> in two useful ways: it reads{" "}
          <code>threadId</code>, <code>hasExplicitThreadId</code> and{" "}
          <code>agentId</code> straight back off the configuration so you can
          watch the id move, and it wires{" "}
          <code>explicit: false</code> to its own button — the page describes
          that flag but never shows it being used.
        </p>
        <SourceCode file="frontend/src/app/threads-lifecycle/demo-chat/page.tsx" />
      </Panel>

      <Callout tone="warn" title="Auto-minted ids survive re-renders, not remounts">
        <p>
          The fallback id is computed with <code>useMemo</code>, so a{" "}
          <em>remount</em> — a changed React <code>key</code>, a parent
          unmount/remount, or StrictMode&apos;s double-mount in dev — produces a
          new id and <strong>silently starts a new conversation</strong>. The
          page&apos;s advice is to mint the id yourself and pass it as the prop
          if you need continuity. This is the kind of thing that looks like lost
          history and is actually a second thread.
        </p>
      </Callout>

      <Callout tone="warn" title="Pick one source of truth for the thread id">
        <p>
          <code>setActiveThreadId</code> and <code>startNewThread</code>{" "}
          <strong>no-op and log a warning</strong> when a <code>threadId</code>{" "}
          prop is present, because the prop shadows internal state. The demo
          therefore passes no <code>threadId</code> to{" "}
          <code>&lt;CopilotChat&gt;</code> — driving it imperatively and by prop
          at the same time is the documented way to get a silently dead button.
        </p>
        <p className="mt-2">
          A related trap the page flags: for a send you fire in the same
          handler, set <code>agent.threadId = id</code> directly.{" "}
          <code>setActiveThreadId</code> updates React state and only reaches
          the agent on the next render, so an immediate run would still use the
          previous thread.
        </p>
      </Callout>

      <Callout tone="warn" title="Three snippets on this page reference undefined symbols">
        <p>
          None of them is reconstructed here, so they are not in the demo:
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            <code>ThreadControls</code> calls{" "}
            <code>setActiveThreadId(existingId, …)</code> with a bare{" "}
            <code>existingId</code> the page never defines. The demo resolves it
            from a picker fed by <code>useThreads</code>, falling back to the
            most recent thread — which is where a real id would come from
            anyway.
          </li>
          <li>
            The &quot;mint up front&quot; and headless submit-time snippets both
            call <code>myApi.createThread()</code>, which stands in for your
            backend and has no implementation.
          </li>
          <li>
            The <code>identifyUser</code> snippet calls{" "}
            <code>verifyAppSession(request)</code>, likewise a stand-in. This
            repo uses the Quickstart&apos;s header-based{" "}
            <code>identifyUser</code> instead — see{" "}
            <code>lib/intelligence.ts</code>.
          </li>
        </ul>
      </Callout>

      <Panel title="CopilotKit threads are not your framework's checkpointer">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Two layers, correlated only by the shared <code>threadId</code>.
          CopilotKit threads hold the conversation list and the full AG-UI event
          history, managed by Intelligence and reachable through{" "}
          <code>useThreads</code>. Framework-native persistence holds
          framework-internal state and is managed by your agent. Configuring one
          does not create the other, and <code>useThreads</code> rename / archive
          / delete do not reach into the framework store unless your backend
          bridges them.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Worth noting for this integration specifically: the page&apos;s
          examples of the framework-native layer are all LangGraph
          (<code>AsyncPostgresSaver</code>, <code>compile(checkpointer=…)</code>)
          or ADK session services. Nothing on the page names a Strands
          equivalent, and <code>ag_ui_strands</code> is not mentioned — so on
          this integration the second layer is simply absent unless you add one.
        </p>
      </Panel>
    </>
  );
}
