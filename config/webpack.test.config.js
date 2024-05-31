/*** webpack.config.js ***/
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.base.config.js"); // 公共配置

const testConfig = {
  // inline-source-map 是定位问题源文件代码
  devtool: "inline-source-map",
  // 导出的入口 用来指明你要打包的文件
  entry: path.join(__dirname, "../test/index.js"),
  // 模式配置 指定环境
  mode: "development",
  // 导出的出口 即输出 配置文件
  output: {
    // 文件名
    filename: "index.js",
    // 文件位置 （很重要的概念）但默认就行
    path: path.resolve(__dirname, "../test"),
    clean: true,
    // 生成的库的全局变量的名字
    // umd 通用模式 可以其他方式来解决
    libraryTarget: "umd", // 可以让你的库在 CommonJS, AMD 和全局变量使用
    // 配置
    // umdNamedDefine: true,
    // 设置全局对象 即全局进行引用
    globalObject: "this", // 让你的库在不同环境下都能正常使用
  },
  // 配置插件,对打包文件进行其他操作
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "../test/index.html"),
    }),
  ],
  // 对支持的文件扩展名
  // 本地服务启动设置
  devServer: {
    // 端口设置
    port: 3001,
    // 指定启动服务的目录
    // static: "../test",
  },
};
module.exports = merge(baseConfig, testConfig);
