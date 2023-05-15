/* eslint-disable */
const HTMLWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

const config = (env, argv) => {
  const isWebpackServe = !!argv.env.WEBPACK_SERVE;
  const isWebpackWatch = !!argv.env.WEBPACK_WATCH;
  const isProduction = argv.mode === "production";
  const fileName = isProduction ? "[name].[contenthash]" : "[name]";
  const docSiteRoot = isWebpackServe || isWebpackWatch ? "/" : "/";

  return {
    devServer: {
      port: 3001,
    },
    entry: { app: "./src/index.tsx" },
    module: {
      rules: [
        { test: /\.tsx?$/, use: "ts-loader" },
        {
          test: /\.txt/,
          type: "asset/source",
        },
        {
          test: /\.json/,
          type: "asset/source",
        },
        {
          sideEffects: true,
          test: /\.css/,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
    node: {
      global: false,
    },
    optimization: {
      chunkIds: isProduction ? undefined : "named",
    },
    output: {
      chunkFilename: `${fileName}.js`,
      filename: `${fileName}.js`,
      path: path.resolve("./docs"),
      publicPath: `.${docSiteRoot}`,
    },
    plugins: [
      new HTMLWebpackPlugin({
        chunks: ["app"],
        filename: "index.html",
        template: "./src/index.html",
        templateParameters: {
          docSiteAssetRelativePath: "..",
          docSiteRoot: docSiteRoot,
        },
      }),
      // new BundleAnalyzerPlugin({
      //   openAnalyzer: false,
      // }),
    ],
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx", ".html"],
      extensionAlias: {
        ".js": [".ts", ".js"],
        ".mjs": [".mts", ".mjs"],
      },
    },
    target: "web",
  };
};

module.exports = config;
