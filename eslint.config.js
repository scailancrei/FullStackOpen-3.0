import globals from "globals"

export default [
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  { ignores: ["dist"] },
  {
    rules: {
      eqeqeq: "error",
      "no-trailing-spaces": "error",
      "object-curly-spacing": ["error", "always"],
      "arrow-spacing": ["error", { before: true, after: true }],
    },
  },
]
