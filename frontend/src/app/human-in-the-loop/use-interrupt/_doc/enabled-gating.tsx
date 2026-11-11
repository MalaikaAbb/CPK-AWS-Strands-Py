// "Multiple interrupts? Add a type and gate with `enabled`" snippet from
// https://docs.copilotkit.ai/strands/human-in-the-loop/useInterrupt, verbatim
// between the markers. Type-checked, never rendered: nothing imports it.
// Harness glue: the import. Bare top-level hook calls are kept as printed.
import { useInterrupt } from "@copilotkit/react-core/v2";
// ---- verbatim ----
useInterrupt({
  agentId: "gen-ui-interrupt",
  enabled: (event) => event.value.type === "ask",
  render: ({ event, resolve }) => (
    // @ts-expect-error verbatim doc code: `AskCard` is never defined on the page (TS2304)
    <AskCard question={event.value.content} onAnswer={resolve} />
  ),
});

useInterrupt({
  agentId: "gen-ui-interrupt",
  enabled: (event) => event.value.type === "approval",
  render: ({ event, resolve }) => (
    // @ts-expect-error verbatim doc code: `ApproveCard` is never defined on the page (TS2304)
    <ApproveCard content={event.value.content} onAnswer={resolve} />
  ),
});
// ---- end verbatim ----
