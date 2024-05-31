const path = require("path");
// const { library } = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const htmlWebpackPlugin = new HtmlWebpackPlugin({
  template: path.join(__dirname, "src/index.html"),
  filename: "./index.html",
});
/*** webpack.config.js ***/

module.exports = {
  // inline-source-map 是定位源文件代码
  devtool: "inline-source-map",
  // 入口文件,即要转换的文件
  entry: "./src/index.js",

  output: {
    // 转换出的文件名
    filename: "index.js",
    // 输出到的文件目录
    path: path.resolve(__dirname, "dist"),
    // 输出前进行清理
    clean: true,
  },
  // devServer: {
  //   static: "./dist",
  // },
  // 环境模式配置
  mode: "development",
  module: {
    // 关于文件转换的规则
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      //   图片转换
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      //   字体转换
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
      {
        test: /\.less$/i,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[local]__[hash:base64:5]",
                namedExport: false,
              },
            },
          },
          {
            loader: "less-loader",
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"], // 支持的文件扩展名
  },
  plugins: [htmlWebpackPlugin],
};
