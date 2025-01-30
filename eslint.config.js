import eslintPluginVue from "eslint-plugin-vue";
import js from "@eslint/js";
import vueEslintParser from "vue-eslint-parser";

export default [
  {
    files: ["**/*.{vue,js,jsx,cjs,mjs}"],
    languageOptions: {
      parser: vueEslintParser,
      sourceType: "module",
    },
    plugins: {
      vue: eslintPluginVue,
    },
    rules: {
      "vue/multi-word-component-names": "off",
      "vue/no-unused-vars": "warn",
      "no-console": "warn",
      "no-debugger": "warn",
      "eqeqeq": ["error", "always"],
      "semi": ["error", "always"],
      "quotes": ["error", "double"],
      "indent": ["error", 2],
    },
  },
];
