// "Preprocess with `handler`" snippet from
// https://docs.copilotkit.ai/strands/human-in-the-loop/useInterrupt, verbatim
// between the markers. Type-checked, never rendered: nothing imports it.
// Harness glue: the import. Bare top-level hook calls are kept as printed.
import { useInterrupt } from "@copilotkit/react-core/v2";
// ---- verbatim ----
useInterrupt({
  agentId: "gen-ui-interrupt",
  handler: async ({ event, resolve }) => {
    // @ts-expect-error verbatim doc code: `lookupUserDepartment` is never defined on the page (TS2304)
    const dept = await lookupUserDepartment();
    if (event.value.accessDepartment === dept || dept === "admin") {
      resolve({ code: "AUTH_BY_DEPARTMENT" });
      return; // agent will resume; card unmounts when the run starts
    }
    return { dept };
  },
  render: ({ result, event, resolve }) => (
    // @ts-expect-error verbatim doc code: `RequestAccessCard` is never defined on the page (TS2304)
    <RequestAccessCard
      dept={result?.dept}
      onRequest={() => resolve({ code: "REQUEST_AUTH" })}
      onCancel={() => resolve({ code: "CANCEL" })}
    />
  ),
});
// ---- end verbatim ----
