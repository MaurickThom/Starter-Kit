// Libraries
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const postcssPresetEnv = require("postcss-preset-env");
const { HotModuleReplacementPlugin ,WatchIgnorePlugin} = require('webpack')
// Files
const utils = require('./utils')
const env = process.env.NODE_ENV;
// Configuration
module.exports = {
  // context: path.resolve(__dirname, '../src'),
  entry: {
    app: './src/main.js'
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/',
    filename: 'js/[name].[hash:7].bundle.js'
  },
  devServer: {
    contentBase: path.resolve(__dirname, '../src'),
    hot: true,
    compress: true,
    open: true,
    port: 4200,
    host: "localhost",
    overlay: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
    },
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      source: path.resolve(__dirname, '../src'), // Relative path of src
      images: path.resolve(__dirname, '../src/img'), // Relative path of images
      // fonts: path.resolve(__dirname, '../src/fonts'), // Relative path of fonts
    }
  },

  /*
    Loaders with configurations
  */
  module: {
    rules: [{
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ["@babel/preset-env"]
          }
        }]
      },
      {
        test: /\.css$/,
        use: [
          env === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              sourceMap: true,
              minimize: true,
              colormin: false,
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          env === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader, // creates style nodes from JS strings
          {
            loader: 'css-loader'
          },
          {
              loader: "sass-loader"
          },
          {
              loader: "postcss-loader",
              options: {
                  ident: "postcss",
                  plugins: () => [
                      postcssPresetEnv({
                          browsers: "last 2 versions",
                          autoprefixer: {
                              grid: true,
                              cascade: false
                          },
                          stage: 3,
                          features: {
                              "nesting-rules": true
                          }
                      })
                  ]
              }
          }
        ],
      },
      {
        test: /\.pug$/,
        use: [{
          loader: 'pug-loader'
        }]
      },
      {
        test: /\.(png|jpe?g|gif|svg|ico)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 3000,
          name: 'img/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 5000,
          name: 'fonts/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(mp4)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'videos/[name].[hash:7].[ext]'
        }
      }
    ]
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
      }),
    ],
    splitChunks: {
      cacheGroups: {
        default: false,
        vendors: false,
        // vendor chunk
        vendor: {
          filename: 'js/vendor.[hash:7].bundle.js',
          // sync + async chunks
          chunks: 'all',
          // import file path containing node_modules
          test: /node_modules/
        }
      }
    }
  },

  plugins: [
    new WatchIgnorePlugin([
        path.join(__dirname, "node_modules")
    ]),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash:7].bundle.css',
      chunkFilename: '[id].css',
    }),

    /*
      Pages
    */

    // // Desktop page
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/pug/pages/index.pug',
      inject: true
    }),

    ...utils.pages(env),
    ...utils.pages(env, 'blog'),
    new WebpackNotifierPlugin({
      title: 'Your project'
    })
  ]
}
