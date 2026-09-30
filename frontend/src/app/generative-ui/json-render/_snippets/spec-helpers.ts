/**
 * Repo-authored (not from the docs). The page's `parseSpec` calls these three functions and
 * never defines them. They are written to do what the page says the renderer
 * does: tolerate prose preamble, code fences and half-streamed JSON, then
 * validate each element against the catalog's Zod schemas.
 *
 * Nothing here works around the API mismatch in `json-render-renderer.tsx`.
 * The spec these produce is handed to `<Renderer>` exactly as the page does.
 */

import type { Spec } from "@json-render/react";

import { catalog } from "./registry";

type SpecElement = {
  type: string;
  props?: Record<string, unknown>;
  children?: string[];
};

/**
 * Drops anything before the JSON: a "Here's your dashboard:" preamble and an
 * opening ```json fence. A closing fence (and anything after it) goes too. The
 * closing fence may not have arrived yet mid-stream.
 */
export function stripCodeFencesAndPrelude(content: string): string {
  let text = content;
  const fence = text.match(/```[a-zA-Z]*\s*\n?/);
  if (fence && fence.index !== undefined) {
    text = text.slice(fence.index + fence[0].length);
    const close = text.indexOf("```");
    if (close !== -1) text = text.slice(0, close);
  }
  const start = text.indexOf("{");
  return start === -1 ? "" : text.slice(start);
}

/**
 * Parses JSON that may be cut off mid-stream. Tries a straight parse first;
 * if that fails, closes any open string, drops a dangling comma, colon or
 * half-written key, and appends the missing brackets. If the repaired text
 * still does not parse, it backs up to the previous comma and tries again.
 *
 * Returns `undefined` when nothing parseable has arrived yet.
 */
export function tolerantJsonParse(text: string): unknown {
  if (!text.trim()) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    // Fall through to repair.
  }

  let candidate = text;
  for (let attempt = 0; attempt < 50 && candidate.length > 0; attempt++) {
    const repaired = closeOpenStructures(candidate);
    if (repaired !== undefined) {
      try {
        return JSON.parse(repaired);
      } catch {
        // Back up and retry.
      }
    }
    const lastComma = candidate.lastIndexOf(",");
    if (lastComma <= 0) break;
    candidate = candidate.slice(0, lastComma);
  }
  return undefined;
}

function closeOpenStructures(text: string): string | undefined {
  const stack: string[] = [];
  let inString = false;
  let escaped = false;

  for (const ch of text) {
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') inString = true;
    else if (ch === "{") stack.push("}");
    else if (ch === "[") stack.push("]");
    else if (ch === "}" || ch === "]") {
      if (stack.pop() !== ch) return undefined;
    }
  }

  let out = text;
  if (inString) out += '"';
  out = out.replace(/\s+$/, "");
  // A key with no value yet, `{"title"` or `,"title":`. Only in key position:
  // a string after `:` is a finished value and stays.
  if (stack[stack.length - 1] === "}") {
    out = out.replace(/([{,])\s*"[^"]*"\s*:?\s*$/, "$1");
  }
  out = out.replace(/[,:]\s*$/, "");
  return out + stack.reverse().join("");
}

/**
 * Keeps the spec only if it has the `{ root, elements }` shape. Each element
 * whose `type` is in the catalog must pass that entry's `propsSchema`, or it
 * is dropped along with any references to it. Types the catalog does not
 * list — the page's own example uses `Stack` — are passed through, because
 * the catalog has no schema to reject them with.
 *
 * Returns `null` when there is nothing to render yet.
 */
export function validateAgainstCatalog(partial: unknown): Spec | null {
  if (!partial || typeof partial !== "object") return null;
  const { root, elements } = partial as {
    root?: unknown;
    elements?: Record<string, SpecElement>;
  };
  if (typeof root !== "string" || !elements || typeof elements !== "object") {
    return null;
  }

  const valid: Record<string, SpecElement> = {};
  for (const [id, element] of Object.entries(elements)) {
    if (!element || typeof element.type !== "string") continue;
    const entry = catalog[element.type as keyof typeof catalog];
    if (entry) {
      if (!entry.propsSchema.safeParse(element.props ?? {}).success) continue;
    } else if (!Array.isArray(element.children)) {
      // Not in the catalog and not a container: most often a type name that
      // is still streaming in ("MetricCar").
      continue;
    }
    valid[id] = element;
  }

  for (const element of Object.values(valid)) {
    if (Array.isArray(element.children)) {
      element.children = element.children.filter((child) => child in valid);
    }
  }

  // Typed as the library's `Spec` so this helper adds no type error of its
  // own; the only errors on the renderer line are the doc's.
  return valid[root] ? ({ root, elements: valid } as Spec) : null;
}
