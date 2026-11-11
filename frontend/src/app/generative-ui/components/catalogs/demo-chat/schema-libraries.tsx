// "Pick a schema library". The page prints two `props:` lines, one per tab,
// not a catalog; the catalog around them is repo-authored scaffolding so each
// line can be used by a real component. The two `props` values are verbatim.
//
// No layout container is added: a surface has one root, so asking for both
// cards at once may fail (the agent tends to nest one card in the other).
import { z } from "zod";
import * as v from "valibot";
import { toStandardJsonSchema } from "@valibot/to-json-schema";
import { createGenerativeUI } from "@copilotkit/react-core/v2/generative-ui";

import { ScaffoldProductCard } from "../../_shared/scaffolding";

export const schemaLibrariesUI = createGenerativeUI({
  id: "harness/schema-libraries@1",
  components: {
    ZodProductCard: {
      component: ScaffoldProductCard,
      description: "A product, with its props declared in zod.",
      props: z.object({ name: z.string(), price: z.number() }),
    },
    ValibotProductCard: {
      component: ScaffoldProductCard,
      description: "A product, with its props declared in Valibot.",
      props: toStandardJsonSchema(v.object({ name: v.string(), price: v.number() })),
    },
  },
});
