const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const env = process.env.NODE_ENV
const isDev = process.env.NODE_ENV === 'development'

const config = {
  entry: {
    browser: './source/index.js',
    node: './source/index-node.js',
  },
  output: {
    path: path.resolve(__dirname, 'packages'),
    filename: '[name]/dist/index.js',
    globalObject: 'this',
    libraryTarget: 'umd'
  },
  mode: 'production',
  module: {
    rules: []
  },
  externals: {
    'fs': 'fs',
    'canvas': 'canvas',
    'sqlite3': 'sqlite3',
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: __dirname + '/source/mold',
          to: __dirname + '/packages/browser/dist/mold'
        },
        {
          from: __dirname + '/source/config',
          to: __dirname + '/packages/browser/dist/config'
        },
        {
          from: __dirname + '/source/types',
          to: __dirname + '/packages/browser/dist/types'
        },
      ]
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: __dirname + '/source/mold',
          to: __dirname + '/packages/node/dist/mold'
        },
        {
          from: __dirname + '/source/config',
          to: __dirname + '/packages/node/dist/config'
        },
        {
          from: __dirname + '/source/types',
          to: __dirname + '/packages/node/dist/types'
        },
      ]
    }),
    // new HtmlWebpackPlugin({
    //   filename: 'dev.html',
    //   template: 'dev.html',
    //   inject: true
    // })
  ]
}


if (isDev) {
  config.devServer = {
    port: 8080,
    host: 'localhost',
    overlay: {
      errors: true
    },
    open: true,
    hot: true
  }
// 添加热更新模块
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.evn': '"development"'  //添加全局变量
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  )
  config.devtool = '#cheap-module-eval-source-map'
}
module.exports = config