const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const ENV = process.env.NODE_ENV || "development";
const prod = ENV === "production";
const dev = ENV === "development";

module.exports = {
  entry: [path.resolve(__dirname, "./src/main.js")],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "./dist"),
  },
  module: {
    rules: [
      /**
       * 生产环境推荐使用 mini-css-extract-plugin , 避免加载故障
       * 开发环境推荐使用 style-loader , 加快打包
       */
      {
        test: "/.s?css$/i",
        use: [prod ? MiniCssExtractPlugin.loader : "style-loader", "css-loader", "scss-loader"],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "static/css/[contenthash:8].css",
    }),
  ],
};
