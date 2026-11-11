"use client";

// "Dark mode" — the page's script, verbatim. The page puts it in <head>; this
// harness cannot edit the shared layout, so it renders in the demo body. It
// runs on a full page load (server-rendered HTML) but not after a client-side
// navigation, so reload the demo to test it.
const colorSchemeScript = `(() => {
  const media = matchMedia("(prefers-color-scheme: dark)");
  const apply = () => document.documentElement.classList.toggle("dark", media.matches);
  apply();
  media.addEventListener("change", apply);
})();`;

export function ColorSchemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: colorSchemeScript }} />;
}
