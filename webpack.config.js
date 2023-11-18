const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

/** @type {import('webpack').Configuration} */
module.exports = {
  devtool: "source-map",
  devServer: {
    static: {
      directory: path.resolve(__dirname, "dist"),
    },
  },
  entry: {
    main: "./src/main.ts",
    test: "./src/test.ts",
    worker: "./src/worker.ts",
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.m?js$/i,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.ts$/,
        use: "ts-loader",
      },
    ],
  },
  plugins: [
    new NodePolyfillPlugin(),
    new CopyPlugin({
      patterns: [
        {
          context: path.resolve(__dirname, "src"),
          from: path.resolve(__dirname, "src/**/*"),
          globOptions: {
            ignore: ["**/*.ts"],
          },
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      "@": path.join(__dirname, "src"),
    },
    extensions: [".js", ".ts"],
  },
  output: {
    clean: true,
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
};
