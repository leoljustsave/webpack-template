// node
const path = require("path");

// webpack
const webpack = require("webpack");

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
  entry: "./src/index.js",
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
        use: [
          prod && MiniCssExtractPlugin.loader,
          dev && "style-loader",
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ].filter(Boolean),
        exclude: /node_modules/,
      },
      {
        test: /.jsx?$/i,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: [/\.jpe?g$/, /\.png$/],
        loader: require.resolve("url-loader"),
        options: {
          limit: 5000,
          name: prod ? "static/assets/[hash:8].[ext]" : "static/assets/[name].[ext]",
        },
      },
      {
        test: /\.(png|jpg)$/,
        loader: "file-loader",
        options: {
          name: prod ? "static/assets/[hash:8].[ext]" : "static/assets/[name].[ext]",
        },
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
      template: "./public/index.html",
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
