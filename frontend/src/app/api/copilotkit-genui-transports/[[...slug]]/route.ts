import {
  CopilotRuntime,
  createCopilotRuntimeHandler,
} from "@copilotkit/runtime/v2";

// The Transports page's `app/api/copilotkit/route.ts`. The page prints only the
// `CopilotRuntime` call, with an `agent` it never defines, and no Strands
// agent anywhere. Kept verbatim, so this route throws a ReferenceError when it
// loads. Harness glue: the imports and the handler.

//#region transports-runtime
const runtime = new CopilotRuntime({
  // @ts-expect-error verbatim doc code: `agent` is never defined on the page (TS2304); throws on load
  agents: { default: agent },
  generativeUI: true,
});
//#endregion

const handler = createCopilotRuntimeHandler({
  runtime,
  basePath: "/api/copilotkit-genui-transports",
});

export const GET = handler;
export const POST = handler;
