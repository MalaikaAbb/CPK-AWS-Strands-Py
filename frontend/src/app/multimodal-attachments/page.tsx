import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/multimodal-attachments" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          One prop — <code>attachments={"{{ enabled: true }}"}</code> — adds a
          paperclip, drag-and-drop, thumbnails and a lightbox. Files are read as
          base64, packed into the message as AG-UI{" "}
          <code>InputContent</code> parts alongside the text, and forwarded to
          the model. GPT-4o is vision-capable, so images come back genuinely described
          rather than acknowledged. Audio parts it will refuse — the doc&apos;s
          own table flags that.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Attach a screenshot → 'What is in this image?'",
              "Attach a .zip → expect it to be rejected before sending",
            ]}
            expect="The image renders as a thumbnail in your message and the reply describes its actual contents. The .zip never sends; an amber banner names it with reason 'invalid-type'."
            fail="The reply describes the filename rather than the picture — the model received text, not an image part."
          />
        </div>
      </Panel>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/multimodal-attachments/demo-chat/page.tsx" />
      </Panel>

      <Panel title="AttachmentsConfig">
        <dl className="space-y-2 text-sm">
          {[
            ["enabled", "Turns the feature on. This is the only required field."],
            ["accept", "MIME filter. Defaults to */* — patterns like image/* or .pdf,.docx work."],
            ["maxSize", "Byte ceiling. Defaults to 20MB; this route sets 5MB."],
            ["onUpload", "Replace the default base64 reader — upload to your own storage and return a URL instead."],
            ["onUploadFailed", "Fires on invalid-type, file-too-large, or upload-failed."],
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

      <Callout tone="info" title="Two failure paths, two handlers">
        <p>
          <code>onUploadFailed</code> catches problems <em>before</em> the
          message is sent — wrong type, too big, upload threw. Problems{" "}
          <em>after</em> it is sent — most often a model that cannot accept that
          modality — arrive as a <code>RUN_ERROR</code> and need{" "}
          <code>onError</code>. Both are wired on this route; without the first
          one a rejected file simply vanishes with no explanation.
        </p>
      </Callout>

    
    </>
  );
}
