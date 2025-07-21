// eslint.config.js
import js from "@eslint/js";
import globals from "globals";
import tseslint from "@typescript-eslint/eslint-plugin";
import parser from "@typescript-eslint/parser";
import { configs as tsConfigs } from "@typescript-eslint/eslint-plugin";
import { defineConfig } from "eslint/config";
import prettier from "eslint-config-prettier";

export default defineConfig([
    {
        files: ["**/*.ts"],
        languageOptions: {
            parser: parser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
            },
            globals: globals.node,
        },
        plugins: {
            "@typescript-eslint": tseslint,
        },
        rules: {
            ...tsConfigs.recommended.rules,
            "@typescript-eslint/no-unused-vars": "warn",
        },
    },
    js.configs.recommended,
    prettier,
]);
