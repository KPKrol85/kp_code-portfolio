export default {
  plugins: [require("postcss-import"), require("cssnano")({ preset: "default" })]
};
