"use client";

import { exportA2UICatalog } from "@copilotkit/react-core/v2/generative-ui";

import { useCart } from "../../_shared/scaffolding";
import { callersUI } from "./declarations";
import { CartActions } from "./functions-catalog";
import { CartState } from "./state-catalog";

/**
 * Harness scaffolding: the app around each published hook. The page shows
 * the hooks mounted with a `cart`; where that cart lives and how the page
 * changes it are not on the page.
 */

/** App state (bind): CartState pushes the cart (empty until something adds to it). */
export function StateSection() {
  const cart = useCart();
  return <CartState cart={cart} />;
}

/** Functions (click): CartActions handles the card's onAddToCart. */
export function FunctionsSection() {
  const cart = useCart();
  return <CartActions cart={cart} />;
}

/** Who may call a function: no chat, the declarations as exported. */
export function DeclarationsSection() {
  const catalog = exportA2UICatalog(callersUI);
  return (
    <div className="text-xs">
      <p className="font-semibold">
        exportA2UICatalog(callersUI).functions — addToCart, track, reload
      </p>
      <pre className="mt-1 max-h-[70vh] overflow-auto rounded bg-slate-100 p-2 dark:bg-slate-900">
        {JSON.stringify(
          Object.fromEntries(
            ["addToCart", "track", "reload"].map((k) => [k, catalog.functions[k]]),
          ),
          null,
          2,
        )}
      </pre>
    </div>
  );
}
