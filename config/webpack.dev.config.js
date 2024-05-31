const path = require("path");
const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.base.config.js"); // 公共配置
const HtmlWebpackPlugin = require("html-webpack-plugin");

const htmlWebpackPlugin = new HtmlWebpackPlugin({
  // template: path.join(__dirname, "src/index.html"),
  filename: "./index.html",
});
const devConfig = {
  mode: "development", // 开发模式
  entry: path.join(__dirname, "../src/index.js"), // 入口，处理资源文件的依赖关系
  output: {
    path: path.join(__dirname, "../dev"),
    filename: "dev.js",
  },
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /.less$/,
        exclude: /.min.css$/,
        use: [
          { loader: "style-loader" },
          {
            loader: "css-loader",
            options: {
              modules: {
                namedExport: false,
                localIdentName: "[local]_[hash:base64:5]",
              },
            },
          },
          "postcss-loader",
          { loader: "less-loader" },
        ],
      },
      {
        test: /.min.css$/,
        use: [{ loader: "style-loader" }, { loader: "css-loader" }],
      },
    ],
  },
  devServer: {
    static: path.join(__dirname, "../dev"),
    compress: true,
    // open: true, // 打开浏览器
  },
  plugins: [htmlWebpackPlugin],
};
module.exports = merge(devConfig, baseConfig); // 合并配置
