import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/custom-look-and-feel/slots" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Every chat component is assembled from named sub-components, and each
          one is just a prop. The same prop accepts three different things,
          which is what makes the system worth learning once:
        </p>
        <ol className="mt-3 space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
          <li>
            <strong>A string</strong> — Tailwind classes, merged into the
            default component&apos;s own.
          </li>
          <li>
            <strong>An object</strong> — props applied to the default component
            (<code>className</code>, <code>autoFocus</code>, event handlers,
            data attributes).
          </li>
          <li>
            <strong>A component</strong> — your own, replacing the default
            entirely and receiving the same props.
          </li>
        </ol>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Objects nest, so a slot can drill into its own sub-slots to any depth
          — <code>messageView.assistantMessage.copyButton</code> is a valid
          path. The demo uses all three levels at once.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Hello", "What did you just do?"]}
            expect="Before sending: a gradient welcome panel tagged 'slot: welcomeScreen'. After: each reply sits in a tinted card with a 'slot' badge, the message area is tinted, the composer is already focused, and the disclaimer under it is the custom one."
            fail="A default-looking chat, or a type error at build time — the slot casts are what let a hand-written component stand in for the default."
          />
        </div>
      </Panel>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/custom-look-and-feel/slots/demo-chat/page.tsx" />
      </Panel>

      <Panel title="Available slots">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          On all three chat components:
        </p>
        <dl className="mt-2 space-y-2 text-sm">
          {[
            ["messageView", "The message list container."],
            ["scrollView", "The scroll container with auto-scroll behaviour."],
            ["input", "The composer, with send and transcribe controls."],
            ["suggestionView", "The suggestion pills below the messages."],
            ["welcomeScreen", "The empty state. Pass false to disable it."],
          ].map(([name, desc]) => (
            <div key={name} className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
              <dt className="shrink-0 font-mono text-xs text-slate-900 sm:w-36 dark:text-slate-100">
                {name}
              </dt>
              <dd className="text-slate-600 dark:text-slate-400">{desc}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">
          Sidebar and Popup add <code>header</code> and{" "}
          <code>toggleButton</code>.
        </p>
      </Panel>

      <Callout tone="info" title="labels is not a slot">
        <p>
          It sits next to the slot props but works differently — it swaps
          strings, not components. Reach for it when the default component is
          right and only its wording is wrong. It is exercised on the{" "}
          <a
            href="/prebuilt-components/popup"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            Popup
          </a>{" "}
          route.
        </p>
      </Callout>
    </>
  );
}
