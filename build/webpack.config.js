// node
const path = require("path");

// plugin
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

// const
const ENV = process.env.NODE_ENV || "development";
const prod = ENV === "production";
const dev = ENV === "development";

module.exports = {
  context: path.resolve(__dirname, "./src"),
  entry: ["./index.js"],
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
        test: /.s?css$/i,
        use: [prod && MiniCssExtractPlugin.loader, dev && "style-loader", "css-loader", "scss-loader"],
        exclude: /node_modules/,
      },
      {
        test: /.js$/i,
        use: ["babel-loader"],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "static/css/[contenthash:8].css",
      chunkFilename: "static/css/[contenthash:8].chunk.css",
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./public/index.html"),
    }),
    dev && new webpack.HotModuleReplacementPlugin({}),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        exclude: /node_modules/,
      }),
    ],
  },
};
