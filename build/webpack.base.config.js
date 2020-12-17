// node
const path = require("path");

// webpack
const { HotModuleReplacementPlugin } = require("webpack");

// plugin
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const safePostCssParser = require("postcss-safe-parser");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

// const
const ENV = process.env.NODE_ENV || "development";
const prod = ENV === "production";
const dev = ENV === "development";
const SOURCE_MAP = prod ? false : true;

console.log("dev: ", dev);

// function
const getStyleLoaders = (cssOption) => {
  const loaders = [
    prod && MiniCssExtractPlugin.loader,
    dev && "style-loader",
    {
      loader: "css-loader",
      options: cssOption,
    },
    "postcss-loader",
  ].filter(Boolean);

  return loaders;
};

module.exports = {
  target: "browserslist",
  entry: "./src/index.js",
  output: {
    filename: prod ? "static/js/bundle.js" : "static/js/[name].[contenthash:8].js",
    path: path.resolve(__dirname, "../dist"),
  },
  module: {
    strictExportPresence: true,
    rules: [
      { parser: { requireEnsure: false } },
      // 生产环境推荐使用 mini-css-extract-plugin , 避免加载故障
      // 开发环境推荐使用 style-loader , 加快打包
      {
        oneOf: [
          {
            test: /\.css$/i,
            use: getStyleLoaders(),
            exclude: /node_modules/,
          },
          {
            test: /\.s[ac]ss$/i,
            use: [
              ...getStyleLoaders({ sourceMap: SOURCE_MAP }),
              // 配合 sass-loader 使用 , 帮助 sass-loader 找到对应 url 资源
              {
                loader: require.resolve("resolve-url-loader"),
                options: {
                  sourceMap: SOURCE_MAP,
                  root: path.resolve(__dirname, "../src"),
                },
              },
              {
                loader: "sass-loader",
                options: {
                  sassOptions: { sourceMap: true, sourceMapContents: false },
                },
              },
            ],
            exclude: /node_modules/,
          },
          // babel-loader 自带 jsx 处理
          // babel-loader 通过 root 下 babel.config.js 进行配置
          {
            test: /\.jsx?$/i,
            use: "babel-loader",
            exclude: /node_modules/,
          },
          // url-loader 可将体积小于 limit 的目标文件转化为 base64 内嵌存储
          {
            test: [/\.jpe?g$/, /\.png$/],
            loader: require.resolve("url-loader"),
            options: {
              limit: 5000,
              name: prod ? "static/assets/[hash:8].[ext]" : "static/assets/[name].[ext]",
            },
          },
          // 兜底文件 loader
          {
            loader: require.resolve("file-loader"),
            exclude: [/\.(js|jsx|ts|tsx|svelte)$/, /\.html$/, /\.json$/],
            options: {
              name: "static/media/[name].[hash:8].[ext]",
            },
          },
        ],
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
    dev && new HotModuleReplacementPlugin({}),
  ].filter(Boolean),
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        // sourceMap: SOURCE_MAP,
        exclude: /node_modules/,
        parallel: true,
      }),
      // webpack 5 有内建 css minimizer , 使用需要覆盖
      // https://stackoverflow.com/questions/55340291/webpack-not-minifying-js-file-when-optimizecssassetsplugin-is-added-without-it
      new OptimizeCssAssetsPlugin({
        // cssProcessor: require("cssnano"), // 默认为 cssnano , 用于优化并压缩代码 , 使其在生产环境中最优化
        cssProcessorPluginOptions: {
          // cssProcessor option 配置
          // https://cssnano.co/docs/optimisations
          cssProcessor: safePostCssParser, // 默认为 cssnano , 用于优化并压缩代码 , 使其在生产环境中最优化
          preset: ["default", { discardComments: { removeAll: SOURCE_MAP } }],
        },
        canPrint: prod,
      }),
    ],
  },
  devServer: {
    hot: true,
    compress: true,
    port: 8000,
  },
  // 当出错时直接失败 , 而不是容忍
  bail: prod,
  // 一些第三方库加载了 node 模块但是不能在浏览器使用他们
  // 通知 webpack 提供空内容
  // node: {
  //   module: "empty",
  //   dgram: "empty",
  //   dns: "mock",
  //   fs: "empty",
  //   http2: "empty",
  //   net: "empty",
  //   tls: "empty",
  //   child_process: "empty",
  // },
};
