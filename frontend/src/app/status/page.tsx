import Link from "next/link";

import { StatusBadge } from "@/components/route-header";
import { Panel } from "@/components/ui";
import { ALL_GAPS, ROUTE_GAPS } from "@/lib/doc-gaps";
import { DOCS_ROOT, NAV, demoPath, docUrl } from "@/lib/nav-config";
import { DocSyncedAt } from "@/components/doc-synced-at";

/** Dynamic: the doc-sync readouts below read the snapshot off disk. */
export const dynamic = "force-dynamic";

const SEVERITY_ORDER = { blocking: 0, degraded: 1, note: 2 } as const;

export default function Page() {
  const gapRoutes = Object.entries(ROUTE_GAPS).reduce<Record<string, string[]>>(
    (acc, [route, ids]) => {
      for (const id of ids) (acc[id] ??= []).push(route);
      return acc;
    },
    {},
  );
  const gaps = [...ALL_GAPS].sort(
    (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity],
  );

  return (
    <>
      <header className="border-b border-slate-200 pb-5 dark:border-slate-800">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          Status overview
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-400">
          Every doc page tracked by this harness, its route, and where it stands.
          This mirrors the checklist in the repo README.
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Synced against{" "}
          <a
            href={DOCS_ROOT}
            target="_blank"
            rel="noreferrer"
            className="text-[var(--accent)] underline underline-offset-4"
          >
            the live docs
          </a>{" "}
          on <DocSyncedAt />.
        </p>
      </header>

      {NAV.map((group) => (
        <Panel key={group.title} title={group.title}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[40rem] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800">
                  <th className="pb-2 pr-4 font-medium">Route</th>
                  <th className="pb-2 pr-4 font-medium">Status</th>
                  <th className="pb-2 font-medium">Doc page</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {group.routes.map((route) => (
                  <tr key={route.path} className="align-top">
                    <td className="py-3 pr-4">
                      <Link
                        href={route.path}
                        className="font-medium text-[var(--accent)] underline underline-offset-4"
                      >
                        {route.title}
                      </Link>
                      <p className="mt-0.5 font-mono text-xs text-slate-500">
                        {route.path}
                      </p>
                      {demoPath(route) && (
                        <Link
                          href={demoPath(route)!}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 inline-block text-xs text-slate-500 underline underline-offset-4 hover:text-[var(--accent)]"
                        >
                          demo ↗
                        </Link>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      <StatusBadge status={route.status} />
                      {route.statusNote && (
                        <p className="mt-1 max-w-xs text-xs text-slate-500">
                          {route.statusNote}
                        </p>
                      )}
                    </td>
                    <td className="py-3">
                      <a
                        href={docUrl(route)}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-xs text-slate-600 underline underline-offset-4 dark:text-slate-400"
                      >
                        {route.docPath}
                      </a>
                      {route.offNav && (
                        <p className="mt-1 text-xs text-sky-700 dark:text-sky-400">
                          Resolves, but absent from the doc sidebar.
                        </p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      ))}

      <Panel
        title="Doc-gap ledger"
        description="Every finding this harness records, and which routes it lands on. Each is a statement about the docs, verified on the sync date above."
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[44rem] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800">
                <th className="pb-2 pr-4 font-medium">Severity</th>
                <th className="pb-2 pr-4 font-medium">Finding</th>
                <th className="pb-2 font-medium">Routes affected</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {gaps.map((gap) => (
                <tr key={gap.id} className="align-top">
                  <td className="py-3 pr-4">
                    <span
                      className={
                        gap.severity === "blocking"
                          ? "font-semibold text-rose-700 dark:text-rose-400"
                          : gap.severity === "degraded"
                            ? "font-semibold text-amber-700 dark:text-amber-400"
                            : "text-slate-500"
                      }
                    >
                      {gap.severity}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      {gap.title}
                    </p>
                    <a
                      href={`https://docs.copilotkit.ai${gap.docPath}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-0.5 inline-block font-mono text-xs text-slate-500 underline underline-offset-4"
                    >
                      {gap.docPath}
                    </a>
                  </td>
                  <td className="py-3">
                    {(gapRoutes[gap.id] ?? []).length === 0 ? (
                      <span className="text-xs text-slate-400">—</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {(gapRoutes[gap.id] ?? []).map((r) => (
                          <Link
                            key={r}
                            href={r}
                            className="rounded border border-slate-200 px-1.5 py-0.5 font-mono text-xs text-slate-600 hover:text-[var(--accent)] dark:border-slate-700 dark:text-slate-400"
                          >
                            {r}
                          </Link>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
