// "Multi-interrupt behavior" snippet from
// https://docs.copilotkit.ai/strands/human-in-the-loop/useInterrupt, verbatim
// between the markers. Type-checked, never rendered: nothing imports it.
// Harness glue: the import. Bare top-level hook calls are kept as printed.
import { useInterrupt } from "@copilotkit/react-core/v2";
// ---- verbatim ----
useInterrupt({
  render: ({ interrupts, resolve, cancel }) => (
    <ul>
      {interrupts.map((i) => (
        <li key={i.id}>
          {i.message}
          <button onClick={() => resolve({ ok: true }, i.id)}>Approve</button>
          <button onClick={() => cancel(i.id)}>Cancel</button>
        </li>
      ))}
    </ul>
  ),
});
// ---- end verbatim ----
