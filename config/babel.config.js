/**
 * 单纯的一个配置文件 和 babel.config.js 配置格式不相关
 * 在 webpack.config.js 中引入使用
 */
module.exports = {
  cacheDirectory: true,
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
