// node
const path = require("path");

// config
const babelConfig = require("./babel.config");
const postcssConfig = require("./postcss.config");

// utils
const { getRightPort } = require("../src/utils/cli");

// webpack
const { HotModuleReplacementPlugin, DllReferencePlugin } = require("webpack");

// functional plugin
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const safePostCssParser = require("postcss-safe-parser");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

// supported plugin
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
// const DashboardPlugin = require("webpack-dashboard/plugin");

// env config
const ENV = process.env.NODE_ENV || "development";
const PROD_MODE = ENV === "production";
const DEV_MODE = ENV === "development";

// option config
const ANALYZER_MODE = true && DEV_MODE;
const SOURCE_MAP = PROD_MODE ? false : true;

// value config
const SERVER_PORT = getRightPort();

// function
const getStyleLoaders = (cssOption) => {
  const loaders = [
    // "thread-loader",
    // 生产环境推荐使用 mini-css-extract-plugin , 避免加载故障
    // 开发环境推荐使用 style-loader , 加快打包
    PROD_MODE && MiniCssExtractPlugin.loader,
    DEV_MODE && "style-loader",
    { loader: "css-loader", options: cssOption },
    { loader: "postcss-loader", options: { postcssOptions: postcssConfig } },
  ].filter(Boolean);

  return loaders;
};

let webpackConfig = {
  mode: ENV,
  target: DEV_MODE ? "web" : "browserslist",
  entry: "./src/index.js",
  output: {
    filename: "static/js/[name].[contenthash:8].js",
    path: path.resolve(__dirname, "../dist"),
  },
  resolve: {
    extensions: [".js", ".jsx", "tsx"],
    alias: {
      "@": path.resolve(__dirname, "../src"),
      pages: path.resolve(__dirname, "../src/pages"),
      assets: path.resolve(__dirname, "../src/assets"),
    },
  },
  module: {
    strictExportPresence: true,
    rules: [
      { parser: { requireEnsure: false } },
      // babel-loader 自带 jsx 处理
      // babel-loader 通过 root 下 babel.config.js 进行配置
      {
        test: /\.m?jsx?$/i,
        use: { loader: "babel-loader", options: babelConfig },
        exclude: /node_modules/,
      },
      {
        test: /\.tsx?$/i,
        use: { loader: "ts-loader" },
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
            test: [/\.(jpe?g|png|gif|svg)$/i],
            loader: require.resolve("url-loader"),
            options: {
              limit: 1024 * 10,
              name: PROD_MODE ? "static/assets/[hash:8].[ext]" : "static/assets/[name].[ext]",
              esModule: false,
            },
          },
          // 兜底文件 loader
          {
            loader: require.resolve("file-loader"),
            exclude: [/\.(js|jsx|ts|tsx|svelte)$/, /\.html$/, /\.json$/],
            options: {
              name: "static/media/[name].[hash:8].[ext]",
              esModule: false,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "static/css/[name].[contenthash:8].css",
      chunkFilename: "static/css/[name].[contenthash:8].chunk.css",
    }),
    DEV_MODE &&
      new DllReferencePlugin({
        context: path.resolve(__dirname),
        manifest: path.join(__dirname, "./manifest.json"),
      }),
    DEV_MODE && new HotModuleReplacementPlugin({}),
    ANALYZER_MODE &&
      new BundleAnalyzerPlugin({
        openAnalyzer: false,
        analyzerPort: "9000",
      }),
    // ANALYZER_MODE &&
    //   new DashboardPlugin({
    //     port: 9001,
    //   }),
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
          // cssProcessor 默认为 cssnano , 用于优化并压缩代码 , 使其在生产环境中最优化
          // cssnano option 配置
          // https://cssnano.co/docs/optimisations
          cssProcessor: { parser: safePostCssParser, map: false },
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
    hot: false,
    compress: true,
    port: 8001,
    host: "0.0.0.0",
  },
  // 当出错时直接失败 , 而不是容忍
  bail: PROD_MODE,
  performance: {
    // hints: PROD_MODE ? false : "warning",
    hints: false,
  },
  devtool: PROD_MODE ? false : "inline-source-map",
};

// speed-measure-plugin 测速
if (DEV_MODE) {
  const smp = new SpeedMeasurePlugin();
  webpackConfig = smp.wrap(webpackConfig);
}

// html-webpack-plugin 直接写在里面会和 speed-measure-webpack-plugin 起冲突
// 考虑是作用域的问题
webpackConfig.plugins.push(
  new HtmlWebpackPlugin(
    Object.assign(
      {},
      DEV_MODE && {
        template: "./public/dev_index.html",
      },
      PROD_MODE && {
        template: "./public/prod_index.html",
        // minify 参数文档
        // https://github.com/terser/html-minifier-terser#options-quick-reference
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        },
      }
    )
  )
);

module.exports = webpackConfig;
