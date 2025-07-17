import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";
import js from "@eslint/js";
import { defineConfig } from "eslint/config";

export default defineConfig([
    {
        files: ["**/*.ts"],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                sourceType: "module",
                ecmaVersion: "latest",
            },
        },
        plugins: {
            "@typescript-eslint": tseslint.plugin,
        },
        rules: {
            ...tseslint.configs.recommended.rules,
        },
    },
    prettier,
]);
