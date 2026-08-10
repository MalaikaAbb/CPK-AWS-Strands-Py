import { RouteHeader } from "@/components/route-header";
import { SourceCode, SourceCodeGroup } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/voice" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Speech into the composer. The user speaks, the runtime transcribes,
          and the transcript is submitted like any typed message. What makes it
          interesting is that <code>&lt;CopilotChat&gt;</code> takes no voice
          props at all — it grows a mic button because the runtime it is pointed
          at advertises <code>audioFileTranscriptionEnabled: true</code> on{" "}
          <code>/info</code>. The feature is configured entirely on the server.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Click 🎙 Try a sample audio, then send",
              "Click the mic in the composer and speak (needs OPENAI_API_KEY)",
            ]}
            expect="The sample button drops a question into the composer and the agent answers in one or two spoken-length sentences. With a key set, the mic records, transcribes, and auto-sends."
            fail="No mic button at all — the runtime has no transcriptionService, or basePath does not match the route directory."
          />
        </div>
      </Panel>

      <Callout tone="info" title="One key, two jobs">
        <p>
          Strands agents already run on OpenAI, so unlike other integrations
          there is no second provider to configure — the same{" "}
          <code>OPENAI_API_KEY</code> answers the chat and drives Whisper. It
          has to be visible to the <em>Next</em> process as well as the Python
          one, so set it in <code>frontend/.env.local</code> too. Without it the
          route still runs, because the sample-audio button bypasses{" "}
          <code>/transcribe</code> entirely, and clicking the mic returns a
          clear error rather than an opaque 500 because the service is wrapped
          in a guard.
        </p>
      </Callout>

      <Panel
        title="The runtime"
        description="Three things force this onto its own endpoint rather than the app-wide one."
      >
        <SourceCode file="frontend/src/app/api/copilotkit-voice/[[...slug]]/route.ts" />
      </Panel>

      <Panel title="The demo">
        <SourceCodeGroup
          files={[
            { file: "frontend/src/app/voice/demo-chat/page.tsx" },
            { file: "frontend/src/app/voice/sample-audio-button.tsx" },
          ]}
        />
      </Panel>

      <Panel title="Custom transcription backends">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          <code>TranscriptionService</code> from{" "}
          <code>@copilotkit/runtime/v2</code> is an abstract class — subclass it
          for AssemblyAI, Deepgram, a self-hosted Whisper, anything.{" "}
          <code>TranscriptionServiceOpenAI</code> from{" "}
          <code>@copilotkit/voice</code> is the reference implementation, and
          this route wraps it rather than replacing it. Wrapping is worth
          copying: an unconfigured credential otherwise surfaces as a 5xx from
          deep inside the provider SDK.
        </p>
      </Panel>

      <Callout tone="info" title="One extra hop, and the doc page shows it">
        <p>
          Agent runs take one more step here than in a TypeScript integration.
          This route registers <code>voice-demo</code> as an{" "}
          <code>HttpAgent</code> pointed at{" "}
          <code>{"${AGENT_URL}"}/voice/</code>, so the browser talks to{" "}
          <code>/api/copilotkit-voice</code> and the Next runtime forwards the
          run to the Python server. The doc page&apos;s own snippet writes the
          same URL with the same trailing slash — the only place in the Strands
          tree that acknowledges the mounted-sub-app form this harness relies on
          everywhere.
        </p>
      </Callout>
    </>
  );
}
