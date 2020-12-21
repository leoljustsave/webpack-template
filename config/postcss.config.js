/**
 * 单纯的一个配置文件 和 postcss.config.js 配置格式不相关
 * 在 webpack.config.js 中引入使用
 */
module.exports = {
  plugins: [
    [
      "postcss-preset-env",
      {
        browsers: ["last 2 versions", "<1%"],
        autoprefixer: {
          flexbox: "no-2009",
          grid: true,
        },
      },
    ],
    "postcss-flexbugs-fixes",
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
