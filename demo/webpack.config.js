const webpack = require("webpack");

module.exports = {
  entry: ["babel-polyfill", "./src/application.jsx"],

  output: {
    filename: "application.js",
    path: __dirname
  },

  resolve: {
    extensions: ["", ".js", ".jsx"]
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules\/(?!chunked-request)|bower_components)/,
        loader: "babel",
        query: {
          presets: ["react", "es2015"]
        },
      },
    ]
  },

  devtool: "cheap-module-eval-source-map",
  devServer: {
    contentBase: __dirname,
    hot: true,
    inline: true,
    progress: true,
    stats: "errors-only",
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
};
