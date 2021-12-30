const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const env = process.env.NODE_ENV
const isDev = process.env.NODE_ENV === 'development'

const config = {
  entry: {
    card: './source/card.js',
    cardNode: './source/cardTools.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
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
          to: __dirname + '/dist/mold'
        },
        {
          from: __dirname + '/source/config',
          to: __dirname + '/dist/config'
        },
        {
          from: __dirname + '/source/types',
          to: __dirname + '/dist/types'
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