"use client";

import { GenerativeUISurface } from "@copilotkit/react-core/v2/generative-ui";

import { PRODUCTS } from "../../_shared/scaffolding";
import { shopUI } from "./catalog";

/**
 * The page's three one-line targets. Each JSX element is verbatim; the
 * surrounding layout and the product picker are harness scaffolding — the
 * page shows the elements, not where they sit.
 */

/** "Limit the components". */
export function LimitedFeatured() {
  return <GenerativeUISurface id="featured" ui={shopUI} components={["ProductGrid", "ProductCard"]} />;
}

/** "Scroll to the surface". */
export function SidebarNotes() {
  return <GenerativeUISurface id="sidebar-notes" autoScroll={false} />;
}

/** "One target for each item". `product` is undefined on the page; the first scaffolding product stands in. */
export function Recommendations() {
  const product = PRODUCTS[0];
  return (
    <GenerativeUISurface
      key={product.id}
      id={`recommendations-${product.id}`}
      description={`The "You might also like" row under ${product.name}. Show related products here. Never include ${product.name} itself.`}
    />
  );
}
