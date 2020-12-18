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
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

// const
const ENV = process.env.NODE_ENV || "development";
const PROD_MODE = ENV === "production";
const DEV_MODE = ENV === "development";
const ANALYZER_MODE = false && DEV_MODE;
const SOURCE_MAP = PROD_MODE ? false : true;

// function
const getStyleLoaders = (cssOption) => {
  const loaders = [
    // 生产环境推荐使用 mini-css-extract-plugin , 避免加载故障
    // 开发环境推荐使用 style-loader , 加快打包
    PROD_MODE && MiniCssExtractPlugin.loader,
    DEV_MODE && "style-loader",
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
  mode: ENV,
  entry: "./src/index.js",
  output: {
    filename: "static/js/[name].[contenthash:8].js",
    path: path.resolve(__dirname, "../dist"),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../src"),
    },
    extensions: [".js"],
  },
  module: {
    strictExportPresence: true,
    rules: [
      { parser: { requireEnsure: false } },
      // babel-loader 自带 jsx 处理
      // babel-loader 通过 root 下 babel.config.js 进行配置
      {
        test: /\.m?jsx?$/i,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        exclude: /node_modules/,
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
                  // 解决导入本地图片异常
                  // https://blog.csdn.net/Piconjo/article/details/105855172
                  esModule: false,
                },
              },
              {
                loader: "sass-loader",
                options: {
                  sassOptions: { sourceMap: true, sourceMapContents: false },
                  implementation: require("sass"),
                },
              },
            ],
            exclude: /node_modules/,
          },
          // url-loader 可将体积小于 limit 的目标文件转化为 base64 内嵌存储
          {
            test: [/\.jpe?g$/, /\.png$/, /\.svg/],
            loader: require.resolve("url-loader"),
            options: {
              limit: 1024 * 10,
              name: PROD_MODE ? "static/assets/[hash:8].[ext]" : "static/assets/[name].[ext]",
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
    DEV_MODE && new HotModuleReplacementPlugin({}),
    ANALYZER_MODE &&
      new BundleAnalyzerPlugin({
        analyzerPort: "8001",
      }),
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
        canPrint: PROD_MODE,
      }),
    ],
    splitChunks: {
      chunks: "all",
      name: false,
    },
    runtimeChunk: { name: (entrypoint) => `runtimechunk~${entrypoint.name}` },
  },
  devServer: {
    hot: true,
    compress: true,
    port: 8000,
  },
  // 当出错时直接失败 , 而不是容忍
  bail: PROD_MODE,
  performance: {
    hints: PROD_MODE ? false : "warning",
  },
};
