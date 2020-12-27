const path = require("path");

const portfinder = require("portfinder");

// 获取可使用的空闲端口号
exports.getRightPort = async (basePort = 8000) => {
  portfinder.basePort = basePort;

  try {
    await portfinder.getPortPromise();
  } catch {
    throw new Error("> portfinder lib has some trouble during find nice port");
  }
};

// 获取多页面配置信息
const glob = require("glob");
const HtmlWebpackPlugin = require("html-webpack-plugin");
exports.getMPAInfo = (pluginOption) => {
  if (!pluginOption) throw new Error("getMPAInfo need pluginOption arg");

  console.info("=> 启用多页面打包配置 , 信息收集中 ...");

  const entrys = {};
  const htmls = [];

  const entryFiles = glob.sync(path.join(__dirname, "../pages/*/index.jsx"));
  entryFiles.forEach((item) => {
    const pageName = item.match(/src\/pages\/(.*)\/index\.jsx$/)[1];
    entrys[pageName] = item;
    htmls.push(new HtmlWebpackPlugin({ ...pluginOption, filename: `${pageName}.html`, chunks: [pageName] }));
  });

  return { entrys, htmls };
};
