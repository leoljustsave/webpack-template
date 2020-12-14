module.exports = function (api) {
  api.cache(true);

  return {
    presets: ["@babel/preset-react"],
    plugins: [
      [
        "@babel/plugin-transform-runtime",
        {
          corejs: 3,
        },
      ],
    ],
  };
};
