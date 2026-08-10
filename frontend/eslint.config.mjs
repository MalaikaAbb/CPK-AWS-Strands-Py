import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Doc code kept exactly as published, including what it fails to import.
    // Shown by a route, never imported by one — see tsconfig.json's matching
    // exclude and src/app/programmatic-control/demo-chat/page.snippet.tsx.
    "**/*.snippet.tsx",
  ]),
]);

export default eslintConfig;
