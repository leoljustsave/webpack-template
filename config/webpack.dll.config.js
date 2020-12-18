const path = require("path");

const { DllPlugin } = require("webpack");

module.exports = {
  entry: {
    vendor: ["react", "react-dom"],
  },
  output: {
    path: path.join(__dirname, "../config/vendor"),
    filename: "vendor.bundle.js",
    library: "vendor_lib",
  },
  plugins: [
    new DllPlugin({
      name: "vendor_lib",
      context: __dirname,
      path: path.resolve(__dirname, "./manifest.json"),
    }),
  ],
};
