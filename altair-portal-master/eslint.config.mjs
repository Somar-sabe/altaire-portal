import { defineConfig } from "eslint/config";
import next from "eslint-config-next";

export default defineConfig([{
    // GPT-Codex (G) BEGIN: keep generated Playwright/build artifacts out of ESLint scans.
    ignores: [
        ".next/**",
        "node_modules/**",
        "playwright-report/**",
        "test-results/**",
        "coverage/**"
    ],
    // GPT-Codex (G) END: lint gate now stays focused on source and test files.
    extends: [...next],
    rules: {
        "react-hooks/set-state-in-effect": "off",
        "react-hooks/exhaustive-deps": "off",
        "react/no-unescaped-entities": "off"
    }
}]);
