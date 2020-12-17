module.exports = {
  plugins: [
    "postcss-flexbugs-fixes",
    [
      "postcss-preset-env",
      {
        autoprefixer: {
          flexbox: "no-2009",
          grid: true,
        },
        stage: 3,
      },
    ],
    [
      "postcss-normalize",
      {
        forceImport: "sanitize.css",
      },
    ],
    [
      "postcss-px-to-viewport",
      {
        viewportWidth: 375, // 视图大小
        viewportUnit: "vw", // 视图单位
        unitToConvert: "px", // 需转换的单位
        unitPrecision: 3, // 转换后小数点位数
      },
    ],
  ],
};
