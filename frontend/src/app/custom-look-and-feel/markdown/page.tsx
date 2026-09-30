import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/custom-look-and-feel/markdown" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Assistant text is drawn by one slot,{" "}
          <code>messageView.assistantMessage.markdownRenderer</code>, and by
          default Streamdown fills it. The slot takes the same three shapes as
          every other slot, and each one does something different here. An
          object is passed through to Streamdown, so its <code>components</code>{" "}
          map swaps the element for a single tag. A string adds classes to the
          markdown container. A component takes over rendering completely and
          receives the raw markdown as <code>content</code>. The demo has one tab
          for each.
        </p>
        <div className="mt-4 space-y-3">
          <TryIt
            prompts={[
              "Reply with a level-2 markdown heading, then a paragraph containing a markdown link to https://copilotkit.ai",
            ]}
            expect={
              <>
                <b>components map:</b> in DevTools the heading is an{" "}
                <code>&lt;h2 class=&quot;my-heading&quot;&gt;</code> and the link
                is an <code>&lt;a class=&quot;my-link&quot;&gt;</code> with{" "}
                <code>target=&quot;_blank&quot;</code> and{" "}
                <code>rel=&quot;noopener noreferrer&quot;</code>. Neither has a{" "}
                <code>data-streamdown</code> attribute or a{" "}
                <code>node=&quot;[object Object]&quot;</code> attribute. There
                is no visible styling, because the page defines no CSS for
                those classes. <b>class string:</b> the markdown container has{" "}
                <code>text-sm leading-7</code> and the text is smaller, with
                looser line spacing. <b>PlainText:</b> the same reply is shown
                as raw text inside a <code>&lt;pre&gt;</code>, with the literal{" "}
                <code>##</code> and <code>[…](…)</code> markup.
              </>
            }
            fail={
              <>
                The components-map tab still shows{" "}
                <code>data-streamdown=&quot;link&quot;</code> on the anchor,
                which means the object form never reached Streamdown. Or the
                PlainText tab renders formatted HTML, which means the component
                was ignored. An &quot;agent not found&quot; error means{" "}
                <code>chat-markdown</code> is missing from the Python registry.
              </>
            }
          />
          <TryIt
            prompts={[
              'Repeat this exactly, raw, not in a code block: Hi <reference-chip id="42">Doc 42</reference-chip>. Press <kbd>Ctrl</kbd>+<kbd>C</kbd>. E=mc<sup>2</sup>',
            ]}
            expect={
              <>
                On the components-map tab, <code>&lt;reference-chip&gt;</code> is
                removed but its text <em>Doc 42</em> stays. <code>&lt;kbd&gt;</code>{" "}
                and <code>&lt;sup&gt;</code> render as real elements. Whether the
                model echoes the tags unaltered is up to the model — if it wraps
                them in a code block, ask again.
              </>
            }
            fail="A <reference-chip> element appears in the DOM, which means sanitization was bypassed."
          />
        </div>
      </Panel>

      <Panel
        title="The three examples"
        description="Each messageView value is the page's snippet verbatim, with agentId added."
      >
        <SourceCode file="frontend/src/app/custom-look-and-feel/markdown/examples.tsx" />
      </Panel>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/custom-look-and-feel/markdown/demo-chat/page.tsx" />
      </Panel>

      <Callout tone="info" title="Notes on the published code">
        <p>
          All three snippets are used as printed and type-check against the
          installed <code>@copilotkit/react-core</code>. The page names{" "}
          <code>my-link</code> and <code>my-heading</code> but ships no CSS for
          them, so the first example is only visible in DevTools. The page
          prints no backend code — any chat agent serves it — so the{" "}
          <code>chat-markdown</code> agent is a plain Quickstart-shaped Strands
          agent written for this repo (README §9.22).
        </p>
      </Callout>
    </>
  );
}
