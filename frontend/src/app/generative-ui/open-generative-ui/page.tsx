import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

const DIR = "frontend/src/app/generative-ui/open-generative-ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/open-generative-ui" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          No component catalog at all: the model writes a small HTML/CSS/JS
          page itself, via a <code>generateSandboxedUi</code> tool call, and
          the chat shows it in a sandboxed iframe that fills in while the
          arguments stream. The runtime flag{" "}
          <code>openGenerativeUI.agents</code> attaches the middleware that
          turns that tool call into activity events; the provider supplies
          the tool and the renderer.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The <em>advanced</em> mode adds two host-page functions,{" "}
          <code>evaluateExpression</code> and <code>notifyHost</code>, that
          the generated page can call back into from inside the iframe, plus
          a design skill that makes the tool call mandatory.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "build me a simple greeting card",
              "(advanced) Build a calculator whose = button calls evaluateExpression",
              "(advanced) A button that sends 'hello from the sandbox' with notifyHost",
            ]}
            expect={
              <>
                Not yet observed in a browser on this repo — this is what the
                code path should produce. An iframe preview appears in the
                chat: placeholder text first, then styles, then the HTML
                streams in, then scripts run. In advanced mode, using the
                generated controls logs{" "}
                <code>[open-gen-ui/advanced] evaluateExpression …</code> or{" "}
                <code>[open-gen-ui/advanced] notifyHost: …</code> in the
                browser console.
              </>
            }
            fail={
              <>
                A plain-text reply and no iframe. In minimal mode that is
                plausible even when wiring is right: the agent carries only
                the Quickstart prompt and the page&apos;s custom design skill
                is undefined, so ask for a UI explicitly. If advanced mode also
                answers in prose, check the Network tab: requests must go to{" "}
                <code>/api/copilotkit-ogui</code>, and its <code>/info</code>{" "}
                response should report Open Generative UI as enabled.
              </>
            }
          />
        </div>
      </Panel>


      <Panel title="The runtime">
        <SourceCode file="frontend/src/app/api/copilotkit-ogui/[[...slug]]/route.ts" />
      </Panel>

      <Panel title="The frontend">
        <SourceCodeGroup
          files={[
            { file: `${DIR}/open-gen-ui.tsx` },
            { file: `${DIR}/open-gen-ui-advanced.tsx` },
            { file: `${DIR}/sandbox-functions.ts` },
            { file: `${DIR}/chat.tsx` },
          ]}
        />
      </Panel>

      <Panel title="The agents">
        <SourceCode
          file="backend/src/agents/gen_ui_agents.py"
          region="open-gen-ui-agents"
        />
      </Panel>

      <Callout tone="info" title="Why this works with no Strands wiring">
        <p>
          <code>generateSandboxedUi</code> is registered by the provider as a
          frontend tool, so it reaches the Strands agent through the same
          proxied-tool channel that <code>useFrontendTool</code> uses on the
          Frontend Tools route. The runtime-side middleware only watches the
          tool call&apos;s streamed arguments; the agent never needs to know
          it is special.
        </p>
      </Callout>
    </>
  );
}
