module.exports = [
  {
    ignores: ["**/node_modules/**", "**/.next/**", "**/out/**"],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}", "next.config.js"],
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
      "react": require("eslint-plugin-react"),
      "react-hooks": require("eslint-plugin-react-hooks"),
      "import": require("eslint-plugin-import"),
      "@next/eslint-plugin-next": require("@next/eslint-plugin-next"),
    },
    languageOptions: {
      parser: require.resolve("@typescript-eslint/parser"),
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        ecmaFeatures: { jsx: true },
        project: "./tsconfig.json",
      },
    },
    rules: {
      ...require("@next/eslint-plugin-next").configs.recommended.rules,
      ...require("eslint-plugin-react").configs.recommended.rules,
      ...require("eslint-plugin-react-hooks").configs.recommended.rules,
      ...require("@typescript-eslint/eslint-plugin").configs.recommended.rules,
      ...require("eslint-plugin-import").configs.recommended.rules,
    },
    settings: {
      react: { version: "detect" },
    },
  },
]; 