import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";
import { THREADS_LICENSE_PRESENT } from "@/lib/threads";

export default function Page() {
  return (
    <>
      <RouteHeader path="/prebuilt-components/copilot-threads-drawer" />

      <Callout
        tone={THREADS_LICENSE_PRESENT ? "success" : "warn"}
        title={
          THREADS_LICENSE_PRESENT
            ? "License key present — the drawer should list threads"
            : "No license key — the drawer will render its locked view"
        }
      >
        <p>
          Threads need <strong>two</strong> credentials, introduced on different
          pages: <code>INTELLIGENCE_API_KEY</code> server-side, which makes the
          runtime store threads at all, and{" "}
          <code>publicLicenseKey</code> client-side, which this page passes
          inline as <code>ck_pub_...</code>. This repo reads the second from{" "}
          <code>NEXT_PUBLIC_COPILOTKIT_PUBLIC_LICENSE_KEY</code> and puts it on
          the app-wide provider.
        </p>
        <p className="mt-2">
          {THREADS_LICENSE_PRESENT
            ? "The client half is configured here. Check /copilot-runtime for whether the server half is too — the drawer needs both."
            : "Neither half is configured here, so the page's own License section applies: “Without a license key, the drawer shows a locked view in place of the list.” That locked view is what this route currently demonstrates."}
        </p>
      </Callout>

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A thread switcher with <strong>no active-thread state of your own</strong>.
          That is the page&apos;s actual claim and the thing worth testing: the
          drawer and <code>&lt;CopilotChat&gt;</code> share one{" "}
          <code>&lt;CopilotChatConfigurationProvider&gt;</code>, so selecting a
          row connects the chat to that thread and replays its history, and the
          &quot;New Conversation&quot; row resets to a fresh welcome screen —
          with no <code>threadId</code> tracked, no selection handler, and no
          props passed between the two.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Under the hood it is a React wrapper around a self-contained{" "}
          <code>copilotkit-threads-drawer</code> web component rendered in a
          shadow root, fed by <code>useThreads</code>. That is why it inherits
          your theme with no configuration, and why customisation goes through
          slots, <code>renderRow</code>, and <code>::part()</code> rather than
          ordinary CSS.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Send a message, then click New Conversation and send another",
              "Click back to the first row",
            ]}
            expect="Two rows in the drawer, auto-named by the LLM after the first message of each. Clicking the first replays its history into the chat. Nothing in the demo tracks which thread is active."
            fail="A locked panel where the list should be — that is the no-license state, not a bug. With a key set, an empty list after sending means the runtime is in SSE mode: check /copilot-runtime."
          />
        </div>
      </Panel>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/prebuilt-components/copilot-threads-drawer/demo-chat/page.tsx" />
      </Panel>

      <Panel title="The props it takes, all optional">
        <dl className="space-y-2 text-sm">
          {[
            ["agentId", "Whose threads to list. Defaults to the chat configuration's agent — passed here because this runtime has no `default`."],
            ["label", "Accessible name for the drawer region and listbox. Defaults to \"Threads\"; the redesigned header has no visible title."],
            ["recentLabel", "Heading above the list. Defaults to \"Recent Conversations\"."],
            ["onThreadSelect", "Escape hatch to take over selection yourself."],
            ["onNewThread", "Escape hatch for the \"New Conversation\" row."],
            ["renderRow", "Custom content per row, keeping the row chrome, archived styling and kebab menu around it."],
            ["limit", "Page size. Shows a \"Load more\" control while more remain; omit to load all at once."],
          ].map(([name, desc]) => (
            <div key={name} className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
              <dt className="shrink-0 font-mono text-xs text-slate-900 sm:w-36 dark:text-slate-100">
                {name}
              </dt>
              <dd className="text-slate-600 dark:text-slate-400">{desc}</dd>
            </div>
          ))}
        </dl>
      </Panel>

      <Callout tone="info" title="Rename is not in the prebuilt drawer">
        <p>
          The row kebab menu covers archive, unarchive and delete. Rename exists
          as a <code>useThreads</code> action but the drawer does not surface it
          — the page says so twice. If you need it, that is the reason to drop
          to{" "}
          <a
            href="/headless-threads"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            Headless Threads
          </a>
          , where <code>renameThread</code> is one of the five returned
          mutations.
        </p>
      </Callout>

      <Callout tone="info" title="Customisation is bounded on purpose">
        <p>
          Because the drawer lives in a shadow root, ordinary descendant CSS
          does not reach it. The page names exactly three seams that do:{" "}
          <code>slot</code> attributes on projected children (
          <code>header</code>, <code>empty</code>, <code>footer</code>,{" "}
          <code>memories</code>, <code>launcher-icon</code>), the{" "}
          <code>renderRow</code> prop, and{" "}
          <code>::part()</code> plus <code>--cpk-drawer-*</code> tokens.
        </p>
      </Callout>
    </>
  );
}
