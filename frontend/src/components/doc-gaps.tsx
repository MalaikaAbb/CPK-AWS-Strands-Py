import { gapsFor, type DocGap, type GapSeverity } from "@/lib/doc-gaps";

/**
 * What the doc page does not say.
 *
 * Every route that has an entry in `ROUTE_GAPS` renders one of these directly
 * under its header, before any "what it demonstrates" prose. That ordering is
 * deliberate: on a page like Tool Call Rendering the chat streams perfectly
 * well, so without this panel the route reads as working when the feature the
 * doc page is about does not exist.
 *
 * Each item is a claim about docs.copilotkit.ai/strands, checked on the
 * doc-sync date. None of them is a claim about AWS Strands.
 */

const SEVERITY: Record<
  GapSeverity,
  { label: string; badge: string; marker: string }
> = {
  blocking: {
    label: "Blocking",
    badge:
      "border-rose-400 bg-rose-100 text-rose-900 dark:border-rose-700 dark:bg-rose-950 dark:text-rose-200",
    marker: "bg-rose-500",
  },
  degraded: {
    label: "Degraded",
    badge:
      "border-amber-400 bg-amber-100 text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200",
    marker: "bg-amber-500",
  },
  note: {
    label: "Note",
    badge:
      "border-slate-400 bg-slate-100 text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300",
    marker: "bg-slate-400",
  },
};

function GapItem({ gap }: { gap: DocGap }) {
  const tone = SEVERITY[gap.severity];
  return (
    <li className="relative pl-5">
      <span
        className={`absolute left-0 top-[0.45rem] h-2 w-2 rounded-full ${tone.marker}`}
        aria-hidden
      />
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${tone.badge}`}
        >
          {tone.label}
        </span>
        <p className="font-medium text-slate-900 dark:text-slate-100">
          {gap.title}
        </p>
      </div>
      <p className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        {gap.detail}
      </p>
      <a
        href={`https://docs.copilotkit.ai${gap.docPath}`}
        target="_blank"
        rel="noreferrer"
        className="mt-1 inline-block text-xs text-slate-500 underline underline-offset-4 hover:text-slate-800 dark:hover:text-slate-200"
      >
        {gap.docPath} ↗
      </a>
    </li>
  );
}

export function DocGaps({ path }: { path: string }) {
  const gaps = gapsFor(path);
  if (gaps.length === 0) return null;

  const blocking = gaps.filter((g) => g.severity === "blocking").length;

  return (
    <section className="rounded-xl border-2 border-rose-300 bg-rose-50/70 dark:border-rose-900 dark:bg-rose-950/30">
      <header className="border-b border-rose-200 px-5 py-3 dark:border-rose-900">
        <h2 className="text-sm font-semibold text-rose-900 dark:text-rose-200">
          ⚠ Doc gaps on this page
        </h2>
        <p className="mt-1 text-sm text-rose-800/90 dark:text-rose-300/90">
          {gaps.length} finding{gaps.length === 1 ? "" : "s"}
          {blocking > 0 && (
            <>
              , {blocking} of which {blocking === 1 ? "blocks" : "block"} the
              feature outright
            </>
          )}
          . Nothing below was filled in by this repo — where the docs stop, so
          does the implementation.
        </p>
      </header>
      <ul className="space-y-4 px-5 py-4">
        {gaps.map((gap) => (
          <GapItem key={gap.id} gap={gap} />
        ))}
      </ul>
    </section>
  );
}
