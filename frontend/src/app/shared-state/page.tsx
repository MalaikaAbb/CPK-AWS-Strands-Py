import { RouteHeader } from "@/components/route-header";
import { Callout, CodeBlock, Panel } from "@/components/ui";

// The three snippets the page prints for Strands, verbatim from the rendered
// page (https://docs.copilotkit.ai/strands/shared-state). Each is a fragment
// of the showcase's shared-state-read-write demo, not a whole file.
const USE_AGENT = "  // Subscribe the component to agent state changes. Any time the agent\n  // mutates its state (e.g. via its `set_notes` tool) this hook fires,\n  // we re-render, and the sidebar panels reflect the new values.\n  const { agent } = useAgent({\n    agentId: \"shared-state-read-write\",\n    updates: [UseAgentUpdate.OnStateChanged],\n  });";

const SET_STATE = "  // WRITE: every edit in the sidebar goes straight into agent state.\n  // On the agent's next turn, `PreferencesInjectorMiddleware` reads this\n  // back out of state and adds it to the system prompt \u2014 so the UI's\n  // writes visibly steer the model.\n  const handlePreferencesChange = (next: Preferences) => {\n    agent.setState({\n      preferences: next,\n      notes, // preserve what the agent has written\n    } as RWAgentState);\n  };";

const NOTES_CARD = "// Read-side render: this card reflects the agent-authored `notes` slice\n// of shared state. The parent page passes `state.notes` in; we never\n// touch agent state ourselves \u2014 we just render it. The Clear button is\n// a small write-back, exposed as an `onClear` prop.\nexport function NotesCard({ notes, onClear }: NotesCardProps) {\n  return (\n    <Card data-testid=\"notes-card\" className=\"w-full\">\n      <CardHeader>\n        <div className=\"flex items-start justify-between gap-3\">\n          <div className=\"space-y-1.5\">\n            <CardTitle>Agent Scratch pad</CardTitle>\n            <CardDescription>\n              The agent writes here via its{\" \"}\n              <code className=\"font-mono text-[11px] text-[#010507]\">\n                set_notes\n              </code>{\" \"}\n              tool. The UI re-renders from shared state.\n            </CardDescription>\n          </div>\n          {notes.length > 0 && (\n            <Button\n              type=\"button\"\n              onClick={onClear}\n              data-testid=\"notes-clear-button\"\n              variant=\"destructive\"\n              size=\"sm\"\n              className=\"uppercase tracking-[0.14em] text-[10px]\"\n            >\n              Clear\n            </Button>\n          )}\n        </div>\n      </CardHeader>\n\n      <CardContent>\n        {notes.length === 0 ? (\n          <div\n            data-testid=\"notes-empty\"\n            className=\"text-sm text-[#838389] italic min-h-[160px] flex items-center justify-center text-center px-4 border border-dashed border-[#E9E9EF] rounded-xl bg-[#FAFAFC]\"\n          >\n            the agent will make observations about you and note them here!\n          </div>\n        ) : (\n          <ul\n            data-testid=\"notes-list\"\n            className=\"space-y-2 text-sm text-[#010507]\"\n          >\n            {notes.map((note, i) => (\n              <li\n                key={i}\n                data-testid=\"note-item\"\n                className=\"flex gap-2 rounded-lg border border-[#E9E9EF] bg-[#FAFAFC] px-3 py-2\"\n              >\n                <span className=\"text-[#838389] font-mono text-xs leading-5 select-none\">\n                  {String(i + 1).padStart(2, \"0\")}\n                </span>\n                <span className=\"flex-1\">{note}</span>\n              </li>\n            ))}\n          </ul>\n        )}\n      </CardContent>\n    </Card>\n  );\n}";

export default function Page() {
  return (
    <>
      <RouteHeader path="/shared-state" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Two-way shared state: the UI reads <code>agent.state</code> through{" "}
          <code>useAgent</code> with <code>OnStateChanged</code> and writes back
          with <code>agent.setState</code>, while an agent tool fills a notes
          slice the UI renders.
        </p>
      </Panel>

      <Callout tone="warn" title="Reference only: the page prints fragments, no demo and no Strands backend">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Re-checked 2026-11-11: the page has no embedded demo or Code tab,
            and its backend setup is skipped for Strands. It prints three
            fragments (below): the <code>useAgent</code> call, the{" "}
            <code>handlePreferencesChange</code> write, and{" "}
            <code>NotesCard</code>.
          </li>
          <li>
            Doc gap: not printed are the page component that holds these
            fragments, the <code>Preferences</code> / <code>RWAgentState</code>{" "}
            / <code>NotesCardProps</code> types, the preferences card, the
            Card/Button primitives, and any agent (the <code>set_notes</code>{" "}
            tool, its state mapping, and whatever reads{" "}
            <code>preferences</code> back into the prompt). Nothing runs on
            this route.
          </li>
          <li>
            The write snippet&apos;s comment credits{" "}
            <code>PreferencesInjectorMiddleware</code>, which is
            LangGraph&apos;s; no Strands equivalent is printed.
          </li>
        </ul>
      </Callout>

      <Panel title="Published code (verbatim)">
        <div className="space-y-4">
          <CodeBlock code={USE_AGENT} language="typescript" filename="useAgent (read)" />
          <CodeBlock code={SET_STATE} language="typescript" filename="agent.setState (write)" />
          <CodeBlock code={NOTES_CARD} language="tsx" filename="NotesCard" />
        </div>
      </Panel>
    </>
  );
}
