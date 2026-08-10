import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/custom-look-and-feel/css" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Re-skinning the chat without touching a single component. Colour comes
          from the v2 shadcn design tokens set on <code>[data-copilotkit]</code>
          ; structure — padding, radius, type, the CLI-style prompt marker on
          user messages — comes from the <code>.copilotKit*</code> class hooks.
          Every rule is scoped under one wrapper class so nothing leaks into the
          rest of the harness.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Hello", "Write a two-line poem about CSS"]}
            expect="Messages sit on a warm parchment surface with square corners, your own messages render in mono with a → marker and a coloured left rule, and the accent is indigo rather than the default."
            fail="The default theme. Either the stylesheet was not imported or the wrapper class is missing from the element around the chat."
          />
        </div>
      </Panel>

      <Panel title="The stylesheet">
        <SourceCode file="frontend/src/app/custom-look-and-feel/css/theme.css" />
      </Panel>

      <Panel title="The demo">
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/custom-look-and-feel/css/demo-chat/page.tsx" },
          ]}
        />
      </Panel>

      <Panel title="The tokens worth knowing">
        <dl className="space-y-2 text-sm">
          {[
            ["--background / --foreground", "Base surface and primary text."],
            ["--primary / --primary-foreground", "Accent colour and text on it."],
            ["--muted / --muted-foreground", "Subtle backgrounds and de-emphasised text."],
            ["--border / --input / --ring", "Dividers, input borders, focus ring."],
            ["--radius", "Base corner radius; sm/md/lg/xl derive from it."],
          ].map(([name, desc]) => (
            <div key={name} className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
              <dt className="shrink-0 font-mono text-xs text-slate-900 sm:w-56 dark:text-slate-100">
                {name}
              </dt>
              <dd className="text-slate-600 dark:text-slate-400">{desc}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
          The full set — popover, accent, destructive, chart and sidebar
          variants — lives in{" "}
          <code>@copilotkit/react-core/v2/styles.css</code>.
        </p>
      </Panel>
    </>
  );
}
