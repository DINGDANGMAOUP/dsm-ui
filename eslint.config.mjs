import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      "react/jsx-curly-brace-presence": ["error", { props: "never", children: "never" }],
      "react/self-closing-comp": ["error", { component: true, html: true }],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "object",
            "type",
          ],
          pathGroups: [{ pattern: "{react,react-dom/**}", group: "builtin", position: "before" }],
          pathGroupsExcludedImportTypes: ["react", "react-dom/**"],
          alphabetize: { order: "asc" },
        },
      ],
    },
  },
];

export default eslintConfig;
