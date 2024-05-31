/*** webpack.config.js ***/
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { merge } = require("webpack-merge");
const baseConfig = require("./config/webpack.base.js"); // 公共配置

module.exports = {
  // inline-source-map 是定位问题源文件代码
  devtool: "inline-source-map",
  // 导出的入口 用来指明你要打包的文件
  entry: "./src/lib/button.js",
  // 模式配置 指定环境
  mode: "development",
  // 导出的出口 即输出 配置文件
  output: {
    // 文件名
    filename: "index.js",
    // 文件位置 （很重要的概念）但默认就行
    path: path.resolve(__dirname, "dist"),
    clean: true,
    // 生成的库的全局变量的名字
    library: "MyButton", // 替换为你希望暴露的库名称
    // umd 通用模式 可以其他方式来解决
    libraryTarget: "umd", // 可以让你的库在 CommonJS, AMD 和全局变量使用
    // 配置
    // umdNamedDefine: true,
    // 设置全局对象 即全局进行引用
    globalObject: "this", // 让你的库在不同环境下都能正常使用
  },
  module: {
    // 转换规则
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
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
    ],
  },
  // 配置插件,对打包文件进行其他操作
  // plugins: [htmlWebpackPlugin],

  // 对支持的文件扩展名
  resolve: {
    extensions: [".js", ".jsx"],
  },
  // 本地服务启动设置
  devServer: {
    // 端口设置
    port: 3001,
    // 指定启动服务的目录
    // static: "./dist",
  },
  // 排除一些不必要的依赖
  // externals: {
  //   react: {
  //     commonjs: "react",
  //     commonjs2: "react",
  //     amd: "React",
  //     root: "React",
  //   },
  //   "react-dom": {
  //     commonjs: "react-dom",
  //     commonjs2: "react-dom",
  //     amd: "ReactDOM",
  //     root: "ReactDOM",
  //   },
  // },
  // 多入口的配置要开启
  //   optimization: {
  //     runtimeChunk: "single",
  //   },
};

// module.exports = {
//   // inline-source-map 是定位源文件代码
//   // devtool: "inline-source-map",
//   // 入口文件,即要转换的文件
//   entry: path.join(__dirname, "examples/index.js"),

//   // 出口文件
//   // output: {
//   //   // 转换出的文件名
//   //   filename: "index.js",
//   //   // 输出到的文件目录
//   //   path: path.resolve(__dirname, "dist"),
//   //   // 输出前进行清理
//   //   clean: true,
//   //   library: {
//   //     name: "MyButton",
//   //     type: "umd",
//   //   },
//   //   publicPath: "/dist",
//   // },
//   // 环境模式配置
//   mode: "development",
//   module: {
//     // 关于文件转换的规则
//     rules: [
//       {
//         test: /\.(ts|tsx)$/,
//         use: "ts-loader",
//         exclude: /node_modules/,
//       },
//       {
//         test: /\.(js|jsx)$/,
//         use: "babel-loader",
//         exclude: /node_modules/,
//       },
//       {
//         test: /\.css$/i,
//         use: ["style-loader", "css-loader"],
//       },
//       //   图片转换
//       {
//         test: /\.(png|svg|jpg|jpeg|gif)$/i,
//         type: "asset/resource",
//       },
//       //   字体转换
//       {
//         test: /\.(woff|woff2|eot|ttf|otf)$/i,
//         type: "asset/resource",
//       },
//     ],
//   },
//   resolve: {
//     extensions: [".js", ".jsx", ".ts", ".tsx"], // 支持的文件扩展名
//   },
//   plugins: [htmlWebpackPlugin],

//   externals: {
//     react: {
//       commonjs: "react",
//       commonjs2: "react",
//       amd: "React",
//       root: "React",
//     },
//     "react-dom": {
//       commonjs: "react-dom",
//       commonjs2: "react-dom",
//       amd: "ReactDOM",
//       root: "ReactDOM",
//     },
//   },
// };
