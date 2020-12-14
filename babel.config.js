module.exports = function (api) {
  api.cache(true);

  return {
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
