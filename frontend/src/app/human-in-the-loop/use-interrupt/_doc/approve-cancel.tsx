// "Approve / Cancel example" snippet from
// https://docs.copilotkit.ai/strands/human-in-the-loop/useInterrupt, verbatim
// between the markers. Type-checked, never rendered: nothing imports it.
// Harness glue: the import. Bare top-level hook calls are kept as printed.
import { useInterrupt } from "@copilotkit/react-core/v2";
// ---- verbatim ----
function ApprovalInterrupt() {
  useInterrupt({
    render: ({ interrupt, resolve, cancel }) => (
      <div className="p-3 border rounded">
        <p>{interrupt?.message ?? "Approve this action?"}</p>
        <div className="mt-2 flex gap-2">
          <button onClick={() => resolve({ approved: true })}>Approve</button>
          <button onClick={() => cancel()}>Cancel</button>
        </div>
      </div>
    ),
  });
  return null;
}
// ---- end verbatim ----
