const path = require('path');
const webpack = require('webpack')
const FontelloPlugin = require("fontello-webpack-plugin")
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier')

module.exports = {
  outputDir: 'dist',
  publicPath: 'panel',
  assetsDir: '',
  indexPath: 'index.html',
  runtimeCompiler: true,
  pages: {
    index: {
      // entry for the page
      entry: './src/app.js',
      // the source template
      template: 'public/index.html',
      // output as dist/index.html
      filename: 'index.html',
    },
  },
  css: {
    modules: true,
    sourceMap: process.env.NODE_ENV !== 'production',
  },
  lintOnSave: process.env.NODE_ENV !== 'production',
  devServer: {
    hot: true,
    disableHostCheck: true,
    sockPort: process.env.APP_CLIENT_PORT,
    // sockHost: 'my.analiz360.ir',
    overlay: {
      warnings: false,
      errors: false,
    },
  },
  pwa: {
    manifestPath: 'public/manifest.json',
    workboxPluginMode: 'GenerateSW',
    workboxOptions: {
      // swSrc: 'public/service-worker.js',
      swDest: 'service-worker.js',
      clientsClaim: true,
      skipWaiting: true,
    },
  },
  configureWebpack: {
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    },
    resolve: {
      alias: {
        icons: path.resolve(__dirname, 'node_modules/vue-material-design-icons'),
      },
    },
    plugins: [
      new WebpackNotifierPlugin(),
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        title: 'Output Management',
        filename: 'public/index.html'
      }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new FontelloPlugin({
        configPath: "./fontello.config.json",
        config: "./fontello.config.json",
        output: {
          css: 'fontello.css',
        }
      })
    ],
  },
};
