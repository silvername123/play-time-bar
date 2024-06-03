const path = require("path");
const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.base.config.js"); // 引用公共的配置
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // 用于将组件的css打包成单独的文件输出到`lib`目录中
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

const prodConfig = {
  mode: "production", // 生产模式
  entry: {
    index: path.join(__dirname, "../src/playTimeBar.tsx"),
  },
  output: {
    path: path.join(__dirname, "../dist/"),
    filename: "index.js",
    libraryTarget: "umd", // 采用通用模块定义
    libraryExport: "default", // 兼容 ES6 Module、CommonJS 和 AMD 模块规范
    library: "play-time-bar", // 打包后的库
    globalObject: "this",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /.css$/,
        exclude: /.min.css$/,
        use: [
          { loader: "style-loader" },
          // { loader: MiniCssExtractPlugin.loader },
          {
            loader: "css-loader",
            options: {
              modules: {
                namedExport: false,
                localIdentName: "[local]_[hash:base64:5]",
              },
            },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  [
                    "postcss-preset-env",
                    {
                      // 其他选项
                    },
                  ],
                ],
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

  plugins: [
    // new ModuleFederationPlugin({
    //   name: "play-time-bar",
    //   filename: ".js",
    //   exposes: {
    //     "./dist/PlayTimeBar": "./src/myc.tsx",
    //   },
    //   shared: {
    //     react: {
    //       singleton: true,
    //       requiredVersion: "^17.0.0",
    //     },
    //     "react-dom": {
    //       singleton: true,
    //       requiredVersion: "^17.0.0",
    //     },
    //     dayjs: {
    //       singleton: true,
    //       requiredVersion: "^1.10.4",
    //     },
    //   },
    // }),
  ],
  externals: {
    // 定义外部依赖，避免把react和react-dom打包进去
    // react: {
    //   root: "React",
    //   commonjs2: "react",
    //   commonjs: "react",
    //   amd: "react",
    // },
    // "react-dom": {
    //   root: "ReactDOM",
    //   commonjs2: "react-dom",
    //   commonjs: "react-dom",
    //   amd: "react-dom",
    // },
    react: "react", // 告诉webpack在打包时不要将react打包到组件中，而是在使用时从外部引入
    "react-dom": "react-dom",
    dayjs: "dayjs",
  },
};
module.exports = merge(baseConfig, prodConfig); // 合并配置
